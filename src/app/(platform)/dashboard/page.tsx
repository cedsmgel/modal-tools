import { Suspense } from "react";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import {
  TrendingUp,
  DollarSign,
  Receipt,
  Building2,
  ArrowUpRight,
  Plus,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata = {
  title: "Dashboard — Modal Tools",
  description: "Painel de controle patrimonial consolidado, apuração fiscal e gestão de ativos.",
};

// Dados simulando o schema D1 de ativos e transações
const mockAssets = [
  {
    id: "ast_1",
    ticker: "PETR4",
    name: "Petrobras PN",
    type: "STOCK",
    amount: "1.200",
    averagePrice: "R$ 36,40",
    totalValue: "R$ 44.880,00",
    change: "+3,2%",
    positive: true,
  },
  {
    id: "ast_2",
    ticker: "KNRI11",
    name: "Kinea Renda Imobiliária",
    type: "REAL_ESTATE",
    amount: "350",
    averagePrice: "R$ 158,10",
    totalValue: "R$ 56.700,00",
    change: "+0,8%",
    positive: true,
  },
  {
    id: "ast_3",
    ticker: "BTC",
    name: "Bitcoin Spot",
    type: "CRYPTO",
    amount: "0,45",
    averagePrice: "R$ 380.000,00",
    totalValue: "R$ 176.400,00",
    change: "+5,4%",
    positive: true,
  },
  {
    id: "ast_4",
    ticker: "TESOURO-IPCA",
    name: "NTN-B 2035",
    type: "BOND",
    amount: "40",
    averagePrice: "R$ 4.250,00",
    totalValue: "R$ 170.000,00",
    change: "-0,2%",
    positive: false,
  },
];

async function UserGreeting() {
  const user = await currentUser();
  const displayName = user?.firstName || user?.username || "Investidor";

  return (
    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
      Olá, {displayName}
    </h1>
  );
}

function UserGreetingSkeleton() {
  return (
    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
      Olá, Investidor
    </h1>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Cabeçalho de Boas-vindas */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/60 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Suspense fallback={<UserGreetingSkeleton />}>
              <UserGreeting />
            </Suspense>
            <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
              D1 Conectado
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            Visão unificada das suas posições patrimoniais, rendimentos e compromissos fiscais.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/account">
            <Button variant="outline" size="sm" className="h-9 text-xs border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-white hover:bg-zinc-800">
              Configurações
            </Button>
          </Link>
          <Button size="sm" className="h-9 text-xs gap-1.5 bg-white text-zinc-950 hover:bg-zinc-200 font-semibold shadow-xs">
            <Plus className="h-3.5 w-3.5" />
            <span>Novo Lançamento</span>
          </Button>
        </div>
      </div>

      {/* Grade de KPIs Resumo (Estilo Stripe / Linear com tabular-nums) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 */}
        <Card className="bg-zinc-900/40 border-zinc-800/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Patrimônio Total
            </CardDescription>
            <div className="h-8 w-8 rounded-lg bg-zinc-800/60 flex items-center justify-center text-zinc-300">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">
              R$ 447.980,00
            </div>
            <p className="mt-1 flex items-center text-xs text-emerald-400 font-medium font-mono tabular-nums">
              <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
              +4,85% <span className="text-zinc-500 font-sans font-normal ml-1">este mês</span>
            </p>
          </CardContent>
        </Card>

        {/* KPI 2 */}
        <Card className="bg-zinc-900/40 border-zinc-800/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Rendimento Mensal
            </CardDescription>
            <div className="h-8 w-8 rounded-lg bg-zinc-800/60 flex items-center justify-center text-zinc-300">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">
              R$ 3.840,50
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              Dividendos e aluguéis recebidos
            </p>
          </CardContent>
        </Card>

        {/* KPI 3 */}
        <Card className="bg-zinc-900/40 border-zinc-800/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Imposto Estimado (DARF)
            </CardDescription>
            <div className="h-8 w-8 rounded-lg bg-zinc-800/60 flex items-center justify-center text-zinc-300">
              <Receipt className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">
              R$ 685,20
            </div>
            <p className="mt-1 flex items-center text-xs text-zinc-400">
              <Calendar className="mr-1 h-3.5 w-3.5 text-zinc-500" />
              Competência Out/2026
            </p>
          </CardContent>
        </Card>

        {/* KPI 4 */}
        <Card className="bg-zinc-900/40 border-zinc-800/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Taxa de Ocupação
            </CardDescription>
            <div className="h-8 w-8 rounded-lg bg-zinc-800/60 flex items-center justify-center text-zinc-300">
              <Building2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">
              100,0%
            </div>
            <p className="mt-1 text-xs text-emerald-400 font-medium">
              3 imóveis locados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cards de Atalhos Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-zinc-900/30 border-zinc-800/70 hover:border-zinc-700 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center text-white">
                <TrendingUp className="h-4 w-4" />
              </div>
              <Badge variant="outline" className="text-[10px] border-zinc-800 text-zinc-400">Ativos</Badge>
            </div>
            <CardTitle className="text-base text-white mt-2">Módulo de Investimentos</CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Consolidação de ações, fundos e criptoativos com cálculo de preço médio.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white font-medium transition-colors">
              <span>Gerenciar carteira</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/30 border-zinc-800/70 hover:border-zinc-700 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center text-white">
                <Receipt className="h-4 w-4" />
              </div>
              <Badge variant="outline" className="text-[10px] border-zinc-800 text-zinc-400">Fiscal</Badge>
            </div>
            <CardTitle className="text-base text-white mt-2">Inteligência Fiscal & IR</CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Apuração automática de lucros e prejuízos com geração de relatórios contábeis.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white font-medium transition-colors">
              <span>Calcular impostos</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/30 border-zinc-800/70 hover:border-zinc-700 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center text-white">
                <Building2 className="h-4 w-4" />
              </div>
              <Badge variant="outline" className="text-[10px] border-zinc-800 text-zinc-400">Imóveis</Badge>
            </div>
            <CardTitle className="text-base text-white mt-2">Gestão Patrimonial</CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Controle de contratos de locação, reajustes por IGP-M/IPCA e fluxo de caixa.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white font-medium transition-colors">
              <span>Ver contratos</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Posições e Registros Recentes (Simulando D1 Database) */}
      <Card className="bg-zinc-900/40 border-zinc-800/80">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/60 pb-4">
          <div>
            <CardTitle className="text-base text-white">Posições Ativas em Carteira</CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Registros sincronizados com o banco de dados distribuído Cloudflare D1.
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs font-mono border-zinc-800 text-zinc-400 mt-2 sm:mt-0 w-fit">
            Total: {mockAssets.length} ativos
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800/70 hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-zinc-400">Ativo / Código</TableHead>
                  <TableHead className="text-xs font-medium text-zinc-400">Classe</TableHead>
                  <TableHead className="text-xs font-medium text-zinc-400 text-right">Quantidade</TableHead>
                  <TableHead className="text-xs font-medium text-zinc-400 text-right">Preço Médio</TableHead>
                  <TableHead className="text-xs font-medium text-zinc-400 text-right">Posição Total</TableHead>
                  <TableHead className="text-xs font-medium text-zinc-400 text-right">Variação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAssets.map((asset) => (
                  <TableRow key={asset.id} className="border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                    <TableCell className="font-medium text-zinc-200">
                      <div>
                        <span className="font-mono font-semibold text-white mr-2">{asset.ticker}</span>
                        <span className="text-xs text-zinc-400">{asset.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px] bg-zinc-800 text-zinc-300">
                        {asset.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums text-zinc-300 text-xs">
                      {asset.amount}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums text-zinc-400 text-xs">
                      {asset.averagePrice}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums font-semibold text-white text-xs">
                      {asset.totalValue}
                    </TableCell>
                    <TableCell className={`text-right font-mono tabular-nums text-xs font-medium ${asset.positive ? "text-emerald-400" : "text-rose-400"}`}>
                      {asset.change}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
