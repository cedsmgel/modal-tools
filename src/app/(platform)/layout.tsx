import * as React from "react";
import Link from "next/link";
import { Suspense } from "react";
import { UserButton } from "@clerk/nextjs";
import { Layers, Settings } from "lucide-react";

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
          {/* Logo à esquerda */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 font-bold tracking-tight text-white transition-opacity hover:opacity-90"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-zinc-950 shadow-xs">
              <Layers className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Modal Tools</span>
          </Link>

          {/* Configurações e Gerenciamento exclusivamente no ícone de perfil */}
          <div className="flex items-center">
            <Suspense fallback={<div className="h-8 w-8 rounded-full bg-zinc-800 animate-pulse" />}>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-8 w-8 rounded-full ring-1 ring-zinc-800",
                  },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="Configurações & Conta"
                    labelIcon={<Settings className="h-4 w-4" />}
                    href="/account"
                  />
                </UserButton.MenuItems>
              </UserButton>
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

