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
  TrendingUp,
  Sparkles,
  Coins,
  BarChart3,
  Home,
  RefreshCw,
  Newspaper,
  X,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  Columns3,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  FinancialChart,
  type ActiveSeriesItem,
  type ChartPeriod,
} from "@/components/financial-chart";
import {
  ALLOWED_UNIVERSE,
  getTickerMeta,
  type TickerUniverseItem,
} from "@/lib/market/universe";

export interface WatchlistItem {
  id: string;
  watchlistId: string;
  ticker: string;
  position: number;
}

export interface Watchlist {
  id: string;
  userId: string;
  name: string;
  columns: string;
  position: number;
  items: WatchlistItem[];
}

export interface MarketQuote {
  ticker: string;
  name: string | null;
  price: number;
  changePct: number | null;
  volume: number | null;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  fetchedAt: number;
  stale: boolean;
  cacheStatus: "HIT" | "MISS" | "STALE";
}

const AVAILABLE_COLUMNS = [
  { id: "price", label: "Preço" },
  { id: "changePct", label: "Var %" },
  { id: "volume", label: "Volume" },
  { id: "open", label: "Abertura" },
  { id: "high", label: "Máxima" },
  { id: "low", label: "Mínima" },
] as const;

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

function formatVolume(vol: number | null | undefined): string {
  if (vol === null || vol === undefined || vol === 0) return "-";
  if (vol >= 1_000_000_000) return `${(vol / 1_000_000_000).toFixed(1)}B`;
  if (vol >= 1_000_000) return `${(vol / 1_000_000).toFixed(1)}M`;
  if (vol >= 1_000) return `${(vol / 1_000).toFixed(1)}K`;
  return vol.toString();
}

