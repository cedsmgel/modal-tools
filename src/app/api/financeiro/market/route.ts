import { NextResponse } from "next/server";
import {
  getBrapiStocks,
  getBrapiCurrencies,
  getBrapiCrypto,
  getBrapiMacro,
} from "@/lib/brapi";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbols = searchParams.get("symbols")?.split(",") || ["PETR4", "VALE3", "ITUB4", "BBDC4", "WEGE3", "HGLG11"];
    const currencies = searchParams.get("currencies")?.split(",") || ["USD-BRL", "EUR-BRL"];
    const cryptos = searchParams.get("crypto")?.split(",") || ["BTC", "ETH"];

    // Executa em paralelo para máxima velocidade na edge
    const [stocks, currencyList, cryptoList, macro] = await Promise.all([
      getBrapiStocks(symbols),
      getBrapiCurrencies(currencies),
      getBrapiCrypto(cryptos),
      getBrapiMacro(),
    ]);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        stocks,
        currencies: currencyList,
        cryptos: cryptoList,
        macro,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Erro ao consultar brapi",
      },
      { status: 500 }
    );
  }
}
