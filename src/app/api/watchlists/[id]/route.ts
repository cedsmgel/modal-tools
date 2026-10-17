import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { getDb, watchlists } from "@/db";

const PatchWatchlistSchema = z
  .object({
    name: z.string().trim().min(1).max(40).optional(),
    columns: z.string().optional(),
    position: z.number().int().nonnegative().optional(),
  })
  .strict();

export async function PATCH(
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

    const parsed = PatchWatchlistSchema.safeParse(body);
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

    // Verifica se a watchlist pertence ao usuário
    const existing = await db
      .select()
      .from(watchlists)
      .where(and(eq(watchlists.id, watchlistId), eq(watchlists.userId, userId)));

    if (existing.length === 0) {
      return NextResponse.json(
        { error: "Not Found", message: "Lista não encontrada ou sem permissão de acesso." },
        { status: 404 }
      );
    }

    const updateData: { name?: string; columns?: string; position?: number } = {};
    if (parsed.data.name !== undefined) updateData.name = parsed.data.name;
    if (parsed.data.columns !== undefined) updateData.columns = parsed.data.columns;
    if (parsed.data.position !== undefined) updateData.position = parsed.data.position;

    await db
      .update(watchlists)
      .set(updateData)
      .where(and(eq(watchlists.id, watchlistId), eq(watchlists.userId, userId)));

    return NextResponse.json({ message: "Lista atualizada com sucesso." }, { status: 200 });
  } catch (err) {
    console.error("Erro no Route Handler PATCH /api/watchlists/[id]:", err);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Falha ao atualizar watchlist." },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    const db = getDb();
    if (!db) {
      return NextResponse.json(
        { error: "Service Unavailable", message: "Banco de dados indisponível." },
        { status: 503 }
      );
    }

    const existing = await db
      .select()
      .from(watchlists)
      .where(and(eq(watchlists.id, watchlistId), eq(watchlists.userId, userId)));

    if (existing.length === 0) {
      return NextResponse.json(
        { error: "Not Found", message: "Lista não encontrada ou sem permissão para exclusão." },
        { status: 404 }
      );
    }

    await db
      .delete(watchlists)
      .where(and(eq(watchlists.id, watchlistId), eq(watchlists.userId, userId)));

    return NextResponse.json({ message: "Lista removida com sucesso." }, { status: 200 });
  } catch (err) {
    console.error("Erro no Route Handler DELETE /api/watchlists/[id]:", err);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Falha ao remover watchlist." },
      { status: 500 }
    );
  }
}
