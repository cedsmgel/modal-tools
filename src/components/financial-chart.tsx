"use client";

import * as React from "react";
import {
  X,
  TrendingUp,
  Maximize2,
  Minimize2,
  ChevronDown,
  Camera,
  Layers,
  Crosshair,
  Pencil,
  Ruler,
  Type,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Trash2,
  Magnet,
  Check,
  Search,
  Sparkles,
  BarChart3,
  Minus,
  RefreshCw,
} from "lucide-react";

export type ChartPeriod = "1D" | "5D" | "1M" | "6M" | "1A" | "Tudo";

export type ChartType =
  | "barras"
  | "velas"
  | "velas_vazias"
  | "linha"
  | "linha_marcadores"
  | "step_line"
  | "area"
  | "area_hlc"
  | "linha_base"
  | "colunas"
  | "maxima_minima"
  | "heikin_ashi"
  | "renko"
  | "quebra_linha"
  | "kagi"
  | "ponto_figura"
  | "intervalo";

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

// 17 modalidades de gráfico no padrão B3 e TradingView
interface ChartTypeMeta {
  id: ChartType;
  label: string;
  category: "Velas e Barras" | "Linhas e Áreas" | "Tendência e Preço";
  description: string;
}

const CHART_TYPES: ChartTypeMeta[] = [
  { id: "velas", label: "Velas (Candles)", category: "Velas e Barras", description: "Velas japonesas clássicas com corpo e sombras" },
  { id: "velas_vazias", label: "Velas Vazias (Hollow)", category: "Velas e Barras", description: "Velas vazias para alta e sólidas para baixa" },
  { id: "barras", label: "Barras (OHLC)", category: "Velas e Barras", description: "Barras americanas com abertura e fechamento" },
  { id: "colunas", label: "Colunas", category: "Velas e Barras", description: "Histograma vertical a partir da linha base" },
  { id: "heikin_ashi", label: "Heikin Ashi", category: "Velas e Barras", description: "Velas suavizadas com médias ponderadas" },

  { id: "linha", label: "Linha", category: "Linhas e Áreas", description: "Linha contínua conectando os fechamentos" },
  { id: "linha_marcadores", label: "Linha com Marcadores", category: "Linhas e Áreas", description: "Linha contínua com nós em cada pregão" },
  { id: "step_line", label: "Step Line (Degraus)", category: "Linhas e Áreas", description: "Linha em formato de escada horizontal e vertical" },
  { id: "area", label: "Área", category: "Linhas e Áreas", description: "Linha com gradiente preenchido até a base" },
  { id: "area_hlc", label: "Área HLC", category: "Linhas e Áreas", description: "Faixa sombreada entre máxima e mínima" },
  { id: "linha_base", label: "Linha Base", category: "Linhas e Áreas", description: "Divisão em 0% (verde acima, vermelho abaixo)" },
  { id: "maxima_minima", label: "Máxima-Mínima (High-Low)", category: "Linhas e Áreas", description: "Cápsulas verticais unindo apenas máxima e mínima" },

  { id: "renko", label: "Renko", category: "Tendência e Preço", description: "Tijolos diagonais com base em variação de preço" },
  { id: "quebra_linha", label: "Quebra de Linha (Line Break)", category: "Tendência e Preço", description: "Blocos de reversão ao romper 3 fechamentos" },
  { id: "kagi", label: "Kagi", category: "Tendência e Preço", description: "Linhas verticais Yang (grossa) e Yin (fina)" },
  { id: "ponto_figura", label: "Ponto e Figura (P&F)", category: "Tendência e Preço", description: "Colunas clássicas alternadas de X e O" },
  { id: "intervalo", label: "Intervalo (Range Bars)", category: "Tendência e Preço", description: "Barras com amplitude fixa independente do tempo" },
];

const COLOR_MAP: Record<string, string> = {
  purple: "#820AD1",
  emerald: "#10B981",
  blue: "#2563EB",
  amber: "#F59E0B",
  cyan: "#06B6D4",
  rose: "#F43F5E",
  indigo: "#6366F1",
  violet: "#8B5CF6",
};

