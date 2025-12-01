import React from 'react';

interface SummaryCardProps {
  label: string;
  value: number;
  isCurrency?: boolean;
  highlight?: boolean;
  subtext?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ 
  label, 
  value, 
  isCurrency = true, 
  highlight = false,
  subtext
}) => {
  return (
    <div className={`p-4 rounded-xl shadow-sm border ${highlight ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-100'}`}>
      <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{label}</p>
      <div className="mt-1 flex items-baseline">
        <span className={`text-2xl font-bold ${highlight ? 'text-orange-600' : 'text-gray-900'}`}>
          {isCurrency ? `$${value.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : value}
        </span>
      </div>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  );
};