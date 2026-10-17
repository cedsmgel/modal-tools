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
  Check,
} from "lucide-react";
import {
  FinancialChart,
  type ActiveSeriesItem,
  type ChartPeriod,
} from "@/components/financial-chart";
import type { Color } from "@tremor/react";

export type AssetCategory = "todos" | "acoes" | "fiis" | "cripto" | "cambio" | "taxas";

export interface MultiAssetItem {
  id: string;
  ticker: string;
  name: string;
  category: "acoes" | "fiis" | "cripto" | "cambio" | "taxas";
  price: number;
  changePercent: number;
  currency?: string;
  updatedAt?: string;
}

const CATEGORY_TABS: { id: AssetCategory; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "acoes", label: "Ações" },
  { id: "fiis", label: "FIIs" },
  { id: "cripto", label: "Cripto" },
  { id: "cambio", label: "Câmbio" },
  { id: "taxas", label: "Taxas" },
];

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

const DEFAULT_MULTI_ASSETS: MultiAssetItem[] = [
  { id: "petr4", ticker: "PETR4", name: "Petrobras PN", category: "acoes", price: 38.45, changePercent: 1.18 },
  { id: "vale3", ticker: "VALE3", name: "Vale ON", category: "acoes", price: 61.20, changePercent: -0.65 },
  { id: "itub4", ticker: "ITUB4", name: "Itaú Unibanco PN", category: "acoes", price: 35.80, changePercent: 0.85 },
  { id: "bbdc4", ticker: "BBDC4", name: "Bradesco PN", category: "acoes", price: 14.92, changePercent: 1.02 },
  { id: "wege3", ticker: "WEGE3", name: "WEG ON", category: "acoes", price: 54.30, changePercent: 2.14 },
  { id: "bova11", ticker: "BOVA11", name: "iShares Ibovespa ETF", category: "acoes", price: 126.80, changePercent: 0.45 },
  { id: "hglg11", ticker: "HGLG11", name: "CSHG Logística FII", category: "fiis", price: 165.40, changePercent: 0.32 },
  { id: "knip11", ticker: "KNIP11", name: "Kinea Índices FII", category: "fiis", price: 94.50, changePercent: -0.15 },
  { id: "xplg11", ticker: "XPLG11", name: "XP Log FII", category: "fiis", price: 99.80, changePercent: 0.28 },
  { id: "mxrf11", ticker: "MXRF11", name: "Maxi Renda FII", category: "fiis", price: 10.15, changePercent: 0.10 },
  { id: "btc", ticker: "BTC", name: "Bitcoin", category: "cripto", price: 382450.0, changePercent: 3.12 },
  { id: "eth", ticker: "ETH", name: "Ethereum", category: "cripto", price: 15420.0, changePercent: 1.84 },
  { id: "usd", ticker: "USD/BRL", name: "Dólar Comercial", category: "cambio", price: 5.682, changePercent: 0.42 },
  { id: "eur", ticker: "EUR/BRL", name: "Euro Comercial", category: "cambio", price: 6.184, changePercent: -0.15 },
  { id: "selic", ticker: "SELIC", name: "Taxa Selic Meta", category: "taxas", price: 10.75, changePercent: 0.0 },
  { id: "cdi", ticker: "CDI", name: "Certificado de Depósito", category: "taxas", price: 10.65, changePercent: 0.0 },
  { id: "ipca", ticker: "IPCA", name: "Inflação 12 Meses", category: "taxas", price: 4.42, changePercent: 0.0 },
];

const PALETTE: { color: Color; hex: string }[] = [
  { color: "purple", hex: "#820AD1" },
  { color: "emerald", hex: "#10B981" },
  { color: "blue", hex: "#2563EB" },
  { color: "amber", hex: "#F59E0B" },
  { color: "cyan", hex: "#06B6D4" },
  { color: "rose", hex: "#F43F5E" },
  { color: "indigo", hex: "#6366F1" },
  { color: "violet", hex: "#8B5CF6" },
];

