import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Coins } from 'lucide-react';

export const MarketData: React.FC = () => {
  // 1. Khai báo các State để lưu trữ dữ liệu
  const [usd, setUsd] = useState<number | null>(null);
  const [gold, setGold] = useState<string | null>(null);
  const [silver, setSilver] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Sử dụng useEffect để gọi API khi component được render lần đầu
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // --- LẤY TỶ GIÁ USD ---
        // Sử dụng proxy (api.codetabs.com) để tránh lỗi CORS khi gọi API từ trình duyệt
        const usdRes = await fetch('https://api.codetabs.com/v1/proxy?quest=https://vn.investing.com/currencies/usd-vnd');
        const usdHtml = await usdRes.text();
        
        // Dùng Regex để tìm giá trị tỷ giá nằm trong mã HTML của trang web
        const match = usdHtml.match(/data-test="instrument-price-last"[^>]*>([\d,.]+)</);
        if (match && match[1]) {
          const price = parseFloat(match[1].replace(/,/g, ''));
          setUsd(price);
        } else {
          // Nếu cách 1 thất bại, dùng API dự phòng
          const fallbackRes = await fetch('https://open.er-api.com/v6/latest/USD');
          const fallbackData = await fallbackRes.json();
          if (fallbackData && fallbackData.rates && fallbackData.rates.VND) {
            setUsd(fallbackData.rates.VND);
          }
        }

        // --- LẤY GIÁ VÀNG SJC ---
        const sjcApiUrl = 'https://sjc.com.vn/GoldPrice/Services/PriceService.ashx';
        const goldRes = await fetch(sjcApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ method: 'GetSJCGoldPriceByDate' })
        });
        
        const goldData = await goldRes.json();
        if (goldData && goldData.success && goldData.data) {
          // Lọc tìm giá vàng SJC 1L tại chi nhánh Hồ Chí Minh
          const hcmGold = goldData.data.find((item: any) => 
            item.BranchName === 'Hồ Chí Minh' && item.TypeName.includes('SJC 1L')
          );
          
          if (hcmGold && hcmGold.Sell) {
            setGold(`${hcmGold.Sell} VNĐ/lượng`);
          } else if (goldData.data.length > 0 && goldData.data[0].Sell) {
            setGold(`${goldData.data[0].Sell} VNĐ/lượng`);
          } else {
            setGold('Không tìm thấy giá');
          }
        } else {
           setGold('Lỗi dữ liệu');
        }

        // --- LẤY GIÁ BẠC DOJI ---
        // Doji trả về file text, ta dùng proxy để lấy nội dung file đó
        const silverRes = await fetch('https://api.codetabs.com/v1/proxy?quest=https://giabac.doji.vn/data/DataBac9991Luong.txt');
        const silverText = await silverRes.text();
        
        // File text có nhiều dòng, mỗi dòng là 1 thời điểm cập nhật. Ta lấy dòng cuối cùng (mới nhất)
        const lines = silverText.trim().split('\n');
        if (lines.length > 0) {
          const lastLine = lines[lines.length - 1];
          // Dữ liệu có dạng: GiáMua|GiáBán|ThờiGian
          const parts = lastLine.split('|');
          if (parts.length >= 2) {
            const sellPrice = parseInt(parts[1], 10); // Lấy giá bán (phần tử thứ 2)
            if (!isNaN(sellPrice)) {
              // Format số tiền có dấu phẩy (VD: 3.335.000)
              setSilver(`${new Intl.NumberFormat('vi-VN').format(sellPrice)} VNĐ/lượng`);
            } else {
              setSilver('Lỗi dữ liệu');
            }
          } else {
            setSilver('Lỗi dữ liệu');
          }
        } else {
          setSilver('Không tìm thấy giá');
        }

      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thị trường:", error);
        setGold('Lỗi kết nối');
        setSilver('Lỗi kết nối');
      } finally {
        setIsLoading(false);
      }
    };

    // Gọi hàm lấy dữ liệu ngay lập tức
    fetchData();
    
    // 3. Thiết lập tự động cập nhật lại mỗi 5 phút (300,000 milliseconds)
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    
    // Cleanup function: Xóa bộ đếm thời gian khi component bị hủy
    return () => clearInterval(interval);
  }, []);

  // 4. Render giao diện
  return (
    <div className="flex items-center space-x-3 sm:space-x-6">
      {/* Khối hiển thị Vàng */}
      <div className="flex items-center space-x-2">
        <TrendingUp className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-medium leading-none">Vàng SJC</span>
          <span className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">
            {isLoading && !gold ? '...' : gold || '--'}
          </span>
        </div>
      </div>
      
      {/* Đường gạch dọc phân cách */}
      <div className="w-px h-6 bg-gray-200 dark:bg-gray-800"></div>

      {/* Khối hiển thị Bạc */}
      <div className="flex items-center space-x-2">
        <Coins className="w-4 h-4 text-gray-400 dark:text-gray-300" />
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-medium leading-none">Bạc Doji</span>
          <span className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">
            {isLoading && !silver ? '...' : silver || '--'}
          </span>
        </div>
      </div>

      {/* Đường gạch dọc phân cách */}
      <div className="w-px h-6 bg-gray-200 dark:bg-gray-800"></div>

      {/* Khối hiển thị USD */}
      <div className="flex items-center space-x-2">
        <DollarSign className="w-4 h-4 text-green-600 dark:text-green-500" />
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-medium leading-none">USD</span>
          <span className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">
            {isLoading && !usd ? '...' : (usd ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(usd) : '--')}
          </span>
        </div>
      </div>
    </div>
  );
};
