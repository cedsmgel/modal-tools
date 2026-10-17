import { divRoundHalfUp, formatBRL } from "./money";
import { getRules, type TaxRules } from "./rules";

export interface PassoMemoria {
  passo: number;
  rotulo: string;
  formula: string;
  valorCents: number;
  baseLegal: string;
  detalhes?: string;
}

export interface SalarioLiquidoInputs {
  brutoCents: number;
  dependentes?: number;
  pensaoAlimenticiaCents?: number;
  outrosDescontosCents?: number;
  competencia?: string;
  inssOverrideCents?: number; // Para testes unitários com INSS parametrizado externamente
}

export type SalarioLiquidoResult =
  | {
      sucesso: true;
      competencia: string;
      brutoCents: number;
      inssCents: number;
      aliquotaEfetivaINSSBps: number;
      deducoesLegaisTotalCents: number;
      descontoSimplificadoCents: number;
      tipoDeducaoIRRF: "legal" | "simplificada";
      deducaoIRRFEfetivaCents: number;
      baseIRRFCents: number;
      impostoTabelaCents: number;
      aliquotaNominalIRRFBps: number;
      parcelaDeduzirIRRFCents: number;
      reducaoLei15270Cents: number;
      irrfCents: number;
      aliquotaEfetivaIRRFBps: number;
      pensaoAlimenticiaCents: number;
      outrosDescontosCents: number;
      totalDescontosCents: number;
      liquidoCents: number;
      percentualDescontadoBps: number;
      memoriaDeCalculo: PassoMemoria[];
      regrasUsadas: TaxRules;
    }
  | {
      sucesso: false;
      error: string;
    };

/**
 * Calcula o INSS progressivo sobre o salário bruto conforme as faixas da competência.
 */
function calcularINSS(
  brutoCents: number,
  rules: TaxRules
): { inssCents: number; memoriaPassos: string[] } {
  if (brutoCents <= 0) {
    return { inssCents: 0, memoriaPassos: [] };
  }

  const tetoFaixaFinal = rules.inssBrackets[rules.inssBrackets.length - 1].limitCents;
  if (brutoCents >= tetoFaixaFinal) {
    return {
      inssCents: rules.inssCeilingContributionCents,
      memoriaPassos: [
        `Salário bruto (${formatBRL(brutoCents)}) atinge ou excede o teto do RGPS (${formatBRL(tetoFaixaFinal)}): contribuição fixada no teto de ${formatBRL(rules.inssCeilingContributionCents)}`,
      ],
    };
  }

  let totalINSSCents = 0;
  let limiteInferior = 0;
  const passos: string[] = [];

  for (let i = 0; i < rules.inssBrackets.length; i++) {
    const bracket = rules.inssBrackets[i];
    if (brutoCents > limiteInferior) {
      const baseFaixa = Math.min(brutoCents, bracket.limitCents) - limiteInferior;
      const parcelaFaixa = divRoundHalfUp(baseFaixa * bracket.rateBps, 10000);
      totalINSSCents += parcelaFaixa;

      passos.push(
        `Faixa ${i + 1} (${(bracket.rateBps / 100).toFixed(1)}% sobre ${formatBRL(baseFaixa)}): ${formatBRL(parcelaFaixa)}`
      );
    }
    limiteInferior = bracket.limitCents;
    if (brutoCents <= bracket.limitCents) break;
  }

  return { inssCents: totalINSSCents, memoriaPassos: passos };
}

/**
 * Função pura de cálculo do salário líquido.
 * Não depende de React, DOM ou chamadas de API externas.
 */
