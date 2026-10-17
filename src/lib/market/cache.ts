import { eq, inArray, sql } from "drizzle-orm";
import { getDb, marketQuotes, marketHistory, apiUsage } from "@/db";
import { fetchBrapiQuote, fetchBrapiHistory, type MarketCandle } from "./brapi";
import { isAllowedTicker } from "./universe";

export type CacheStatus = "HIT" | "MISS" | "STALE";

export interface CachedQuote {
  ticker: string;
  name: string | null;
  price: number;
  changePct: number | null;
  volume: number | null;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  fetchedAt: number;
  stale: boolean;
  cacheStatus: CacheStatus;
}

export interface CachedHistory {
  ticker: string;
  range: string;
  candles: MarketCandle[];
  fetchedAt: number;
  stale: boolean;
  cacheStatus: CacheStatus;
}

const BUDGET_LIMIT = 13500; // 90% da cota mensal de 15.000 requisições
const MARKET_OPEN_TTL_SECONDS = 1800; // 30 minutos durante o pregão

function getSaoPauloInfo() {
  const now = new Date();
  const nowSeconds = Math.floor(now.getTime() / 1000);

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(now);
  const map: Record<string, string> = {};
  for (const p of parts) map[p.type] = p.value;

  const hour = parseInt(map.hour || "0", 10);
  const minute = parseInt(map.minute || "0", 10);
  const weekday = map.weekday;
  const isWeekend = weekday === "Sat" || weekday === "Sun";
  const isTradingHours = !isWeekend && hour >= 10 && hour < 18;
  const period = `${map.year}-${map.month}`;

  return {
    nowSeconds,
    isTradingHours,
    period,
    hour,
    minute,
    isWeekend,
  };
}

/**
 * Avalia se o registro em cache está fresco de acordo com horário da B3
 */
function isQuoteFresh(fetchedAt: number, sp: ReturnType<typeof getSaoPauloInfo>): boolean {
  const ageSeconds = sp.nowSeconds - fetchedAt;

  // Durante pregão: fresco por 30 minutos
  if (sp.isTradingHours) {
    return ageSeconds <= MARKET_OPEN_TTL_SECONDS;
  }

  // Fora de pregão ou fim de semana: válido por 14 horas ou se foi buscado após as 18h
  return ageSeconds <= 14 * 3600;
}

/**
 * Avalia se o histórico em cache está fresco
 */
function isHistoryFresh(fetchedAt: number, range: string, sp: ReturnType<typeof getSaoPauloInfo>): boolean {
  const ageSeconds = sp.nowSeconds - fetchedAt;
  if (range === "5d") {
    return sp.isTradingHours ? ageSeconds <= 3600 : ageSeconds <= 12 * 3600;
  }
  // 1mo e 3mo: válidos por até 24h
  return ageSeconds <= 24 * 3600;
}

/**
 * Consulta o uso atual da API brapi no mês
 */
async function getCurrentApiUsage(period: string, d1?: D1Database): Promise<number> {
  const db = getDb(d1);
  if (!db) return 0;
  try {
    const row = await db.query.apiUsage.findFirst({
      where: eq(apiUsage.period, period),
    });
    return row?.count ?? 0;
  } catch (err) {
    console.error("Erro ao consultar api_usage:", err);
    return 0;
  }
}

/**
 * Incrementa contador de consumo da brapi
 */
async function incrementApiUsage(period: string, d1?: D1Database): Promise<void> {
  const db = getDb(d1);
  if (!db) return;
  try {
    await db
      .insert(apiUsage)
      .values({ period, count: 1 })
      .onConflictDoUpdate({
        target: apiUsage.period,
        set: { count: sql`${apiUsage.count} + 1` },
      });
  } catch (err) {
    console.error("Erro ao incrementar api_usage:", err);
  }
}

/**
 * Obtém cotações para múltiplos tickers com regras rigorosas de cache e guarda de cota
 */
