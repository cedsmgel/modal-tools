"use client";

import * as React from "react";
import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import {
  CreditCard,
  User,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AccountPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Cabeçalho */}
      <div className="border-b border-zinc-800/60 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Configurações da Conta
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-zinc-400">
          Gerencie suas preferências de segurança, credenciais de acesso e plano de assinatura.
        </p>
      </div>

      {/* Navegação por Abas (shadcn Tabs) */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-zinc-900 border border-zinc-800/80 p-1 rounded-xl">
          <TabsTrigger
            value="profile"
            className="flex items-center gap-2 data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 text-xs px-4 py-2"
          >
            <User className="h-4 w-4" />
            <span>Perfil & Segurança</span>
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="flex items-center gap-2 data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 text-xs px-4 py-2"
          >
            <CreditCard className="h-4 w-4" />
            <span>Assinatura & Faturamento</span>
          </TabsTrigger>
        </TabsList>

        {/* Aba 1: Perfil (Clerk UserProfile - sem box em cima de box) */}
        <TabsContent value="profile" className="space-y-4 pt-1">
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

        {/* Aba 2: Assinatura & Faturamento (Stripe) */}
        <TabsContent value="billing" className="space-y-6">
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
                  <span className="text-xs text-zinc-500 font-mono">Renovação em 16/11/2026</span>
                </div>
                <CardDescription className="text-xs text-zinc-400">
                  Sua assinatura atual é processada com segurança via Stripe Billing.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">Modal Tools — Plano Profissional</h3>
                      <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-300">
                        PRO
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                      Acesso ilimitado a relatórios fiscais automatizados, cálculo de DARFs e gestão imobiliária.
                    </p>
                  </div>

                  <div className="text-right sm:border-l sm:border-zinc-800 sm:pl-6">
                    <span className="text-2xl font-bold font-mono tabular-nums text-white">R$ 59,00</span>
                    <span className="text-xs text-zinc-400 block">/ mensal</span>
                  </div>
                </div>

                {/* Recursos inclusos no plano */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                    Benefícios Inclusos no seu Pacote
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-zinc-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Ativos e posições financeiras ilimitadas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Módulo fiscal completo com cálculo automático de DARF</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Gestão de contratos e reajustes imobiliários</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Banco de dados SQLite D1 com replicação global</span>
                    </li>
                  </ul>
                </div>

                {/* Ações de Faturamento */}
                <div className="pt-2 flex flex-wrap items-center gap-3 border-t border-zinc-800/60">
                  <Button size="sm" className="bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold shadow-xs">
                    Gerenciar no Stripe Portal
                  </Button>
                  <Button variant="outline" size="sm" className="border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs">
                    Atualizar Método de Pagamento
                  </Button>
                  <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-300 text-xs ml-auto">
                    Histórico de Notas Fiscais
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card Lateral: Upgrade / Corporate */}
            <Card className="bg-gradient-to-b from-zinc-900/80 to-zinc-950 border-zinc-800 flex flex-col justify-between">
              <CardHeader>
                <div className="h-9 w-9 rounded-lg bg-zinc-800 flex items-center justify-center text-white mb-2">
                  <Sparkles className="h-4 w-4" />
                </div>
                <CardTitle className="text-base text-white">Precisa de Mais?</CardTitle>
                <CardDescription className="text-xs text-zinc-400">
                  Para escritórios contábeis e consultorias com múltiplos clientes e consolidação de CNPJs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs space-y-1.5">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-amber-400" />
                    <span>Plano Corporate & Family</span>
                  </div>
                  <p className="text-zinc-400 text-[11px]">
                    Multi-tenancy com controle de permissões por auditor ou contador.
                  </p>
                </div>

                <a href="mailto:contato@modaltools.com" className="w-full block">
                  <Button variant="outline" className="w-full text-xs border-zinc-700 hover:bg-zinc-800 text-zinc-200 gap-1.5">
                    <span>Falar com Consultor</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