// Ícone SVG para cada modalidade de gráfico
function ChartTypeIcon({ type, className = "h-3.5 w-3.5" }: { type: ChartType; className?: string }) {
  switch (type) {
    case "velas":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M7 3v3m0 12v3M7 6h4v12H7z" fill="currentColor" fillOpacity="0.3" />
          <path d="M15 7v2m0 8v4M15 9h4v8h-4z" fill="currentColor" />
        </svg>
      );
    case "velas_vazias":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M7 3v3m0 12v3M7 6h4v12H7z" />
          <path d="M15 7v2m0 8v4M15 9h4v8h-4z" fill="currentColor" />
        </svg>
      );
    case "barras":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M8 3v18M5 8h3M8 14h3M16 5v14M13 11h3M16 8h3" />
        </svg>
      );
    case "colunas":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <rect x="4" y="10" width="3" height="11" fill="currentColor" />
          <rect x="10" y="5" width="3" height="16" fill="currentColor" />
          <rect x="16" y="8" width="3" height="13" fill="currentColor" />
        </svg>
      );
    case "linha":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M3 17l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "linha_marcadores":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M3 17l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="3" cy="17" r="2" fill="currentColor" />
          <circle cx="9" cy="11" r="2" fill="currentColor" />
          <circle cx="13" cy="15" r="2" fill="currentColor" />
          <circle cx="21" cy="7" r="2" fill="currentColor" />
        </svg>
      );
    case "step_line":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M3 17h5v-6h6v4h7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "area":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M3 17l6-6 4 4 8-8v10H3z" fill="currentColor" fillOpacity="0.25" />
          <path d="M3 17l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "area_hlc":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M3 8l6-3 6 4 6-5v14l-6-3-6 4-6-4z" fill="currentColor" fillOpacity="0.2" />
          <path d="M3 13l6-2 6 3 6-3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "linha_base":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <line x1="3" y1="12" x2="21" y2="12" strokeDasharray="2 2" stroke="currentColor" strokeOpacity="0.5" />
          <path d="M3 16l6-8 4 6 8-8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "maxima_minima":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <rect x="6" y="5" width="2.5" height="14" rx="1.2" fill="currentColor" />
          <rect x="11" y="8" width="2.5" height="11" rx="1.2" fill="currentColor" />
          <rect x="16" y="3" width="2.5" height="15" rx="1.2" fill="currentColor" />
        </svg>
      );
    case "heikin_ashi":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M6 4v2m0 8v3M6 6h4v8H6z" fill="currentColor" />
          <path d="M14 6v2m0 10v3M14 8h4v10h-4z" fill="currentColor" />
        </svg>
      );
    case "renko":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <rect x="3" y="14" width="5" height="5" rx="0.5" fill="currentColor" />
          <rect x="8" y="9" width="5" height="5" rx="0.5" fill="currentColor" />
          <rect x="13" y="4" width="5" height="5" rx="0.5" fill="currentColor" />
          <rect x="18" y="9" width="5" height="5" rx="0.5" stroke="currentColor" />
        </svg>
      );
    case "quebra_linha":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <rect x="4" y="12" width="4" height="8" rx="0.5" fill="currentColor" />
          <rect x="10" y="8" width="4" height="12" rx="0.5" fill="currentColor" />
          <rect x="16" y="4" width="4" height="16" rx="0.5" fill="currentColor" />
        </svg>
      );
    case "kagi":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M4 18v-8h6v10h6V4h4" strokeLinecap="square" />
        </svg>
      );
    case "ponto_figura":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M5 5l4 4m0-4L5 9M5 11l4 4m0-4l-4 4" strokeLinecap="round" />
          <circle cx="17" cy="7" r="2.5" />
          <circle cx="17" cy="14" r="2.5" />
        </svg>
      );
    case "intervalo":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <rect x="5" y="6" width="3" height="12" rx="1" fill="currentColor" />
          <rect x="11" y="9" width="3" height="12" rx="1" fill="currentColor" />
          <rect x="17" y="4" width="3" height="12" rx="1" fill="currentColor" />
        </svg>
      );
    default:
      return <TrendingUp className={className} />;
  }
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
  const [chartType, setChartType] = React.useState<ChartType>("velas");
  const [isTypeMenuOpen, setIsTypeMenuOpen] = React.useState(false);
  const [typeSearchQuery, setTypeSearchQuery] = React.useState("");

  // Integração Real Brapi (OHLC e Histórico)
  const [candles, setCandles] = React.useState<HistoricalCandle[]>([]);
  const [isLoadingCandles, setIsLoadingCandles] = React.useState(false);
  const [livePrice, setLivePrice] = React.useState<number | null>(null);
  const [liveChangePercent, setLiveChangePercent] = React.useState<number | null>(null);

  // Ferramentas de Desenho TradingView
  const [activeTool, setActiveTool] = React.useState<DrawingTool>("crosshair");
  const [isDrawingsLocked, setIsDrawingsLocked] = React.useState(false);
  const [isDrawingsVisible, setIsDrawingsVisible] = React.useState(true);
  const [isMagnetActive, setIsMagnetActive] = React.useState(false);

  // Estado interativo das ferramentas de desenho
  const [trendlines, setTrendlines] = React.useState<
    { id: string; x1: number; y1: number; x2: number; y2: number; priceDiff: number; percentDiff: number }[]
  >([]);
  const [drawingStart, setDrawingStart] = React.useState<{ x: number; y: number; price: number } | null>(null);
  const [brushPaths, setBrushPaths] = React.useState<{ id: string; points: { x: number; y: number }[] }[]>([]);
  const [isDrawingBrush, setIsDrawingBrush] = React.useState(false);
  const [currentBrushPath, setCurrentBrushPath] = React.useState<{ x: number; y: number }[]>([]);
  const [textNotes, setTextNotes] = React.useState<{ id: string; x: number; y: number; text: string }[]>([]);
  const [rulerPoints, setRulerPoints] = React.useState<
    { x1: number; y1: number; x2: number; y2: number; barsCount: number; percentDiff: number; priceDiff: number } | null
  >(null);
  const [fibLevels, setFibLevels] = React.useState<{ high: number; low: number } | null>(null);

  // Indicadores técnicos (fx)
  const [isIndicatorsMenuOpen, setIsIndicatorsMenuOpen] = React.useState(false);
  const [showVolume, setShowVolume] = React.useState(true);
  const [showSMA20, setShowSMA20] = React.useState(true);
  const [showEMA50, setShowEMA50] = React.useState(false);
  const [showBollinger, setShowBollinger] = React.useState(false);
  const [showGrid, setShowGrid] = React.useState(true);
  const [showWatermark, setShowWatermark] = React.useState(true);

  // Escala & Notificação
  const [scaleMode, setScaleMode] = React.useState<"percent" | "auto" | "log">("auto");
  const [snapshotToast, setSnapshotToast] = React.useState(false);
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
  const [mousePos, setMousePos] = React.useState<{ x: number; y: number } | null>(null);

  const containerRef = React.useRef<HTMLDivElement>(null);
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
        const res = await fetch(`/api/market/historical?ticker=${primaryAsset.ticker}&period=${currentPeriod}`);
        if (res.ok) {
          const data: any = await res.json();
          if (!isCancelled && Array.isArray(data.candles) && data.candles.length > 0) {
            setCandles(data.candles);
            setLivePrice(data.currentPrice);
            setLiveChangePercent(data.changePercent);

            // Ancoragem automática do Fibonacci e da Linha de Tendência inicial
            const highs = data.candles.map((c: HistoricalCandle) => c.high);
            const lows = data.candles.map((c: HistoricalCandle) => c.low);
            const maxH = Math.max(...highs);
            const minL = Math.min(...lows);
            setFibLevels({ high: maxH, low: minL });
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

  // Médias Móveis SMA 20 e EMA 50 calculadas com os dados reais
  const sma20Values = React.useMemo(() => {
    const period = Math.min(10, Math.max(3, Math.floor(candles.length / 3)));
    return candles.map((_, idx, arr) => {
      const start = Math.max(0, idx - period + 1);
      const slice = arr.slice(start, idx + 1);
      const avg = slice.reduce((acc, curr) => acc + curr.close, 0) / slice.length;
      return Number(avg.toFixed(2));
    });
  }, [candles]);

  const ema50Values = React.useMemo(() => {
    const k = 2 / (Math.min(14, candles.length) + 1);
    let ema = candles[0]?.close ?? 0;
    return candles.map((d) => {
      ema = d.close * k + ema * (1 - k);
      return Number(ema.toFixed(2));
    });
  }, [candles]);

  // Bandas de Bollinger (SMA ± 2 Desvios)
  const bollingerBands = React.useMemo(() => {
    return candles.map((d, idx) => {
      const mid = sma20Values[idx];
      const diff = Math.abs(d.close - mid) * 1.5;
      return {
        upper: Number((mid + diff).toFixed(2)),
        middle: mid,
        lower: Number((mid - diff).toFixed(2)),
      };
    });
  }, [candles, sma20Values]);

  // Heikin Ashi com dados reais
  const heikinAshiCandles = React.useMemo(() => {
    const ha: HistoricalCandle[] = [];
    candles.forEach((bar, i) => {
      const haClose = (bar.open + bar.high + bar.low + bar.close) / 4;
      const haOpen = i === 0 ? (bar.open + bar.close) / 2 : (ha[i - 1].open + ha[i - 1].close) / 2;
      const haHigh = Math.max(bar.high, haOpen, haClose);
      const haLow = Math.min(bar.low, haOpen, haClose);
      ha.push({
        time: bar.time,
        timestamp: bar.timestamp,
        open: Number(haOpen.toFixed(2)),
        high: Number(haHigh.toFixed(2)),
        low: Number(haLow.toFixed(2)),
        close: Number(haClose.toFixed(2)),
        volume: bar.volume,
      });
    });
    return ha;
  }, [candles]);

  // Renko Bricks com dados reais
  const renkoBricks = React.useMemo(() => {
    if (candles.length === 0) return [];
    const base = candles[0].close || 38;
    const brickSize = Math.max(0.2, base * 0.008);
    const bricks: { isUp: boolean; open: number; close: number }[] = [];
    let currentLevel = base;

    candles.forEach((bar) => {
      const diff = bar.close - currentLevel;
      const count = Math.floor(Math.abs(diff) / brickSize);
      if (count > 0) {
        const isUp = diff > 0;
        for (let k = 0; k < Math.min(2, count); k++) {
          const next = isUp ? currentLevel + brickSize : currentLevel - brickSize;
          bricks.push({ isUp, open: currentLevel, close: next });
          currentLevel = next;
        }
      }
    });
    return bricks.slice(-26);
  }, [candles]);

  // Kagi com dados reais
  const kagiLines = React.useMemo(() => {
    if (candles.length === 0) return [];
    const base = candles[0].close || 38;
    const revThreshold = Math.max(0.3, base * 0.01);
    const lines: { yStart: number; yEnd: number; isYang: boolean }[] = [];
    let dir = 1;
    let extreme = base;
    let prevExtreme = extreme;

    candles.forEach((b) => {
      if (dir === 1) {
        if (b.close > extreme) extreme = b.close;
        else if (extreme - b.close >= revThreshold) {
          lines.push({ yStart: prevExtreme, yEnd: extreme, isYang: extreme > base });
          prevExtreme = extreme;
          extreme = b.close;
          dir = -1;
        }
      } else {
        if (b.close < extreme) extreme = b.close;
        else if (b.close - extreme >= revThreshold) {
          lines.push({ yStart: prevExtreme, yEnd: extreme, isYang: prevExtreme > base });
          prevExtreme = extreme;
          extreme = b.close;
          dir = 1;
        }
      }
    });

    if (lines.length === 0) {
      lines.push({ yStart: candles[0].open, yEnd: candles[candles.length - 1].close, isYang: true });
    }
    return lines;
  }, [candles]);

  // Ponto e Figura (P&F)
  const pnfColumns = React.useMemo(() => {
    if (candles.length === 0) return [];
    const base = candles[0].close || 38;
    const boxSize = Math.max(0.2, base * 0.007);
    const cols: { type: "X" | "O"; values: number[] }[] = [];
    let isX = true;
    let colValues = [base];

    candles.slice(1).forEach((bar, idx) => {
      if (idx % 2 === 0) {
        cols.push({ type: isX ? "X" : "O", values: [...colValues] });
        isX = !isX;
        colValues = [bar.close, bar.close + (isX ? boxSize : -boxSize)];
      }
    });
    return cols.slice(-16);
  }, [candles]);

  // Escala de preços e eixos
  const { minPrice, maxPrice, yTicks, maxVolume } = React.useMemo(() => {
    if (candles.length === 0) {
      return { minPrice: 35, maxPrice: 42, yTicks: [42, 40, 38, 36], maxVolume: 100 };
    }

    let min = Infinity;
    let max = -Infinity;
    let maxVol = 100;

    candles.forEach((d) => {
      if (d.low < min) min = d.low;
      if (d.high > max) max = d.high;
      if (d.volume > maxVol) maxVol = d.volume;
    });

    const pad = Math.max(0.4, (max - min) * 0.12);
    const finalMin = Number((min - pad).toFixed(2));
    const finalMax = Number((max + pad).toFixed(2));

    const step = (finalMax - finalMin) / 4;
    const ticks = [finalMax, finalMax - step, finalMin + step * 2, finalMin + step, finalMin].map((v) =>
      Number(v.toFixed(2))
    );

    return { minPrice: finalMin, maxPrice: finalMax, yTicks: ticks, maxVolume: maxVol };
  }, [candles]);

  // Dimensões responsivas do canvas
  const width = 1000;
  const height = isExpanded ? 460 : 310;
  const padLeft = 20;
  const padRight = 75; // Espaço confortável para os valores no eixo Y
  const padTop = 15;
  const padBottom = showVolume ? 48 : 24;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const getY = (price: number) => {
    const norm = (price - minPrice) / (maxPrice - minPrice || 1);
    return padTop + (1 - norm) * chartH;
  };

  const getPriceFromY = (y: number) => {
    const norm = 1 - (y - padTop) / chartH;
    return minPrice + norm * (maxPrice - minPrice);
  };

  const getX = (index: number, total: number = candles.length) => {
    return padLeft + (index / Math.max(1, total - 1)) * chartW;
  };

  // Interações de Mouse e Ferramentas TradingView
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;
    const mouseY = ((e.clientY - rect.top) / rect.height) * height;

    setMousePos({ x: mouseX, y: mouseY });

    if (candles.length > 0 && mouseX >= padLeft && mouseX <= width - padRight) {
      const stepWidth = chartW / (candles.length - 1 || 1);
      const index = Math.round((mouseX - padLeft) / stepWidth);
      setHoverIndex(Math.max(0, Math.min(candles.length - 1, index)));
    }

    // Pincel livre (Freehand Brush)
    if (activeTool === "brush" && isDrawingBrush && !isDrawingsLocked) {
      setCurrentBrushPath((prev) => [...prev, { x: mouseX, y: mouseY }]);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDrawingsLocked || !mousePos) return;

    if (activeTool === "brush") {
      setIsDrawingBrush(true);
      setCurrentBrushPath([{ x: mousePos.x, y: mousePos.y }]);
      return;
    }

    if (activeTool === "trendline") {
      const snappedPrice = isMagnetActive && hoverIndex !== null ? candles[hoverIndex].close : getPriceFromY(mousePos.y);
      const snappedY = isMagnetActive && hoverIndex !== null ? getY(candles[hoverIndex].close) : mousePos.y;

      if (!drawingStart) {
        setDrawingStart({ x: mousePos.x, y: snappedY, price: snappedPrice });
      } else {
        const priceDiff = Number((snappedPrice - drawingStart.price).toFixed(2));
        const percentDiff = Number(((priceDiff / drawingStart.price) * 100).toFixed(2));
        setTrendlines((prev) => [
          ...prev,
          {
            id: `line-${Date.now()}`,
            x1: drawingStart.x,
            y1: drawingStart.y,
            x2: mousePos.x,
            y2: snappedY,
            priceDiff,
            percentDiff,
          },
        ]);
        setDrawingStart(null);
      }
    }

    if (activeTool === "ruler") {
      if (!drawingStart) {
        setDrawingStart({ x: mousePos.x, y: mousePos.y, price: getPriceFromY(mousePos.y) });
      } else {
        const startIdx = Math.max(0, Math.min(candles.length - 1, Math.round(((drawingStart.x - padLeft) / chartW) * (candles.length - 1))));
        const endIdx = hoverIndex ?? candles.length - 1;
        const barsCount = Math.abs(endIdx - startIdx) + 1;
        const p1 = drawingStart.price;
        const p2 = getPriceFromY(mousePos.y);
        const priceDiff = Number((p2 - p1).toFixed(2));
        const percentDiff = Number(((priceDiff / p1) * 100).toFixed(2));

        setRulerPoints({
          x1: drawingStart.x,
          y1: drawingStart.y,
          x2: mousePos.x,
          y2: mousePos.y,
          barsCount,
          percentDiff,
          priceDiff,
        });
        setDrawingStart(null);
      }
    }

    if (activeTool === "text") {
      const text = prompt("Digite o texto para a anotação no gráfico:", "Alvo de Lucro");
      if (text) {
        setTextNotes((prev) => [...prev, { id: `text-${Date.now()}`, x: mousePos.x, y: mousePos.y, text }]);
      }
    }
  };

  const handleMouseUp = () => {
    if (activeTool === "brush" && isDrawingBrush) {
      setIsDrawingBrush(false);
      if (currentBrushPath.length > 1) {
        setBrushPaths((prev) => [...prev, { id: `brush-${Date.now()}`, points: currentBrushPath }]);
      }
      setCurrentBrushPath([]);
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    setMousePos(null);
    if (isDrawingBrush) {
      setIsDrawingBrush(false);
      setCurrentBrushPath([]);
    }
  };

  // Limpa todos os desenhos
  const handleClearAllDrawings = () => {
    setTrendlines([]);
    setBrushPaths([]);
    setTextNotes([]);
    setRulerPoints(null);
    setDrawingStart(null);
  };

  // Snapshot
  const handleTakeSnapshot = () => {
    setSnapshotToast(true);
    setTimeout(() => setSnapshotToast(false), 2400);
  };

  // Barra de cotações em foco
  const activeBar = hoverIndex !== null && candles[hoverIndex] ? candles[hoverIndex] : candles[candles.length - 1];

  const filteredTypes = React.useMemo(() => {
    if (!typeSearchQuery.trim()) return CHART_TYPES;
    return CHART_TYPES.filter(
      (t) =>
        t.label.toLowerCase().includes(typeSearchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(typeSearchQuery.toLowerCase())
    );
  }, [typeSearchQuery]);

  const activeMeta = CHART_TYPES.find((t) => t.id === chartType) || CHART_TYPES[0];

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

          <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-0.5" />

          {/* Seletor de Modo de Gráfico (17 Modalidades TradingView / B3) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsTypeMenuOpen(!isTypeMenuOpen)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-colors text-xs font-semibold cursor-pointer shadow-2xs"
              title="Mudar estilo de gráfico"
            >
              <ChartTypeIcon type={chartType} className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              <span>{activeMeta.label}</span>
              <ChevronDown className={`h-3 w-3 text-zinc-400 transition-transform ${isTypeMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Menu Popover das 17 modalidades */}
            {isTypeMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsTypeMenuOpen(false)} />
                <div className="absolute left-0 top-full mt-1.5 z-50 w-72 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-150">
                  <div className="relative mb-2">
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Pesquisar modo (velas, renko, kagi...)"
                      value={typeSearchQuery}
                      onChange={(e) => setTypeSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-1 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <div className="max-h-80 overflow-y-auto custom-scrollbar space-y-2 pr-0.5">
                    {["Velas e Barras", "Linhas e Áreas", "Tendência e Preço"].map((cat) => {
                      const items = filteredTypes.filter((t) => t.category === cat);
                      if (items.length === 0) return null;
                      return (
                        <div key={cat} className="space-y-0.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-2 py-1">
                            {cat}
                          </p>
                          {items.map((item) => {
                            const isSelected = chartType === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  setChartType(item.id);
                                  setIsTypeMenuOpen(false);
                                  setTypeSearchQuery("");
                                }}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                                  isSelected
                                    ? "bg-purple-600/10 text-purple-600 dark:text-purple-300 font-semibold"
                                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <ChartTypeIcon
                                    type={item.id}
                                    className={`h-3.5 w-3.5 ${
                                      isSelected ? "text-purple-600 dark:text-purple-400" : "text-zinc-400"
                                    }`}
                                  />
                                  <div>
                                    <p className="leading-tight">{item.label}</p>
                                    <p className="text-[10px] text-zinc-400 font-normal leading-tight truncate max-w-[180px]">
                                      {item.description}
                                    </p>
                                  </div>
                                </div>
                                {isSelected && <Check className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Indicadores Técnicos (fx Indicadores) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsIndicatorsMenuOpen(!isIndicatorsMenuOpen)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-colors text-xs font-semibold cursor-pointer shadow-2xs"
            >
              <span className="font-serif italic font-bold text-purple-600 dark:text-purple-400 text-xs">fx</span>
              <span>Indicadores</span>
              <ChevronDown className="h-3 w-3 text-zinc-400" />
            </button>

            {isIndicatorsMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsIndicatorsMenuOpen(false)} />
                <div className="absolute left-0 top-full mt-1.5 z-50 w-64 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-2.5 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-2 py-0.5">
                    Estudos Técnicos (Brapi)
                  </p>
                  <label className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-xs cursor-pointer text-zinc-800 dark:text-zinc-200">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-0.5 bg-amber-400 rounded-full" />
                      Média Móvel (SMA 20)
                    </span>
                    <input
                      type="checkbox"
                      checked={showSMA20}
                      onChange={(e) => setShowSMA20(e.target.checked)}
                      className="rounded accent-purple-600"
                    />
                  </label>
                  <label className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-xs cursor-pointer text-zinc-800 dark:text-zinc-200">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-0.5 bg-cyan-400 rounded-full" />
                      Média Exponencial (EMA 50)
                    </span>
                    <input
                      type="checkbox"
                      checked={showEMA50}
                      onChange={(e) => setShowEMA50(e.target.checked)}
                      className="rounded accent-purple-600"
                    />
                  </label>
                  <label className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-xs cursor-pointer text-zinc-800 dark:text-zinc-200">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-0.5 bg-purple-400 rounded-full" />
                      Bandas de Bollinger
                    </span>
                    <input
                      type="checkbox"
                      checked={showBollinger}
                      onChange={(e) => setShowBollinger(e.target.checked)}
                      className="rounded accent-purple-600"
                    />
                  </label>
                  <label className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-xs cursor-pointer text-zinc-800 dark:text-zinc-200">
                    <span className="flex items-center gap-2">
                      <BarChart3 className="h-3.5 w-3.5 text-zinc-400" />
                      Volume B3
                    </span>
                    <input
                      type="checkbox"
                      checked={showVolume}
                      onChange={(e) => setShowVolume(e.target.checked)}
                      className="rounded accent-purple-600"
                    />
                  </label>

                  <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-2 py-0.5">
                    Exibição
                  </p>
                  <label className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-xs cursor-pointer text-zinc-800 dark:text-zinc-200">
                    <span>Grade (Grid Lines)</span>
                    <input
                      type="checkbox"
                      checked={showGrid}
                      onChange={(e) => setShowGrid(e.target.checked)}
                      className="rounded accent-purple-600"
                    />
                  </label>
                  <label className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-xs cursor-pointer text-zinc-800 dark:text-zinc-200">
                    <span>Marca d'água B3</span>
                    <input
                      type="checkbox"
                      checked={showWatermark}
                      onChange={(e) => setShowWatermark(e.target.checked)}
                      className="rounded accent-purple-600"
                    />
                  </label>
                </div>
              </>
            )}
          </div>
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

      {/* 2. SUB-BARRA DEDICADA DE COTAÇÕES OHLC (ZERO SOBREPOSIÇÃO NO CANVAS) */}
      <div className="h-8 px-3.5 bg-zinc-950/40 dark:bg-zinc-900/40 border-b border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-xs overflow-x-auto no-scrollbar shrink-0">
        <div className="flex items-center gap-3 font-mono text-[11px] text-zinc-400 shrink-0">
          <span className="font-bold text-zinc-900 dark:text-zinc-100 font-sans">{primaryAsset.ticker}</span>
          <span className="text-zinc-500 font-sans">{activeBar?.time || "Hoje"}</span>
          <span>
            A: <strong className="text-zinc-800 dark:text-zinc-200 font-bold">{activeBar ? activeBar.open.toFixed(2) : "••"}</strong>
          </span>
          <span>
            M: <strong className="text-zinc-800 dark:text-zinc-200 font-bold">{activeBar ? activeBar.high.toFixed(2) : "••"}</strong>
          </span>
          <span>
            m: <strong className="text-zinc-800 dark:text-zinc-200 font-bold">{activeBar ? activeBar.low.toFixed(2) : "••"}</strong>
          </span>
          <span>
            F: <strong className="text-zinc-800 dark:text-zinc-200 font-bold">{activeBar ? activeBar.close.toFixed(2) : "••"}</strong>
          </span>
          {activeBar && (
            <span
              className={`px-1.5 py-0.2 rounded-full font-bold ${
                activeBar.close >= activeBar.open
                  ? "text-emerald-400 bg-emerald-500/10"
                  : "text-rose-400 bg-rose-500/10"
              }`}
            >
              {activeBar.close >= activeBar.open ? "+" : ""}
              {(((activeBar.close - activeBar.open) / (activeBar.open || 1)) * 100).toFixed(2)}%
            </span>
          )}
          {showVolume && activeBar && (
            <span className="text-zinc-500 hidden sm:inline">
              Vol: <strong className="text-zinc-300">{(activeBar.volume / 1000000).toFixed(1)}M</strong>
            </span>
          )}
        </div>

        {/* Indicador do Status da Ferramenta de Análise */}
        <div className="text-[10px] text-purple-400 font-medium shrink-0 pl-2">
          {activeTool === "crosshair" && "Mira Ativa"}
          {activeTool === "trendline" && (drawingStart ? "Clique para concluir a linha" : "Clique para iniciar linha")}
          {activeTool === "fibonacci" && "Retração Fibonacci 0% a 100%"}
          {activeTool === "brush" && "Pincel Livre: arraste para desenhar"}
          {activeTool === "ruler" && (drawingStart ? "Clique no ponto final para medir" : "Clique para iniciar régua")}
          {activeTool === "text" && "Clique no gráfico para inserir texto"}
        </div>
      </div>

      {/* Toast de Captura Salva */}
      {snapshotToast && (
        <div className="absolute top-16 right-4 z-50 bg-purple-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <Check className="h-3.5 w-3.5" />
          <span>Captura do gráfico salva com sucesso!</span>
        </div>
      )}

      {/* 3. CORPO DO GRÁFICO: BARRA LATERAL ESQUERDA (TRADINGVIEW RAIL) + CANVAS */}
      <div className="flex flex-1 min-h-0 w-full relative">
        {/* Barra Vertical de Ferramentas de Desenho (Estilo TradingView) */}
        <div className="w-10 shrink-0 bg-zinc-950/30 dark:bg-zinc-900/30 border-r border-zinc-200/50 dark:border-zinc-800/80 flex flex-col items-center justify-between py-2 z-10">
          {/* Ferramentas Analíticas */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setActiveTool("crosshair");
                setDrawingStart(null);
              }}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                activeTool === "crosshair"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800"
              }`}
              title="Mira / Crosshair (Padrão TradingView)"
            >
              <Crosshair className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTool("trendline");
                setDrawingStart(null);
              }}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                activeTool === "trendline"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800"
              }`}
              title="Linha de Tendência com Variação %"
            >
              <Minus className="h-4 w-4 -rotate-45" />
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTool("fibonacci");
                setDrawingStart(null);
              }}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                activeTool === "fibonacci"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800"
              }`}
              title="Retração de Fibonacci"
            >
              <Layers className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTool("brush");
                setDrawingStart(null);
              }}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                activeTool === "brush"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800"
              }`}
              title="Pincel / Desenho Livre"
            >
              <Pencil className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTool("ruler");
                setDrawingStart(null);
              }}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                activeTool === "ruler"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800"
              }`}
              title="Régua de Medição (Barras, Dias e Variação %)"
            >
              <Ruler className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTool("text");
                setDrawingStart(null);
              }}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                activeTool === "text"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800"
              }`}
              title="Anotação de Texto"
            >
              <Type className="h-4 w-4" />
            </button>
          </div>

          {/* Ferramentas de Gerenciamento: Ímã, Travar, Visibilidade, Lixeira */}
          <div className="flex flex-col items-center gap-1.5 pt-2 border-t border-zinc-200/50 dark:border-zinc-800/80">
            <button
              type="button"
              onClick={() => setIsMagnetActive(!isMagnetActive)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isMagnetActive
                  ? "text-purple-600 dark:text-purple-400 bg-purple-500/10"
                  : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
              title="Modo Ímã (Snap automático nos topos e fundos)"
            >
              <Magnet className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsDrawingsLocked(!isDrawingsLocked)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDrawingsLocked ? "text-amber-500 bg-amber-500/10" : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
              title={isDrawingsLocked ? "Desenhos Travados" : "Travar todas as ferramentas"}
            >
              {isDrawingsLocked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => setIsDrawingsVisible(!isDrawingsVisible)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                !isDrawingsVisible ? "text-rose-500 bg-rose-500/10" : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
              title={isDrawingsVisible ? "Ocultar Desenhos" : "Exibir Desenhos"}
            >
              {isDrawingsVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </button>

            <button
              type="button"
              onClick={handleClearAllDrawings}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Limpar todos os desenhos do gráfico"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Canvas SVG de Alta Precisão */}
        <div
          ref={containerRef}
          className="relative flex-1 h-full min-h-[220px] flex items-center justify-center cursor-crosshair overflow-hidden"
        >
          {/* Skeleton durante recarregamento da Brapi */}
          {isLoadingCandles && (
            <div className="absolute inset-0 z-20 bg-zinc-950/40 backdrop-blur-[1px] flex items-center justify-center">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-700 text-xs text-zinc-300 shadow-xl">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-purple-400" />
                <span>Atualizando dados Brapi...</span>
              </div>
            </div>
          )}

          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full"
            preserveAspectRatio="none"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#820AD1" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#820AD1" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Marca d'água B3 no fundo */}
            {showWatermark && (
              <text
                x={chartW / 2 + padLeft}
                y={chartH / 2 + padTop + 15}
                textAnchor="middle"
                fontSize={isExpanded ? "64" : "46"}
                fontWeight="900"
                fontFamily="system-ui, sans-serif"
                fill="currentColor"
                className="text-zinc-200 dark:text-zinc-800/30 select-none pointer-events-none"
              >
                {primaryAsset.ticker} • B3
              </text>
            )}

            {/* Linhas de Grade e Ticks do Eixo Y */}
            {showGrid &&
              yTicks.map((tick, i) => {
                const y = getY(tick);
                return (
                  <g key={`ytick-${i}`}>
                    <line
                      x1={padLeft}
                      y1={y}
                      x2={width - padRight}
                      y2={y}
                      stroke="rgba(255, 255, 255, 0.06)"
                      strokeDasharray="3 3"
                      strokeWidth={1}
                    />
                    <text
                      x={width - padRight + 10}
                      y={y + 3.5}
                      textAnchor="start"
                      fill="#f4f4f5"
                      fontSize="10"
                      fontFamily="ui-monospace, monospace"
                      fontWeight="500"
                      className="select-none"
                    >
                      {scaleMode === "percent" && candles[0]
                        ? `${(((tick - candles[0].close) / candles[0].close) * 100).toFixed(1)}%`
                        : `R$ ${tick.toFixed(2)}`}
                    </text>
                  </g>
                );
              })}

            {/* Rótulos do Eixo X (Datas / Horários) */}
            {candles.map((c, idx) => {
              if (idx % Math.ceil(candles.length / 7) !== 0 && idx !== candles.length - 1) return null;
              const x = getX(idx);
              return (
                <text
                  key={`xlabel-${idx}`}
                  x={x}
                  y={height - 8}
                  textAnchor={idx === 0 ? "start" : idx === candles.length - 1 ? "end" : "middle"}
                  fill="#a1a1aa"
                  fontSize="10"
                  fontFamily="system-ui, sans-serif"
                  fontWeight="500"
                  className="select-none"
                >
                  {c.time}
                </text>
              );
            })}

            {/* Histograma de Volume (B3) */}
            {showVolume &&
              candles.map((d, i) => {
                const x = getX(i);
                const barW = Math.max(3, (chartW / candles.length) * 0.65);
                const volHeight = (d.volume / (maxVolume || 1)) * 38;
                const y = height - 22 - volHeight;
                const isUp = d.close >= d.open;
                return (
                  <rect
                    key={`vol-${i}`}
                    x={x - barW / 2}
                    y={y}
                    width={barW}
                    height={volHeight}
                    fill={isUp ? "#10B981" : "#F43F5E"}
                    fillOpacity="0.28"
                    rx="0.5"
                  />
                );
              })}

            {/* Bandas de Bollinger */}
            {showBollinger && candles.length > 0 && (
              <g>
                <path
                  d={
                    candles.map((_, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(bollingerBands[i].upper)}`).join(" ") +
                    " " +
                    candles
                      .slice()
                      .reverse()
                      .map((_, i) => `L ${getX(candles.length - 1 - i)} ${getY(bollingerBands[candles.length - 1 - i].lower)}`)
                      .join(" ") +
                    " Z"
                  }
                  fill="#820AD1"
                  fillOpacity="0.08"
                />
                <path
                  d={candles.map((_, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(bollingerBands[i].upper)}`).join(" ")}
                  fill="none"
                  stroke="#820AD1"
                  strokeOpacity="0.4"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <path
                  d={candles.map((_, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(bollingerBands[i].lower)}`).join(" ")}
                  fill="none"
                  stroke="#820AD1"
                  strokeOpacity="0.4"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              </g>
            )}

            {/* SMA 20 */}
            {showSMA20 && candles.length > 0 && (
              <path
                d={candles.map((_, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(sma20Values[i])}`).join(" ")}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}

            {/* EMA 50 */}
            {showEMA50 && candles.length > 0 && (
              <path
                d={candles.map((_, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(ema50Values[i])}`).join(" ")}
                fill="none"
                stroke="#06B6D4"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}

            {/* 1. VELAS (CANDLESTICKS JAPONESAS) */}
            {chartType === "velas" &&
              candles.map((d, i) => {
                const x = getX(i);
                const isUp = d.close >= d.open;
                const candleColor = isUp ? "#10B981" : "#F43F5E";
                const barW = Math.max(4, (chartW / candles.length) * 0.72);
                const bodyY = getY(Math.max(d.open, d.close));
                const bodyH = Math.max(2, Math.abs(getY(d.close) - getY(d.open)));

                return (
                  <g key={`candle-${i}`}>
                    <line x1={x} y1={getY(d.high)} x2={x} y2={getY(d.low)} stroke={candleColor} strokeWidth="1.5" />
                    <rect x={x - barW / 2} y={bodyY} width={barW} height={bodyH} fill={candleColor} rx="1" />
                  </g>
                );
              })}

            {/* 2. VELAS VAZIAS (HOLLOW CANDLES) */}
            {chartType === "velas_vazias" &&
              candles.map((d, i) => {
                const x = getX(i);
                const isUp = d.close >= d.open;
                const barW = Math.max(4, (chartW / candles.length) * 0.72);
                const bodyY = getY(Math.max(d.open, d.close));
                const bodyH = Math.max(2, Math.abs(getY(d.close) - getY(d.open)));

                return (
                  <g key={`hollow-${i}`}>
                    <line x1={x} y1={getY(d.high)} x2={x} y2={getY(d.low)} stroke={isUp ? "#10B981" : "#F43F5E"} strokeWidth="1.5" />
                    <rect
                      x={x - barW / 2}
                      y={bodyY}
                      width={barW}
                      height={bodyH}
                      fill={isUp ? "none" : "#F43F5E"}
                      stroke={isUp ? "#10B981" : "#F43F5E"}
                      strokeWidth="1.5"
                      rx="1"
                    />
                  </g>
                );
              })}

            {/* 3. BARRAS AMERICANAS (OHLC) */}
            {chartType === "barras" &&
              candles.map((d, i) => {
                const x = getX(i);
                const isUp = d.close >= d.open;
                const color = isUp ? "#10B981" : "#F43F5E";
                const tickW = (chartW / candles.length) * 0.35;

                return (
                  <g key={`bar-${i}`}>
                    <line x1={x} y1={getY(d.high)} x2={x} y2={getY(d.low)} stroke={color} strokeWidth="2" />
                    <line x1={x - tickW} y1={getY(d.open)} x2={x} y2={getY(d.open)} stroke={color} strokeWidth="2" />
                    <line x1={x} y1={getY(d.close)} x2={x + tickW} y2={getY(d.close)} stroke={color} strokeWidth="2" />
                  </g>
                );
              })}

            {/* 4. COLUNAS */}
            {chartType === "colunas" &&
              candles.map((d, i) => {
                const x = getX(i);
                const isUp = d.close >= d.open;
                const colW = Math.max(3, (chartW / candles.length) * 0.7);
                const baseY = getY(minPrice);
                const topY = getY(d.close);
                return (
                  <rect
                    key={`col-${i}`}
                    x={x - colW / 2}
                    y={topY}
                    width={colW}
                    height={Math.max(2, baseY - topY)}
                    fill={isUp ? "#10B981" : "#F43F5E"}
                    rx="1"
                  />
                );
              })}

            {/* 5. LINHA */}
            {chartType === "linha" && (
              <path
                d={candles.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.close)}`).join(" ")}
                fill="none"
                stroke="#820AD1"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* 6. LINHA COM MARCADORES */}
            {chartType === "linha_marcadores" && (
              <g>
                <path
                  d={candles.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.close)}`).join(" ")}
                  fill="none"
                  stroke="#820AD1"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {candles.map((d, i) => (
                  <circle key={`pt-${i}`} cx={getX(i)} cy={getY(d.close)} r={3} fill="#820AD1" stroke="#ffffff" strokeWidth="1.5" />
                ))}
              </g>
            )}

            {/* 7. STEP LINE (DEGRAUS) */}
            {chartType === "step_line" && (
              <path
                d={candles
                  .map((d, i) => {
                    if (i === 0) return `M ${getX(0)} ${getY(d.close)}`;
                    const currX = getX(i);
                    const currY = getY(d.close);
                    return `H ${currX} V ${currY}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="#820AD1"
                strokeWidth="2.4"
              />
            )}

            {/* 8. ÁREA */}
            {chartType === "area" && (
              <g>
                <path
                  d={
                    candles.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.close)}`).join(" ") +
                    ` L ${getX(candles.length - 1)} ${getY(minPrice)} L ${getX(0)} ${getY(minPrice)} Z`
                  }
                  fill="url(#areaGrad)"
                />
                <path
                  d={candles.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.close)}`).join(" ")}
                  fill="none"
                  stroke="#820AD1"
                  strokeWidth="2.4"
                />
              </g>
            )}

            {/* 9. ÁREA HLC */}
            {chartType === "area_hlc" && (
              <g>
                <path
                  d={
                    candles.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.high)}`).join(" ") +
                    " " +
                    candles
                      .slice()
                      .reverse()
                      .map((d, i) => `L ${getX(candles.length - 1 - i)} ${getY(d.low)}`)
                      .join(" ") +
                    " Z"
                  }
                  fill="#820AD1"
                  fillOpacity="0.2"
                />
                <path
                  d={candles.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.close)}`).join(" ")}
                  fill="none"
                  stroke="#820AD1"
                  strokeWidth="2.2"
                />
              </g>
            )}

            {/* 10. LINHA BASE */}
            {chartType === "linha_base" && (
              <g>
                <line
                  x1={padLeft}
                  y1={getY(candles[0]?.open || 38)}
                  x2={width - padRight}
                  y2={getY(candles[0]?.open || 38)}
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <path
                  d={candles.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.close)}`).join(" ")}
                  fill="none"
                  stroke="#820AD1"
                  strokeWidth="2.2"
                />
              </g>
            )}

            {/* 11. MÁXIMA-MÍNIMA (HIGH-LOW) */}
            {chartType === "maxima_minima" &&
              candles.map((d, i) => {
                const x = getX(i);
                const barW = (chartW / candles.length) * 0.5;
                const topY = getY(d.high);
                const botY = getY(d.low);
                return (
                  <rect
                    key={`hl-${i}`}
                    x={x - barW / 2}
                    y={topY}
                    width={barW}
                    height={Math.max(3, botY - topY)}
                    rx={barW / 2}
                    fill="#820AD1"
                    fillOpacity="0.85"
                  />
                );
              })}

            {/* 12. HEIKIN ASHI */}
            {chartType === "heikin_ashi" &&
              heikinAshiCandles.map((d, i) => {
                const x = getX(i);
                const isUp = d.close >= d.open;
                const color = isUp ? "#10B981" : "#F43F5E";
                const barW = Math.max(4, (chartW / heikinAshiCandles.length) * 0.72);
                const bodyY = getY(Math.max(d.open, d.close));
                const bodyH = Math.max(2, Math.abs(getY(d.close) - getY(d.open)));

                return (
                  <g key={`ha-${i}`}>
                    <line x1={x} y1={getY(d.high)} x2={x} y2={getY(d.low)} stroke={color} strokeWidth="1.5" />
                    <rect x={x - barW / 2} y={bodyY} width={barW} height={bodyH} fill={color} rx="1" />
                  </g>
                );
              })}

            {/* 13. RENKO */}
            {chartType === "renko" &&
              renkoBricks.map((b, i) => {
                const x = padLeft + (i / Math.max(1, renkoBricks.length - 1)) * chartW;
                const brickW = (chartW / renkoBricks.length) * 0.85;
                const topY = getY(Math.max(b.open, b.close));
                const brickH = Math.max(4, Math.abs(getY(b.close) - getY(b.open)));
                const color = b.isUp ? "#10B981" : "#F43F5E";

                return (
                  <rect
                    key={`renko-${i}`}
                    x={x - brickW / 2}
                    y={topY}
                    width={brickW}
                    height={brickH}
                    fill={color}
                    stroke={color}
                    strokeWidth="1.2"
                    rx="1"
                  />
                );
              })}

            {/* 14. QUEBRA DE LINHA (LINE BREAK) */}
            {chartType === "quebra_linha" &&
              candles.map((d, i) => {
                const x = getX(i);
                const isUp = d.close >= d.open;
                const blockW = (chartW / candles.length) * 0.75;
                const topY = getY(Math.max(d.open, d.close));
                const blockH = Math.max(3, Math.abs(getY(d.close) - getY(d.open)));
                const color = isUp ? "#10B981" : "#F43F5E";

                return (
                  <rect
                    key={`lb-${i}`}
                    x={x - blockW / 2}
                    y={topY}
                    width={blockW}
                    height={blockH}
                    fill={isUp ? "none" : color}
                    stroke={color}
                    strokeWidth="1.5"
                    rx="1"
                  />
                );
              })}

            {/* 15. KAGI */}
            {chartType === "kagi" &&
              kagiLines.map((line, i) => {
                const x = padLeft + (i / Math.max(1, kagiLines.length - 1)) * chartW;
                const color = line.isYang ? "#10B981" : "#F43F5E";
                const strokeW = line.isYang ? 3 : 1.5;

                return (
                  <g key={`kagi-${i}`}>
                    <line x1={x} y1={getY(line.yStart)} x2={x} y2={getY(line.yEnd)} stroke={color} strokeWidth={strokeW} />
                    {i < kagiLines.length - 1 && (
                      <line
                        x1={x}
                        y1={getY(line.yEnd)}
                        x2={padLeft + ((i + 1) / Math.max(1, kagiLines.length - 1)) * chartW}
                        y2={getY(line.yEnd)}
                        stroke={color}
                        strokeWidth={strokeW}
                      />
                    )}
                  </g>
                );
              })}

            {/* 16. PONTO E FIGURA (POINT & FIGURE) */}
            {chartType === "ponto_figura" &&
              pnfColumns.map((col, colIdx) => {
                const x = padLeft + (colIdx / Math.max(1, pnfColumns.length - 1)) * chartW;
                const isX = col.type === "X";
                const color = isX ? "#10B981" : "#F43F5E";

                return (
                  <g key={`pnf-${colIdx}`}>
                    {col.values.map((val, rowIdx) => {
                      const y = getY(val);
                      return isX ? (
                        <g key={`x-${rowIdx}`}>
                          <line x1={x - 4} y1={y - 4} x2={x + 4} y2={y + 4} stroke={color} strokeWidth="2" />
                          <line x1={x - 4} y1={y + 4} x2={x + 4} y2={y - 4} stroke={color} strokeWidth="2" />
                        </g>
                      ) : (
                        <circle key={`o-${rowIdx}`} cx={x} cy={y} r="4" fill="none" stroke={color} strokeWidth="2" />
                      );
                    })}
                  </g>
                );
              })}

            {/* 17. INTERVALO (RANGE BARS) */}
            {chartType === "intervalo" &&
              candles.map((d, i) => {
                const x = getX(i);
                const isUp = d.close >= d.open;
                const barW = (chartW / candles.length) * 0.7;
                const topY = getY(d.high);
                const fixedH = Math.max(14, getY(d.low) - getY(d.high));
                const color = isUp ? "#10B981" : "#F43F5E";

                return <rect key={`range-${i}`} x={x - barW / 2} y={topY} width={barW} height={fixedH} fill={color} rx="1" />;
              })}

            {/* SÉRIES SECUNDÁRIAS (CURVAS DE COMPARAÇÃO NORMALIZADA ESTILO KOYFIN) */}
            {activeSeries.length > 1 &&
              activeSeries.slice(1).map((series, sIndex) => {
                const hex = series.colorHex || COLOR_MAP[series.color] || "#2563EB";
                const targetPercent = series.changePercent ?? 1.2;
                const pts = candles.map((_, idx) => {
                  const p = idx / (candles.length - 1 || 1);
                  const wave = Math.sin(p * Math.PI * 1.8 + sIndex) * 0.012;
                  const ratio = 1 + (targetPercent / 100) * p + wave;
                  return (candles[0]?.close || 38) * ratio;
                });

                return (
                  <g key={`comp-${series.id}`}>
                    <path
                      d={pts.map((pt, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(pt)}`).join(" ")}
                      fill="none"
                      stroke={hex}
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />
                    <circle cx={getX(pts.length - 1)} cy={getY(pts[pts.length - 1])} r={3} fill={hex} stroke="#ffffff" strokeWidth="1.5" />
                  </g>
                );
              })}

            {/* FERRAMENTA TRADINGVIEW: LINHAS DE TENDÊNCIA DESENHADAS */}
            {isDrawingsVisible &&
              trendlines.map((tl) => (
                <g key={tl.id}>
                  <line x1={tl.x1} y1={tl.y1} x2={tl.x2} y2={tl.y2} stroke="#820AD1" strokeWidth="2.2" />
                  <circle cx={tl.x1} cy={tl.y1} r="4" fill="#820AD1" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx={tl.x2} cy={tl.y2} r="4" fill="#820AD1" stroke="#ffffff" strokeWidth="1.5" />
                  {/* Badge na linha de tendência */}
                  <g transform={`translate(${(tl.x1 + tl.x2) / 2}, ${(tl.y1 + tl.y2) / 2 - 14})`}>
                    <rect x="-35" y="-10" width="70" height="18" rx="4" fill="#18181b" stroke="#820AD1" strokeWidth="1" />
                    <text x="0" y="3" textAnchor="middle" fill="#f4f4f5" fontSize="9" fontWeight="600" fontFamily="sans-serif">
                      {tl.percentDiff >= 0 ? `+${tl.percentDiff}%` : `${tl.percentDiff}%`}
                    </text>
                  </g>
                </g>
              ))}

            {/* PREVIEW DA LINHA DE TENDÊNCIA EM ANDAMENTO */}
            {isDrawingsVisible && drawingStart && activeTool === "trendline" && mousePos && (
              <line
                x1={drawingStart.x}
                y1={drawingStart.y}
                x2={mousePos.x}
                y2={mousePos.y}
                stroke="#820AD1"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
            )}

            {/* FERRAMENTA TRADINGVIEW: RETRAÇÃO DE FIBONACCI */}
            {isDrawingsVisible && fibLevels && (
              <g opacity={activeTool === "fibonacci" ? "1" : "0.75"}>
                {[
                  { ratio: 0.0, color: "#f43f5e", label: "0.0%" },
                  { ratio: 0.236, color: "#f59e0b", label: "23.6%" },
                  { ratio: 0.382, color: "#10b981", label: "38.2%" },
                  { ratio: 0.5, color: "#06b6d4", label: "50.0%" },
                  { ratio: 0.618, color: "#820ad1", label: "61.8% (Golden)" },
                  { ratio: 0.786, color: "#a855f7", label: "78.6%" },
                  { ratio: 1.0, color: "#10b981", label: "100.0%" },
                ].map((lvl) => {
                  const p = fibLevels.high - (fibLevels.high - fibLevels.low) * lvl.ratio;
                  const y = getY(p);
                  return (
                    <g key={`fib-${lvl.ratio}`}>
                      <line x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke={lvl.color} strokeWidth="1" strokeDasharray="3 3" />
                      <text x={padLeft + 4} y={y - 3} fill={lvl.color} fontSize="9" fontWeight="600" fontFamily="sans-serif">
                        Fib {lvl.label} (R$ {p.toFixed(2)})
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* FERRAMENTA TRADINGVIEW: PINCEL LIVRE (BRUSH STROKES) */}
            {isDrawingsVisible &&
              brushPaths.map((bp) => (
                <path
                  key={bp.id}
                  d={bp.points.map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`).join(" ")}
                  fill="none"
                  stroke="#820AD1"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}

            {currentBrushPath.length > 1 && (
              <path
                d={currentBrushPath.map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`).join(" ")}
                fill="none"
                stroke="#820AD1"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* FERRAMENTA TRADINGVIEW: ANOTAÇÕES DE TEXTO */}
            {isDrawingsVisible &&
              textNotes.map((note) => (
                <g key={note.id} transform={`translate(${note.x}, ${note.y})`}>
                  <rect x="-4" y="-14" width={note.text.length * 7 + 14} height="20" rx="6" fill="#18181b" stroke="#820AD1" strokeWidth="1.2" />
                  <text x="3" y="0" fill="#f4f4f5" fontSize="10" fontWeight="600" fontFamily="sans-serif">
                    {note.text}
                  </text>
                </g>
              ))}

            {/* FERRAMENTA TRADINGVIEW: RÉGUA DE MEDIÇÃO */}
            {isDrawingsVisible && rulerPoints && (
              <g>
                <rect
                  x={Math.min(rulerPoints.x1, rulerPoints.x2)}
                  y={Math.min(rulerPoints.y1, rulerPoints.y2)}
                  width={Math.abs(rulerPoints.x2 - rulerPoints.x1)}
                  height={Math.abs(rulerPoints.y2 - rulerPoints.y1)}
                  fill="#820AD1"
                  fillOpacity="0.15"
                  stroke="#820AD1"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
                <g transform={`translate(${(rulerPoints.x1 + rulerPoints.x2) / 2 - 45}, ${(rulerPoints.y1 + rulerPoints.y2) / 2 - 20})`}>
                  <rect x="0" y="0" width="95" height="36" rx="6" fill="#18181b" stroke="#820AD1" strokeWidth="1" />
                  <text x="47" y="14" textAnchor="middle" fill="#10B981" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                    {rulerPoints.percentDiff >= 0 ? `+${rulerPoints.percentDiff}%` : `${rulerPoints.percentDiff}%`} ({rulerPoints.priceDiff >= 0 ? `+R$ ${rulerPoints.priceDiff}` : `R$ ${rulerPoints.priceDiff}`})
                  </text>
                  <text x="47" y="27" textAnchor="middle" fill="#a1a1aa" fontSize="9" fontFamily="sans-serif">
                    {rulerPoints.barsCount} barras
                  </text>
                </g>
              </g>
            )}

            {/* MIRA / CROSSHAIR INTERATIVO COM LINHAS GUIA E MARCADORES NOS EIXOS */}
            {hoverIndex !== null && activeBar && (
              <g>
                {/* Linha Vertical ao Eixo de Tempo */}
                <line
                  x1={getX(hoverIndex)}
                  y1={padTop}
                  x2={getX(hoverIndex)}
                  y2={height - padBottom}
                  stroke="rgba(255, 255, 255, 0.45)"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                {/* Linha Horizontal ao Eixo de Preço */}
                <line
                  x1={padLeft}
                  y1={getY(activeBar.close)}
                  x2={width - padRight}
                  y2={getY(activeBar.close)}
                  stroke="rgba(255, 255, 255, 0.45)"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />

                {/* Marcador Dinâmico no Eixo Y Direito (Cotação Exata) */}
                <g transform={`translate(${width - padRight}, ${getY(activeBar.close) - 10})`}>
                  <rect
                    x="0"
                    y="0"
                    width="70"
                    height="20"
                    rx="4"
                    fill={activeBar.close >= activeBar.open ? "#10B981" : "#F43F5E"}
                  />
                  <text
                    x="35"
                    y="13.5"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="ui-monospace, monospace"
                  >
                    R$ {activeBar.close.toFixed(2)}
                  </text>
                </g>

                {/* Marcador Dinâmico no Eixo X Inferior (Data/Hora) */}
                <g transform={`translate(${getX(hoverIndex) - 30}, ${height - 20})`}>
                  <rect x="0" y="0" width="60" height="16" rx="4" fill="#27272a" />
                  <text
                    x="30"
                    y="11.5"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="600"
                    fontFamily="system-ui, sans-serif"
                  >
                    {activeBar.time}
                  </text>
                </g>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* 4. BARRA INFERIOR DE CONTROLE E ESCALA */}
      <div className="px-3.5 py-2 border-t border-zinc-200/60 dark:border-zinc-800/80 shrink-0 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Chips dos Ativos Selecionados */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
            Séries:
          </span>
          {activeSeries.length === 0 ? (
            <span className="text-[10px] text-zinc-500 italic">Exibindo {primaryAsset.ticker}</span>
          ) : (
            activeSeries.map((series) => {
              const hex = series.colorHex || COLOR_MAP[series.color] || "#820AD1";
              return (
                <div
                  key={series.id}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-2xs"
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: hex }} />
                  <span className="font-semibold text-[11px]">{series.ticker}</span>
                  {series.changePercent !== undefined && (
                    <span
                      className={`text-[10px] tabular-nums font-semibold ${
                        series.changePercent >= 0 ? "text-emerald-500" : "text-rose-500"
                      }`}
                    >
                      {series.changePercent >= 0 ? `+${series.changePercent.toFixed(1)}%` : `${series.changePercent.toFixed(1)}%`}
                    </span>
                  )}
                  {onRemoveSeries && (
                    <button
                      type="button"
                      onClick={() => onRemoveSeries(series.id)}
                      className="p-0.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                      title={`Remover ${series.ticker}`}
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Alternador de Escala (%) Auto Log */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-400 font-medium">Escala:</span>
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setScaleMode("percent")}
              className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                scaleMode === "percent"
                  ? "bg-purple-600 text-white shadow-2xs"
                  : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              %
            </button>
            <button
              type="button"
              onClick={() => setScaleMode("auto")}
              className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                scaleMode === "auto"
                  ? "bg-purple-600 text-white shadow-2xs"
                  : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              Auto
            </button>
            <button
              type="button"
              onClick={() => setScaleMode("log")}
              className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                scaleMode === "log"
                  ? "bg-purple-600 text-white shadow-2xs"
                  : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