export async function getMarketQuotes(
  tickers: string[],
  d1?: D1Database
): Promise<{ quotes: CachedQuote[]; cacheStatus: CacheStatus }> {
  const cleanTickers = Array.from(
    new Set(
      tickers
        .map((t) => t.trim().toUpperCase())
        .filter((t) => isAllowedTicker(t))
    )
  );

  if (cleanTickers.length === 0) {
    return { quotes: [], cacheStatus: "HIT" };
  }

  const db = getDb(d1);
  const sp = getSaoPauloInfo();

  // 1. Busca cotações existentes no cache do D1
  const cachedRows = db
    ? await db.query.marketQuotes.findMany({
        where: inArray(marketQuotes.ticker, cleanTickers),
      })
    : [];

  const cachedMap = new Map(cachedRows.map((r) => [r.ticker, r]));
  const expiredTickers: string[] = [];
  const results: CachedQuote[] = [];
  let overallHit = true;
  let hasStale = false;

  for (const ticker of cleanTickers) {
    const cached = cachedMap.get(ticker);
    if (cached && isQuoteFresh(cached.fetchedAt, sp)) {
      let payloadData: { open?: number; high?: number; low?: number; previousClose?: number } = {};
      try {
        if (cached.payload) payloadData = JSON.parse(cached.payload);
      } catch {
        // fallback
      }
      results.push({
        ticker: cached.ticker,
        name: cached.name,
        price: cached.price,
        changePct: cached.changePct,
        volume: cached.volume,
        open: payloadData.open ?? cached.price,
        high: payloadData.high ?? cached.price,
        low: payloadData.low ?? cached.price,
        previousClose: payloadData.previousClose ?? cached.price,
        fetchedAt: cached.fetchedAt,
        stale: false,
        cacheStatus: "HIT",
      });
    } else {
      expiredTickers.push(ticker);
      overallHit = false;
    }
  }

  // Se todos estavam frescos no D1, retorna imediatamente (0 chamadas à brapi)
  if (expiredTickers.length === 0) {
    return { quotes: results, cacheStatus: "HIT" };
  }

  // 2. Verifica a Guarda de Orçamento (>= 13.500 requisições)
  const currentUsage = await getCurrentApiUsage(sp.period, d1);
  const budgetBlocked = currentUsage >= BUDGET_LIMIT;

  // Atualiza no máximo 5 tickers vencidos por requisição para preservar performance
  const tickersToFetch = budgetBlocked ? [] : expiredTickers.slice(0, 5);

  // Executa chamadas à brapi com concorrência limitada (máx 2 simultâneas)
  for (let i = 0; i < tickersToFetch.length; i += 2) {
    const batch = tickersToFetch.slice(i, i + 2);
    const fetchedResults = await Promise.all(
      batch.map(async (ticker) => {
        const fresh = await fetchBrapiQuote(ticker);
        if (fresh && db) {
          await db
            .insert(marketQuotes)
            .values({
              ticker: fresh.ticker,
              name: fresh.name,
              price: fresh.price,
              changePct: fresh.changePct,
              volume: fresh.volume,
              payload: fresh.payload,
              fetchedAt: sp.nowSeconds,
            })
            .onConflictDoUpdate({
              target: marketQuotes.ticker,
              set: {
                name: fresh.name,
                price: fresh.price,
                changePct: fresh.changePct,
                volume: fresh.volume,
                payload: fresh.payload,
                fetchedAt: sp.nowSeconds,
              },
            });

          await incrementApiUsage(sp.period, d1);
          return fresh;
        }
        return null;
      })
    );

    for (let j = 0; j < batch.length; j++) {
      const ticker = batch[j];
      const fresh = fetchedResults[j];
      if (fresh) {
        results.push({
          ticker: fresh.ticker,
          name: fresh.name,
          price: fresh.price,
          changePct: fresh.changePct,
          volume: fresh.volume,
          open: fresh.open,
          high: fresh.high,
          low: fresh.low,
          previousClose: fresh.previousClose,
          fetchedAt: sp.nowSeconds,
          stale: false,
          cacheStatus: "MISS",
        });
      }
    }
  }

  // 3. Fallback gracioso para tickers que não puderam ser atualizados (budget, erro ou além do limite de 5)
  for (const ticker of expiredTickers) {
    const alreadyProcessed = results.some((r) => r.ticker === ticker);
    if (!alreadyProcessed) {
      const cached = cachedMap.get(ticker);
      if (cached) {
        let payloadData: { open?: number; high?: number; low?: number; previousClose?: number } = {};
        try {
          if (cached.payload) payloadData = JSON.parse(cached.payload);
        } catch {
          // fallback
        }
        hasStale = true;
        results.push({
          ticker: cached.ticker,
          name: cached.name,
          price: cached.price,
          changePct: cached.changePct,
          volume: cached.volume,
          open: payloadData.open ?? cached.price,
          high: payloadData.high ?? cached.price,
          low: payloadData.low ?? cached.price,
          previousClose: payloadData.previousClose ?? cached.price,
          fetchedAt: cached.fetchedAt,
          stale: true,
          cacheStatus: "STALE",
        });
      }
    }
  }

  const finalStatus: CacheStatus = overallHit ? "HIT" : hasStale ? "STALE" : "MISS";
  return { quotes: results, cacheStatus: finalStatus };
}

