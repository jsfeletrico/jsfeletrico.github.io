import { describe, expect, it } from "vitest";
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  readSessionToken,
} from "./simAuth";

describe("simAuth: senha", () => {
  it("gera hash e valida a senha correta", () => {
    const hash = hashPassword("minha-senha-123");
    expect(hash).toContain(":");
    expect(verifyPassword("minha-senha-123", hash)).toBe(true);
  });

  it("rejeita senha incorreta", () => {
    const hash = hashPassword("senha-certa");
    expect(verifyPassword("senha-errada", hash)).toBe(false);
  });

  it("rejeita hash malformado", () => {
    expect(verifyPassword("qualquer", "sem-separador")).toBe(false);
    expect(verifyPassword("qualquer", "")).toBe(false);
  });

  it("gera hashes diferentes para a mesma senha (salt aleatório)", () => {
    const h1 = hashPassword("mesma-senha");
    const h2 = hashPassword("mesma-senha");
    expect(h1).not.toBe(h2);
    expect(verifyPassword("mesma-senha", h1)).toBe(true);
    expect(verifyPassword("mesma-senha", h2)).toBe(true);
  });
});

describe("simAuth: sessão JWT", () => {
  it("cria e lê token de sessão válido", async () => {
    const token = await createSessionToken({ uid: 42, email: "teste@exemplo.com", role: "user" });
    const session = await readSessionToken(token);
    expect(session).not.toBeNull();
    expect(session?.uid).toBe(42);
    expect(session?.email).toBe("teste@exemplo.com");
    expect(session?.role).toBe("user");
  });

  it("preserva papel de admin no token", async () => {
    const token = await createSessionToken({ uid: 1, email: "admin@exemplo.com", role: "admin" });
    const session = await readSessionToken(token);
    expect(session?.role).toBe("admin");
  });

  it("rejeita token inválido ou ausente", async () => {
    expect(await readSessionToken("token-falso")).toBeNull();
    expect(await readSessionToken(undefined)).toBeNull();
    expect(await readSessionToken("")).toBeNull();
  });

  it("rejeita token adulterado", async () => {
    const token = await createSessionToken({ uid: 7, email: "x@y.com", role: "user" });
    const adulterado = token.slice(0, -4) + "abcd";
    expect(await readSessionToken(adulterado)).toBeNull();
  });
});
