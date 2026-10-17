import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

/**
 * Tabela de Usuários sincronizada/vinculada aos IDs de usuário do Clerk.
 */
export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // ID único vindo do Clerk (ex: user_2xxx)
  email: text("email"),
  name: text("name"),
  plan: text("plan").notNull().default("free"), // 'free' | 'pro'
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

// Cache de cotações (compartilhado entre todos os usuários)
export const marketQuotes = sqliteTable("market_quotes", {
  ticker: text("ticker").primaryKey(),          // ex: PETR4
  name: text("name"),
  price: real("price").notNull(),
  changePct: real("change_pct"),
  volume: real("volume"),
  payload: text("payload"),                      // JSON bruto resumido (open/high/low/close etc.)
  fetchedAt: integer("fetched_at").notNull(),    // epoch em segundos
});

// Cache de histórico por ticker + range
export const marketHistory = sqliteTable("market_history", {
  id: text("id").primaryKey(),                   // `${ticker}:${range}`
  ticker: text("ticker").notNull(),
  range: text("range").notNull(),                // "5d" | "1mo" | "3mo"
  candles: text("candles").notNull(),            // JSON: [{time,open,high,low,close,volume}]
  fetchedAt: integer("fetched_at").notNull(),
});

// Contador de requisições à brapi por mês
export const apiUsage = sqliteTable("api_usage", {
  period: text("period").primaryKey(),           // "2026-10"
  count: integer("count").notNull().default(0),
});

// Watchlists do usuário
export const watchlists = sqliteTable("watchlists", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  columns: text("columns").notNull().default('["price","changePct"]'), // JSON
  position: integer("position").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export const watchlistItems = sqliteTable("watchlist_items", {
  id: text("id").primaryKey(),
  watchlistId: text("watchlist_id").notNull().references(() => watchlists.id, { onDelete: "cascade" }),
  ticker: text("ticker").notNull(),
  position: integer("position").notNull().default(0),
});
