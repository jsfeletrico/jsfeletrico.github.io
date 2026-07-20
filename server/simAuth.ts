/**
 * Autenticação própria do simulador: e-mail + senha criados pelo administrador.
 * Sessão via cookie JWT assinado com JWT_SECRET (jose).
 * Independente do OAuth do template.
 */
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import type { Request, Response } from "express";

export const SIM_COOKIE_NAME = "jsf_sim_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 dias

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET || "jsf-dev-secret";
  return new TextEncoder().encode(secret + ":sim");
}

/* ---------- senha ---------- */

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

/* ---------- sessão ---------- */

export type SimSession = {
  uid: number;
  email: string;
  role: "user" | "admin";
};

export async function createSessionToken(session: SimSession): Promise<string> {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecret());
}

export async function readSessionToken(token: string | undefined): Promise<SimSession | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.uid !== "number" || typeof payload.email !== "string") return null;
    return {
      uid: payload.uid,
      email: payload.email,
      role: payload.role === "admin" ? "admin" : "user",
    };
  } catch {
    return null;
  }
}

export function getSimCookie(req: Request): string | undefined {
  const raw = req.headers.cookie;
  if (!raw) return undefined;
  const pair = raw
    .split(";")
    .map(s => s.trim())
    .find(s => s.startsWith(`${SIM_COOKIE_NAME}=`));
  return pair?.slice(SIM_COOKIE_NAME.length + 1);
}

export async function getSessionFromRequest(req: Request): Promise<SimSession | null> {
  return readSessionToken(getSimCookie(req));
}

export function setSimSessionCookie(req: Request, res: Response, token: string) {
  const secure = req.protocol === "https" || Boolean(req.headers["x-forwarded-proto"]?.includes("https"));
  res.cookie(SIM_COOKIE_NAME, token, {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS * 1000,
  });
}

export function clearSimSessionCookie(req: Request, res: Response) {
  const secure = req.protocol === "https" || Boolean(req.headers["x-forwarded-proto"]?.includes("https"));
  res.cookie(SIM_COOKIE_NAME, "", {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    path: "/",
    maxAge: -1,
  });
}

export function getClientInfo(req: Request): { ip: string; userAgent: string } {
  const fwd = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim();
  return {
    ip: fwd || req.socket?.remoteAddress || "",
    userAgent: ((req.headers["user-agent"] as string | undefined) || "").slice(0, 500),
  };
}
