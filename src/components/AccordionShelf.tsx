import React, { useState } from 'react';
import { panels, panelThemes, type PanelId } from '@/data/panelData';
import PanelContent from './PanelContent';
import { ChevronUp, ChevronDown } from 'lucide-react';

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
            {/* Strip (always visible) */}
            {!isActive && (
              <button
                onClick={() => setActivePanel(panel.id)}
                className="panel-strip w-full border-b border-foreground/5"
              >
                <div className="flex items-center gap-3">
                  {index < activeIndex ? (
                    <ChevronDown className="w-4 h-4 opacity-40" />
                  ) : (
                    <ChevronUp className="w-4 h-4 opacity-40" />
                  )}
                  <span className="text-sm font-semibold tracking-wide">{panel.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono opacity-80">{panel.price}</span>
                  <span className={`text-xs font-medium ${panel.positive ? 'text-green-400' : 'text-red-400'}`}>
                    {panel.changePercent}
                  </span>
                </div>
              </button>
            )}

            {/* Expanded content */}
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
