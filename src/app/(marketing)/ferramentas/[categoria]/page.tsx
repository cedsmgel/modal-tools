import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  toolCategories,
  getCategory,
  toolHref,
} from "@/lib/tools/registry";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ categoria: string }>;
}

export async function generateStaticParams() {
  return toolCategories.map((cat) => ({
    categoria: cat.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { categoria } = await params;
  const category = getCategory(categoria);

  if (!category) {
    return {
      title: "Categoria não encontrada | Modal Tools",
    };
  }

  return {
    title: `Ferramentas de ${category.title} | Modal Tools`,
    description: `Simuladores e calculadoras da categoria ${category.title}: ${category.description}`,
    alternates: {
      canonical: `/ferramentas/${category.slug}`,
    },
    openGraph: {
      title: `Ferramentas de ${category.title} | Modal Tools`,
      description: category.description,
      url: `/ferramentas/${category.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categoria } = await params;
  const category = getCategory(categoria);

  if (!category) {
    notFound();
  }

  const Icon = category.icon;

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
    ],
  };

  return (
    <div className="py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Navegação de Volta */}
        <Link
          href="/ferramentas"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Todas as ferramentas</span>
        </Link>

        {/* Cabeçalho da Categoria */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shrink-0">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
              Ferramentas de {category.title}
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {category.description}
            </p>
          </div>
        </div>

        <Separator className="bg-zinc-200/80 dark:bg-zinc-800" />

        {/* Lista de Ferramentas */}
        <div className="space-y-3">
          {category.tools.map((tool) => {
            const isAvailable = tool.status === "available";
            const href = toolHref(category.slug, tool.slug);

            if (isAvailable) {
              return (
                <Link
                  key={tool.slug}
                  href={href}
                  className="group block p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all hover:border-purple-500/40 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {tool.title}
                        </h2>
                        {tool.isNew && (
                          <Badge className="text-[10px] px-1.5 py-0 font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                            Novo
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {tool.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            }

            return (
              <div
                key={tool.slug}
                aria-disabled="true"
                className="p-5 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/20 opacity-60 select-none flex items-center justify-between gap-4"
              >
                <div>
                  <h2 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                    {tool.title}
                  </h2>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                    {tool.description}
                  </p>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-medium shrink-0">
                  Em breve
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
