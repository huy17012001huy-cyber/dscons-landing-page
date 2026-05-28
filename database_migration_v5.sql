-- TẬP LỆNH SQL BỔ SUNG CỘT VÀ CHÍNH SÁCH BẢO MẬT RLS CHO HỆ THỐNG
-- Copy toàn bộ kịch bản này chạy trong SQL Editor trên Supabase Dashboard.

-- 1. Bổ sung cờ is_notified vào bảng orders (Đơn hàng)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS is_notified boolean DEFAULT false;

-- 2. Cập nhật các đơn hàng cũ sang true để tránh spam thông báo cũ khi kích hoạt tính năng
UPDATE public.orders SET is_notified = true WHERE is_notified IS NULL OR status = 'completed';

-- 3. Bổ sung cờ is_notified vào bảng customers (Waitlist / Leads)
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS is_notified boolean DEFAULT false;

-- 4. Cập nhật các khách hàng cũ sang true để tránh spam thông báo cũ khi kích hoạt tính năng
UPDATE public.customers SET is_notified = true WHERE is_notified IS NULL;

-- 5. Vá lỗi chính sách bảo mật RLS cho bảng customers:
-- Cho phép khách vãng lai cập nhật (UPDATE) thông tin của mình khi điền lại form trùng SĐT (phục vụ lệnh UPSERT)
DROP POLICY IF EXISTS "Public can update customers" ON public.customers;
CREATE POLICY "Public can update customers" ON public.customers FOR UPDATE USING (true) WITH CHECK (true);
