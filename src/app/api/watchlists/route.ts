import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { getDb, watchlists, watchlistItems, users } from "@/db";

const CreateWatchlistSchema = z
  .object({
    name: z.string().trim().min(1, "O nome da lista não pode ser vazio.").max(40, "Nome muito longo."),
    columns: z.string().optional().default('["price","changePct"]'),
  })
  .strict();

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    const db = getDb();
    if (!db) {
      return NextResponse.json(
        { error: "Service Unavailable", message: "Banco de dados indisponível." },
        { status: 503 }
      );
    }

    // Busca todas as watchlists do usuário ordenadas por position
    const userWatchlists = await db
      .select()
      .from(watchlists)
      .where(eq(watchlists.userId, userId))
      .orderBy(asc(watchlists.position));

    // Se o usuário não tiver nenhuma lista, cria uma lista padrão inicial
    if (userWatchlists.length === 0) {
      // Garante que o usuário existe na tabela users
      await db
        .insert(users)
        .values({
          id: userId,
          plan: "free",
        })
        .onConflictDoNothing();

      const defaultListId = crypto.randomUUID();
      await db.insert(watchlists).values({
        id: defaultListId,
        userId,
        name: "Minha Carteira",
        columns: '["price","changePct"]',
        position: 0,
      });

      const initialTickers = ["PETR4", "VALE3", "BOVA11"];
      for (let i = 0; i < initialTickers.length; i++) {
        await db.insert(watchlistItems).values({
          id: crypto.randomUUID(),
          watchlistId: defaultListId,
          ticker: initialTickers[i],
          position: i,
        });
      }

      const freshlyCreated = await db
        .select()
        .from(watchlists)
        .where(eq(watchlists.id, defaultListId));

      const items = await db
        .select()
        .from(watchlistItems)
        .where(eq(watchlistItems.watchlistId, defaultListId))
        .orderBy(asc(watchlistItems.position));

      return NextResponse.json({
        data: [
          {
            ...freshlyCreated[0],
            items,
          },
        ],
      });
    }

    // Busca os itens para cada watchlist do usuário
    const fullWatchlists = await Promise.all(
      userWatchlists.map(async (wl) => {
        const items = await db
          .select()
          .from(watchlistItems)
          .where(eq(watchlistItems.watchlistId, wl.id))
          .orderBy(asc(watchlistItems.position));

        return {
          ...wl,
          items,
        };
      })
    );

    return NextResponse.json({ data: fullWatchlists }, { status: 200 });
  } catch (err) {
    console.error("Erro no Route Handler GET /api/watchlists:", err);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Falha ao carregar watchlists." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Bad Request", message: "JSON inválido." },
        { status: 400 }
      );
    }

    const parsed = CreateWatchlistSchema.safeParse(body);
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

    const db = getDb();
    if (!db) {
      return NextResponse.json(
        { error: "Service Unavailable", message: "Banco de dados indisponível." },
        { status: 503 }
      );
    }

    // Garante que o usuário existe na tabela users
    await db
      .insert(users)
      .values({
        id: userId,
        plan: "free",
      })
      .onConflictDoNothing();

    // Consulta plano do usuário
    const userRow = await db.select().from(users).where(eq(users.id, userId));
    const isPro = userRow[0]?.plan?.toLowerCase() === "pro";

    // Contagem de listas existentes
    const existing = await db
      .select()
      .from(watchlists)
      .where(eq(watchlists.userId, userId));

    // Limite de 3 listas para plano Free
    if (!isPro && existing.length >= 3) {
      return NextResponse.json(
        {
          error: "Plan Limit Reached",
          message: "O plano gratuito permite até 3 listas de ativos. Faça upgrade para o Pro para criar listas ilimitadas.",
        },
        { status: 403 }
      );
    }

    const newId = crypto.randomUUID();
    const position = existing.length;

    await db.insert(watchlists).values({
      id: newId,
      userId,
      name: parsed.data.name,
      columns: parsed.data.columns,
      position,
    });

    return NextResponse.json(
      {
        message: "Lista criada com sucesso.",
        data: {
          id: newId,
          userId,
          name: parsed.data.name,
          columns: parsed.data.columns,
          position,
          items: [],
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Erro no Route Handler POST /api/watchlists:", err);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Falha ao criar watchlist." },
      { status: 500 }
    );
  }
}
