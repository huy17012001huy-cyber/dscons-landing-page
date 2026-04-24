# KẾ HOẠCH: Media Quà Tặng & Đánh Giá (media-testimonials)

## 🔴 QUY TẮC QUAN TRỌNG
1. **KHÔNG VIẾT CODE TRONG GIAI ĐOẠN NÀY** - File này chỉ đóng vai trò là bản thiết kế.
2. **Cổng Xác Nhận Socratic** - Đã hoàn thành (Xem bên dưới).

## Phân Tích Công Việc

### 1. Phân Tích Cấu Trúc Dữ Liệu
- Đánh giá lại nơi lưu trữ dữ liệu cho phần Quà tặng và Đánh giá hiện tại.
- Nếu đang sử dụng cột JSON (ví dụ: `content` trong bảng `cms_sections` hoặc state toàn cục), lên kế hoạch cập nhật schema để thêm:
  - **Quà tặng**: Cột `mediaUrl` (chuỗi), `mediaType` ('image' | 'video' | 'youtube').
  - **Đánh giá**: Cột `videoUrl` (chuỗi) để thay thế hoặc bổ sung cho nội dung dạng text.
  - **Hàng chạy đối tác (Marquee)**: Một mảng mới `partnerLogos` hoặc `partnerNames` dành riêng cho danh sách các đối tác.

### 2. Cập Nhật Admin Dashboard
- **Mục Quà tặng**: Thêm trường nhập liệu (input) cho mỗi phần quà để dán link YouTube hoặc link ảnh.
- **Mục Đánh giá**: 
  - Thêm trường nhập liệu cho link video dọc (Drive/YouTube/TikTok) cho từng bài đánh giá.
  - Tạo một khu vực quản lý mới chuyên dụng cho "Hàng chạy" (Partner Marquee), cho phép Admin thêm/sửa/xóa tên công ty hoặc logo (ví dụ: Vingroup, Taikisha, Hawee).

### 3. Cập Nhật Landing Page (Giao Diện Học Viên)
- **Mục Quà tặng**: 
  - Thêm nút "Xem Chi Tiết" hoặc làm cho ảnh thu nhỏ của quà tặng có thể click được.
  - Triển khai dạng Modal/Popup (hộp thoại) để hiển thị video hoặc hình ảnh phóng to khi click vào.
- **Mục Đánh giá**: 
  - Thiết kế bộ chọn lướt ngang (Carousel/Slider) tối ưu cho định dạng video dọc 9:16 (dự kiến 5-6 video).
  - Tích hợp trình phát video (Video Player) có thể xử lý mượt mà cả link YouTube và link Drive/mp4.
  - Xây dựng thành phần hàng chạy (marquee) bằng CSS animation (cuộn vô tận) để hiển thị các công ty đối tác. Cấu trúc sẽ là **Logo + Text nằm ngang nhau** (tương tự như mục công cụ/công nghệ).

### 4. Danh Sách Kiểm Tra (Verification Checklist)
- [ ] Admin có thể thêm/sửa/xóa link media trong phần Quà tặng.
- [ ] Admin có thể thêm/sửa/xóa link video trong phần Đánh giá.
- [ ] Admin có thể quản lý danh sách các công ty đối tác cho hàng chạy (marquee).
- [ ] Landing page hiển thị chính xác ảnh/video dưới dạng popup trong phần Quà tặng mà không làm vỡ bố cục.
- [ ] Landing page nhúng và phát thành công các video cảm nhận dọc 9:16 trên Carousel.
- [ ] Hàng chạy logo đối tác cuộn mượt mà và vô tận trên mọi kích thước màn hình.

---

## 🟢 Gate Passed (Yêu cầu đã được xác nhận)

**Quyết định triển khai:**
1. **Quà tặng**: Hỗ trợ nhập cả link, video, ảnh. Khi hiển thị trên Landing Page, bấm vào sẽ hiện ra dạng Popup (Modal).
2. **Đánh giá**: Sử dụng video dọc 9:16 (Drive/YouTube), số lượng 5-6 video. Sẽ hiển thị dạng danh sách lướt ngang (Carousel) phù hợp cho màn hình điện thoại và máy tính.
3. **Hàng chạy đối tác**: Giao diện bao gồm Logo + Text nằm ngang nhau (tương tự như mục công cụ/công nghệ).

*Kế hoạch đã hoàn tất và sẵn sàng triển khai.*
