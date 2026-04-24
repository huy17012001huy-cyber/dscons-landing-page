-- ==========================================
-- GIAI ĐOẠN 1: MIGRATION CƠ SỞ DỮ LIỆU
-- Copy toàn bộ đoạn code SQL này và chạy trong Supabase SQL Editor
-- ==========================================

-- 1. Tạo bảng landing_pages
CREATE TABLE IF NOT EXISTS public.landing_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT,
    tracking_scripts TEXT,
    favicon_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bật RLS (Row Level Security) cho bảng mới
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;

-- Tạo policy cho phép tất cả mọi người đọc (để trang web hiển thị)
CREATE POLICY "Cho phép tất cả mọi người đọc landing_pages" 
ON public.landing_pages FOR SELECT USING (true);

-- Tạo policy cho phép admin sửa (tạm thời để public phục vụ dev, bạn có thể thiết lập lại sau)
CREATE POLICY "Cho phép admin insert/update/delete landing_pages" 
ON public.landing_pages FOR ALL USING (true);

-- 2. Khởi tạo Trang Mặc Định (Default Landing Page)
-- Sử dụng một UUID cố định dễ nhận biết cho trang mặc định
INSERT INTO public.landing_pages (id, slug, title, seo_title) 
VALUES (
    '11111111-1111-1111-1111-111111111111', 
    'default', 
    'Trang Chủ Mặc Định', 
    'DSCons - Khóa Học Revit MEP Thực Chiến'
)
ON CONFLICT (slug) DO NOTHING;

-- 3. Cập nhật bảng cms_sections hiện tại
-- Thêm cột page_id
ALTER TABLE public.cms_sections ADD COLUMN IF NOT EXISTS page_id UUID REFERENCES public.landing_pages(id) ON DELETE CASCADE;

-- Cập nhật toàn bộ nội dung cũ (Hero, Pricing, v.v.) vào Trang Mặc Định
UPDATE public.cms_sections 
SET page_id = '11111111-1111-1111-1111-111111111111' 
WHERE page_id IS NULL;

-- Bắt buộc page_id không được để trống
ALTER TABLE public.cms_sections ALTER COLUMN page_id SET NOT NULL;

-- 4. Thay đổi Khóa chính (Primary Key) của bảng cms_sections
-- Do bảng này lưu lịch sử cũ nên có thể Primary Key đang là cột "id".
-- Chúng ta cần xóa Primary Key cũ và tạo Primary Key mới là (page_id, section_name) để một section (như hero) có thể tồn tại trên nhiều trang khác nhau.

-- Chạy thử đoạn này, nếu lỗi "does not exist" thì bỏ qua
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cms_sections_pkey') THEN
    ALTER TABLE public.cms_sections DROP CONSTRAINT cms_sections_pkey;
  END IF;
END $$;

-- Thiết lập lại Khóa chính phức hợp
ALTER TABLE public.cms_sections ADD PRIMARY KEY (page_id, section_name);

-- (Tùy chọn) Nếu sau này bảng sinh ra lỗi liên quan tới id (cũ), ta có thể giữ nguyên cột id, nhưng hiện tại Khóa Chính sẽ là (page_id, section_name).
