import React, { useState } from 'react';
import { type PanelInfo, panelThemes } from '@/data/panelData';
import { useMarketData } from '@/hooks/useMarketData';
import Sparkline from './Sparkline';
import { TrendingUp, TrendingDown, Clock, ExternalLink, Loader2, AlertCircle } from 'lucide-react';

interface PanelContentProps {
  panel: PanelInfo;
}

const PanelContent: React.FC<PanelContentProps> = ({ panel }) => {
  const [selectedTicker, setSelectedTicker] = useState<string | undefined>(undefined);
  const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const { data, isLoading, isError } = useMarketData(panel.id, selectedTicker);
  const theme = panelThemes[panel.id];

  const displayLabel = selectedTicker || panel.ticker;

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin opacity-40" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 opacity-60">
        <AlertCircle className="w-8 h-8" />
        <p className="text-sm">Unable to load market data</p>
        <p className="text-xs opacity-50">Will retry automatically</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col px-6 py-5 md:px-10 md:py-8 overflow-y-auto">
      {/* Price Header */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium tracking-widest uppercase opacity-60">{displayLabel}</p>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 font-medium">LIVE</span>
          </div>
          <div className="flex items-baseline gap-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{data.price}</h1>
            <span className={`flex items-center gap-1 text-lg font-semibold ${data.positive ? 'text-green-400' : 'text-red-400'}`}>
              {data.positive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              {data.change} ({data.changePercent})
            </span>
          </div>
        </div>
      </div>

      {/* Sparkline */}
      {data.candles.length > 1 && (
        <div className="mb-5">
          <Sparkline
            data={data.candles}
            positive={data.positive}
            accentColor={theme.accent}
            width={600}
            height={80}
          />
        </div>
      )}

      {/* Holdings pills - clickable */}
      {panel.holdings && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedTicker(undefined)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              !selectedTicker
                ? 'bg-foreground/20 border-foreground/30 text-foreground'
                : 'bg-foreground/5 border-foreground/10 text-foreground/60 hover:bg-foreground/10'
            }`}
          >
            {panel.ticker}
          </button>
          {panel.holdings.map((h) => (
            <button
              key={h}
              onClick={() => setSelectedTicker(h === selectedTicker ? undefined : h)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                selectedTicker === h
                  ? 'bg-foreground/20 border-foreground/30 text-foreground'
                  : 'bg-foreground/5 border-foreground/10 text-foreground/60 hover:bg-foreground/10'
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      )}

      {/* News Feed - clickable headlines */}
      <div className="flex-1 space-y-3">
        <h2 className="text-xs font-semibold tracking-widest uppercase opacity-50 mb-3">
          {selectedTicker ? `${selectedTicker} Headlines` : 'Latest Headlines'}
        </h2>
        {data.headlines.length === 0 && (
          <p className="text-sm opacity-40">No headlines available right now</p>
        )}
        {data.headlines.map((h, i) => (
          <a
            key={i}
            href={h.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-3 p-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors cursor-pointer block"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-snug group-hover:opacity-100 opacity-90 transition-opacity">
                {h.title}
              </p>
              <p className="text-xs opacity-40 mt-1">{h.source} · {h.time}</p>
            </div>
            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-40 transition-opacity flex-shrink-0 mt-0.5" />
          </a>
        ))}
      </div>

      {/* Timestamp */}
      <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-foreground/10">
        <Clock className="w-3.5 h-3.5 opacity-40" />
        <span className="text-xs opacity-40">Last updated {now}</span>
      </div>
    </div>
  );
};

export default PanelContent;
