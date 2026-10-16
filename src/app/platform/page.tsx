"use client";

import * as React from "react";
import {
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Plus,
  RefreshCw,
  Database,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface AssetRecord {
  id: string;
  ticker: string;
  amount: number;
  assetType: "STOCK" | "CRYPTO" | "FIAT" | "BOND" | "COMMODITY" | "REAL_ESTATE";
  unitPrice: number;
  totalValue: number;
  taxEstimated: number;
  status: "Auditado" | "Pendente" | "Borda Ok";
  change24h: number;
}

const initialAssets: AssetRecord[] = [
  {
    id: "1",
    ticker: "PETR4",
    amount: 2500,
    assetType: "STOCK",
    unitPrice: 38.65,
    totalValue: 96625.0,
    taxEstimated: 14493.75,
    status: "Auditado",
    change24h: 2.45,
  },
  {
    id: "2",
    ticker: "VALE3",
    amount: 1400,
    assetType: "STOCK",
    unitPrice: 59.8,
    totalValue: 83720.0,
    taxEstimated: 12558.0,
    status: "Auditado",
    change24h: -0.85,
  },
  {
    id: "3",
    ticker: "BTC",
    amount: 1.25,
    assetType: "CRYPTO",
    unitPrice: 392500.0,
    totalValue: 490625.0,
    taxEstimated: 73593.75,
    status: "Borda Ok",
    change24h: 4.12,
  },
  {
    id: "4",
    ticker: "ETH",
    amount: 8.5,
    assetType: "CRYPTO",
    unitPrice: 18200.0,
    totalValue: 154700.0,
    taxEstimated: 23205.0,
    status: "Auditado",
    change24h: 1.34,
  },
  {
    id: "5",
    ticker: "NTNB-2035",
    amount: 45,
    assetType: "BOND",
    unitPrice: 4210.5,
    totalValue: 189472.5,
    taxEstimated: 28420.88,
    status: "Auditado",
    change24h: 0.15,
  },
];

export default function PlatformPage() {
  const [assets, setAssets] = React.useState<AssetRecord[]>(initialAssets);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [ticker, setTicker] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [assetType, setAssetType] = React.useState<string>("STOCK");
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  // Totais com tabular-nums
  const totalPortfolio = React.useMemo(() => {
    return assets.reduce((acc, curr) => acc + curr.totalValue, 0);
  }, [assets]);

  const totalTax = React.useMemo(() => {
    return assets.reduce((acc, curr) => acc + curr.taxEstimated, 0);
  }, [assets]);

  async function handleAddAsset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const parsedAmount = parseFloat(amount);

      // Chamada para a rota de borda validada com Zod
      const response = await fetch("/api/assets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer mock-token",
        },
        body: JSON.stringify({
          ticker: ticker,
          amount: isNaN(parsedAmount) ? -1 : parsedAmount,
          assetType: assetType,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.issues
            ? Object.values(result.issues).flat().join(" ")
            : result.message || "Erro de validação na borda."
        );
      }

      // Adiciona o ativo sanitizado na lista local
      const mockUnitPrice =
        result.data.assetType === "CRYPTO"
          ? 250000.0
          : result.data.assetType === "STOCK"
          ? 45.2
          : 1000.0;
      const total = result.data.amount * mockUnitPrice;

      const newRecord: AssetRecord = {
        id: String(Date.now()),
        ticker: result.data.ticker,
        amount: result.data.amount,
        assetType: result.data.assetType,
        unitPrice: mockUnitPrice,
        totalValue: total,
        taxEstimated: total * 0.15,
        status: "Borda Ok",
        change24h: 0.0,
      };

      setAssets((prev) => [newRecord, ...prev]);
      setSuccessMsg("Ativo validado pelo Zod e registrado com sucesso!");
      setTimeout(() => {
        setDialogOpen(false);
        setTicker("");
        setAmount("");
        setSuccessMsg(null);
      }, 1200);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Falha ao comunicar com a borda.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Title & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Painel de Controle Financeiro
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Monitoramento de ativos e cálculos tributários em alta precisão com{" "}
            <span className="font-mono text-zinc-700 dark:text-zinc-300">Geist Mono tabular-nums</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAssets(initialAssets)}
            className="gap-2 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Resetar Demo</span>
          </Button>

          {/* Dialog: Adicionar Ativo com Validação de Borda Zod */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2 shadow-xs">
                <Plus className="h-4 w-4" />
                <span>Novo Ativo</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[440px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  <span>Cadastrar Ativo Financeiro</span>
                </DialogTitle>
                <DialogDescription>
                  Os dados trafegam pela internet e são validados na borda pelo schema Zod com rejeição imediata (fail-fast).
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleAddAsset} className="space-y-4 py-2">
                {errorMsg && (
                  <div className="flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Ticker do Ativo
                  </label>
                  <Input
                    placeholder="Ex: PETR4, AAPL, BTC"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    required
                    className="font-mono"
                  />
                  <p className="text-[11px] text-zinc-500">
                    Será sanitizado para letras maiúsculas e caracteres limpos.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Quantidade (Amount)
                  </label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="Ex: 100 ou 0.5"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="font-mono tabular-nums"
                  />
                  <p className="text-[11px] text-zinc-500">
                    O Zod rejeita números negativos ou zero.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Classe do Ativo (AssetType Enum)
                  </label>
                  <Select value={assetType} onValueChange={setAssetType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STOCK">Ações (STOCK)</SelectItem>
                      <SelectItem value="CRYPTO">Criptomoeda (CRYPTO)</SelectItem>
                      <SelectItem value="BOND">Renda Fixa (BOND)</SelectItem>
                      <SelectItem value="COMMODITY">Commodity (COMMODITY)</SelectItem>
                      <SelectItem value="REAL_ESTATE">Imobiliário (REAL_ESTATE)</SelectItem>
                      <SelectItem value="FIAT">Moeda Fiat (FIAT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter className="pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading} className="gap-2">
                    {loading ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        <span>Validando na Borda...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        <span>Validar & Salvar</span>
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Financial KPI Cards (Geist Mono tabular-nums) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Patrimônio Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums text-zinc-950 dark:text-zinc-50">
              {totalPortfolio.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <p className="mt-1 flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
              <span className="font-mono tabular-nums">+4,82%</span> neste mês
            </p>
          </CardContent>
        </Card>

        {/* KPI 2 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Imposto Estimado (15%)
            </CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums text-zinc-950 dark:text-zinc-50">
              {totalTax.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              Retenção fiscal apurada na borda
            </p>
          </CardContent>
        </Card>

        {/* KPI 3 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Banco Cloudflare D1
            </CardTitle>
            <Database className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums text-zinc-950 dark:text-zinc-50">
              8.00 KB
            </div>
            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              modal-tools-db (Ativo)
            </p>
          </CardContent>
        </Card>

        {/* KPI 4 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Segurança Zod & Borda
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums text-zinc-950 dark:text-zinc-50">
              {assets.length} Ativos
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              100% validados contra injeção
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Asset Table & Tabs Section */}
      <Card>
        <CardHeader className="border-b border-zinc-200/80 pb-4 dark:border-zinc-800/80">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg">Portfólio de Ativos em Tempo Real</CardTitle>
              <CardDescription>
                Tabela formatada com fontes Geist Mono e alinhamento <code className="text-xs font-mono">tabular-nums</code>.
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono text-xs w-fit">
              Total de Posições: {assets.length}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticker</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead className="text-right">Preço Unitário</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
                <TableHead className="text-right">Imposto Estimado</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-semibold font-mono text-zinc-950 dark:text-zinc-50">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-zinc-100 dark:bg-zinc-800 text-[11px]">
                        {asset.ticker}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono text-[10px]">
                      {asset.assetType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums text-zinc-900 dark:text-zinc-100">
                    {asset.amount.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 8,
                    })}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums text-zinc-600 dark:text-zinc-400">
                    {asset.unitPrice.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold tabular-nums text-zinc-950 dark:text-zinc-50">
                    {asset.totalValue.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums text-zinc-500">
                    {asset.taxEstimated.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={asset.status === "Auditado" ? "success" : "outline"}
                      className="text-[10px]"
                    >
                      {asset.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
