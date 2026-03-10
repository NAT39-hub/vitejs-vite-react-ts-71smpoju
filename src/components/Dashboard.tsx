import React from 'react';
import { WeeklyStats, Transaction } from '../types';
import { formatVND } from '../utils';
import { exportToExcel } from '../utils/index';
import { Download, PieChart, TrendingUp, Calendar } from 'lucide-react';

interface DashboardProps {
  stats: WeeklyStats;
  transactions: Transaction[];
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, transactions }) => {
  return (
    <div className="space-y-6">
      {/* Thẻ hiển thị tổng chi tiêu */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium flex items-center">
            <PieChart className="w-4 h-4 mr-2" />
            Tổng chi tiêu tuần này
          </h3>
          <span className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full font-medium">
            {stats.dailyBreakdown.length} ngày ghi nhận
          </span>
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {formatVND(stats.total)}
        </p>
      </div>

      {/* Cơ cấu danh mục (Bao gồm các mục Cá nhân, Học tập, Sức khỏe anh mới thêm) */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
        <h3 className="text-gray-900 dark:text-white font-semibold mb-4 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2 text-indigo-500" />
          Phân bổ chi tiêu
        </h3>
        <div className="space-y-4">
          {stats.categoryBreakdown.map((item) => (
            <div key={item.category}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-600 dark:text-gray-400">{item.category}</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatVND(item.amount)}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(item.amount / stats.total) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NÚT XUẤT BÁO CÁO CỦA ANH TÚ NẰM Ở ĐÂY */}
      <div className="pt-4">
        <button 
          onClick={() => exportToExcel(transactions, stats.total)}
          className="w-full flex items-center justify-center py-4 px-6 rounded-2xl 
                     bg-yellow-500 hover:bg-yellow-600 text-white font-bold 
                     shadow-lg shadow-yellow-500/30 transition-all duration-200 
                     hover:-translate-y-1 active:scale-95 group"
        >
          <div className="bg-white/20 p-2 rounded-lg mr-3 group-hover:rotate-12 transition-transform">
            <Download className="w-5 h-5 text-white" />
          </div>
          XUẤT BÁO CÁO EXCEL (CSV)
        </button>
        <p className="text-center text-[10px] text-gray-400 mt-3 uppercase tracking-widest">
          Phát triển bởi Tech Chef Tú
        </p>
      </div>
    </div>
  );
};