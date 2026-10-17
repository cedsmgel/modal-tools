import { z } from "zod";

const BRAPI_BASE_URL = "https://brapi.dev/api";

function getBrapiToken(): string | null {
  return process.env.BRAPI_TOKEN || process.env.BRAPI_API_KEY || null;
}

const BrapiQuoteItemSchema = z.object({
  symbol: z.string(),
  shortName: z.string().optional().nullable(),
  regularMarketPrice: z.number(),
  regularMarketChangePercent: z.number().optional().nullable(),
  regularMarketVolume: z.number().optional().nullable(),
  regularMarketOpen: z.number().optional().nullable(),
  regularMarketDayHigh: z.number().optional().nullable(),
  regularMarketDayLow: z.number().optional().nullable(),
  regularMarketPreviousClose: z.number().optional().nullable(),
});

const BrapiQuoteResponseSchema = z.object({
  results: z.array(BrapiQuoteItemSchema),
});

const BrapiHistoricalCandleSchema = z.object({
  date: z.number(),
  open: z.number().nullable().optional(),
  high: z.number().nullable().optional(),
  low: z.number().nullable().optional(),
  close: z.number().nullable().optional(),
  volume: z.number().nullable().optional(),
});

const BrapiHistoricalResultSchema = z.object({
  symbol: z.string(),
  shortName: z.string().optional().nullable(),
  regularMarketPrice: z.number().optional().nullable(),
  regularMarketChangePercent: z.number().optional().nullable(),
  historicalDataPrice: z.array(BrapiHistoricalCandleSchema).optional().nullable(),
});

const BrapiHistoricalResponseSchema = z.object({
  results: z.array(BrapiHistoricalResultSchema),
});

export interface MarketQuoteResult {
  ticker: string;
  name: string;
  price: number;
  changePct: number;
  volume: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  payload: string;
}

export interface MarketCandle {
  time: number; // timestamp em segundos para o Lightweight Charts
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketHistoryResult {
  ticker: string;
  range: string;
  candles: MarketCandle[];
}

// In-flight deduplication por ticker para evitar chamadas simultâneas idênticas
const inFlightQuotes = new Map<string, Promise<MarketQuoteResult | null>>();
const inFlightHistory = new Map<string, Promise<MarketHistoryResult | null>>();

/**
 * Busca cotação de 1 ativo na brapi (respeitando limite de 1 ticker por request)
 */
export async function fetchBrapiQuote(ticker: string): Promise<MarketQuoteResult | null> {
  const cleanTicker = ticker.trim().toUpperCase();
  const existing = inFlightQuotes.get(cleanTicker);
  if (existing) return existing;

  const promise = (async () => {
    const token = getBrapiToken();
    const url = `${BRAPI_BASE_URL}/quote/${encodeURIComponent(cleanTicker)}?token=${encodeURIComponent(token || "")}`;

    try {
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        // Timeout de 6 segundos
        signal: AbortSignal.timeout(6000),
      });

      if (!res.ok) {
        console.error(`Brapi quote error ${cleanTicker}: HTTP ${res.status} ${res.statusText}`);
        return null;
      }

      const json = await res.json();
      const parsed = BrapiQuoteResponseSchema.safeParse(json);
      if (!parsed.success || !parsed.data.results || parsed.data.results.length === 0) {
        console.error(`Brapi quote invalid payload for ${cleanTicker}`);
        return null;
      }

      const raw = parsed.data.results[0];
      const price = raw.regularMarketPrice;
      const changePct = raw.regularMarketChangePercent ?? 0;
      const volume = raw.regularMarketVolume ?? 0;
      const open = raw.regularMarketOpen ?? price;
      const high = raw.regularMarketDayHigh ?? price;
      const low = raw.regularMarketDayLow ?? price;
      const previousClose = raw.regularMarketPreviousClose ?? price;

      const payloadObj = {
        open,
        high,
        low,
        close: price,
        previousClose,
        volume,
        updatedAt: new Date().toISOString(),
      };

      return {
        ticker: cleanTicker,
        name: raw.shortName || cleanTicker,
        price,
        changePct,
        volume,
        open,
        high,
        low,
        previousClose,
        payload: JSON.stringify(payloadObj),
      };
    } catch (err) {
      console.error(`Falha ao requisitar cotação da brapi para ${cleanTicker}:`, err);
      return null;
    } finally {
      inFlightQuotes.delete(cleanTicker);
    }
  })();

  inFlightQuotes.set(cleanTicker, promise);
  return promise;
}

/**
 * Busca histórico de 1 ativo na brapi (ranges permitidos no plano free: 5d, 1mo, 3mo)
 */
export async function fetchBrapiHistory(
  ticker: string,
  range: "5d" | "1mo" | "3mo"
): Promise<MarketHistoryResult | null> {
  const cleanTicker = ticker.trim().toUpperCase();
  const cacheKey = `${cleanTicker}:${range}`;
  const existing = inFlightHistory.get(cacheKey);
  if (existing) return existing;

  const promise = (async () => {
    const token = getBrapiToken();
    let interval = "1d";
    if (range === "5d") interval = "15m";
    else if (range === "1mo" || range === "3mo") interval = "1d";

    const url = `${BRAPI_BASE_URL}/quote/${encodeURIComponent(cleanTicker)}?range=${range}&interval=${interval}&token=${encodeURIComponent(token || "")}`;

    try {
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        signal: AbortSignal.timeout(8000),
      });

      if (!res.ok) {
        console.error(`Brapi history error ${cleanTicker} (${range}): HTTP ${res.status}`);
        return null;
      }

      const json = await res.json();
      const parsed = BrapiHistoricalResponseSchema.safeParse(json);
      if (!parsed.success || !parsed.data.results || parsed.data.results.length === 0) {
        console.error(`Brapi history invalid payload for ${cleanTicker}`);
        return null;
      }

      const raw = parsed.data.results[0];
      const rawCandles = raw.historicalDataPrice || [];

      // Filtra e normaliza candles válidos
      const validCandles = rawCandles
        .filter((c) => c.close !== null && c.close !== undefined && !isNaN(c.close))
        .map((c) => {
          const close = Number(c.close!.toFixed(2));
          const open = c.open !== null && c.open !== undefined ? Number(c.open.toFixed(2)) : close;
          const high = c.high !== null && c.high !== undefined ? Number(c.high.toFixed(2)) : Math.max(open, close);
          const low = c.low !== null && c.low !== undefined ? Number(c.low.toFixed(2)) : Math.min(open, close);
          const volume = c.volume || 0;
          return {
            time: c.date, // epoch em segundos
            open,
            high,
            low,
            close,
            volume,
          };
        })
        .sort((a, b) => a.time - b.time);

      return {
        ticker: cleanTicker,
        range,
        candles: validCandles,
      };
    } catch (err) {
      console.error(`Falha ao requisitar histórico da brapi para ${cleanTicker} (${range}):`, err);
      return null;
    } finally {
      inFlightHistory.delete(cacheKey);
    }
  })();

  inFlightHistory.set(cacheKey, promise);
  return promise;
}
