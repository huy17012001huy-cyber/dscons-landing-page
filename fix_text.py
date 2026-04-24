import re

def fix_comparison():
    with open('src/components/landing/ComparisonTable.tsx', 'r', encoding='utf-8') as f:
        text = f.read()

    clean_categories = """  const defaultCategories = [
    {
      name: "🎓 THÔNG TIN KHÓA HỌC",
      items: [
        { label: "Số lượng buổi học", dscons: "12 buổi", highlight: False },
        { label: "Thời lượng 1 buổi", dscons: "3 tiếng", highlight: False },
        { label: "Tổng thời lượng", dscons: "36 tiếng", highlight: False },
        { label: "Thời gian hoàn thành", dscons: "1.5 tháng", highlight: True },
        { label: "Học phí/1 buổi", dscons: "~ 300K/ 1 buổi", highlight: True },
        { label: "Học phí/1 tiếng", dscons: "~ 100K/ 1 tiếng", highlight: True },
        { label: "Tổng học phí", dscons: "3900K", highlight: False },
        { label: "Học lại", dscons: "1 lần học lại miễn phí", highlight: False },
      ]
    },
    {
      name: "🎁 QUÀ TẶNG VÀ ƯU ĐÃI",
      items: [
        { label: "QUÀ TẶNG 1 - Giúp dựng full tất cả các hệ cơ điện", dscons: "Khóa học dựng hình 3D trị giá 700K", highlight: False },
        { label: "QUÀ TẶNG 2 - Giúp lập bảng khối lượng tự động tạo lập bộ hồ sơ thiết kế, shopdrawing", dscons: "Khóa học Bóc tách Khối lượng trị giá 1000K", highlight: False },
        { label: "QUÀ TẶNG 3 - Chuyên kiểm soát xử lý va chạm các hệ thống", dscons: "Khóa học Xử lý xung đột va chạm trị giá 700K", highlight: False },
        { label: "QUÀ TẶNG 4 - Giúp vẽ nhanh hơn 30% so với vẽ thủ công, giống lisp Cad", dscons: "Bộ DSCons Tool 4 tháng trị giá 700K", highlight: False },
        { label: "QUÀ TẶNG 5 - Giúp vẽ nhanh hơn", dscons: "Bộ thư viện Family 3D trị giá 2000K", highlight: False },
      ]
    },
    {
      name: "📋 CHẤM BÀI & HỖ TRỢ HỌC TẬP",
      items: [
        { label: "CHẤM BÀI, CHỮA BÀI", dscons: "Chấm chi tiết từng buổi học; có bảng điểm + nhận xét", highlight: False },
        { label: "KÈM CẶP LÀM BTVN", dscons: "Kèm 1-1 từng học viên trên nhóm", highlight: False },
        { label: "MÔ PHỎNG HỆ THỐNG CHO NGƯỜI TRÁI NGÀNH", dscons: "Có video mô phỏng, diễn giải nguyên lý hệ thống", highlight: False },
      ]
    },
    {
      name: "🏅 HÌNH THỨC HỌC & CHỨNG NHẬN",
      items: [
        { label: "HÌNH THỨC HỌC", dscons: "Online qua Zoom hoặc Offline trung tâm tại Hà Nội", highlight: False },
        { label: "CẤP CHỨNG NHẬN", dscons: "Có", highlight: False },
        { label: "BẢO LƯU KHÓA HỌC", dscons: "Có", highlight: False },
      ]
    },
    {
      name: "📞 GIẢI ĐÁP & CAM KẾT",
      items: [
        { label: "Giải đáp trước/sau khóa học", dscons: "Có", highlight: False },
        { label: "CAM KẾT THÀNH THẠO (KHÔNG THÀNH THẠO HOÀN TRẢ 100% HỌC PHÍ)", dscons: "Cam kết trước toàn thể lớp học và được ghi hình lại bằng Video tại buổi 1 (bắt đầu) và buổi 12 (kết thúc)", highlight: True },
      ]
    },
    {
      name: "🏗️ NỘI DUNG HỌC THỰC TẾ",
      items: [
        { label: "HỌC TRÊN CÔNG TRÌNH THỰC TẾ", dscons: "Trên dự án đã triển khai cho Sigma", highlight: False },
        { label: "VIDEO TÓM TẮT BÀI HỌC GIÚP HỌC VIÊN TIẾT KIỆM THỜI GIAN", dscons: "Có", highlight: False },
        { label: "VIDEO QUAY FULL MÀN HÌNH GỬI LẠI HỌC VIÊN", dscons: "Có", highlight: False },
      ]
    },
    {
      name: "💬 TƯƠNG TÁC & ĐỊNH HƯỚNG",
      items: [
        { label: "TƯƠNG TÁC QUA ZOOM", dscons: "DSCons có phương pháp giúp học viên liên tục tương tác", highlight: False },
        { label: "TƯ VẤN LỘ TRÌNH HỌC", dscons: "Tư vấn đầy đủ lộ trình, đào sâu vào từng phần giúp học viên trang bị đầy đủ kiến thức chuyên sâu", highlight: False },
      ]
    },
    {
      name: "⭐ QUY MÔ TRUNG TÂM",
      items: [
        { label: "Số lượng học viên đã đào tạo", dscons: "Offline: 2500 học viên; Online: 20.000 học viên", highlight: False },
      ]
    }
  ];""".replace('False', 'false').replace('True', 'true')

    text = re.sub(r'const defaultCategories = \[.*?\];', clean_categories, text, flags=re.DOTALL)
    
    # Check if there are other corrupted strings in ComparisonTable
    text = text.replace('BÃ¡ÂºÂ£NG SO SÃ’Â NH CHÃ¡ÂºÂ¤T Lï¿½ Â¯Ã¡Â»Â¢NG KHÃ’ï¿½SA HÃ¡Â»ï¿½ C', 'BẢNG SO SÁNH CHẤT LƯỢNG KHÓA HỌC')
    text = text.replace('BÃºÂºÂ£NG SO SÃ NH CHÃºÂºÂ¤T LÃ†Â¯Ã¡Â»Â£NG KHÃ“A HÃ¡Â»ÂŒC', 'BẢNG SO SÁNH CHẤT LƯỢNG KHÓA HỌC')
    text = text.replace('Báº¢NG SO SÃ NH CHáº¤T LÆ¯á»¢NG KHÃ“A Há»ŒC', 'BẢNG SO SÁNH CHẤT LƯỢNG KHÓA HỌC')

    text = text.replace('Báº®T Ä áº¦U SO SÃ NH Tá»° Ä á»˜NG', 'BẮT ĐẦU SO SÁNH TỰ ĐỘNG')
    text = text.replace('TIÃŠU CHÃ  SO SÃ NH', 'TIÊU CHÍ SO SÁNH')
    text = text.replace('TRUNG TÃ‚M KHÃ C', 'TRUNG TÂM KHÁC')
    text = text.replace('TRá»¢ LÃ  AI DSCons NHáº¬N Ä á»ŠNH:', 'TRỢ LÝ AI DSCons NHẬN ĐỊNH:')
    text = text.replace('Ä Äƒng kÃ½ ngay bá»‡ phÃ³ng sá»± nghiá»‡p', 'Đăng ký ngay bệ phóng sự nghiệp')
    text = text.replace('TÆ° váº¥n lá»™ trÃ¬nh 1-1', 'Tư vấn lộ trình 1-1')
    text = text.replace('Ä ANG PHÃ‚N TÃ CH...', 'ĐANG PHÂN TÍCH...')
    text = text.replace('XEM Káº¾T LUáº¬N Tá»ª AI', 'XEM KẾT LUẬN TỪ AI')
    text = text.replace('ChÆ°a cÃ³ thÃ´ng tin', 'Chưa có thông tin')
    text = text.replace('AI Ä‘Ã£ hoÃ n táº¥t phÃ¢n tÃ­ch!', 'AI đã hoàn tất phân tích!')
    text = text.replace('Lá»—i khi phÃ¢n tÃ­ch AI', 'Lỗi khi phân tích AI')


    with open('src/components/landing/ComparisonTable.tsx', 'w', encoding='utf-8') as f:
        f.write(text)

