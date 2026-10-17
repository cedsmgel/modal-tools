import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getMarketHistory } from "@/lib/market/cache";
import { isAllowedTicker } from "@/lib/market/universe";

const HistoryQuerySchema = z
  .object({
    ticker: z.string().min(1, "O ticker é obrigatório."),
    range: z.string().optional().default("1mo"),
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
    const parsed = HistoryQuerySchema.safeParse({
      ticker: searchParams.get("ticker") || "",
      range: searchParams.get("range") || "1mo",
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Parâmetros inválidos.",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const cleanTicker = parsed.data.ticker.trim().toUpperCase();
    const range = parsed.data.range;

    // Bloqueia ranges superiores a 3 meses conforme plano gratuito
    if (range !== "5d" && range !== "1mo" && range !== "3mo") {
      return NextResponse.json(
        {
          error: "Plan Limit Reached",
          message: "Histórico acima de 3 meses disponível exclusivamente no plano Pro.",
        },
        { status: 403 }
      );
    }

    if (!isAllowedTicker(cleanTicker)) {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Ticker não permitido ou fora do universo monitorado.",
        },
        { status: 400 }
      );
    }

    const result = await getMarketHistory(cleanTicker, range as "5d" | "1mo" | "3mo");

    if (!result) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "Não foi possível obter os dados históricos para este ativo no momento.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: result,
      },
      {
        status: 200,
        headers: {
          "X-Cache": result.cacheStatus,
        },
      }
    );
  } catch (err) {
    console.error("Erro no Route Handler /api/market/history:", err);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Falha ao processar histórico de mercado." },
      { status: 500 }
    );
  }
}
