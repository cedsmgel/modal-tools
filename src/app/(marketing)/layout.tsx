import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { MarketingNavbar } from "@/components/marketing-navbar";
import { toolCategories, getAvailableTools, toolHref } from "@/lib/tools/registry";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans text-zinc-950 antialiased dark:bg-zinc-950 dark:text-zinc-50">
      {/* Top Banner Amigável ao Cliente */}
      <div className="border-b border-zinc-200/80 bg-zinc-100/50 py-2 text-center text-xs font-medium text-zinc-600 dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:text-zinc-400">
        <span className="inline-flex items-center gap-2">
          <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">Novidade</Badge>
          <span>Conheça a plataforma completa de Gestão Financeira, Imobiliária e Fiscal.</span>
          <Link href="/#precos" className="underline underline-offset-2 hover:text-zinc-950 dark:hover:text-white transition-colors">
            Ver planos
          </Link>
        </span>
      </div>

      {/* Barra de Navegação Pública */}
      <MarketingNavbar />

      {/* Conteúdo Principal */}
      <div className="flex-1">
        {children}
      </div>

      {/* Rodapé Público com Links para Documentação Técnica */}
      <footer className="mt-auto border-t border-zinc-200/80 bg-white py-12 dark:border-zinc-800/80 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-xs">
            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Ferramentas</h4>
              <ul className="space-y-2 text-zinc-500">
                {toolCategories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/ferramentas/${cat.slug}`}
                      className="hover:text-zinc-900 dark:hover:text-zinc-100 font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      {cat.title}
                    </Link>
                  </li>
                ))}
                {getAvailableTools().map(({ category, tool }) => (
                  <li key={`${category.slug}-${tool.slug}`}>
                    <Link
                      href={toolHref(category.slug, tool.slug)}
                      className="hover:text-zinc-900 dark:hover:text-zinc-100"
                    >
                      {tool.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Recursos & Docs</h4>
              <ul className="space-y-2 text-zinc-500">
                <li><Link href="/recursos" className="hover:text-zinc-900 dark:hover:text-zinc-100">Central de Recursos</Link></li>
                <li><Link href="/recursos/banco-de-dados-d1" className="hover:text-zinc-900 dark:hover:text-zinc-100">Banco de Dados D1</Link></li>
                <li><Link href="/recursos/seguranca-e-validacao-zod" className="hover:text-zinc-900 dark:hover:text-zinc-100">Segurança & Validação Zod</Link></li>
                <li><Link href="/recursos/autenticacao-e-governanca-clerk" className="hover:text-zinc-900 dark:hover:text-zinc-100">Autenticação Clerk</Link></li>
                <li><Link href="/recursos/precisao-numerica-e-tipografia" className="hover:text-zinc-900 dark:hover:text-zinc-100">Precisão Numérica Geist</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Empresa</h4>
              <ul className="space-y-2 text-zinc-500">
                <li><Link href="/#precos" className="hover:text-zinc-900 dark:hover:text-zinc-100">Planos & Preços</Link></li>
                <li><a href="mailto:contato@modaltools.com" className="hover:text-zinc-900 dark:hover:text-zinc-100">Suporte ao Cliente</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Status</h4>
              <div className="flex items-center gap-2 text-zinc-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Sistemas 100% operacionais</span>
              </div>
              <p className="mt-2 text-zinc-400">Proteção de dados com criptografia ativa em repouso e em trânsito.</p>
            </div>
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <p>© 2026 Modal Tools. Todos os direitos reservados.</p>
            <p>Privacidade • Termos de Uso • Conformidade Regulatória</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
