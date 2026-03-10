import { Transaction, WeeklyStats, Category } from './types';

// 1. Định dạng tiền VND chuẩn Việt Nam
export const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

// 2. Logic tính toán thống kê tuần (Dùng cho Dashboard và AI)
export const getWeeklyStats = (transactions: Transaction[]): WeeklyStats => {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);

  // Phân bổ theo danh mục (Bao gồm cả các mục Cá nhân, Học tập, Sức khỏe anh mới thêm)
  const categoryMap = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<Category, number>);

  const categoryBreakdown = Object.entries(categoryMap)
    .map(([category, amount]) => ({
      category: category as Category,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Phân bổ theo ngày (Dùng cho biểu đồ)
  const dailyMap = transactions.reduce((acc, t) => {
    const date = t.date.split('T')[0];
    acc[date] = (acc[date] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const dailyBreakdown = Object.entries(dailyMap)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    weekStart: '', // Sẽ được tính toán nếu cần hiển thị khoảng thời gian
    weekEnd: '',
    total,
    dailyBreakdown,
    categoryBreakdown,
  };
};

// 3. Logic Xuất file Excel (CSV) - Thiết kế bởi Tech Chef Tú
export const exportToExcel = (transactions: Transaction[], total: number) => {
  // Tiêu đề cột
  const headers = ['Ngày', 'Danh mục', 'Số tiền (VND)', 'Ghi chú'];
  
  // Dữ liệu chi tiết
  const rows = transactions.map(t => [
    t.date.split('T')[0],
    t.category,
    t.amount.toString(),
    t.note || ''
  ]);

  // Dòng tổng kết cuối cùng
  const summary = [
    [], // Dòng trống
    ['TỔNG CỘNG', '', total.toString(), ''],
    ['NGÀY XUẤT', '', new Date().toLocaleString('vi-VN'), ''],
    ['BÁO CÁO TỪ', '', 'TECH CHEF TÚ', '']
  ];

  // Chuyển thành định dạng CSV với mã BOM (\uFEFF) để Excel không lỗi font tiếng Việt
  const csvContent = "\uFEFF" + [headers, ...rows, ...summary]
    .map(e => e.join(","))
    .join("\n");

  // Tạo và tải file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  link.setAttribute("href", url);
  link.setAttribute("download", `Bao-cao-chi-tieu-WeekWallet.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};