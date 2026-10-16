import Link from "next/link";
import { ArrowLeft, Database, HardDrive, Cpu, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Cloudflare D1 — Banco de Dados Serverless SQLite | Recursos Modal Tools",
  description: "Especificação técnica da arquitetura do Cloudflare D1 na Modal Tools: consistência ACID, replicação global de leitura e latência ultrabaixa.",
};

export default function BancoDeDadosD1Page() {
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
          <Badge variant="outline" className="font-mono text-[11px]">Storage & SQL</Badge>
          <Badge variant="secondary" className="text-[11px]">Cloudflare Edge</Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
          Banco de Dados Distribuído: Cloudflare D1
        </h1>
        <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          O Cloudflare D1 é o primeiro banco de dados relacional SQL serverless da Cloudflare construído sobre a tecnologia SQLite. Na plataforma Modal Tools, ele é utilizado como motor de persistência para ativos, transações financeiras e registros de auditoria contábil.
        </p>
      </div>

      {/* Visão Geral & Especificações */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <Card className="bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Motor Relacional</CardDescription>
            <CardTitle className="text-lg font-bold font-mono">SQLite 3 Serverless</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-zinc-600 dark:text-zinc-400">
            Total conformidade ACID para garantir integridade contábil estrita sem inconsistências.
          </CardContent>
        </Card>

        <Card className="bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Cluster Registrado</CardDescription>
            <CardTitle className="text-lg font-bold font-mono">modal-tools-db</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-zinc-600 dark:text-zinc-400">
            Instância vinculada na região primária ENAM com replicação de leitura distribuída.
          </CardContent>
        </Card>

        <Card className="bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Desempenho Médio</CardDescription>
            <CardTitle className="text-lg font-bold font-mono">&lt; 35ms Read</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-zinc-600 dark:text-zinc-400">
            Consultas resolvidas no ponto de presença da Cloudflare mais próximo ao usuário final.
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo Detalhado */}
      <div className="space-y-10 text-sm text-zinc-700 dark:text-zinc-300">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-950 dark:text-white">1. Arquitetura de Replicação e Consistência</h2>
          <p className="leading-relaxed">
            Sistemas contábeis e fiscais exigem consistência estrita: uma transação de compra de ativo imobiliário ou dedução de imposto de renda nunca pode ser processada em duplicidade ou perdida por reconciliação eventual.
          </p>
          <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs uppercase tracking-wide">
              Topologia do Cluster:
            </p>
            <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Gravação Primária (Single Primary Coordinator):</strong> Todas as transações `INSERT`, `UPDATE` e `DELETE` são direcionadas ao coordenador mestre na região primária para serialização estrita.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Read Replicas Globais:</strong> O snapshot do banco de dados é replicado para nós de borda espalhados globalmente, permitindo consultas analíticas de portfólio com latência imperceptível.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Snapshot Automático & Point-in-Time Recovery:</strong> Backups contínuos gerados para recuperação em caso de contingência operacional.</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-950 dark:text-white">2. Identificadores e Configuração de Ambiente</h2>
          <p className="leading-relaxed">
            A tabela abaixo documenta as especificações da instância provisionada e conectada ao ecossistema da aplicação:
          </p>
          <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-4 py-3 font-semibold">Propriedade</th>
                  <th className="px-4 py-3 font-semibold">Valor Configurado</th>
                  <th className="px-4 py-3 font-semibold">Descrição</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                <tr>
                  <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">database_name</td>
                  <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400">modal-tools-db</td>
                  <td className="px-4 py-3 text-zinc-500">Nome lógico referenciado no `wrangler.jsonc`</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">database_id</td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">44e6555f-3c0e-4e8b-b376-7b91acc17b76</td>
                  <td className="px-4 py-3 text-zinc-500">UUID imutável provisionado na Cloudflare</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">primary_location_hint</td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">ENAM (Eastern North America)</td>
                  <td className="px-4 py-3 text-zinc-500">Região de coordenação primária de gravações</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">binding</td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">DB</td>
                  <td className="px-4 py-3 text-zinc-500">Variável de injeção em Workers e Route Handlers</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-950 dark:text-white">3. Padrão de Schema & Migrações</h2>
          <p className="leading-relaxed">
            As migrações são versionadas em SQL puro para máxima portabilidade e ausência de bloqueios proprietários. Abaixo está o schema representativo da entidade `assets`:
          </p>
          <div className="p-4 rounded-xl bg-zinc-950 text-zinc-100 font-mono text-xs overflow-x-auto border border-zinc-800">
            <pre>{`-- migrations/0001_init_assets.sql
CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  ticker TEXT NOT NULL,
  amount REAL NOT NULL CHECK(amount > 0),
  asset_type TEXT NOT NULL CHECK(asset_type IN ('STOCKS', 'REAL_ESTATE', 'FIXED_INCOME', 'CRYPTO')),
  acquisition_date TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_assets_user_id ON assets(user_id);
CREATE INDEX IF NOT EXISTS idx_assets_ticker ON assets(ticker);`}</pre>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-950 dark:text-white">4. Execução de Comandos com Wrangler e cf CLI</h2>
          <p className="leading-relaxed">
            Para gerenciar o banco de dados via linha de comando, utilizamos os utilitários Cloudflare:
          </p>
          <div className="p-4 rounded-xl bg-zinc-950 text-zinc-100 font-mono text-xs overflow-x-auto border border-zinc-800 space-y-2">
            <div><span className="text-zinc-500"># Executar migration em ambiente local</span></div>
            <div>npx wrangler d1 migrations apply modal-tools-db --local</div>
            <div className="pt-2"><span className="text-zinc-500"># Executar migration no cluster remoto de produção</span></div>
            <div>npx wrangler d1 migrations apply modal-tools-db --remote</div>
            <div className="pt-2"><span className="text-zinc-500"># Executar consulta ad-hoc no terminal</span></div>
            <div>npx wrangler d1 execute modal-tools-db --remote --command=&quot;SELECT count(*) FROM assets;&quot;</div>
          </div>
        </section>
      </div>
    </div>
  );
}
