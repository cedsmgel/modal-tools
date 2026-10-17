export interface TickerUniverseItem {
  ticker: string;
  name: string;
  type: "STOCK" | "FII" | "ETF";
}

export const ALLOWED_UNIVERSE: TickerUniverseItem[] = [
  // Ações B3 (Blue Chips & Alta Liquidez)
  { ticker: "PETR4", name: "Petrobras PN", type: "STOCK" },
  { ticker: "PETR3", name: "Petrobras ON", type: "STOCK" },
  { ticker: "VALE3", name: "Vale ON", type: "STOCK" },
  { ticker: "ITUB4", name: "Itaú Unibanco PN", type: "STOCK" },
  { ticker: "BBDC4", name: "Bradesco PN", type: "STOCK" },
  { ticker: "BBAS3", name: "Banco do Brasil ON", type: "STOCK" },
  { ticker: "ABEV3", name: "Ambev ON", type: "STOCK" },
  { ticker: "WEGE3", name: "WEG ON", type: "STOCK" },
  { ticker: "RENT3", name: "Localiza ON", type: "STOCK" },
  { ticker: "BPAC11", name: "BTG Pactual Unit", type: "STOCK" },
  { ticker: "SUZB3", name: "Suzano ON", type: "STOCK" },
  { ticker: "RAIL3", name: "Rumo ON", type: "STOCK" },
  { ticker: "GGBR4", name: "Gerdau PN", type: "STOCK" },
  { ticker: "CSNA3", name: "Siderúrgica Nacional ON", type: "STOCK" },
  { ticker: "ELET3", name: "Eletrobras ON", type: "STOCK" },
  { ticker: "EQTL3", name: "Equatorial ON", type: "STOCK" },
  { ticker: "LREN3", name: "Lojas Renner ON", type: "STOCK" },
  { ticker: "RADL3", name: "RaiaDrogasil ON", type: "STOCK" },
  { ticker: "PRIO3", name: "PRIO ON", type: "STOCK" },
  { ticker: "VBBR3", name: "Vibra Energia ON", type: "STOCK" },
  { ticker: "RDOR3", name: "Rede D'Or ON", type: "STOCK" },
  { ticker: "UGPA3", name: "Ultrapar ON", type: "STOCK" },
  { ticker: "HAPV3", name: "Hapvida ON", type: "STOCK" },
  { ticker: "TIMS3", name: "TIM Brasil ON", type: "STOCK" },
  { ticker: "VIVT3", name: "Telefônica Brasil ON", type: "STOCK" },
  { ticker: "SANB11", name: "Santander Unit", type: "STOCK" },
  { ticker: "CMIG4", name: "Cemig PN", type: "STOCK" },
  { ticker: "CPLE6", name: "Copel PNB", type: "STOCK" },
  { ticker: "ASAI3", name: "Assaí ON", type: "STOCK" },
  { ticker: "CRFB3", name: "Carrefour Brasil ON", type: "STOCK" },
  { ticker: "KLBN11", name: "Klabin Unit", type: "STOCK" },
  { ticker: "B3SA3", name: "B3 ON", type: "STOCK" },

  // Fundos Imobiliários (FIIs)
  { ticker: "HGLG11", name: "CSHG Logística FII", type: "FII" },
  { ticker: "KNIP11", name: "Kinea Índices FII", type: "FII" },
  { ticker: "KNCR11", name: "Kinea Rendimentos FII", type: "FII" },
  { ticker: "XPLG11", name: "XP Log FII", type: "FII" },
  { ticker: "MXRF11", name: "Maxi Renda FII", type: "FII" },
  { ticker: "XPML11", name: "XP Malls FII", type: "FII" },
  { ticker: "VISC11", name: "Vinci Shopping FII", type: "FII" },
  { ticker: "BTLG11", name: "BTG Logística FII", type: "FII" },
  { ticker: "HGRU11", name: "CSHG Renda Urbana FII", type: "FII" },
  { ticker: "IRDM11", name: "Iridium Recebíveis FII", type: "FII" },
  { ticker: "CPTS11", name: "Capitânia Securities FII", type: "FII" },
  { ticker: "TGAR11", name: "TG Ativo Real FII", type: "FII" },
  { ticker: "VGIR11", name: "Valora RE III FII", type: "FII" },
  { ticker: "RBRR11", name: "RBR Rendimento FII", type: "FII" },

  // ETFs & Índices
  { ticker: "BOVA11", name: "iShares Ibovespa ETF", type: "ETF" },
  { ticker: "SMAL11", name: "iShares Small Cap ETF", type: "ETF" },
  { ticker: "IVVB11", name: "iShares S&P 500 ETF", type: "ETF" },
  { ticker: "HASH11", name: "Hashdex Nasdaq Crypto ETF", type: "ETF" },
  { ticker: "XINA11", name: "Trend MSCI China ETF", type: "ETF" },
];

const UNIVERSE_MAP = new Map<string, TickerUniverseItem>(
  ALLOWED_UNIVERSE.map((item) => [item.ticker.toUpperCase(), item])
);

export function isAllowedTicker(ticker: string): boolean {
  if (!ticker) return false;
  return UNIVERSE_MAP.has(ticker.trim().toUpperCase());
}

export function getTickerMeta(ticker: string): TickerUniverseItem | undefined {
  if (!ticker) return undefined;
  return UNIVERSE_MAP.get(ticker.trim().toUpperCase());
}
