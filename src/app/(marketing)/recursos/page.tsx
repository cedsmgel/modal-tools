import Link from "next/link";
import {
  Database,
  ShieldCheck,
  Lock,
  Binary,
  Cpu,
  ArrowRight,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Central de Recursos & Especificações Técnicas — Modal Tools",
  description: "Documentação técnica detalhada sobre a arquitetura de infraestrutura, segurança de borda, banco de dados e precisão numérica da Modal Tools.",
};

const recursos = [
  {
    title: "Banco de Dados Distribuído (Cloudflare D1)",
    slug: "banco-de-dados-d1",
    icon: Database,
    badge: "Armazenamento & SQL",
    description:
      "Arquitetura serverless sobre SQLite com replicação global de leitura, latência sub-35ms e conformidade estrita ACID.",
    topics: ["SQLite Serverless", "Replicação de Leitura na Borda", "Identificador UUID do Cluster", "Consistência e Backup"],
  },
  {
    title: "Segurança de Borda & Validação Zod",
    slug: "seguranca-e-validacao-zod",
    icon: ShieldCheck,
    badge: "Segurança & Validação",
    description:
      "Filtragem imediata na borda com fail-fast HTTP 400/401, sanitização de strings, constraints numéricas e bloqueio a mass assignment.",
    topics: ["Schema Estrito (.strict())", "Mitigação de Mass Assignment", "Sanitização de Tickers e Regex", "Enum Tipado de Ativos"],
  },
  {
    title: "Autenticação & Governança (Clerk)",
    slug: "autenticacao-e-governanca-clerk",
    icon: Lock,
    badge: "Identidade & Acesso",
    description:
      "Sistema corporativo de autenticação com tokens JWT, autenticação em múltiplos fatores (MFA), gestão de sessões e suporte a multi-tenancy.",
    topics: ["Tokens JWT & Sessões Seguras", "Multi-Factor Authentication (MFA)", "Multi-tenancy com Organizações", "Proteção de Rotas com middleware"],
  },
  {
    title: "Precisão Numérica & Tipografia",
    slug: "precisao-numerica-e-tipografia",
    icon: Binary,
    badge: "Engenharia Numérica",
    description:
      "Configuração das fontes Geist Sans e Geist Mono com tabular-nums para alinhamento uniforme em cálculos fiscais e tabelas contábeis.",
    topics: ["Fontes Geist Sans & Geist Mono", "Propriedade CSS tabular-nums", "Alinhamento Contábil sem Jitter", "Evitando Erros de Ponto Flutuante"],
  },
  {
    title: "Arquitetura de APIs de Borda",
    slug: "arquitetura-de-apis",
    icon: Cpu,
    badge: "APIs & Middlewares",
    description:
      "Contratos de dados RESTful, interceptação por middlewares de borda, cabeçalhos de autorização e tempos de resposta instantâneos.",
    topics: ["Next.js Route Handlers", "Middleware / Proxy de Borda", "Cabeçalhos Bearer Token", "Contratos de Request / Response"],
  },
];

export default function RecursosIndexPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-3xl mb-12">
        <Badge variant="outline" className="mb-3">Documentação Técnica</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
          Central de Recursos & Engenharia
        </h1>
        <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
          Especificações detalhadas, decisões de arquitetura e padrões técnicos que garantem a segurança, precisão e estabilidade da plataforma Modal Tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recursos.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.slug} className="flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="text-[10px]">{item.badge}</Badge>
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription className="text-xs">{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {item.topics.map((topic, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2">
                  <Link href={`/recursos/${item.slug}`}>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:underline cursor-pointer">
                      <span>Ler documentação completa</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
