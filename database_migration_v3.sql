-- TẬP LỆNH SQL THIẾT LẬP DATABASE CRM CHO DSCONS LANDING PAGE
-- Coppy toàn bộ kịch bản này chạy trong SQL Editor trên Supabase Dashboard.

-- 1. Xóa bảng cũ nếu tồn tại (để tránh lỗi xung đột)
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;

-- 2. Tạo bảng Sản Phẩm (Khóa học số)
CREATE TABLE public.products (
  id text NOT NULL PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL,
  stock integer NOT NULL DEFAULT 99,
  download_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 3. Tạo bảng Khách Hàng (Học viên đăng ký)
CREATE TABLE public.customers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL UNIQUE,
  email text,
  role text,
  painpoint text,
  goal text,
  emails_sent text DEFAULT '',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 4. Tạo bảng Đơn Hàng
CREATE TABLE public.orders (
  id text NOT NULL PRIMARY KEY,
  customer_phone text NOT NULL,
  customer_name text NOT NULL,
  product_id text REFERENCES public.products(id) ON DELETE SET NULL,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending'::text,
  sepay_transaction_id text UNIQUE,
  payment_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 5. Bật Row Level Security (RLS) bảo mật dữ liệu
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 6. Thiết lập các chính sách RLS bảo mật

-- Quyền cho bảng products: Public được Xem, chỉ Admin đã đăng nhập được Sửa
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (auth.role() = 'authenticated');

-- Quyền cho bảng customers: Khách vãng lai được Thêm mới & Xem, Admin có toàn quyền
CREATE POLICY "Public can insert customers" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view customers" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Admins can manage customers" ON public.customers FOR ALL USING (auth.role() = 'authenticated');

-- Quyền cho bảng orders: Khách vãng lai được Thêm, Xem và Sửa đơn hàng của mình khi đang pending
CREATE POLICY "Public can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public can update pending orders" ON public.orders FOR UPDATE USING (status = 'pending'::text);
CREATE POLICY "Admins can manage orders" ON public.orders FOR ALL USING (auth.role() = 'authenticated');

-- 7. Ghi nhận dữ liệu mẫu (Seed Data) cho 3 Gói Khóa học
INSERT INTO public.products (id, name, price, stock, download_url) VALUES
  ('revit-mep-thuc-chien', 'Khóa học Revit MEP Thực Chiến — GÓI THỰC CHIẾN', 3900000, 45, 'https://drive.google.com/drive/folders/1_revit_mep_thuc_chien_gifts_fake'),
  ('revit-mep-combo', 'Khóa học Revit MEP Thực Chiến — GÓI COMBO', 6400000, 28, 'https://drive.google.com/drive/folders/2_revit_mep_combo_gifts_fake'),
  ('revit-mep-all-in-one', 'Khóa học Revit MEP Thực Chiến — GÓI ALL IN ONE', 12000000, 12, 'https://drive.google.com/drive/folders/3_revit_mep_all_in_one_gifts_fake')
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, price = EXCLUDED.price, download_url = EXCLUDED.download_url;
