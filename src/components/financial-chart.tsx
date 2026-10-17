"use client";

import * as React from "react";
import {
  Camera,
  Maximize2,
  Minimize2,
  Crosshair,
  Layers,
  Pencil,
  Ruler,
  Type,
  Minus,
  Check,
  RefreshCw,
  Lock,
  AlertCircle,
} from "lucide-react";
import { CandleChart } from "./candle-chart";
import type { CandlestickData, Time } from "lightweight-charts";

export type ChartPeriod = "5D" | "1M" | "3M" | "6M" | "1A" | "Tudo";

export type DrawingTool =
  | "crosshair"
  | "trendline"
  | "fibonacci"
  | "brush"
  | "text"
  | "ruler";

export interface ActiveSeriesItem {
  id: string;
  ticker: string;
  name: string;
  color: string;
  colorHex?: string;
  category?: string;
  currentValue?: number;
  changePercent?: number;
}

export interface FinancialChartProps {
  activeSeries: ActiveSeriesItem[];
  onRemoveSeries?: (id: string) => void;
  selectedPeriod?: ChartPeriod;
  onPeriodChange?: (period: ChartPeriod) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  className?: string;
}

interface HistoricalCandle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface MarketHistoryApiResponse {
  data?: {
    ticker: string;
    range: string;
    candles: HistoricalCandle[];
    fetchedAt: number;
    stale: boolean;
  };
}

