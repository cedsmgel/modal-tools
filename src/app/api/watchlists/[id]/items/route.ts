import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { getDb, watchlists, watchlistItems, users } from "@/db";
import { isAllowedTicker } from "@/lib/market/universe";

const AddItemSchema = z
  .object({
    ticker: z.string().trim().min(1).max(12),
  })
  .strict();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    const { id: watchlistId } = await params;
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Bad Request", message: "JSON inválido." },
        { status: 400 }
      );
    }

    const parsed = AddItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation Error",
          message: "Dados inválidos.",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const cleanTicker = parsed.data.ticker.trim().toUpperCase();

    // Valida se o ticker pertence ao universo permitido
    if (!isAllowedTicker(cleanTicker)) {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: `O ticker ${cleanTicker} não pertence ao universo monitorado da B3.`,
        },
        { status: 400 }
      );
    }

    const db = getDb();
    if (!db) {
      return NextResponse.json(
        { error: "Service Unavailable", message: "Banco de dados indisponível." },
        { status: 503 }
      );
    }

    // Verifica propriedade da watchlist
    const targetWatchlist = await db
      .select()
      .from(watchlists)
      .where(and(eq(watchlists.id, watchlistId), eq(watchlists.userId, userId)));

    if (targetWatchlist.length === 0) {
      return NextResponse.json(
        { error: "Not Found", message: "Lista não encontrada ou sem permissão." },
        { status: 404 }
      );
    }

    // Itens atuais da lista
    const currentItems = await db
      .select()
      .from(watchlistItems)
      .where(eq(watchlistItems.watchlistId, watchlistId));

    // Impede duplicata
    if (currentItems.some((item) => item.ticker === cleanTicker)) {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: `O ativo ${cleanTicker} já está presente nesta lista.`,
        },
        { status: 400 }
      );
    }

    // Verifica limite do plano do usuário
    const userRow = await db.select().from(users).where(eq(users.id, userId));
    const isPro = userRow[0]?.plan?.toLowerCase() === "pro";

    // Limite de 10 ativos por lista no plano Free
    if (!isPro && currentItems.length >= 10) {
      return NextResponse.json(
        {
          error: "Plan Limit Reached",
          message: "O plano gratuito permite até 10 ativos por lista. Faça upgrade para o Pro para adicionar ativos ilimitados.",
        },
        { status: 403 }
      );
    }

    const itemId = crypto.randomUUID();
    const position = currentItems.length;

    await db.insert(watchlistItems).values({
      id: itemId,
      watchlistId,
      ticker: cleanTicker,
      position,
    });

    return NextResponse.json(
      {
        message: "Ativo adicionado à lista com sucesso.",
        data: {
          id: itemId,
          watchlistId,
          ticker: cleanTicker,
          position,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Erro no Route Handler POST /api/watchlists/[id]/items:", err);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Falha ao adicionar ativo à lista." },
      { status: 500 }
    );
  }
}
