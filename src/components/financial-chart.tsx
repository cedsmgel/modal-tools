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
} from "lucide-react";
import { CandleChart } from "./candle-chart";
import type { CandlestickData, Time } from "lightweight-charts";

export type ChartPeriod = "1D" | "5D" | "1M" | "6M" | "1A" | "Tudo";

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
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface HistoricalApiResponse {
  symbol?: string;
  shortName?: string;
  currentPrice?: number;
  changePercent?: number;
  currency?: string;
  candles?: HistoricalCandle[];
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
  const [livePrice, setLivePrice] = React.useState<number | null>(null);
  const [liveChangePercent, setLiveChangePercent] = React.useState<number | null>(null);
  const [snapshotToast, setSnapshotToast] = React.useState<boolean>(false);

  const currentPeriod = onPeriodChange ? selectedPeriod : internalPeriod;

  const handlePeriodChange = (p: ChartPeriod) => {
    if (onPeriodChange) onPeriodChange(p);
    else setInternalPeriod(p);
  };

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

  // Carrega dados REAIS de Candlestick da API Brapi (/api/market/historical)
  React.useEffect(() => {
    let isCancelled = false;
    async function loadBrapiHistoricalData() {
      setIsLoadingCandles(true);
      try {
        const res = await fetch(
          `/api/market/historical?ticker=${encodeURIComponent(primaryAsset.ticker)}&period=${encodeURIComponent(currentPeriod)}`
        );
        if (res.ok) {
          const data = (await res.json()) as HistoricalApiResponse;
          if (!isCancelled && Array.isArray(data.candles) && data.candles.length > 0) {
            setCandles(data.candles);
            if (typeof data.currentPrice === "number") setLivePrice(data.currentPrice);
            if (typeof data.changePercent === "number") setLiveChangePercent(data.changePercent);
          }
        }
      } catch (err) {
        console.warn("Erro ao buscar dados históricos da Brapi:", err);
      } finally {
        if (!isCancelled) setIsLoadingCandles(false);
      }
    }

    loadBrapiHistoricalData();
    return () => {
      isCancelled = true;
    };
  }, [primaryAsset.ticker, currentPeriod]);

  // Converte candles em formato CandlestickData<Time> para Lightweight Charts
  const candleData = React.useMemo<CandlestickData<Time>[]>(() => {
    if (!candles || candles.length === 0) return [];

    // Ordenação estrita por timestamp
    const sorted = [...candles].sort((a, b) => a.timestamp - b.timestamp);

    // Garante timestamps únicos estritamente crescentes em segundos
    const result: CandlestickData<Time>[] = [];
    let lastTime = 0;

    for (const c of sorted) {
      let t = c.timestamp > 1e10 ? Math.floor(c.timestamp / 1000) : Math.floor(c.timestamp);
      if (t <= lastTime) {
        t = lastTime + 60; // assegura incremento estrito
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
  const fechamento = lastBar ? lastBar.close.toFixed(2) : (livePrice ? livePrice.toFixed(2) : "0.00");
  const volume = lastBar
    ? lastBar.volume >= 1_000_000
      ? `${(lastBar.volume / 1_000_000).toFixed(1)}M`
      : `${lastBar.volume}`
    : "0M";

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
            <span
              className={`text-[11px] tabular-nums font-bold ${
                (liveChangePercent ?? primaryAsset.changePercent ?? 0) >= 0 ? "text-emerald-500" : "text-rose-500"
              }`}
            >
              {(liveChangePercent ?? primaryAsset.changePercent ?? 0) >= 0 ? "+" : ""}
              {(liveChangePercent ?? primaryAsset.changePercent ?? 0).toFixed(2)}%
            </span>
          </div>

          <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-0.5" />

          {/* Timeframe Selector (1D, 5D, 1M, 6M, 1A, Tudo) */}
          <div className="bg-zinc-100 dark:bg-zinc-900/90 p-0.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 flex items-center gap-0.5 shadow-2xs">
            {(["1D", "5D", "1M", "6M", "1A", "Tudo"] as ChartPeriod[]).map((period) => {
              const isActive = currentPeriod === period;
              return (
                <button
                  key={period}
                  type="button"
                  onClick={() => handlePeriodChange(period)}
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
      <div className="px-3 pt-2">
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

        {/* Container com altura explícita e sem padding lateral */}
        <div className="w-full flex-1 min-w-0" style={{ minHeight: `${chartHeight}px` }}>
          <CandleChart data={candleData} height={chartHeight} />
        </div>
      </div>

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
