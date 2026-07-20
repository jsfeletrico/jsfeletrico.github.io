/**
 * Testes da procedure sim.alterarMinhaSenha:
 * usuário logado troca a própria senha informando a senha atual.
 */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { hashPassword, createSessionToken } from "./simAuth";

const mocks = vi.hoisted(() => ({
  getSimUserById: vi.fn(),
  updateSimUser: vi.fn(),
  logAudit: vi.fn(),
}));

vi.mock("./simDb", () => ({
  getSimUserByEmail: vi.fn(),
  getSimUserById: mocks.getSimUserById,
  listSimUsers: vi.fn(),
  createSimUser: vi.fn(),
  updateSimUser: mocks.updateSimUser,
  deleteSimUser: vi.fn(),
  touchSimUserLogin: vi.fn(),
  logAudit: mocks.logAudit,
  listAudit: vi.fn(),
  createAccessRequest: vi.fn(),
  listAccessRequests: vi.fn(),
  getAccessRequestById: vi.fn(),
  updateAccessRequestStatus: vi.fn(),
  hasRecentRequestFromIp: vi.fn(),
  hasPendingRequestForEmail: vi.fn(),
}));

import { simRouter } from "./simRouter";

async function criarCtxLogado(uid: number, email: string, role: "admin" | "user") {
  const token = await createSessionToken({ uid, email, role });
  const req = {
    headers: { cookie: `jsf_sim_session=${token}`, "user-agent": "vitest" },
    socket: { remoteAddress: "127.0.0.1" },
  } as any;
  const res = { setHeader: vi.fn(), getHeader: vi.fn() } as any;
  return { req, res, user: null } as any;
}

describe("sim.alterarMinhaSenha", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("altera a senha quando a senha atual está correta", async () => {
    const hash = hashPassword("senha-antiga");
    mocks.getSimUserById.mockResolvedValue({
      id: 10,
      email: "user@teste.com",
      passwordHash: hash,
      ativo: 1,
      role: "user",
    });

    const ctx = await criarCtxLogado(10, "user@teste.com", "user");
    const caller = simRouter.createCaller(ctx);
    const out = await caller.alterarMinhaSenha({ senhaAtual: "senha-antiga", novaSenha: "senha-nova-123" });

    expect(out.success).toBe(true);
    expect(mocks.updateSimUser).toHaveBeenCalledWith(10, expect.objectContaining({ passwordHash: expect.stringContaining(":") }));
    expect(mocks.logAudit).toHaveBeenCalledWith(expect.objectContaining({ evento: "trocar_senha" }));
  });

  it("rejeita quando a senha atual está incorreta", async () => {
    const hash = hashPassword("senha-correta");
    mocks.getSimUserById.mockResolvedValue({
      id: 11,
      email: "user2@teste.com",
      passwordHash: hash,
      ativo: 1,
      role: "user",
    });

    const ctx = await criarCtxLogado(11, "user2@teste.com", "user");
    const caller = simRouter.createCaller(ctx);
    await expect(
      caller.alterarMinhaSenha({ senhaAtual: "senha-errada", novaSenha: "senha-nova-123" })
    ).rejects.toThrow(/Senha atual incorreta/);
    expect(mocks.updateSimUser).not.toHaveBeenCalled();
  });

  it("rejeita nova senha com menos de 6 caracteres", async () => {
    const hash = hashPassword("senha-antiga");
    mocks.getSimUserById.mockResolvedValue({
      id: 12,
      email: "user3@teste.com",
      passwordHash: hash,
      ativo: 1,
      role: "user",
    });

    const ctx = await criarCtxLogado(12, "user3@teste.com", "user");
    const caller = simRouter.createCaller(ctx);
    await expect(caller.alterarMinhaSenha({ senhaAtual: "senha-antiga", novaSenha: "abc" })).rejects.toThrow();
    expect(mocks.updateSimUser).not.toHaveBeenCalled();
  });

  it("rejeita quando não está logado", async () => {
    const ctx = {
      req: { headers: {}, socket: { remoteAddress: "127.0.0.1" } },
      res: { setHeader: vi.fn() },
      user: null,
    } as any;
    const caller = simRouter.createCaller(ctx);
    await expect(
      caller.alterarMinhaSenha({ senhaAtual: "x", novaSenha: "senha-nova-123" })
    ).rejects.toThrow();
  });

  it("admin também consegue trocar a própria senha", async () => {
    const hash = hashPassword("admin-antiga");
    mocks.getSimUserById.mockResolvedValue({
      id: 1,
      email: "jsfeletrico@gmail.com",
      passwordHash: hash,
      ativo: 1,
      role: "admin",
    });

    const ctx = await criarCtxLogado(1, "jsfeletrico@gmail.com", "admin");
    const caller = simRouter.createCaller(ctx);
    const out = await caller.alterarMinhaSenha({ senhaAtual: "admin-antiga", novaSenha: "admin-nova-123" });
    expect(out.success).toBe(true);
    expect(mocks.updateSimUser).toHaveBeenCalledWith(1, expect.anything());
  });
});
