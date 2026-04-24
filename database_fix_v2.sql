-- Cập nhật cấu trúc bảng cms_sections để giải quyết lỗi "null value in column id"
-- Chúng ta sẽ cho phép cột id tự động sinh giá trị nếu nó vẫn tồn tại, 
-- hoặc tốt nhất là xóa cột id cũ nếu đã có Khóa Chính mới là (page_id, section_name).

-- Cách 1: Đảm bảo cột id có giá trị mặc định (An toàn nhất nếu có code khác đang phụ thuộc vào id)
ALTER TABLE public.cms_sections ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Cách 2: Nếu bạn muốn bỏ hẳn cột id (Khuyên dùng nếu chỉ dùng page_id và section_name làm định danh)
-- ALTER TABLE public.cms_sections DROP COLUMN IF EXISTS id;

-- Ngoài ra, đảm bảo RLS cho phép insert/update
DROP POLICY IF EXISTS "Cho phép admin toàn quyền cms_sections" ON public.cms_sections;
CREATE POLICY "Cho phép admin toàn quyền cms_sections" 
ON public.cms_sections FOR ALL USING (true);
