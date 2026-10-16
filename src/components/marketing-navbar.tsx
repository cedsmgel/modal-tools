"use client";

import * as React from "react";
import Link from "next/link";
import { Suspense } from "react";
import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import {
  Layers,
  ChevronDown,
  Receipt,
  Building2,
  TrendingUp,
  Database,
  ShieldCheck,
  Lock,
  Binary,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function AuthButtons() {
  return (
    <div className="flex items-center gap-3">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <Button variant="ghost" size="sm" className="font-medium text-xs sm:text-sm">
            Entrar
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button size="sm" className="font-medium text-xs sm:text-sm shadow-xs">
            Cadastrar
          </Button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </div>
  );
}

export function MarketingNavbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo à esquerda */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold tracking-tight text-zinc-950 transition-opacity hover:opacity-90 dark:text-white"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-950 text-white shadow-xs dark:bg-white dark:text-zinc-950">
              <Layers className="h-4 w-4" />
            </div>
            <span className="text-base font-semibold">Modal Tools</span>
          </Link>

          {/* Links de Navegação */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {/* Dropdown 'Produtos' (Foco no Cliente / Serviços) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 transition-colors hover:text-zinc-950 focus:outline-none dark:hover:text-white cursor-pointer select-none">
                  <span>Produtos</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80 p-2 shadow-xl">
                <DropdownMenuLabel className="text-[11px] text-zinc-400">
                  Módulos de Gestão
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Módulo Financeiro */}
                <DropdownMenuItem asChild>
                  <Link
                    href="/#servicos"
                    className="flex items-start gap-3 p-2.5 cursor-pointer rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-850"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                        <span>Gestão Financeira</span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                        Controle unificado de ações, renda fixa e criptoativos.
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>

                {/* Módulo Fiscal */}
                <DropdownMenuItem asChild>
                  <Link
                    href="/#servicos"
                    className="flex items-start gap-3 p-2.5 cursor-pointer rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-850"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                      <Receipt className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                        <span>Inteligência Fiscal</span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                        Apuração automatizada de ganhos e cálculo de tributos.
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>

                {/* Módulo Imobiliário */}
                <DropdownMenuItem asChild>
                  <Link
                    href="/#servicos"
                    className="flex items-start gap-3 p-2.5 cursor-pointer rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-850"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                        <span>Gestão Imobiliária</span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                        Controle de locações, contratos e rendimentos de FIIs.
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Dropdown 'Recursos' (Documentação Técnica Discreta com Nome Próprio) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 transition-colors hover:text-zinc-950 focus:outline-none dark:hover:text-white cursor-pointer select-none">
                  <span>Recursos</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-88 p-2 shadow-xl">
                <div className="flex items-center justify-between px-2 py-1.5">
                  <DropdownMenuLabel className="p-0 text-[11px] text-zinc-400">
                    Documentação & Especificações
                  </DropdownMenuLabel>
                  <Link href="/recursos" className="text-[11px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium">
                    Ver índice →
                  </Link>
                </div>
                <DropdownMenuSeparator />

                {/* Recurso 1: D1 */}
                <DropdownMenuItem asChild>
                  <Link
                    href="/recursos/banco-de-dados-d1"
                    className="flex items-start gap-2.5 p-2 cursor-pointer rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-850"
                  >
                    <Database className="h-4 w-4 mt-0.5 text-zinc-500 shrink-0" />
                    <div>
                      <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 block">
                        Banco de Dados Distribuído (D1)
                      </span>
                      <p className="text-[11px] text-zinc-500 line-clamp-1">
                        Persistência SQLite serverless e replicação de leitura global.
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>

                {/* Recurso 2: Zod */}
                <DropdownMenuItem asChild>
                  <Link
                    href="/recursos/seguranca-e-validacao-zod"
                    className="flex items-start gap-2.5 p-2 cursor-pointer rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-850"
                  >
                    <ShieldCheck className="h-4 w-4 mt-0.5 text-zinc-500 shrink-0" />
                    <div>
                      <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 block">
                        Segurança & Validação na Borda (Zod)
                      </span>
                      <p className="text-[11px] text-zinc-500 line-clamp-1">
                        Filtros de borda, rejeição fail-fast e proteção contra mass assignment.
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>

                {/* Recurso 3: Clerk */}
                <DropdownMenuItem asChild>
                  <Link
                    href="/recursos/autenticacao-e-governanca-clerk"
                    className="flex items-start gap-2.5 p-2 cursor-pointer rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-850"
                  >
                    <Lock className="h-4 w-4 mt-0.5 text-zinc-500 shrink-0" />
                    <div>
                      <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 block">
                        Autenticação & Governança (Clerk)
                      </span>
                      <p className="text-[11px] text-zinc-500 line-clamp-1">
                        Sessões seguras com JWT, autenticação corporativa e MFA.
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>

                {/* Recurso 4: Tabular Nums */}
                <DropdownMenuItem asChild>
                  <Link
                    href="/recursos/precisao-numerica-e-tipografia"
                    className="flex items-start gap-2.5 p-2 cursor-pointer rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-850"
                  >
                    <Binary className="h-4 w-4 mt-0.5 text-zinc-500 shrink-0" />
                    <div>
                      <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 block">
                        Precisão Numérica & Tipografia
                      </span>
                      <p className="text-[11px] text-zinc-500 line-clamp-1">
                        Fontes Geist Mono e tabular-nums para cálculos fiscais exatos.
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>

                {/* Recurso 5: APIs */}
                <DropdownMenuItem asChild>
                  <Link
                    href="/recursos/arquitetura-de-apis"
                    className="flex items-start gap-2.5 p-2 cursor-pointer rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-850"
                  >
                    <Cpu className="h-4 w-4 mt-0.5 text-zinc-500 shrink-0" />
                    <div>
                      <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 block">
                        Arquitetura de APIs de Borda
                      </span>
                      <p className="text-[11px] text-zinc-500 line-clamp-1">
                        Endpoints RESTful protegidos e middlewares de interceptação.
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Link 'Preços' */}
            <Link
              href="/#precos"
              className="transition-colors hover:text-zinc-950 dark:hover:text-white"
            >
              Preços
            </Link>
          </nav>
        </div>

        {/* Lado direito: ThemeToggle e Botões Clerk */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Suspense fallback={<div className="h-8 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />}>
            <AuthButtons />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
