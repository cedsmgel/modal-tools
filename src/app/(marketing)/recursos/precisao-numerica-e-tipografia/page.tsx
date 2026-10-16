import Link from "next/link";
import { ArrowLeft, Binary, Type, Table as TableIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Precisão Numérica & Tipografia | Recursos Modal Tools",
  description: "Padrões tipográficos com Geist Sans e Geist Mono, tabular-nums para alinhamento contábil e estratégias de precisão matemática sem erros de arredondamento.",
};

export default function PrecisaoNumericaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Voltar */}
      <Link
        href="/recursos"
        className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Voltar para Central de Recursos</span>
      </Link>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="font-mono text-[11px]">Typography & Math</Badge>
          <Badge variant="secondary" className="text-[11px]">Geist + tabular-nums</Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
          Precisão Numérica & Tipografia Contábil
        </h1>
        <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Sistemas tributários e financeiros exigem rigor absoluto tanto na apresentação visual quanto no cálculo aritmético. Na Modal Tools, combinamos a família tipográfica Geist com algarismos tabulares e representação exata de centavos para garantir legibilidade e precisão fiscal.
        </p>
      </div>

      {/* Grid de Destaques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <Card className="bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Família Tipográfica</CardDescription>
            <CardTitle className="text-lg font-bold font-mono">Geist Sans & Mono</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-zinc-600 dark:text-zinc-400">
            Desenhada para legibilidade geométrica de código, dados financeiros e interfaces densas.
          </CardContent>
        </Card>

        <Card className="bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Alinhamento Contábil</CardDescription>
            <CardTitle className="text-lg font-bold font-mono">tabular-nums</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-zinc-600 dark:text-zinc-400">
            Largura uniforme de dígitos (0 a 9) eliminando trepidação visual e alinhando centavos verticalmente.
          </CardContent>
        </Card>

        <Card className="bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Aritmética Financeira</CardDescription>
            <CardTitle className="text-lg font-bold font-mono">Zero IEEE 754 Drift</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-zinc-600 dark:text-zinc-400">
            Valores monetários representados em inteiros fracionários para anular desvios de ponto flutuante.
          </CardContent>
        </Card>
      </div>

      {/* Detalhamento */}
      <div className="space-y-10 text-sm text-zinc-700 dark:text-zinc-300">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-950 dark:text-white">1. Por que tabular-nums é indispensável</h2>
          <p className="leading-relaxed">
            Em fontes proporcionais normais, o número <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">1</code> ocupa significativamente menos espaço horizontal que o número <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">8</code>. Quando dados são exibidos em tabelas ou atualizados em tempo real, colunas desalinhadas causam fadiga visual e aumentam a taxa de erro de leitura contábil.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div>
              <p className="text-xs font-semibold text-rose-500 mb-2">Sem Tabular Nums (Proporcional - Errado em Finanças):</p>
              <div className="font-sans text-sm space-y-1 bg-white dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <div className="flex justify-between"><span>Lançamento A:</span> <span>R$ 1.111,11</span></div>
                <div className="flex justify-between"><span>Lançamento B:</span> <span>R$ 8.888,88</span></div>
                <div className="flex justify-between"><span>Lançamento C:</span> <span>R$ 2.000,00</span></div>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-500 mb-2">Com Tabular Nums (Largura Fixa - Padrão Modal Tools):</p>
              <div className="font-mono tabular-nums text-sm space-y-1 bg-white dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <div className="flex justify-between"><span>Lançamento A:</span> <span>R$ 1.111,11</span></div>
                <div className="flex justify-between"><span>Lançamento B:</span> <span>R$ 8.888,88</span></div>
                <div className="flex justify-between"><span>Lançamento C:</span> <span>R$ 2.000,00</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-950 dark:text-white">2. Configuração no Tailwind CSS e Geist Fonts</h2>
          <p className="leading-relaxed">
            As variáveis das fontes são injetadas no elemento <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">&lt;html&gt;</code> e mapeadas no CSS do Tailwind:
          </p>
          <div className="p-4 rounded-xl bg-zinc-950 text-zinc-100 font-mono text-xs overflow-x-auto border border-zinc-800">
            <pre>{`// Injeção de fontes nativas no layout raiz
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Utilização em elementos fiscais e monetários:
<span className="font-mono tabular-nums font-semibold">
  R$ 1.250.400,00
</span>`}</pre>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-950 dark:text-white">3. Tratamento de Erros Aritméticos em Ponto Flutuante</h2>
          <p className="leading-relaxed">
            O JavaScript utiliza a representação de 64 bits em conformidade com o padrão IEEE 754. Cálculos simples como <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">0.1 + 0.2</code> produzem <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">0.30000000000000004</code>, o que acarretaria divergência de centavos na apuração de DARFs da Receita Federal.
          </p>
          <div className="p-4 rounded-xl bg-zinc-950 text-zinc-100 font-mono text-xs overflow-x-auto border border-zinc-800 space-y-3">
            <div className="text-zinc-400">// Regra de Ouro da Modal Tools: Armazenamento em Inteiros (Cents)</div>
            <pre>{`function formatarMoeda(centavos: number): string {
  const reais = centavos / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(reais);
}

// R$ 1.500,50 é armazenado internamente no D1 como: 150050 (inteiro)
// Cálculos de soma e dedução ocorrem exclusivamente no domínio dos inteiros.`}</pre>
          </div>
        </section>
      </div>
    </div>
  );
}
