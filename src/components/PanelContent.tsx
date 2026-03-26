import React from 'react';
import { type PanelInfo, panelThemes } from '@/data/panelData';
import { useMarketData } from '@/hooks/useMarketData';
import Sparkline from './Sparkline';
import { TrendingUp, TrendingDown, Clock, ExternalLink, Loader2, AlertCircle } from 'lucide-react';

interface PanelContentProps {
  panel: PanelInfo;
}

const PanelContent: React.FC<PanelContentProps> = ({ panel }) => {
  const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const { data, isLoading, isError } = useMarketData(panel.id);

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
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium tracking-widest uppercase opacity-60">{panel.ticker}</p>
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

      {/* Holdings pills */}
      {panel.holdings && (
        <div className="flex flex-wrap gap-2 mb-6">
          {panel.holdings.map((h) => (
            <span key={h} className="px-3 py-1 rounded-full text-xs font-medium bg-foreground/10 border border-foreground/10">
              {h}
            </span>
          ))}
        </div>
      )}

      {/* News Feed */}
      <div className="flex-1 space-y-3">
        <h2 className="text-xs font-semibold tracking-widest uppercase opacity-50 mb-3">Latest Headlines</h2>
        {data.headlines.length === 0 && (
          <p className="text-sm opacity-40">No headlines available right now</p>
        )}
        {data.headlines.map((h, i) => (
          <div
            key={i}
            className="group flex items-start gap-3 p-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors cursor-pointer"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-snug group-hover:opacity-100 opacity-90 transition-opacity">
                {h.title}
              </p>
              <p className="text-xs opacity-40 mt-1">{h.source} · {h.time}</p>
            </div>
            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-40 transition-opacity flex-shrink-0 mt-0.5" />
          </div>
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
