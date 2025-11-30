
import React, { useState } from 'react';

interface ChartData {
  date: string;
  production: number;
  revenue: number;
}

interface TrendChartProps {
  data: ChartData[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-xs text-gray-400 italic">
        No hay datos suficientes para graficar.
      </div>
    );
  }

  // Dimensions
  const height = 160;
  const width = 300;
  const padding = 20;
  const chartHeight = height - padding * 2;
  const chartWidth = width - padding * 2;

  // Calculate Max Y for scaling
  const maxVal = Math.max(
    ...data.map(d => Math.max(d.production, d.revenue)),
    10 // Minimum scale fallback
  );

  // Helper to map values to coordinates
  const getX = (index: number) => {
    if (data.length <= 1) return padding + chartWidth / 2;
    return padding + (index / (data.length - 1)) * chartWidth;
  };

  const getY = (value: number) => {
    return height - padding - (value / maxVal) * chartHeight;
  };

  // Generate Path Strings
  const productionPath = data.length > 1 
    ? data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.production)}`).join(' ')
    : '';

  const revenuePath = data.length > 1 
    ? data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.revenue)}`).join(' ')
    : '';

  return (
    <div className="w-full bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Tendencia (Últimos 7 días)</h4>
        <div className="flex gap-3">
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="text-[10px] text-gray-500">Ingresos</span>
            </div>
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-[10px] text-gray-500">Costos</span>
            </div>
        </div>
      </div>
      
      <div className="relative w-full aspect-[2/1] min-h-[160px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
            <line 
              key={tick}
              x1={padding} 
              y1={getY(maxVal * tick)} 
              x2={width - padding} 
              y2={getY(maxVal * tick)} 
              stroke="#f3f4f6" 
              strokeWidth="1" 
              strokeDasharray="4"
            />
          ))}

          {/* Lines */}
          {data.length > 1 && (
            <>
              <path d={productionPath} fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d={revenuePath} fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </>
          )}

          {/* Data Points and Interaction */}
          {data.map((d, i) => (
            <g 
              key={i} 
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
            >
              {/* Invisible Hit Area */}
              <rect x={getX(i) - 15} y={0} width={30} height={height} fill="transparent" />
              
              {/* Vertical Guideline on Hover */}
              {hoveredIndex === i && (
                <line 
                  x1={getX(i)} 
                  y1={padding} 
                  x2={getX(i)} 
                  y2={height - padding} 
                  stroke="#e5e7eb" 
                  strokeWidth="1" 
                  strokeDasharray="2" 
                />
              )}

              {/* Production Dot */}
              <circle 
                cx={getX(i)} 
                cy={getY(d.production)} 
                r={hoveredIndex === i ? 5 : 3} 
                fill="white" 
                stroke="#f97316" 
                strokeWidth="2" 
                className="transition-all duration-200"
              />
              
              {/* Revenue Dot */}
              <circle 
                cx={getX(i)} 
                cy={getY(d.revenue)} 
                r={hoveredIndex === i ? 5 : 3} 
                fill="white" 
                stroke="#a855f7" 
                strokeWidth="2" 
                className="transition-all duration-200"
              />
              
              {/* X Axis Label */}
              <text 
                x={getX(i)} 
                y={height} 
                textAnchor="middle" 
                fontSize="10" 
                fill={hoveredIndex === i ? '#374151' : '#9ca3af'}
                fontWeight={hoveredIndex === i ? 'bold' : 'normal'}
              >
                {d.date}
              </text>
            </g>
          ))}

          {/* Tooltip */}
          {hoveredIndex !== null && (() => {
             const d = data[hoveredIndex];
             const x = getX(hoveredIndex);
             const tooltipWidth = 110;
             const tooltipHeight = 60;
             // Ensure tooltip stays within bounds
             let tx = x - tooltipWidth / 2;
             if (tx < 0) tx = 0;
             if (tx + tooltipWidth > width) tx = width - tooltipWidth;
             
             return (
               <g transform={`translate(${tx}, 0)`} className="pointer-events-none drop-shadow-lg">
                 <rect width={tooltipWidth} height={tooltipHeight} rx="6" fill="#1f2937" fillOpacity="0.95" />
                 
                 <text x={tooltipWidth/2} y="16" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">
                   {d.date}
                 </text>
                 
                 <circle cx="12" cy="32" r="3" fill="#a855f7" />
                 <text x="22" y="35" fill="#e9d5ff" fontSize="10" fontWeight="500">
                   Ing: ${d.revenue.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                 </text>
                 
                 <circle cx="12" cy="48" r="3" fill="#f97316" />
                 <text x="22" y="51" fill="#ffedd5" fontSize="10" fontWeight="500">
                   Cost: ${d.production.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                 </text>
               </g>
             );
          })()}

        </svg>
      </div>
    </div>
  );
};