export function calcularSalarioLiquido(
  inputs: SalarioLiquidoInputs
): SalarioLiquidoResult {
  const competencia = inputs.competencia || "2026-01";
  const rulesResult = getRules(competencia);

  if (!rulesResult.success) {
    return {
      sucesso: false,
      error: rulesResult.error,
    };
  }

  const rules = rulesResult.rules;
  const brutoCents = Math.max(0, Math.round(inputs.brutoCents || 0));
  const dependentes = Math.max(0, Math.floor(inputs.dependentes || 0));
  const pensaoCents = Math.max(0, Math.round(inputs.pensaoAlimenticiaCents || 0));
  const outrosDescontosCents = Math.max(0, Math.round(inputs.outrosDescontosCents || 0));

  const memoria: PassoMemoria[] = [];
  let step = 1;

  // 1. Salário Bruto
  memoria.push({
    passo: step++,
    rotulo: "Salário bruto",
    formula: "Valor inicial informado",
    valorCents: brutoCents,
    baseLegal: "Contrato de trabalho / CLT",
  });

  if (brutoCents === 0) {
    return {
      sucesso: true,
      competencia,
      brutoCents: 0,
      inssCents: 0,
      aliquotaEfetivaINSSBps: 0,
      deducoesLegaisTotalCents: 0,
      descontoSimplificadoCents: 0,
      tipoDeducaoIRRF: "simplificada",
      deducaoIRRFEfetivaCents: 0,
      baseIRRFCents: 0,
      impostoTabelaCents: 0,
      aliquotaNominalIRRFBps: 0,
      parcelaDeduzirIRRFCents: 0,
      reducaoLei15270Cents: 0,
      irrfCents: 0,
      aliquotaEfetivaIRRFBps: 0,
      pensaoAlimenticiaCents: 0,
      outrosDescontosCents: 0,
      totalDescontosCents: 0,
      liquidoCents: 0,
      percentualDescontadoBps: 0,
      memoriaDeCalculo: memoria,
      regrasUsadas: rules,
    };
  }

  // 2. INSS
  let inssCents = 0;
  let inssDetalhes = "";
  if (inputs.inssOverrideCents !== undefined) {
    inssCents = inputs.inssOverrideCents;
    inssDetalhes = "Valor de INSS informado diretamente para simulação";
  } else {
    const calcINSS = calcularINSS(brutoCents, rules);
    inssCents = calcINSS.inssCents;
    inssDetalhes = calcINSS.memoriaPassos.join(" | ");
  }

  const aliquotaEfetivaINSSBps =
    brutoCents > 0 ? divRoundHalfUp(inssCents * 10000, brutoCents) : 0;

  memoria.push({
    passo: step++,
    rotulo: "Contribuição previdenciária (INSS)",
    formula: "Cálculo progressivo por faixas salariais",
    valorCents: inssCents,
    baseLegal: "Portaria Interministerial MPS/MF nº 13/2026",
    detalhes: inssDetalhes,
  });

  // 3. Deduções do IRRF
  const deducaoDependentesCents = dependentes * rules.irrfDependentDeductionCents;
  const deducoesLegaisTotalCents = inssCents + deducaoDependentesCents + pensaoCents;
  const descontoSimplificadoCents = rules.irrfSimplifiedDiscountCents;

  const tipoDeducaoIRRF =
    deducoesLegaisTotalCents >= descontoSimplificadoCents ? "legal" : "simplificada";
  const deducaoIRRFEfetivaCents =
    tipoDeducaoIRRF === "legal" ? deducoesLegaisTotalCents : descontoSimplificadoCents;

  memoria.push({
    passo: step++,
    rotulo: "Comparativo de deduções do IRRF",
    formula:
      tipoDeducaoIRRF === "legal"
        ? `Deduções legais (${formatBRL(deducoesLegaisTotalCents)}) superam o desconto simplificado (${formatBRL(descontoSimplificadoCents)})`
        : `Desconto simplificado mensal (${formatBRL(descontoSimplificadoCents)}) é mais vantajoso que deduções legais (${formatBRL(deducoesLegaisTotalCents)})`,
    valorCents: deducaoIRRFEfetivaCents,
    baseLegal: "Lei nº 14.663/2023 e Instrução Normativa RFB",
    detalhes: `Deduções legais: INSS (${formatBRL(inssCents)}) + Dependentes (${dependentes} × ${formatBRL(rules.irrfDependentDeductionCents)} = ${formatBRL(deducaoDependentesCents)}) + Pensão (${formatBRL(pensaoCents)})`,
  });

  // 4. Base de cálculo do IRRF
  const baseIRRFCents = Math.max(0, brutoCents - deducaoIRRFEfetivaCents);

  memoria.push({
    passo: step++,
    rotulo: "Base de cálculo do IRRF",
    formula: `Salário bruto (${formatBRL(brutoCents)}) − Dedução efetiva (${formatBRL(deducaoIRRFEfetivaCents)})`,
    valorCents: baseIRRFCents,
    baseLegal: "Art. 4º da Lei nº 9.250/1995",
  });

  // 5. Imposto apurado pela tabela progressiva mensal
  let aliquotaNominalIRRFBps = 0;
  let parcelaDeduzirIRRFCents = 0;
  let impostoTabelaCents = 0;

  for (const bracket of rules.irrfBrackets) {
    if (baseIRRFCents <= bracket.limitCents) {
      aliquotaNominalIRRFBps = bracket.rateBps;
      parcelaDeduzirIRRFCents = bracket.deductionCents;
      break;
    }
  }

  if (aliquotaNominalIRRFBps > 0) {
    const impostoBruto = divRoundHalfUp(baseIRRFCents * aliquotaNominalIRRFBps, 10000);
    impostoTabelaCents = Math.max(0, impostoBruto - parcelaDeduzirIRRFCents);
  }

  memoria.push({
    passo: step++,
    rotulo: "Imposto pela tabela progressiva",
    formula:
      aliquotaNominalIRRFBps > 0
        ? `(${formatBRL(baseIRRFCents)} × ${(aliquotaNominalIRRFBps / 100).toFixed(1)}%) − ${formatBRL(parcelaDeduzirIRRFCents)}`
        : "Base dentro da faixa de isenção",
    valorCents: impostoTabelaCents,
    baseLegal: "Tabela Mensal do Imposto de Renda Retido na Fonte (IRRF)",
  });

  // 6. Redução da Lei 15.270/2025 (vigência 2026)
  let reducaoLei15270Cents = 0;
  let formulaReducao = "Sem redução aplicável (rendimento acima do teto de transição)";

  if (brutoCents <= rules.law15270.zeroTaxThresholdCents) {
    // Até R$ 5.000: redução de até R$ 312,89 (zera o imposto)
    reducaoLei15270Cents = Math.min(impostoTabelaCents, rules.law15270.zeroTaxMaxReductionCents);
    formulaReducao = `Rendimento até ${formatBRL(rules.law15270.zeroTaxThresholdCents)}: redução de até ${formatBRL(rules.law15270.zeroTaxMaxReductionCents)} (imposto zerado)`;
  } else if (brutoCents <= rules.law15270.phaseOutMaxThresholdCents) {
    // De R$ 5.000,01 a R$ 7.350,00: redução = 978,62 - (0,133145 * rendimento)
    const parcelaMultiplicador = divRoundHalfUp(
      brutoCents * rules.law15270.reductionMultiplierPpm,
      1000000
    );
    const reducaoCalculada = Math.max(0, rules.law15270.baseReductionConstantCents - parcelaMultiplicador);
    reducaoLei15270Cents = Math.min(impostoTabelaCents, reducaoCalculada);
    formulaReducao = `Fase de transição: ${formatBRL(rules.law15270.baseReductionConstantCents)} − (0,133145 × ${formatBRL(brutoCents)})`;
  }

  memoria.push({
    passo: step++,
    rotulo: "Redução de IRPF (Lei 15.270/2025)",
    formula: formulaReducao,
    valorCents: reducaoLei15270Cents,
    baseLegal: "Lei Federal nº 15.270/2025",
  });

  // 7. IRRF Efetivo
  const irrfCents = Math.max(0, impostoTabelaCents - reducaoLei15270Cents);
  const aliquotaEfetivaIRRFBps =
    brutoCents > 0 ? divRoundHalfUp(irrfCents * 10000, brutoCents) : 0;

  memoria.push({
    passo: step++,
    rotulo: "Imposto de Renda Retido na Fonte (IRRF final)",
    formula: `Imposto da tabela (${formatBRL(impostoTabelaCents)}) − Redução Lei 15.270 (${formatBRL(reducaoLei15270Cents)})`,
    valorCents: irrfCents,
    baseLegal: "Resultado líquido retido em folha",
  });

  // 8. Demais descontos e Salário Líquido
  const totalDescontosCents = inssCents + irrfCents + pensaoCents + outrosDescontosCents;
  const liquidoCents = brutoCents - totalDescontosCents;
  const percentualDescontadoBps =
    brutoCents > 0 ? divRoundHalfUp(totalDescontosCents * 10000, brutoCents) : 0;

  if (pensaoCents > 0) {
    memoria.push({
      passo: step++,
      rotulo: "Pensão alimentícia judicial",
      formula: "Desconto integral em folha",
      valorCents: pensaoCents,
      baseLegal: "Determinação judicial de alimentos",
    });
  }

  if (outrosDescontosCents > 0) {
    memoria.push({
      passo: step++,
      rotulo: "Outros descontos (VT, plano de saúde, coparticipações)",
      formula: "Redução do salário líquido sem impacto na base dos tributos",
      valorCents: outrosDescontosCents,
      baseLegal: "Acordo de trabalho / Benefícios corporativos",
    });
  }

  memoria.push({
    passo: step++,
    rotulo: "Salário líquido a receber",
    formula: `Bruto (${formatBRL(brutoCents)}) − Total de descontos (${formatBRL(totalDescontosCents)})`,
    valorCents: liquidoCents,
    baseLegal: "Valor líquido creditado em conta bancária",
  });

  return {
    sucesso: true,
    competencia,
    brutoCents,
    inssCents,
    aliquotaEfetivaINSSBps,
    deducoesLegaisTotalCents,
    descontoSimplificadoCents,
    tipoDeducaoIRRF,
    deducaoIRRFEfetivaCents,
    baseIRRFCents,
    impostoTabelaCents,
    aliquotaNominalIRRFBps,
    parcelaDeduzirIRRFCents,
    reducaoLei15270Cents,
    irrfCents,
    aliquotaEfetivaIRRFBps,
    pensaoAlimenticiaCents: pensaoCents,
    outrosDescontosCents,
    totalDescontosCents,
    liquidoCents,
    percentualDescontadoBps,
    memoriaDeCalculo: memoria,
    regrasUsadas: rules,
  };
}
