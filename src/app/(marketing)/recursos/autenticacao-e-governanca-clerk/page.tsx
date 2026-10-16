import Link from "next/link";
import { ArrowLeft, Lock, KeyRound, Users, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Autenticação Clerk & Governança de Acesso | Recursos Modal Tools",
  description: "Especificação da arquitetura de identidade, tokens JWT, controle de acesso baseado em funções (RBAC) e MFA com Clerk na Modal Tools.",
};

export default function AutenticacaoClerkPage() {
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
          <Badge variant="outline" className="font-mono text-[11px]">Identity & Access</Badge>
          <Badge variant="secondary" className="text-[11px]">Clerk Core 2</Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
          Autenticação & Governança Corporativa: Clerk
        </h1>
        <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          A proteção dos dados patrimoniais e fiscais dos clientes é sustentada pela infraestrutura de identidade corporativa do Clerk. O sistema elimina riscos de vazamento de credenciais através de sessões criptograficamente assinadas, MFA por hardware e controle granular de permissões.
        </p>
      </div>

      {/* Grid de Especificações */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <Card className="bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Validação de Sessão</CardDescription>
            <CardTitle className="text-lg font-bold font-mono">JWT Stateless</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-zinc-600 dark:text-zinc-400">
            Assinaturas assimétricas (RS256) verificáveis localmente no Edge sem chamadas lentas de rede.
          </CardContent>
        </Card>

        <Card className="bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Segundo Fator</CardDescription>
            <CardTitle className="text-lg font-bold font-mono">MFA & Passkeys</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-zinc-600 dark:text-zinc-400">
            Suporte nativo a autenticadores TOTP e biometria/chaves de segurança físicas FIDO2/WebAuthn.
          </CardContent>
        </Card>

        <Card className="bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Estrutura de Acesso</CardDescription>
            <CardTitle className="text-lg font-bold font-mono">Multi-Tenant RBAC</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-zinc-600 dark:text-zinc-400">
            Organizações com segregação de privilégios para Administradores, Contadores e Auditores.
          </CardContent>
        </Card>
      </div>

      {/* Seções Técnicas */}
      <div className="space-y-10 text-sm text-zinc-700 dark:text-zinc-300">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-950 dark:text-white">1. Ciclo de Vida do Token e Verificação de Borda</h2>
          <p className="leading-relaxed">
            O Clerk emite tokens JWT de curta duração (típicamente 60 segundos com renovação silenciosa em background). A verificação da sessão na borda ocorre em microssegundos:
          </p>
          <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs uppercase tracking-wide">
              Características da Segurança de Sessão:
            </p>
            <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Cookies HttpOnly & Secure:</strong> O token de sessão não é exposto a scripts JavaScript do navegador, mitigando ataques de XSS (Cross-Site Scripting).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Proteção CSRF:</strong> Cabeçalhos de SameSite configurados como `Lax` com tokens de autorização dedicados para chamadas assíncronas.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Revogação Instantânea de Sessões:</strong> O painel permite encerramento forçado de dispositivos suspeitos com efeito imediato em todo o ecossistema.</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-950 dark:text-white">2. Integração no Layout Raiz do Next.js</h2>
          <p className="leading-relaxed">
            A aplicação encapsula a árvore de componentes no provedor oficial `ClerkProvider` com tema ajustado e suporte à renderização híbrida:
          </p>
          <div className="p-4 rounded-xl bg-zinc-950 text-zinc-100 font-mono text-xs overflow-x-auto border border-zinc-800">
            <pre>{`// src/app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider dynamic>
      <html lang="pt-BR">
        <body className="font-sans antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}`}</pre>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-950 dark:text-white">3. Matriz de Perfis e Permissões (RBAC)</h2>
          <p className="leading-relaxed">
            Para escritórios de contabilidade e equipes financeiras com múltiplos colaboradores, as regras de negócio segmentam as operações:
          </p>
          <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-4 py-3 font-semibold">Papel (Role)</th>
                  <th className="px-4 py-3 font-semibold">Permissões de Leitura</th>
                  <th className="px-4 py-3 font-semibold">Permissões de Escrita</th>
                  <th className="px-4 py-3 font-semibold">Acesso Administrativo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                <tr>
                  <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">admin</td>
                  <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400">Total (Financeiro, Fiscal, Imóveis)</td>
                  <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400">Total + Configurações</td>
                  <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400">Sim (Gestão de membros e faturamento)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">accountant</td>
                  <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400">Total (Relatórios e DARFs)</td>
                  <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400">Lançamentos Fiscais e Conciliação</td>
                  <td className="px-4 py-3 text-rose-500">Não</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">auditor</td>
                  <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400">Somente Leitura (Logs & Ativos)</td>
                  <td className="px-4 py-3 text-rose-500">Bloqueado</td>
                  <td className="px-4 py-3 text-rose-500">Não</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
