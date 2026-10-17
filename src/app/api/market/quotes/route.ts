import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getMarketQuotes } from "@/lib/market/cache";
import { isAllowedTicker } from "@/lib/market/universe";

const QuotesQuerySchema = z
  .object({
    tickers: z.string().min(1, "O parâmetro 'tickers' é obrigatório."),
  })
  .strict();

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const parsed = QuotesQuerySchema.safeParse({
      tickers: searchParams.get("tickers") || "",
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Parâmetros de consulta inválidos.",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const rawTickers = parsed.data.tickers
      .split(",")
      .map((t) => t.trim().toUpperCase())
      .filter(Boolean);

    if (rawTickers.length > 10) {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Máximo de 10 tickers permitidos por requisição.",
        },
        { status: 400 }
      );
    }

    // Filtra estritamente pelo universo permitido
    const validTickers = rawTickers.filter((t) => isAllowedTicker(t));
    if (validTickers.length === 0) {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Nenhum ticker fornecido pertence ao universo de ativos permitido.",
        },
        { status: 400 }
      );
    }

    const { quotes, cacheStatus } = await getMarketQuotes(validTickers);

    return NextResponse.json(
      {
        data: quotes,
        count: quotes.length,
      },
      {
        status: 200,
        headers: {
          "X-Cache": cacheStatus,
        },
      }
    );
  } catch (err) {
    console.error("Erro no Route Handler /api/market/quotes:", err);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Falha ao processar cotações de mercado." },
      { status: 500 }
    );
  }
}
