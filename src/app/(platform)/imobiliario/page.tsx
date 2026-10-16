"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ImobiliarioPage() {
  const [propertyValue, setPropertyValue] = React.useState<string>("650000");
  const [monthlyRent, setMonthlyRent] = React.useState<string>("3200");
  const [adminFeePercent, setAdminFeePercent] = React.useState<string>("8");
  const [igpmRate, setIgpmRate] = React.useState<string>("4.8");

  const numProperty = parseFloat(propertyValue) || 0;
  const numRent = parseFloat(monthlyRent) || 0;
  const numFee = parseFloat(adminFeePercent) || 0;
  const numRate = parseFloat(igpmRate) || 0;

  const annualGrossRent = numRent * 12;
  const annualNetRent = annualGrossRent * (1 - numFee / 100);
  const grossYield = numProperty > 0 ? (annualGrossRent / numProperty) * 100 : 0;
  const netYield = numProperty > 0 ? (annualNetRent / numProperty) * 100 : 0;
  const paybackYears = netYield > 0 ? 100 / netYield : 0;

  const adjustedRent = numRent * (1 + numRate / 100);
  const diffRent = adjustedRent - numRent;

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
              Módulo Imobiliário
            </h1>
            <Badge className="bg-cyan-500/10 text-cyan-300 border-cyan-500/30 text-[10px]">
              Ativo
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Cálculo de Rental Yield, Cap Rate sobre ativos imobiliários e reajustes contratuais por índices inflacionários.
          </p>
        </div>

        <Link href="/hub-matematico">
          <Button variant="outline" size="sm" className="h-9 text-xs border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white">
            Conversores & Ferramentas
          </Button>
        </Link>
      </div>

      {/* Calculadora de Rental Yield & Reajuste */}
      <Card className="bg-zinc-900/40 border-zinc-800/80 shadow-xs">
        <CardHeader className="pb-4 border-b border-zinc-800/60">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Building2 className="h-4 w-4 text-cyan-400" />
                Calculadora de Rental Yield & Reajuste de Aluguel
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Avaliação de taxa de retorno anual sobre o valor de mercado e correção contratual.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px] text-zinc-400 border-zinc-800 font-mono">
              Cap Rate & Yield
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Valor de Mercado do Imóvel</label>
              <Input
                type="number"
                value={propertyValue}
                onChange={(e) => setPropertyValue(e.target.value)}
                placeholder="R$ 0,00"
                className="font-mono tabular-nums bg-zinc-950 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Aluguel Mensal Atual</label>
              <Input
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                placeholder="R$ 0,00"
                className="font-mono tabular-nums bg-zinc-950 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Taxa de Administração (%)</label>
              <Input
                type="number"
                value={adminFeePercent}
                onChange={(e) => setAdminFeePercent(e.target.value)}
                placeholder="8%"
                className="font-mono tabular-nums bg-zinc-950 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Reajuste IGP-M / IPCA 12m (%)</label>
              <Input
                type="number"
                value={igpmRate}
                onChange={(e) => setIgpmRate(e.target.value)}
                placeholder="4,8%"
                className="font-mono tabular-nums bg-zinc-950 border-zinc-800 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/70">
              <span className="text-xs text-zinc-400">Yield Bruto Anual</span>
              <div className="font-mono text-xl font-bold text-white tabular-nums mt-1">
                {grossYield.toFixed(2)}% <span className="text-xs text-zinc-500 font-normal">a.a.</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5">Sem dedução de taxas</p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/70">
              <span className="text-xs text-zinc-400">Yield Líquido Anual</span>
              <div className="font-mono text-xl font-bold text-emerald-400 tabular-nums mt-1">
                {netYield.toFixed(2)}% <span className="text-xs text-zinc-500 font-normal">a.a.</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5">Após taxa de {adminFeePercent}%</p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/70">
              <span className="text-xs text-zinc-400">Tempo de Payback</span>
              <div className="font-mono text-xl font-bold text-white tabular-nums mt-1">
                {paybackYears.toFixed(1)} <span className="text-xs text-zinc-500 font-normal">anos</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5">Retorno integral do capital</p>
            </div>

            <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5">
              <span className="text-xs text-cyan-300 font-medium">Aluguel Reajustado (+{numRate}%)</span>
              <div className="font-mono text-xl font-bold text-cyan-400 tabular-nums mt-1">
                {adjustedRent.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </div>
              <p className="text-[10px] text-zinc-400 mt-0.5">+{diffRent.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}/mês</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
