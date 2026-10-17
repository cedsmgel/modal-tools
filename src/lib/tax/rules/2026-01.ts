import type { TaxRules } from "./types";

export const rules2026: TaxRules = {
  competencia: "2026-01",
  vigenciaInicio: "2026-01-01",
  verificadoEm: "2026-10-17",
  salarioMinimoCents: 162100, // R$ 1.621,00
  inssBrackets: [
    { limitCents: 162100, rateBps: 750 }, // Até R$ 1.621,00 a 7,5%
    { limitCents: 290284, rateBps: 900 }, // De R$ 1.621,01 até R$ 2.902,84 a 9%
    { limitCents: 435427, rateBps: 1200 }, // De R$ 2.902,85 até R$ 4.354,27 a 12%
    { limitCents: 847555, rateBps: 1400 }, // De R$ 4.354,28 até R$ 8.475,55 a 14%
  ],
  inssCeilingContributionCents: 98809, // Contribuição máxima no teto: R$ 988,09
  irrfBrackets: [
    { limitCents: 242880, rateBps: 0, deductionCents: 0 }, // Isento até R$ 2.428,80
    { limitCents: 282665, rateBps: 750, deductionCents: 18216 }, // 7,5% até R$ 2.826,65
    { limitCents: 375105, rateBps: 1500, deductionCents: 39416 }, // 15,0% até R$ 3.751,05
    { limitCents: 466468, rateBps: 2250, deductionCents: 67549 }, // 22,5% até R$ 4.664,68
    { limitCents: Infinity, rateBps: 2750, deductionCents: 90873 }, // 27,5% acima de R$ 4.664,68
  ],
  irrfSimplifiedDiscountCents: 60720, // R$ 607,20 (25% da faixa de isenção)
  irrfDependentDeductionCents: 18959, // R$ 189,59 por dependente
  law15270: {
    zeroTaxThresholdCents: 500000, // R$ 5.000,00
    zeroTaxMaxReductionCents: 31289, // R$ 312,89 (zera o imposto da tabela de até R$ 5.000)
    phaseOutMaxThresholdCents: 735000, // R$ 7.350,00
    baseReductionConstantCents: 97862, // R$ 978,62
    reductionMultiplierPpm: 133145, // 0,133145 (133.145 / 1.000.000)
  },
  fontes: [
    {
      parametro: "Redução do IRPF até R$ 5.000 e fase de transição até R$ 7.350",
      autoridade: "Presidência da República / Congresso Nacional",
      url: "https://www.planalto.gov.br",
      descricao: "Lei nº 15.270/2025, com vigência estipulada a partir de 01/2026.",
    },
    {
      parametro: "Tabela progressiva e faixas de contribuição do INSS 2026",
      autoridade: "Ministério da Previdência Social e Ministério da Fazenda",
      url: "https://www.gov.br/previdencia",
      descricao: "Portaria Interministerial MPS/MF nº 13/2026 fixando o teto em R$ 8.475,55 e o salário mínimo em R$ 1.621,00.",
    },
    {
      parametro: "Tabela mensal do IRRF e desconto simplificado de 25%",
      autoridade: "Secretaria Especial da Receita Federal do Brasil",
      url: "https://www.gov.br/receitafederal",
      descricao: "Instrução Normativa RFB sobre retenção de IR na fonte para o ano-calendário de 2026.",
    },
  ],
};
