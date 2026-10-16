import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

/**
 * Retorna uma instância do Drizzle ORM conectada ao Cloudflare D1 Database.
 * Permite passar o binding `d1` diretamente ou obter de contextos Cloudflare / Workerd.
 */
export function getDb(d1Database?: D1Database) {
  // Se o binding for fornecido explicitamente (por exemplo via env.DB)
  if (d1Database) {
    return drizzle(d1Database, { schema });
  }

  // Tenta obter do escopo global de Workers ou process.env se disponível
  const globalD1 = (globalThis as unknown as { env?: { DB?: D1Database }; DB?: D1Database }).DB ||
                   (globalThis as unknown as { env?: { DB?: D1Database } }).env?.DB;

  if (globalD1) {
    return drizzle(globalD1, { schema });
  }

  return null;
}

export type DatabaseInstance = NonNullable<ReturnType<typeof getDb>>;
export * from "./schema";
