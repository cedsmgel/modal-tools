"use client";

import * as React from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  Wallet,
  Building2,
  Scale,
  ArrowUpRight,
} from "lucide-react";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const displayName = isLoaded && user ? (user.firstName || user.username || "Investidor") : "Investidor";

  return (
    <div className="flex flex-col justify-center min-h-[calc(100vh-10rem)] max-w-6xl mx-auto space-y-12 py-6">
      {/* Cabeçalho Centralizado de Boas-vindas */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
          Olá, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">{displayName}</span>
        </h1>

        <p className="max-w-xl mx-auto text-sm sm:text-base text-zinc-400 leading-relaxed">
          Selecione o módulo para iniciar suas operações.
        </p>
      </div>

      {/* Grid com Ícones Grandes, Título Grande, Seta e Mini Descrição */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. FINANCEIRO */}
        <Link
          href="/financeiro"
          className="group relative flex flex-col justify-between rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-8 sm:p-10 hover:border-indigo-500/50 hover:bg-zinc-900/80 transition-all duration-300 shadow-sm hover:shadow-indigo-500/5"
        >
          <div className="space-y-6">
            {/* Topo do Card: Ícone Grande + Seta */}
            <div className="flex items-start justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-all duration-300">
                <Wallet className="h-9 w-9" />
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:border-indigo-500/40 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                <ArrowUpRight className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            {/* Conteúdo: Título Grande e Mini Descrição */}
            <div className="space-y-2 pt-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                Financeiro
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Juros compostos, fluxo de caixa e aportes recorrentes.
              </p>
            </div>
          </div>
        </Link>

        {/* 2. IMOBILIÁRIO */}
        <Link
          href="/imobiliario"
          className="group relative flex flex-col justify-between rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-8 sm:p-10 hover:border-cyan-500/50 hover:bg-zinc-900/80 transition-all duration-300 shadow-sm hover:shadow-cyan-500/5"
        >
          <div className="space-y-6">
            {/* Topo do Card: Ícone Grande + Seta */}
            <div className="flex items-start justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 transition-all duration-300">
                <Building2 className="h-9 w-9" />
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:border-cyan-500/40 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300">
                <ArrowUpRight className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            {/* Conteúdo: Título Grande e Mini Descrição */}
            <div className="space-y-2 pt-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                Imobiliário
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Rental yield, cap rate e reajustes por IGP-M ou IPCA.
              </p>
            </div>
          </div>
        </Link>

        {/* 3. FISCAL */}
        <Link
          href="/fiscal"
          className="group relative flex flex-col justify-between rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-8 sm:p-10 hover:border-emerald-500/50 hover:bg-zinc-900/80 transition-all duration-300 shadow-sm hover:shadow-emerald-500/5"
        >
          <div className="space-y-6">
            {/* Topo do Card: Ícone Grande + Seta */}
            <div className="flex items-start justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 group-hover:text-emerald-300 transition-all duration-300">
                <Scale className="h-9 w-9" />
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:border-emerald-500/40 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                <ArrowUpRight className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            {/* Conteúdo: Título Grande e Mini Descrição */}
            <div className="space-y-2 pt-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                Fiscal
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                DARF 6015, isenção R$ 20k e compensação de prejuízos.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

