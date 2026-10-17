"use client";

import * as React from "react";
import { LineChart, type Color } from "@tremor/react";
import { X, TrendingUp } from "lucide-react";

export type ChartPeriod = "1D" | "5D" | "1M" | "6M" | "1A" | "Tudo";

export interface ActiveSeriesItem {
  id: string;
  ticker: string;
  name: string;
  color: Color | string;
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
  className = "",
}: FinancialChartProps) {
  const [internalPeriod, setInternalPeriod] = React.useState<ChartPeriod>(selectedPeriod);
  const currentPeriod = onPeriodChange ? selectedPeriod : internalPeriod;

  const handlePeriodChange = (p: ChartPeriod) => {
    if (onPeriodChange) {
      onPeriodChange(p);
    } else {
      setInternalPeriod(p);
    }
  };

  // Gera dados de performance normalizada (%) estilo Koyfin
  // Ponto 0 = 0.00%, e os pontos seguintes variam conforme o percentual do ativo
  const chartData = React.useMemo(() => {
    const labels = PERIOD_LABELS[currentPeriod];

    return labels.map((label, stepIndex) => {
      const row: Record<string, any> = { date: label };

      activeSeries.forEach((series, sIndex) => {
        if (stepIndex === 0) {
          // Ponto de partida sempre normalizado em 0.00%
          row[series.ticker] = 0;
          return;
        }

        const totalSteps = labels.length - 1;
        const progress = stepIndex / totalSteps;
        const targetPercent = series.changePercent ?? 1.5;

        // Gera curvatura de mercado suave convergindo para targetPercent
        const seed = (sIndex + 1) * 1.7;
        const wave = Math.sin(progress * Math.PI * 1.5 + seed) * (targetPercent * 0.25);
        const interpolated = progress * targetPercent + wave;

        row[series.ticker] = Number(interpolated.toFixed(2));
      });

      return row;
    });
  }, [currentPeriod, activeSeries]);

  const categories = React.useMemo(() => {
    return activeSeries.map((s) => s.ticker);
  }, [activeSeries]);

  const colors = React.useMemo(() => {
    return activeSeries.map((s) => (s.color as Color) || "purple");
  }, [activeSeries]);

  const valueFormatter = (value: number) => {
    const prefix = value > 0 ? "+" : "";
    return `${prefix}${value.toFixed(2)}%`;
  };

  return (
    <div className={`flex flex-col h-full justify-between ${className}`}>
      {/* Topo: Seletor de Período estilo Koyfin/Nubank */}
      <div className="flex flex-wrap items-center justify-between gap-3 shrink-0 pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            Performance Normalizada (%)
          </span>
        </div>

        {/* Pílula de Períodos: [ 1D | 5D | 1M | 6M | 1A | Tudo ] */}
        <div className="shrink-0 bg-zinc-100 dark:bg-zinc-950/80 p-0.5 rounded-full border border-zinc-200/80 dark:border-zinc-800/80 flex items-center gap-0.5 shadow-2xs">
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
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {period}
              </button>
            );
          })}
        </div>
      </div>

      {/* Área do Gráfico Tremor */}
      <div className="flex-1 min-h-[160px] max-h-[220px] w-full flex items-center justify-center relative my-1">
        {activeSeries.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center text-zinc-400 space-y-1.5">
            <p className="text-xs font-medium">
              Nenhum ativo selecionado para o gráfico
            </p>
            <p className="text-[11px] text-zinc-500">
              Selecione um ou mais ativos na coluna à esquerda para plotar o comparativo
            </p>
          </div>
        ) : (
          <div className="w-full h-full">
            <LineChart
              className="h-full w-full"
              data={chartData}
              index="date"
              categories={categories}
              colors={colors}
              valueFormatter={valueFormatter}
              curveType="monotone"
              yAxisWidth={56}
              showLegend={false}
              showGridLines={true}
              showXAxis={true}
              showYAxis={true}
              autoMinValue={true}
            />
          </div>
        )}
      </div>

      {/* Chips dos Ativos Ativos no Gráfico com Botão Fechar/Remover */}
      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 shrink-0 flex flex-wrap items-center gap-1.5 min-h-[34px]">
        <span className="text-[10px] text-zinc-400 mr-1">Séries ativas:</span>
        {activeSeries.length === 0 ? (
          <span className="text-[10px] text-zinc-500 italic">Nenhuma série selecionada</span>
        ) : (
          activeSeries.map((series) => {
            const hex = series.colorHex || COLOR_MAP[series.color as string] || "#820AD1";
            return (
              <div
                key={series.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 text-zinc-800 dark:text-zinc-200 shadow-2xs group"
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: hex }}
                />
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
                    className="p-0.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors ml-0.5 cursor-pointer"
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