export function FinancialChart({
  activeSeries,
  onRemoveSeries,
  selectedPeriod = "1M",
  onPeriodChange,
  isExpanded = false,
  onToggleExpand,
  className = "",
}: FinancialChartProps) {
  const [internalPeriod, setInternalPeriod] = React.useState<ChartPeriod>(selectedPeriod);
  const [activeTool, setActiveTool] = React.useState<DrawingTool>("crosshair");
  const [candles, setCandles] = React.useState<HistoricalCandle[]>([]);
  const [isLoadingCandles, setIsLoadingCandles] = React.useState<boolean>(false);
  const [isStale, setIsStale] = React.useState<boolean>(false);
  const [isQuotaNotice, setIsQuotaNotice] = React.useState<boolean>(false);
  const [fetchedAt, setFetchedAt] = React.useState<number | null>(null);
  const [snapshotToast, setSnapshotToast] = React.useState<boolean>(false);
  const [proModalNotice, setProModalNotice] = React.useState<string | null>(null);

  const currentPeriod = onPeriodChange ? selectedPeriod : internalPeriod;

  // Ativo principal selecionado ou fallback para PETR4
  const primaryAsset = React.useMemo(() => {
    if (activeSeries.length > 0) return activeSeries[0];
    return {
      id: "petr4",
      ticker: "PETR4",
      name: "Petrobras PN",
      color: "purple",
      colorHex: "#820AD1",
      currentValue: 38.45,
      changePercent: 1.18,
    };
  }, [activeSeries]);

  const handlePeriodClick = (p: ChartPeriod) => {
    // 6M, 1A e Tudo são travados no plano gratuito
    if (p === "6M" || p === "1A" || p === "Tudo") {
      setProModalNotice(`Período ${p} disponível exclusivamente no plano Pro.`);
      setTimeout(() => setProModalNotice(null), 3000);
      return;
    }

    if (onPeriodChange) onPeriodChange(p);
    else setInternalPeriod(p);
  };

  // Carrega dados REAIS da rota de cache /api/market/history
  React.useEffect(() => {
    let isCancelled = false;
    async function loadRealHistory() {
      setIsLoadingCandles(true);
      try {
        let apiRange = "1mo";
        if (currentPeriod === "5D") apiRange = "5d";
        else if (currentPeriod === "3M") apiRange = "3mo";

        const res = await fetch(
          `/api/market/history?ticker=${encodeURIComponent(primaryAsset.ticker)}&range=${encodeURIComponent(apiRange)}`
        );
        if (res.status === 429 || res.status === 503) {
          if (!isCancelled) setIsQuotaNotice(true);
        }
        if (res.ok) {
          const json = (await res.json()) as MarketHistoryApiResponse;
          if (!isCancelled && json.data && Array.isArray(json.data.candles)) {
            setCandles(json.data.candles);
            setIsStale(json.data.stale);
            setFetchedAt(json.data.fetchedAt);
            setIsQuotaNotice(false);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar histórico real de mercado:", err);
      } finally {
        if (!isCancelled) setIsLoadingCandles(false);
      }
    }

    loadRealHistory();
    return () => {
      isCancelled = true;
    };
  }, [primaryAsset.ticker, currentPeriod]);

  // Transforma os candles em dados para o Lightweight Charts
  const candleData = React.useMemo<CandlestickData<Time>[]>(() => {
    if (!candles || candles.length === 0) return [];

    const sorted = [...candles].sort((a, b) => a.time - b.time);
    const result: CandlestickData<Time>[] = [];
    let lastTime = 0;

    for (const c of sorted) {
      let t = c.time > 1e10 ? Math.floor(c.time / 1000) : c.time;
      if (t <= lastTime) {
        t = lastTime + 60;
      }
      lastTime = t;

      result.push({
        time: t as Time,
        open: Number(c.open.toFixed(2)),
        high: Number(c.high.toFixed(2)),
        low: Number(c.low.toFixed(2)),
        close: Number(c.close.toFixed(2)),
      });
    }

    return result;
  }, [candles]);

  const handleTakeSnapshot = () => {
    setSnapshotToast(true);
    setTimeout(() => setSnapshotToast(false), 2400);
  };

  const chartHeight = isExpanded ? 460 : 380;
  const lastBar = candles.length > 0 ? candles[candles.length - 1] : null;
  const periodo = candles.length > 0 ? `${candles.length}` : "28";
  const abertura = lastBar ? lastBar.open.toFixed(2) : "0.00";
  const maxima = lastBar ? lastBar.high.toFixed(2) : "0.00";
  const minima = lastBar ? lastBar.low.toFixed(2) : "0.00";
  const fechamento = lastBar ? lastBar.close.toFixed(2) : (primaryAsset.currentValue ? primaryAsset.currentValue.toFixed(2) : "0.00");
  const volume = lastBar
    ? lastBar.volume >= 1_000_000
      ? `${(lastBar.volume / 1_000_000).toFixed(1)}M`
      : `${lastBar.volume}`
    : "0M";

  const formattedTime = fetchedAt
    ? new Date(fetchedAt * 1000).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className={`flex flex-col h-full justify-between select-none relative bg-zinc-950/20 rounded-2xl ${className}`}>
      {/* 1. BARRA DE FERRAMENTAS SUPERIOR (ESTILO TRADINGVIEW / B3) */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-zinc-200/60 dark:border-zinc-800/80 shrink-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Badge do Ativo Principal com Indicador Real da Brapi */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 font-bold text-xs shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 animate-pulse" />
            <span className="tracking-wide">{primaryAsset.ticker}</span>
            <span className="text-[10px] text-zinc-400 font-medium">B3</span>
            {lastBar && (
              <span className="text-zinc-300 font-mono tabular-nums text-xs">
                R$ {lastBar.close.toFixed(2)}
              </span>
            )}
            <span
              className={`text-[11px] tabular-nums font-bold ${
                (primaryAsset.changePercent ?? 0) >= 0 ? "text-emerald-500" : "text-rose-500"
              }`}
            >
              {(primaryAsset.changePercent ?? 0) >= 0 ? "+" : ""}
              {(primaryAsset.changePercent ?? 0).toFixed(2)}%
            </span>
          </div>

          {formattedTime && (
            <span className="text-[10px] text-zinc-400 font-normal hidden sm:inline">
              Atualizado às {formattedTime}
            </span>
          )}

          {isStale && (
            <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Cache
            </span>
          )}

          <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-0.5" />

          {/* Timeframe Selector com Travamento do Plano Pro */}
          <div className="bg-zinc-100 dark:bg-zinc-900/90 p-0.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 flex items-center gap-0.5 shadow-2xs">
            {(["5D", "1M", "3M"] as ChartPeriod[]).map((period) => {
              const isActive = currentPeriod === period;
              return (
                <button
                  key={period}
                  type="button"
                  onClick={() => handlePeriodClick(period)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-purple-600 text-white shadow-2xs"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  {period}
                </button>
              );
            })}

            {/* Períodos Travados Pro: 6M, 1A, Tudo */}
            {(["6M", "1A", "Tudo"] as ChartPeriod[]).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => handlePeriodClick(period)}
                className="rounded-lg px-2 py-1 text-[11px] font-medium text-zinc-600 hover:text-zinc-400 transition-all cursor-pointer flex items-center gap-1 group relative"
                title={`Disponível no plano Pro (${period})`}
              >
                <span>{period}</span>
                <Lock className="h-2.5 w-2.5 text-zinc-500 group-hover:text-purple-400" />
              </button>
            ))}
          </div>

          {isLoadingCandles && (
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-purple-500 ml-1" />
          )}
        </div>

        {/* Lado Direito do Topo: Snapshot e Expandir */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleTakeSnapshot}
            className="p-1.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer shadow-2xs active:scale-95"
            title="Tirar foto do gráfico"
          >
            <Camera className="h-3.5 w-3.5" />
          </button>

          {onToggleExpand && (
            <button
              type="button"
              onClick={onToggleExpand}
              className="p-1.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer shadow-2xs active:scale-95"
              title={isExpanded ? "Recolher visualização do gráfico" : "Expandir gráfico em tela cheia"}
            >
              {isExpanded ? (
                <Minimize2 className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Banner discreto de cache ou cota diária preservada */}
      {(isStale || isQuotaNotice) && (
        <div className="mx-3 mt-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
          <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span className="truncate">
            Exibindo cotações em cache. O mercado está fechado ou a cota diária foi preservada.
          </span>
        </div>
      )}

      {/* 2. LEGENDA "SERIES" ACIMA DO GRÁFICO (NÃO COLADA À BORDA INFERIOR) */}
      <div className="px-3 pt-2">
        <div className="flex items-center gap-2 px-1 flex-wrap">
          {activeSeries.map((series) => {
            const variacao = series.changePercent ?? 0;
            const variacaoPct = Math.abs(variacao).toFixed(2);
            return (
              <span
                key={series.id}
                className="flex items-center gap-1.5 text-xs bg-zinc-800 rounded px-2 py-1"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: series.colorHex || "#8B5CF6" }}
                />
                <span className="text-zinc-200 font-medium tabular-nums">{series.ticker}</span>
                <span className={variacao >= 0 ? "text-emerald-400" : "text-rose-400"}>
                  {variacao >= 0 ? "+" : "-"}
                  {variacaoPct}%
                </span>
                {onRemoveSeries && (
                  <button
                    type="button"
                    onClick={() => onRemoveSeries(series.id)}
                    className="text-zinc-500 hover:text-zinc-300 ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* 3. DADOS OHLCV (P / A / M / m / F / Vol) com font-mono tabular-nums */}
      <div className="px-3 pt-1.5">
        <div className="flex items-center gap-3 text-xs font-mono tabular-nums text-zinc-400 px-1 mb-1 flex-wrap">
          <span>
            P<span className="text-zinc-300">{periodo}</span>
          </span>
          <span>
            A: <span className="text-zinc-300">{abertura}</span>
          </span>
          <span>
            M: <span className="text-zinc-300">{maxima}</span>
          </span>
          <span>
            m: <span className="text-zinc-300">{minima}</span>
          </span>
          <span>
            F: <span className="text-zinc-300">{fechamento}</span>
          </span>
          <span>
            Vol: <span className="text-zinc-300">{volume}</span>
          </span>
        </div>
      </div>

      {/* 4. CORPO DO GRÁFICO: TOOLBAR AO LADO, NÃO SOBRE O GRÁFICO */}
      <div className="flex gap-2 w-full flex-1 min-h-0 px-2 pb-2">
        {/* Coluna lateral de ferramentas de desenho */}
        <div className="flex flex-col gap-1 py-1 px-0.5 border-r border-zinc-800/60 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTool("crosshair")}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              activeTool === "crosshair"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/70"
            }`}
            title="Mira / Crosshair"
          >
            <Crosshair className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setActiveTool("trendline")}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              activeTool === "trendline"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/70"
            }`}
            title="Linha de Tendência"
          >
            <Minus className="h-4 w-4 -rotate-45" />
          </button>
          <button
            type="button"
            onClick={() => setActiveTool("fibonacci")}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              activeTool === "fibonacci"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/70"
            }`}
            title="Retração Fibonacci"
          >
            <Layers className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setActiveTool("brush")}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              activeTool === "brush"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/70"
            }`}
            title="Pincel"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setActiveTool("ruler")}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              activeTool === "ruler"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/70"
            }`}
            title="Régua de Medição"
          >
            <Ruler className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setActiveTool("text")}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              activeTool === "text"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/70"
            }`}
            title="Anotação de Texto"
          >
            <Type className="h-4 w-4" />
          </button>
        </div>

        {/* Container com altura explícita que deixa o eixo de tempo visível */}
        <div className="w-full flex-1 min-w-0" style={{ minHeight: `${chartHeight}px` }}>
          <CandleChart data={candleData} height={chartHeight} />
        </div>
      </div>

      {/* Notificação Pro Modal */}
      {proModalNotice && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 border border-purple-500/40 text-purple-200 text-xs px-3.5 py-2 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in zoom-in-95 duration-150">
          <Lock className="h-3.5 w-3.5 text-purple-400 shrink-0" />
          <span>{proModalNotice}</span>
        </div>
      )}

      {/* Toast de Captura Salva */}
      {snapshotToast && (
        <div className="absolute top-14 right-4 z-50 bg-purple-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <Check className="h-3.5 w-3.5" />
          <span>Captura do gráfico salva com sucesso!</span>
        </div>
      )}
    </div>
  );
}

export { CandleChart };
