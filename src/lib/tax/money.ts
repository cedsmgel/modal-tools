/**
 * Utilitários para operações monetárias estritamente em centavos inteiros.
 * Convenção de arredondamento: Round Half Up (ABNT NBR 5891).
 */

export function toCents(value: number | string): number {
  if (typeof value === "string") {
    // Normaliza possíveis formatos (pt-BR ou padrão numérico)
    const clean = value.replace(/[R$\s.]/g, "").replace(",", ".");
    const num = parseFloat(clean);
    if (isNaN(num)) return 0;
    return Math.round(num * 100);
  }
  return Math.round(value * 100);
}

export function fromCents(cents: number): number {
  return cents / 100;
}

export function formatBRL(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function formatBRLRaw(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

/**
 * Divisão inteira com arredondamento meia-unidade para cima (Round Half Up).
 * Ex: 121.575 centavos -> 121.58 centavos.
 */
export function divRoundHalfUp(
  numerador: bigint | number,
  denominador: bigint | number
): number {
  const n = BigInt(Math.round(Number(numerador)));
  const d = BigInt(Math.round(Number(denominador)));
  const zero = BigInt(0);
  const one = BigInt(1);
  const two = BigInt(2);
  if (d === zero) return 0;

  const quotient = n / d;
  const remainder = n % d;

  // Para valores positivos: se o dobro do resto for maior ou igual ao divisor, soma 1
  if (remainder >= zero && remainder * two >= d) {
    return Number(quotient + one);
  }
  return Number(quotient);
}