export default function FinanceiroPage() {
  const { user } = useUser();
  const [showValues, setShowValues] = React.useState<boolean>(true);
  const [selectedPeriod, setSelectedPeriod] = React.useState<ChartPeriod>("1M");
  const [isChartExpanded, setIsChartExpanded] = React.useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState<boolean>(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Watchlists do Usuário
  const [watchlists, setWatchlists] = React.useState<Watchlist[]>([]);
  const [activeWatchlistId, setActiveWatchlistId] = React.useState<string | null>(null);
  const [isLoadingWatchlists, setIsLoadingWatchlists] = React.useState<boolean>(true);

  // Cotações em cache da rota /api/market/quotes
  const [quotesMap, setQuotesMap] = React.useState<Record<string, MarketQuote>>({});
  const [isLoadingQuotes, setIsLoadingQuotes] = React.useState<boolean>(false);
  const [quotesStale, setQuotesStale] = React.useState<boolean>(false);
  const [lastFetchedAt, setLastFetchedAt] = React.useState<number | null>(null);

  // Modais de Watchlist
  const [isCreateListOpen, setIsCreateListOpen] = React.useState<boolean>(false);
  const [newListName, setNewListName] = React.useState<string>("");
  const [createListError, setCreateListError] = React.useState<string | null>(null);

  // Modal de Adicionar Ativo à Watchlist
  const [isAddTickerOpen, setIsAddTickerOpen] = React.useState<boolean>(false);
  const [tickerSearchQuery, setTickerSearchQuery] = React.useState<string>("");
  const [addTickerError, setAddTickerError] = React.useState<string | null>(null);

  // Modal de Aviso de Limite do Plano
  const [planLimitNotice, setPlanLimitNotice] = React.useState<string | null>(null);

  // Séries ativas no gráfico comparativo
  const [activeSeries, setActiveSeries] = React.useState<ActiveSeriesItem[]>([
    {
      id: "petr4",
      ticker: "PETR4",
      name: "Petrobras PN",
      color: "purple",
      colorHex: "#820AD1",
      currentValue: 38.45,
      changePercent: 1.18,
    },
  ]);

  // TODO: Integrar com API pública do Banco Central (SGS) em fase futura sem consumir cota da brapi
  const macroRates = {
    cdi: 10.65,
    selic: 10.75,
    ipca: 4.42,
  };

  // Watchlist ativa atual
  const activeWatchlist = React.useMemo(() => {
    return watchlists.find((w) => w.id === activeWatchlistId) || watchlists[0] || null;
  }, [watchlists, activeWatchlistId]);

  // Colunas selecionadas para a watchlist ativa
  const parsedColumns = React.useMemo<string[]>(() => {
    if (!activeWatchlist?.columns) return ["price", "changePct"];
    try {
      const parsed = JSON.parse(activeWatchlist.columns);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // fallback
    }
    return ["price", "changePct"];
  }, [activeWatchlist?.columns]);

  // Carrega watchlists do usuário na montagem
  const loadWatchlists = React.useCallback(async () => {
    setIsLoadingWatchlists(true);
    try {
      const res = await fetch("/api/watchlists");
      if (res.ok) {
        const json = (await res.json()) as { data?: Watchlist[] };
        if (json && Array.isArray(json.data) && json.data.length > 0) {
          setWatchlists(json.data);
          setActiveWatchlistId((prev) => {
            if (prev && json.data?.some((w) => w.id === prev)) return prev;
            return json.data ? json.data[0].id : null;
          });
        }
      }
    } catch (err) {
      console.error("Erro ao buscar watchlists do usuário:", err);
    } finally {
      setIsLoadingWatchlists(false);
    }
  }, []);

  React.useEffect(() => {
    loadWatchlists();
  }, [loadWatchlists]);

  // Busca cotações dos tickers da watchlist ativa
  const fetchQuotes = React.useCallback(async (tickers: string[]) => {
    if (tickers.length === 0) return;
    setIsLoadingQuotes(true);
    try {
      const sliceTickers = tickers.slice(0, 10).join(",");
      const res = await fetch(`/api/market/quotes?tickers=${encodeURIComponent(sliceTickers)}`);
      if (res.ok) {
        const json = (await res.json()) as { data?: MarketQuote[] };
        if (json && Array.isArray(json.data)) {
          const newMap: Record<string, MarketQuote> = {};
          let anyStale = false;
          let latestFetched = 0;

          for (const q of json.data) {
            newMap[q.ticker.toUpperCase()] = q;
            if (q.stale) anyStale = true;
            if (q.fetchedAt > latestFetched) latestFetched = q.fetchedAt;
          }

          setQuotesMap((prev) => ({ ...prev, ...newMap }));
          setQuotesStale(anyStale);
          if (latestFetched > 0) setLastFetchedAt(latestFetched);
        }
      }
    } catch (err) {
      console.error("Erro ao buscar cotações dos ativos da watchlist:", err);
    } finally {
      setIsLoadingQuotes(false);
    }
  }, []);

  // Dispara busca de cotações sempre que os tickers da watchlist mudam
  React.useEffect(() => {
    if (activeWatchlist && activeWatchlist.items.length > 0) {
      const tickers = activeWatchlist.items.map((i) => i.ticker);
      fetchQuotes(tickers);
    }
  }, [activeWatchlist?.id, activeWatchlist?.items, fetchQuotes]);

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

  const formatBRL = (value: number) => {
    if (!showValues) return "R$ ••••••";
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const formatAssetPrice = (val: number | null | undefined) => {
    if (!showValues) return "R$ •••";
    if (val === null || val === undefined) return "—";
    return `R$ ${val.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Seleciona ticker da watchlist como ativo principal do gráfico central
  const handleSelectPrimaryTicker = (ticker: string) => {
    const upper = ticker.toUpperCase();
    const quote = quotesMap[upper];
    const meta = getTickerMeta(upper);

    setActiveSeries([
      {
        id: upper.toLowerCase(),
        ticker: upper,
        name: quote?.name || meta?.name || upper,
        color: "purple",
        colorHex: "#820AD1",
        currentValue: quote?.price,
        changePercent: quote?.changePct ?? 0,
      },
      ...activeSeries.filter((s) => s.ticker.toUpperCase() !== upper),
    ]);
  };

  // Alterna visibilidade de coluna e persiste via PATCH /api/watchlists/:id
  const handleToggleColumn = async (colKey: string) => {
    if (!activeWatchlist) return;
    let nextCols: string[];
    if (parsedColumns.includes(colKey)) {
      if (parsedColumns.length <= 1) return; // Não remove a última coluna
      nextCols = parsedColumns.filter((c) => c !== colKey);
    } else {
      nextCols = [...parsedColumns, colKey];
    }

    const columnsJson = JSON.stringify(nextCols);
    setWatchlists((prev) =>
      prev.map((wl) =>
        wl.id === activeWatchlist.id ? { ...wl, columns: columnsJson } : wl
      )
    );

    try {
      await fetch(`/api/watchlists/${activeWatchlist.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ columns: columnsJson }),
      });
    } catch (err) {
      console.error("Erro ao salvar preferências de colunas da watchlist:", err);
    }
  };

  // Criação de nova watchlist
  const handleCreateWatchlist = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newListName.trim()) return;
    setCreateListError(null);

    try {
      const res = await fetch("/api/watchlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newListName.trim() }),
      });

      if (res.status === 403) {
        const errJson = (await res.json()) as { message?: string };
        setCreateListError(
          errJson.message ||
            "O plano Free permite no máximo 3 watchlists. Faça upgrade para o Pro para ter listas ilimitadas."
        );
        return;
      }

      if (res.ok) {
        const json = (await res.json()) as { data?: Watchlist };
        if (json.data) {
          setWatchlists((prev) => [...prev, { ...json.data!, items: [] }]);
          setActiveWatchlistId(json.data.id);
          setNewListName("");
          setIsCreateListOpen(false);
        }
      }
    } catch (err) {
      console.error("Erro ao criar watchlist:", err);
      setCreateListError("Erro ao processar criação da watchlist.");
    }
  };

  // Adição de ativo na watchlist ativa
  const handleAddTicker = async (ticker: string) => {
    if (!activeWatchlist) return;

    if (activeWatchlist.items.length >= 10) {
      setPlanLimitNotice(
        "O plano Free permite no máximo 10 ativos por watchlist. Faça upgrade para o Pro para adicionar ativos ilimitados."
      );
      setIsAddTickerOpen(false);
      return;
    }

    setAddTickerError(null);
    try {
      const res = await fetch(`/api/watchlists/${activeWatchlist.id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker }),
      });

      if (res.status === 403) {
        const errJson = (await res.json()) as { message?: string };
        setPlanLimitNotice(
          errJson.message ||
            "O plano Free permite no máximo 10 ativos por watchlist. Faça upgrade para o Pro."
        );
        setIsAddTickerOpen(false);
        return;
      }

      if (res.status === 409) {
        setAddTickerError("Este ativo já está na watchlist.");
        return;
      }

      if (res.ok) {
        const json = (await res.json()) as { data?: WatchlistItem };
        if (json.data) {
          setWatchlists((prev) =>
            prev.map((wl) =>
              wl.id === activeWatchlist.id
                ? { ...wl, items: [...wl.items, json.data!] }
                : wl
            )
          );
          setIsAddTickerOpen(false);
          setTickerSearchQuery("");
          fetchQuotes([ticker]);
        }
      }
    } catch (err) {
      console.error("Erro ao adicionar ativo:", err);
      setAddTickerError("Falha ao adicionar ativo.");
    }
  };

  // Remoção de ativo da watchlist ativa
  const handleRemoveTicker = async (
    e: React.MouseEvent,
    itemId: string,
    ticker: string
  ) => {
    e.stopPropagation();
    if (!activeWatchlist) return;

    setWatchlists((prev) =>
      prev.map((wl) =>
        wl.id === activeWatchlist.id
          ? { ...wl, items: wl.items.filter((i) => i.id !== itemId) }
          : wl
      )
    );

    try {
      await fetch(`/api/watchlists/${activeWatchlist.id}/items/${itemId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error(`Erro ao remover ticker ${ticker} da watchlist:`, err);
    }
  };

  // Filtragem de ativos disponíveis no ALLOWED_UNIVERSE para adicionar à watchlist
  const availableUniverseTickers = React.useMemo(() => {
    const existing = new Set(
      (activeWatchlist?.items || []).map((i) => i.ticker.toUpperCase())
    );
    const q = tickerSearchQuery.trim().toLowerCase();

    return ALLOWED_UNIVERSE.filter((u) => {
      if (existing.has(u.ticker.toUpperCase())) return false;
      if (!q) return true;
      return (
        u.ticker.toLowerCase().includes(q) || u.name.toLowerCase().includes(q)
      );
    });
  }, [activeWatchlist?.items, tickerSearchQuery]);

  // Carrossel Bloomberg Ticker Tape
  const tickerItems = React.useMemo(() => {
    const bova11 = quotesMap["BOVA11"];
    const petr4 = quotesMap["PETR4"];
    const vale3 = quotesMap["VALE3"];

    const baseList = [
      { label: "IBOV", value: "131.200", change: 0.4 },
      { label: "S&P 500", value: "5.800", change: 1.2 },
      { label: "USD", value: "R$ 5,68", change: -0.2 },
      { label: "EUR", value: "R$ 6,15", change: 0.1 },
      {
        label: "BOVA11",
        value: bova11 ? `R$ ${bova11.price.toFixed(2)}` : "R$ 126,80",
        change: bova11 ? Number((bova11.changePct ?? 0).toFixed(1)) : 0.45,
      },
      { label: "SELIC", value: `${macroRates.selic}%`, change: undefined },
      { label: "CDI", value: `${macroRates.cdi}%`, change: undefined },
      { label: "IPCA", value: `${macroRates.ipca}%`, change: undefined },
      { label: "BTC", value: "R$ 382.450", change: 3.12 },
      {
        label: "PETR4",
        value: petr4 ? `R$ ${petr4.price.toFixed(2)}` : "R$ 38,40",
        change: petr4 ? Number((petr4.changePct ?? 0).toFixed(1)) : 1.18,
      },
      {
        label: "VALE3",
        value: vale3 ? `R$ ${vale3.price.toFixed(2)}` : "R$ 61,20",
        change: vale3 ? Number((vale3.changePct ?? 0).toFixed(1)) : -0.65,
      },
    ];

    return [...baseList, ...baseList];
  }, [quotesMap, macroRates]);

  const lastUpdatedLabel = lastFetchedAt
    ? new Date(lastFetchedAt * 1000).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Agora";

  const patrimonio = 0;
  const rendaFixa = 0;
  const rendaVariavel = 0;
  const reserva = 0;
  const rendaFixaPct = 0;
  const rendaVariavelPct = 0;
  const reservaPct = 0;
  const variacao = "+R$ 0,00";
  const variacaoPct = "+0,0%";
  const isAllZero = rendaFixa === 0 && rendaVariavel === 0 && reserva === 0;

  return (
    <div className="h-screen w-full overflow-hidden flex bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-purple-600 selection:text-white">
      {/* 1. SIDEBAR ESQUERDA ESTILO APP NATIVO (W-20) */}
      <aside className="w-20 border-r border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 flex flex-col items-center py-5 justify-between shrink-0 z-30 select-none shadow-xs">
        {/* Topo: Perfil do Usuário Clerk */}
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

        {/* Rodapé da Sidebar */}
        <div className="flex flex-col items-center pb-12" />
      </aside>

      {/* ÁREA PRINCIPAL DO APLICATIVO */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
        {/* 2. HEADER INTERNO */}
        <header className="h-14 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md px-5 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Olá, {user?.firstName || "Investidor"}!
              </h1>
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 font-semibold tracking-wider"
              >
                PRO
              </Badge>
            </div>
            <button
              onClick={() => setShowValues(!showValues)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-all cursor-pointer"
              title={showValues ? "Ocultar saldos" : "Mostrar saldos"}
            >
              {showValues ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4 text-purple-500" />
              )}
            </button>

            {/* Status e Horário do Pregão B3 com indicador honesto de dados */}
            <div className="hidden lg:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100/90 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 text-xs shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    quotesStale ? "bg-amber-500" : "bg-emerald-500"
                  }`}
                />
              </span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">B3</span>
              <span className="text-zinc-300 dark:text-zinc-600">•</span>
              <span className="text-[11px] text-zinc-600 dark:text-zinc-300 font-medium">
                Pregão:{" "}
                <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                  10:00 às 18:00
                </strong>{" "}
                (UTC-3)
              </span>
              {quotesStale && (
                <>
                  <span className="text-zinc-300 dark:text-zinc-600">•</span>
                  <span className="text-[10px] font-semibold text-amber-500 dark:text-amber-400">
                    Dados em cache (mercado fechado)
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[11px] text-zinc-400 hidden md:inline">
              Atualizado às {lastUpdatedLabel}
            </span>

            <button
              onClick={() => {
                if (activeWatchlist && activeWatchlist.items.length > 0) {
                  fetchQuotes(activeWatchlist.items.map((i) => i.ticker));
                }
              }}
              disabled={isLoadingQuotes}
              title="Recarregar cotações"
              className="p-1.5 rounded-full text-zinc-400 hover:text-purple-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isLoadingQuotes ? "animate-spin text-purple-600" : ""
                }`}
              />
            </button>
          </div>
        </header>

        {/* 2.5 CARROSSEL DE ÍNDICES COM EFEITO BLOOMBERG */}
        <div className="relative w-full overflow-hidden border-b border-zinc-200/80 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xs shrink-0 select-none py-2.5">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-zinc-50 dark:from-zinc-950 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-zinc-50 dark:from-zinc-950 to-transparent z-10" />

          <div className="animate-bloomberg-ticker items-center gap-7 px-4">
            {tickerItems.map((item, idx) => (
              <div
                key={`${item.label}-${idx}`}
                className="flex items-center gap-2 whitespace-nowrap shrink-0 group cursor-default"
              >
                <span className="text-zinc-500 text-xs uppercase tracking-wider">
                  {item.label}
                </span>
                <span className="text-zinc-300 font-medium tabular-nums text-xs">
                  {item.value}
                </span>
                {item.change !== undefined && (
                  <span
                    className={`text-xs tabular-nums font-medium ${
                      item.change >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {item.change >= 0 ? `+${item.change}%` : `${item.change}%`}
                  </span>
                )}
                <span className="text-zinc-600 dark:text-zinc-700 font-normal ml-3 select-none">
                  •
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. GRID DE 12 COLUNAS [ 3 (~25%) | 6 (~50%) | 3 (~25%) ] */}
        <div className="flex-1 min-h-0 overflow-hidden p-4">
          <div className="grid grid-cols-12 gap-4 h-full">
            {/* 4. COLUNA ESQUERDA: WATCHLISTS DINÂMICAS (col-span-3: ~25%) */}
            <aside className="col-span-3 flex flex-col gap-3 min-h-0 h-full">
              {/* Card Watchlists do Usuário */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-4 border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs flex-1 min-h-0 flex flex-col">
                {/* Cabeçalho do Card com Título e Ações */}
                <div className="flex items-center justify-between mb-2.5 shrink-0">
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                      Índices & Carteiras
                    </h2>
                    <p className="text-[10px] text-zinc-400">
                      Clique no ativo para plotar no gráfico
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Botão Adicionar Ticker */}
                    <button
                      type="button"
                      onClick={() => {
                        if ((activeWatchlist?.items.length || 0) >= 10) {
                          setPlanLimitNotice(
                            "O plano Free permite no máximo 10 ativos por watchlist. Faça upgrade para o Pro para adicionar ativos ilimitados."
                          );
                        } else {
                          setIsAddTickerOpen(true);
                        }
                      }}
                      className="p-1 rounded-md text-zinc-400 hover:text-purple-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      title="Adicionar ativo à lista"
                    >
                      <Plus className="h-4 w-4" />
                    </button>

                    {/* Seletor de Colunas Visíveis */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                          title="Personalizar colunas visíveis"
                        >
                          <Columns3 className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-44 bg-zinc-900 border-zinc-800 text-zinc-200 text-xs"
                      >
                        <DropdownMenuLabel className="text-[10px] text-zinc-500 uppercase tracking-wider">
                          Colunas Visíveis
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        {AVAILABLE_COLUMNS.map((col) => {
                          const isChecked = parsedColumns.includes(col.id);
                          return (
                            <DropdownMenuCheckboxItem
                              key={col.id}
                              checked={isChecked}
                              onCheckedChange={() => handleToggleColumn(col.id)}
                              className="text-xs cursor-pointer focus:bg-zinc-800 focus:text-white"
                            >
                              {col.label}
                            </DropdownMenuCheckboxItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Abas com as Watchlists do Usuário + Botão '+' */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 shrink-0 border-b border-zinc-200/60 dark:border-zinc-800/80 pb-2">
                  {watchlists.map((wl) => {
                    const isActive = activeWatchlist?.id === wl.id;
                    return (
                      <button
                        key={wl.id}
                        type="button"
                        onClick={() => setActiveWatchlistId(wl.id)}
                        className={`px-3 py-1 rounded-md text-xs transition-all whitespace-nowrap cursor-pointer ${
                          isActive
                            ? "bg-purple-600 text-white font-semibold shadow-2xs"
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                        }`}
                      >
                        {wl.name}
                      </button>
                    );
                  })}

                  {/* Botão '+' para criar nova watchlist */}
                  <button
                    type="button"
                    onClick={() => {
                      if (watchlists.length >= 3) {
                        setPlanLimitNotice(
                          "O plano Free permite no máximo 3 watchlists. Faça upgrade para o plano Pro para criar listas ilimitadas."
                        );
                      } else {
                        setIsCreateListOpen(true);
                      }
                    }}
                    className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center cursor-pointer shrink-0"
                    title="Criar nova Watchlist"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Lista de Ativos da Watchlist Ativa */}
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 space-y-1 mt-2">
                  {isLoadingWatchlists ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-2xl animate-pulse bg-zinc-50/50 dark:bg-zinc-800/20"
                      >
                        <div className="space-y-1.5 flex-1 min-w-0 pr-4">
                          <div className="h-3.5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                          <div className="h-2.5 w-24 bg-zinc-100 dark:bg-zinc-800/60 rounded-md" />
                        </div>
                        <div className="h-4 w-12 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                      </div>
                    ))
                  ) : !activeWatchlist || activeWatchlist.items.length === 0 ? (
                    <div className="py-8 text-center text-xs text-zinc-400 space-y-2">
                      <p>Nenhum ativo nesta watchlist.</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsAddTickerOpen(true)}
                        className="text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Adicionar Ativo
                      </Button>
                    </div>
                  ) : (
                    activeWatchlist.items.map((item) => {
                      const quote = quotesMap[item.ticker.toUpperCase()];
                      const meta = getTickerMeta(item.ticker);
                      const isPrimaryPlotted =
                        activeSeries.length > 0 &&
                        activeSeries[0].ticker.toUpperCase() ===
                          item.ticker.toUpperCase();
                      const isPositive = (quote?.changePct ?? 0) >= 0;

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectPrimaryTicker(item.ticker)}
                          className={`group w-full flex items-center justify-between p-2 rounded-2xl transition-all cursor-pointer border text-left ${
                            isPrimaryPlotted
                              ? "bg-purple-500/10 border-purple-500/30 text-zinc-900 dark:text-zinc-100 shadow-2xs"
                              : "border-transparent hover:bg-zinc-100/70 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300"
                          }`}
                        >
                          {/* Identificação do Ativo */}
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                isPrimaryPlotted ? "bg-purple-500" : "bg-transparent"
                              }`}
                            />
                            <div className="truncate">
                              <p className="text-xs font-bold leading-tight truncate">
                                {item.ticker}
                              </p>
                              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate leading-tight mt-0.5">
                                {quote?.name || meta?.name || item.ticker}
                              </p>
                            </div>
                          </div>

                          {/* Colunas Dinâmicas Configuradas */}
                          <div className="flex items-center gap-2 shrink-0">
                            {parsedColumns.includes("open") && quote && (
                              <div className="text-right hidden sm:block">
                                <span className="text-[9px] text-zinc-500 block">
                                  Ab
                                </span>
                                <span className="text-xs font-mono tabular-nums text-zinc-300">
                                  {formatAssetPrice(quote.open)}
                                </span>
                              </div>
                            )}

                            {parsedColumns.includes("high") && quote && (
                              <div className="text-right hidden sm:block">
                                <span className="text-[9px] text-zinc-500 block">
                                  Máx
                                </span>
                                <span className="text-xs font-mono tabular-nums text-zinc-300">
                                  {formatAssetPrice(quote.high)}
                                </span>
                              </div>
                            )}

                            {parsedColumns.includes("low") && quote && (
                              <div className="text-right hidden sm:block">
                                <span className="text-[9px] text-zinc-500 block">
                                  Mín
                                </span>
                                <span className="text-xs font-mono tabular-nums text-zinc-300">
                                  {formatAssetPrice(quote.low)}
                                </span>
                              </div>
                            )}

                            {parsedColumns.includes("volume") && (
                              <div className="text-right hidden sm:block">
                                <span className="text-[9px] text-zinc-500 block">
                                  Vol
                                </span>
                                <span className="text-xs font-mono tabular-nums text-zinc-300">
                                  {formatVolume(quote?.volume)}
                                </span>
                              </div>
                            )}

                            {parsedColumns.includes("price") && (
                              <div className="text-right">
                                <span className="text-xs font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                                  {quote ? formatAssetPrice(quote.price) : "..."}
                                </span>
                              </div>
                            )}

                            {parsedColumns.includes("changePct") && (
                              <div className="text-right">
                                <span
                                  className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold tabular-nums ${
                                    isPositive
                                      ? "bg-emerald-500/10 text-emerald-400"
                                      : "bg-rose-500/10 text-rose-400"
                                  }`}
                                >
                                  {quote && quote.changePct !== null
                                    ? `${isPositive ? "+" : ""}${quote.changePct.toFixed(2)}%`
                                    : "..."}
                                </span>
                              </div>
                            )}

                            {/* Botão Hover de Remover Ticker da Lista */}
                            <button
                              type="button"
                              onClick={(e) =>
                                handleRemoveTicker(e, item.id, item.ticker)
                              }
                              className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition-all cursor-pointer ml-1"
                              title={`Remover ${item.ticker} da watchlist`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Status Macroeconomia B3 */}
              <div className="bg-purple-600/5 dark:bg-purple-900/10 rounded-2xl p-3 border border-purple-500/20 text-xs text-purple-900 dark:text-purple-200 shrink-0 flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <div className="min-w-0 truncate">
                  <p className="font-semibold text-[11px] leading-tight">
                    Macroeconomia B3
                  </p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                    CDI: <strong>{macroRates.cdi}%</strong> • Selic:{" "}
                    <strong>{macroRates.selic}%</strong> • IPCA:{" "}
                    <strong>{macroRates.ipca}%</strong>
                  </p>
                </div>
              </div>
            </aside>

            {/* 5. COLUNA CENTRAL: GRÁFICO + KPIS (col-span-6: ~50% DA TELA) */}
            <main className="col-span-6 flex flex-col min-h-0 h-full">
              {/* Faixa de KPIs — Nível 1 */}
              <div className="flex items-end justify-between mb-4 shrink-0">
                <div>
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                    Patrimônio Total
                  </p>
                  <p className="text-4xl font-bold tabular-nums text-white">
                    {formatBRL(patrimonio)}
                  </p>
                  <p className="text-sm tabular-nums mt-1 text-zinc-400">
                    {variacao} ({variacaoPct})
                  </p>
                </div>
                {/* Botões de Ação */}
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
                    Novo Aporte
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/hub-matematico">Simular</Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      alert("Relatório consolidado exportado com sucesso!")
                    }
                  >
                    Exportar
                  </Button>
                </div>
              </div>

              {/* Nível 2 — Gráfico Central */}
              <div
                className="w-full flex-1 flex flex-col rounded-2xl bg-zinc-900/80 border border-zinc-800/80 shadow-xs overflow-hidden"
                style={{ minHeight: "380px" }}
              >
                <FinancialChart
                  activeSeries={activeSeries}
                  onRemoveSeries={(id) =>
                    setActiveSeries(activeSeries.filter((s) => s.id !== id))
                  }
                  selectedPeriod={selectedPeriod}
                  onPeriodChange={setSelectedPeriod}
                  isExpanded={isChartExpanded}
                  onToggleExpand={() => setIsChartExpanded(!isChartExpanded)}
                  className="flex-1 min-h-0"
                />
              </div>

              {/* Nível 3 — Cards de Alocação / Empty State */}
              <div className="mt-4 shrink-0">
                {isAllZero ? (
                  <div className="rounded-lg border border-dashed border-zinc-700 p-4 text-center bg-zinc-900/40">
                    <p className="text-sm text-zinc-500 mb-2">
                      Nenhum ativo cadastrado ainda.
                    </p>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/dashboard/ativos/novo">
                        Adicionar primeiro ativo →
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-zinc-900/60 border border-zinc-800/60 p-3">
                      <p className="text-[11px] text-zinc-500 mb-1">Renda Fixa</p>
                      <p className="text-lg font-semibold tabular-nums text-zinc-200">
                        {formatBRL(rendaFixa)}
                      </p>
                      <p className="text-xs text-zinc-500">{rendaFixaPct}%</p>
                    </div>
                    <div className="rounded-lg bg-zinc-900/60 border border-zinc-800/60 p-3">
                      <p className="text-[11px] text-zinc-500 mb-1">
                        Renda Variável
                      </p>
                      <p className="text-lg font-semibold tabular-nums text-zinc-200">
                        {formatBRL(rendaVariavel)}
                      </p>
                      <p className="text-xs text-zinc-500">{rendaVariavelPct}%</p>
                    </div>
                    <div className="rounded-lg bg-zinc-900/60 border border-zinc-800/60 p-3">
                      <p className="text-[11px] text-zinc-500 mb-1">Reserva</p>
                      <p className="text-lg font-semibold tabular-nums text-zinc-200">
                        {formatBRL(reserva)}
                      </p>
                      <p className="text-xs text-zinc-500">{reservaPct}%</p>
                    </div>
                  </div>
                )}
              </div>
            </main>

            {/* 6. COLUNA DIREITA: CÂMBIO & NOTÍCIAS (col-span-3: ~25% DA TELA) */}
            <aside className="col-span-3 flex flex-col gap-3 min-h-0 h-full">
              {/* Card Câmbio & Cripto */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-3.5 border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs shrink-0 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                      Câmbio & Cripto
                    </h2>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <p className="text-[9px] text-zinc-400">
                        Cotações com atraso de ~30 min
                      </p>
                    </div>
                  </div>
                  <Coins className="h-4 w-4 text-zinc-400" />
                </div>

                <div className="space-y-1.5">
                  {/* Dólar */}
                  <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <div>
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                        Dólar PTAX
                      </p>
                      <p className="text-[9px] text-zinc-400">USD / BRL</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold tabular-nums text-zinc-900 dark:text-zinc-100 leading-tight">
                        {showValues ? "R$ 5,68" : "R$ •••"}
                      </p>
                      <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full tabular-nums text-rose-400 bg-rose-500/10">
                        -0.20%
                      </span>
                    </div>
                  </div>

                  {/* Euro */}
                  <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <div>
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                        Euro PTAX
                      </p>
                      <p className="text-[9px] text-zinc-400">EUR / BRL</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold tabular-nums text-zinc-900 dark:text-zinc-100 leading-tight">
                        {showValues ? "R$ 6,15" : "R$ •••"}
                      </p>
                      <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full tabular-nums text-emerald-400 bg-emerald-500/10">
                        +0.10%
                      </span>
                    </div>
                  </div>

                  {/* Bitcoin */}
                  <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <div>
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                        Bitcoin
                      </p>
                      <p className="text-[9px] text-zinc-400">BTC / BRL</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold tabular-nums text-zinc-900 dark:text-zinc-100 leading-tight">
                        {showValues ? "R$ 382.450" : "R$ •••••"}
                      </p>
                      <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full tabular-nums text-emerald-400 bg-emerald-500/10">
                        +3.12%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Radar & Notícias */}
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
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Modal para Criar Nova Watchlist */}
      <Dialog open={isCreateListOpen} onOpenChange={setIsCreateListOpen}>
        <DialogContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Criar Nova Watchlist
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Organize seus ativos em listas personalizadas. O plano Free permite até 3 listas.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateWatchlist} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-1">
                Nome da Lista
              </label>
              <input
                type="text"
                autoFocus
                placeholder="Ex: Dividendos, FIIs Favoritos, Blue Chips..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-hidden focus:border-purple-500"
              />
            </div>

            {createListError && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{createListError}</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCreateListOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!newListName.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Criar Watchlist
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal para Adicionar Ativo à Watchlist */}
      <Dialog open={isAddTickerOpen} onOpenChange={setIsAddTickerOpen}>
        <DialogContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Adicionar Ativo à Watchlist
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Pesquise entre os ativos mais líquidos da B3 (Ações, FIIs e ETFs).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                autoFocus
                placeholder="Buscar código ou empresa (ex: PETR4, HGLG11, BOVA11)..."
                value={tickerSearchQuery}
                onChange={(e) => setTickerSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-hidden focus:border-purple-500"
              />
            </div>

            {addTickerError && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{addTickerError}</span>
              </div>
            )}

            {/* Lista com os ativos do ALLOWED_UNIVERSE */}
            <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1 pr-1">
              {availableUniverseTickers.length === 0 ? (
                <div className="py-6 text-center text-xs text-zinc-400">
                  Nenhum ativo encontrado no universo monitorado.
                </div>
              ) : (
                availableUniverseTickers.map((item) => (
                  <button
                    key={item.ticker}
                    type="button"
                    onClick={() => handleAddTicker(item.ticker)}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors text-left cursor-pointer border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          {item.ticker}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">
                          {item.type === "STOCK"
                            ? "Ação"
                            : item.type === "FII"
                            ? "FII"
                            : "ETF"}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                        {item.name}
                      </p>
                    </div>
                    <Plus className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  </button>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Informativo de Limite do Plano Free */}
      <Dialog
        open={Boolean(planLimitNotice)}
        onOpenChange={(open) => !open && setPlanLimitNotice(null)}
      >
        <DialogContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 sm:max-w-md">
          <DialogHeader>
            <div className="w-10 h-10 rounded-2xl bg-purple-600/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300 flex items-center justify-center font-bold mb-2">
              <Lock className="h-5 w-5" />
            </div>
            <DialogTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Limite do Plano Gratuito
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400 leading-relaxed pt-1">
              {planLimitNotice}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPlanLimitNotice(null)}
            >
              Entendi
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                alert("Redirecionando para checkout do Plano Pro...");
                setPlanLimitNotice(null);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Fazer Upgrade PRO
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Genérico para Adicionar Aporte */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300 flex items-center justify-center font-bold">
                  <PlusCircle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Adicionar Aporte
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Cadastre um novo ativo na sua carteira
                  </p>
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
                  alert("Aporte registrado com sucesso!");
                  setIsAddModalOpen(false);
                }}
                className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
              >
                Salvar Aporte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
