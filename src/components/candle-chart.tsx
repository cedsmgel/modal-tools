'use client';

import { useEffect, useRef } from 'react';
import {
  createChart,
  ColorType,
  CrosshairMode,
  type IChartApi,
  type CandlestickData,
  type Time,
} from 'lightweight-charts';

export interface CandleChartProps {
  data: CandlestickData<Time>[];
  height?: number; // padrão: 380
}

export function CandleChart({ data, height = 380 }: CandleChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Garante largura e altura reais do container antes de criar o chart
    const containerWidth = containerRef.current.clientWidth || 600;
    const initialHeight = height;

    const chart = createChart(containerRef.current, {
      width: containerWidth,
      height: initialHeight,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#a1a1aa', // zinc-400
      },
      grid: {
        vertLines: { color: '#27272a' }, // zinc-800
        horzLines: { color: '#27272a' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: '#3f3f46', // zinc-700
        visible: true,
        autoScale: true,
        scaleMargins: {
          top: 0.1,
          bottom: 0.12, // Evita sobreposição do último preço com a escala de tempo
        },
      },
      timeScale: {
        borderColor: '#3f3f46',
        timeVisible: true,
        secondsVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      handleScroll: true,
      handleScale: true,
    });

    chartRef.current = chart;

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#22c55e', // green-500
      downColor: '#ef4444', // red-500
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    if (data && data.length > 0) {
      // Ordenação ascendente e deduplicação estrita de horários
      const sorted = [...data].sort((a, b) => {
        const tA = typeof a.time === 'number' ? a.time : new Date(a.time as string).getTime();
        const tB = typeof b.time === 'number' ? b.time : new Date(b.time as string).getTime();
        return tA - tB;
      });
      const uniqueData: CandlestickData<Time>[] = [];
      const seen = new Set<string | number>();
      for (const item of sorted) {
        const key = item.time as string | number;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueData.push(item);
        }
      }
      candleSeries.setData(uniqueData);
      chart.timeScale().fitContent(); // ajusta zoom para mostrar todos os candles
    }

    // ResizeObserver — acompanha redimensionamento responsivo de largura do container
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        if (chartRef.current && width > 0) {
          chartRef.current.applyOptions({ width });
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    // Cleanup obrigatório — evita instâncias duplicadas no Next.js
    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, [data, height]);

  return (
    // Container com altura explícita — obrigatório para o Lightweight Charts
    <div
      ref={containerRef}
      className="w-full rounded-lg overflow-hidden"
      style={{ height: `${height}px` }}
    />
  );
}
