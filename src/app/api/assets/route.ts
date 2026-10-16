import { NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Enum estrito com os tipos de ativos suportados pela aplicação.
 */
export const AssetTypeEnum = z.enum([
  'STOCK',
  'CRYPTO',
  'FIAT',
  'BOND',
  'COMMODITY',
  'REAL_ESTATE',
]);

export type AssetType = z.infer<typeof AssetTypeEnum>;

/**
 * Schema Zod para validação rigorosa de entrada na borda (Edge Validation).
 * - ticker: String limpa, higienizada, sem injeção de scripts e em caixa alta.
 * - amount: Número estritamente positivo (> 0).
 * - assetType: Valor estritamente correspondente ao Enum permitido.
 * - .strict(): Bloqueia mass assignment e rejeita quaisquer campos adicionais não declarados.
 */
export const AssetInputSchema = z
  .object({
    ticker: z
      .string()
      .trim()
      .min(1, 'O ticker não pode estar vazio.')
      .max(15, 'O ticker não pode ter mais de 15 caracteres.')
      .regex(/^[A-Za-z0-9._-]+$/, 'O ticker deve conter apenas caracteres alfanuméricos válidos.')
      .toUpperCase(),
    amount: z
      .number()
      .positive("O campo 'amount' deve ser um número positivo maior que zero."),
    assetType: AssetTypeEnum,
  })
  .strict();

export type AssetInput = z.infer<typeof AssetInputSchema>;

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Corpo da requisição JSON inválido ou malformado.',
        },
        { status: 400 }
      );
    }

    const validationResult = AssetInputSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'Dados inválidos fornecidos no corpo da requisição.',
          issues: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const sanitizedAsset = validationResult.data;

    // Resposta de sucesso com os dados estritamente validados
    return NextResponse.json(
      {
        message: 'Ativo validado com sucesso na borda.',
        data: sanitizedAsset,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Ocorreu um erro interno ao processar a requisição.',
      },
      { status: 500 }
    );
  }
}
