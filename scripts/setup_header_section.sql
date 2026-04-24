-- Nếu bạn chưa thấy dữ liệu cũ của Header hiển thị ở Dashboard hoặc click lưu bị lỗi thì hãy chạy lệnh này trong SQL Editor:
INSERT INTO public.cms_sections (id, section_name, is_visible)
VALUES ('header', 'header', true)
ON CONFLICT (id) DO NOTHING;
