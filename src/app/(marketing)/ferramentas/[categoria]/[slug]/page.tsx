import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAvailableTools,
  getTool,
  toolCategories,
  toolHref,
  type Tool,
  type ToolCategory,
} from "@/lib/tools/registry";
import { rules2026 } from "@/lib/tax/rules";
import { SalarioLiquidoCalculator } from "@/components/tools/salario-liquido-calculator";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ShieldCheck } from "lucide-react";

interface ToolPageProps {
  params: Promise<{
    categoria: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return getAvailableTools().map(({ category, tool }) => ({
    categoria: category.slug,
    slug: tool.slug,
  }));
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { categoria, slug } = await params;
  const match = getTool(categoria, slug);

  if (!match || match.tool.status !== "available") {
    return {
      title: "Ferramenta não encontrada | Modal Tools",
    };
  }

  const { tool, category } = match;

  return {
    title: `${tool.title} | Modal Tools`,
    description: tool.description,
    alternates: {
      canonical: toolHref(category.slug, tool.slug),
    },
    openGraph: {
      title: `${tool.title} | Modal Tools`,
      description: tool.description,
      url: toolHref(category.slug, tool.slug),
      type: "website",
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { categoria, slug } = await params;
  const match = getTool(categoria, slug);

  // Apenas ferramentas 'available' possuem página pública ativa
  if (!match || match.tool.status !== "available") {
    notFound();
  }

  const { tool, category } = match;

  // 3 outras ferramentas tiradas do registro para recomendação
  const otherTools: { category: ToolCategory; tool: Tool }[] = [];
  for (const cat of toolCategories) {
    for (const t of cat.tools) {
      if (t.slug !== tool.slug && otherTools.length < 3) {
        otherTools.push({ category: cat, tool: t });
      }
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Início",
        item: "https://modaltools.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Ferramentas",
        item: "https://modaltools.com/ferramentas",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.title,
        item: `https://modaltools.com/ferramentas/${category.slug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: tool.title,
        item: `https://modaltools.com${toolHref(category.slug, tool.slug)}`,
      },
    ],
  };

  return (
    <div className="py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navegação Breadcrumb Superior */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <Link
            href="/ferramentas"
            className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            Ferramentas
          </Link>
          <span>/</span>
          <Link
            href={`/ferramentas/${category.slug}`}
            className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            {category.title}
          </Link>
          <span>/</span>
          <span className="text-zinc-900 dark:text-zinc-100 font-medium">
            {tool.menuTitle}
          </span>
        </div>

        {/* 1. Título e Descrição da Ferramenta */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {category.title}
            </Badge>
            {tool.isNew && (
              <Badge className="text-xs font-semibold bg-purple-600 text-white">
                Novo em 2026
              </Badge>
            )}
            <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Regras conferidas em {rules2026.verificadoEm}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            {tool.title}
          </h1>

          <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
            Descubra o valor exato a ser creditado em conta após as retenções legais de INSS e Imposto de Renda. A calculadora aplica as novas regras tributárias federais da Lei nº 15.270/2025 vigentes em 2026, com isenção real ampliada até R$ 5.000,00 e faixa gradual de transição.
          </p>
        </div>

        {/* Componente Interativo da Calculadora */}
        {slug === "salario-liquido" && <SalarioLiquidoCalculator />}

        {/* Seção 'Outras Ferramentas' */}
        <div className="border-t border-zinc-200/80 dark:border-zinc-800 pt-12 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Outras ferramentas disponíveis
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Explore mais simuladores desenvolvidos para o ecossistema Modal Tools.
              </p>
            </div>
            <Link
              href="/ferramentas"
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              <span>Ver todas</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {otherTools.map(({ category: otherCat, tool: otherTool }) => {
              const href = toolHref(otherCat.slug, otherTool.slug);
              const isAvail = otherTool.status === "available";

              if (isAvail) {
                return (
                  <Link
                    key={otherTool.slug}
                    href={href}
                    className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-purple-500/40 transition-all space-y-2 block group"
                  >
                    <Badge variant="outline" className="text-[10px]">
                      {otherCat.title}
                    </Badge>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {otherTool.title}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                      {otherTool.description}
                    </p>
                  </Link>
                );
              }

              return (
                <div
                  key={otherTool.slug}
                  className="p-4 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/20 opacity-60 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px]">
                      {otherCat.title}
                    </Badge>
                    <span className="text-[10px] text-zinc-400">Em breve</span>
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                    {otherTool.title}
                  </h4>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 line-clamp-2">
                    {otherTool.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
