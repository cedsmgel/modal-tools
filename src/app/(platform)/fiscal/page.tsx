"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Receipt } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function FiscalPage() {
  const [salesTotal, setSalesTotal] = React.useState<string>("24500");
  const [profit, setProfit] = React.useState<string>("3200");
  const [accumulatedLoss, setAccumulatedLoss] = React.useState<string>("500");
  const [operationType, setOperationType] = React.useState<"swing" | "day" | "fii">("swing");

  const numSales = parseFloat(salesTotal) || 0;
  const numProfit = parseFloat(profit) || 0;
  const numLoss = parseFloat(accumulatedLoss) || 0;

  const netTaxable = Math.max(0, numProfit - numLoss);
  let taxRate = 0.15;
  let isExempt = false;

  if (operationType === "swing") {
    taxRate = 0.15;
    if (numSales <= 20000 && numProfit > 0) {
      isExempt = true;
    }
  } else if (operationType === "day") {
    taxRate = 0.20;
    isExempt = false;
  } else if (operationType === "fii") {
    taxRate = 0.20;
    isExempt = false;
  }

  const taxDue = isExempt ? 0 : netTaxable * taxRate;

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
              Módulo Fiscal
            </h1>
            <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30 text-[10px]">
              Ativo
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Apuração automatizada de imposto de renda sobre ganhos de capital em renda variável e emissão de DARF.
          </p>
        </div>

        <Link href="/hub-matematico">
          <Button variant="outline" size="sm" className="h-9 text-xs border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white">
            Conversores & Ferramentas
          </Button>
        </Link>
      </div>

      {/* Calculadora Fiscal & DARF */}
      <Card className="bg-zinc-900/40 border-zinc-800/80 shadow-xs">
        <CardHeader className="pb-4 border-b border-zinc-800/60">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Receipt className="h-4 w-4 text-emerald-400" />
                Simulador Fiscal & Apuração de DARF 6015
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Cálculo de alíquotas com compensação de perdas acumuladas em meses anteriores.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30 font-mono">
              Código DARF 6015
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => setOperationType("swing")}
              className={`p-3 rounded-xl border text-left transition-all ${
                operationType === "swing"
                  ? "bg-zinc-800 text-white border-zinc-600 shadow-xs"
                  : "bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:text-white"
              }`}
            >
              <div className="text-xs font-semibold">Swing Trade (Ações)</div>
              <div className="text-[11px] text-zinc-500 mt-1 font-mono">Alíquota 15% • Isenção R$ 20k</div>
            </button>
            <button
              type="button"
              onClick={() => setOperationType("day")}
              className={`p-3 rounded-xl border text-left transition-all ${
                operationType === "day"
                  ? "bg-zinc-800 text-white border-zinc-600 shadow-xs"
                  : "bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:text-white"
              }`}
            >
              <div className="text-xs font-semibold">Day Trade</div>
              <div className="text-[11px] text-zinc-500 mt-1 font-mono">Alíquota 20% • Sem isenção</div>
            </button>
            <button
              type="button"
              onClick={() => setOperationType("fii")}
              className={`p-3 rounded-xl border text-left transition-all ${
                operationType === "fii"
                  ? "bg-zinc-800 text-white border-zinc-600 shadow-xs"
                  : "bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:text-white"
              }`}
            >
              <div className="text-xs font-semibold">Fundos Imobiliários (FII)</div>
              <div className="text-[11px] text-zinc-500 mt-1 font-mono">Alíquota 20% • Ganho de capital</div>
            </button>
            <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-950/40 text-left">
              <div className="text-xs font-semibold text-zinc-300">Vencimento</div>
              <div className="text-[11px] text-zinc-400 mt-1">Último dia útil do mês subsequente</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Volume Total de Vendas (Mês)</label>
              <Input
                type="number"
                value={salesTotal}
                onChange={(e) => setSalesTotal(e.target.value)}
                placeholder="R$ 0,00"
                className="font-mono tabular-nums bg-zinc-950 border-zinc-800 text-white"
              />
              <span className="text-[10px] text-zinc-500">Determina isenção de R$ 20k em Swing Trade</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Lucro Líquido Apurado (R$)</label>
              <Input
                type="number"
                value={profit}
                onChange={(e) => setProfit(e.target.value)}
                placeholder="R$ 0,00"
                className="font-mono tabular-nums bg-zinc-950 border-zinc-800 text-white"
              />
              <span className="text-[10px] text-zinc-500">Resultado positivo apurado</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Prejuízo Anterior Acumulado (R$)</label>
              <Input
                type="number"
                value={accumulatedLoss}
                onChange={(e) => setAccumulatedLoss(e.target.value)}
                placeholder="R$ 0,00"
                className="font-mono tabular-nums bg-zinc-950 border-zinc-800 text-white"
              />
              <span className="text-[10px] text-zinc-500">Compensação da mesma classe</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/70">
              <span className="text-xs text-zinc-400">Base de Cálculo Tributável</span>
              <div className="font-mono text-xl font-bold text-white tabular-nums mt-1">
                {netTaxable.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5">Lucro após compensação de perdas</p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/70">
              <span className="text-xs text-zinc-400">Enquadramento Fiscal</span>
              <div className="font-mono text-xl font-bold text-white tabular-nums mt-1">
                {isExempt ? (
                  <span className="text-emerald-400">Isento (Vendas ≤ R$ 20k)</span>
                ) : (
                  <span className="text-zinc-200">Tributável ({(taxRate * 100).toFixed(0)}%)</span>
                )}
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5">Regra Receita Federal</p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
              <span className="text-xs text-emerald-300 font-medium">Imposto Devido (DARF a Pagar)</span>
              <div className="font-mono text-2xl font-bold text-emerald-400 tabular-nums mt-1">
                {taxDue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </div>
              <p className="text-[10px] text-zinc-400 mt-0.5">Dispensado se valor &lt; R$ 10,00</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
