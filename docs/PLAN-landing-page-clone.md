# Kế hoạch: Hệ thống Nhân bản (Clone) Landing Page

## 1. Bối cảnh & Mục tiêu
Người dùng muốn nhân bản (clone) trang landing page thành nhiều phiên bản khác nhau (ví dụ: một trang cho Doanh nghiệp B2B, một trang cho Học viên cá nhân B2C). Mỗi trang sẽ có một đường dẫn riêng (`/:slug`), nội dung độc lập, và cấu hình SEO riêng biệt. Điều này đòi hỏi phải chuyển đổi kiến trúc hệ thống từ mô hình "một trang duy nhất" (Single-page CMS) sang mô hình "nhiều trang" (Multi-page CMS), và toàn bộ được quản lý thông qua Admin Dashboard.

## 2. Thay đổi Cấu trúc Database (Supabase)
Để hỗ trợ nhiều trang landing page, chúng ta cần tái cấu trúc lại cơ sở dữ liệu:

### 2.1. Bảng mới: `landing_pages`
- `id` (UUID, Khóa chính)
- `slug` (String, Duy nhất) - Ví dụ: "doanh-nghiep", "hoc-vien". Trang mặc định có thể để slug là `default` hoặc `home`.
- `title` (String) - Tên trang dùng để quản lý nội bộ trong Admin.
- `seo_title`, `seo_description`, `seo_keywords` (Strings) - Metadata SEO riêng cho từng trang.
- `tracking_scripts` (Text/JSON) - Mã theo dõi riêng (Facebook Pixel, Google Analytics).
- `favicon_url` (String) - Favicon riêng cho trang (nếu cần).
- `is_active` (Boolean) - Trạng thái Bật/Tắt trang.
- `created_at`, `updated_at` (Timestamps)

### 2.2. Cập nhật Bảng: `cms_sections`
- Hiện tại: `id` (String, ví dụ 'hero'), `draft_content`, `published_content`, v.v.
- **Thay đổi**: 
  - Thêm cột `page_id` (UUID, Khóa ngoại liên kết tới `landing_pages.id`).
  - Đổi Khóa chính (Primary Key) thành khóa phức hợp: `(page_id, section_name)` HOẶC tạo một UUID mới làm khóa chính và đặt `(page_id, section_name)` làm Ràng buộc duy nhất (Unique constraint).
  - *Data Migration (Di chuyển dữ liệu)*: Các dữ liệu hiện tại trong `cms_sections` sẽ được tự động gán cho một trang landing page "mặc định".

## 3. Cập nhật Backend & API (`src/lib/api.ts`)
- `getSectionData(pageId, sectionName)`: Cập nhật để truy vấn dữ liệu dựa trên cả `page_id` VÀ `section_name`.
- `saveDraft(pageId, sectionName, ...)` / `publishSection(...)`: Cập nhật logic lưu dữ liệu (upsert) để bao gồm cả `page_id`.
- Viết thêm các hàm CRUD mới cho `landing_pages`:
  - `getLandingPages()`: Lấy danh sách trang.
  - `createLandingPage(data)`: Tạo trang mới tinh.
  - `duplicateLandingPage(sourcePageId, newSlug, newTitle)`: Hàm này sẽ copy một dòng trong bảng `landing_pages` VÀ copy toàn bộ các dòng dữ liệu liên quan trong bảng `cms_sections`.
  - `deleteLandingPage(pageId)`: Xóa trang.

## 4. Cập nhật Admin Dashboard (`src/pages/admin/Dashboard.tsx`)
- **Tab Mới**: Thêm mục "Quản lý Landing Page".
- **Tính năng trong Tab**:
  - Hiển thị danh sách các trang đang có.
  - Nút "Tạo trang mới" (Tạo trang trống).
  - Nút "Nhân bản" (Duplicate) từ một trang có sẵn -> Mở popup để nhập `slug` và `tên trang` mới.
- **Global State / Context (Trạng thái quản lý)**:
  - Trên thanh công cụ của Admin cần có một Dropdown (Menu thả xuống) để chọn xem *trang nào* đang được chỉnh sửa.
  - Khi chọn một trang (ví dụ: trang B2B), toàn bộ các tab nội dung bên dưới (Hero, Học phí, Footer...) sẽ tự động gọi API và lưu dữ liệu dựa trên `page_id` của trang đó.

## 5. Cập nhật Định tuyến (Routing) & Frontend (`src/App.tsx` & `src/pages/Index.tsx`)
- **App.tsx**:
  - Thêm route cho đường dẫn động: `<Route path="/:slug" element={<Index />} />`
  - Đảm bảo các route cố định (như `/login`, `/admin`) phải được khai báo *trước* route động để không bị xung đột.
- **Index.tsx**:
  - Đọc biến `slug` từ thanh địa chỉ URL (`useParams()`). Nếu không có (truy cập thẳng `/`), sẽ dùng trang mặc định.
  - Gọi API lấy thông tin cấu hình của trang (`landing_page`), bao gồm SEO và mã Tracking.
  - Truyền `page_id` xuống tất cả các component con (Hero, Pricing, Footer...) để chúng biết cần gọi API lấy nội dung của trang nào.
  - Cập nhật tự động `document.title` và các thẻ meta tags SEO dựa trên cài đặt của trang.

## 6. Lộ trình Triển khai (Các giai đoạn)

**Giai đoạn 1: Chỉnh sửa Database**
- Tạo bảng `landing_pages` trên Supabase.
- Thêm cột `page_id` vào bảng `cms_sections`.
- Chạy script cập nhật dữ liệu cũ để không làm mất nội dung hiện tại.

**Giai đoạn 2: Cập nhật API & Logic Cốt lõi**
- Sửa file `api.ts` để hỗ trợ `page_id` trong mọi thao tác lấy/lưu nội dung.
- Viết tính năng "Nhân bản trang".

**Giai đoạn 3: Frontend Routing & Hiển thị**
- Sửa `App.tsx` và `Index.tsx` để xử lý đường dẫn `/:slug`.
- Cài đặt hệ thống render SEO và Tracking tự động cho từng trang.

**Giai đoạn 4: Giao diện Admin Dashboard**
- Xây dựng tab "Quản lý Landing Page".
- Thêm thanh chọn (Selector) để chuyển đổi giữa các trang khi chỉnh sửa.
- Nối API vào các form nhập liệu hiện tại.

## 7. Tiêu chí Nghiệm thu (Checklist)
- [ ] Database phân tách chính xác nội dung của từng trang.
- [ ] Truy cập `domain.com/` hiển thị đúng trang mặc định.
- [ ] Truy cập `domain.com/doanh-nghiep` hiển thị trang dành cho doanh nghiệp với nội dung riêng.
- [ ] Trong Admin có thể nhấn "Nhân bản" và tạo ra một trang mới với nội dung giống hệt trang gốc.
- [ ] Việc chỉnh sửa nội dung trang này KHÔNG ảnh hưởng đến nội dung trang khác.
- [ ] Thẻ SEO và Pixel tracking của từng trang hoạt động độc lập và hiển thị đúng trong thẻ `<head>`.
