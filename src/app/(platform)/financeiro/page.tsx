"use client";

import * as React from "react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  Wallet,
  Building2,
  Scale,
  Eye,
  EyeOff,
  Search,
  PlusCircle,
  Calculator,
  Download,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  ShieldCheck,
  CircleDollarSign,
  Coins,
  ChevronRight,
  BarChart3,
  Home,
  Sliders,
} from "lucide-react";

type Period = "1M" | "3M" | "6M" | "1A" | "Tudo";

interface AssetIndex {
  id: string;
  name: string;
  type: string;
  color: string;
  currentValue: number;
  variation: number; // %
  points: Record<Period, number[]>;
}

const ASSETS_DATA: AssetIndex[] = [
  {
    id: "carteira",
    name: "Minha Carteira",
    type: "Patrimônio Consolidado",
    color: "#820AD1", // Roxo Nubank
    currentValue: 184520.45,
    variation: 2.84,
    points: {
      "1M": [178000, 179200, 180100, 181400, 182600, 183900, 184520],
      "3M": [165000, 168400, 171200, 173500, 177000, 180200, 184520],
      "6M": [148000, 153000, 159000, 164000, 170000, 178000, 184520],
      "1A": [130000, 137000, 145000, 154000, 162000, 174000, 184520],
      Tudo: [95000, 110000, 128000, 142000, 158000, 172000, 184520],
    },
  },
  {
    id: "cdi",
    name: "CDI Acumulado",
    type: "Benchmark Renda Fixa",
    color: "#2563EB", // Azul vibrante
    currentValue: 10450.0,
    variation: 1.05,
    points: {
      "1M": [100, 100.2, 100.4, 100.6, 100.8, 100.95, 101.05],
      "3M": [100, 100.8, 101.5, 102.1, 102.7, 103.2, 103.8],
      "6M": [100, 101.4, 102.9, 104.2, 105.4, 106.8, 107.9],
      "1A": [100, 102.8, 105.7, 108.5, 111.2, 113.8, 115.5],
      Tudo: [100, 108.2, 118.4, 129.5, 141.2, 152.0, 164.5],
    },
  },
  {
    id: "ibov",
    name: "Ibovespa",
    type: "Ações Brasil",
    color: "#10B981", // Esmeralda
    currentValue: 132480.0,
    variation: 1.92,
    points: {
      "1M": [128500, 129800, 127900, 130200, 131500, 130900, 132480],
      "3M": [123000, 126500, 124800, 128900, 127600, 131200, 132480],
      "6M": [118000, 121000, 124500, 122000, 126000, 129500, 132480],
      "1A": [115000, 119000, 125000, 121000, 127000, 130000, 132480],
      Tudo: [102000, 112000, 108000, 121000, 125000, 128000, 132480],
    },
  },
  {
    id: "sp500",
    name: "S&P 500 (BRL)",
    type: "Mercado Global",
    color: "#F59E0B", // Âmbar
    currentValue: 5860.2,
    variation: -0.45,
    points: {
      "1M": [5820, 5845, 5890, 5875, 5850, 5870, 5860],
      "3M": [5550, 5620, 5690, 5740, 5810, 5880, 5860],
      "6M": [5100, 5280, 5420, 5580, 5690, 5820, 5860],
      "1A": [4600, 4850, 5100, 5320, 5500, 5750, 5860],
      Tudo: [3900, 4250, 4700, 5050, 5400, 5650, 5860],
    },
  },
];

const PERIOD_LABELS: Record<Period, string[]> = {
  "1M": ["Dia 1", "Dia 5", "Dia 10", "Dia 15", "Dia 20", "Dia 25", "Hoje"],
  "3M": ["Mês -3", "Semana 2", "Mês -2", "Semana 4", "Mês -1", "Semana 6", "Hoje"],
  "6M": ["Mês -6", "Mês -5", "Mês -4", "Mês -3", "Mês -2", "Mês -1", "Hoje"],
  "1A": ["1º Tri", "2º Tri", "3º Tri", "4º Tri", "Nov", "Dez", "Hoje"],
  Tudo: ["2022", "2023", "2024", "2025", "2026", "2027", "Atual"],
};

