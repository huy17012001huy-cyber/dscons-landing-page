-- TẬP LỆNH SQL CẬP NHẬT CẤU HÌNH HỆ THỐNG VÀ EMAIL ĐỘNG CHO TRANG ADMIN
-- Coppy toàn bộ kịch bản này chạy trong SQL Editor trên Supabase Dashboard.

-- 1. Tạo bảng Cấu hình Hệ thống (system_settings)
CREATE TABLE IF NOT EXISTS public.system_settings (
  key text NOT NULL PRIMARY KEY,
  value text NOT NULL,
  description text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Bật RLS bảo mật cho system_settings
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Chính sách bảo mật RLS cho system_settings
DROP POLICY IF EXISTS "Public can view system settings" ON public.system_settings;
DROP POLICY IF EXISTS "Admins can manage system settings" ON public.system_settings;

CREATE POLICY "Public can view system settings" ON public.system_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage system settings" ON public.system_settings FOR ALL USING (auth.role() = 'authenticated');

-- 2. Tạo bảng Mẫu Email (email_templates)
CREATE TABLE IF NOT EXISTS public.email_templates (
  id text NOT NULL PRIMARY KEY,
  name text NOT NULL,
  subject text NOT NULL,
  html_content text NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Bật RLS bảo mật cho email_templates
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Chính sách bảo mật RLS cho email_templates
DROP POLICY IF EXISTS "Public can view email templates" ON public.email_templates;
DROP POLICY IF EXISTS "Admins can manage email templates" ON public.email_templates;

CREATE POLICY "Public can view email templates" ON public.email_templates FOR SELECT USING (true);
CREATE POLICY "Admins can manage email templates" ON public.email_templates FOR ALL USING (auth.role() = 'authenticated');

-- 3. Ghi nhận dữ liệu mẫu (Seed Data) cho cấu hình hệ thống
INSERT INTO public.system_settings (key, value, description) VALUES
  ('zalo_link', 'https://zalo.me/0394784284', 'Link Zalo liên hệ tư vấn và chat trực tiếp'),
  ('bank_account', '105870479657', 'Số tài khoản nhận chuyển khoản thanh toán'),
  ('bank_code', 'VietinBank', 'Mã ngân hàng (ví dụ: VietinBank, Techcombank, MBBank)'),
  ('bank_owner', 'PHAM QUANG HUY', 'Tên chủ tài khoản nhận tiền (viết hoa không dấu)'),
  ('resend_api_key', 're_6xcF9T2p_DeQNRm4m7wRfioqMRst5xSXg', 'API Key Resend bảo mật để gửi mail'),
  ('resend_sender_email', 'onboarding@resend.dev', 'Địa chỉ email người gửi (ví dụ: onboarding@resend.dev)'),
  ('is_test_mode', 'true', 'Trạng thái chế độ Test thanh toán 2K (nhập "true" hoặc "false")')
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value, description = EXCLUDED.description;

-- 4. Ghi nhận dữ liệu mẫu (Seed Data) cho 4 Mẫu Email động
INSERT INTO public.email_templates (id, name, subject, html_content) VALUES
  (
    'waitlist-welcome', 
    'Email 1 — Chào mừng đăng ký (Waitlist)', 
    'Chào mừng ae đến với thế giới Revit MEP Thực Chiến! 🚀', 
    '<p>Chào ae, mình là Huy DSCons đây.</p><p>Rất vui vì ae đã tin tưởng điền form đăng ký vào hàng ngũ danh sách chờ của DSCons.</p><p>Biết ae kỹ sư cơ điện bận rộn ngoài công trường, tăng ca suốt, mình sẽ đi thẳng vào vấn đề, không có lý thuyết giáo điều sáo rỗng. Ở đây chỉ có kinh nghiệm thực chiến từ hơn 20 dự án lớn nhỏ mà DSCons đã trực tiếp thi công và bàn giao thành công.</p><p>Như đã hứa, món quà đặc quyền để ae làm quen trước đã được kích hoạt:</p><ul><li><strong>Template rải ống cơ điện chuẩn chỉnh của DSCons</strong> (đã tối ưu thông số).</li><li><strong>Bộ Family 3D cơ bản</strong> giúp kéo thả rải thiết bị mượt mà không lỗi.</li></ul><p>👉 <strong><a href="https://drive.google.com/drive/folders/2_revit_mep_combo_gifts_fake" target="_blank">Ae bấm vào đây để tải Bộ Quà Tặng & Tài Liệu đặc quyền nhé</a></strong></p><p><em>Lưu ý:</em> Vào ngày kia (2 ngày nữa), mình sẽ gửi cho ae một bài chia sẻ cực kỳ đắt giá về cái bẫy "vẽ mô hình 3D chỉ để ngắm" mà 90% kỹ sư Revit mới vào nghề đều mắc phải khiến sếp và chủ đầu tư trả lại bản vẽ liên tục. Ae nhớ mở hòm thư đón đọc nhé!</p><p>Chúc ae một ngày làm việc hiệu quả, vẽ mô hình mượt mà không lỗi!</p><p>— Huy DSCons</p>'
  ),
  (
    'nurture-1', 
    'Email 2 — Bài học xương máu (Nurture)', 
    'Cái bẫy "Mô hình 3D chỉ để ngắm" và bài học xương máu của mình... ⚠️', 
    '<p>Chào ae, lại là Huy DSCons đây.</p><p>Hôm nay mình muốn chia sẻ với ae một bài học xương máu từ thời mình mới chập chững bước chân vào nghề làm Revit MEP.</p><p>Hồi đó, mình hăm hở dựng hình 3D phối màu lung linh, nhìn mô hình chạy trên máy sướng mắt lắm. Nghĩ bụng thế này là đỉnh rồi. Cho đến ngày mang bản vẽ ra ngoài công trường thực tế để lắp đặt...</p><p>Hỡi ôi! Ống nước chữa cháy đè bẹp dí ống gió, ống thoát nước đâm thẳng xuyên qua dầm bê tông cốt thép. Công nhân đục phá nát bét cả trần thạch cao, hao hụt vật tư trầm trọng. Sếp gọi lên văn phòng mắng vuốt mặt không kịp.</p><p>Rút ra bài học cực kỳ đắt giá: <strong>Nếu mô hình 3D không giải quyết được va chạm thực tế và không xuất ra được khối lượng chính xác để thi công, thì nó chỉ là một bức tranh để ngắm thôi, vô giá trị!</strong></p><p>Bí quyết thực chiến ở đây là: <strong>Vẽ để thi công chứ không phải vẽ để chụp ảnh.</strong></p><p>Một mô hình Revit MEP thực chiến đúng nghĩa phải đạt 3 tiêu chí:</p><ol><li><strong>Không còn va chạm:</strong> Mọi ống gió, ống nước phải né dầm, né cột chuẩn chỉ từ khâu thiết kế 3D.</li><li><strong>Khối lượng tự động:</strong> Bấm 1 nút là Excel xuất ra chính xác 100% từng cái tê, cút, chếch để đi mua vật tư, không phải ngồi đếm tay còng lưng sai sót be bét.</li><li><strong>Template chuẩn:</strong> Giúp tăng tốc độ vẽ nhanh hơn 30% so với vẽ CAD 2D truyền thống.</li></ol><p>Ngày mai, mình sẽ chỉ cho ae lộ trình chi tiết chỉ trong 6 tuần để làm chủ toàn bộ quy trình thực chiến này nhằm nâng cao tay nghề và bứt phá thu nhập nhanh nhất.</p><p>Hẹn gặp lại ae trong hòm thư ngày mai nhé!</p><p>— Huy DSCons</p>'
  ),
  (
    'sales-1', 
    'Email 3 — Ưu đãi chốt hạ (Sales)', 
    'Chỉ 6 tuần để chấm dứt cảnh "CAD 2D đếm tay còng lưng" 🎯', 
    '<p>Chào ae, Huy DSCons đây.</p><p>Hai hôm nay chúng ta đã nói về tư duy vẽ thực chiến và tránh cái bẫy mô hình 3D chỉ để ngắm. Hôm nay, mình muốn rủ ae cùng bắt tay vào hành động thật sự.</p><p>Thay vì ae cứ phải ngồi mò mẫm tự học Revit trên mạng mất cả năm trời, bế tắc khi gặp lỗi file không ai sửa, dễ chán nản rồi dậm chân tại chỗ...</p><p>Chỉ với 6 tuần học trực tiếp tương tác trực tuyến qua Zoom cùng mình, ae sẽ hoàn toàn tự tin làm chủ Revit MEP thực chiến, tự tin vẽ mô hình chuẩn chỉ và tự nhận thêm việc ngoài kiếm thêm thu nhập 10-15 triệu mỗi tháng dễ dàng.</p><p>DSCons mang đến 3 gói học thực chiến tối ưu nhất cho ae chọn lựa:</p><ul><li><strong>Gói Thực Chiến (3.900K):</strong> 12 buổi học tương tác trực tuyến qua Zoom, chấm bài chi tiết, hỗ trợ 1-1 từ 8h - 22h, tặng bộ Family 3D trị giá 2.000K.</li><li><strong>Gói Combo (6.400K):</strong> Đầy đủ ưu đãi Gói Thực Chiến + tặng khóa học Thiết lập Template (1.000K) + tặng khóa viết CV xin việc + hỗ trợ Zalo trọn đời.</li><li><strong>Gói All In One (12.000K):</strong> Học toàn bộ khóa học trọn đời + tặng bộ phần mềm DSCons Tool vĩnh viễn (5.000K) + giới thiệu việc làm trực tiếp tới nhà thầu cơ điện lớn.</li></ul><p>⚠️ <strong>Cam kết vàng của Huy:</strong> Mình cam kết bằng video trực tiếp ở buổi khai giảng — hoàn trả 100% học phí cuối khóa nếu ae thấy không hài lòng với chất lượng giảng dạy. Rủi ro của ae bằng 0!</p><p>Lớp học giới hạn chỉ từ 15-25 học viên để mình trực tiếp hỗ trợ qua phần mềm Ultraview sửa lỗi kỹ nhất cho từng người, và các suất ưu đãi học phí sắp đóng lại rồi.</p><p>👉 <strong><a href="https://www.dscons.io.vn/dang-ky" target="_blank">Ae bấm vào đây để Đăng Ký Giữ Chỗ & Nhận Mã Ưu Đãi Học Phí ngay hôm nay nhé!</a></strong></p><p>Đừng để năm 2026 trôi qua mà ae vẫn loay hoay với bản vẽ CAD 2D còng lưng nữa. Hãy bứt phá sự nghiệp ngay hôm nay!</p><p>— Huy DSCons</p>'
  ),
  (
    'order-confirmation', 
    'Email Xác nhận đơn hàng thành công', 
    'Xác nhận đăng ký thành công khóa học DSCons Revit MEP Thực Chiến! 🎓', 
    '<p>Chào ae, mình là Huy DSCons đây.</p><p>Mình gửi hòm thư này để xác nhận đã nhận được khoản thanh toán của ae cho khóa học của DSCons.</p><p>Dưới đây là chi tiết biên nhận hóa đơn số của ae:</p><ul><li><strong>Sản phẩm đăng ký:</strong> {{product_name}}</li><li><strong>Số tiền đã đóng:</strong> {{amount}}</li></ul><p>🎁 <strong>Hướng dẫn nhận học liệu & Quà tặng đặc quyền:</strong></p><p>Để bắt đầu học tập và làm quen ngay lập tức, ae hãy bấm vào đường dẫn dưới đây để tải toàn bộ tài liệu đặc quyền (Template rải ống cơ điện chuẩn chỉnh và bộ Family 3D cơ bản):</p><p>👉 <strong><a href="{{download_url}}" target="_blank">Bấm vào đây để Tải Quà Tặng & Tài Liệu Học Tập ngay 🎁</a></strong></p><p>Đồng thời, tư vấn viên của DSCons sẽ trực tiếp liên hệ hỗ trợ ae vào lớp Zoom học qua Zalo trong vòng 15 phút tới. Ae hãy chú ý điện thoại nhé!</p><p>Một lần nữa, vô cùng cảm ơn sự tin tưởng và quyết định bứt phá tay nghề của ae cùng DSCons.</p><p>Hẹn gặp lại ae trong lớp học Zoom nhé!</p><p>— Huy DSCons</p>'
  )
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, subject = EXCLUDED.subject, html_content = EXCLUDED.html_content;
