import { describe, it, expect } from "vitest";
import { calcularSalarioLiquido } from "./salario-liquido";

describe("Cálculo de Salário Líquido 2026", () => {
  it("Caso 1: Etapa do IRRF com bruto de 5.900,00 e INSS fixado em 635,60 (exemplo Senior)", () => {
    const res = calcularSalarioLiquido({
      brutoCents: 590000,
      inssOverrideCents: 63560,
      dependentes: 0,
      competencia: "2026-01",
    });

    expect(res.sucesso).toBe(true);
    if (!res.sucesso) return;

    expect(res.baseIRRFCents).toBe(526440); // R$ 5.264,40
    expect(res.impostoTabelaCents).toBe(53898); // R$ 538,98
    expect(res.reducaoLei15270Cents).toBe(19306); // R$ 193,06
    expect(res.irrfCents).toBe(34592); // R$ 345,92
  });

  it("Caso 2: Teto de INSS em R$ 8.475,55 e R$ 12.000,00", () => {
    const resTetoExato = calcularSalarioLiquido({
      brutoCents: 847555,
      competencia: "2026-01",
    });
    const resAcimaTeto = calcularSalarioLiquido({
      brutoCents: 1200000,
      competencia: "2026-01",
    });

    expect(resTetoExato.sucesso).toBe(true);
    expect(resAcimaTeto.sucesso).toBe(true);
    if (!resTetoExato.sucesso || !resAcimaTeto.sucesso) return;

    expect(resTetoExato.inssCents).toBe(98809); // R$ 988,09
    expect(resAcimaTeto.inssCents).toBe(98809); // R$ 988,09
  });

  it("Caso 3: Bruto de R$ 5.000,00 sem dependentes deve zerar o IRRF via redução", () => {
    const res = calcularSalarioLiquido({
      brutoCents: 500000,
      dependentes: 0,
      competencia: "2026-01",
    });

    expect(res.sucesso).toBe(true);
    if (!res.sucesso) return;

    expect(res.tipoDeducaoIRRF).toBe("simplificada");
    expect(res.baseIRRFCents).toBe(439280); // R$ 4.392,80
    expect(res.impostoTabelaCents).toBe(31289); // R$ 312,89
    expect(res.reducaoLei15270Cents).toBe(31289); // R$ 312,89
    expect(res.irrfCents).toBe(0); // R$ 0,00
  });

  it("Caso 4: Bruto de R$ 7.350,00 (fim da faixa de transição)", () => {
    const res = calcularSalarioLiquido({
      brutoCents: 735000,
      dependentes: 0,
      competencia: "2026-01",
    });

    expect(res.sucesso).toBe(true);
    if (!res.sucesso) return;

    expect(res.reducaoLei15270Cents).toBe(0);
    expect(res.irrfCents).toBe(res.impostoTabelaCents);
  });

  it("Caso 5: Bruto de R$ 2.428,80 (isenção total de IRRF)", () => {
    const res = calcularSalarioLiquido({
      brutoCents: 242880,
      competencia: "2026-01",
    });

    expect(res.sucesso).toBe(true);
    if (!res.sucesso) return;

    expect(res.impostoTabelaCents).toBe(0);
    expect(res.irrfCents).toBe(0);
  });

  it.todo("Caso 6: Bruto de R$ 1.621,00 deve ter INSS próximo de 121,58 até confirmação oficial de arredondamento", () => {
    const res = calcularSalarioLiquido({
      brutoCents: 162100,
      competencia: "2026-01",
    });
    expect(res.sucesso).toBe(true);
    if (!res.sucesso) return;
    expect(res.inssCents).toBe(12158);
  });

  describe("Testes de Propriedade", () => {
    it("INSS nunca decresce com o salário bruto e nunca excede 988,09", () => {
      let prevINSS = 0;
      for (let bruto = 100000; bruto <= 1500000; bruto += 50000) {
        const res = calcularSalarioLiquido({ brutoCents: bruto, competencia: "2026-01" });
        expect(res.sucesso).toBe(true);
        if (!res.sucesso) return;

        expect(res.inssCents).toBeGreaterThanOrEqual(prevINSS);
        expect(res.inssCents).toBeLessThanOrEqual(98809);
        prevINSS = res.inssCents;
      }
    });

    it("O IRRF não apresenta saltos abruptos em torno de 5.000,00 e 7.350,00", () => {
      // Teste na fronteira de R$ 5.000,00
      const abaixo5k = calcularSalarioLiquido({ brutoCents: 500000 });
      const acima5k = calcularSalarioLiquido({ brutoCents: 500100 });
      expect(abaixo5k.sucesso && acima5k.sucesso).toBe(true);
      if (abaixo5k.sucesso && acima5k.sucesso) {
        expect(abaixo5k.irrfCents).toBe(0);
        // O imposto logo acima de 5k deve ser de apenas centavos
        expect(acima5k.irrfCents).toBeLessThanOrEqual(50);
      }

      // Teste na fronteira de R$ 7.350,00
      const abaixo7350 = calcularSalarioLiquido({ brutoCents: 734900 });
      const acima7350 = calcularSalarioLiquido({ brutoCents: 735100 });
      expect(abaixo7350.sucesso && acima7350.sucesso).toBe(true);
      if (abaixo7350.sucesso && acima7350.sucesso) {
        const diff = Math.abs(acima7350.irrfCents - abaixo7350.irrfCents);
        // Transição suave (diferença proporcional ao acréscimo de R$ 2,00)
        expect(diff).toBeLessThanOrEqual(100);
      }
    });

    it("O salário líquido nunca é negativo sem outros descontos", () => {
      for (let bruto = 0; bruto <= 2000000; bruto += 100000) {
        const res = calcularSalarioLiquido({ brutoCents: bruto, competencia: "2026-01" });
        expect(res.sucesso).toBe(true);
        if (res.sucesso) {
          expect(res.liquidoCents).toBeGreaterThanOrEqual(0);
          expect(Number.isInteger(res.liquidoCents)).toBe(true);
        }
      }
    });

    it("Todos os resultados numéricos são centavos inteiros", () => {
      const res = calcularSalarioLiquido({
        brutoCents: 673245,
        dependentes: 2,
        pensaoAlimenticiaCents: 45000,
        competencia: "2026-01",
      });

      expect(res.sucesso).toBe(true);
      if (res.sucesso) {
        expect(Number.isInteger(res.inssCents)).toBe(true);
        expect(Number.isInteger(res.baseIRRFCents)).toBe(true);
        expect(Number.isInteger(res.impostoTabelaCents)).toBe(true);
        expect(Number.isInteger(res.reducaoLei15270Cents)).toBe(true);
        expect(Number.isInteger(res.irrfCents)).toBe(true);
        expect(Number.isInteger(res.liquidoCents)).toBe(true);
      }
    });

    it("Competência desconhecida retorna erro tipado amigável", () => {
      const res = calcularSalarioLiquido({
        brutoCents: 500000,
        competencia: "2024-05",
      });

      expect(res.sucesso).toBe(false);
      if (!res.sucesso) {
        expect(res.error).toBe("Ainda não temos as regras desta competência.");
      }
    });
  });
});
