import type { LucideIcon } from "lucide-react";
import { Landmark, Building2, Receipt } from "lucide-react";

export type ToolStatus = "available" | "soon";

export interface Tool {
  slug: string;
  title: string;        // título completo da página
  menuTitle: string;    // texto curto no menu
  description: string;  // uma frase
  status: ToolStatus;
  isNew?: boolean;
}

export type CategorySlug = "financeiro" | "imobiliario" | "tributario";

export interface ToolCategory {
  slug: CategorySlug;
  title: string;
  description: string;
  icon: LucideIcon;
  tools: Tool[];
}

export const toolCategories: ToolCategory[] = [
  {
    slug: "financeiro",
    title: "Financeiro",
    description: "Planeje e compare seus investimentos.",
    icon: Landmark,
    tools: [
      { slug: "juros-compostos", title: "Calculadora de juros compostos", menuTitle: "Juros compostos", description: "Simule o crescimento do investimento com aportes mensais.", status: "soon" },
      { slug: "taxa-equivalente", title: "Conversor de taxas Selic e CDI", menuTitle: "Taxa equivalente", description: "Converta taxa anual em mensal e o inverso.", status: "soon" },
      { slug: "cdb-vs-poupanca", title: "CDB, LCI e poupança: qual rende mais", menuTitle: "CDB vs poupança", description: "Compare o rendimento líquido já com o Imposto de Renda.", status: "soon" },
      { slug: "correcao-ipca-igpm", title: "Correção por IPCA e IGP-M", menuTitle: "Correção por índice", description: "Atualize valores pela inflação acumulada.", status: "soon" },
      { slug: "independencia-financeira", title: "Calculadora de independência financeira", menuTitle: "Independência financeira", description: "Quanto acumular para viver de renda.", status: "soon" },
    ],
  },
  {
    slug: "imobiliario",
    title: "Imobiliário",
    description: "Compre, alugue e invista em imóveis.",
    icon: Building2,
    tools: [
      { slug: "financiamento-sac-price", title: "Simulador de financiamento SAC e Price", menuTitle: "Financiamento SAC e Price", description: "Compare parcelas e juros totais.", status: "soon" },
      { slug: "reajuste-de-aluguel", title: "Calculadora de reajuste de aluguel", menuTitle: "Reajuste de aluguel", description: "Reajuste pelo IGP-M ou IPCA.", status: "soon" },
      { slug: "rentabilidade-de-aluguel", title: "Rentabilidade de aluguel", menuTitle: "Rentabilidade de aluguel", description: "Yield bruto e líquido de um imóvel.", status: "soon" },
      { slug: "aluguel-vs-comprar", title: "Alugar ou comprar um imóvel", menuTitle: "Alugar ou comprar", description: "Compare os dois caminhos ao longo do tempo.", status: "soon" },
    ],
  },
  {
    slug: "tributario",
    title: "Tributário",
    description: "Impostos, folha e obrigações.",
    icon: Receipt,
    tools: [
      { slug: "salario-liquido", title: "Calculadora de salário líquido 2026", menuTitle: "Salário líquido 2026", description: "INSS e Imposto de Renda com as regras de 2026.", status: "available", isNew: true },
      { slug: "das-mei", title: "DAS do MEI e limite de faturamento", menuTitle: "DAS do MEI", description: "Valor mensal do DAS e controle do limite.", status: "soon" },
      { slug: "simples-nacional", title: "Alíquota efetiva do Simples Nacional", menuTitle: "Simples Nacional", description: "Alíquota por anexo e faixa de faturamento.", status: "soon" },
      { slug: "ferias-13-rescisao", title: "Férias, 13º e rescisão", menuTitle: "Férias, 13º e rescisão", description: "Cálculos trabalhistas mais comuns.", status: "soon" },
    ],
  },
];

export function getCategory(slug: string): ToolCategory | undefined {
  return toolCategories.find((cat) => cat.slug === slug);
}

export function getTool(
  categorySlug: string,
  toolSlug: string
): { category: ToolCategory; tool: Tool } | undefined {
  const category = getCategory(categorySlug);
  if (!category) return undefined;
  const tool = category.tools.find((t) => t.slug === toolSlug);
  if (!tool) return undefined;
  return { category, tool };
}

export function getAvailableTools(): { category: ToolCategory; tool: Tool }[] {
  const available: { category: ToolCategory; tool: Tool }[] = [];
  for (const category of toolCategories) {
    for (const tool of category.tools) {
      if (tool.status === "available") {
        available.push({ category, tool });
      }
    }
  }
  return available;
}

export function toolHref(categorySlug: string, toolSlug: string): string {
  return `/ferramentas/${categorySlug}/${toolSlug}`;
}