export default function FinanceiroPage() {
  const { user } = useUser();
  const [showValues, setShowValues] = React.useState<boolean>(true);
  const [selectedPeriod, setSelectedPeriod] = React.useState<ChartPeriod>("1M");
  const [selectedCategory, setSelectedCategory] = React.useState<AssetCategory>("todos");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [isLoadingMarket, setIsLoadingMarket] = React.useState<boolean>(false);
  const [isChartExpanded, setIsChartExpanded] = React.useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = React.useState<string>("Agora");
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Séries ativas no gráfico comparativo avançado (Koyfin / Tremor)
  const [activeSeries, setActiveSeries] = React.useState<ActiveSeriesItem[]>([
    { id: "bova11", ticker: "BOVA11", name: "iShares Ibovespa ETF", color: "purple", colorHex: "#820AD1", changePercent: 0.45 },
    { id: "petr4", ticker: "PETR4", name: "Petrobras PN", color: "emerald", colorHex: "#10B981", changePercent: 1.18 },
    { id: "vale3", ticker: "VALE3", name: "Vale ON", color: "blue", colorHex: "#2563EB", changePercent: -0.65 },
  ]);

  // Dados reais consolidados da rota /api/market/multi-assets
  const [multiAssets, setMultiAssets] = React.useState<MultiAssetItem[]>(DEFAULT_MULTI_ASSETS);
  const [macroRates, setMacroRates] = React.useState<{ cdi?: number; selic?: number; ipca?: number }>({
    cdi: 10.65,
    selic: 10.75,
    ipca: 4.42,
  });

  // Alterna ativo na lista de séries do gráfico
  const toggleSeries = (asset: MultiAssetItem) => {
    if (activeSeries.some((s) => s.id === asset.id)) {
      setActiveSeries(activeSeries.filter((s) => s.id !== asset.id));
    } else {
      const usedColors = activeSeries.map((s) => s.color);
      const available =
        PALETTE.find((p) => !usedColors.includes(p.color)) ||
        PALETTE[activeSeries.length % PALETTE.length];

      setActiveSeries([
        ...activeSeries,
        {
          id: asset.id,
          ticker: asset.ticker,
          name: asset.name,
          color: available.color,
          colorHex: available.hex,
          changePercent: asset.changePercent,
        },
      ]);
    }
  };

  const handleRemoveSeries = (id: string) => {
    setActiveSeries(activeSeries.filter((s) => s.id !== id));
  };

  // Busca dados de mercado ao carregar a página
  const fetchMarketData = React.useCallback(async () => {
    setIsLoadingMarket(true);
    try {
      const res = await fetch("/api/market/multi-assets");
      if (res.ok) {
        const json: any = await res.json();
        if (json && json.success && Array.isArray(json.assets)) {
          setMultiAssets(json.assets);
          if (json.macro) {
            setMacroRates({
              cdi: json.macro.cdi ?? 10.65,
              selic: json.macro.selic ?? 10.75,
              ipca: json.macro.ipca ?? 4.42,
            });
          }
          const now = new Date();
          setLastUpdated(
            now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
          );
        }
      }
    } catch (err) {
      console.warn("Erro ao buscar dados multi-assets:", err);
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

  const formatAssetPrice = (asset: MultiAssetItem) => {
    if (!showValues) return "R$ •••";
    if (asset.category === "taxas") {
      return `${asset.price.toFixed(2)}% a.a.`;
    }
    return `R$ ${asset.price.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Filtragem multi-ativos por categoria e busca
  const filteredMultiAssets = React.useMemo(() => {
    let list = multiAssets;
    if (selectedCategory !== "todos") {
      list = list.filter((a) => a.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) => a.ticker.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)
      );
    }
    return list;
  }, [multiAssets, selectedCategory, searchQuery]);

  // Itens para o Carrossel Bloomberg Ticker Tape
  const tickerItems = React.useMemo(() => {
    const usd = multiAssets.find((a) => a.id === "usd" || a.ticker.includes("USD"));
    const eur = multiAssets.find((a) => a.id === "eur" || a.ticker.includes("EUR"));
    const btc = multiAssets.find((a) => a.id === "btc");
    const bova11 = multiAssets.find((a) => a.ticker === "BOVA11");
    const petr4 = multiAssets.find((a) => a.ticker === "PETR4");
    const vale3 = multiAssets.find((a) => a.ticker === "VALE3");

    const baseList = [
      { label: "IBOV", value: "131.200", change: 0.4 },
      { label: "S&P 500", value: "5.800", change: 1.2 },
      {
        label: "USD",
        value: usd ? `R$ ${usd.price.toFixed(2)}` : "R$ 5,68",
        change: usd ? Number(usd.changePercent.toFixed(1)) : -0.2,
      },
      {
        label: "EUR",
        value: eur ? `R$ ${eur.price.toFixed(2)}` : "R$ 6,15",
        change: eur ? Number(eur.changePercent.toFixed(1)) : 0.1,
      },
      {
        label: "BOVA11",
        value: bova11 ? `R$ ${bova11.price.toFixed(2)}` : "R$ 126,80",
        change: bova11 ? Number(bova11.changePercent.toFixed(1)) : 0.45,
      },
      { label: "SELIC", value: `${macroRates.selic || 10.75}%`, change: undefined },
      { label: "CDI", value: `${macroRates.cdi || 10.65}%`, change: undefined },
      { label: "IPCA", value: `${macroRates.ipca || 4.42}%`, change: undefined },
      {
        label: "BTC",
        value: btc ? `R$ ${btc.price.toLocaleString("pt-BR")}` : "R$ 382.450",
        change: btc ? Number(btc.changePercent.toFixed(1)) : 3.12,
      },
      {
        label: "PETR4",
        value: petr4 ? `R$ ${petr4.price.toFixed(2)}` : "R$ 38,40",
        change: petr4 ? Number(petr4.changePercent.toFixed(1)) : 1.18,
      },
      {
        label: "VALE3",
        value: vale3 ? `R$ ${vale3.price.toFixed(2)}` : "R$ 61,20",
        change: vale3 ? Number(vale3.changePercent.toFixed(1)) : -0.65,
      },
    ];

    // Duplicação para looping 100% contínuo e sem saltos
    return [...baseList, ...baseList];
  }, [multiAssets, macroRates]);

  // Cotações laterais do card Câmbio & Cripto
  const usdItem = multiAssets.find((a) => a.id === "usd" || a.ticker.includes("USD")) || {
    price: 5.68,
    changePercent: 0.42,
  };
  const eurItem = multiAssets.find((a) => a.id === "eur" || a.ticker.includes("EUR")) || {
    price: 6.18,
    changePercent: -0.15,
  };
  const btcItem = multiAssets.find((a) => a.id === "btc") || {
    price: 382450,
    changePercent: 3.12,
  };

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

            {/* Status e Horário do Pregão B3 no Header */}
            <div className="hidden lg:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100/90 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 text-xs shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">B3</span>
              <span className="text-zinc-300 dark:text-zinc-600">•</span>
              <span className="text-[11px] text-zinc-600 dark:text-zinc-300 font-medium">
                Pregão: <strong className="font-semibold text-zinc-900 dark:text-zinc-100">10:00 às 18:00</strong> (UTC-3)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchMarketData}
              disabled={isLoadingMarket}
              title="Atualizar cotações em tempo real"
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
                placeholder="Buscar ação, FII, cripto, taxa..."
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

          {/* Track Animado Infinito */}
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

        {/* 3. LAYOUT RESPIRÁVEL EM COLUNAS DINÂMICAS (MAIOR LARGURA PARA O GRÁFICO) */}
        <main className="flex-1 min-h-0 overflow-hidden p-3 sm:p-4">
          <div className="flex flex-col lg:flex-row gap-3.5 h-full w-full max-w-[1780px] mx-auto">
            {/* 4. COLUNA ESQUERDA: ÍNDICES & CARTEIRAS (COBERTURA MULTI-ATIVOS) */}
            <section className="w-full lg:w-72 xl:w-80 shrink-0 flex flex-col gap-3 min-h-0 h-full">
              {/* Card Índices & Carteiras */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-4 border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs flex-1 min-h-0 flex flex-col">
                <div className="flex items-center justify-between mb-2.5 shrink-0">
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                      Índices & Carteiras
                    </h2>
                    <p className="text-[10px] text-zinc-400">
                      Selecione para plotar no gráfico
                    </p>
                  </div>
                  <BarChart3 className="h-4 w-4 text-zinc-400" />
                </div>

                {/* Seletor de Categorias Compacto: [ Todos | Ações | FIIs | Cripto | Câmbio | Taxas ] */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 shrink-0">
                  {CATEGORY_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSelectedCategory(tab.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                        selectedCategory === tab.id
                          ? "bg-purple-600 text-white shadow-2xs"
                          : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Lista de Ativos com Scroll Customizado e Checkboxes Conectados ao Gráfico */}
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 space-y-1 mt-2">
                  {/* Estado de Carregamento Skeleton */}
                  {isLoadingMarket && multiAssets.length === 0 ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-2xl animate-pulse bg-zinc-50/50 dark:bg-zinc-800/20"
                      >
                        <div className="space-y-1.5 flex-1 min-w-0 pr-4">
                          <div className="h-3.5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                          <div className="h-2.5 w-28 bg-zinc-100 dark:bg-zinc-800/60 rounded-md" />
                        </div>
                        <div className="text-right space-y-1.5 shrink-0 flex flex-col items-end">
                          <div className="h-3.5 w-14 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                          <div className="h-4 w-12 bg-zinc-100 dark:bg-zinc-800/60 rounded-full" />
                        </div>
                      </div>
                    ))
                  ) : filteredMultiAssets.length === 0 ? (
                    <div className="py-8 text-center text-xs text-zinc-400">
                      Nenhum ativo encontrado para esta categoria.
                    </div>
                  ) : (
                    filteredMultiAssets.map((asset) => {
                      const isPositive = asset.changePercent >= 0;
                      const isSelected = activeSeries.some((s) => s.id === asset.id);
                      const activeItem = activeSeries.find((s) => s.id === asset.id);

                      return (
                        <button
                          key={asset.id}
                          type="button"
                          onClick={() => toggleSeries(asset)}
                          className={`w-full flex items-center justify-between p-2 rounded-2xl transition-all cursor-pointer border text-left ${
                            isSelected
                              ? "bg-purple-500/10 border-purple-500/30 text-zinc-900 dark:text-zinc-100 shadow-2xs"
                              : "border-transparent hover:bg-zinc-100/70 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            {/* Checkbox interativo conectado ao Tremor Chart */}
                            <div
                              className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                                isSelected
                                  ? "bg-purple-600 border-purple-600 text-white"
                                  : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400"
                              }`}
                              style={
                                isSelected && activeItem?.colorHex
                                  ? {
                                      backgroundColor: activeItem.colorHex,
                                      borderColor: activeItem.colorHex,
                                    }
                                  : {}
                              }
                            >
                              {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                            </div>

                            <div className="truncate">
                              <p className="text-xs font-bold leading-tight truncate">
                                {asset.ticker}
                              </p>
                              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate leading-tight mt-0.5">
                                {asset.name}
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0 flex flex-col items-end">
                            <span className="text-xs font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                              {formatAssetPrice(asset)}
                            </span>
                            <span
                              className={`mt-0.5 inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-semibold tabular-nums ${
                                isPositive
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-rose-500/10 text-rose-400"
                              }`}
                            >
                              {isPositive
                                ? `+${asset.changePercent.toFixed(2)}%`
                                : `${asset.changePercent.toFixed(2)}%`}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  )}
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

            {/* 5. COLUNA CENTRAL: GRÁFICO AVANÇADO (LARGURA MAXIMIZADA E RESPIRÁVEL) */}
            <section className="flex-1 min-w-0 flex flex-col gap-3 min-h-0 h-full transition-all duration-300">
              {/* Card Principal com FinancialChart */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs flex-1 min-h-0 flex flex-col justify-between">
                {/* Topo do Card: Patrimônio Total */}
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-2 mb-1 shrink-0">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                      PATRIMÔNIO TOTAL
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 tabular-nums">
                        {formatBrl(0)}
                      </span>
                      <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 tabular-nums">
                        R$ 0,00 (0,0%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Gráfico Avançado de Performance Normalizada */}
                <FinancialChart
                  activeSeries={activeSeries}
                  onRemoveSeries={handleRemoveSeries}
                  selectedPeriod={selectedPeriod}
                  onPeriodChange={setSelectedPeriod}
                  isExpanded={isChartExpanded}
                  onToggleExpand={() => setIsChartExpanded(!isChartExpanded)}
                  className="flex-1 min-h-0"
                />
              </div>

              {/* Card Inferior: Resumo Rápido em 3 Caixinhas Zeradas (Ocultas ao Expandir) */}
              {!isChartExpanded && (
                <div className="grid grid-cols-3 gap-3 shrink-0 animate-in fade-in duration-200">
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
              )}
            </section>

            {/* 6. COLUNA DIREITA (w-72 / w-80) - Oculta ao Expandir */}
            {!isChartExpanded && (
              <section className="w-full lg:w-72 xl:w-80 shrink-0 flex flex-col gap-3 min-h-0 h-full animate-in fade-in duration-200">
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
                    <p className="text-[9px] text-zinc-400">Tempo real B3 & Mercado Global</p>
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
                        {showValues ? `R$ ${usdItem.price.toFixed(2)}` : "R$ •••"}
                      </p>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-full tabular-nums ${
                        usdItem.changePercent >= 0
                          ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                          : "text-rose-600 dark:text-rose-400 bg-rose-500/10"
                      }`}>
                        {usdItem.changePercent >= 0 ? `+${usdItem.changePercent.toFixed(2)}%` : `${usdItem.changePercent.toFixed(2)}%`}
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
                        {showValues ? `R$ ${eurItem.price.toFixed(2)}` : "R$ •••"}
                      </p>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-full tabular-nums ${
                        eurItem.changePercent >= 0
                          ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                          : "text-rose-600 dark:text-rose-400 bg-rose-500/10"
                      }`}>
                        {eurItem.changePercent >= 0 ? `+${eurItem.changePercent.toFixed(2)}%` : `${eurItem.changePercent.toFixed(2)}%`}
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
                        {showValues ? `R$ ${btcItem.price.toLocaleString("pt-BR")}` : "R$ •••••"}
                      </p>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-full tabular-nums ${
                        btcItem.changePercent >= 0
                          ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                          : "text-rose-600 dark:text-rose-400 bg-rose-500/10"
                      }`}>
                        {btcItem.changePercent >= 0 ? `+${btcItem.changePercent.toFixed(2)}%` : `${btcItem.changePercent.toFixed(2)}%`}
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
          )}
          </div>
        </main>
      </div>

      {/* Modal para Adicionar Ativo */}
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
                  placeholder="Ex: PETR4, HGLG11, Tesouro Selic..."
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
