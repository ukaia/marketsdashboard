import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Finnhub symbol mapping per panel
const PANEL_SYMBOLS: Record<string, { quoteSymbol: string; newsCategory: string; newsQuery: string }> = {
  largecap: { quoteSymbol: "SPY", newsCategory: "general", newsQuery: "S&P 500" },
  midcap: { quoteSymbol: "IWM", newsCategory: "general", newsQuery: "Russell 2000 small cap" },
  foreign: { quoteSymbol: "EFA", newsCategory: "general", newsQuery: "international stocks" },
  bonds: { quoteSymbol: "TLT", newsCategory: "general", newsQuery: "treasury bonds" },
  bitcoin: { quoteSymbol: "BINANCE:BTCUSDT", newsCategory: "crypto", newsQuery: "bitcoin" },
};

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

    if (!panelId || !PANEL_SYMBOLS[panelId]) {
      return new Response(JSON.stringify({ error: "Invalid panel ID" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const config = PANEL_SYMBOLS[panelId];
    const baseUrl = "https://finnhub.io/api/v1";

    // Fetch quote and news in parallel
    const [quoteRes, newsRes] = await Promise.all([
      fetch(`${baseUrl}/quote?symbol=${config.quoteSymbol}&token=${FINNHUB_API_KEY}`),
      fetch(`${baseUrl}/news?category=${config.newsCategory}&token=${FINNHUB_API_KEY}`),
    ]);

    const quote = await quoteRes.json();
    const allNews = await newsRes.json();

    // Filter news by query relevance and take top 4
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

    // If we don't have enough filtered news, just take the first 4
    const headlines = filteredNews.length >= 2
      ? filteredNews
      : (Array.isArray(allNews) ? allNews.slice(0, 4).map((n: any) => ({
          title: n.headline,
          source: n.source,
          time: getTimeAgo(n.datetime),
          url: n.url,
        })) : []);

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
