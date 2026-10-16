import * as React from "react";
import Link from "next/link";
import { Suspense } from "react";
import { UserButton } from "@clerk/nextjs";
import {
  Layers,
  LayoutDashboard,
  Calculator,
  Settings,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 font-sans text-zinc-100 antialiased selection:bg-zinc-800 selection:text-white">
      {/* Barra Superior Minimalista do Sistema Logado */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo e Indicador de Ambiente do Sistema à esquerda */}
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 font-bold tracking-tight text-white transition-opacity hover:opacity-90"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-zinc-950 shadow-xs">
                <Layers className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold tracking-tight">Modal Tools</span>
            </Link>

            {/* Separador e Indicador de Ambiente */}
            <div className="hidden sm:flex items-center gap-2 border-l border-zinc-800 pl-4">
              <Badge
                variant="outline"
                className="text-[10px] text-zinc-400 border-zinc-800 bg-zinc-900/60 font-mono gap-1.5 py-0.5"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Ambiente de Produção</span>
              </Badge>
            </div>
          </div>

          {/* Navegação Interna Central do Sistema */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-zinc-400" />
              <span>Início</span>
            </Link>
            <Link
              href="/hub-matematico"
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              <Calculator className="h-3.5 w-3.5 text-cyan-400" />
              <span>Hub Matemático</span>
            </Link>
            <Link
              href="/account"
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              <Settings className="h-3.5 w-3.5 text-zinc-400" />
              <span>Configurações</span>
            </Link>
          </nav>

          {/* Ações à Direita: Tema e UserButton do Clerk com afterSignOutUrl / fallbackRedirectUrl */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Suspense fallback={<div className="h-8 w-8 rounded-full bg-zinc-800 animate-pulse" />}>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-8 w-8 rounded-full ring-1 ring-zinc-800",
                  },
                }}
              />
            </Suspense>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal do Sistema Logado */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
