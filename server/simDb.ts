/**
 * Helpers de banco para o sistema do simulador:
 * usuários (simUsers) e auditoria (simAuditLog).
 */
import { desc, eq, sql } from "drizzle-orm";
import {
  simUsers,
  simAuditLog,
  simAccessRequests,
  type InsertSimUser,
  type InsertSimAuditEntry,
  type InsertSimAccessRequest,
} from "../drizzle/schema";
import { getDb } from "./db";

/* ---------- usuários ---------- */

export async function listSimUsers() {
  const db = await getDb();
  if (!db) return [];
  // Ordena pelo último acesso (mais recente primeiro); sem login vai para o fim
  return db
    .select()
    .from(simUsers)
    .orderBy(sql`${simUsers.lastLoginAt} IS NULL`, desc(simUsers.lastLoginAt));
}

export async function getSimUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db
    .select()
    .from(simUsers)
    .where(eq(simUsers.email, email.toLowerCase().trim()))
    .limit(1);
  return rows[0];
}

export async function getSimUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(simUsers).where(eq(simUsers.id, id)).limit(1);
  return rows[0];
}

export async function createSimUser(user: InsertSimUser) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.insert(simUsers).values({ ...user, email: user.email.toLowerCase().trim() });
  return getSimUserByEmail(user.email);
}

export async function updateSimUser(id: number, set: Partial<InsertSimUser>) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.update(simUsers).set(set).where(eq(simUsers.id, id));
}

export async function deleteSimUser(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.delete(simUsers).where(eq(simUsers.id, id));
}

export async function touchSimUserLogin(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(simUsers).set({ lastLoginAt: new Date() }).where(eq(simUsers.id, id));
}

/* ---------- auditoria ---------- */

export async function logAudit(entry: InsertSimAuditEntry) {
  try {
    const db = await getDb();
    if (!db) return;
    await db.insert(simAuditLog).values(entry);
  } catch (error) {
    console.error("[Auditoria] Falha ao registrar evento:", error);
  }
}

export async function listAudit(limit = 200) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(simAuditLog).orderBy(desc(simAuditLog.createdAt)).limit(limit);
}

/* ---------- solicitações de acesso ---------- */

export async function createAccessRequest(req: InsertSimAccessRequest) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.insert(simAccessRequests).values({ ...req, email: req.email.toLowerCase().trim() });
}

export async function listAccessRequests() {
  const db = await getDb();
  if (!db) return [];
  // Pendentes primeiro, depois mais recentes
  return db
    .select()
    .from(simAccessRequests)
    .orderBy(sql`${simAccessRequests.status} <> 'pendente'`, desc(simAccessRequests.createdAt))
    .limit(300);
}

export async function getAccessRequestById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(simAccessRequests).where(eq(simAccessRequests.id, id)).limit(1);
  return rows[0];
}

export async function updateAccessRequestStatus(id: number, status: "pendente" | "aprovada" | "dispensada") {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.update(simAccessRequests).set({ status }).where(eq(simAccessRequests.id, id));
}

export async function hasRecentRequestFromIp(ip: string, minutes = 10) {
  const db = await getDb();
  if (!db || !ip) return false;
  const rows = await db
    .select({ id: simAccessRequests.id })
    .from(simAccessRequests)
    .where(sql`${simAccessRequests.ip} = ${ip} AND ${simAccessRequests.createdAt} > NOW() - INTERVAL ${sql.raw(String(minutes))} MINUTE`)
    .limit(1);
  return rows.length > 0;
}

export async function hasPendingRequestForEmail(email: string) {
  const db = await getDb();
  if (!db) return false;
  const rows = await db
    .select({ id: simAccessRequests.id })
    .from(simAccessRequests)
    .where(sql`${simAccessRequests.email} = ${email.toLowerCase().trim()} AND ${simAccessRequests.status} = 'pendente'`)
    .limit(1);
  return rows.length > 0;
}
