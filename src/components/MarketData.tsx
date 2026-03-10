import React from 'react';
import { TrendingUp, Coins, DollarSign } from 'lucide-react';

export const MarketData: React.FC = () => {
  // Dữ liệu USD Chợ Đen anh gửi
  const marketRates = [
    { label: 'VÀNG SJC', value: '186.100', unit: 'K/Lượng', icon: <TrendingUp className="w-3 h-3 text-amber-500" /> },
    { label: 'BẠC DOJI', value: '3.466', unit: 'K/Lượng', icon: <Coins className="w-3 h-3 text-slate-400" /> },
    { label: 'USD CHỢ ĐEN', value: '27.150 - 27.200', unit: 'đ', icon: <DollarSign className="w-3 h-3 text-emerald-500" /> }
  ];

  return (
    <div className="flex items-center space-x-8">
      {marketRates.map((rate, index) => (
        <div key={index} className="flex items-center space-x-2 whitespace-nowrap">
          <div className="p-1.5 bg-slate-50 rounded-lg">{rate.icon}</div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{rate.label}</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-xs font-black text-slate-800 tracking-tight">{rate.value}</span>
              <span className="text-[10px] font-bold text-slate-400 underline decoration-slate-200">{rate.unit}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};