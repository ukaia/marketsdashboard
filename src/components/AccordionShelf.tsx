import React, { useState } from 'react';
import { panels, panelThemes, type PanelId } from '@/data/panelData';
import { useMarketData } from '@/hooks/useMarketData';
import PanelContent from './PanelContent';
import { ChevronUp, ChevronDown } from 'lucide-react';

const StripWithLiveData: React.FC<{
  panel: typeof panels[0];
  direction: 'up' | 'down';
  onClick: () => void;
}> = ({ panel, direction, onClick }) => {
  const { data: liveData } = useMarketData(panel.id);
  const price = liveData?.price ?? panel.price;
  const changePercent = liveData?.changePercent ?? panel.changePercent;
  const positive = liveData?.positive ?? panel.positive;

  return (
    <button
      onClick={onClick}
      className="panel-strip w-full border-b border-foreground/5"
    >
      <div className="flex items-center gap-3">
        {direction === 'up' ? (
          <ChevronDown className="w-4 h-4 opacity-40" />
        ) : (
          <ChevronUp className="w-4 h-4 opacity-40" />
        )}
        <span className="text-sm font-semibold tracking-wide">{panel.label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-mono opacity-80">{price}</span>
        <span className={`text-xs font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>
          {changePercent}
        </span>
      </div>
    </button>
  );
};

const AccordionShelf: React.FC = () => {
  const [activePanel, setActivePanel] = useState<PanelId>('largecap');

  const activeIndex = panels.findIndex((p) => p.id === activePanel);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
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
                direction={index < activeIndex ? 'up' : 'down'}
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
