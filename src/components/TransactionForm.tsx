import React, { useState } from 'react';
import { PlusCircle, Calendar as CalendarIcon, Tag, AlignLeft, DollarSign } from 'lucide-react';
import { Category } from '../types';

interface TransactionFormProps {
  onAdd: (amount: number, category: Category, note: string, date: string) => void;
}

// Đã cập nhật danh sách danh mục mới ở đây
const CATEGORIES: Category[] = [
  'Ăn uống', 
  'Di chuyển', 
  'Cà phê', 
  'Mua sắm', 
  'Hóa đơn', 
  'Cá nhân', 
  'Học tập', 
  'Sức khỏe', 
  'Khác'
];

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Ăn uống');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    const dateObj = new Date(date);
    dateObj.setHours(new Date().getHours());
    dateObj.setMinutes(new Date().getMinutes());
    onAdd(Number(amount), category, note, dateObj.toISOString());
    setAmount('');
    setNote('');
  };

  return (
    <div className="bg-white/70 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-6 transition-all duration-300 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-500/10 transition-colors"></div>
      <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
        <PlusCircle className="w-5 h-5 mr-2 text-blue-500" />
        Thêm chi tiêu mới
      </h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền (VND)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="number" 
              required 
              min="0" 
              step="1000" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 text-gray-900 transition-colors" 
              placeholder="Ví dụ: 50000" 
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-4 w-4 text-gray-400" />
              </div>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value as Category)} 
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 text-gray-900 appearance-none transition-colors"
              >
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="date" 
                required 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 text-gray-900 transition-colors" 
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1