/**
 * Obtém histórico de candles com cache no D1 e proteção de cota
 */
export async function getMarketHistory(
  ticker: string,
  range: "5d" | "1mo" | "3mo",
  d1?: D1Database
): Promise<CachedHistory | null> {
  const cleanTicker = ticker.trim().toUpperCase();
  if (!isAllowedTicker(cleanTicker)) {
    return null;
  }

  const db = getDb(d1);
  const sp = getSaoPauloInfo();
  const cacheId = `${cleanTicker}:${range}`;

  // 1. Verifica cache no D1
  if (db) {
    try {
      const cached = await db.query.marketHistory.findFirst({
        where: eq(marketHistory.id, cacheId),
      });

      if (cached && isHistoryFresh(cached.fetchedAt, range, sp)) {
        let candles: MarketCandle[] = [];
        try {
          candles = JSON.parse(cached.candles);
        } catch {
          candles = [];
        }
        return {
          ticker: cleanTicker,
          range,
          candles,
          fetchedAt: cached.fetchedAt,
          stale: false,
          cacheStatus: "HIT",
        };
      }
    } catch (err) {
      console.error(`Erro ao ler market_history para ${cacheId}:`, err);
    }
  }

  // 2. Verifica cota antes de chamar brapi
  const currentUsage = await getCurrentApiUsage(sp.period, d1);
  if (currentUsage >= BUDGET_LIMIT) {
    // Guarda de orçamento: devolve cache vencido se disponível
    if (db) {
      const cached = await db.query.marketHistory.findFirst({
        where: eq(marketHistory.id, cacheId),
      });
      if (cached) {
        return {
          ticker: cleanTicker,
          range,
          candles: JSON.parse(cached.candles),
          fetchedAt: cached.fetchedAt,
          stale: true,
          cacheStatus: "STALE",
        };
      }
    }
    return null;
  }

  // 3. Busca da brapi
  const fresh = await fetchBrapiHistory(cleanTicker, range);
  if (fresh && fresh.candles.length > 0 && db) {
    try {
      await db
        .insert(marketHistory)
        .values({
          id: cacheId,
          ticker: cleanTicker,
          range,
          candles: JSON.stringify(fresh.candles),
          fetchedAt: sp.nowSeconds,
        })
        .onConflictDoUpdate({
          target: marketHistory.id,
          set: {
            candles: JSON.stringify(fresh.candles),
            fetchedAt: sp.nowSeconds,
          },
        });

      await incrementApiUsage(sp.period, d1);

      return {
        ticker: cleanTicker,
        range,
        candles: fresh.candles,
        fetchedAt: sp.nowSeconds,
        stale: false,
        cacheStatus: "MISS",
      };
    } catch (err) {
      console.error(`Erro ao salvar market_history ${cacheId}:`, err);
    }
  }

  // Fallback: se a chamada à brapi falhou, devolve cache existente com stale
  if (db) {
    const cached = await db.query.marketHistory.findFirst({
      where: eq(marketHistory.id, cacheId),
    });
    if (cached) {
      return {
        ticker: cleanTicker,
        range,
        candles: JSON.parse(cached.candles),
        fetchedAt: cached.fetchedAt,
        stale: true,
        cacheStatus: "STALE",
      };
    }
  }

  return null;
}
