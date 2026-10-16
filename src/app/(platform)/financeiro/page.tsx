"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function FinanceiroPage() {
  const [initialCapital, setInitialCapital] = React.useState<string>("10000");
  const [monthlyContribution, setMonthlyContribution] = React.useState<string>("1500");
  const [annualRate, setAnnualRate] = React.useState<string>("12");
  const [periodYears, setPeriodYears] = React.useState<string>("5");

  const pv = parseFloat(initialCapital) || 0;
  const pmt = parseFloat(monthlyContribution) || 0;
  const annual = parseFloat(annualRate) || 0;
  const years = parseFloat(periodYears) || 0;

  const totalMonths = Math.round(years * 12);
  const monthlyRate = Math.pow(1 + annual / 100, 1 / 12) - 1;

  let futureValue = pv * Math.pow(1 + monthlyRate, totalMonths);
  if (monthlyRate > 0) {
    futureValue += pmt * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
  } else {
    futureValue += pmt * totalMonths;
  }

  const totalInvested = pv + pmt * totalMonths;
  const totalInterest = Math.max(0, futureValue - totalInvested);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Navegação Superior */}
      <div className="flex items-center justify-between border-b border-zinc-800/60 pb-6">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Voltar ao Início</span>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Módulo Financeiro
            </h1>
            <Badge className="bg-indigo-500/10 text-indigo-300 border-indigo-500/30 text-[10px]">
              Ativo
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Simulador de projeção patrimonial, análise de juros compostos e acumulação de capital com aportes periódicos.
          </p>
        </div>

        <Link href="/hub-matematico">
          <Button variant="outline" size="sm" className="h-9 text-xs border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white">
            Conversores & Ferramentas
          </Button>
        </Link>
      </div>

      {/* Calculadora de Juros Compostos & Aportes */}
      <Card className="bg-zinc-900/40 border-zinc-800/80 shadow-xs">
        <CardHeader className="pb-4 border-b border-zinc-800/60">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-400" />
                Calculadora de Juros Compostos & Aportes Recorrentes
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Projeção matemática com equivalência de taxa mensal e acumulação de fluxo financeiro.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px] text-zinc-400 border-zinc-800 font-mono">
              Equação FV
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Aporte Inicial (R$)</label>
              <Input
                type="number"
                value={initialCapital}
                onChange={(e) => setInitialCapital(e.target.value)}
                placeholder="R$ 10.000"
                className="font-mono tabular-nums bg-zinc-950 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Aporte Mensal (R$)</label>
              <Input
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                placeholder="R$ 1.500"
                className="font-mono tabular-nums bg-zinc-950 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Taxa de Juros (% a.a.)</label>
              <Input
                type="number"
                value={annualRate}
                onChange={(e) => setAnnualRate(e.target.value)}
                placeholder="12%"
                className="font-mono tabular-nums bg-zinc-950 border-zinc-800 text-white"
              />
              <span className="text-[10px] text-zinc-500 font-mono">
                Equivalente: {(monthlyRate * 100).toFixed(2)}% a.m.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Período de Investimento</label>
              <Input
                type="number"
                value={periodYears}
                onChange={(e) => setPeriodYears(e.target.value)}
                placeholder="5 anos"
                className="font-mono tabular-nums bg-zinc-950 border-zinc-800 text-white"
              />
              <span className="text-[10px] text-zinc-500 font-mono">{totalMonths} meses</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/70">
              <span className="text-xs text-zinc-400">Total Aportado pelo Investidor</span>
              <div className="font-mono text-xl font-bold text-white tabular-nums mt-1">
                {totalInvested.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5">Capital próprio investido</p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/70">
              <span className="text-xs text-zinc-400">Total em Juros Acumulados</span>
              <div className="font-mono text-xl font-bold text-emerald-400 tabular-nums mt-1">
                +{totalInterest.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5">Rendimento composto obtido</p>
            </div>

            <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/5">
              <span className="text-xs text-indigo-300 font-medium">Patrimônio Líquido Projetado</span>
              <div className="font-mono text-2xl font-bold text-indigo-400 tabular-nums mt-1">
                {futureValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </div>
              <p className="text-[10px] text-zinc-400 mt-0.5">Em {years} anos de aportes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