def fix_dashboard():
    with open('src/pages/admin/Dashboard.tsx', 'r', encoding='utf-8') as f:
        text = f.read()

    # Replace sections array
    clean_sections = """  const sections = [
    { id: "header", name: "Giới thiệu (Header)", icon: <LayoutTemplate className="w-4 h-4" /> },
    { id: "pain-points", name: "Vấn đề (PainPoints)", icon: <AlertCircle className="w-4 h-4" /> },
    { id: "benefits", name: "Giải pháp (Solution)", icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: "curriculum", name: "Lộ trình học", icon: <Map className="w-4 h-4" /> },
    { id: "bonus", name: "Quà tặng (Bonus)", icon: <Gift className="w-4 h-4" /> },
    { id: "social", name: "Kết quả (Outcomes)", icon: <Trophy className="w-4 h-4" /> },
    { id: "instructor", name: "Giảng viên", icon: <Users className="w-4 h-4" /> },
    { id: "testimonials", name: "Testimonials", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "pricing", name: "Học phí (Pricing)", icon: <CreditCard className="w-4 h-4" /> },
    { id: "faq", name: "FAQ", icon: <HelpCircle className="w-4 h-4" /> },
    { id: "comparison", name: "Bảng So Sánh", icon: <Scale className="w-4 h-4" /> },
    { id: "cta", name: "Bottom CTA", icon: <MousePointerClick className="w-4 h-4" /> },
    { id: "system-settings", name: "Cài đặt giao diện", icon: <Palette className="w-4 h-4" /> },
  ];"""
    text = re.sub(r'  const sections = \[.*?\];', clean_sections, text, flags=re.DOTALL)

    # Use landingData for all forms! Since they shouldn't be hardcoded if landingData has it.
    text = re.sub(r'const \[heroForm, setHeroForm\] = useState\(\{.*?\}\);', 
                  'const [heroForm, setHeroForm] = useState(landingData.hero);', text, flags=re.DOTALL)
    
    text = re.sub(r'const \[ctaForm, setCtaForm\] = useState\(\{.*?\}\);', 
                  'const [ctaForm, setCtaForm] = useState(landingData.bottomCta);', text, flags=re.DOTALL)
    
    text = re.sub(r'const \[faqForm, setFaqForm\] = useState\(\{.*?\}\);', 
                  'const [faqForm, setFaqForm] = useState(landingData.faq);', text, flags=re.DOTALL)
    
    text = re.sub(r'const \[testimonialsForm, setTestimonialsForm\] = useState\(\{.*?\}\);', 
                  'const [testimonialsForm, setTestimonialsForm] = useState(landingData.testimonials);', text, flags=re.DOTALL)
    
    text = re.sub(r'const \[benefitsForm, setBenefitsForm\] = useState\(\{.*?\}\);', 
                  'const [benefitsForm, setBenefitsForm] = useState(landingData.solution);', text, flags=re.DOTALL)
    
    text = re.sub(r'const \[socialForm, setSocialForm\] = useState\(\{.*?\}\);', 
                  'const [socialForm, setSocialForm] = useState(landingData.outcomes);', text, flags=re.DOTALL)
    
    text = re.sub(r'const \[curriculumForm, setCurriculumForm\] = useState\(\{.*?\}\);', 
                  'const [curriculumForm, setCurriculumForm] = useState(landingData.curriculum);', text, flags=re.DOTALL)

    # For comparisonForm which is NOT in landingData, we just initialize it with default clean text
    clean_comparisonForm = """const [comparisonForm, setComparisonForm] = useState({
    title: "BẢNG SO SÁNH CHẤT LƯỢNG KHÓA HỌC",
    description: "Hãy điền thông tin trung tâm bạn đang phân vân để AI của DSCons giúp bạn đưa ra lựa chọn sáng suốt nhất.",
    categories: []
  });"""
    text = re.sub(r'const \[comparisonForm, setComparisonForm\] = useState\(\{.*?\}\);', clean_comparisonForm, text, flags=re.DOTALL)

    # Also settingsForm has some broken strings
    text = re.sub(r'title: ".*?",', 'title: "Đừng bỏ lỡ cơ hội thăng tiến!",', text)
    text = re.sub(r'description: ".*?",', 'description: "Để lại email để nhận ngay bộ tài liệu Revit MEP Miễn phí và ưu đãi đặc biệt.",', text)
    text = re.sub(r'buttonText: ".*?",', 'buttonText: "Nhận tài liệu ngay",', text)

    # Quick fixes for scattered dashboard UI strings
    text = text.replace('QuÃ¡ÂºÂ£n lÃ’Â½ giao diÃ¡Â»â¬¡n', 'Quản lý giao diện')
    text = text.replace('HÃ¡Â»â¬¡ thÃ¡Â»ï¿½ï¿½ng', 'Hệ thống')
    text = text.replace('CÃ’Â i ï¿½ ï¿½ï¿½Ã¡ÂºÂ·t Landing Page', 'Cài đặt Landing Page')
    text = text.replace('Chï¿½ Â°a ï¿½ ï¿½ï¿½ï¿½ ï¿½ ng nhÃ¡ÂºÂ­p', 'Chưa đăng nhập')
    text = text.replace('ï¿½ Â \¡Â»ï¿½ ï¿½ ng xuÃ¡ÂºÂ¥t', 'Đăng xuất')
    text = text.replace('ï¿½ Â ang Ã¡ÂºÂ¨n', 'Đang Ẩn')
    text = text.replace('Ã¡ÂºÂ¨n Section nÃ’Â y', 'Ẩn Section này')
    text = text.replace('Lï¿½ Â°u nhÃ’Â¡p', 'Lưu nháp')
    text = text.replace('XuÃ¡ÂºÂ¥t bÃ¡ÂºÂ£n', 'Xuất bản')
    text = text.replace('ChÃ¡Â»â¬°nh sÃ¡Â»Â­a nÃ¡Â»ï¿½ ï¿½i dung', 'Chỉnh sửa nội dung')
    text = text.replace('Thay ï¿½ ï¿½ï¿½Ã¡Â»â¬¢i nÃ¡Â»ï¿½ ï¿½i dung text, hÃ’Â¬nh Ã¡ÂºÂ£nh', 'Thay đổi nội dung text, hình ảnh')
    text = text.replace('Text bÃ’Âªn cÃ¡ÂºÂ¡nh logo', 'Text bên cạnh logo')
    text = text.replace('TÃ’Â¹y chÃ¡Â»Â n tÃ¡ÂºÂ£i lÃ’Âªn', 'Tùy chọn tải lên')
    text = text.replace('Text NÃ’Âºt bÃ¡ÂºÂ¥m CTA', 'Text Nút bấm CTA')
    text = text.replace('Links Menu ï¿½ Â iÃ¡Â»Â u Hï¿½ Â°Ã¡Â»â¬ºng', 'Links Menu Điều Hướng')
    text = text.replace('ThÃ’Âªm Menu', 'Thêm Menu')
    text = text.replace('TiÃ’Âªu ï¿½ ï¿½ï¿½Ã¡Â»Â  chÃ’Âº thÃ’Â­ch (Badge)', 'Tiêu đề chú thích (Badge)')
    text = text.replace('TiÃ’Âªu ï¿½ ï¿½ï¿½Ã¡Â»Â  chÃ’Â­nh', 'Tiêu đề chính')
    text = text.replace('MÃ’Â´ tÃ¡ÂºÂ£', 'Mô tả')
    text = text.replace('TiÃ’Âªu ï¿½ ï¿½ï¿½Ã¡Â»Â  (Headline)', 'Tiêu đề (Headline)')
    text = text.replace('CÃ’Â¡c vÃ¡ÂºÂ¥n ï¿½ ï¿½ï¿½Ã¡Â»Â  gÃ¡ÂºÂ·p phÃ¡ÂºÂ£i', 'Các vấn đề gặp phải')
    text = text.replace('ThÃ’Âªm vÃ¡ÂºÂ¥n ï¿½ ï¿½ï¿½Ã¡Â»Â ', 'Thêm vấn đề')
    text = text.replace('XÃ’Â³a', 'Xóa')
    text = text.replace('Danh sÃ’Â¡ch cÃ’Â¢u hÃ¡Â»Â i & giÃ¡ÂºÂ£i ï¿½ ï¿½ï¿½Ã’Â¡p', 'Danh sách câu hỏi & giải đáp')
    text = text.replace('ThÃ’Âªm cÃ’Â¢u hÃ¡Â»Â i', 'Thêm câu hỏi')
    text = text.replace('BÃ¡ÂºÂ£ng so sÃ’Â¡nh AI', 'Bảng so sánh AI')
    text = text.replace('TiÃ’Âªu ï¿½ ï¿½ï¿½Ã¡Â»Â  phÃ¡Â»Â¥', 'Tiêu đề phụ')
    text = text.replace('ï¿½ Â oÃ¡ÂºÂ¡n mÃ’Â´ tÃ¡ÂºÂ£ ngÃ¡ÂºÂ¯n', 'Đoạn mô tả ngắn')
    text = text.replace('CÃ¡ÂºÂ¥u trÃ’Âºc bÃ¡ÂºÂ£ng', 'Cấu trúc bảng')
    text = text.replace('ThÃ’Âªm nhÃ’Â³m mÃ¡Â»â¬ºi', 'Thêm nhóm mới')

    with open('src/pages/admin/Dashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(text)

fix_comparison()
fix_dashboard()
