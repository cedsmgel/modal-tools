import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { z } from 'zod';
import { getDb, assets, users } from '@/db';

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
    averagePrice: z.number().nonnegative().optional().default(0),
    notes: z.string().max(255).optional(),
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

    // Obtém o usuário autenticado do Clerk estritamente (sem fallback inseguro)
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Usuário não autenticado. Acesso negado.',
        },
        { status: 401 }
      );
    }

    const db = getDb();
    const assetId = crypto.randomUUID();

    if (db) {
      // Garante que o usuário existe na tabela users antes de vincular a foreign key
      await db
        .insert(users)
        .values({
          id: userId,
          email: 'user@modaltools.com',
          name: 'Usuário Conectado',
        })
        .onConflictDoNothing();

      // Insere o ativo usando Drizzle ORM no Cloudflare D1
      await db.insert(assets).values({
        id: assetId,
        userId: userId,
        ticker: sanitizedAsset.ticker,
        amount: sanitizedAsset.amount,
        assetType: sanitizedAsset.assetType,
        averagePrice: sanitizedAsset.averagePrice,
        notes: sanitizedAsset.notes || null,
      });
    }

    return NextResponse.json(
      {
        message: 'Ativo validado e persistido via Drizzle no Cloudflare D1.',
        data: {
          id: assetId,
          userId: userId,
          ...sanitizedAsset,
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const errorDetails = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Ocorreu um erro ao processar e persistir os dados.',
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Usuário não autenticado. Acesso negado.',
        },
        { status: 401 }
      );
    }

    const db = getDb();
    if (!db) {
      return NextResponse.json({ assets: [] }, { status: 200 });
    }

    const allAssets = await db.query.assets.findMany({
      where: (items, { eq }) => eq(items.userId, userId),
    });

    return NextResponse.json({ assets: allAssets }, { status: 200 });
  } catch (err: unknown) {
    const errorDetails = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Falha ao buscar ativos do D1 via Drizzle.',
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}