export default function FinanceiroPage() {
  const { user } = useUser();
  const [showValues, setShowValues] = React.useState<boolean>(true);
  const [selectedPeriod, setSelectedPeriod] = React.useState<Period>("1M");
  const [activeAssetIds, setActiveAssetIds] = React.useState<string[]>(["carteira", "cdi"]);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Atalho '/' para focar na pesquisa
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleAsset = (id: string) => {
    if (activeAssetIds.includes(id)) {
      if (activeAssetIds.length > 1) {
        setActiveAssetIds(activeAssetIds.filter((item) => item !== id));
      }
    } else {
      setActiveAssetIds([...activeAssetIds, id]);
    }
  };

  const filteredAssets = ASSETS_DATA.filter((asset) =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Formatação segura de valores financeiros
  const formatBrl = (value: number) => {
    if (!showValues) return "R$ ••••••";
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  // Normalização das curvas para o gráfico interativo
  const chartWidth = 720;
  const chartHeight = 260;
  const paddingX = 20;
  const paddingY = 24;

  const normalizedCurves = React.useMemo(() => {
    return activeAssetIds.map((id) => {
      const asset = ASSETS_DATA.find((a) => a.id === id);
      if (!asset) return null;
      const dataPoints = asset.points[selectedPeriod];
      const baseVal = dataPoints[0] || 1;
      const normalizedPercent = dataPoints.map((v) => ((v - baseVal) / baseVal) * 100);
      return {
        asset,
        normalizedPercent,
      };
    }).filter(Boolean);
  }, [activeAssetIds, selectedPeriod]);

  // Min / Max percentual para escalonamento dinâmico
  const { minP, maxP } = React.useMemo(() => {
    let min = -1;
    let max = 3;
    normalizedCurves.forEach((curve) => {
      if (!curve) return;
      curve.normalizedPercent.forEach((p) => {
        if (p < min) min = p;
        if (p > max) max = p;
      });
    });
    const spread = max - min || 1;
    return { minP: min - spread * 0.1, maxP: max + spread * 0.1 };
  }, [normalizedCurves]);

  const generatePath = (points: number[]) => {
    if (!points.length) return "";
    const usableW = chartWidth - paddingX * 2;
    const usableH = chartHeight - paddingY * 2;

    const coords = points.map((p, i) => {
      const x = paddingX + (i / (points.length - 1)) * usableW;
      const normalizedY = (p - minP) / (maxP - minP);
      const y = chartHeight - paddingY - normalizedY * usableH;
      return { x, y };
    });

    // Curva cúbica suave (Bézier spline)
    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const curr = coords[i];
      const next = coords[i + 1];
      const mx = (curr.x + next.x) / 2;
      d += ` C ${mx} ${curr.y}, ${mx} ${next.y}, ${next.x} ${next.y}`;
    }
    return d;
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-purple-600 selection:text-white">
      {/* 1. SIDEBAR ESQUERDA ESTILO APP NATIVO (W-20) */}
      <aside className="w-20 border-r border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 flex flex-col items-center py-6 justify-between shrink-0 z-30 select-none shadow-xs">
        {/* Topo: Logo Arredondada Roxa Nubank */}
        <Link
          href="/dashboard"
          title="Voltar à Visão Geral"
          className="bg-purple-600 text-white rounded-2xl w-11 h-11 flex items-center justify-center font-bold text-lg shadow-md shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all"
        >
          <span>Nu</span>
        </Link>

        {/* Meio: Ícones de navegação espaçados */}
        <nav className="flex flex-col items-center gap-4">
          <Link
            href="/dashboard"
            title="Página Inicial do Sistema"
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-all"
          >
            <Home className="h-5 w-5" />
          </Link>

          <button
            type="button"
            title="Módulo Financeiro (Ativo)"
            className="w-12 h-12 rounded-2xl flex items-center justify-center bg-purple-600/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300 font-semibold shadow-xs"
          >
            <Wallet className="h-5 w-5" />
          </button>

          <Link
            href="/imobiliario"
            title="Módulo Imobiliário"
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-all"
          >
            <Building2 className="h-5 w-5" />
          </Link>

          <Link
            href="/fiscal"
            title="Módulo Fiscal & DARF"
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-all"
          >
            <Scale className="h-5 w-5" />
          </Link>

          <Link
            href="/hub-matematico"
            title="Hub de Ferramentas Matemáticas"
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-all"
          >
            <Calculator className="h-5 w-5" />
          </Link>
        </nav>

        {/* Rodapé da Sidebar: Perfil Clerk */}
        <div className="flex flex-col items-center gap-3">
          <div className="p-1 rounded-full ring-1 ring-zinc-200 dark:ring-zinc-800">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-9 w-9 rounded-full",
                },
              }}
            />
          </div>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL DO APLICATIVO */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* 2. HEADER INTERNO LIMPO */}
        <header className="h-16 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md px-6 sm:px-8 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Olá, {user?.firstName || "Investidor"}!
            </h1>
            <button
              onClick={() => setShowValues(!showValues)}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-all"
              title={showValues ? "Ocultar saldos" : "Mostrar saldos"}
            >
              {showValues ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5 text-purple-500" />}
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Barra de Pesquisa Arredondada com atalho '/' */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar ativo, índice ou moeda..."
                className="w-72 lg:w-80 pl-10 pr-9 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800/90 border border-transparent focus:border-purple-500/50 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-hidden transition-all shadow-2xs"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-400 border border-zinc-300 dark:border-zinc-700 rounded-md px-1.5 py-0.5 pointer-events-none">
                /
              </span>
            </div>
          </div>
        </header>

        {/* 3. GRID PRINCIPAL EM 3 COLUNAS RESPIRÁVEIS */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto pb-10">
            {/* 4. COLUNA ESQUERDA (col-span-12 lg:col-span-3) */}
            <section className="col-span-12 lg:col-span-3 space-y-6">
              {/* Card Minha Carteira & Índices */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      Índices & Carteiras
                    </h2>
                    <p className="text-[11px] text-zinc-400">
                      Clique para comparar no gráfico
                    </p>
                  </div>
                  <BarChart3 className="h-4 w-4 text-zinc-400" />
                </div>

                <div className="space-y-2.5">
                  {filteredAssets.map((asset) => {
                    const isSelected = activeAssetIds.includes(asset.id);
                    return (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={() => toggleAsset(asset.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-left ${
                          isSelected
                            ? "bg-zinc-100 dark:bg-zinc-800/90 ring-1"
                            : "hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                        }`}
                        style={{
                          borderColor: isSelected ? asset.color : "transparent",
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                            style={{ backgroundColor: asset.color }}
                          />
                          <div className="truncate">
                            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                              {asset.name}
                            </p>
                            <p className="text-[10px] text-zinc-400 truncate">
                              {asset.type}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tabular-nums ${
                              asset.variation >= 0
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            }`}
                          >
                            {asset.variation >= 0 ? `+${asset.variation}%` : `${asset.variation}%`}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dica / Status */}
              <div className="bg-purple-600/5 dark:bg-purple-900/10 rounded-3xl p-5 border border-purple-500/20 text-xs text-purple-900 dark:text-purple-200 flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-xs">Rentabilidade Otimizada</p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Sua carteira está rendendo <strong>118% do CDI</strong> no acumulado de 30 dias.
                  </p>
                </div>
              </div>
            </section>

            {/* 5. COLUNA CENTRAL (col-span-12 lg:col-span-6) */}
            <section className="col-span-12 lg:col-span-6 space-y-6">
              {/* Card Principal: Patrimônio & Performance Comparada */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs space-y-6">
                {/* Topo do Card de Performance */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Patrimônio Total
                    </span>
                    <div className="flex items-baseline gap-3 mt-1">
                      <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 tabular-nums">
                        {formatBrl(184520.45)}
                      </span>
                      <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full tabular-nums">
                        <ArrowUpRight className="h-3 w-3 mr-0.5" />
                        +R$ 5.120,00 no mês
                      </span>
                    </div>
                  </div>

                  {/* Seletor de Período em Pílulas Estilo Nubank */}
                  <div className="rounded-full bg-zinc-100 dark:bg-zinc-800 p-1 inline-flex gap-1 self-start sm:self-center">
                    {(["1M", "3M", "6M", "1A", "Tudo"] as Period[]).map((p) => {
                      const isActive = selectedPeriod === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setSelectedPeriod(p)}
                          className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                            isActive
                              ? "bg-purple-600 text-white shadow-xs"
                              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Gráfico de Curvas Suaves Minimalista (SVG) */}
                <div className="relative pt-4">
                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full h-56 sm:h-64 overflow-visible"
                  >
                    <defs>
                      <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#820AD1" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="#820AD1" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Linha zero de referência sutil */}
                    <line
                      x1={paddingX}
                      y1={chartHeight - paddingY - ((0 - minP) / (maxP - minP)) * (chartHeight - paddingY * 2)}
                      x2={chartWidth - paddingX}
                      y2={chartHeight - paddingY - ((0 - minP) / (maxP - minP)) * (chartHeight - paddingY * 2)}
                      stroke="currentColor"
                      strokeDasharray="4 4"
                      className="text-zinc-200 dark:text-zinc-800"
                      strokeWidth={1}
                    />

                    {/* Curvas selecionadas */}
                    {normalizedCurves.map((curve) => {
                      if (!curve) return null;
                      const path = generatePath(curve.normalizedPercent);
                      const isCarteira = curve.asset.id === "carteira";

                      return (
                        <g key={curve.asset.id}>
                          {isCarteira && (
                            <path
                              d={`${path} L ${chartWidth - paddingX} ${chartHeight - paddingY} L ${paddingX} ${chartHeight - paddingY} Z`}
                              fill="url(#purpleGrad)"
                            />
                          )}
                          <path
                            d={path}
                            fill="none"
                            stroke={curve.asset.color}
                            strokeWidth={3}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                      );
                    })}
                  </svg>

                  {/* Legenda dos Eixos do Período */}
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-3 px-1">
                    {PERIOD_LABELS[selectedPeriod].map((label, idx) => (
                      <span key={idx}>{label}</span>
                    ))}
                  </div>
                </div>

                {/* Tags dos Ativos Ativos no Gráfico */}
                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                  <span className="text-[11px] text-zinc-400">Linhas ativas:</span>
                  {activeAssetIds.map((id) => {
                    const asset = ASSETS_DATA.find((a) => a.id === id);
                    if (!asset) return null;
                    return (
                      <div
                        key={id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800"
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: asset.color }}
                        />
                        <span className="text-zinc-700 dark:text-zinc-300">{asset.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card Inferior: Resumo Rápido em 3 Caixinhas (Estilo Caixinhas do Nubank) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Caixinha 1 */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-purple-600/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300 flex items-center justify-center font-bold">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-zinc-400">55%</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Renda Fixa
                    </h3>
                    <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tabular-nums mt-0.5">
                      {formatBrl(101486.25)}
                    </p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                      100% CDI + IPCA
                    </p>
                  </div>
                </div>

                {/* Caixinha 2 */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300 flex items-center justify-center font-bold">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-zinc-400">30%</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Renda Variável
                    </h3>
                    <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tabular-nums mt-0.5">
                      {formatBrl(55356.13)}
                    </p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                      Ações & Fundos Imob.
                    </p>
                  </div>
                </div>

                {/* Caixinha 3 */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-300 flex items-center justify-center font-bold">
                      <CircleDollarSign className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-zinc-400">15%</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Reserva de Emergência
                    </h3>
                    <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tabular-nums mt-0.5">
                      {formatBrl(27678.07)}
                    </p>
                    <p className="text-[10px] text-zinc-400 font-medium mt-1">
                      Liquidez Imediata
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. COLUNA DIREITA (col-span-12 lg:col-span-3) */}
            <section className="col-span-12 lg:col-span-3 space-y-6">
              {/* Botões de Ação Rápida Circulares no Topo (Clássico Nubank) */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs">
                <div className="flex items-center justify-around">
                  {/* Botão 1: Novo Aporte */}
                  <div className="flex flex-col items-center gap-2">
                    <button
                      type="button"
                      onClick={() => alert("Janela de Novo Aporte ativada.")}
                      className="w-13 h-13 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-purple-600/15 hover:text-purple-600 dark:hover:text-purple-300 flex items-center justify-center transition-all shadow-xs active:scale-95"
                    >
                      <PlusCircle className="h-6 w-6" />
                    </button>
                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Novo Aporte
                    </span>
                  </div>

                  {/* Botão 2: Simular */}
                  <Link
                    href="/hub-matematico"
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="w-13 h-13 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 group-hover:bg-purple-600/15 group-hover:text-purple-600 dark:group-hover:text-purple-300 flex items-center justify-center transition-all shadow-xs active:scale-95">
                      <Calculator className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Simular
                    </span>
                  </Link>

                  {/* Botão 3: Exportar */}
                  <div className="flex flex-col items-center gap-2">
                    <button
                      type="button"
                      onClick={() => alert("Relatório consolidado exportado com sucesso!")}
                      className="w-13 h-13 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-purple-600/15 hover:text-purple-600 dark:hover:text-purple-300 flex items-center justify-center transition-all shadow-xs active:scale-95"
                    >
                      <Download className="h-6 w-6" />
                    </button>
                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Exportar
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Câmbio & Cripto Simplificado */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Câmbio & Cripto
                  </h2>
                  <Coins className="h-4 w-4 text-zinc-400" />
                </div>

                <div className="space-y-3">
                  {/* Dólar */}
                  <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <div>
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Dólar Comercial</p>
                      <p className="text-[10px] text-zinc-400">USD / BRL</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                        {showValues ? "R$ 5,68" : "R$ •••"}
                      </p>
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full tabular-nums">
                        +0,42%
                      </span>
                    </div>
                  </div>

                  {/* Euro */}
                  <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <div>
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Euro Oficial</p>
                      <p className="text-[10px] text-zinc-400">EUR / BRL</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                        {showValues ? "R$ 6,18" : "R$ •••"}
                      </p>
                      <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded-full tabular-nums">
                        -0,15%
                      </span>
                    </div>
                  </div>

                  {/* Bitcoin */}
                  <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <div>
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Bitcoin</p>
                      <p className="text-[10px] text-zinc-400">BTC / BRL</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                        {showValues ? "R$ 382.400" : "R$ •••••"}
                      </p>
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full tabular-nums">
                        +3,12%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Radar / Insights */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Radar & Notificações
                  </h2>
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 space-y-1">
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      Dividendos creditados
                    </p>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      R$ 342,80 em proventos de FIIs foram depositados em sua conta.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 space-y-1">
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      Rebalanceamento sugerido
                    </p>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Sua reserva está 2% abaixo da meta estipulada de segurança.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
