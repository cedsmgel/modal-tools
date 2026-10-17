export interface INSSBracket {
  limitCents: number;
  rateBps: number; // Pontos-base (ex: 750 = 7,5%)
}

export interface IRRFBracket {
  limitCents: number;
  rateBps: number; // Pontos-base (ex: 2750 = 27,5%)
  deductionCents: number; // Parcela a deduzir em centavos
}

export interface Law15270Rule {
  zeroTaxThresholdCents: number; // R$ 5.000,00
  zeroTaxMaxReductionCents: number; // R$ 312,89
  phaseOutMaxThresholdCents: number; // R$ 7.350,00
  baseReductionConstantCents: number; // R$ 978,62
  reductionMultiplierPpm: number; // 133145 por milhão (0,133145)
}

export interface RuleSource {
  parametro: string;
  autoridade: string;
  url: string;
  descricao: string;
}

export interface TaxRules {
  competencia: string;
  vigenciaInicio: string;
  verificadoEm: string;
  salarioMinimoCents: number;
  inssBrackets: INSSBracket[];
  inssCeilingContributionCents: number;
  irrfBrackets: IRRFBracket[];
  irrfSimplifiedDiscountCents: number;
  irrfDependentDeductionCents: number;
  law15270: Law15270Rule;
  fontes: RuleSource[];
}

export type RulesResult =
  | { success: true; rules: TaxRules }
  | { success: false; error: string };
