import { sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

/**
 * Tabela de Usuários sincronizada/vinculada aos IDs de usuário do Clerk.
 */
export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // ID único vindo do Clerk (ex: user_2xxx)
  email: text("email"),
  name: text("name"),
  plan: text("plan", { enum: ["FREE", "PRO", "CORPORATE"] })
    .notNull()
    .default("FREE"),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

/**
 * Tabela de Ativos e Posições Financeiras/Imobiliárias.
 */
export const assets = sqliteTable("assets", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  ticker: text("ticker").notNull(),
  amount: real("amount").notNull(),
  assetType: text("asset_type", {
    enum: [
      "STOCK",
      "CRYPTO",
      "FIAT",
      "BOND",
      "COMMODITY",
      "REAL_ESTATE",
    ],
  }).notNull(),
  averagePrice: real("average_price").notNull().default(0.0),
  notes: text("notes"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

/**
 * Tabela de Histórico de Transações e Movimentações Fiscais.
 */
export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  assetId: text("asset_id")
    .notNull()
    .references(() => assets.id),
  type: text("type", { enum: ["BUY", "SELL", "DIVIDEND", "RENT"] }).notNull(),
  quantity: real("quantity").notNull(),
  unitPrice: real("unit_price").notNull(),
  totalValue: real("total_value").notNull(),
  taxDue: real("tax_due").notNull().default(0.0),
  executedAt: text("executed_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});
