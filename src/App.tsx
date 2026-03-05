import React, { useState, useEffect } from 'react';
import { Transaction, Category, WeeklyStats } from './types';
import { getWeeklyStats } from './utils';
import { Dashboard } from './components/Dashboard';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { AIAdvisor } from './components/AIAdvisor';
import { Wallet, LogOut, Settings, Sun, Moon } from 'lucide-react';
import { MarketData } from './components/MarketData';
export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('darkMode');
        if (saved !== null) return JSON.parse(saved);
      } catch (e) {
        console.warn('localStorage not available');
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('transactions');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('localStorage not available');
    }
    return [];
  });

  const [stats, setStats] = useState<WeeklyStats>(getWeeklyStats([]));

  useEffect(() => {
    try {
      localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    } catch (e) { }
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    try {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    } catch (e) { }
    setStats(getWeeklyStats(transactions));
  }, [transactions]);

  const handleAddTransaction = (amount: number, category: Category, note: string, date: string) => {
    const newTransaction: Transaction = {
      id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Date.now().toString(),
      amount,
      category,
      note,
      date,
    };
    setTransactions((prev) => [newTransaction, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <MarketData />
        </div>
      </div>
      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 selection:bg-blue-100 dark:selection:bg-blue-900/50 selection:text-blue-900 dark:selection:text-blue-100 transition-colors duration-200">
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 shadow-sm transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">VND Expense</h1>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="sm:hidden block mr-2">
                  <MarketData />
                </div>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-1 space-y-6 sm:space-y-8 animate-fade-in-up">
              <TransactionForm onAdd={handleAddTransaction} />
              <AIAdvisor transactions={transactions} stats={stats} />
            </div>
            <div className="lg:col-span-2 space-y-6 sm:space-y-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <Dashboard stats={stats} isDarkMode={isDarkMode} />
              <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
