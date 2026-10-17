"use client";

import * as React from "react";
import Link from "next/link";
import { z } from "zod";
import {
  Calculator,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Sparkles,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  calcularSalarioLiquido,
  type SalarioLiquidoResult,
} from "@/lib/tax/salario-liquido";
import { formatBRL } from "@/lib/tax/money";

const FormSchema = z.object({
  brutoCents: z.number().int().min(0, "O salário bruto deve ser maior ou igual a zero.").max(100000000, "Valor acima do limite suportado."),
  dependentes: z.number().int().min(0, "Mínimo de 0 dependentes.").max(10, "Máximo de 10 dependentes suportados."),
  pensaoCents: z.number().int().min(0, "A pensão não pode ser negativa."),
  outrosDescontosCents: z.number().int().min(0, "Outros descontos não podem ser negativos."),
  competencia: z.string().regex(/^2026-(0[1-9]|1[0-2])$/, "Selecione uma competência válida de 2026."),
});

const MESES_2026 = [
  { value: "2026-01", label: "Janeiro / 2026" },
  { value: "2026-02", label: "Fevereiro / 2026" },
  { value: "2026-03", label: "Março / 2026" },
  { value: "2026-04", label: "Abril / 2026" },
  { value: "2026-05", label: "Maio / 2026" },
  { value: "2026-06", label: "Junho / 2026" },
  { value: "2026-07", label: "Julho / 2026" },
  { value: "2026-08", label: "Agosto / 2026" },
  { value: "2026-09", label: "Setembro / 2026" },
  { value: "2026-10", label: "Outubro / 2026" },
  { value: "2026-11", label: "Novembro / 2026" },
  { value: "2026-12", label: "Dezembro / 2026" },
];

