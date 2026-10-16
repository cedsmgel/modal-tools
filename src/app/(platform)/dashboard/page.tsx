"use client";

import * as React from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  Wallet,
  Building2,
  Scale,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const displayName = isLoaded && user ? (user.firstName || user.username || "Investidor") : "Investidor";

  return (
    <div className="flex flex-col justify-center min-h-[calc(100vh-10rem)] max-w-6xl mx-auto space-y-10 py-4">
      {/* Cabeçalho Centralizado de Boas-vindas */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
          Olá, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">{displayName}</span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-400 leading-relaxed">
          Selecione o módulo de trabalho desejado para iniciar suas operações financeiras, apurações tributárias ou gestão de ativos.
        </p>
      </div>

      {/* Grid de Destaque com 3 Grandes Cards Interativos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. MÓDULO FINANCEIRO */}
        <Link
          href="/financeiro"
          className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 hover:border-indigo-500/50 hover:bg-zinc-900 transition-all duration-200 shadow-sm hover:shadow-indigo-500/5"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-indigo-400 group-hover:bg-indigo-950/50 group-hover:border-indigo-500/40 group-hover:scale-105 transition-all">
                <Wallet className="h-7 w-7" />
              </div>
              <Badge variant="outline" className="text-[10px] border-zinc-800 text-zinc-400 font-mono">
                Módulo 01
              </Badge>
            </div>

            <h2 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
              Módulo Financeiro
            </h2>

            <p className="mt-2.5 text-sm text-zinc-400 leading-relaxed">
              Gestão de fluxo de caixa, precificação média ponderada de ativos, rentabilidade e simulações de juros compostos.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
              Acessar Módulo
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 group-hover:bg-indigo-500 group-hover:text-white text-zinc-400 transition-all">
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </Link>

        {/* 2. MÓDULO IMOBILIÁRIO */}
        <Link
          href="/imobiliario"
          className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 hover:border-indigo-500/50 hover:bg-zinc-900 transition-all duration-200 shadow-sm hover:shadow-indigo-500/5"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-cyan-400 group-hover:bg-cyan-950/50 group-hover:border-cyan-500/40 group-hover:scale-105 transition-all">
                <Building2 className="h-7 w-7" />
              </div>
              <Badge variant="outline" className="text-[10px] border-zinc-800 text-zinc-400 font-mono">
                Módulo 02
              </Badge>
            </div>

            <h2 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
              Módulo Imobiliário
            </h2>

            <p className="mt-2.5 text-sm text-zinc-400 leading-relaxed">
              Contratos de locação, apuração de Rental Yield e Cap Rate, reajuste por IGP-M/IPCA e amortização SAC/Price.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
            <span className="text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
              Acessar Módulo
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 group-hover:bg-cyan-500 group-hover:text-white text-zinc-400 transition-all">
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </Link>

        {/* 3. MÓDULO FISCAL */}
        <Link
          href="/fiscal"
          className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 hover:border-indigo-500/50 hover:bg-zinc-900 transition-all duration-200 shadow-sm hover:shadow-indigo-500/5"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-emerald-400 group-hover:bg-emerald-950/50 group-hover:border-emerald-500/40 group-hover:scale-105 transition-all">
                <Scale className="h-7 w-7" />
              </div>
              <Badge variant="outline" className="text-[10px] border-zinc-800 text-zinc-400 font-mono">
                Módulo 03
              </Badge>
            </div>

            <h2 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
              Módulo Fiscal
            </h2>

            <p className="mt-2.5 text-sm text-zinc-400 leading-relaxed">
              Apuração de DARF 6015 em Swing Trade e Day Trade, isenção de R$ 20k em ações e compensação de prejuízos.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
              Acessar Módulo
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 group-hover:bg-emerald-500 group-hover:text-white text-zinc-400 transition-all">
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

