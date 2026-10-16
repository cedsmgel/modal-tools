import Link from "next/link";
import { Suspense } from "react";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Wallet,
  Database,
  Receipt,
  ShieldCheck,
  Settings,
  Layers,
  Search,
  Bell,
  ArrowUpRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      {/* Fixed Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-zinc-200/80 bg-white/95 backdrop-blur-md md:flex dark:border-zinc-800/80 dark:bg-zinc-900/90">
        {/* Brand */}
        <div className="flex h-14 items-center justify-between border-b border-zinc-200/80 px-4 dark:border-zinc-800/80">
          <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-zinc-950 dark:text-white">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs">
              <Layers className="h-4 w-4" />
            </div>
            <span>Modal Tools</span>
          </Link>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono">
            v2.0
          </Badge>
        </div>

        {/* Cloudflare D1 Live Tag */}
        <div className="p-3">
          <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1.5 text-xs text-emerald-700 dark:text-emerald-400">
            <div className="flex items-center gap-1.5 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>D1: modal-tools-db</span>
            </div>
            <span className="text-[10px] opacity-75">ENAM</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 px-3 py-2 text-sm font-medium">
          <Link
            href="/platform"
            className="flex items-center gap-3 rounded-lg bg-zinc-100 px-3 py-2 text-zinc-950 dark:bg-zinc-800 dark:text-white"
          >
            <LayoutDashboard className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            <span>Visão Geral</span>
          </Link>
          <Link
            href="/platform#assets"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-600 hover:bg-zinc-100/70 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-50 transition-colors"
          >
            <Wallet className="h-4 w-4" />
            <span>Ativos & Portfólio</span>
          </Link>
          <Link
            href="/platform#d1"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-600 hover:bg-zinc-100/70 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-50 transition-colors"
          >
            <Database className="h-4 w-4" />
            <span>Cloudflare D1 SQL</span>
          </Link>
          <Link
            href="/platform#tax"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-600 hover:bg-zinc-100/70 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-50 transition-colors"
          >
            <Receipt className="h-4 w-4" />
            <span>Relatórios Fiscais</span>
          </Link>
          <Link
            href="/platform#security"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-600 hover:bg-zinc-100/70 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-50 transition-colors"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Segurança & Borda</span>
          </Link>
          <Link
            href="/platform"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-600 hover:bg-zinc-100/70 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-50 transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Configurações</span>
          </Link>
        </nav>

        {/* Sidebar Footer with Clerk User & Theme */}
        <div className="border-t border-zinc-200/80 p-3 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Suspense fallback={<div className="h-7 w-7 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />}>
              <UserButton />
            </Suspense>
            <div className="flex flex-col text-xs leading-tight">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">Usuário Autenticado</span>
              <span className="text-zinc-500 font-mono text-[10px]">Clerk SSO</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </aside>

      {/* Main Content Area (offset by sidebar w-64) */}
      <div className="flex flex-1 flex-col md:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-zinc-200/80 bg-white/80 px-4 backdrop-blur-md sm:px-6 lg:px-8 dark:border-zinc-800/80 dark:bg-zinc-950/80">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1">
              <span>Home</span>
              <span>/</span>
            </Link>
            <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">App Shell • Painel Principal</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block w-64">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
              <Input
                placeholder="Buscar ticker, ativo ou transação..."
                className="h-8 pl-8 text-xs bg-zinc-50 dark:bg-zinc-900"
              />
            </div>
            <Link href="/" target="_blank">
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1 hidden sm:flex">
                <span>Landing Page</span>
                <ArrowUpRight className="h-3 w-3" />
              </Button>
            </Link>
            <div className="md:hidden">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
