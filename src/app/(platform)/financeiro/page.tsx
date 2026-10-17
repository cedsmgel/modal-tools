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
  ShieldCheck,
  CircleDollarSign,
  Coins,
  BarChart3,
  Home,
  RefreshCw,
  Newspaper,
  Bell,
  X,
} from "lucide-react";
import type { BrapiStockQuote, BrapiCurrencyQuote, BrapiCryptoQuote } from "@/lib/brapi";

type Period = "1M" | "3M" | "6M" | "1A" | "Tudo";

const PERIOD_LABELS: Record<Period, string[]> = {
  "1M": ["Dia 1", "Dia 5", "Dia 10", "Dia 15", "Dia 20", "Dia 25", "Hoje"],
  "3M": ["Mês -3", "Semana 2", "Mês -2", "Semana 4", "Mês -1", "Semana 6", "Hoje"],
  "6M": ["Mês -6", "Mês -5", "Mês -4", "Mês -3", "Mês -2", "Mês -1", "Hoje"],
  "1A": ["1º Tri", "2º Tri", "3º Tri", "4º Tri", "Nov", "Dez", "Hoje"],
  Tudo: ["2022", "2023", "2024", "2025", "2026", "2027", "Atual"],
};

const NEWS_ITEMS = [
  {
    id: "1",
    title: "Copom sinaliza cautela e mercado ajusta projeções de juros para o ano",
    source: "Valor Econômico",
    time: "Há 2h",
  },
  {
    id: "2",
    title: "Ibovespa opera com suporte de fluxo estrangeiro e setor de commodities",
    source: "InfoMoney",
    time: "Há 4h",
  },
  {
    id: "3",
    title: "Dólar recua globalmente com dados de inflação e superávit comercial",
    source: "Bloomberg Línea",
    time: "Há 5h",
  },
];