function formatCurrencyInput(valCents: number): string {
  if (valCents === 0) return "";
  return (valCents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parseCurrencyInput(text: string): number {
  const digitsOnly = text.replace(/\D/g, "");
  if (!digitsOnly) return 0;
  return parseInt(digitsOnly, 10);
}

export function SalarioLiquidoCalculator() {
  const [brutoCents, setBrutoCents] = React.useState<number>(500000); // R$ 5.000,00 inicial
  const [dependentes, setDependentes] = React.useState<number>(0);
  const [pensaoCents, setPensaoCents] = React.useState<number>(0);
  const [outrosDescontosCents, setOutrosDescontosCents] = React.useState<number>(0);
  const [competencia, setCompetencia] = React.useState<string>("2026-01");

  // Validação Zod estrita
  const validation = FormSchema.safeParse({
    brutoCents,
    dependentes,
    pensaoCents,
    outrosDescontosCents,
    competencia,
  });

  // Cálculo ao vivo com a função pura
  const resultado: SalarioLiquidoResult = React.useMemo(() => {
    if (!validation.success) {
      return {
        sucesso: false,
        error: Object.values(validation.error.flatten().fieldErrors)[0]?.[0] || "Dados inválidos",
      };
    }

    return calcularSalarioLiquido({
      brutoCents,
      dependentes,
      pensaoAlimenticiaCents: pensaoCents,
      outrosDescontosCents,
      competencia,
    });
  }, [brutoCents, dependentes, pensaoCents, outrosDescontosCents, competencia, validation]);

  const handleBrutoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrutoCents(parseCurrencyInput(e.target.value));
  };

  const handlePensaoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPensaoCents(parseCurrencyInput(e.target.value));
  };

  const handleOutrosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOutrosDescontosCents(parseCurrencyInput(e.target.value));
  };

  return (
    <div className="space-y-12">
      {/* 2. Grid de 2 Colunas: Formulário à Esquerda, Resultado à Direita */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna Esquerda: Formulário de Entrada */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
              Dados do holerite
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Informe os valores mensais vigentes para o cálculo automático e instantâneo.
            </p>
          </div>

          <div className="space-y-5">
            {/* Salário Bruto */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="salario-bruto"
                  className="text-xs font-semibold text-zinc-900 dark:text-zinc-100"
                >
                  Salário bruto mensal
                </label>
                <span className="text-[11px] text-zinc-400">R$</span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-zinc-400 font-medium">
                  R$
                </span>
                <input
                  id="salario-bruto"
                  type="text"
                  inputMode="numeric"
                  value={formatCurrencyInput(brutoCents)}
                  onChange={handleBrutoChange}
                  placeholder="0,00"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
                />
              </div>
            </div>

            {/* Dependentes e Competência */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="dependentes"
                  className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block mb-1.5"
                >
                  Dependentes
                </label>
                <select
                  id="dependentes"
                  value={dependentes}
                  onChange={(e) => setDependentes(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-purple-600 cursor-pointer"
                >
                  {Array.from({ length: 11 }).map((_, i) => (
                    <option key={i} value={i}>
                      {i === 0 ? "Nenhum dependente" : `${i} dependente${i > 1 ? "s" : ""}`}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Dedução de R$ 189,59 por pessoa no IRRF
                </p>
              </div>

              <div>
                <label
                  htmlFor="competencia"
                  className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block mb-1.5"
                >
                  Competência de vigência
                </label>
                <select
                  id="competencia"
                  value={competencia}
                  onChange={(e) => setCompetencia(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-purple-600 cursor-pointer"
                >
                  {MESES_2026.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Regras e faixas do ano-calendário 2026
                </p>
              </div>
            </div>

            {/* Pensão Alimentícia */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="pensao-alimenticia"
                  className="text-xs font-semibold text-zinc-900 dark:text-zinc-100"
                >
                  Pensão alimentícia judicial (opcional)
                </label>
                <span className="text-[11px] text-zinc-400">Dedutível do IRRF</span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-zinc-400 font-medium">
                  R$
                </span>
                <input
                  id="pensao-alimenticia"
                  type="text"
                  inputMode="numeric"
                  value={formatCurrencyInput(pensaoCents)}
                  onChange={handlePensaoChange}
                  placeholder="0,00"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:border-purple-600 transition-all"
                />
              </div>
            </div>

            {/* Outros Descontos */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="outros-descontos"
                  className="text-xs font-semibold text-zinc-900 dark:text-zinc-100"
                >
                  Outros descontos (opcional)
                </label>
                <span className="text-[11px] text-zinc-400">VT, saúde, previdência privada</span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-zinc-400 font-medium">
                  R$
                </span>
                <input
                  id="outros-descontos"
                  type="text"
                  inputMode="numeric"
                  value={formatCurrencyInput(outrosDescontosCents)}
                  onChange={handleOutrosChange}
                  placeholder="0,00"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:border-purple-600 transition-all"
                />
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                Estes descontos reduzem o valor líquido creditado, mas não alteram as bases de INSS e IRRF.
              </p>
            </div>
          </div>

          {!validation.success && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>
                {Object.values(validation.error.flatten().fieldErrors)[0]?.[0] || "Revise os campos informados."}
              </span>
            </div>
          )}
        </div>

        {/* Coluna Direita: Resultado Fixo ao Rolar (Sticky) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-lg space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Salário líquido a receber
              </p>
              <div className="mt-2 flex items-baseline justify-between">
                <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {resultado.sucesso ? formatBRL(resultado.liquidoCents) : "R$ 0,00"}
                </p>
                {resultado.sucesso && resultado.brutoCents > 0 && (
                  <span className="text-xs font-medium text-zinc-500 tabular-nums">
                    {((resultado.liquidoCents / resultado.brutoCents) * 100).toFixed(1)}% do bruto
                  </span>
                )}
              </div>
            </div>

            <Separator className="bg-zinc-200/80 dark:bg-zinc-800" />

            {/* Detalhamento dos Descontos */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                <span>Salário bruto</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                  {resultado.sucesso ? formatBRL(resultado.brutoCents) : "R$ 0,00"}
                </span>
              </div>

              {/* INSS */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-700 dark:text-zinc-300">Desconto do INSS</span>
                  {resultado.sucesso && resultado.aliquotaEfetivaINSSBps > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 tabular-nums">
                      {(resultado.aliquotaEfetivaINSSBps / 100).toFixed(2)}%
                    </span>
                  )}
                </div>
                <span className="font-semibold text-rose-600 dark:text-rose-400 tabular-nums">
                  {resultado.sucesso && resultado.inssCents > 0
                    ? `− ${formatBRL(resultado.inssCents)}`
                    : "R$ 0,00"}
                </span>
              </div>

              {/* IRRF */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-700 dark:text-zinc-300">Imposto de Renda (IRRF)</span>
                  {resultado.sucesso && resultado.irrfCents === 0 && resultado.brutoCents > 0 && (
                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-emerald-500/10 text-emerald-500 font-semibold">
                      Isento / Zerado
                    </Badge>
                  )}
                  {resultado.sucesso && resultado.aliquotaEfetivaIRRFBps > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 tabular-nums">
                      {(resultado.aliquotaEfetivaIRRFBps / 100).toFixed(2)}%
                    </span>
                  )}
                </div>
                <span className="font-semibold text-rose-600 dark:text-rose-400 tabular-nums">
                  {resultado.sucesso && resultado.irrfCents > 0
                    ? `− ${formatBRL(resultado.irrfCents)}`
                    : "R$ 0,00"}
                </span>
              </div>

              {/* Pensão Alimentícia */}
              {resultado.sucesso && resultado.pensaoAlimenticiaCents > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-zinc-700 dark:text-zinc-300">Pensão alimentícia</span>
                  <span className="font-semibold text-rose-600 dark:text-rose-400 tabular-nums">
                    − {formatBRL(resultado.pensaoAlimenticiaCents)}
                  </span>
                </div>
              )}

              {/* Outros Descontos */}
              {resultado.sucesso && resultado.outrosDescontosCents > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-zinc-700 dark:text-zinc-300">Outros descontos</span>
                  <span className="font-semibold text-rose-600 dark:text-rose-400 tabular-nums">
                    − {formatBRL(resultado.outrosDescontosCents)}
                  </span>
                </div>
              )}

              <Separator className="bg-zinc-200/80 dark:bg-zinc-800 my-2" />

              {/* Total de Descontos */}
              <div className="flex items-center justify-between font-bold text-sm text-zinc-900 dark:text-zinc-100 pt-1">
                <span>Total de descontos</span>
                <span className="text-rose-600 dark:text-rose-400 tabular-nums">
                  {resultado.sucesso && resultado.totalDescontosCents > 0
                    ? `− ${formatBRL(resultado.totalDescontosCents)}`
                    : "R$ 0,00"}
                </span>
              </div>
            </div>

            {/* Aviso sobre dedução adotada */}
            {resultado.sucesso && resultado.brutoCents > 0 && (
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-zinc-100">
                  <Info className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span>Dedução mais favorável aplicada</span>
                </div>
                <p>
                  Foi aplicado o{" "}
                  <strong>
                    {resultado.tipoDeducaoIRRF === "legal"
                      ? "cálculo por deduções legais"
                      : "desconto simplificado mensal"}
                  </strong>{" "}
                  ({formatBRL(resultado.deducaoIRRFEfetivaCents)}), gerando a menor retenção tributária.
                </p>
                {resultado.reducaoLei15270Cents > 0 && (
                  <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ Redução especial da Lei 15.270/2025 aplicada: abatimento de{" "}
                    {formatBRL(resultado.reducaoLei15270Cents)} no imposto.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Como Calculamos (Passo a Passo da Memória de Cálculo) */}
      {resultado.sucesso && resultado.memoriaDeCalculo.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span>Como calculamos o seu salário</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Memória de cálculo detalhada com todas as bases legais, deduções aplicadas e etapas intermediárias.
            </p>
          </div>

          <div className="divide-y divide-zinc-200/80 dark:divide-zinc-800">
            {resultado.memoriaDeCalculo.map((passo) => (
              <div key={passo.passo} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 text-[10px] font-bold">
                      {passo.passo}
                    </span>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {passo.rotulo}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 pl-7 font-mono">
                    {passo.formula}
                  </p>
                  {passo.detalhes && (
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500 pl-7">
                      {passo.detalhes}
                    </p>
                  )}
                </div>

                <div className="text-right pl-7 sm:pl-0 shrink-0">
                  <span className="text-xs font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                    {formatBRL(passo.valorCents)}
                  </span>
                  <p className="text-[10px] text-zinc-400">
                    {passo.baseLegal}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Regras Usadas & Fontes Oficiais */}
      {resultado.sucesso && resultado.regrasUsadas && (
        <div className="bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span>Regras e parâmetros vigentes em 2026</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Todos os parâmetros foram auditados e conferidos em diários e portarias governamentais oficiais.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
              <p className="text-zinc-500">Salário Mínimo</p>
              <p className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1 tabular-nums">
                {formatBRL(resultado.regrasUsadas.salarioMinimoCents)}
              </p>
              <span className="text-[10px] text-zinc-400">Base da 1ª faixa</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
              <p className="text-zinc-500">Teto de Contribuição INSS</p>
              <p className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1 tabular-nums">
                {formatBRL(resultado.regrasUsadas.inssCeilingContributionCents)}
              </p>
              <span className="text-[10px] text-zinc-400">Teto salarial: R$ 8.475,55</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
              <p className="text-zinc-500">Dedução por Dependente</p>
              <p className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1 tabular-nums">
                {formatBRL(resultado.regrasUsadas.irrfDependentDeductionCents)}
              </p>
              <span className="text-[10px] text-zinc-400">Por mês no IRRF</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
              <p className="text-zinc-500">Desconto Simplificado</p>
              <p className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1 tabular-nums">
                {formatBRL(resultado.regrasUsadas.irrfSimplifiedDiscountCents)}
              </p>
              <span className="text-[10px] text-zinc-400">25% da faixa de isenção</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              Fontes oficiais consultadas:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {resultado.regrasUsadas.fontes.map((f, idx) => (
                <a
                  key={idx}
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:border-purple-500/50 transition-colors text-xs space-y-1 block group"
                >
                  <div className="flex items-center justify-between text-zinc-900 dark:text-zinc-100 font-semibold">
                    <span className="truncate">{f.autoridade}</span>
                    <ExternalLink className="h-3 w-3 text-zinc-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 shrink-0" />
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                    {f.descricao}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Perguntas Frequentes (FAQ) */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <span>Perguntas frequentes sobre o salário líquido 2026</span>
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Entenda as principais mudanças na tributação de rendimentos do trabalho.
          </p>
        </div>

        <div className="space-y-4 text-xs divide-y divide-zinc-100 dark:divide-zinc-800/80">
          <div className="pt-3 first:pt-0 space-y-1">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
              1. Por que o Imposto de Renda zera para salários brutos até R$ 5.000,00?
            </h4>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Com a promulgação da Lei nº 15.270/2025 com vigência a partir de 2026, foi criada uma redução especial de imposto de até R$ 312,89 para trabalhadores que recebem até R$ 5.000,00 mensais. Como o imposto calculado pela tabela progressiva para essa faixa é de no máximo R$ 312,89, a redução anula integralmente a retenção na fonte.
            </p>
          </div>

          <div className="pt-3 space-y-1">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
              2. O que é o desconto simplificado mensal e como ele funciona?
            </h4>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              O desconto simplificado mensal (fixado em R$ 607,20, correspondente a 25% da faixa de isenção) é uma alternativa automática às deduções legais (INSS, dependentes e pensão alimentícia). O sistema compara as duas modalidades e adota automaticamente a que proporcionar a menor retenção para o contribuinte.
            </p>
          </div>

          <div className="pt-3 space-y-1">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
              3. O que muda entre o salário bruto e o salário líquido?
            </h4>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              O salário bruto é a remuneração total registrada em contrato antes de qualquer dedução. O salário líquido é o valor final efetivamente creditado na conta bancária do colaborador após o desconto obrigatório da previdência (INSS), do imposto de renda (IRRF) e de eventuais benefícios ou decisões judiciais (como pensão e vale-transporte).
            </p>
          </div>

          <div className="pt-3 space-y-1">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
              4. A calculadora inclui férias, 13º salário ou rescisão?
            </h4>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Não. Esta ferramenta calcula estritamente o salário mensal recorrente. Verbas como 13º salário, 1/3 constitucional de férias, participação nos lucros (PLR) e rescisões possuem tabelas de tributação exclusiva ou regras próprias que serão disponibilizadas em calculadoras específicas do nosso hub.
            </p>
          </div>

          <div className="pt-3 space-y-1">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
              5. Por que o valor no meu holerite emitido pela empresa pode diferir da simulação?
            </h4>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              O holerite pode conter adicionais (como horas extras, periculosidade, insalubridade ou comissões) que elevam a base tributável, ou outros descontos específicos acordados em convenção coletiva (como vale-refeição, faltas, plano odontológico e previdência fechada).
            </p>
          </div>
        </div>
      </div>

      {/* 6. Aviso Legal Informativo */}
      <div className="p-4 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 flex items-start gap-3">
        <Info className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
        <p>
          <strong>Estimativa informativa:</strong> Esta calculadora foi desenvolvida com base na legislação federal vigente para o ano-calendário de 2026. Os resultados têm caráter meramente ilustrativo e orientativo, não substituindo a folha de pagamento oficial elaborada pelo empregador nem o parecer técnico de um contador registrado.
        </p>
      </div>

      {/* 7. Convite Discreto ao Cadastro */}
      <div className="rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-500/10 p-8 text-center space-y-4">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-600/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="max-w-md mx-auto space-y-1.5">
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            Salve seus cenários e planeje seu patrimônio
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Crie uma conta gratuita para integrar suas projeções salariais com aportes em ações, fundos imobiliários e metas financeiras.
          </p>
        </div>
        <div>
          <Link href="/sign-up">
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white shadow-xs font-semibold">
              Criar conta gratuita
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
