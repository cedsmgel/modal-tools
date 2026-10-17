"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import {
  Layers,
  Menu,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  toolCategories,
  toolHref,
  type Tool,
} from "@/lib/tools/registry";
import { cn } from "@/lib/utils";

function AuthButtons() {
  return (
    <div className="flex items-center gap-3">
      <Show when="signed-out">
        <SignInButton mode="modal" forceRedirectUrl="/dashboard" fallbackRedirectUrl="/dashboard">
          <Button variant="ghost" size="sm" className="font-medium text-xs sm:text-sm">
            Entrar
          </Button>
        </SignInButton>
        <SignUpButton mode="modal" forceRedirectUrl="/dashboard" fallbackRedirectUrl="/dashboard">
          <Button size="sm" className="font-medium text-xs sm:text-sm shadow-xs">
            Começar grátis
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
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [expandedCategory, setExpandedCategory] = React.useState<string>("financeiro");
  const [prevPathname, setPrevPathname] = React.useState(pathname);

  // Fecha o menu mobile quando houver navegação
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsMobileOpen(false);
  }

  // Função para ordenar ferramentas: disponíveis primeiro
  const getSortedTools = (tools: Tool[]): Tool[] => {
    return [...tools].sort((a, b) => {
      if (a.status === b.status) return 0;
      return a.status === "available" ? -1 : 1;
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo à esquerda e Navegação Desktop */}
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

          {/* Navegação Desktop (a partir de lg) */}
          <nav className="hidden lg:flex items-center gap-2 text-sm font-medium">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      pathname.startsWith("/ferramentas") &&
                        "text-zinc-950 dark:text-white font-semibold"
                    )}
                  >
                    Ferramentas
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[760px] bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 shadow-xl rounded-2xl overflow-hidden">
                      {/* Grid de 3 Colunas por Categoria */}
                      <div className="grid grid-cols-3 gap-6 p-6">
                        {toolCategories.map((category) => {
                          const Icon = category.icon;
                          const isCurrentCategory = pathname.startsWith(
                            `/ferramentas/${category.slug}`
                          );
                          const sortedTools = getSortedTools(category.tools);

                          return (
                            <div key={category.slug} className="flex flex-col">
                              {/* Cabeçalho da Categoria */}
                              <Link
                                href={`/ferramentas/${category.slug}`}
                                className="group flex items-start gap-3 select-none rounded-lg p-1 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                              >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shrink-0">
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                  <p
                                    className={cn(
                                      "text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors",
                                      isCurrentCategory &&
                                        "text-purple-600 dark:text-purple-400 font-bold"
                                    )}
                                  >
                                    {category.title}
                                  </p>
                                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 leading-snug">
                                    {category.description}
                                  </p>
                                </div>
                              </Link>

                              <Separator className="my-2.5 bg-zinc-200/80 dark:border-zinc-800" />

                              {/* Lista de Ferramentas */}
                              <ul className="space-y-0.5">
                                {sortedTools.map((tool) => {
                                  const href = toolHref(category.slug, tool.slug);
                                  const isCurrentTool = pathname === href;

                                  if (tool.status === "available") {
                                    return (
                                      <li key={tool.slug}>
                                        <Link
                                          href={href}
                                          className={cn(
                                            "group flex items-center justify-between py-1.5 px-2 rounded-md text-xs font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800/60",
                                            isCurrentTool
                                              ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold"
                                              : "text-zinc-700 dark:text-zinc-300"
                                          )}
                                        >
                                          <span className="truncate">{tool.menuTitle}</span>
                                          {tool.isNew && (
                                            <Badge
                                              variant="secondary"
                                              className="text-[10px] px-1 py-0 font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
                                            >
                                              Novo
                                            </Badge>
                                          )}
                                        </Link>
                                      </li>
                                    );
                                  }

                                  return (
                                    <li key={tool.slug}>
                                      <div
                                        aria-disabled="true"
                                        className="flex items-center justify-between py-1.5 px-2 text-xs text-zinc-400 dark:text-zinc-600 select-none cursor-default"
                                      >
                                        <span className="truncate">{tool.menuTitle}</span>
                                        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                                          Em breve
                                        </span>
                                      </div>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          );
                        })}
                      </div>

                      {/* Rodapé do Painel */}
                      <div className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/50 px-6 py-3 flex items-center justify-between">
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          Ferramentas gratuitas para investidores, proprietários e contribuintes.
                        </span>
                        <Link
                          href="/ferramentas"
                          className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-1"
                        >
                          <span>Ver todas as ferramentas</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Links Estáticos Existentes */}
            <Link
              href="/recursos"
              className={cn(
                "px-3 py-1.5 text-sm font-medium transition-colors hover:text-zinc-950 dark:hover:text-white rounded-md",
                pathname.startsWith("/recursos")
                  ? "text-zinc-950 dark:text-white font-semibold"
                  : "text-zinc-600 dark:text-zinc-400"
              )}
            >
              Recursos
            </Link>

            <Link
              href="/#precos"
              className="px-3 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 transition-colors hover:text-zinc-950 dark:hover:text-white rounded-md"
            >
              Planos
            </Link>
          </nav>
        </div>

        {/* Lado Direito: ThemeToggle e Botões Auth (Desktop) + Hambúrguer (Mobile) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <div className="hidden sm:flex items-center">
            <Suspense fallback={<div className="h-8 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />}>
              <AuthButtons />
            </Suspense>
          </div>

          {/* Botão Hambúrguer Mobile (abaixo de lg) */}
          <div className="lg:hidden">
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Abrir menu"
                  className="px-2"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0 flex flex-col justify-between">
                <SheetHeader className="p-4 border-b border-zinc-200/80 dark:border-zinc-800 text-left">
                  <SheetTitle className="text-base font-semibold flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                      <Layers className="h-3.5 w-3.5" />
                    </div>
                    <span>Modal Tools</span>
                  </SheetTitle>
                </SheetHeader>

                {/* Conteúdo Rolável do Menu Mobile */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Seção Ferramentas com Grupos Expansíveis */}
                  <div>
                    <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                      Ferramentas
                    </p>
                    <div className="space-y-1.5">
                      {toolCategories.map((category) => {
                        const Icon = category.icon;
                        const isExpanded = expandedCategory === category.slug;
                        const sortedTools = getSortedTools(category.tools);

                        return (
                          <div
                            key={category.slug}
                            className="border border-zinc-200/80 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/40"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedCategory(isExpanded ? "" : category.slug)
                              }
                              className="w-full flex items-center justify-between p-3 text-left font-medium text-xs text-zinc-900 dark:text-zinc-100"
                            >
                              <div className="flex items-center gap-2.5">
                                <Icon className="h-4 w-4 text-zinc-500" />
                                <span>{category.title}</span>
                              </div>
                              <ChevronDown
                                className={cn(
                                  "h-4 w-4 text-zinc-400 transition-transform duration-200",
                                  isExpanded && "rotate-180"
                                )}
                              />
                            </button>

                            {isExpanded && (
                              <div className="p-2 pt-0 border-t border-zinc-200/60 dark:border-zinc-800/60 space-y-1 bg-white dark:bg-zinc-950">
                                {sortedTools.map((tool) => {
                                  const href = toolHref(category.slug, tool.slug);
                                  const isCurrent = pathname === href;

                                  if (tool.status === "available") {
                                    return (
                                      <Link
                                        key={tool.slug}
                                        href={href}
                                        className={cn(
                                          "flex items-center justify-between py-1.5 px-2 rounded-md text-xs font-medium transition-colors",
                                          isCurrent
                                            ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold"
                                            : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                        )}
                                      >
                                        <span>{tool.menuTitle}</span>
                                        {tool.isNew && (
                                          <Badge
                                            variant="secondary"
                                            className="text-[9px] px-1 py-0"
                                          >
                                            Novo
                                          </Badge>
                                        )}
                                      </Link>
                                    );
                                  }

                                  return (
                                    <div
                                      key={tool.slug}
                                      aria-disabled="true"
                                      className="flex items-center justify-between py-1.5 px-2 text-xs text-zinc-400 dark:text-zinc-600 select-none"
                                    >
                                      <span>{tool.menuTitle}</span>
                                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                                        Em breve
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <Link
                      href="/ferramentas"
                      className="inline-block mt-2 text-xs font-medium text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Ver todas as ferramentas →
                    </Link>
                  </div>

                  <Separator />

                  {/* Demais Páginas */}
                  <div className="space-y-1">
                    <Link
                      href="/recursos"
                      className="block py-2 px-3 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Recursos & Documentação
                    </Link>
                    <Link
                      href="/#precos"
                      className="block py-2 px-3 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Planos & Preços
                    </Link>
                  </div>
                </div>

                {/* Rodapé do Menu Mobile com Auth */}
                <div className="p-4 border-t border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
                  <Suspense fallback={<div className="h-8 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />}>
                    <AuthButtons />
                  </Suspense>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
