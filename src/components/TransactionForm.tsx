import React, { useState } from 'react';
import { PlusCircle, Calendar as CalendarIcon, Tag, AlignLeft, DollarSign, ChevronLeft, ChevronRight, Check } from 'lucide-react';
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
  
  // State cho bộ Lịch VIP Custom
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  // Hàm định dạng số 20.000
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ''); 
    if (rawValue) {
      const formatted = parseInt(rawValue, 10).toLocaleString('vi-VN').replace(/,/g, '.');
      setAmountDisplay(formatted);
    } else {
      setAmountDisplay('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseInt(amountDisplay.replace(/\./g, ''), 10);
    if (!numericAmount || isNaN(numericAmount)) return;
    
    onAdd(numericAmount, category, note, date);
    setAmountDisplay('');
    setNote('');
  };

  // Logic vẽ Lịch
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Bắt đầu từ Thứ 2

  const handleSelectDay = (day: number) => {
    const yyyy = year;
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    setDate(`${yyyy}-${mm}-${dd}`);
  };

  return (
    <div className="bg-white border border-slate-200 shadow-xl rounded-[2.5rem] p-8 relative">
      <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center">
        <PlusCircle className="w-6 h-6 mr-3 text-indigo-600" />
        Thêm chi tiêu mới
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nhập số tiền */}
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
          {/* Nhập danh mục */}
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

          {/* Ô Chọn Ngày - Đã thay bằng nút bấm mở Lịch Custom */}
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Ngày tháng</label>
            <button 
              type="button"
              onClick={() => setShowDatePicker(true)}
              className="relative w-full text-left pl-12 pr-4 py-4 bg-slate-50 hover:bg-slate-100 rounded-2xl font-bold text-slate-900 transition-all flex items-center"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-rose-500" />
              </div>
              {date.split('-').reverse().join('/')} {/* Hiện định dạng DD/MM/YYYY */}
            </button>
          </div>
        </div>

        {/* Nhập ghi chú */}
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
          ẤN ĐỂ THÊM MỤC ĐÃ ĐỚP.
        </button>
      </form>

      {/* POPUP LỊCH VIP KÍNH MỜ (100% TIẾNG VIỆT) */}
      {showDatePicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-[#1e293b]/90 backdrop-blur-2xl border border-slate-700 shadow-2xl rounded-[2.5rem] p-6 w-full max-w-[320px] text-white">
            
            {/* Tiêu đề Tháng Năm */}
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-bold tracking-tight text-white">
                Tháng {month + 1} <span className="text-indigo-400">{year}</span>
              </h4>
              <div className="flex space-x-2">
                <button type="button" onClick={() => setCalendarMonth(new Date(year, month - 1))} className="p-2 hover:bg-slate-700 rounded-full transition-all">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button type="button" onClick={() => setCalendarMonth(new Date(year, month + 1))} className="p-2 hover:bg-slate-700 rounded-full transition-all">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Các Thứ trong tuần */}
            <div className="grid grid-cols-7 gap-1 mb-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => <div key={d}>{d}</div>)}
            </div>

            {/* Các Ngày */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startOffset }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected = date === `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleSelectDay(day)}
                    className={`h-10 w-full rounded-2xl flex items-center justify-center font-bold text-sm transition-all
                      ${isSelected ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/50' : 'text-slate-200 hover:bg-slate-700'}
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Nút Xong */}
            <div className="mt-6 flex justify-end">
              <button 
                type="button"
                onClick={() => setShowDatePicker(false)}
                className="flex items-center px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-bold transition-all active:scale-95"
              >
                <Check className="w-4 h-4 mr-2" /> Xong
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};