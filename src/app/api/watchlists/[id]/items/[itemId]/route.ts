import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { getDb, watchlists, watchlistItems } from "@/db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    const { id: watchlistId, itemId } = await params;
    const db = getDb();
    if (!db) {
      return NextResponse.json(
        { error: "Service Unavailable", message: "Banco de dados indisponível." },
        { status: 503 }
      );
    }

    // Garante que a watchlist pertence ao usuário autenticado
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

    await db
      .delete(watchlistItems)
      .where(
        and(
          eq(watchlistItems.id, itemId),
          eq(watchlistItems.watchlistId, watchlistId)
        )
      );

    return NextResponse.json({ message: "Ativo removido da lista com sucesso." }, { status: 200 });
  } catch (err) {
    console.error("Erro no Route Handler DELETE /api/watchlists/[id]/items/[itemId]:", err);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Falha ao remover ativo da lista." },
      { status: 500 }
    );
  }
}