export default function FinanceiroPage() {
  const { user } = useUser();
  const [showValues, setShowValues] = React.useState<boolean>(true);
  const [selectedPeriod, setSelectedPeriod] = React.useState<Period>("1M");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [isLoadingMarket, setIsLoadingMarket] = React.useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState<boolean>(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Estados de dados da brapi.dev
  const [brapiStocks, setBrapiStocks] = React.useState<BrapiStockQuote[]>([]);
  const [brapiCurrencies, setBrapiCurrencies] = React.useState<BrapiCurrencyQuote[]>([]);
  const [brapiCrypto, setBrapiCrypto] = React.useState<BrapiCryptoQuote[]>([]);
  const [macroRates, setMacroRates] = React.useState<{ cdi?: number; selic?: number; ipca?: number }>({
    cdi: 10.65,
    selic: 10.75,
    ipca: 4.42,
  });

  // Busca dados de mercado ao carregar a página
  const fetchMarketData = React.useCallback(async () => {
    setIsLoadingMarket(true);
    try {
      const res = await fetch("/api/financeiro/market");
      if (res.ok) {
        const json: any = await res.json();
        if (json && json.success && json.data) {
          setBrapiStocks(json.data.stocks || []);
          setBrapiCurrencies(json.data.currencies || []);
          setBrapiCrypto(json.data.cryptos || []);
          if (json.data.macro) {
            setMacroRates({
              cdi: json.data.macro.cdi?.value || 10.65,
              selic: json.data.macro.selic?.value || 10.75,
              ipca: json.data.macro.ipca?.value || 4.42,
            });
          }
        }
      }
    } catch (err) {
      console.warn("Erro ao buscar dados brapi:", err);
    } finally {
      setIsLoadingMarket(false);
    }
  }, []);

  React.useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

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

  const formatBrl = (value: number) => {
    if (!showValues) return "R$ ••••••";
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const usdCurrency = brapiCurrencies.find((c) => c.fromCurrency === "USD") || { bidPrice: 5.68, pctChange: -0.2 };
  const eurCurrency = brapiCurrencies.find((c) => c.fromCurrency === "EUR") || { bidPrice: 6.15, pctChange: 0.1 };
  const btcCrypto = brapiCrypto.find((c) => c.coin === "BTC") || { regularMarketPrice: 382450, regularMarketChangePercent: 3.12 };

  // Lista de índices e cotações para o Bloomberg Ticker Tape contínuo
  const tickerItems = React.useMemo(() => {
    const baseIndices = [
      { label: "IBOV", value: "131.200", change: 0.4 },
      { label: "S&P 500", value: "5.800", change: 1.2 },
      { label: "USD", value: usdCurrency.bidPrice.toFixed(2), change: Number(usdCurrency.pctChange.toFixed(1)) },
      { label: "EUR", value: eurCurrency.bidPrice.toFixed(2), change: Number(eurCurrency.pctChange.toFixed(1)) },
      { label: "SELIC", value: `${macroRates.selic || 10.75}%`, change: undefined },
      { label: "CDI", value: `${macroRates.cdi || 10.65}%`, change: undefined },
      { label: "IPCA", value: `${macroRates.ipca || 4.42}%`, change: undefined },
      { label: "BTC", value: `R$ ${btcCrypto.regularMarketPrice.toLocaleString("pt-BR")}`, change: Number(btcCrypto.regularMarketChangePercent.toFixed(1)) },
    ];

    const stockTickers = brapiStocks.length > 0
      ? brapiStocks.slice(0, 8).map((st) => ({
          label: st.symbol,
          value: `R$ ${st.regularMarketPrice.toFixed(2)}`,
          change: Number(st.regularMarketChangePercent.toFixed(2)),
        }))
      : [
          { label: "PETR4", value: "R$ 38,40", change: 1.25 },
          { label: "VALE3", value: "R$ 61,15", change: -0.68 },
          { label: "ITUB4", value: "R$ 34,90", change: 0.52 },
          { label: "BBDC4", value: "R$ 14,20", change: -0.35 },
          { label: "BBAS3", value: "R$ 27,80", change: 0.88 },
        ];

    const combined = [...baseIndices, ...stockTickers];
    // Duplicamos a lista exatamente para criar o looping infinito sem emendas
    return [...combined, ...combined];
  }, [usdCurrency, eurCurrency, macroRates, btcCrypto, brapiStocks]);

  // Dimensões do gráfico central
  const chartWidth = 720;
  const chartHeight = 180;
  const paddingX = 20;
  const paddingY = 20;

  return (
    <div className="h-screen w-full overflow-hidden flex bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-purple-600 selection:text-white">
      {/* 1. SIDEBAR ESQUERDA ESTILO APP NATIVO (W-20) */}
      <aside className="w-20 border-r border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 flex flex-col items-center py-5 justify-between shrink-0 z-30 select-none shadow-xs">
        {/* Topo: Perfil do Usuário Clerk com avatarBox w-10 h-10 */}
        <div className="flex items-center justify-center">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
              },
            }}
          />
        </div>

        {/* Meio: Ícones de navegação espaçados */}
        <nav className="flex flex-col items-center gap-3">
          <Link
            href="/dashboard"
            title="Página Inicial do Sistema"
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-all"
          >
            <Home className="h-5 w-5" />
          </Link>

          <button
            type="button"
            title="Módulo Financeiro (Ativo)"
            className="w-11 h-11 rounded-2xl flex items-center justify-center bg-purple-600/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300 font-semibold shadow-xs"
          >
            <Wallet className="h-5 w-5" />
          </button>

          <Link
            href="/imobiliario"
            title="Módulo Imobiliário"
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-all"
          >
            <Building2 className="h-5 w-5" />
          </Link>

          <Link
            href="/fiscal"
            title="Módulo Fiscal & DARF"
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-all"
          >
            <Scale className="h-5 w-5" />
          </Link>

          <Link
            href="/hub-matematico"
            title="Hub de Ferramentas Matemáticas"
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-all"
          >
            <Calculator className="h-5 w-5" />
          </Link>
        </nav>

        {/* Rodapé da Sidebar: Espaçamento de segurança (pb-12) para não colidir com dev tools */}
        <div className="flex flex-col items-center pb-12">
          <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-mono text-zinc-400">
            PRO
          </div>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL DO APLICATIVO */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
        {/* 2. HEADER INTERNO LIMPO */}
        <header className="h-14 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md px-5 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <h1 className="text-base sm:text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Olá, {user?.firstName || "Investidor"}!
            </h1>
            <button
              onClick={() => setShowValues(!showValues)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-all cursor-pointer"
              title={showValues ? "Ocultar saldos" : "Mostrar saldos"}
            >
              {showValues ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-purple-500" />}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchMarketData}
              disabled={isLoadingMarket}
              title="Atualizar cotações via brapi.dev"
              className="p-1.5 rounded-full text-zinc-400 hover:text-purple-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${isLoadingMarket ? "animate-spin text-purple-600" : ""}`} />
            </button>

            {/* Barra de Pesquisa Arredondada */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar ativo, B3, índice..."
                className="w-64 pl-8.5 pr-8 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/90 border border-transparent focus:border-purple-500/50 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-hidden transition-all shadow-2xs"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono text-zinc-400 border border-zinc-300 dark:border-zinc-700 rounded-md px-1 py-0.2 pointer-events-none">
                /
              </span>
            </div>
          </div>
        </header>

        {/* 2.5 CARROSSEL DE ÍNDICES COM EFEITO BLOOMBERG (MARQUEE INFINITO) */}
        <div className="relative w-full overflow-hidden border-b border-zinc-200/80 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xs shrink-0 select-none py-2.5">
          {/* Fades elegantes de gradiente nas laterais */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-zinc-50 dark:from-zinc-950 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-zinc-50 dark:from-zinc-950 to-transparent z-10" />

          {/* Track com animação infinita de rolagem contínua */}
          <div className="animate-bloomberg-ticker items-center gap-7 px-4">
            {tickerItems.map((item, idx) => (
              <div
                key={`${item.label}-${idx}`}
                className="flex items-center gap-2 whitespace-nowrap shrink-0 group cursor-default"
              >
                <span className="text-zinc-500 dark:text-zinc-400 font-semibold uppercase text-xs tracking-wider">
                  {item.label}
                </span>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                  {item.value}
                </span>
                {item.change !== undefined && (
                  <span
                    className={`text-xs font-medium tabular-nums ${
                      item.change >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {item.change >= 0 ? `+${item.change}%` : `${item.change}%`}
                  </span>
                )}
                <span className="text-zinc-300 dark:text-zinc-800 font-normal ml-3 select-none">•</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. GRID PRINCIPAL EM 3 COLUNAS RESPIRÁVEIS */}
        <main className="flex-1 min-h-0 overflow-hidden p-4">
          <div className="grid grid-cols-12 gap-4 h-full max-w-7xl mx-auto">
            {/* 4. COLUNA ESQUERDA: MINHA CARTEIRA (EMPTY STATE REAL) */}
            <section className="col-span-12 lg:col-span-3 flex flex-col gap-3 min-h-0 h-full">
              {/* Card Minha Carteira */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-4 border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs flex-1 min-h-0 flex flex-col">
                <div className="flex items-center justify-between mb-2 shrink-0">
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                      Minha Carteira
                    </h2>
                    <p className="text-[10px] text-zinc-400">
                      Gestão de Ativos & Patrimônio
                    </p>
                  </div>
                  <BarChart3 className="h-4 w-4 text-zinc-400" />
                </div>

                {/* Empty State Elegante */}
                <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800/70 text-zinc-400 flex items-center justify-center mb-3 shadow-2xs">
                    <Wallet className="h-6 w-6 stroke-1 text-zinc-400" />
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-[210px]">
                    Nenhum ativo registado. Adicione o seu primeiro aporte para ver o seu património crescer.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full mt-4 py-2.5 px-3 border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-purple-500 dark:hover:border-purple-400 rounded-2xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 flex items-center justify-center gap-2 transition-all cursor-pointer group hover:bg-purple-500/5 active:scale-98"
                  >
                    <PlusCircle className="h-4 w-4 text-zinc-400 group-hover:text-purple-500 transition-colors" />
                    Adicionar Ativo
                  </button>
                </div>
              </div>

              {/* Status Macro via brapi */}
              <div className="bg-purple-600/5 dark:bg-purple-900/10 rounded-2xl p-3 border border-purple-500/20 text-xs text-purple-900 dark:text-purple-200 shrink-0 flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <div className="min-w-0 truncate">
                  <p className="font-semibold text-[11px] leading-tight">Macroeconomia B3</p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                    CDI: <strong>{macroRates.cdi}%</strong> • Selic: <strong>{macroRates.selic}%</strong> • IPCA: <strong>{macroRates.ipca}%</strong>
                  </p>
                </div>
              </div>
            </section>

            {/* 5. COLUNA CENTRAL (col-span-12 lg:col-span-6) */}
            <section className="col-span-12 lg:col-span-6 flex flex-col gap-3 min-h-0 h-full">
              {/* Card Principal: Patrimônio Total Zerado & Gráfico Plano */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs flex-1 min-h-0 flex flex-col justify-between">
                {/* Topo do Card de Performance */}
                <div className="flex flex-wrap items-start justify-between gap-3 shrink-0">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                      PATRIMÔNIO TOTAL
                    </span>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 tabular-nums">
                        {formatBrl(0)}
                      </span>
                      <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-0.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 tabular-nums">
                        R$ 0,00 (0,0%)
                      </span>
                    </div>
                  </div>

                  {/* Seletor de Período em Pílulas */}
                  <div className="shrink-0 bg-zinc-100 dark:bg-zinc-950/80 p-0.5 rounded-full border border-zinc-200/80 dark:border-zinc-800/80 flex items-center gap-0.5 shadow-2xs">
                    {(["1M", "3M", "6M", "1A", "Tudo"] as Period[]).map((p) => {
                      const isActive = selectedPeriod === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setSelectedPeriod(p)}
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-all cursor-pointer ${
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

                {/* Gráfico Central: Linha Plana Minimalista (Empty State Suave) */}
                <div className="relative flex-1 min-h-[150px] max-h-[220px] flex flex-col justify-center my-2 items-center">
                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full h-full max-h-[170px] overflow-visible"
                  >
                    <defs>
                      <linearGradient id="purpleGradZero" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#820AD1" stopOpacity="0.10" />
                        <stop offset="100%" stopColor="#820AD1" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Linha zero sutil */}
                    <line
                      x1={paddingX}
                      y1={chartHeight / 2}
                      x2={chartWidth - paddingX}
                      y2={chartHeight / 2}
                      stroke="currentColor"
                      strokeDasharray="4 4"
                      className="text-zinc-200 dark:text-zinc-800"
                      strokeWidth={1}
                    />

                    {/* Preenchimento degradê e linha plana roxa Nubank */}
                    <path
                      d={`M ${paddingX} ${chartHeight / 2} L ${chartWidth - paddingX} ${chartHeight / 2} L ${chartWidth - paddingX} ${chartHeight - paddingY} L ${paddingX} ${chartHeight - paddingY} Z`}
                      fill="url(#purpleGradZero)"
                    />
                    <line
                      x1={paddingX}
                      y1={chartHeight / 2}
                      x2={chartWidth - paddingX}
                      y2={chartHeight / 2}
                      stroke="#820AD1"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Indicador de estado vazio no centro */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[11px] font-medium text-zinc-400 bg-white/90 dark:bg-zinc-900/90 px-3 py-1 rounded-full border border-zinc-200/60 dark:border-zinc-800/60 backdrop-blur-xs shadow-2xs">
                      Aguardando primeiro aporte para gerar histórico
                    </span>
                  </div>

                  {/* Legenda dos Eixos do Período */}
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1.5 px-1 shrink-0 w-full">
                    {PERIOD_LABELS[selectedPeriod].map((label, idx) => (
                      <span key={idx}>{label}</span>
                    ))}
                  </div>
                </div>

                {/* Status da Carteira */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 shrink-0">
                  <span className="text-[10px] text-zinc-400">Status da Carteira:</span>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                    <span>0 Ativos Registados</span>
                  </div>
                </div>
              </div>

              {/* Card Inferior: Resumo Rápido em 3 Caixinhas Zeradas */}
              <div className="grid grid-cols-3 gap-3 shrink-0">
                {/* Caixinha 1 */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-3.5 border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-purple-600/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300 flex items-center justify-center font-bold">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-zinc-400">0%</span>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                      Renda Fixa
                    </h3>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                      {formatBrl(0)}
                    </p>
                    <p className="text-[9px] text-zinc-400 font-medium truncate">
                      CDI ({macroRates.cdi}%) + IPCA
                    </p>
                  </div>
                </div>

                {/* Caixinha 2 */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-3.5 border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300 flex items-center justify-center font-bold">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-zinc-400">0%</span>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                      Renda Variável
                    </h3>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                      {formatBrl(0)}
                    </p>
                    <p className="text-[9px] text-zinc-400 font-medium truncate">
                      Ações B3 & Fundos
                    </p>
                  </div>
                </div>

                {/* Caixinha 3 */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-3.5 border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-300 flex items-center justify-center font-bold">
                      <CircleDollarSign className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-zinc-400">0%</span>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                      Reserva
                    </h3>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                      {formatBrl(0)}
                    </p>
                    <p className="text-[9px] text-zinc-400 font-medium truncate">
                      Liquidez Imediata
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. COLUNA DIREITA (col-span-12 lg:col-span-3) */}
            <section className="col-span-12 lg:col-span-3 flex flex-col gap-3 min-h-0 h-full">
              {/* Botões de Ação Rápida no Topo */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-3.5 border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs shrink-0">
                <div className="flex items-center justify-around">
                  {/* Botão 1: Novo Aporte */}
                  <div className="flex flex-col items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(true)}
                      className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-purple-600/15 hover:text-purple-600 dark:hover:text-purple-300 flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer"
                    >
                      <PlusCircle className="h-5 w-5" />
                    </button>
                    <span className="text-[10px] font-medium text-zinc-700 dark:text-zinc-300">
                      Novo Aporte
                    </span>
                  </div>

                  {/* Botão 2: Simular */}
                  <Link
                    href="/hub-matematico"
                    className="flex flex-col items-center gap-1.5 group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 group-hover:bg-purple-600/15 group-hover:text-purple-600 dark:group-hover:text-purple-300 flex items-center justify-center transition-all shadow-xs active:scale-95">
                      <Calculator className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-medium text-zinc-700 dark:text-zinc-300">
                      Simular
                    </span>
                  </Link>

                  {/* Botão 3: Exportar */}
                  <div className="flex flex-col items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => alert("Relatório consolidado exportado com sucesso!")}
                      className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-purple-600/15 hover:text-purple-600 dark:hover:text-purple-300 flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                    <span className="text-[10px] font-medium text-zinc-700 dark:text-zinc-300">
                      Exportar
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Câmbio & Cripto */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-3.5 border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs shrink-0 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                      Câmbio & Cripto
                    </h2>
                    <p className="text-[9px] text-zinc-400">Tempo real brapi.dev</p>
                  </div>
                  <Coins className="h-4 w-4 text-zinc-400" />
                </div>

                <div className="space-y-1.5">
                  {/* Dólar */}
                  <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <div>
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">Dólar PTAX</p>
                      <p className="text-[9px] text-zinc-400">USD / BRL</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold tabular-nums text-zinc-900 dark:text-zinc-100 leading-tight">
                        {showValues ? `R$ ${usdCurrency.bidPrice.toFixed(2)}` : "R$ •••"}
                      </p>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-full tabular-nums ${
                        usdCurrency.pctChange >= 0
                          ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                          : "text-rose-600 dark:text-rose-400 bg-rose-500/10"
                      }`}>
                        {usdCurrency.pctChange >= 0 ? `+${usdCurrency.pctChange}%` : `${usdCurrency.pctChange}%`}
                      </span>
                    </div>
                  </div>

                  {/* Euro */}
                  <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <div>
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">Euro PTAX</p>
                      <p className="text-[9px] text-zinc-400">EUR / BRL</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold tabular-nums text-zinc-900 dark:text-zinc-100 leading-tight">
                        {showValues ? `R$ ${eurCurrency.bidPrice.toFixed(2)}` : "R$ •••"}
                      </p>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-full tabular-nums ${
                        eurCurrency.pctChange >= 0
                          ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                          : "text-rose-600 dark:text-rose-400 bg-rose-500/10"
                      }`}>
                        {eurCurrency.pctChange >= 0 ? `+${eurCurrency.pctChange}%` : `${eurCurrency.pctChange}%`}
                      </span>
                    </div>
                  </div>

                  {/* Bitcoin */}
                  <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <div>
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">Bitcoin</p>
                      <p className="text-[9px] text-zinc-400">BTC / BRL</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold tabular-nums text-zinc-900 dark:text-zinc-100 leading-tight">
                        {showValues ? `R$ ${btcCrypto.regularMarketPrice.toLocaleString("pt-BR")}` : "R$ •••••"}
                      </p>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-full tabular-nums ${
                        btcCrypto.regularMarketChangePercent >= 0
                          ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                          : "text-rose-600 dark:text-rose-400 bg-rose-500/10"
                      }`}>
                        {btcCrypto.regularMarketChangePercent >= 0 ? `+${btcCrypto.regularMarketChangePercent}%` : `${btcCrypto.regularMarketChangePercent}%`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Radar & Notícias (Agregador) */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-3.5 border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs flex-1 min-h-0 flex flex-col">
                <div className="flex items-center justify-between mb-2 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Newspaper className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                      Radar & Notícias
                    </h2>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                  {/* Feed com 3 notícias estilo feed */}
                  <div className="space-y-1.5">
                    {NEWS_ITEMS.map((item) => (
                      <div
                        key={item.id}
                        className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 border border-zinc-100 dark:border-zinc-800/60 transition-colors cursor-pointer space-y-1"
                      >
                        <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 leading-snug">
                          {item.title}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-zinc-400">
                          <span>{item.source}</span>
                          <span>{item.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Separador sutil */}
                  <div className="border-t border-zinc-100 dark:border-zinc-800/80 my-1" />

                  {/* Notificação de sistema */}
                  <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-start gap-2">
                    <Bell className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-purple-950 dark:text-purple-200 leading-tight">
                        Aviso do Sistema
                      </p>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-snug mt-0.5">
                        Aviso: Fechamento de mercado às 18h. Ordens enviadas após esse horário serão processadas no dia útil seguinte.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Modal para Adicionar Ativo (Empty State Interactive Action) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300 flex items-center justify-center font-bold">
                  <PlusCircle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Adicionar Ativo</h3>
                  <p className="text-[11px] text-zinc-400">Cadastre um novo ativo na sua carteira</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Código do Ativo (Ticker)
                </label>
                <input
                  type="text"
                  placeholder="Ex: PETR4, ITUB4, Tesouro Selic..."
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-hidden focus:border-purple-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 100"
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-hidden focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Preço Médio (R$)
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 35.50"
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-hidden focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("Aporte inicial registrado com sucesso!");
                  setIsAddModalOpen(false);
                }}
                className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
              >
                Salvar Ativo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
