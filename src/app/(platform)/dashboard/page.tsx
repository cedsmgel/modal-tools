"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { UserProfile, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import {
  User,
  CreditCard,
  Palette,
  Sun,
  Moon,
  Laptop,
  Check,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const emptySubscribe = () => () => {};

export default function DashboardPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user, isLoaded } = useUser();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;
  const displayName = isLoaded && user ? (user.firstName || user.username || "Usuário") : "Usuário";

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Cabeçalho da Dashboard */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/60 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Painel de Controle
            </h1>
            <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
              Conta Ativa
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            Olá, <span className="text-white font-medium">{displayName}</span>. Gerencie suas credenciais de segurança, plano de assinatura e preferências visuais.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-zinc-900 text-zinc-300 border-zinc-800 text-[11px] px-2.5 py-1">
            <ShieldCheck className="h-3.5 w-3.5 mr-1.5 text-emerald-400" /> Clerk & Stripe
          </Badge>
        </div>
      </div>

      {/* Navegação por Abas Principais (Conta, Faturamento e Tema) */}
      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="bg-zinc-900 border border-zinc-800/80 p-1 rounded-xl flex-wrap h-auto gap-1">
          <TabsTrigger
            value="account"
            className="flex items-center gap-2 data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 text-xs px-4 py-2 rounded-lg"
          >
            <User className="h-4 w-4" />
            <span>Conta & Perfil</span>
          </TabsTrigger>

          <TabsTrigger
            value="billing"
            className="flex items-center gap-2 data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 text-xs px-4 py-2 rounded-lg"
          >
            <CreditCard className="h-4 w-4" />
            <span>Faturamento & Assinatura</span>
          </TabsTrigger>

          <TabsTrigger
            value="appearance"
            className="flex items-center gap-2 data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 text-xs px-4 py-2 rounded-lg"
          >
            <Palette className="h-4 w-4" />
            <span>Mudança de Tema</span>
          </TabsTrigger>
        </TabsList>

        {/* =========================================================================
            ABA 1: CONTA & PERFIL (CLERK NATIVO - SEM BOX EM CIMA DA BOX)
            ========================================================================= */}
        <TabsContent value="account" className="space-y-4 pt-1">
          <div className="w-full flex justify-center">
            <UserProfile
              routing="hash"
              appearance={{
                theme: isDark ? (dark as never) : undefined,
                elements: {
                  card: "border border-zinc-800/80 shadow-none bg-zinc-950/80 rounded-2xl w-full max-w-4xl",
                  navbar: "border-r border-zinc-800/60",
                  headerTitle: "text-white text-base font-bold",
                  headerSubtitle: "text-zinc-400 text-xs",
                  profileSectionTitleText: "text-zinc-200 text-sm font-semibold",
                },
              }}
            />
          </div>
        </TabsContent>

        {/* =========================================================================
            ABA 2: FATURAMENTO & ASSINATURA (STRIPE BILLING)
            ========================================================================= */}
        <TabsContent value="billing" className="space-y-6 pt-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Status do Plano Atual */}
            <Card className="md:col-span-2 bg-zinc-900/40 border-zinc-800/80">
              <CardHeader className="border-b border-zinc-800/60 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base text-white">Plano Ativo</CardTitle>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">
                      Ativo
                    </Badge>
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">Renovação mensal</span>
                </div>
                <CardDescription className="text-xs text-zinc-400">
                  Assinatura processada de ponta a ponta com segurança bancária via Stripe Billing.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">Modal Tools Pro</h3>
                      <Sparkles className="h-4 w-4 text-emerald-400" />
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Acesso irrestrito a todas as ferramentas, conversores e APIs de alta precisão.
                    </p>
                  </div>
                  <div className="text-right sm:text-right">
                    <div className="text-xl font-bold font-mono text-white tabular-nums">
                      R$ 97,00<span className="text-xs text-zinc-500 font-normal">/mês</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-medium">Cobrança recorrente</span>
                  </div>
                </div>

                {/* Métricas de Uso de Cota */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-zinc-400">Consumo de Requisições de Borda (Edge API)</span>
                    <span className="font-mono text-white tabular-nums">842 / 5.000 requisições</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                    <div className="h-full bg-emerald-500 transition-all" style={{ width: "16.8%" }} />
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    A cota de chamadas do seu plano renova no primeiro dia de cada ciclo.
                  </p>
                </div>

                {/* Botões de Ação Stripe */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Button
                    size="sm"
                    className="h-9 gap-1.5 bg-white text-zinc-950 hover:bg-zinc-200 font-semibold shadow-xs"
                    onClick={() => alert("Redirecionando para o Portal de Clientes Stripe...")}
                  >
                    <span>Gerenciar Assinatura no Stripe</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800"
                    onClick={() => alert("Informações de upgrade enviadas para seu e-mail corporativo.")}
                  >
                    Fazer Upgrade para Plano Enterprise
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Benefícios Inclusos */}
            <Card className="bg-zinc-900/40 border-zinc-800/80">
              <CardHeader className="border-b border-zinc-800/60 pb-4">
                <CardTitle className="text-sm font-semibold text-white">Vantagens do Plano Pro</CardTitle>
                <CardDescription className="text-xs text-zinc-400">
                  Recursos corporativos liberados
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Hub Matemático & Conversores completo</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Cálculos univariados e BigInt sem limite</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Simuladores Fiscal, Imobiliário e Financeiro</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Exportação e formatação LaTeX de alta resolução</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Suporte prioritário e SLA de 99.9%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Histórico Recente de Pagamentos */}
          <Card className="bg-zinc-900/40 border-zinc-800/80">
            <CardHeader className="border-b border-zinc-800/60 pb-4">
              <CardTitle className="text-sm font-semibold text-white">Histórico de Faturas & Recibos</CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Download de comprovantes de pagamento e notas fiscais geradas pela Stripe.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-800/60 text-xs">
                <div className="flex items-center justify-between p-4">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-white">Fatura #INV-2026-10</span>
                    <span className="block text-[11px] text-zinc-400">Pago em 16/10/2026 via Cartão de Crédito (•••• 4242)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-white tabular-nums">R$ 97,00</span>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">
                      Pago
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-white">Fatura #INV-2026-09</span>
                    <span className="block text-[11px] text-zinc-400">Pago em 16/09/2026 via Cartão de Crédito (•••• 4242)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-white tabular-nums">R$ 97,00</span>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">
                      Pago
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* =========================================================================
            ABA 3: CONFIGURAÇÕES DE MUDANÇA DE TEMA (THEME SETTINGS)
            ========================================================================= */}
        <TabsContent value="appearance" className="space-y-6 pt-1">
          <Card className="bg-zinc-900/40 border-zinc-800/80">
            <CardHeader className="border-b border-zinc-800/60 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base text-white flex items-center gap-2">
                    <Palette className="h-4 w-4 text-cyan-400" />
                    Preferências de Aparência & Mudança de Tema
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-400">
                    Personalize a experiência visual da plataforma. As alterações são sincronizadas e persistidas automaticamente.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-[10px] text-zinc-400 border-zinc-800 font-mono">
                  next-themes
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Opção 1: Tema Claro */}
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`flex flex-col text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    mounted && theme === "light"
                      ? "bg-zinc-800/90 border-cyan-500 shadow-md ring-1 ring-cyan-500/40"
                      : "bg-zinc-950/70 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/40"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <div className="h-9 w-9 rounded-lg bg-zinc-100 text-zinc-900 flex items-center justify-center shadow-xs">
                      <Sun className="h-5 w-5 text-amber-500" />
                    </div>
                    {mounted && theme === "light" && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400">
                        <Check className="h-3.5 w-3.5" /> Ativo
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-white">Tema Claro</span>
                  <p className="text-xs text-zinc-400 mt-1">
                    Fundo branco de alto contraste para ambientes iluminados e leitura diurna.
                  </p>
                </button>

                {/* Opção 2: Tema Escuro */}
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`flex flex-col text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    mounted && theme === "dark"
                      ? "bg-zinc-800/90 border-cyan-500 shadow-md ring-1 ring-cyan-500/40"
                      : "bg-zinc-950/70 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/40"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <div className="h-9 w-9 rounded-lg bg-zinc-900 text-zinc-100 flex items-center justify-center border border-zinc-700 shadow-xs">
                      <Moon className="h-5 w-5 text-indigo-400" />
                    </div>
                    {mounted && theme === "dark" && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400">
                        <Check className="h-3.5 w-3.5" /> Ativo
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-white">Tema Escuro</span>
                  <p className="text-xs text-zinc-400 mt-1">
                    Visual moderno padrão Linear (zinc-950) com bordas sutis e menor fadiga ocular.
                  </p>
                </button>

                {/* Opção 3: Sistema */}
                <button
                  type="button"
                  onClick={() => setTheme("system")}
                  className={`flex flex-col text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    mounted && theme === "system"
                      ? "bg-zinc-800/90 border-cyan-500 shadow-md ring-1 ring-cyan-500/40"
                      : "bg-zinc-950/70 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/40"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <div className="h-9 w-9 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center shadow-xs">
                      <Laptop className="h-5 w-5 text-cyan-400" />
                    </div>
                    {mounted && theme === "system" && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400">
                        <Check className="h-3.5 w-3.5" /> Ativo
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-white">Sincronizar com Sistema</span>
                  <p className="text-xs text-zinc-400 mt-1">
                    Adapta-se automaticamente às configurações de aparência do seu sistema operacional.
                  </p>
                </button>
              </div>

              {/* Informação sobre o tema atualmente ativo */}
              <div className="rounded-xl bg-zinc-950/60 border border-zinc-800/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-zinc-400">Tema Atualmente Renderizado: </span>
                  <span className="font-semibold text-white uppercase font-mono ml-1">
                    {mounted ? (resolvedTheme || "dark") : "dark"}
                  </span>
                </div>
                <div className="text-zinc-500 text-[11px]">
                  Preferência salva instantaneamente no <code className="text-zinc-400">localStorage</code> do seu navegador.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
