import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Finnhub symbol mapping per panel
const PANEL_SYMBOLS: Record<string, { quoteSymbol: string; newsCategory: string; newsQuery: string }> = {
  largecap: { quoteSymbol: "SPY", newsCategory: "general", newsQuery: "S&P 500" },
  midcap: { quoteSymbol: "IWM", newsCategory: "general", newsQuery: "Russell 2000 small cap" },
  foreign: { quoteSymbol: "EFA", newsCategory: "general", newsQuery: "international stocks" },
  bonds: { quoteSymbol: "TLT", newsCategory: "general", newsQuery: "treasury bonds" },
  bitcoin: { quoteSymbol: "BINANCE:BTCUSDT", newsCategory: "crypto", newsQuery: "bitcoin" },
  nasdaq: { quoteSymbol: "QQQ", newsCategory: "general", newsQuery: "nasdaq" },
  gold: { quoteSymbol: "GLD", newsCategory: "general", newsQuery: "gold" },
  oil: { quoteSymbol: "USO", newsCategory: "general", newsQuery: "oil" },
};

// Known individual ticker symbols
const VALID_TICKERS = new Set([
  "AAPL", "MSFT", "NVDA", "AMZN", "GOOGL", "META",
  "SMCI", "CORT", "TASK", "LUMN", "AEHR",
  "NESN", "ASML", "SAP", "NOVO-B", "SHEL",
  "TLT", "AGG", "BND", "TIPS", "HYG",
  "QQQ", "TSLA", "AVGO", "COST", "NFLX",
  "GLD", "SLV", "IAU", "GDXJ", "NEM",
  "USO", "XLE", "XOM", "CVX", "OXY",
]);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const FINNHUB_API_KEY = Deno.env.get("FINNHUB_API_KEY");
    if (!FINNHUB_API_KEY) {
      throw new Error("FINNHUB_API_KEY is not configured");
    }

    const url = new URL(req.url);
    const panelId = url.searchParams.get("panel");
    const ticker = url.searchParams.get("ticker");

    if (!panelId || !PANEL_SYMBOLS[panelId]) {
      return new Response(JSON.stringify({ error: "Invalid panel ID" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const config = PANEL_SYMBOLS[panelId];
    const baseUrl = "https://finnhub.io/api/v1";

    // If a specific ticker is requested, fetch its quote instead
    const quoteSymbol = ticker && VALID_TICKERS.has(ticker) ? ticker : config.quoteSymbol;

    // Build fetch promises
    const fetchPromises: Promise<Response>[] = [
      fetch(`${baseUrl}/quote?symbol=${quoteSymbol}&token=${FINNHUB_API_KEY}`),
    ];

    // Ticker-specific news via company news endpoint, or general news
    if (ticker && VALID_TICKERS.has(ticker)) {
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const from = weekAgo.toISOString().split("T")[0];
      const to = today.toISOString().split("T")[0];
      fetchPromises.push(
        fetch(`${baseUrl}/company-news?symbol=${ticker}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`)
      );
    } else {
      fetchPromises.push(
        fetch(`${baseUrl}/news?category=${config.newsCategory}&token=${FINNHUB_API_KEY}`)
      );
    }

    // Candle data for sparkline (1D, 5-minute resolution)
    // Use stock candles for non-crypto, skip for crypto (different endpoint)
    if (!quoteSymbol.includes(":")) {
      const now = Math.floor(Date.now() / 1000);
      const dayAgo = now - 86400;
      fetchPromises.push(
        fetch(`${baseUrl}/stock/candle?symbol=${quoteSymbol}&resolution=5&from=${dayAgo}&to=${now}&token=${FINNHUB_API_KEY}`)
      );
    }

    const responses = await Promise.all(fetchPromises);
    const quote = await responses[0].json();
    const allNews = await responses[1].json();
    let candles: number[] = [];

    if (responses[2]) {
      const candleData = await responses[2].json();
      if (candleData && candleData.s === "ok" && Array.isArray(candleData.c)) {
        candles = candleData.c;
      }
    }

    // Process news
    let headlines: any[];
    if (ticker && VALID_TICKERS.has(ticker)) {
      // Company news endpoint returns articles directly for that ticker
      headlines = Array.isArray(allNews)
        ? allNews.slice(0, 4).map((n: any) => ({
            title: n.headline,
            source: n.source,
            time: getTimeAgo(n.datetime),
            url: n.url,
          }))
        : [];
    } else {
      // Filter general news by query relevance
      const filteredNews = Array.isArray(allNews)
        ? allNews
            .filter((n: any) =>
              (n.headline || "").toLowerCase().includes(config.newsQuery.split(" ")[0].toLowerCase()) ||
              (n.summary || "").toLowerCase().includes(config.newsQuery.split(" ")[0].toLowerCase()) ||
              (n.category || "").toLowerCase().includes(config.newsQuery.split(" ")[0].toLowerCase())
            )
            .slice(0, 4)
            .map((n: any) => ({
              title: n.headline,
              source: n.source,
              time: getTimeAgo(n.datetime),
              url: n.url,
            }))
        : [];

      headlines = filteredNews.length >= 2
        ? filteredNews
        : (Array.isArray(allNews) ? allNews.slice(0, 4).map((n: any) => ({
            title: n.headline,
            source: n.source,
            time: getTimeAgo(n.datetime),
            url: n.url,
          })) : []);
    }

    const result = {
      price: quote.c ?? 0,
      change: quote.d ?? 0,
      changePercent: quote.dp ?? 0,
      high: quote.h ?? 0,
      low: quote.l ?? 0,
      open: quote.o ?? 0,
      prevClose: quote.pc ?? 0,
      positive: (quote.d ?? 0) >= 0,
      headlines,
      candles,
      timestamp: Date.now(),
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Market data error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function getTimeAgo(unixTimestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - unixTimestamp;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
