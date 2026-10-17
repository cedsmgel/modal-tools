"use client";

import * as React from "react";
import { X, TrendingUp, Maximize2, Minimize2 } from "lucide-react";

export type ChartPeriod = "1D" | "5D" | "1M" | "6M" | "1A" | "Tudo";

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

const PERIOD_LABELS: Record<ChartPeriod, string[]> = {
  "1D": ["10:00", "11:30", "13:00", "14:30", "16:00", "17:00", "18:00"],
  "5D": ["Seg", "Ter", "Qua", "Qui", "Sex"],
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

  // Gera curvas de performance normalizada (%) estilo Koyfin
  // Ponto 0 = 0.00%, convergindo para o changePercent real do ativo
  const seriesWithPoints = React.useMemo(() => {
    return activeSeries.map((series, sIndex) => {
      const targetPercent = series.changePercent ?? 1.5;
      const totalSteps = labels.length - 1;

      const points = labels.map((_, stepIndex) => {
        if (stepIndex === 0) return 0;
        const progress = stepIndex / totalSteps;
        const seed = (sIndex + 1) * 1.8;
        const wave = Math.sin(progress * Math.PI * 1.5 + seed) * (targetPercent * 0.22);
        const val = progress * targetPercent + wave;
        return Number(val.toFixed(2));
      });

      const hex = series.colorHex || COLOR_MAP[series.color] || "#820AD1";

      return {
        ...series,
        hex,
        points,
      };
    });
  }, [activeSeries, labels]);

  // Calcula escala vertical (mínimo e máximo)
  const { minVal, maxVal, yTicks } = React.useMemo(() => {
    let min = -1.0;
    let max = 1.0;

    seriesWithPoints.forEach((s) => {
      s.points.forEach((p) => {
        if (p < min) min = p;
        if (p > max) max = p;
      });
    });

    const padding = Math.max(0.6, (max - min) * 0.15);
    const domainMin = Math.floor(min - padding);
    const domainMax = Math.ceil(max + padding);

    // Gera 5 ticks no eixo Y
    const step = (domainMax - domainMin) / 4;
    const ticks = [
      domainMax,
      domainMax - step,
      domainMin + step * 2,
      domainMin + step,
      domainMin,
    ].map((v) => Number(v.toFixed(2)));

    return { minVal: domainMin, maxVal: domainMax, yTicks: ticks };
  }, [seriesWithPoints]);

  // Dimensões do canvas SVG
  const width = 800;
  const height = isExpanded ? 380 : 190;
  const padLeft = 65;
  const padRight = 30;
  const padTop = 15;
  const padBottom = 25;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const getY = (val: number) => {
    const norm = (val - minVal) / (maxVal - minVal || 1);
    return padTop + (1 - norm) * chartH;
  };

  const getX = (index: number) => {
    return padLeft + (index / (labels.length - 1)) * chartW;
  };

  const generateSmoothPath = (points: number[]) => {
    if (!points.length) return "";
    const coords = points.map((p, i) => ({ x: getX(i), y: getY(p) }));
    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const curr = coords[i];
      const next = coords[i + 1];
      const mx = (curr.x + next.x) / 2;
      d += ` C ${mx} ${curr.y}, ${mx} ${next.y}, ${next.x} ${next.y}`;
    }
    return d;
  };

  // Trata hover do mouse no gráfico
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;
    if (mouseX >= padLeft && mouseX <= width - padRight) {
      const stepWidth = chartW / (labels.length - 1);
      const index = Math.round((mouseX - padLeft) / stepWidth);
      setHoverIndex(Math.max(0, Math.min(labels.length - 1, index)));
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  return (
    <div className={`flex flex-col h-full justify-between select-none ${className}`}>
      {/* Topo do Gráfico: Título, Pílulas de Período e Botão de Expandir */}
      <div className="flex flex-wrap items-center justify-between gap-3 shrink-0 pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-purple-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-100">
            Performance Normalizada (%)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Seletor de Períodos: [ 1D | 5D | 1M | 6M | 1A | Tudo ] */}
          <div className="shrink-0 bg-zinc-950/90 p-0.5 rounded-full border border-zinc-800 flex items-center gap-0.5 shadow-2xs">
            {(["1D", "5D", "1M", "6M", "1A", "Tudo"] as ChartPeriod[]).map((period) => {
              const isActive = currentPeriod === period;
              return (
                <button
                  key={period}
                  type="button"
                  onClick={() => handlePeriodChange(period)}
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-purple-600 text-white shadow-xs"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {period}
                </button>
              );
            })}
          </div>

          {/* Botão de Expandir / Recolher o Gráfico */}
          {onToggleExpand && (
            <button
              type="button"
              onClick={onToggleExpand}
              className="p-1.5 rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer shadow-xs active:scale-95"
              title={isExpanded ? "Recolher visualização do gráfico" : "Expandir gráfico em tela cheia"}
            >
              {isExpanded ? (
                <Minimize2 className="h-3.5 w-3.5 text-purple-400" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Área Central do Gráfico SVG de Alta Precisão */}
      <div
        ref={containerRef}
        className="relative flex-1 w-full min-h-[170px] flex items-center justify-center my-1"
      >
        {activeSeries.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-zinc-400 space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
              <TrendingUp className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold text-zinc-300">
              Nenhum ativo selecionado para o gráfico
            </p>
            <p className="text-[11px] text-zinc-500 max-w-xs">
              Selecione ações, FIIs ou moedas na coluna à esquerda para comparar o desempenho relativo.
            </p>
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full overflow-visible"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Linhas de Grade Horizontais e Rótulos do Eixo Y em Branco/Cinza Claro Legível */}
            {yTicks.map((tick, i) => {
              const y = getY(tick);
              const isZero = Math.abs(tick) < 0.05;
              const formattedTick = `${tick > 0 ? "+" : ""}${tick.toFixed(2)}%`;

              return (
                <g key={`ytick-${i}`}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={width - padRight}
                    y2={y}
                    stroke={isZero ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.07)"}
                    strokeDasharray={isZero ? undefined : "3 3"}
                    strokeWidth={isZero ? 1.5 : 1}
                  />
                  <text
                    x={padLeft - 8}
                    y={y + 3.5}
                    textAnchor="end"
                    fill="#e4e4e7"
                    fontSize="10"
                    fontFamily="system-ui, -apple-system, sans-serif"
                    fontWeight="500"
                    className="select-none"
                  >
                    {formattedTick}
                  </text>
                </g>
              );
            })}

            {/* Linha Zero Destacada */}
            <line
              x1={padLeft}
              y1={getY(0)}
              x2={width - padRight}
              y2={getY(0)}
              stroke="rgba(255, 255, 255, 0.28)"
              strokeWidth={1.5}
            />

            {/* Rótulos do Eixo X em Branco/Cinza Claro */}
            {labels.map((lbl, idx) => {
              const x = getX(idx);
              return (
                <text
                  key={`xlabel-${idx}`}
                  x={x}
                  y={height - 5}
                  textAnchor={idx === 0 ? "start" : idx === labels.length - 1 ? "end" : "middle"}
                  fill="#a1a1aa"
                  fontSize="10"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  fontWeight="500"
                  className="select-none"
                >
                  {lbl}
                </text>
              );
            })}

            {/* Curvas Suaves Coloridas de Cada Ativo Ativo */}
            {seriesWithPoints.map((series) => {
              const path = generateSmoothPath(series.points);
              return (
                <g key={`path-${series.id}`}>
                  <path
                    d={path}
                    fill="none"
                    stroke={series.hex}
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Ponto final em destaque */}
                  {series.points.length > 0 && (
                    <circle
                      cx={getX(series.points.length - 1)}
                      cy={getY(series.points[series.points.length - 1])}
                      r={3.5}
                      fill={series.hex}
                      stroke="#09090b"
                      strokeWidth={1.5}
                    />
                  )}
                </g>
              );
            })}

            {/* Indicador Vertical Interativo no Hover */}
            {hoverIndex !== null && (
              <g>
                <line
                  x1={getX(hoverIndex)}
                  y1={padTop}
                  x2={getX(hoverIndex)}
                  y2={padTop + chartH}
                  stroke="rgba(255, 255, 255, 0.45)"
                  strokeDasharray="2 2"
                  strokeWidth={1}
                />
                {seriesWithPoints.map((s) => (
                  <circle
                    key={`hover-dot-${s.id}`}
                    cx={getX(hoverIndex)}
                    cy={getY(s.points[hoverIndex])}
                    r={4}
                    fill={s.hex}
                    stroke="#ffffff"
                    strokeWidth={1.5}
                  />
                ))}
              </g>
            )}
          </svg>
        )}

        {/* Tooltip Flutuante no Hover */}
        {hoverIndex !== null && seriesWithPoints.length > 0 && (
          <div
            className="pointer-events-none absolute z-30 bg-zinc-900/95 border border-zinc-700/80 rounded-xl px-3 py-2 shadow-xl backdrop-blur-md transition-all text-xs"
            style={{
              left: `${Math.min(75, Math.max(15, (getX(hoverIndex) / width) * 100))}%`,
              top: "10px",
              transform: "translateX(-50%)",
            }}
          >
            <p className="text-[10px] font-semibold text-zinc-400 border-b border-zinc-800 pb-1 mb-1.5">
              {labels[hoverIndex]}
            </p>
            <div className="space-y-1">
              {seriesWithPoints.map((s) => {
                const val = s.points[hoverIndex];
                return (
                  <div key={`tip-${s.id}`} className="flex items-center justify-between gap-3 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.hex }} />
                      <span className="font-semibold text-zinc-200">{s.ticker}</span>
                    </div>
                    <span
                      className={`font-bold tabular-nums ${
                        val >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {val >= 0 ? `+${val.toFixed(2)}%` : `${val.toFixed(2)}%`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Chips dos Ativos Ativos no Gráfico com Botão Fechar/Remover */}
      <div className="pt-2 border-t border-zinc-800/80 shrink-0 flex flex-wrap items-center gap-1.5 min-h-[34px]">
        <span className="text-[10px] text-zinc-400 mr-1">Séries ativas:</span>
        {activeSeries.length === 0 ? (
          <span className="text-[10px] text-zinc-500 italic">Nenhuma série selecionada</span>
        ) : (
          activeSeries.map((series) => {
            const hex = series.colorHex || COLOR_MAP[series.color] || "#820AD1";
            return (
              <div
                key={series.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-100 shadow-2xs group"
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: hex }}
                />
                <span className="font-semibold text-[11px] text-zinc-100">{series.ticker}</span>
                {series.changePercent !== undefined && (
                  <span
                    className={`text-[10px] tabular-nums font-semibold ${
                      series.changePercent >= 0 ? "text-emerald-400" : "text-rose-400"
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
                    className="p-0.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors ml-0.5 cursor-pointer"
                    title={`Remover ${series.ticker} do gráfico`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
