# PLAN: Admin CMS & Dynamic Content

## Mục tiêu nền tảng
Tích hợp hệ thống quản trị nội dung (CMS) để thay đổi toàn bộ content của Landing Page từ tĩnh sang động (Dynamic). Xây dựng cơ chế Authentication bảo mật qua Supabase và tối ưu tốc độ load trang cho Vite SPA. Bố trí luồng "Nháp - Xuất bản" độc lập cho từng UI Section.

## Chi tiết kế hoạch triển khai

### Phase 1: Setup Hạ tầng Supabase & Cấu trúc Database (Data Layer)
1. **Khởi tạo kết nối Supabase Client:**
   - Setup các biến môi trường vào file `.env` chứa URL và ANON KEY.
   - Khởi tạo instance kết nối trong `src/lib/supabase.ts`.
2. **Thiết kế Database Schema (Sẽ đưa script SQL cho Admin set up):**
   - **Table `profiles`:** `id` (references auth.users), `role` (enum: 'super_admin', 'member').
   - **Table `cms_sections`:** Quản lý state của các Sections. Gồm các cột: `id`, `section_name`, `draft_content` (JSONB), `published_content` (JSONB), `is_visible` (Boolean).
3. **Data Migration:** Bơm dữ liệu tĩnh mặc định từ `landingContent.ts` vào DB cho khởi đầu không trống.

### Phase 2: Authentication & Routing (Admin Login)
1. Tạo một nút ẩn (hoặc link chữ mờ) ở `Footer` gọi đến `/login`.
2. Xây dựng View `/login` với Form nhập Email & Password.
3. Khởi tạo chức năng Route Guard:
   - Chặn quyền truy cập path `/admin/*`. Nếu không có token hợp lệ báo lỗi hoặc chuyển về Login.
   - Tài khoản khai nguyên theo yêu cầu: `huy17012001huy@gmail.com` / `17012001` ở Role Super Admin.

### Phase 3: Xây dựng Giao diện CMS Dashboard
1. Thiết kế Master Layout Admin với Sidebar tinh gọn.
2. Xây dựng Form tùy chỉnh Text/Image/List tương đồng với cấu trúc DB `landingContent` cũ:
   - Ví dụ: Danh sách module, danh sách giá học phí, lợi ích, v.v.
3. Tích hợp thanh Toolbar quyền lực:
   - Toggle Switch: Bật/Tắt hiển thị Section tại Landing Page.
   - Button **[Lưu Nháp]**: Chỉ ghi đè lên `draft_content` trong DB.
   - Button **[Xuất Bản]**: Đồng bộ `draft_content` qua `published_content`.

### Phase 4: Đồng bộ Landing Page lấy dữ liệu từ API
1. Chỉnh sửa hook/loader của toàn bộ components tại Trang chủ (HeroSection, Pricing, Curriculum...)
2. Cơ chế tối ưu tốc độ Rendering:
   - Sử dụng thư viện gọi gọi API (React Query / SWR) hoặc Zustand để cache dữ liệu lại trên Client-side.
   - Dữ liệu fetch từ Backend phải lập tức render mà không để xuất hiện Loading Spinner quá lâu; fallback về dữ liệu local mẫu nếu fetch thất bại để trải nghiệm vẫn mượt.

---

> [!CAUTION]
> **Hành động dành cho bạn (Người triển khai dự án):**
> Do tài nguyên Database và Auth User phụ thuộc vào bảng điều khiển (Dashboard) trên trang chủ Supabase của bạn, trong quá trình làm ở **Phase 1**, tôi sẽ cung cấp mã lệnh SQL để bạn dán vào SQL Editor bên trong hệ thống Supabase.
