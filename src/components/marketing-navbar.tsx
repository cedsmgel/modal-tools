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
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
        <Link href="/platform">
          <Button size="sm" variant="outline" className="gap-2 text-xs sm:text-sm">
            <span>Acessar Plataforma</span>
            <ArrowRight className="h-3.5 w-3.5" />
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

          {/* Links de Navegação Pública */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {/* Dropdown flutuante 'Produtos' */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 transition-colors hover:text-zinc-950 focus:outline-none dark:hover:text-white cursor-pointer select-none">
                  <span>Produtos</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80 p-2 shadow-xl">
                <DropdownMenuLabel className="text-[11px] text-zinc-400">
                  Módulos da Plataforma
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Módulo Fiscal */}
                <DropdownMenuItem asChild>
                  <Link
                    href="/platform#tax"
                    className="flex items-start gap-3 p-2.5 cursor-pointer rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-850"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                      <Receipt className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                        <span>Módulo Fiscal</span>
                        <Badge variant="outline" className="text-[9px] px-1 py-0">IR & IRPF</Badge>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                        Apuração e retenção tributária em tempo real na borda.
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>

                {/* Módulo Imobiliário */}
                <DropdownMenuItem asChild>
                  <Link
                    href="/platform#assets"
                    className="flex items-start gap-3 p-2.5 cursor-pointer rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-850"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                        <span>Módulo Imobiliário</span>
                        <Badge variant="outline" className="text-[9px] px-1 py-0">REAL_ESTATE</Badge>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                        Gestão de imóveis, contratos de locação e fundos imobiliários.
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>

                {/* Módulo Financeiro */}
                <DropdownMenuItem asChild>
                  <Link
                    href="/platform"
                    className="flex items-start gap-3 p-2.5 cursor-pointer rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-850"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                        <span>Módulo Financeiro</span>
                        <Badge variant="outline" className="text-[9px] px-1 py-0 font-mono">tabular-nums</Badge>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                        Ações, criptoativos e renda fixa com alta precisão decimal.
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Links 'Recursos' e 'Preços' */}
            <Link
              href="/#bento"
              className="transition-colors hover:text-zinc-950 dark:hover:text-white"
            >
              Recursos
            </Link>
            <Link
              href="/#preview"
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
