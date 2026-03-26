import React, { useState } from 'react';
import { panels, panelThemes, type PanelId } from '@/data/panelData';
import { useMarketData } from '@/hooks/useMarketData';
import PanelContent from './PanelContent';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, LayoutPanelTop, PanelLeftClose } from 'lucide-react';

type LayoutMode = 'vertical' | 'horizontal';

const StripWithLiveData: React.FC<{
  panel: typeof panels[0];
  direction: 'before' | 'after';
  layout: LayoutMode;
  onClick: () => void;
}> = ({ panel, direction, layout, onClick }) => {
  const { data, isLoading } = useMarketData(panel.id);

  if (layout === 'horizontal') {
    return (
      <button
        onClick={onClick}
        className="h-full flex flex-col items-center justify-center gap-1 px-2 py-4 cursor-pointer select-none transition-all hover:brightness-125 border-r border-foreground/5"
        style={{ minWidth: '3.5rem', writingMode: 'vertical-lr' }}
      >
        <span className="text-xs font-semibold tracking-wide rotate-180">{panel.label}</span>
        {!isLoading && data && (
          <span className={`text-[10px] font-mono rotate-180 ${data.positive ? 'text-green-400' : 'text-red-400'}`}>
            {data.changePercent}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="panel-strip w-full border-b border-foreground/5"
    >
      <div className="flex items-center gap-3">
        {direction === 'before' ? (
          <ChevronDown className="w-4 h-4 opacity-40" />
        ) : (
          <ChevronUp className="w-4 h-4 opacity-40" />
        )}
        <span className="text-sm font-semibold tracking-wide">{panel.label}</span>
      </div>
      <div className="flex items-center gap-3">
        {isLoading ? (
          <span className="text-xs opacity-40">…</span>
        ) : data ? (
          <>
            <span className="text-sm font-mono opacity-80">{data.price}</span>
            <span className={`text-xs font-medium ${data.positive ? 'text-green-400' : 'text-red-400'}`}>
              {data.changePercent}
            </span>
          </>
        ) : (
          <span className="text-xs opacity-40">—</span>
        )}
      </div>
    </button>
  );
};

const AccordionShelf: React.FC = () => {
  const [activePanel, setActivePanel] = useState<PanelId>('largecap');
  const [layout, setLayout] = useState<LayoutMode>('vertical');
  const activeIndex = panels.findIndex((p) => p.id === activePanel);

  return (
    <div className={`h-screen w-screen flex overflow-hidden ${layout === 'horizontal' ? 'flex-row' : 'flex-col'}`}>
      {/* Layout toggle */}
      <button
        onClick={() => setLayout(l => l === 'vertical' ? 'horizontal' : 'vertical')}
        className="fixed top-3 right-3 z-50 p-2 rounded-lg bg-foreground/10 hover:bg-foreground/20 transition-colors backdrop-blur-sm"
        title={layout === 'vertical' ? 'Switch to side shelves' : 'Switch to top/bottom shelves'}
      >
        {layout === 'vertical' ? (
          <PanelLeftClose className="w-4 h-4 opacity-60" />
        ) : (
          <LayoutPanelTop className="w-4 h-4 opacity-60" />
        )}
      </button>

      {panels.map((panel, index) => {
        const isActive = panel.id === activePanel;
        const theme = panelThemes[panel.id];

        return (
          <div
            key={panel.id}
            className={`${theme.bg} transition-all overflow-hidden`}
            style={{
              flex: isActive ? '1 1 0%' : '0 0 auto',
              transitionDuration: '400ms',
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {!isActive && (
              <StripWithLiveData
                panel={panel}
                direction={index < activeIndex ? 'before' : 'after'}
                layout={layout}
                onClick={() => setActivePanel(panel.id)}
              />
            )}
            {isActive && (
              <div className="h-full">
                <PanelContent panel={panel} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AccordionShelf;
