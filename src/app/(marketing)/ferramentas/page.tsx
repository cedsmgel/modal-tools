import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  toolCategories,
  toolHref,
} from "@/lib/tools/registry";
import { ArrowRight, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "Ferramentas e Calculadoras Financeiras, Imobiliárias e Tributárias | Modal Tools",
  description:
    "Simuladores e calculadoras gratuitas para planejar seus investimentos, analisar financiamentos e aluguéis e apurar seus impostos com as regras vigentes.",
  alternates: {
    canonical: "/ferramentas",
  },
  openGraph: {
    title: "Central de Ferramentas e Calculadoras | Modal Tools",
    description:
      "Acesse calculadoras de salário líquido 2026, juros compostos, financiamento imobiliário e tributação.",
    url: "/ferramentas",
    type: "website",
  },
};

export default function FerramentasHubPage() {
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
    ],
  };

  return (
    <div className="py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Cabeçalho do Hub */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            <Wrench className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span>Central de ferramentas públicas</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            Ferramentas e calculadoras
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
            Simuladores práticos e auditados para decisões patrimoniais, imobiliárias e fiscais. Cálculos executados diretamente no seu navegador, sem necessidade de cadastro.
          </p>
        </div>

        {/* Lista das 3 Categorias */}
        <div className="space-y-10">
          {toolCategories.map((category) => {
            const Icon = category.icon;
            return (
              <section
                key={category.slug}
                className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 sm:p-8 shadow-xs space-y-6"
              >
                {/* Cabeçalho da Categoria */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                        {category.title}
                      </h2>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/ferramentas/${category.slug}`}
                    className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>Ver categoria {category.title}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <Separator className="bg-zinc-100 dark:bg-zinc-800" />

                {/* Lista de Ferramentas da Categoria */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {category.tools.map((tool) => {
                    const isAvailable = tool.status === "available";
                    const href = toolHref(category.slug, tool.slug);

                    if (isAvailable) {
                      return (
                        <Link
                          key={tool.slug}
                          href={href}
                          className="group p-4 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 transition-all flex flex-col justify-between space-y-2 hover:border-purple-500/40"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                              {tool.title}
                            </span>
                            {tool.isNew && (
                              <Badge className="text-[10px] px-1.5 py-0 font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                                Novo
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            {tool.description}
                          </p>
                          <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 inline-flex items-center gap-1 pt-1">
                            Acessar calculadora →
                          </span>
                        </Link>
                      );
                    }

                    return (
                      <div
                        key={tool.slug}
                        aria-disabled="true"
                        className="p-4 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800/60 bg-transparent flex flex-col justify-between space-y-2 select-none opacity-60"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                            {tool.title}
                          </span>
                          <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
                            Em breve
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
