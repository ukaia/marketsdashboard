import { useQuery } from "@tanstack/react-query";
import type { PanelId, Headline } from "@/data/panelData";

export interface LiveMarketData {
  price: string;
  change: string;
  changePercent: string;
  positive: boolean;
  headlines: Headline[];
}

interface MarketDataResponse {
  price: number;
  change: number;
  changePercent: number;
  positive: boolean;
  headlines: Headline[];
  timestamp: number;
}

async function fetchPanelData(panelId: PanelId): Promise<MarketDataResponse> {
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  const res = await fetch(
    `https://${projectId}.supabase.co/functions/v1/market-data?panel=${panelId}`,
    {
      headers: {
        Authorization: `Bearer ${anonKey}`,
        apikey: anonKey,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch market data: ${res.status}`);
  }

  return res.json();
}

function formatPrice(price: number, panelId: PanelId): string {
  if (panelId === "bonds") return `${price.toFixed(3)}%`;
  return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatChange(change: number, panelId: PanelId): string {
  const sign = change >= 0 ? "+" : "";
  if (panelId === "bonds") return `${sign}${change.toFixed(3)}`;
  return `${sign}${change.toFixed(2)}`;
}

export function useMarketData(panelId: PanelId) {
  return useQuery({
    queryKey: ["market-data", panelId],
    queryFn: () => fetchPanelData(panelId),
    refetchInterval: 60_000,
    staleTime: 30_000,
    retry: 2,
    select: (data): LiveMarketData => ({
      price: formatPrice(data.price, panelId),
      change: formatChange(data.change, panelId),
      changePercent: `${data.changePercent >= 0 ? "+" : ""}${data.changePercent.toFixed(2)}%`,
      positive: data.positive,
      headlines: data.headlines,
    }),
  });
}
