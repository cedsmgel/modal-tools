import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

let localD1Instance: D1Database | null = null;

function getLocalD1Database(): D1Database | null {
  if (localD1Instance) return localD1Instance;

  try {
    // Apenas em ambiente Node.js de desenvolvimento local
    if (typeof process !== "undefined" && process.release?.name === "node") {
      const fs = require("fs");
      const path = require("path");
      const { DatabaseSync } = require("node:sqlite");

      const dir = path.join(process.cwd(), ".wrangler", "state", "v3", "d1", "miniflare-D1DatabaseObject");
      if (fs.existsSync(dir)) {
        const sqliteFiles: string[] = fs.readdirSync(dir);
        const targetFile = sqliteFiles.find((f: string) => f.endsWith(".sqlite") && !f.includes("metadata"));
        if (targetFile) {
          const fullPath = path.join(dir, targetFile);
          const rawDb = new DatabaseSync(fullPath);

          const d1Shim = {
            prepare(query: string) {
              const stmt = rawDb.prepare(query);
              let boundArgs: unknown[] = [];
              const preparedObj = {
                bind(...args: unknown[]) {
                  boundArgs = args;
                  return preparedObj;
                },
                async all() {
                  const results = stmt.all(...boundArgs);
                  return { results, success: true, meta: {} };
                },
                async first(colName?: string) {
                  const rows = stmt.all(...boundArgs);
                  if (!rows || rows.length === 0) return null;
                  if (colName) return (rows[0] as Record<string, unknown>)[colName] ?? null;
                  return rows[0];
                },
                async run() {
                  const info = stmt.run(...boundArgs);
                  return { success: true, meta: info };
                },
                async raw() {
                  return stmt.all(...boundArgs).map((r: Record<string, unknown>) => Object.values(r));
                },
              };
              return preparedObj;
            },
            async batch(statements: D1PreparedStatement[]) {
              const results: unknown[] = [];
              for (const s of statements) {
                const r = await s.all();
                results.push(r);
              }
              return results;
            },
            async exec(query: string) {
              rawDb.exec(query);
              return { count: 1, duration: 0 };
            },
            async dump() {
              return new ArrayBuffer(0);
            },
            withSession() {
              return d1Shim;
            },
          } as unknown as D1Database;

          localD1Instance = d1Shim;
          return d1Shim;
        }
      }
    }
  } catch (err) {
    console.error("Falha ao inicializar banco D1 local de desenvolvimento:", err);
  }

  return null;
}

/**
 * Retorna uma instância do Drizzle ORM conectada ao Cloudflare D1 Database.
 * Recebe o binding `d1Database` do contexto da requisição ou ambiente.
 */
export function getDb(d1Database?: D1Database) {
  if (d1Database) {
    return drizzle(d1Database, { schema });
  }

  const envD1 = (process.env as unknown as { DB?: D1Database }).DB;
  if (envD1) {
    return drizzle(envD1, { schema });
  }

  const localD1 = getLocalD1Database();
  if (localD1) {
    return drizzle(localD1, { schema });
  }

  return null;
}

export type DatabaseInstance = NonNullable<ReturnType<typeof getDb>>;
export * from "./schema";
