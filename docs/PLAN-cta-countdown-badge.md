# Kế hoạch Thêm Đếm ngược Bottom CTA & Section Badges

## 1. Mục tiêu
- **Bottom CTA**: Bổ sung hiển thị thông tin "Lịch học gần nhất" và "Bộ đếm ngược" (Countdown Timer) đến ngày khai giảng, nằm giữa phần Text mô tả và Nút bấm.
- **Section Badges**: Bổ sung một nhãn (badge) nhỏ hiển thị phía trên tiêu đề chính của **tất cả các phần (sections)** trên Landing Page (như ảnh tham khảo "Thực Chiến Cấp Tốc").

## 2. Các câu hỏi cần làm rõ (Socratic Gate)
Trước khi tiến hành code, tôi cần bạn xác nhận các thông tin sau để đảm bảo đi đúng hướng:

1. **Về Bộ đếm ngược (Countdown Timer)**: 
   - Khi thời gian đếm ngược về `00:00:00:00`, bạn muốn nó hiển thị thông báo gì (ví dụ: *"Khóa học đã bắt đầu"* hoặc *"Đang diễn ra"*) hay là ẩn luôn bộ đếm?
2. **Về Section Badge (Nhãn đầu mục)**: 
   - Bạn muốn áp dụng nhãn này cho **toàn bộ** các section (Hero, Vấn đề, Giải pháp, Lộ trình, Cảm nhận, Học phí, FAQ) hay chỉ một số section cụ thể?
3. **Về Quản trị nội dung (Admin Dashboard)**:
   - Bạn có muốn tôi thêm tất cả các trường dữ liệu này (Ngày khai giảng, Lịch học, Text cho các Badge) vào Admin Dashboard để bạn tự do thay đổi sau này không?

## 3. Phân chia công việc (Task Breakdown)

### Bước 1: Cập nhật Schema & Data (`landingContent.ts` & Admin)
- Bổ sung `countdownDate`, `scheduleText` vào cấu hình của `bottomCta`.
- Bổ sung trường `badge` (kiểu string) vào cấu hình của tất cả các section (hero, problem, solution, curriculum, pricing, testimonials, faq, bottomCta).
- Cập nhật giao diện `Dashboard.tsx` để hiển thị các ô nhập liệu (Input) cho các trường dữ liệu mới này.

### Bước 2: Xây dựng Component đếm ngược (Countdown)
- Tạo mới một component `CountdownTimer.tsx` nhận vào tham số `targetDate`.
- Sử dụng `useEffect` và `setInterval` để tính toán số Ngày, Giờ, Phút, Giây còn lại.
- Thiết kế UI cho bộ đếm: Các ô số nổi bật, viền bo góc, hiệu ứng pro-max (giống phong cách của trang web hiện tại).

### Bước 3: Cập nhật UI các Section
- **BottomCTA.tsx**: Chèn thông tin Lịch học và `CountdownTimer` vào vị trí giữa đoạn văn bản mô tả và Nút đăng ký.
- **Tất cả các Section khác**: Bổ sung một thẻ `div` hiển thị dạng Badge (bo góc tròn (pill), viền, text gradient hoặc màu primary tùy ngữ cảnh) ngay phía trên thẻ `<h2>` tiêu đề của mỗi khối.

## 4. Tiêu chí hoàn thành (Verification Criteria)
- [ ] Admin có thể thay đổi ngày khai giảng và bộ đếm tự động cập nhật thời gian.
- [ ] Lịch học hiển thị chính xác ở khối Bottom CTA.
- [ ] Các Section đều có nhãn Badge nhỏ ở phía trên tiêu đề, thiết kế nhất quán với ảnh cung cấp.
- [ ] Không làm phá vỡ (break) UI trên thiết bị di động (Responsive tốt).
