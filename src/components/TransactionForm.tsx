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
  
  // State cho bộ Lịch VIP (Clone Apple style)
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
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // T2 là ngày đầu tuần

  const handleSelectDay = (day: number) => {
    const yyyy = year;
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    setDate(`${yyyy}-${mm}-${dd}`);
  };

  const handleResetDate = () => {
    const today = new Date();
    setCalendarMonth(today);
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setDate(`${yyyy}-${mm}-${dd}`);
  };

  return (
    <div className="bg-white border border-slate-200 shadow-xl rounded-[2.5rem] p-8 relative">
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
            <button 
              type="button"
              onClick={() => setShowDatePicker(true)}
              className="relative w-full text-left pl-12 pr-4 py-4 bg-slate-50 hover:bg-slate-100 rounded-2xl font-bold text-slate-900 transition-all flex items-center"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-rose-500" />
              </div>
              {/* Hiển thị: 10 thg 3, 2026 */}
              {new Date(date).toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </button>
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
          ẤN ĐỂ THÊM MỤC ĐÃ ĐỚP.
        </button>
      </form>

      {/* POPUP LỊCH VIP - Y HỆT APPLE (Kính mờ, không nền xám) */}
      {showDatePicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Lớp nền trong suốt tuyệt đối để đóng Lịch khi bấm ra ngoài */}
          <div className="absolute inset-0 bg-transparent" onClick={() => setShowDatePicker(false)}></div>
          
          <div className="relative bg-[#1c1c1e]/85 backdrop-blur-2xl shadow-2xl rounded-[32px] p-5 w-full max-w-[320px] text-white animate-fade-in-up border border-white/10">
            
            {/* Header: Tháng Năm */}
            <div className="flex justify-between items-center mb-4 px-1">
              <h4 className="text-[17px] font-semibold tracking-tight text-white flex items-center">
                Tháng {month + 1} {year}
                <ChevronRight className="w-4 h-4 ml-1 text-[#0a84ff]" />
              </h4>
              <div className="flex space-x-3">
                <button type="button" onClick={() => setCalendarMonth(new Date(year, month - 1))} className="p-1 hover:bg-white/10 rounded-full transition-all">
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button type="button" onClick={() => setCalendarMonth(new Date(year, month + 1))} className="p-1 hover:bg-white/10 rounded-full transition-all">
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Thứ trong tuần */}
            <div className="grid grid-cols-7 mb-2 text-center text-[12px] font-medium text-[#ebebf5]/60">
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => <div key={d}>{d}</div>)}
            </div>

            {/* Lưới Ngày */}
            <div className="grid grid-cols-7 gap-y-1 text-center">
              {Array.from({ length: startOffset }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected = date === `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleSelectDay(day)}
                    className="flex justify-center items-center py-1"
                  >
                    <span className={`w-9 h-9 flex items-center justify-center rounded-full text-[19px] transition-all
                      ${isSelected ? 'bg-[#0a84ff] text-white font-semibold shadow-md' : 'text-white hover:bg-white/15 active:bg-white/20'}
                    `}>
                      {day}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Footer: Đặt lại & Xong */}
            <div className="mt-5 flex justify-between items-center px-1">
              <button 
                type="button"
                onClick={handleResetDate}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-[15px] font-medium transition-all"
              >
                Đặt lại
              </button>
              <button 
                type="button"
                onClick={() => setShowDatePicker(false)}
                className="w-10 h-10 bg-[#0a84ff] rounded-full flex items-center justify-center transition-all active:scale-90 shadow-md"
              >
                <Check className="w-5 h-5 text-white" strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};