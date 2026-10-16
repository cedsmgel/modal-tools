import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { MarketingNavbar } from "@/components/marketing-navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans text-zinc-950 antialiased dark:bg-zinc-950 dark:text-zinc-50">
      {/* Top Banner de Infraestrutura */}
      <div className="border-b border-zinc-200/80 bg-zinc-100/50 py-2 text-center text-xs font-medium text-zinc-600 dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:text-zinc-400">
        <span className="inline-flex items-center gap-1.5">
          <Badge variant="success" className="px-1.5 py-0 text-[10px]">Cloudflare Edge</Badge>
          Infraestrutura distribuída com SQLite D1 e validação estrita Zod
        </span>
      </div>

      {/* Barra de Navegação Pública */}
      <MarketingNavbar />

      {/* Conteúdo da Landing Page */}
      <div className="flex-1">
        {children}
      </div>

      {/* Rodapé Público */}
      <footer className="mt-auto border-t border-zinc-200/80 bg-white py-12 dark:border-zinc-800/80 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Todos os sistemas operacionais • Cloudflare Edge & D1</span>
          </div>
          <p>© 2026 Modal Tools. Linear/Stripe design system com shadcn/ui.</p>
        </div>
      </footer>
    </div>
  );
}
