import React from 'react';

interface SparklineProps {
  data: number[];
  positive: boolean;
  accentColor: string;
  width?: number;
  height?: number;
}

const Sparkline: React.FC<SparklineProps> = ({ data, positive, accentColor, width = 280, height = 64 }) => {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const pathD = `M${points.join(' L')}`;

  // Gradient fill
  const fillPoints = [...points, `${width - padding},${height}`, `${padding},${height}`];
  const fillD = `M${fillPoints.join(' L')}Z`;

  const strokeColor = positive ? '#22c55e' : '#ef4444';
  const gradientId = `spark-grad-${accentColor.replace(/[^a-z]/g, '')}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.2" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillD} fill={`url(#${gradientId})`} />
      <path d={pathD} className="sparkline-path" stroke={strokeColor} />
    </svg>
  );
};

export default Sparkline;
