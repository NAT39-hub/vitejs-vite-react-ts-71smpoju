import React, { useState } from 'react';
import { PlusCircle, Calendar as CalendarIcon, Tag, AlignLeft, DollarSign } from 'lucide-react';
import { Category } from '../types';

interface TransactionFormProps {
  onAdd: (amount: number, category: Category, note: string, date: string) => void;
}

const CATEGORIES: Category[] = [
  'Ăn uống', 'Di chuyển', 'Cà phê', 'Mua sắm', 
  'Hóa đơn', 'Cá nhân', 'Học tập', 'Sức khỏe', 'Khác'
];

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd }) => {
  const [amountDisplay, setAmountDisplay] = useState('');
  const [category, setCategory] = useState<Category>('Ăn uống');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Hàm tự động định dạng số 20.000 khi anh Tú gõ
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ''); // Bỏ hết chữ, chỉ lấy số
    if (rawValue) {
      const formatted = parseInt(rawValue, 10).toLocaleString('vi-VN').replace(/,/g, '.');
      setAmountDisplay(formatted);
    } else {
      setAmountDisplay('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Chuyển lại chuỗi 20.000 thành số 20000 để lưu trữ
    const numericAmount = parseInt(amountDisplay.replace(/\./g, ''), 10);
    if (!numericAmount || isNaN(numericAmount)) return;
    
    onAdd(numericAmount, category, note, date);
    setAmountDisplay('');
    setNote('');
  };

  return (
    <div className="bg-white border border-slate-200 shadow-xl rounded-[2.5rem] p-8 relative overflow-hidden group animate-fade-in-up">
      <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center">
        <PlusCircle className="w-6 h-6 mr-3 text-indigo-600" />
        Thêm chi tiêu mới
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Số tiền (VND)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-amber-500" />
            </div>
            <input 
              type="text" required value={amountDisplay} 
              onChange={handleAmountChange} 
              className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 font-bold text-slate-900 transition-all text-lg" 
              placeholder="Ví dụ: 50.000" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Danh mục</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Tag className="h-5 w-5 text-indigo-500" />
              </div>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value as Category)} 
                className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900 appearance-none"
              >
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Ngày tháng</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <CalendarIcon className="h-5 w-5 text-rose-500" />
              </div>
              {/* Ô Lịch đã được phủ lớp kính mờ (backdrop-blur) theo ý anh */}
              <input 
                type="date" required value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="block w-full pl-12 pr-4 py-4 bg-white/30 backdrop-blur-md border border-slate-200/50 shadow-inner rounded-2xl focus:ring-2 focus:ring-rose-500 font-bold text-slate-900 transition-all relative z-0" 
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Ghi chú</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 pt-4 pointer-events-none">
              <AlignLeft className="h-5 w-5 text-emerald-500" />
            </div>
            <textarea 
              value={note} onChange={(e) => setNote(e.target.value)} rows={2} 
              className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900 resize-none" 
              placeholder="Nhập bí mật vào đây ^^" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full py-5 rounded-2xl font-black text-white uppercase tracking-widest
                     bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#B8860B]
                     shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:-translate-y-1 active:scale-95 transition-all animate-shine"
        >
          Ấn để thêm mục đã đớp.
        </button>
      </form>
    </div>
  );
};