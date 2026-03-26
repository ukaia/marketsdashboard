export type PanelId = 'largecap' | 'midcap' | 'foreign' | 'bonds' | 'bitcoin';

export interface Headline {
  title: string;
  source: string;
  time: string;
  url?: string;
}

export interface PanelInfo {
  id: PanelId;
  label: string;
  ticker: string;
  holdings?: string[];
}

export const panels: PanelInfo[] = [
  { id: 'largecap', label: 'Large Cap', ticker: 'S&P 500 (SPY)', holdings: ['AAPL', 'MSFT', 'NVDA', 'AMZN', 'GOOGL', 'META'] },
  { id: 'midcap', label: 'Small Cap', ticker: 'Russell 2000 (IWM)', holdings: ['SMCI', 'CORT', 'TASK', 'LUMN', 'AEHR'] },
  { id: 'foreign', label: 'International', ticker: 'MSCI EAFE (EFA)', holdings: ['NESN', 'ASML', 'SAP', 'NOVO-B', 'SHEL'] },
  { id: 'bonds', label: 'Long-Term Bonds', ticker: 'Long-Term Treasury (TLT)', holdings: ['TLT', 'AGG', 'BND', 'TIPS', 'HYG'] },
  { id: 'bitcoin', label: 'Bitcoin', ticker: 'BTC/USD' },
];

export const panelThemes: Record<PanelId, { bg: string; strip: string; accent: string }> = {
  largecap: { bg: 'bg-panel-largecap', strip: 'bg-panel-largecap', accent: 'text-panel-largecap-accent' },
  midcap: { bg: 'bg-panel-midcap', strip: 'bg-panel-midcap', accent: 'text-panel-midcap-accent' },
  foreign: { bg: 'bg-panel-foreign', strip: 'bg-panel-foreign', accent: 'text-panel-foreign-accent' },
  bonds: { bg: 'bg-panel-bonds', strip: 'bg-panel-bonds', accent: 'text-panel-bonds-accent' },
  bitcoin: { bg: 'bg-panel-bitcoin', strip: 'bg-panel-bitcoin', accent: 'text-panel-bitcoin-accent' },
};
