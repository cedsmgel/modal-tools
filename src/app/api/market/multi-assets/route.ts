import { NextResponse } from "next/server";
import {
  getBrapiStocks,
  getBrapiCurrencies,
  getBrapiCrypto,
  getBrapiMacro,
} from "@/lib/brapi";

export type AssetCategory = "acoes" | "fiis" | "cripto" | "cambio" | "taxas";

export interface MultiAssetItem {
  id: string;
  ticker: string;
  name: string;
  category: AssetCategory;
  price: number;
  changePercent: number;
  currency?: string;
  updatedAt?: string;
}

export async function GET() {
  try {
    const stockSymbols = ["PETR4", "VALE3", "ITUB4", "BBDC4", "WEGE3", "BBAS3", "BOVA11"];
    const fiiSymbols = ["HGLG11", "KNIP11", "XPLG11", "MXRF11", "VISC11"];
    const currencyPairs = ["USD-BRL", "EUR-BRL", "GBP-BRL"];
    const cryptoCoins = ["BTC", "ETH", "SOL"];

    // Executa em paralelo para velocidade máxima
    const [stocks, fiis, currencies, cryptos, macro] = await Promise.all([
      getBrapiStocks(stockSymbols),
      getBrapiStocks(fiiSymbols),
      getBrapiCurrencies(currencyPairs),
      getBrapiCrypto(cryptoCoins),
      getBrapiMacro(),
    ]);

    const assets: MultiAssetItem[] = [];

    // 1. Ações B3
    stocks.forEach((st) => {
      assets.push({
        id: st.symbol.toLowerCase(),
        ticker: st.symbol,
        name: st.shortName || st.symbol,
        category: "acoes",
        price: st.regularMarketPrice,
        changePercent: st.regularMarketChangePercent,
        currency: "BRL",
        updatedAt: st.regularMarketTime,
      });
    });

    // 2. Fundos Imobiliários (FIIs)
    fiis.forEach((fii) => {
      assets.push({
        id: fii.symbol.toLowerCase(),
        ticker: fii.symbol,
        name: fii.shortName || fii.symbol,
        category: "fiis",
        price: fii.regularMarketPrice,
        changePercent: fii.regularMarketChangePercent,
        currency: "BRL",
        updatedAt: fii.regularMarketTime,
      });
    });

    // 3. Criptomoedas
    cryptos.forEach((cr) => {
      const cryptoNames: Record<string, string> = {
        BTC: "Bitcoin",
        ETH: "Ethereum",
        SOL: "Solana",
      };
      assets.push({
        id: cr.coin.toLowerCase(),
        ticker: cr.coin,
        name: cryptoNames[cr.coin] || cr.coin,
        category: "cripto",
        price: cr.regularMarketPrice,
        changePercent: cr.regularMarketChangePercent,
        currency: "BRL",
      });
    });

    // 4. Câmbio / Moedas
    currencies.forEach((c) => {
      assets.push({
        id: c.fromCurrency.toLowerCase(),
        ticker: `${c.fromCurrency}/BRL`,
        name: c.name || `${c.fromCurrency} Comercial`,
        category: "cambio",
        price: c.bidPrice,
        changePercent: c.pctChange,
        currency: "BRL",
      });
    });

    // 5. Taxas Macroeconômicas
    if (macro) {
      if (macro.selic) {
        assets.push({
          id: "selic",
          ticker: "SELIC",
          name: "Taxa Selic Meta",
          category: "taxas",
          price: macro.selic.value,
          changePercent: 0.0,
          currency: "% a.a.",
        });
      }
      if (macro.cdi) {
        assets.push({
          id: "cdi",
          ticker: "CDI",
          name: "Certificado de Depósito",
          category: "taxas",
          price: macro.cdi.value,
          changePercent: 0.0,
          currency: "% a.a.",
        });
      }
      if (macro.ipca) {
        assets.push({
          id: "ipca",
          ticker: "IPCA",
          name: "Inflação 12 Meses",
          category: "taxas",
          price: macro.ipca.value,
          changePercent: 0.0,
          currency: "% a.a.",
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        timestamp: new Date().toISOString(),
        assets,
        macro: {
          selic: macro?.selic?.value ?? 10.75,
          cdi: macro?.cdi?.value ?? 10.65,
          ipca: macro?.ipca?.value ?? 4.42,
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        },
      }
    );
  } catch (error: any) {
    console.error("Erro na rota multi-assets:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Erro ao consultar ativos múltiplos",
      },
      { status: 500 }
    );
  }
}
