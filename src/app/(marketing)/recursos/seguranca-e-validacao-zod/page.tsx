import Link from "next/link";
import { ArrowLeft, ShieldCheck, CheckCircle2, AlertTriangle, FileCode2, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Validação Zod & Segurança de Borda | Recursos Modal Tools",
  description: "Especificação da camada de segurança de dados na borda da Modal Tools: schemas Zod estritos, sanitização de strings e mitigação de vulnerabilidades de injeção.",
};

export default function SegurancaValidacaoZodPage() {
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
          <Badge variant="outline" className="font-mono text-[11px]">Edge Security</Badge>
          <Badge variant="secondary" className="text-[11px]">Zod v3 Type-Safety</Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
          Segurança de Borda & Validação Estrita com Zod
        </h1>
        <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Para garantir a integridade dos dados que trafegam pela internet pública, a Modal Tools adota a estratégia de Defesa em Profundidade (*Defense-in-Depth*). Toda requisição que chega à borda é inspecionada e validada contra contratos formais antes de qualquer execução na camada de dados.
        </p>
      </div>

      {/* Grid de Pilares */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <Card className="bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Validação de Contrato</CardDescription>
            <CardTitle className="text-lg font-bold font-mono">Schema .strict()</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-zinc-600 dark:text-zinc-400">
            Rejeição sumária de campos não declarados, impedindo injeção de parâmetros espúrios e mass assignment.
          </CardContent>
        </Card>

        <Card className="bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Sanitização Ativa</CardDescription>
            <CardTitle className="text-lg font-bold font-mono">Regex & Trimming</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-zinc-600 dark:text-zinc-400">
            Tratamento de strings, conversão forçada para maiúsculas e validação de formatos padrão B3 e internacionais.
          </CardContent>
        </Card>

        <Card className="bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Rejeição Imediata</CardDescription>
            <CardTitle className="text-lg font-bold font-mono">Fail-Fast 400</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-zinc-600 dark:text-zinc-400">
            Cargas maliciosas ou malformadas são descartadas na borda, economizando recursos computacionais e de I/O.
          </CardContent>
        </Card>
      </div>

      {/* Detalhamento */}
      <div className="space-y-10 text-sm text-zinc-700 dark:text-zinc-300">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-950 dark:text-white">1. Implementação do Schema de Entrada (AssetInputSchema)</h2>
          <p className="leading-relaxed">
            Em APIs financeiras, permitir propriedades adicionais no payload é uma porta de entrada para ataques de sobreescrita de permissões (`role`, `is_admin`, `balance`). O método `.strict()` do Zod anula essa possibilidade ao emitir erro imediato caso o cliente envie chaves desconhecidas:
          </p>
          <div className="p-4 rounded-xl bg-zinc-950 text-zinc-100 font-mono text-xs overflow-x-auto border border-zinc-800">
            <pre>{`// src/app/api/assets/route.ts
import { z } from "zod";

export const AssetTypeEnum = z.enum([
  "STOCKS",
  "REAL_ESTATE",
  "FIXED_INCOME",
  "CRYPTO"
]);

export const AssetInputSchema = z.object({
  ticker: z
    .string()
    .trim()
    .min(1, "O ticker não pode estar vazio")
    .max(10, "Ticker excede o tamanho máximo suportado")
    .regex(/^[A-Z0-9.-]+$/, "Ticker deve conter apenas letras maiúsculas, números, pontos ou hífens")
    .transform((val) => val.toUpperCase()),
  amount: z
    .number({ invalid_type_error: "A quantidade deve ser um número válido" })
    .positive("A quantidade deve ser estritamente maior que zero")
    .max(100_000_000, "Valor excede o limite operacional de transação"),
  assetType: AssetTypeEnum,
}).strict(); // Bloqueia Mass Assignment`}</pre>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-950 dark:text-white">2. Ciclo de Vida da Validação de Requisições</h2>
          <p className="leading-relaxed">
            A pipeline de ingestão segue uma esteira determinística de checagens sucessivas:
          </p>
          <div className="p-5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-xs font-bold shrink-0">1</span>
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">Inspeção de Headers e Autenticação (Edge Middleware)</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">Verifica a presença de credenciais válidas. Ausência resulta em status 401 Unauthorized de imediato.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-xs font-bold shrink-0">2</span>
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">Parsing Seguro de JSON</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">O corpo da requisição é decodificado com proteção contra payloads excessivamente grandes ou malformados.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-xs font-bold shrink-0">3</span>
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">Avaliação do Schema Zod (.safeParse)</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">Em caso de erro, a API formata e devolve uma resposta estruturada de erro com código HTTP 400 e lista discriminada de violações de campo.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-xs font-bold shrink-0">4</span>
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">Encaminhamento Seguro para o D1</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">Somente dados garantidamente válidos e higienizados alcançam as instruções parametrizadas do SQLite.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-950 dark:text-white">3. Tratamento de Erros e Formato de Resposta HTTP 400</h2>
          <p className="leading-relaxed">
            As respostas de erro são uniformizadas para facilitar a exibição de alertas amigáveis no frontend sem expor detalhes internos da infraestrutura:
          </p>
          <div className="p-4 rounded-xl bg-zinc-950 text-zinc-100 font-mono text-xs overflow-x-auto border border-zinc-800">
            <pre>{`// Exemplo de resposta para payload inválido (HTTP 400 Bad Request)
{
  "error": "Dados inválidos",
  "details": [
    {
      "field": "ticker",
      "message": "Ticker deve conter apenas letras maiúsculas, números, pontos ou hífens"
    },
    {
      "field": "amount",
      "message": "A quantidade deve ser estritamente maior que zero"
    }
  ]
}`}</pre>
          </div>
        </section>
      </div>
    </div>
  );
}
