# Regras Tributárias e Previdenciárias

Este diretório contém a parametrização versionada das tabelas e regras de cálculo de folha de pagamento (INSS, IRRF e deduções legais), segregadas por vigência de competência (`YYYY-MM`).

---

## Convenção de Arredondamento

- **Todos os valores monetários são representados estritamente em centavos inteiros (`number` ou `BigInt`).**
- Não é permitido o uso de floats/decimais de ponto flutuante em etapas intermediárias de apuração.
- A convenção de arredondamento aplicada é o **Round Half Up** (Norma ABNT NBR 5891), implementada na função pura `divRoundHalfUp` em `src/lib/tax/money.ts`:
  - Se a primeira casa decimal a ser descartada for maior ou igual a 5 (meia unidade), arredonda-se para cima para o centavo mais próximo.

---

## Fontes Oficiais Obrigatórias

Antes de cadastrar ou alterar parâmetros de uma competência, confirme cada valor nos veículos oficiais:

1. **Leis e Decretos Federais:**
   - Portal da Legislação da Presidência da República: [planalto.gov.br](https://www.planalto.gov.br)
   - Exemplo: Lei nº 15.270/2025 (Redução de IRPF sobre rendimentos de até R$ 5.000,00 e transição até R$ 7.350,00).

2. **INSS e Salário Mínimo:**
   - Ministério da Previdência Social e Ministério da Fazenda: [gov.br/previdencia](https://www.gov.br/previdencia)
   - Portarias Interministeriais conjuntas publicadas anualmente em janeiro com as faixas progressivas e teto do RGPS.

3. **Tabelas do IRPF e Instruções Normativas:**
   - Secretaria Especial da Receita Federal do Brasil: [gov.br/receitafederal](https://www.gov.br/receitafederal)
   - Atos Declaratórios e Instruções Normativas de retenção de tributos na fonte.

---

## Como Adicionar um Novo Conjunto de Regras

1. Crie um novo arquivo nomeado com a competência inicial de vigência, por exemplo `src/lib/tax/rules/2027-01.ts`.
2. Implemente o objeto satisfazendo a interface `TaxRules` definida em `src/lib/tax/rules/types.ts`.
3. Preencha o campo `verificadoEm` com a data ISO (`YYYY-MM-DD`) em que os parâmetros foram checados nas fontes oficiais.
4. Adicione o mapeamento da competência em `getRules` dentro de `src/lib/tax/rules/index.ts`.
5. Crie ou estenda os testes em `src/lib/tax/salario-liquido.test.ts` validando cenários reais contra simulações e fontes de referência.
