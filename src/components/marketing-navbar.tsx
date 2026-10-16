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
        <Link href="/dashboard">
          <Button size="sm" variant="outline" className="h-8 text-xs font-semibold border-zinc-300 dark:border-zinc-800">
            Dashboard
          </Button>
        </Link>
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
            {/* Dropdown 'Produtos' */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 transition-colors hover:text-zinc-950 focus:outline-none dark:hover:text-white cursor-pointer select-none">
                  <span>Produtos</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 p-2 shadow-xl rounded-xl">
                {/* Financeiro */}
                <DropdownMenuItem asChild>
                  <Link
                    href="/#servicos"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-base font-semibold text-zinc-900 dark:text-zinc-100"
                  >
                    <TrendingUp className="h-5 w-5 text-zinc-700 dark:text-zinc-300 shrink-0" />
                    <span>Financeiro</span>
                  </Link>
                </DropdownMenuItem>

                {/* Fiscal */}
                <DropdownMenuItem asChild>
                  <Link
                    href="/#servicos"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-base font-semibold text-zinc-900 dark:text-zinc-100"
                  >
                    <Receipt className="h-5 w-5 text-zinc-700 dark:text-zinc-300 shrink-0" />
                    <span>Fiscal</span>
                  </Link>
                </DropdownMenuItem>

                {/* Imóveis */}
                <DropdownMenuItem asChild>
                  <Link
                    href="/#servicos"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-base font-semibold text-zinc-900 dark:text-zinc-100"
                  >
                    <Building2 className="h-5 w-5 text-zinc-700 dark:text-zinc-300 shrink-0" />
                    <span>Imóveis</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Dropdown 'Recursos' */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 transition-colors hover:text-zinc-950 focus:outline-none dark:hover:text-white cursor-pointer select-none">
                  <span>Recursos</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 p-2 shadow-xl rounded-xl">
                {/* Banco */}
                <DropdownMenuItem asChild>
                  <Link
                    href="/recursos/banco-de-dados-d1"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-base font-semibold text-zinc-900 dark:text-zinc-100"
                  >
                    <Database className="h-5 w-5 text-zinc-700 dark:text-zinc-300 shrink-0" />
                    <span>Banco</span>
                  </Link>
                </DropdownMenuItem>

                {/* Segurança */}
                <DropdownMenuItem asChild>
                  <Link
                    href="/recursos/seguranca-e-validacao-zod"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-base font-semibold text-zinc-900 dark:text-zinc-100"
                  >
                    <ShieldCheck className="h-5 w-5 text-zinc-700 dark:text-zinc-300 shrink-0" />
                    <span>Segurança</span>
                  </Link>
                </DropdownMenuItem>

                {/* Autenticação */}
                <DropdownMenuItem asChild>
                  <Link
                    href="/recursos/autenticacao-e-governanca-clerk"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-base font-semibold text-zinc-900 dark:text-zinc-100"
                  >
                    <Lock className="h-5 w-5 text-zinc-700 dark:text-zinc-300 shrink-0" />
                    <span>Autenticação</span>
                  </Link>
                </DropdownMenuItem>

                {/* Tipografia */}
                <DropdownMenuItem asChild>
                  <Link
                    href="/recursos/precisao-numerica-e-tipografia"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-base font-semibold text-zinc-900 dark:text-zinc-100"
                  >
                    <Binary className="h-5 w-5 text-zinc-700 dark:text-zinc-300 shrink-0" />
                    <span>Tipografia</span>
                  </Link>
                </DropdownMenuItem>

                {/* APIs */}
                <DropdownMenuItem asChild>
                  <Link
                    href="/recursos/arquitetura-de-apis"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-base font-semibold text-zinc-900 dark:text-zinc-100"
                  >
                    <Cpu className="h-5 w-5 text-zinc-700 dark:text-zinc-300 shrink-0" />
                    <span>APIs</span>
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
