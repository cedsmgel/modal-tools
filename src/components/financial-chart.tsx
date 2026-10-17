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
  Sliders,
  BarChart3,
  CandlestickChart,
  LineChart as LineChartIcon,
  Activity,
  Minus,
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

interface OHLCPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Definição completa das 17 modalidades de gráfico conforme padrão B3 e TradingView
interface ChartTypeMeta {
  id: ChartType;
  label: string;
  category: "Velas e Barras" | "Linhas e Áreas" | "Tendência e Preço";
  description: string;
}

const CHART_TYPES: ChartTypeMeta[] = [
  // Velas e Barras
  {
    id: "velas",
    label: "Velas (Candles)",
    category: "Velas e Barras",
    description: "Velas japonesas clássicas com corpo preenchido e sombras",
  },
  {
    id: "velas_vazias",
    label: "Velas Vazias (Hollow)",
    category: "Velas e Barras",
    description: "Velas vazias para alta e preenchidas para baixa",
  },
  {
    id: "barras",
    label: "Barras (OHLC)",
    category: "Velas e Barras",
    description: "Barras americanas com hastes de abertura e fechamento",
  },
  {
    id: "colunas",
    label: "Colunas",
    category: "Velas e Barras",
    description: "Histograma vertical a partir da linha base",
  },
  {
    id: "heikin_ashi",
    label: "Heikin Ashi",
    category: "Velas e Barras",
    description: "Velas com médias ponderadas para filtrar ruído de mercado",
  },

  // Linhas e Áreas
  {
    id: "linha",
    label: "Linha",
    category: "Linhas e Áreas",
    description: "Linha contínua conectando os preços de fechamento",
  },
  {
    id: "linha_marcadores",
    label: "Linha com Marcadores",
    category: "Linhas e Áreas",
    description: "Linha contínua com nós em cada ponto de negociação",
  },
  {
    id: "step_line",
    label: "Step Line (Degraus)",
    category: "Linhas e Áreas",
    description: "Linha em formato de escada horizontal e vertical",
  },
  {
    id: "area",
    label: "Área",
    category: "Linhas e Áreas",
    description: "Linha com gradiente preenchido até a base",
  },
  {
    id: "area_hlc",
    label: "Área HLC",
    category: "Linhas e Áreas",
    description: "Faixa sombreada entre máxima e mínima com linha de fechamento",
  },
  {
    id: "linha_base",
    label: "Linha Base",
    category: "Linhas e Áreas",
    description: "Divisão em 0% (verde acima da base, vermelho abaixo)",
  },
  {
    id: "maxima_minima",
    label: "Máxima-Mínima (High-Low)",
    category: "Linhas e Áreas",
    description: "Cápsulas verticais unindo apenas a máxima e mínima",
  },

  // Tendência e Baseados em Preço (Não-temporais)
  {
    id: "renko",
    label: "Renko",
    category: "Tendência e Preço",
    description: "Tijolos diagonais baseados exclusivamente na variação de preço",
  },
  {
    id: "quebra_linha",
    label: "Quebra de Linha (Line Break)",
    category: "Tendência e Preço",
    description: "Blocos de reversão ao superar os 3 últimos fechamentos",
  },
  {
    id: "kagi",
    label: "Kagi",
    category: "Tendência e Preço",
    description: "Linhas verticais Yang (grossa) e Yin (fina) com inflexões",
  },
  {
    id: "ponto_figura",
    label: "Ponto e Figura (P&F)",
    category: "Tendência e Preço",
    description: "Colunas alternadas de X (alta) e O (baixa) clássicas",
  },
  {
    id: "intervalo",
    label: "Intervalo (Range Bars)",
    category: "Tendência e Preço",
    description: "Barras com amplitude fixa independente do tempo decorrido",
  },
];

const PERIOD_LABELS: Record<ChartPeriod, string[]> = {
  "1D": ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
  "5D": ["Seg 10h", "Ter 12h", "Qua 14h", "Qui 16h", "Sex 18h"],
  "1M": ["Semana 1", "Semana 2", "Semana 3", "Semana 4", "Hoje"],
  "6M": ["Mês -5", "Mês -4", "Mês -3", "Mês -2", "Mês -1", "Hoje"],
  "1A": ["1º Tri", "2º Tri", "3º Tri", "4º Tri", "Hoje"],
  Tudo: ["2023", "2024", "2025", "2026", "Atual"],
};

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

