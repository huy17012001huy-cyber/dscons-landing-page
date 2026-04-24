# Thêm tính năng tải ảnh Logo lên hệ thống

Tính năng này cho phép bạn tải trực tiếp hình ảnh từ máy tính lên hệ thống (thay vì phải đi tìm link ảnh trên mạng) trong màn hình Admin Dashboard.

## User Review Required

> [!IMPORTANT]
> Dự án đang sử dụng Supabase. Để tải ảnh lên, tôi dự định sẽ sử dụng **Supabase Storage**. Tôi sẽ cần tạo một bucket (kho lưu trữ) tên là `public_images` hoặc tương tự trên dự án Supabase của bạn. Việc này cần có quyền Admin trên Supabase hoặc bạn đã cấu hình sẵn.

## Open Questions

> [!WARNING]
> Để kế hoạch được chính xác, bạn vui lòng xác nhận các thông tin sau:
> 1. **Bạn đã bật tính năng Storage trên Supabase chưa?** Nếu chưa, bạn có thể vào trang quản trị Supabase để tạo một bucket (public) không?
> 2. Bạn muốn giới hạn **kích thước** và **loại file** tải lên không? (Ví dụ: tối đa 2MB, chỉ cho phép PNG, JPG, SVG, WEBP).
> 3. Bạn muốn giữ lại ô nhập URL cũ (để vừa có thể dán link, vừa có thể upload) hay thay thế hoàn toàn bằng nút Upload?

## Proposed Changes

### 1. Supabase Client & Utils

#### [NEW] src/lib/storage.ts
- Thêm các hàm tiện ích để giao tiếp với Supabase Storage: `uploadImage(file: File, bucket: string)`
- Hàm sẽ tự động xử lý đổi tên file (thêm timestamp để chống trùng lặp) và trả về Public URL của ảnh.

### 2. Admin Dashboard UI

#### [MODIFY] src/pages/admin/Dashboard.tsx
- Tại khu vực quản lý **Logo Công nghệ**, bổ sung thêm nút "Tải ảnh lên" (Upload) bên cạnh ô nhập URL hiện tại.
- Thêm logic xử lý sự kiện: 
  - Khi click vào nút -> Mở hộp thoại chọn file.
  - Sau khi chọn file -> Hiện trạng thái đang tải (Loading).
  - Tải xong -> Lấy URL gán thẳng vào state `logo.image` để hệ thống tự lưu.
- Áp dụng tương tự cho các danh sách khác nếu cần (như Logo Đối tác trong phần Testimonials).

## Verification Plan

### Manual Verification
- Truy cập vào trang quản trị (Admin Dashboard).
- Chuyển đến khu vực thêm/sửa Logo.
- Nhấn nút "Tải ảnh", chọn một hình ảnh từ máy tính.
- Xác nhận hình ảnh được tải lên thành công, URL tự động điền vào ô và hình xem trước (preview) hiện ra ngay lập tức.
- Bấm "Lưu thay đổi", ra ngoài Landing Page để kiểm tra logo hiển thị chuẩn xác.
