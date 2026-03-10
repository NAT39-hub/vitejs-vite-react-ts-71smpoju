import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { WeeklyStats, Transaction } from '../types';
import { formatVND, exportToExcel } from '../utils';
import { Download, ChartPie, TrendingUp, ArrowUpRight } from 'lucide-react';

interface DashboardProps {
  stats: WeeklyStats;
  transactions: Transaction[];
}

const COLORS = ['#4f46e5', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

export const Dashboard: React.FC<DashboardProps> = ({ stats, transactions }) => {
  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Card Tổng chi tiêu - Đã đổi tiêu đề cho anh Tú */}
      <div className="relative group overflow-hidden bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] p-10 transition-all duration-500 hover:shadow-indigo-100/50">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <TrendingUp className="w-32 h-32 text-indigo-600" />
        </div>
        <div className="relative z-10">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Tuần này đã chi</h2>
          <div className="flex items-baseline space-x-2">
            <span className="text-6xl font-black text-slate-900 tracking-tighter">
              {formatVND(stats.total).replace('₫', '')}
            </span>
            <span className="text-2xl font-bold text-indigo-500">VND</span>
          </div>
          <div className="mt-6 flex items-center text-emerald-600 text-sm font-bold bg-emerald-50 w-fit px-4 py-2 rounded-2xl">
            <ArrowUpRight className="w-4 h-4 mr-1" /> +2.4% so với tuần trước
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Biểu đồ Lịch sử chi tiêu */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-[2rem] p-8">
          <h3 className="text-lg font-bold text-slate-800 mb-8 flex items-center">
            <TrendingUp className="w-5 h-5 mr-3 text-blue-500" /> Lịch sử chi tiêu
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.dailyBreakdown}>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} dy={10} />
                <YAxis hide />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="amount" radius={[8, 8, 8, 8]} fill="#4f46e5" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ Cơ cấu danh mục */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-[2rem] p-8">
          <h3 className="text-lg font-bold text-slate-800 mb-8 flex items-center">
            <ChartPie className="w-5 h-5 mr-3 text-emerald-500" /> Cơ cấu danh mục
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.categoryBreakdown} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="amount" nameKey="category">
                  {stats.categoryBreakdown.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} cornerRadius={10} />)}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 600 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* NÚT XUẤT BÁO CÁO GOLD PREMIUM */}
      <div className="pt-6 flex flex-col items-center">
        <button 
          onClick={() => exportToExcel(transactions, stats.total)} 
          className="w-full max-w-lg relative overflow-hidden group py-5 px-10 rounded-3xl 
                     bg-gradient-to-br from-[#D4AF37] via-[#FFD700] to-[#B8860B]
                     hover:from-[#FFD700] hover:to-[#D4AF37]
                     text-white font-black text-lg shadow-[0_10px_40px_rgba(212,175,55,0.3)]
                     transition-all duration-300 hover:-translate-y-2 active:scale-95 uppercase tracking-widest"
        >
          <div className="flex items-center justify-center relative z-10">
            <Download className="w-6 h-6 mr-3 group-hover:animate-bounce" />
            Xuất báo cáo VIP .Excel
          </div>
          {/* Hiệu ứng tia chớp lướt qua khi hover */}
          <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
        </button>
        <p className="mt-5 text-[10px] text-slate-400 uppercase tracking-[0.5em] font-black">
          Authentic Product by <span className="text-amber-600">Tech Chef Tú</span>
        </p>
      </div>
    </div>
  );
};