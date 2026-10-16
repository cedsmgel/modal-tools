import Link from "next/link";
import {
  ShieldCheck,
  Database,
  ArrowRight,
  TrendingUp,
  Lock,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function MarketingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,rgba(120,119,198,0.1),transparent)] dark:bg-[radial-gradient(45rem_50rem_at_top,rgba(255,255,255,0.03),transparent)]" />
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Engenharia de Borda Cloudflare & Next.js 16
            <ChevronRight className="h-3 w-3 text-zinc-400" />
          </div>

          <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-zinc-950 sm:text-6xl dark:text-white">
            Plataforma Financeira & Gestão de Ativos em{" "}
            <span className="bg-gradient-to-r from-zinc-700 via-zinc-900 to-zinc-500 bg-clip-text text-transparent dark:from-zinc-100 dark:via-zinc-300 dark:to-zinc-500">
              Escala Global
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Segurança de borda instantânea com validação estrita Zod, banco de dados serverless Cloudflare D1 e autenticação empresarial Clerk integrada.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/platform">
              <Button size="lg" className="h-11 px-6 shadow-md gap-2 font-semibold">
                Abrir App Shell
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#preview">
              <Button size="lg" variant="outline" className="h-11 px-6">
                Ver Demonstração
              </Button>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 gap-4 border-t border-zinc-200/80 pt-10 sm:grid-cols-4 dark:border-zinc-800/80 text-left">
            <div>
              <p className="text-xs uppercase font-medium tracking-wider text-zinc-500 dark:text-zinc-400">Latência de Borda</p>
              <p className="mt-1 text-2xl font-bold font-mono tabular-nums text-zinc-900 dark:text-zinc-50">&lt; 35ms</p>
            </div>
            <div>
              <p className="text-xs uppercase font-medium tracking-wider text-zinc-500 dark:text-zinc-400">Banco de Dados</p>
              <p className="mt-1 text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-50">Cloudflare D1</p>
            </div>
            <div>
              <p className="text-xs uppercase font-medium tracking-wider text-zinc-500 dark:text-zinc-400">Validação Zod</p>
              <p className="mt-1 text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-50">Strict / Zero-Trust</p>
            </div>
            <div>
              <p className="text-xs uppercase font-medium tracking-wider text-zinc-500 dark:text-zinc-400">Precisão Numérica</p>
              <p className="mt-1 text-2xl font-bold font-mono tabular-nums text-zinc-900 dark:text-zinc-50">tabular-nums</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section id="bento" className="py-20 border-t border-zinc-200/80 dark:border-zinc-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-3">Arquitetura Moderna</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Construído com padrões Linear & Stripe
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Cards com cantos arredondados rounded-xl, separadores sutis e alta densidade de informação limpa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento 1: Cloudflare D1 (Span 2 cols) */}
            <Card className="md:col-span-2 relative overflow-hidden bg-gradient-to-br from-white to-zinc-50/50 dark:from-zinc-900 dark:to-zinc-950">
              <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 opacity-10 dark:opacity-20 pointer-events-none">
                <Database className="h-64 w-64" />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                    <Database className="h-5 w-5" />
                  </div>
                  <Badge variant="outline">Cloudflare D1 SQL</Badge>
                </div>
                <CardTitle className="text-2xl mt-4">Banco de Dados Serverless com D1</CardTitle>
                <CardDescription>
                  Base SQLite nativa distribuída na rede global da Cloudflare com isolamento total e consistência ACID.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-zinc-200/80 bg-zinc-100/50 p-4 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-950/80">
                  <div className="flex justify-between text-zinc-500 mb-2 border-b border-zinc-200 dark:border-zinc-800 pb-1">
                    <span>DATABASE ID</span>
                    <span className="text-emerald-500">ACTIVE (ENAM)</span>
                  </div>
                  <div className="text-zinc-900 dark:text-zinc-100 tabular-nums">
                    44e6555f-3c0e-4e8b-b376-7b91acc17b76 • modal-tools-db
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
                    <p className="text-xs text-zinc-500">Replicação</p>
                    <p className="font-semibold text-sm">Edge Read</p>
                  </div>
                  <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
                    <p className="text-xs text-zinc-500">Tamanho Atual</p>
                    <p className="font-semibold font-mono tabular-nums text-sm">8.00 KB</p>
                  </div>
                  <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
                    <p className="text-xs text-zinc-500">Compliance</p>
                    <p className="font-semibold text-sm">ACID SQLite</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bento 2: Zod Edge Security */}
            <Card className="bg-gradient-to-br from-white to-zinc-50/50 dark:from-zinc-900 dark:to-zinc-950">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <Badge variant="outline">Zero-Trust</Badge>
                </div>
                <CardTitle className="text-xl mt-4">Validação Estrita Zod</CardTitle>
                <CardDescription>
                  Rejeição imediata na borda com HTTP 400/401 antes de tocar o backend.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Schema estrito (.strict()) contra mass assignment</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Sanitização e regex alfanumérica</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Enum tipado para ativos financeiros</span>
                </div>
              </CardContent>
            </Card>

            {/* Bento 3: Clerk Enterprise Auth */}
            <Card className="bg-gradient-to-br from-white to-zinc-50/50 dark:from-zinc-900 dark:to-zinc-950">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Badge variant="outline">Clerk Auth</Badge>
                </div>
                <CardTitle className="text-xl mt-4">Identidade & Organizações</CardTitle>
                <CardDescription>
                  Autenticação corporativa, sessões criptografadas e suporte a multi-tenancy.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <span className="text-zinc-600 dark:text-zinc-300">Provedor Conectado</span>
                  <Badge variant="success">Modal Tools</Badge>
                </div>
                <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <span className="text-zinc-600 dark:text-zinc-300">Controles Visuais</span>
                  <span className="font-mono text-zinc-900 dark:text-zinc-100">UserButton / Show</span>
                </div>
              </CardContent>
            </Card>

            {/* Bento 4: Typography & Tabular Nums (Span 2 cols) */}
            <Card className="md:col-span-2 bg-gradient-to-br from-white to-zinc-50/50 dark:from-zinc-900 dark:to-zinc-950">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <Badge variant="outline">Geist Mono • tabular-nums</Badge>
                </div>
                <CardTitle className="text-2xl mt-4">Exibições Monetárias e Fiscais de Alta Precisão</CardTitle>
                <CardDescription>
                  Alinhamento numérico perfeito em tabelas financeiras através das fontes Geist Sans e Geist Mono.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/60">
                    <span className="text-xs text-zinc-500 font-medium">Patrimônio Líquido</span>
                    <p className="text-2xl font-bold font-mono tabular-nums text-zinc-900 dark:text-zinc-50 mt-1">
                      R$ 2.458.190,40
                    </p>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium font-mono tabular-nums">
                      +14,2% neste mês
                    </span>
                  </div>
                  <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/60">
                    <span className="text-xs text-zinc-500 font-medium">Imposto Retido Estimado</span>
                    <p className="text-2xl font-bold font-mono tabular-nums text-zinc-900 dark:text-zinc-50 mt-1">
                      R$ 38.742,15
                    </p>
                    <span className="text-xs text-zinc-500 font-medium">
                      Aliq. Efetiva: 15.0%
                    </span>
                  </div>
                  <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/60">
                    <span className="text-xs text-zinc-500 font-medium">Transações Validadas</span>
                    <p className="text-2xl font-bold font-mono tabular-nums text-zinc-900 dark:text-zinc-50 mt-1">
                      1.849 ops
                    </p>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      100% Edge Verified
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Live Preview Component Showcase */}
      <section id="preview" className="py-20 bg-zinc-100/40 dark:bg-zinc-900/30 border-t border-zinc-200/80 dark:border-zinc-800/80">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <Badge variant="outline">Live Preview</Badge>
            <h2 className="text-3xl font-bold tracking-tight mt-3">Componentes Base em Ação</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
              Demonstração dos componentes Card, Table, Tabs, Badge e Button com formatação tabular-nums.
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="border-b border-zinc-200/80 dark:border-zinc-800/80 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">Carteira de Ativos Monitorados</CardTitle>
                  <CardDescription>Dados sanitizados validados pelo schema Zod</CardDescription>
                </div>
                <Link href="/platform">
                  <Button size="sm" className="gap-2">
                    Abrir Plataforma
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticker</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                    <TableHead className="text-right">Preço Médio</TableHead>
                    <TableHead className="text-right">Total (BRL)</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold font-mono text-zinc-900 dark:text-zinc-100">
                      PETR4
                    </TableCell>
                    <TableCell><Badge variant="secondary">STOCK</Badge></TableCell>
                    <TableCell className="text-right font-mono tabular-nums">1.500</TableCell>
                    <TableCell className="text-right font-mono tabular-nums">R$ 36,40</TableCell>
                    <TableCell className="text-right font-mono font-bold tabular-nums">R$ 54.600,00</TableCell>
                    <TableCell className="text-center"><Badge variant="success">Auditado</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold font-mono text-zinc-900 dark:text-zinc-100">
                      BTC
                    </TableCell>
                    <TableCell><Badge variant="secondary">CRYPTO</Badge></TableCell>
                    <TableCell className="text-right font-mono tabular-nums">0,45000000</TableCell>
                    <TableCell className="text-right font-mono tabular-nums">R$ 380.000,00</TableCell>
                    <TableCell className="text-right font-mono font-bold tabular-nums">R$ 171.000,00</TableCell>
                    <TableCell className="text-center"><Badge variant="success">Auditado</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold font-mono text-zinc-900 dark:text-zinc-100">
                      VALE3
                    </TableCell>
                    <TableCell><Badge variant="secondary">STOCK</Badge></TableCell>
                    <TableCell className="text-right font-mono tabular-nums">800</TableCell>
                    <TableCell className="text-right font-mono tabular-nums">R$ 58,20</TableCell>
                    <TableCell className="text-right font-mono font-bold tabular-nums">R$ 46.560,00</TableCell>
                    <TableCell className="text-center"><Badge variant="success">Auditado</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
