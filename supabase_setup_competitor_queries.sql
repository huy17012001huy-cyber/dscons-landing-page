-- Tạo bảng lưu trữ lịch sử so sánh của học viên
CREATE TABLE IF NOT EXISTS public.competitor_queries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    query TEXT,
    student_need TEXT,
    student_hesitation TEXT,
    competitor_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Thêm cột điểm phân vân (nếu bảng đã tồn tại)
ALTER TABLE public.competitor_queries ADD COLUMN IF NOT EXISTS student_hesitation TEXT;

-- Bật tính năng bảo mật dòng (Row Level Security)
ALTER TABLE public.competitor_queries ENABLE ROW LEVEL SECURITY;

-- Cho phép TẤT CẢ mọi người (học viên vãng lai) có quyền THÊM dữ liệu (INSERT)
CREATE POLICY "Cho phép học viên thêm lượt tra cứu" 
ON public.competitor_queries FOR INSERT 
TO public
WITH CHECK (true);

-- Chỉ cho phép Quản trị viên (đã đăng nhập) XEM dữ liệu (SELECT)
CREATE POLICY "Chỉ Admin được xem lịch sử" 
ON public.competitor_queries FOR SELECT 
TO authenticated
USING (true);
