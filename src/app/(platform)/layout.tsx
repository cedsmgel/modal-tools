import Link from "next/link";
import { Suspense } from "react";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Receipt,
  Building2,
  Settings,
  Layers,
  ArrowUpRight,
  Calculator,
  ChevronDown,
  Wrench,
  Binary,
  TrendingUp,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased">
      {/* Sidebar Fixa Estilo Stripe / Linear */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md md:flex">
        {/* Marca / Topo */}
        <div className="flex h-14 items-center justify-between border-b border-zinc-800/80 px-4">
          <Link href="/dashboard" className="flex items-center gap-2.5 font-bold tracking-tight text-white hover:opacity-90 transition-opacity">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-zinc-950 shadow-xs">
              <Layers className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Modal Tools</span>
          </Link>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono text-zinc-400 border-zinc-800">
            PRO
          </Badge>
        </div>

        {/* Navegação Principal */}
        <nav className="flex-1 space-y-1 px-3 py-4 text-xs font-medium">
          <div className="px-2 pb-1.5 text-[10px] uppercase font-semibold tracking-wider text-zinc-500">
            Plataforma
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg bg-zinc-900 px-3 py-2 text-white transition-colors"
          >
            <LayoutDashboard className="h-4 w-4 text-zinc-300" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/hub-matematico"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 hover:bg-zinc-900/60 hover:text-white transition-colors"
          >
            <Calculator className="h-4 w-4 text-cyan-400" />
            <span>Hub Matemático</span>
          </Link>

          <div className="pt-4 px-2 pb-1.5 text-[10px] uppercase font-semibold tracking-wider text-zinc-500">
            Preferências
          </div>
          <Link
            href="/account"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 hover:bg-zinc-900/60 hover:text-white transition-colors"
          >
            <Settings className="h-4 w-4 text-zinc-500" />
            <span>Conta & Assinatura</span>
          </Link>
        </nav>

        {/* Rodapé da Sidebar com Clerk User & Theme */}
        <div className="border-t border-zinc-800/80 p-3 flex items-center justify-between bg-zinc-950/50">
          <div className="flex items-center gap-2.5">
            <Suspense fallback={<div className="h-7 w-7 rounded-full bg-zinc-800 animate-pulse" />}>
              <UserButton />
            </Suspense>
            <div className="flex flex-col text-xs leading-tight">
              <span className="font-medium text-zinc-200">Minha Conta</span>
              <span className="text-zinc-500 font-mono text-[10px]">Autenticado</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </aside>

      {/* Conteúdo Principal com espaçamento lateral na visualização Desktop */}
      <div className="flex flex-1 flex-col md:pl-64">
        {/* Barra Superior / Header */}
        <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="md:hidden flex items-center gap-2 font-bold text-white">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-white text-zinc-950">
                <Layers className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm">Modal Tools</span>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-xs text-zinc-500">
              <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-zinc-200 font-medium">Área Logada</span>

              {/* Dropdown "Ferramentas" Categorizado no Header */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2.5 text-xs text-zinc-300 hover:text-white hover:bg-zinc-900 gap-1.5 cursor-pointer font-medium"
                  >
                    <Wrench className="h-3 w-3 text-cyan-400" />
                    <span>Ferramentas</span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-60 p-1.5 rounded-xl bg-zinc-950 border-zinc-800 shadow-2xl">
                  {/* Matemático */}
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 px-2 py-1">
                      <Binary className="h-3 w-3" />
                      <span>Matemático</span>
                    </DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href="/hub-matematico" className="cursor-pointer text-xs rounded-lg px-2 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-900 block">
                        Hub Matemático & Conversores
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator className="bg-zinc-800/80 my-1" />

                  {/* Fiscal */}
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 px-2 py-1">
                      <Receipt className="h-3 w-3" />
                      <span>Fiscal</span>
                    </DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href="/hub-matematico" className="cursor-pointer text-xs rounded-lg px-2 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-900 block">
                        Simulador de DARF & IRPF
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator className="bg-zinc-800/80 my-1" />

                  {/* Imobiliário */}
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 px-2 py-1">
                      <Building2 className="h-3 w-3" />
                      <span>Imobiliário</span>
                    </DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href="/hub-matematico" className="cursor-pointer text-xs rounded-lg px-2 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-900 block">
                        Yield de Locação & Reajuste IGP-M
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator className="bg-zinc-800/80 my-1" />

                  {/* Financeiro */}
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 px-2 py-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>Financeiro</span>
                    </DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href="/hub-matematico" className="cursor-pointer text-xs rounded-lg px-2 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-900 block">
                        Juros Compostos & Aportes Mensais
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-xs text-zinc-400 hover:text-zinc-100 flex items-center gap-1 transition-colors">
              <span>Site Público</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <div className="md:hidden">
              <Suspense fallback={<div className="h-7 w-7 rounded-full bg-zinc-800 animate-pulse" />}>
                <UserButton />
              </Suspense>
            </div>
          </div>
        </header>

        {/* Corpo das páginas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
