import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, Category } from './types';
import { getWeeklyStats } from './utils';
import { Dashboard } from './components/Dashboard';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { AIAdvisor } from './components/AIAdvisor';
import { Wallet, ShieldCheck } from 'lucide-react';
import { MarketData } from './components/MarketData';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('transactions');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const stats = useMemo(() => getWeeklyStats(transactions), [transactions]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = (amount: number, category: Category, note: string, date: string) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount, category, note, date,
    };
    setTransactions((prev) => [newTransaction, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Anh Tú chắc chắn muốn xóa giao dịch này chứ?')) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100 relative overflow-x-hidden">
      {/* Hiệu ứng nền Blur nghệ thuật */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[120px] pointer-events-none"></div>

      <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-3 rounded-2xl shadow-lg shadow-indigo-200">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-indigo-600">
                WeekWallet
              </h1>
              <div className="flex items-center text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3 mr-1" /> Premium Advisor
              </div>
            </div>
          </div>
          <div className="hidden md:block">
             <MarketData />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Cột trái: Nhập liệu & AI (Chiếm 4 phần) */}
          <div className="lg:col-span-4 space-y-10">
            <TransactionForm onAdd={handleAddTransaction} />
            <AIAdvisor transactions={transactions} stats={stats} />
          </div>

          {/* Cột phải: Thống kê & Danh sách (Chiếm 8 phần) */}
          <div className="lg:col-span-8 space-y-10">
            <Dashboard stats={stats} transactions={transactions} />
            <div className="bg-white/50 backdrop-blur-md rounded-3xl border border-white/40 p-1">
               <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 text-center border-t border-slate-200/60 bg-white/30 backdrop-blur-md">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-[0.3em]">
          Masterpiece by <span className="text-slate-800 font-bold">Tech Chef Tú</span> © 2026
        </p>
      </footer>
    </div>
  );
}