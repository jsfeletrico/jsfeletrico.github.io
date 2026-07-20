import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Usuários do simulador — contas criadas manualmente pelo administrador
 * (e-mail + senha). Independente do OAuth.
 */
export const simUsers = mysqlTable("simUsers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  nome: varchar("nome", { length: 160 }),
  /** Hash scrypt no formato salt:hash (hex) */
  passwordHash: varchar("passwordHash", { length: 512 }).notNull(),
  ativo: int("ativo").default(1).notNull(), // 1 = ativo, 0 = desativado
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastLoginAt: timestamp("lastLoginAt"),
  /** Data de expiração do acesso (null = sem expiração) */
  expiraEm: timestamp("expiraEm"),
});

export type SimUser = typeof simUsers.$inferSelect;
export type InsertSimUser = typeof simUsers.$inferInsert;

/**
 * Log de auditoria: registra logins, acessos ao simulador e ações do admin.
 */
export const simAuditLog = mysqlTable("simAuditLog", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  email: varchar("email", { length: 320 }),
  evento: varchar("evento", { length: 64 }).notNull(),
  detalhe: text("detalhe"),
  ip: varchar("ip", { length: 64 }),
  userAgent: varchar("userAgent", { length: 512 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SimAuditEntry = typeof simAuditLog.$inferSelect;
export type InsertSimAuditEntry = typeof simAuditLog.$inferInsert;

/**
 * Solicitações de acesso ao simulador enviadas pelo formulário público.
 * O admin aprova (cria o usuário) ou dispensa cada solicitação.
 */
export const simAccessRequests = mysqlTable("simAccessRequests", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  mensagem: text("mensagem"),
  status: mysqlEnum("status", ["pendente", "aprovada", "dispensada"]).default("pendente").notNull(),
  ip: varchar("ip", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SimAccessRequest = typeof simAccessRequests.$inferSelect;
export type InsertSimAccessRequest = typeof simAccessRequests.$inferInsert;
