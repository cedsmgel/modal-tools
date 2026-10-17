import { rules2026 } from "./2026-01";
import type { RulesResult } from "./types";

export * from "./types";
export { rules2026 };

export function getRules(competencia: string): RulesResult {
  if (competencia.startsWith("2026")) {
    return { success: true, rules: rules2026 };
  }

  return {
    success: false,
    error: "Ainda não temos as regras desta competência.",
  };
}
