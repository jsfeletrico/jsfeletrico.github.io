/**
 * Rota protegida que serve o HTML do simulador apenas para usuários logados.
 * O arquivo fica no storage (S3) e é cacheado em memória após o primeiro acesso.
 */
import type { Express, Request, Response } from "express";
import { ENV } from "./_core/env";
import { getSessionFromRequest } from "./simAuth";
import { getSimUserById, logAudit } from "./simDb";
import { getClientInfo } from "./simAuth";

const SIMULADOR_STORAGE_KEY = "simulador_v1161_e09d7017.html";

let cachedHtml: string | null = null;

async function fetchSimuladorHtml(): Promise<string> {
  if (cachedHtml) return cachedHtml;
  const forgeUrl = new URL(
    "v1/storage/presign/get",
    ENV.forgeApiUrl.replace(/\/+$/, "") + "/",
  );
  forgeUrl.searchParams.set("path", SIMULADOR_STORAGE_KEY);
  const presignResp = await fetch(forgeUrl, {
    headers: { Authorization: `Bearer ${ENV.forgeApiKey}` },
  });
  if (!presignResp.ok) throw new Error(`presign failed: ${presignResp.status}`);
  const { url } = (await presignResp.json()) as { url: string };
  const fileResp = await fetch(url);
  if (!fileResp.ok) throw new Error(`download failed: ${fileResp.status}`);
  cachedHtml = await fileResp.text();
  return cachedHtml;
}

export function registerSimuladorRoute(app: Express) {
  app.get("/api/simulador", async (req: Request, res: Response) => {
    try {
      const session = await getSessionFromRequest(req);
      if (!session) {
        res.status(401).send(paginaBloqueada());
        return;
      }
      const user = await getSimUserById(session.uid);
      if (!user || user.ativo !== 1) {
        res.status(403).send(paginaBloqueada());
        return;
      }

      const html = await fetchSimuladorHtml();
      const { ip, userAgent } = getClientInfo(req);
      // Registro de auditoria sem bloquear a resposta
      void logAudit({
        userId: user.id,
        email: user.email,
        evento: "simulador_carregado",
        ip,
        userAgent,
      });

      res.set("Content-Type", "text/html; charset=utf-8");
      res.set("Cache-Control", "no-store");
      res.send(html);
    } catch (err) {
      console.error("[Simulador] erro ao servir:", err);
      res.status(500).send("Erro ao carregar o simulador. Tente novamente.");
    }
  });
}

function paginaBloqueada(): string {
  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><title>Acesso restrito</title>
<style>body{margin:0;font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center}div{max-width:420px;padding:24px}h1{font-size:1.3rem;color:#38bdf8}</style>
</head><body><div><h1>Acesso restrito</h1><p>Faça login no site para acessar o simulador. Se você ainda não tem cadastro, entre em contato com o administrador pelo e-mail jsfeletrico@gmail.com.</p></div></body></html>`;
}
