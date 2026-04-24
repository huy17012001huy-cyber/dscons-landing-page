-- Chạy đoạn mã này trong thẻ SQL Editor trên Supabase Dashboard của bạn

-- 1. Tạo bucket mới tên là 'landing_images'
INSERT INTO storage.buckets (id, name, public) VALUES ('landing_images', 'landing_images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Cấp quyền cho TẤT CẢ mọi người (Public) được Xem và Tải ảnh
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'landing_images');

-- 3. Cấp quyền cho người dùng đã đăng nhập (Admin) được Upload ảnh
CREATE POLICY "Admin Upload Access" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'landing_images' AND auth.role() = 'authenticated');

-- 4. Cấp quyền cho Admin được Cập nhật ảnh
CREATE POLICY "Admin Update Access" ON storage.objects
FOR UPDATE USING (bucket_id = 'landing_images' AND auth.role() = 'authenticated');

-- 5. Cấp quyền cho Admin được Xoá ảnh
CREATE POLICY "Admin Delete Access" ON storage.objects
FOR DELETE USING (bucket_id = 'landing_images' AND auth.role() = 'authenticated');
