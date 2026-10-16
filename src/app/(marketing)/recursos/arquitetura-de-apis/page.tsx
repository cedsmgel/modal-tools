import Link from "next/link";
import { ArrowLeft, Cpu, Globe, Shield, Terminal, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Arquitetura de APIs de Borda | Recursos Modal Tools",
  description: "Especificação dos Route Handlers do Next.js, middlewares de inspeção e contratos de segurança na borda da Modal Tools.",
};

export default function ArquiteturaAPIsPage() {
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
          <Badge variant="outline" className="font-mono text-[11px]">API & Edge Runtime</Badge>
          <Badge variant="secondary" className="text-[11px]">Next.js Route Handlers</Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
          Arquitetura de APIs de Borda
        </h1>
        <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          As APIs da Modal Tools operam em arquitetura descentralizada, distribuindo a lógica de roteamento, autenticação e validação para a borda. Cada requisição é processada com latência mínima, protegida por camadas determinísticas de middleware.
        </p>
      </div>

      {/* Grid de Especificações */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <Card className="bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Motor de Execução</CardDescription>
            <CardTitle className="text-lg font-bold font-mono">App Router API</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-zinc-600 dark:text-zinc-400">
            Route Handlers com suporte completo a streaming, JSON parsing seguro e tratamento de erros.
          </CardContent>
        </Card>

        <Card className="bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Filtro de Tráfego</CardDescription>
            <CardTitle className="text-lg font-bold font-mono">Edge Middleware</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-zinc-600 dark:text-zinc-400">
            Interceptador de requisições que bloqueia acessos sem cabeçalho Authorization válido antes da API.
          </CardContent>
        </Card>

        <Card className="bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Padrão de Resposta</CardDescription>
            <CardTitle className="text-lg font-bold font-mono">JSON Estruturado</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-zinc-600 dark:text-zinc-400">
            Contratos previsíveis com status HTTP estritos (200, 201, 400, 401, 500) e mensagens padronizadas.
          </CardContent>
        </Card>
      </div>

      {/* Detalhamento */}
      <div className="space-y-10 text-sm text-zinc-700 dark:text-zinc-300">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-950 dark:text-white">1. Interceptação por Middleware de Borda</h2>
          <p className="leading-relaxed">
            O arquivo <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">src/middleware.ts</code> intercepta todas as rotas sob o caminho <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">/api/:path*</code>. Requisições sem o token esperado são rejeitadas imediatamente com código 401:
          </p>
          <div className="p-4 rounded-xl bg-zinc-950 text-zinc-100 font-mono text-xs overflow-x-auto border border-zinc-800">
            <pre>{`// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default clerkMiddleware(async (auth, request) => {
  if (request.nextUrl.pathname.startsWith('/api')) {
    await auth.protect();
  }
});

export const config = {
  matcher: ['/(api|trpc)(.*)'],
};`}</pre>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-950 dark:text-white">2. Exemplo Prático de Endpoint: Ingestão de Ativos (/api/assets)</h2>
          <p className="leading-relaxed">
            O endpoint demonstra a composição completa de segurança: autenticação no middleware, validação com Zod, e persistência estruturada:
          </p>
          <div className="p-4 rounded-xl bg-zinc-950 text-zinc-100 font-mono text-xs overflow-x-auto border border-zinc-800">
            <pre>{`// src/app/api/assets/route.ts
import { NextResponse } from "next/server";
import { AssetInputSchema } from "./schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validação estrita com Zod
    const validationResult = AssetInputSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: validationResult.error.errors.map(err => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { ticker, amount, assetType } = validationResult.data;

    // Persistência ou encaminhamento para Cloudflare D1
    return NextResponse.json(
      {
        message: "Ativo registrado com sucesso",
        asset: {
          id: crypto.randomUUID(),
          ticker,
          amount,
          assetType,
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno ao processar requisição" },
      { status: 500 }
    );
  }
}`}</pre>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-950 dark:text-white">3. Tabela de Códigos HTTP & Semântica</h2>
          <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-4 py-3 font-semibold">Status Code</th>
                  <th className="px-4 py-3 font-semibold">Significado</th>
                  <th className="px-4 py-3 font-semibold">Cenário de Aplicação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                <tr>
                  <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">200 OK / 201 Created</td>
                  <td className="px-4 py-3">Sucesso</td>
                  <td className="px-4 py-3 text-zinc-500">Operação concluída e entidade persistida no D1</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-amber-500">400 Bad Request</td>
                  <td className="px-4 py-3">Payload Inválido</td>
                  <td className="px-4 py-3 text-zinc-500">Falha de validação Zod (tipos, constraints, mass assignment)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-rose-500">401 Unauthorized</td>
                  <td className="px-4 py-3">Não Autorizado</td>
                  <td className="px-4 py-3 text-zinc-500">Ausência ou incorreção de Bearer token no middleware</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-rose-600">500 Internal Error</td>
                  <td className="px-4 py-3">Erro de Servidor</td>
                  <td className="px-4 py-3 text-zinc-500">Falha inesperada no banco ou erro de infraestrutura</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