// Ícone SVG personalizado para cada tipo de gráfico
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
  // Estados da interface e ferramentas
  const [internalPeriod, setInternalPeriod] = React.useState<ChartPeriod>(selectedPeriod);
  const [chartType, setChartType] = React.useState<ChartType>("velas");
  const [isTypeMenuOpen, setIsTypeMenuOpen] = React.useState(false);
  const [typeSearchQuery, setTypeSearchQuery] = React.useState("");

  // Ferramentas de desenho TradingView (barra lateral esquerda)
  const [activeTool, setActiveTool] = React.useState<DrawingTool>("crosshair");
  const [isDrawingsLocked, setIsDrawingsLocked] = React.useState(false);
  const [isDrawingsVisible, setIsDrawingsVisible] = React.useState(true);
  const [isMagnetActive, setIsMagnetActive] = React.useState(false);
  const [hasDrawings, setHasDrawings] = React.useState(true);

  // Indicadores técnicos adicionais (fx)
  const [isIndicatorsMenuOpen, setIsIndicatorsMenuOpen] = React.useState(false);
  const [showVolume, setShowVolume] = React.useState(true);
  const [showSMA20, setShowSMA20] = React.useState(false);
  const [showEMA50, setShowEMA50] = React.useState(false);
  const [showBollinger, setShowBollinger] = React.useState(false);
  const [showGrid, setShowGrid] = React.useState(true);
  const [showWatermark, setShowWatermark] = React.useState(true);

  // Escala e visualização
  const [scaleMode, setScaleMode] = React.useState<"percent" | "log" | "auto">("percent");
  const [snapshotToast, setSnapshotToast] = React.useState(false);

  // Cursor e hover no canvas
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const currentPeriod = onPeriodChange ? selectedPeriod : internalPeriod;

  const handlePeriodChange = (p: ChartPeriod) => {
    if (onPeriodChange) {
      onPeriodChange(p);
    } else {
      setInternalPeriod(p);
    }
  };

  const labels = PERIOD_LABELS[currentPeriod];

  // Ativo principal do gráfico (o primeiro da seleção ou fallback para PETR4 / IBOV)
  const primaryAsset = React.useMemo(() => {
    if (activeSeries.length > 0) {
      return activeSeries[0];
    }
    return {
      id: "IBOV",
      ticker: "IBOV",
      name: "Índice Bovespa",
      color: "purple",
      colorHex: "#820AD1",
      currentValue: 131250,
      changePercent: 1.45,
    };
  }, [activeSeries]);

  // Geração de dados de Candlestick / OHLC realistas para o período ativo
  const ohlcData: OHLCPoint[] = React.useMemo(() => {
    const totalBars = 26;
    const basePrice = primaryAsset.currentValue && primaryAsset.currentValue > 0
      ? primaryAsset.currentValue
      : 38.5;
    const change = primaryAsset.changePercent ?? 1.5;

    let currentOpen = basePrice * (1 - (change / 100) * 0.8);
    const data: OHLCPoint[] = [];

    for (let i = 0; i < totalBars; i++) {
      const progress = i / (totalBars - 1);
      const wave = Math.sin(progress * Math.PI * 2.2 + 0.4) * (basePrice * 0.015);
      const trend = (change / 100) * basePrice * progress;
      const targetClose = currentOpen + (Math.sin(i * 1.7) * (basePrice * 0.012)) + (trend / totalBars);

      const close = i === totalBars - 1 ? basePrice : Number(targetClose.toFixed(2));
      const high = Number((Math.max(currentOpen, close) + Math.abs(Math.sin(i * 2.1)) * (basePrice * 0.01)).toFixed(2));
      const low = Number((Math.min(currentOpen, close) - Math.abs(Math.cos(i * 1.9)) * (basePrice * 0.009)).toFixed(2));
      const volume = Math.floor(1500000 + Math.abs(Math.sin(i * 2.5)) * 4200000);

      const labelIdx = Math.floor((i / totalBars) * labels.length);
      const time = labels[Math.min(labels.length - 1, labelIdx)];

      data.push({
        time,
        open: Number(currentOpen.toFixed(2)),
        high,
        low,
        close,
        volume,
      });

      currentOpen = close + (Math.sin(i * 3) * (basePrice * 0.003));
    }

    return data;
  }, [primaryAsset, labels]);

  // Médias Móveis (SMA 20 e EMA 50)
  const sma20Points = React.useMemo(() => {
    const period = 7;
    return ohlcData.map((_, idx, arr) => {
      const start = Math.max(0, idx - period + 1);
      const slice = arr.slice(start, idx + 1);
      const avg = slice.reduce((acc, curr) => acc + curr.close, 0) / slice.length;
      return Number(avg.toFixed(2));
    });
  }, [ohlcData]);

  const ema50Points = React.useMemo(() => {
    const k = 2 / (14 + 1);
    let ema = ohlcData[0]?.close ?? 0;
    return ohlcData.map((d) => {
      ema = d.close * k + ema * (1 - k);
      return Number(ema.toFixed(2));
    });
  }, [ohlcData]);

  // Bandas de Bollinger
  const bollingerBands = React.useMemo(() => {
    return ohlcData.map((d, idx) => {
      const mid = sma20Points[idx];
      const diff = Math.abs(d.close - mid) * 1.5;
      return {
        upper: Number((mid + diff).toFixed(2)),
        middle: mid,
        lower: Number((mid - diff).toFixed(2)),
      };
    });
  }, [ohlcData, sma20Points]);

  // Heikin Ashi Transformation
  const heikinAshiData = React.useMemo(() => {
    const ha: OHLCPoint[] = [];
    ohlcData.forEach((bar, i) => {
      const haClose = (bar.open + bar.high + bar.low + bar.close) / 4;
      const haOpen = i === 0 ? (bar.open + bar.close) / 2 : (ha[i - 1].open + ha[i - 1].close) / 2;
      const haHigh = Math.max(bar.high, haOpen, haClose);
      const haLow = Math.min(bar.low, haOpen, haClose);
      ha.push({
        time: bar.time,
        open: Number(haOpen.toFixed(2)),
        high: Number(haHigh.toFixed(2)),
        low: Number(haLow.toFixed(2)),
        close: Number(haClose.toFixed(2)),
        volume: bar.volume,
      });
    });
    return ha;
  }, [ohlcData]);

  // Renko Bricks
  const renkoBricks = React.useMemo(() => {
    const brickSize = (primaryAsset.currentValue || 38) * 0.0075;
    const bricks: { isUp: boolean; open: number; close: number }[] = [];
    let currentLevel = ohlcData[0]?.close || 38;

    ohlcData.forEach((bar) => {
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

    return bricks.slice(-24);
  }, [ohlcData, primaryAsset]);

  // Kagi Lines (Inflection Points)
  const kagiLines = React.useMemo(() => {
    const revThreshold = (primaryAsset.currentValue || 38) * 0.01;
    const lines: { yStart: number; yEnd: number; isYang: boolean }[] = [];
    let dir = 1;
    let extreme = ohlcData[0]?.close || 38;
    let prevExtreme = extreme;

    ohlcData.forEach((b) => {
      if (dir === 1) {
        if (b.close > extreme) {
          extreme = b.close;
        } else if (extreme - b.close >= revThreshold) {
          lines.push({ yStart: prevExtreme, yEnd: extreme, isYang: extreme > (primaryAsset.currentValue || 38) });
          prevExtreme = extreme;
          extreme = b.close;
          dir = -1;
        }
      } else {
        if (b.close < extreme) {
          extreme = b.close;
        } else if (b.close - extreme >= revThreshold) {
          lines.push({ yStart: prevExtreme, yEnd: extreme, isYang: prevExtreme > (primaryAsset.currentValue || 38) });
          prevExtreme = extreme;
          extreme = b.close;
          dir = 1;
        }
      }
    });
    if (lines.length === 0) {
      lines.push({ yStart: ohlcData[0]?.open || 38, yEnd: ohlcData[ohlcData.length - 1]?.close || 38, isYang: true });
    }
    return lines;
  }, [ohlcData, primaryAsset]);

  // Ponto e Figura (X e O)
  const pnfColumns = React.useMemo(() => {
    const cols: { type: "X" | "O"; values: number[] }[] = [];
    const boxSize = (primaryAsset.currentValue || 38) * 0.006;
    let isX = true;
    let colValues: number[] = [ohlcData[0]?.close || 38];

    ohlcData.slice(1).forEach((bar, idx) => {
      if (idx % 3 === 0) {
        cols.push({ type: isX ? "X" : "O", values: [...colValues] });
        isX = !isX;
        colValues = [bar.close, bar.close + (isX ? boxSize : -boxSize), bar.close + (isX ? boxSize * 2 : -boxSize * 2)];
      }
    });
    return cols.slice(-14);
  }, [ohlcData, primaryAsset]);

  // Escala de preços (mínimo e máximo global)
  const { minPrice, maxPrice, yTicks, maxVolume } = React.useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    let maxVol = 100;

    ohlcData.forEach((d) => {
      if (d.low < min) min = d.low;
      if (d.high > max) max = d.high;
      if (d.volume > maxVol) maxVol = d.volume;
    });

    if (min === Infinity) {
      min = 35;
      max = 42;
    }

    const pad = (max - min) * 0.12;
    const finalMin = min - pad;
    const finalMax = max + pad;

    const step = (finalMax - finalMin) / 4;
    const ticks = [finalMax, finalMax - step, finalMin + step * 2, finalMin + step, finalMin].map((v) =>
      Number(v.toFixed(2))
    );

    return { minPrice: finalMin, maxPrice: finalMax, yTicks: ticks, maxVolume: maxVol };
  }, [ohlcData]);

  // Dimensões do canvas SVG
  const width = 860;
  const height = isExpanded ? 410 : 255;
  const padLeft = 45;
  const padRight = 65;
  const padTop = 18;
  const padBottom = showVolume ? 52 : 28;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const getY = (price: number) => {
    const norm = (price - minPrice) / (maxPrice - minPrice || 1);
    return padTop + (1 - norm) * chartH;
  };

  const getX = (index: number, total: number = ohlcData.length) => {
    return padLeft + (index / (total - 1 || 1)) * chartW;
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;
    if (mouseX >= padLeft && mouseX <= width - padRight) {
      const stepWidth = chartW / (ohlcData.length - 1);
      const index = Math.round((mouseX - padLeft) / stepWidth);
      setHoverIndex(Math.max(0, Math.min(ohlcData.length - 1, index)));
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  // Bar no hover atual ou último dado
  const activeHoverBar = hoverIndex !== null ? ohlcData[hoverIndex] : ohlcData[ohlcData.length - 1];

  // Dispara Snapshot
  const handleTakeSnapshot = () => {
    setSnapshotToast(true);
    setTimeout(() => setSnapshotToast(false), 2600);
  };

  // Filtro da busca de tipos de gráfico
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
    <div className={`flex flex-col h-full justify-between select-none relative ${className}`}>
      {/* 1. BARRA DE FERRAMENTAS SUPERIOR (ESTILO TRADINGVIEW / B3) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-zinc-200/60 dark:border-zinc-800/80 shrink-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Badge do Ativo Principal */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 font-bold text-xs shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 animate-pulse" />
            <span className="tracking-wide">{primaryAsset.ticker}</span>
            <span className="text-[10px] text-zinc-400 font-medium">B3</span>
            <span
              className={`text-[11px] tabular-nums font-bold ${
                (primaryAsset.changePercent ?? 0) >= 0 ? "text-emerald-500" : "text-rose-500"
              }`}
            >
              {(primaryAsset.changePercent ?? 0) >= 0 ? "+" : ""}
              {(primaryAsset.changePercent ?? 0).toFixed(2)}%
            </span>
          </div>

          <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-0.5" />

          {/* Seletor de Intervalos (TradingView: 1m, 5m, 15m, 1H, 1D, 1S, 1M) */}
          <div className="bg-zinc-100 dark:bg-zinc-900/90 p-0.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 flex items-center gap-0.5">
            {(["1D", "5D", "1M", "6M", "1A", "Tudo"] as ChartPeriod[]).map((period) => {
              const isActive = currentPeriod === period;
              return (
                <button
                  key={period}
                  type="button"
                  onClick={() => handlePeriodChange(period)}
                  className={`rounded-lg px-2 py-0.5 text-[11px] font-semibold transition-all cursor-pointer ${
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

          {/* Seletor de Modo de Gráfico (Dropdown com os 17 Modos) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsTypeMenuOpen(!isTypeMenuOpen)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-colors text-xs font-semibold cursor-pointer shadow-2xs"
              title="Alterar modo de exibição do gráfico"
            >
              <ChartTypeIcon type={chartType} className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              <span>{activeMeta.label}</span>
              <ChevronDown className={`h-3 w-3 text-zinc-400 transition-transform ${isTypeMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Menu Popover das 17 modalidades */}
            {isTypeMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsTypeMenuOpen(false)}
                />
                <div className="absolute left-0 top-full mt-1.5 z-50 w-72 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-150">
                  {/* Busca Rápida */}
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

                  {/* Lista Categorizada */}
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

          {/* Botão de Indicadores Técnicos (fx Indicadores) */}
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

            {/* Menu Popover de Indicadores */}
            {isIndicatorsMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsIndicatorsMenuOpen(false)}
                />
                <div className="absolute left-0 top-full mt-1.5 z-50 w-64 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-2.5 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-2 py-0.5">
                    Estudos e Médias
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
                      Volume Financeiro
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
                    Canvas & Visual
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

        {/* Lado Direito do Cabeçalho: Snapshot, Expandir */}
        <div className="flex items-center gap-1.5">
          {/* Captura / Snapshot */}
          <button
            type="button"
            onClick={handleTakeSnapshot}
            className="p-1.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer shadow-2xs active:scale-95"
            title="Tirar foto do gráfico"
          >
            <Camera className="h-3.5 w-3.5" />
          </button>

          {/* Botão de Expandir / Recolher o Gráfico */}
          {onToggleExpand && (
            <button
              type="button"
              onClick={onToggleExpand}
              className="p-1.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer shadow-2xs active:scale-95"
              title={isExpanded ? "Recolher visualização do gráfico" : "Expandir gráfico e ocultar painéis"}
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

      {/* Toast de Captura Salva */}
      {snapshotToast && (
        <div className="absolute top-12 right-4 z-50 bg-purple-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <Check className="h-3.5 w-3.5" />
          <span>Captura do gráfico copiada com sucesso!</span>
        </div>
      )}

      {/* ÁREA CENTRAL: BARRA LATERAL ESQUERDA (DESENHOS TRADINGVIEW) + CANVAS DO GRÁFICO */}
      <div className="flex flex-1 min-h-0 w-full relative mt-1.5">
        {/* 2. BARRA DE FERRAMENTAS LATERAL ESQUERDA (ESTILO TRADINGVIEW) */}
        <div className="w-9 shrink-0 flex flex-col items-center justify-between py-1 border-r border-zinc-200/50 dark:border-zinc-800/80 pr-1.5 mr-1 z-10">
          {/* Grupo de Ferramentas de Desenho */}
          <div className="flex flex-col items-center gap-1">
            {/* Mira / Crosshair */}
            <button
              type="button"
              onClick={() => setActiveTool("crosshair")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTool === "crosshair"
                  ? "bg-purple-600 text-white shadow-2xs"
                  : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
              title="Mira / Crosshair (Cursor Padrão)"
            >
              <Crosshair className="h-3.5 w-3.5" />
            </button>

            {/* Linha de Tendência */}
            <button
              type="button"
              onClick={() => setActiveTool("trendline")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTool === "trendline"
                  ? "bg-purple-600 text-white shadow-2xs"
                  : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
              title="Linha de Tendência"
            >
              <Minus className="h-3.5 w-3.5 -rotate-45" />
            </button>

            {/* Retração de Fibonacci */}
            <button
              type="button"
              onClick={() => setActiveTool("fibonacci")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTool === "fibonacci"
                  ? "bg-purple-600 text-white shadow-2xs"
                  : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
              title="Retração de Fibonacci"
            >
              <Layers className="h-3.5 w-3.5" />
            </button>

            {/* Pincel / Anotação */}
            <button
              type="button"
              onClick={() => setActiveTool("brush")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTool === "brush"
                  ? "bg-purple-600 text-white shadow-2xs"
                  : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
              title="Pincel / Desenho Livre"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>

            {/* Texto / Rótulo */}
            <button
              type="button"
              onClick={() => setActiveTool("text")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTool === "text"
                  ? "bg-purple-600 text-white shadow-2xs"
                  : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
              title="Anotação de Texto"
            >
              <Type className="h-3.5 w-3.5" />
            </button>

            {/* Régua de Medição */}
            <button
              type="button"
              onClick={() => setActiveTool("ruler")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTool === "ruler"
                  ? "bg-purple-600 text-white shadow-2xs"
                  : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
              title="Régua de Variação (%) e Barras"
            >
              <Ruler className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Grupo de Ações Inferior: Ímã, Bloquear, Ocultar, Limpar */}
          <div className="flex flex-col items-center gap-1 pt-1 border-t border-zinc-200/50 dark:border-zinc-800/80">
            {/* Ímã (Snap to OHLC) */}
            <button
              type="button"
              onClick={() => setIsMagnetActive(!isMagnetActive)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isMagnetActive
                  ? "text-purple-600 dark:text-purple-400 bg-purple-500/10"
                  : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
              title="Modo Ímã (ancora nos topos e fundos)"
            >
              <Magnet className="h-3.5 w-3.5" />
            </button>

            {/* Travar Desenhos */}
            <button
              type="button"
              onClick={() => setIsDrawingsLocked(!isDrawingsLocked)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDrawingsLocked
                  ? "text-amber-500 bg-amber-500/10"
                  : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
              title={isDrawingsLocked ? "Desenhos Travados" : "Travar todas as ferramentas"}
            >
              {isDrawingsLocked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
            </button>

            {/* Ocultar/Exibir Desenhos */}
            <button
              type="button"
              onClick={() => setIsDrawingsVisible(!isDrawingsVisible)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                !isDrawingsVisible
                  ? "text-rose-500 bg-rose-500/10"
                  : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
              title={isDrawingsVisible ? "Ocultar Desenhos" : "Mostrar Desenhos"}
            >
              {isDrawingsVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </button>

            {/* Limpar Canvas */}
            <button
              type="button"
              onClick={() => setHasDrawings(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Limpar todos os desenhos"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* CANVAS CENTRAL COM O GRÁFICO */}
        <div ref={containerRef} className="relative flex-1 h-full min-h-[200px] flex flex-col justify-between">
          {/* Barra de Leitura OHLC Dinâmica no Topo do Gráfico (Padrão TradingView) */}
          <div className="absolute top-1 left-2 z-10 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] font-mono select-none">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">{primaryAsset.ticker}</span>
            <span className="text-zinc-400 font-sans">{activeHoverBar.time}</span>
            <span className="text-zinc-400">
              O: <strong className="text-zinc-800 dark:text-zinc-200">{activeHoverBar.open.toFixed(2)}</strong>
            </span>
            <span className="text-zinc-400">
              H: <strong className="text-zinc-800 dark:text-zinc-200">{activeHoverBar.high.toFixed(2)}</strong>
            </span>
            <span className="text-zinc-400">
              L: <strong className="text-zinc-800 dark:text-zinc-200">{activeHoverBar.low.toFixed(2)}</strong>
            </span>
            <span className="text-zinc-400">
              C: <strong className="text-zinc-800 dark:text-zinc-200">{activeHoverBar.close.toFixed(2)}</strong>
            </span>
            <span
              className={`font-bold ${
                activeHoverBar.close >= activeHoverBar.open ? "text-emerald-500" : "text-rose-500"
              }`}
            >
              {activeHoverBar.close >= activeHoverBar.open ? "+" : ""}
              {(((activeHoverBar.close - activeHoverBar.open) / activeHoverBar.open) * 100).toFixed(2)}%
            </span>
            {showVolume && (
              <span className="text-zinc-500">
                Vol: <strong className="text-zinc-400">{(activeHoverBar.volume / 1000000).toFixed(2)}M</strong>
              </span>
            )}
            {showSMA20 && hoverIndex !== null && (
              <span className="text-amber-500">
                SMA(20): <strong>{sma20Points[hoverIndex]?.toFixed(2)}</strong>
              </span>
            )}
            {showEMA50 && hoverIndex !== null && (
              <span className="text-cyan-400">
                EMA(50): <strong>{ema50Points[hoverIndex]?.toFixed(2)}</strong>
              </span>
            )}
          </div>

          {/* Gráfico SVG de Alta Precisão */}
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full overflow-visible"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <defs>
              {/* Gradiente da Linha de Área */}
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#820AD1" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#820AD1" stopOpacity="0.0" />
              </linearGradient>

              {/* Gradiente da Linha Base (Alta / Baixa) */}
              <linearGradient id="baselineUp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="baselineDown" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Marca d'água no fundo (Watermark) */}
            {showWatermark && (
              <text
                x={width / 2}
                y={height / 2 + 10}
                textAnchor="middle"
                fontSize={isExpanded ? "64" : "44"}
                fontWeight="900"
                fontFamily="system-ui, sans-serif"
                fill="currentColor"
                className="text-zinc-200 dark:text-zinc-800/40 select-none pointer-events-none"
              >
                {primaryAsset.ticker}
              </text>
            )}

            {/* Linhas de Grade Horizontais e Ticks do Eixo Y */}
            {showGrid &&
              yTicks.map((tick, i) => {
                const y = getY(tick);
                const isZero = Math.abs(tick - ohlcData[0].open) < 0.08;
                return (
                  <g key={`ytick-${i}`}>
                    <line
                      x1={padLeft}
                      y1={y}
                      x2={width - padRight}
                      y2={y}
                      stroke={isZero ? "rgba(255, 255, 255, 0.22)" : "rgba(255, 255, 255, 0.06)"}
                      strokeDasharray={isZero ? undefined : "3 3"}
                      strokeWidth={1}
                    />
                    <text
                      x={width - padRight + 8}
                      y={y + 3.5}
                      textAnchor="start"
                      fill="#e4e4e7"
                      fontSize="10"
                      fontFamily="system-ui, sans-serif"
                      fontWeight="500"
                      className="select-none"
                    >
                      {scaleMode === "percent"
                        ? `${(((tick - ohlcData[0].open) / ohlcData[0].open) * 100).toFixed(1)}%`
                        : tick.toFixed(2)}
                    </text>
                  </g>
                );
              })}

            {/* Rótulos do Eixo X (Tempo) */}
            {labels.map((lbl, idx) => {
              const x = getX(Math.floor((idx / (labels.length - 1)) * (ohlcData.length - 1)));
              return (
                <text
                  key={`xlabel-${idx}`}
                  x={x}
                  y={height - 6}
                  textAnchor={idx === 0 ? "start" : idx === labels.length - 1 ? "end" : "middle"}
                  fill="#a1a1aa"
                  fontSize="10"
                  fontFamily="system-ui, sans-serif"
                  fontWeight="500"
                  className="select-none"
                >
                  {lbl}
                </text>
              );
            })}

            {/* Histograma de Volume (Rodapé) */}
            {showVolume &&
              ohlcData.map((d, i) => {
                const x = getX(i);
                const barW = Math.max(2, (chartW / ohlcData.length) * 0.65);
                const volHeight = (d.volume / maxVolume) * 36;
                const y = height - 20 - volHeight;
                const isUp = d.close >= d.open;
                return (
                  <rect
                    key={`vol-${i}`}
                    x={x - barW / 2}
                    y={y}
                    width={barW}
                    height={volHeight}
                    fill={isUp ? "#10B981" : "#F43F5E"}
                    fillOpacity="0.25"
                    rx="0.5"
                  />
                );
              })}

            {/* Bandas de Bollinger */}
            {showBollinger && (
              <g>
                {/* Área entre bandas */}
                <path
                  d={
                    ohlcData.map((_, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(bollingerBands[i].upper)}`).join(" ") +
                    " " +
                    ohlcData
                      .slice()
                      .reverse()
                      .map((_, i) => `L ${getX(ohlcData.length - 1 - i)} ${getY(bollingerBands[ohlcData.length - 1 - i].lower)}`)
                      .join(" ") +
                    " Z"
                  }
                  fill="#820AD1"
                  fillOpacity="0.08"
                />
                <path
                  d={ohlcData.map((_, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(bollingerBands[i].upper)}`).join(" ")}
                  fill="none"
                  stroke="#820AD1"
                  strokeOpacity="0.4"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <path
                  d={ohlcData.map((_, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(bollingerBands[i].lower)}`).join(" ")}
                  fill="none"
                  stroke="#820AD1"
                  strokeOpacity="0.4"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              </g>
            )}

            {/* Média Móvel SMA 20 */}
            {showSMA20 && (
              <path
                d={ohlcData.map((_, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(sma20Points[i])}`).join(" ")}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}

            {/* Média Móvel EMA 50 */}
            {showEMA50 && (
              <path
                d={ohlcData.map((_, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(ema50Points[i])}`).join(" ")}
                fill="none"
                stroke="#06B6D4"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}

            {/* RENDERIZAÇÃO DAS 17 MODALIDADES DE GRÁFICO */}

            {/* 1. VELAS CLÁSSICAS (CANDLESTICKS) */}
            {chartType === "velas" &&
              ohlcData.map((d, i) => {
                const x = getX(i);
                const isUp = d.close >= d.open;
                const candleColor = isUp ? "#10B981" : "#F43F5E";
                const barW = Math.max(3, (chartW / ohlcData.length) * 0.7);
                const bodyY = getY(Math.max(d.open, d.close));
                const bodyH = Math.max(2, Math.abs(getY(d.close) - getY(d.open)));

                return (
                  <g key={`candle-${i}`}>
                    {/* Sombra / Pavio (High to Low) */}
                    <line x1={x} y1={getY(d.high)} x2={x} y2={getY(d.low)} stroke={candleColor} strokeWidth="1.4" />
                    {/* Corpo */}
                    <rect x={x - barW / 2} y={bodyY} width={barW} height={bodyH} fill={candleColor} rx="1" />
                  </g>
                );
              })}

            {/* 2. VELAS VAZIAS (HOLLOW CANDLES) */}
            {chartType === "velas_vazias" &&
              ohlcData.map((d, i) => {
                const x = getX(i);
                const isUp = d.close >= d.open;
                const barW = Math.max(3, (chartW / ohlcData.length) * 0.7);
                const bodyY = getY(Math.max(d.open, d.close));
                const bodyH = Math.max(2, Math.abs(getY(d.close) - getY(d.open)));

                return (
                  <g key={`hollow-${i}`}>
                    <line
                      x1={x}
                      y1={getY(d.high)}
                      x2={x}
                      y2={getY(d.low)}
                      stroke={isUp ? "#10B981" : "#F43F5E"}
                      strokeWidth="1.4"
                    />
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

            {/* 3. BARRAS (OHLC BARS) */}
            {chartType === "barras" &&
              ohlcData.map((d, i) => {
                const x = getX(i);
                const isUp = d.close >= d.open;
                const barColor = isUp ? "#10B981" : "#F43F5E";
                const tickW = (chartW / ohlcData.length) * 0.35;

                return (
                  <g key={`bar-${i}`}>
                    <line x1={x} y1={getY(d.high)} x2={x} y2={getY(d.low)} stroke={barColor} strokeWidth="1.8" />
                    <line x1={x - tickW} y1={getY(d.open)} x2={x} y2={getY(d.open)} stroke={barColor} strokeWidth="1.8" />
                    <line x1={x} y1={getY(d.close)} x2={x + tickW} y2={getY(d.close)} stroke={barColor} strokeWidth="1.8" />
                  </g>
                );
              })}

            {/* 4. COLUNAS */}
            {chartType === "colunas" &&
              ohlcData.map((d, i) => {
                const x = getX(i);
                const isUp = d.close >= d.open;
                const colW = Math.max(3, (chartW / ohlcData.length) * 0.7);
                const baseY = getY(minPrice);
                const topY = getY(d.close);
                const colH = Math.max(2, baseY - topY);

                return (
                  <rect
                    key={`col-${i}`}
                    x={x - colW / 2}
                    y={topY}
                    width={colW}
                    height={colH}
                    fill={isUp ? "#10B981" : "#F43F5E"}
                    rx="1.5"
                  />
                );
              })}

            {/* 5. LINHA */}
            {chartType === "linha" && (
              <path
                d={ohlcData.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.close)}`).join(" ")}
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
                  d={ohlcData.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.close)}`).join(" ")}
                  fill="none"
                  stroke="#820AD1"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {ohlcData.map((d, i) => (
                  <circle
                    key={`dot-${i}`}
                    cx={getX(i)}
                    cy={getY(d.close)}
                    r={3}
                    fill="#820AD1"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                ))}
              </g>
            )}

            {/* 7. STEP LINE (DEGRAUS) */}
            {chartType === "step_line" && (
              <path
                d={ohlcData
                  .map((d, i, arr) => {
                    if (i === 0) return `M ${getX(0)} ${getY(d.close)}`;
                    const prevX = getX(i - 1);
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
                    ohlcData.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.close)}`).join(" ") +
                    ` L ${getX(ohlcData.length - 1)} ${getY(minPrice)} L ${getX(0)} ${getY(minPrice)} Z`
                  }
                  fill="url(#areaGrad)"
                />
                <path
                  d={ohlcData.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.close)}`).join(" ")}
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
                    ohlcData.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.high)}`).join(" ") +
                    " " +
                    ohlcData
                      .slice()
                      .reverse()
                      .map((d, i) => `L ${getX(ohlcData.length - 1 - i)} ${getY(d.low)}`)
                      .join(" ") +
                    " Z"
                  }
                  fill="#820AD1"
                  fillOpacity="0.22"
                />
                <path
                  d={ohlcData.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.close)}`).join(" ")}
                  fill="none"
                  stroke="#820AD1"
                  strokeWidth="2.2"
                />
              </g>
            )}

            {/* 10. LINHA BASE */}
            {chartType === "linha_base" && (
              <g>
                {/* Linha Zero de Referência */}
                <line
                  x1={padLeft}
                  y1={getY(ohlcData[0].open)}
                  x2={width - padRight}
                  y2={getY(ohlcData[0].open)}
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <path
                  d={ohlcData.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.close)}`).join(" ")}
                  fill="none"
                  stroke="#820AD1"
                  strokeWidth="2.2"
                />
              </g>
            )}

            {/* 11. MÁXIMA-MÍNIMA (HIGH-LOW) */}
            {chartType === "maxima_minima" &&
              ohlcData.map((d, i) => {
                const x = getX(i);
                const barW = (chartW / ohlcData.length) * 0.5;
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
                    fillOpacity="0.8"
                  />
                );
              })}

            {/* 12. HEIKIN ASHI */}
            {chartType === "heikin_ashi" &&
              heikinAshiData.map((d, i) => {
                const x = getX(i);
                const isUp = d.close >= d.open;
                const candleColor = isUp ? "#10B981" : "#F43F5E";
                const barW = Math.max(3, (chartW / heikinAshiData.length) * 0.7);
                const bodyY = getY(Math.max(d.open, d.close));
                const bodyH = Math.max(2, Math.abs(getY(d.close) - getY(d.open)));

                return (
                  <g key={`ha-${i}`}>
                    <line x1={x} y1={getY(d.high)} x2={x} y2={getY(d.low)} stroke={candleColor} strokeWidth="1.4" />
                    <rect x={x - barW / 2} y={bodyY} width={barW} height={bodyH} fill={candleColor} rx="1" />
                  </g>
                );
              })}

            {/* 13. RENKO */}
            {chartType === "renko" &&
              renkoBricks.map((b, i) => {
                const x = padLeft + (i / (renkoBricks.length - 1 || 1)) * chartW;
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
              ohlcData.map((d, i) => {
                const x = getX(i);
                const isUp = d.close >= d.open;
                const blockW = (chartW / ohlcData.length) * 0.75;
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
                const x = padLeft + (i / (kagiLines.length - 1 || 1)) * chartW;
                const color = line.isYang ? "#10B981" : "#F43F5E";
                const strokeW = line.isYang ? 3 : 1.5;

                return (
                  <g key={`kagi-${i}`}>
                    <line
                      x1={x}
                      y1={getY(line.yStart)}
                      x2={x}
                      y2={getY(line.yEnd)}
                      stroke={color}
                      strokeWidth={strokeW}
                    />
                    {i < kagiLines.length - 1 && (
                      <line
                        x1={x}
                        y1={getY(line.yEnd)}
                        x2={padLeft + ((i + 1) / (kagiLines.length - 1 || 1)) * chartW}
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
                const x = padLeft + (colIdx / (pnfColumns.length - 1 || 1)) * chartW;
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
              ohlcData.map((d, i) => {
                const x = getX(i);
                const isUp = d.close >= d.open;
                const barW = (chartW / ohlcData.length) * 0.7;
                const topY = getY(d.high);
                const fixedH = Math.max(12, getY(d.low) - getY(d.high));
                const color = isUp ? "#10B981" : "#F43F5E";

                return (
                  <rect
                    key={`range-${i}`}
                    x={x - barW / 2}
                    y={topY}
                    width={barW}
                    height={fixedH}
                    fill={color}
                    rx="1.5"
                  />
                );
              })}

            {/* SÉRIES SECUNDÁRIAS ATIVAS (LINHAS DE COMPARAÇÃO NORMALIZADA ESTILO KOYFIN) */}
            {activeSeries.length > 1 &&
              activeSeries.slice(1).map((series, sIndex) => {
                const hex = series.colorHex || COLOR_MAP[series.color] || "#2563EB";
                const targetPercent = series.changePercent ?? 1.2;
                const points = ohlcData.map((_, idx) => {
                  const p = idx / (ohlcData.length - 1);
                  const wave = Math.sin(p * Math.PI * 1.8 + sIndex) * 0.01;
                  const ratio = 1 + (targetPercent / 100) * p + wave;
                  return ohlcData[0].open * ratio;
                });

                return (
                  <g key={`comp-${series.id}`}>
                    <path
                      d={points.map((pt, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(pt)}`).join(" ")}
                      fill="none"
                      stroke={hex}
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />
                    <circle
                      cx={getX(points.length - 1)}
                      cy={getY(points[points.length - 1])}
                      r={3}
                      fill={hex}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  </g>
                );
              })}

            {/* OVERLAY DE DESENHOS ATIVOS (QUANDO VISÍVEIS) */}
            {isDrawingsVisible && hasDrawings && (
              <g className="pointer-events-none">
                {/* Linha de Tendência de Exemplo */}
                <line
                  x1={getX(2)}
                  y1={getY(ohlcData[2]?.low || 37)}
                  x2={getX(ohlcData.length - 4)}
                  y2={getY(ohlcData[ohlcData.length - 4]?.close || 38.5)}
                  stroke="#820AD1"
                  strokeWidth="1.8"
                  strokeDasharray="4 2"
                />
                <circle cx={getX(2)} cy={getY(ohlcData[2]?.low || 37)} r="3" fill="#820AD1" />
                <circle cx={getX(ohlcData.length - 4)} cy={getY(ohlcData[ohlcData.length - 4]?.close || 38.5)} r="3" fill="#820AD1" />
              </g>
            )}

            {/* LINHA GUIA VERTICAL NO HOVER (CROSSHAIR) */}
            {hoverIndex !== null && (
              <g>
                {/* Linha Vertical */}
                <line
                  x1={getX(hoverIndex)}
                  y1={padTop}
                  x2={getX(hoverIndex)}
                  y2={height - padBottom}
                  stroke="rgba(255, 255, 255, 0.45)"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                {/* Linha Horizontal na cotação */}
                <line
                  x1={padLeft}
                  y1={getY(activeHoverBar.close)}
                  x2={width - padRight}
                  y2={getY(activeHoverBar.close)}
                  stroke="rgba(255, 255, 255, 0.45)"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />

                {/* Marcador no eixo Y direito */}
                <g transform={`translate(${width - padRight}, ${getY(activeHoverBar.close) - 9})`}>
                  <rect
                    x="0"
                    y="0"
                    width="60"
                    height="18"
                    rx="4"
                    fill={activeHoverBar.close >= activeHoverBar.open ? "#10B981" : "#F43F5E"}
                  />
                  <text
                    x="30"
                    y="12.5"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="700"
                    fontFamily="system-ui, sans-serif"
                  >
                    R$ {activeHoverBar.close.toFixed(2)}
                  </text>
                </g>

                {/* Marcador no eixo X inferior */}
                <g transform={`translate(${getX(hoverIndex) - 25}, ${height - 18})`}>
                  <rect x="0" y="0" width="50" height="15" rx="3" fill="#27272a" />
                  <text
                    x="25"
                    y="11"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="600"
                    fontFamily="system-ui, sans-serif"
                  >
                    {activeHoverBar.time}
                  </text>
                </g>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* 3. BARRA INFERIOR DE CONTROLE E ESCALA (TRADINGVIEW BOTTOM RAIL) */}
      <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/80 shrink-0 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Chips dos Ativos Selecionados */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-zinc-400 mr-1 font-semibold uppercase tracking-wider">
            Séries:
          </span>
          {activeSeries.length === 0 ? (
            <span className="text-[10px] text-zinc-500 italic">Nenhuma ação marcada (exibindo {primaryAsset.ticker})</span>
          ) : (
            activeSeries.map((series) => {
              const hex = series.colorHex || COLOR_MAP[series.color] || "#820AD1";
              return (
                <div
                  key={series.id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-2xs"
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: hex }} />
                  <span className="font-semibold text-[11px]">{series.ticker}</span>
                  {series.changePercent !== undefined && (
                    <span
                      className={`text-[10px] tabular-nums font-semibold ${
                        series.changePercent >= 0 ? "text-emerald-500" : "text-rose-500"
                      }`}
                    >
                      {series.changePercent >= 0
                        ? `+${series.changePercent.toFixed(1)}%`
                        : `${series.changePercent.toFixed(1)}%`}
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

        {/* Status de Mercado & Seletor de Escala */}
        <div className="flex items-center gap-3 text-[11px] text-zinc-400">
          <span className="hidden sm:inline-flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            B3 Fechamento 18:00 (UTC-3)
          </span>

          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setScaleMode("percent")}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
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
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
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
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
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
