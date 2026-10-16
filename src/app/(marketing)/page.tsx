import Link from "next/link";
import {
  TrendingUp,
  Receipt,
  Building2,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  FileText,
  Clock,
  PieChart,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MarketingPage() {
  return (
    <div className="space-y-24 py-16 sm:py-24">
      {/* Hero Section — Foco Exclusivo nos Serviços e Benefícios ao Cliente */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 py-1 text-xs font-medium text-zinc-700 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-300">
          <Sparkles className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100" />
          <span>Gestão Patrimonial & Inteligência Fiscal Integrada</span>
        </div>

        <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-zinc-950 sm:text-6xl dark:text-white">
          Controle total sobre seus investimentos, imóveis e{" "}
          <span className="bg-gradient-to-r from-zinc-700 via-zinc-900 to-zinc-500 bg-clip-text text-transparent dark:from-zinc-100 dark:via-zinc-300 dark:to-zinc-500">
            obrigações fiscais
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          Uma plataforma inteligente e centralizada para pessoas físicas e empresas consolidarem ativos financeiros, gerenciarem locações imobiliárias e automatizarem a apuração de impostos sem burocracia.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/platform">
            <Button size="lg" className="h-11 px-7 shadow-md gap-2 font-semibold">
              <span>Acessar Plataforma</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="#servicos">
            <Button size="lg" variant="outline" className="h-11 px-7">
              Conhecer Nossos Módulos
            </Button>
          </Link>
        </div>

        {/* Indicadores de Valor para o Cliente */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-zinc-200/80 pt-10 dark:border-zinc-800/80 text-left">
          <div>
            <p className="text-xs uppercase font-medium tracking-wider text-zinc-500">Patrimônio Consolidado</p>
            <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-100">Visão 360°</p>
            <span className="text-xs text-zinc-500">Ações, Renda Fixa e Imóveis</span>
          </div>
          <div>
            <p className="text-xs uppercase font-medium tracking-wider text-zinc-500">Apuração Tributária</p>
            <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-100">100% Automatizada</p>
            <span className="text-xs text-zinc-500">Cálculo de DARFs e relatórios</span>
          </div>
          <div>
            <p className="text-xs uppercase font-medium tracking-wider text-zinc-500">Gestão Imobiliária</p>
            <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-100">Contratos & Aluguéis</p>
            <span className="text-xs text-zinc-500">Controle de rendimentos e FIIs</span>
          </div>
          <div>
            <p className="text-xs uppercase font-medium tracking-wider text-zinc-500">Privacidade de Dados</p>
            <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-100">Nível Institucional</p>
            <span className="text-xs text-zinc-500">Isolamento e controle de acesso</span>
          </div>
        </div>
      </section>

      {/* Seção de Módulos & Serviços */}
      <section id="servicos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="mb-3">Nossos Produtos</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-zinc-950 dark:text-white">
            Soluções completas para cada pilar do seu patrimônio
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            Tudo o que você precisa para gerenciar suas finanças pessoais ou corporativas em um único ecossistema integrado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Módulo 1: Gestão Financeira */}
          <Card className="flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 mb-2">
                <TrendingUp className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">Gestão Financeira & Investimentos</CardTitle>
              <CardDescription>
                Acompanhe todo o seu portfólio de ações, títulos de renda fixa, fundos de investimento e moedas em tempo real.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Cálculo automático de rentabilidade ponderada e retorno real</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Consolidação de extratos e históricos de transações financeiras</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Análise de diversificação por classe de ativo e risco</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link href="/platform">
                  <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
                    <span>Acessar Módulo Financeiro</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Módulo 2: Inteligência Fiscal */}
          <Card className="flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 mb-2">
                <Receipt className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">Inteligência Fiscal & Tributos</CardTitle>
              <CardDescription>
                Elimine o estresse da declaração de impostos e apuração mensal de ganhos de capital de forma precisa.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Apuração automática de lucros e compensação de prejuízos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Emissão e controle simplificado de guias de recolhimento (DARFs)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Relatórios prontos para exportação direta ao contador</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link href="/platform#tax">
                  <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
                    <span>Acessar Módulo Fiscal</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Módulo 3: Gestão Imobiliária */}
          <Card className="flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 mb-2">
                <Building2 className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">Gestão Imobiliária & Locações</CardTitle>
              <CardDescription>
                Controle integral de imóveis físicos, contratos de locação, taxa de vacância e rendimentos de FIIs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Gestão de contratos com alertas de vencimento e reajuste por índices</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Fluxo financeiro de aluguéis recebidos versus custos de manutenção</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Acompanhamento consolidado de dividendos de Fundos Imobiliários</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link href="/platform#assets">
                  <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
                    <span>Acessar Módulo Imobiliário</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Seção de Planos & Preços */}
      <section id="precos" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-zinc-200/80 dark:border-zinc-800/80 pt-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="mb-3">Planos & Preços</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-zinc-950 dark:text-white">
            Planos sob medida para o seu momento patrimonial
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            Sem taxas escondidas. Cancele ou altere seu plano quando desejar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Plano Básico */}
          <Card className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-lg">Iniciante</CardTitle>
              <CardDescription>Para quem está organizando os primeiros investimentos.</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-zinc-950 dark:text-white">Grátis</span>
                <span className="text-xs text-zinc-500 ml-1">/ para sempre</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Até 10 ativos monitorados</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Painel básico de rentabilidade</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Exportação mensal em planilha</span>
                </li>
              </ul>
              <Link href="/platform">
                <Button variant="outline" className="w-full text-xs">Começar Grátis</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Plano Pro (Destaque) */}
          <Card className="flex flex-col justify-between border-zinc-900 dark:border-zinc-100 shadow-md relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">Mais Escolhido</Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">Profissional</CardTitle>
              <CardDescription>Para investidores com carteiras ativas e imóveis.</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-zinc-950 dark:text-white">R$ 59</span>
                <span className="text-xs text-zinc-500 ml-1">/ mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Ativos e locações ilimitadas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Módulo Fiscal com apuração de DARF e IR</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Gestão de contratos imobiliários e reajustes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Suporte prioritário via chat</span>
                </li>
              </ul>
              <Link href="/platform">
                <Button className="w-full text-xs shadow-xs">Assinar Plano Pro</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Plano Corporate */}
          <Card className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-lg">Corporate & Family</CardTitle>
              <CardDescription>Para consultorias, holdings e multi-family offices.</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-zinc-950 dark:text-white">R$ 189</span>
                <span className="text-xs text-zinc-500 ml-1">/ mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Multi-usuários com controle de permissões</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Consolidação de múltiplos CNPJs e CPFs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Exportações contábeis avançadas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Gerente de contas dedicado</span>
                </li>
              </ul>
              <Link href="/platform">
                <Button variant="outline" className="w-full text-xs">Falar com Consultor</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 sm:p-12 text-center shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Pronto para transformar a gestão do seu patrimônio?
          </h2>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            Junte-se a investidores e gestores que utilizam a Modal Tools para controlar ativos e simplificar suas rotinas fiscais.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/platform">
              <Button size="lg" className="h-10 px-6 gap-2 font-medium">
                <span>Criar Conta Gratuita</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
