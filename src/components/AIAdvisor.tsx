// ... các dòng import giữ nguyên
const getAdvice = async () => {
  // ... đoạn kiểm tra giao dịch giữ nguyên
  try {
    // NHẬP KEY Ở ĐÂY: Phải có dấu ngoặc kép bao quanh mã AIza...
    const apiKey = "AIzaSyCM9xG-THrJgtvmtUVMmSsSvDJ6DCQJhLY"; 

    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-pro',
    });

    const prompt = `Phân tích chi tiêu tuần này giúp tôi: ${stats.total} VND...`;
    const result = await model.generateContent(prompt);
    setAdvice(result.response.text());
  } catch (err: any) {
    setError("Lỗi: " + err.message);
  } finally {
    setLoading(false);
  }
};