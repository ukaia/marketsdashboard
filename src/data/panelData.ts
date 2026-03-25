export type PanelId = 'largecap' | 'midcap' | 'foreign' | 'bonds' | 'bitcoin';

export interface Headline {
  title: string;
  source: string;
  time: string;
}

export interface PanelData {
  id: PanelId;
  label: string;
  ticker: string;
  price: string;
  change: string;
  changePercent: string;
  positive: boolean;
  sparkline: number[];
  headlines: Headline[];
  holdings?: string[];
}

export const panels: PanelData[] = [
  {
    id: 'largecap',
    label: 'Large Cap',
    ticker: 'S&P 500',
    price: '5,248.32',
    change: '+28.41',
    changePercent: '+0.54%',
    positive: true,
    sparkline: [5200, 5210, 5205, 5220, 5235, 5228, 5240, 5248, 5245, 5250, 5248, 5252, 5248],
    holdings: ['AAPL', 'MSFT', 'NVDA', 'AMZN', 'GOOGL', 'META'],
    headlines: [
      { title: 'S&P 500 hits new intraday high as tech rallies', source: 'Reuters', time: '12m ago' },
      { title: 'Apple announces $110B buyback, largest in history', source: 'CNBC', time: '34m ago' },
      { title: 'Fed signals patience on rate cuts amid sticky inflation', source: 'Bloomberg', time: '1h ago' },
      { title: 'Nvidia earnings crush estimates, guides higher', source: 'MarketWatch', time: '2h ago' },
    ],
  },
  {
    id: 'midcap',
    label: 'Mid Cap',
    ticker: 'S&P 400',
    price: '3,012.87',
    change: '+15.23',
    changePercent: '+0.51%',
    positive: true,
    sparkline: [2990, 2995, 3000, 2998, 3005, 3008, 3002, 3010, 3015, 3012, 3014, 3013, 3012],
    holdings: ['DECK', 'WSM', 'TOST', 'FND', 'EWBC'],
    headlines: [
      { title: 'Mid-cap stocks outperform as rotation trade gains steam', source: 'Barron\'s', time: '18m ago' },
      { title: 'Regional banks rally on improved net interest margins', source: 'Reuters', time: '45m ago' },
      { title: 'Deckers Outdoor surges on strong HOKA demand', source: 'CNBC', time: '1h ago' },
      { title: 'Toast platform sees record restaurant signups in Q1', source: 'TechCrunch', time: '3h ago' },
    ],
  },
  {
    id: 'foreign',
    label: 'International',
    ticker: 'MSCI EAFE',
    price: '2,387.15',
    change: '-12.08',
    changePercent: '-0.50%',
    positive: false,
    sparkline: [2400, 2398, 2395, 2392, 2390, 2388, 2385, 2390, 2387, 2385, 2388, 2386, 2387],
    holdings: ['NESN', 'ASML', 'SAP', 'NOVO-B', 'SHEL'],
    headlines: [
      { title: 'European markets slide on ECB hawkish commentary', source: 'FT', time: '8m ago' },
      { title: 'Japan Nikkei 225 retreats from record highs', source: 'Nikkei', time: '1h ago' },
      { title: 'ASML warns of slower China orders amid export controls', source: 'Reuters', time: '2h ago' },
      { title: 'Novo Nordisk Wegovy demand outstrips supply globally', source: 'Bloomberg', time: '4h ago' },
    ],
  },
  {
    id: 'bonds',
    label: 'Bonds',
    ticker: '10Y Treasury',
    price: '4.482%',
    change: '+0.031',
    changePercent: '+0.70%',
    positive: false,
    sparkline: [4.45, 4.46, 4.47, 4.46, 4.48, 4.47, 4.49, 4.48, 4.50, 4.49, 4.48, 4.482, 4.482],
    holdings: ['TLT', 'AGG', 'BND', 'TIPS', 'HYG'],
    headlines: [
      { title: '10-year yield climbs above 4.5% on hot jobs data', source: 'CNBC', time: '15m ago' },
      { title: 'Bond traders price out June rate cut after payrolls', source: 'Bloomberg', time: '42m ago' },
      { title: 'Treasury auction sees weak demand, tails by 2bps', source: 'Reuters', time: '2h ago' },
      { title: 'Corporate bond spreads tighten to post-GFC lows', source: 'FT', time: '5h ago' },
    ],
  },
  {
    id: 'bitcoin',
    label: 'Bitcoin',
    ticker: 'BTC/USD',
    price: '68,432.10',
    change: '+1,247.30',
    changePercent: '+1.86%',
    positive: true,
    sparkline: [67200, 67400, 67800, 68000, 67600, 67900, 68200, 68100, 68400, 68350, 68500, 68450, 68432],
    headlines: [
      { title: 'Bitcoin ETFs see $780M net inflows, largest single day', source: 'CoinDesk', time: '5m ago' },
      { title: 'MicroStrategy adds 12,000 BTC to treasury reserves', source: 'The Block', time: '28m ago' },
      { title: 'SEC approves options trading on spot Bitcoin ETFs', source: 'Reuters', time: '1h ago' },
      { title: 'Bitcoin mining difficulty reaches all-time high post-halving', source: 'CoinTelegraph', time: '3h ago' },
    ],
  },
];

export const panelThemes: Record<PanelId, { bg: string; strip: string; accent: string }> = {
  largecap: {
    bg: 'bg-panel-largecap',
    strip: 'bg-panel-largecap',
    accent: 'text-panel-largecap-accent',
  },
  midcap: {
    bg: 'bg-panel-midcap',
    strip: 'bg-panel-midcap',
    accent: 'text-panel-midcap-accent',
  },
  foreign: {
    bg: 'bg-panel-foreign',
    strip: 'bg-panel-foreign',
    accent: 'text-panel-foreign-accent',
  },
  bonds: {
    bg: 'bg-panel-bonds',
    strip: 'bg-panel-bonds',
    accent: 'text-panel-bonds-accent',
  },
  bitcoin: {
    bg: 'bg-panel-bitcoin',
    strip: 'bg-panel-bitcoin',
    accent: 'text-panel-bitcoin-accent',
  },
};
