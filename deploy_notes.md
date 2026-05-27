# 📝 Hướng Dẫn Cấu Hình Môi Trường & Khởi Chạy Server (VPS Ubuntu Production)

Dưới đây là danh sách các biến môi trường cần thiết, cổng lắng nghe và các câu lệnh vận hành hệ thống Express backend kết nối dữ liệu Supabase/SQLite khi triển khai dự án lên VPS Linux (Ubuntu Server).

---

## 🔑 1. Danh sách các biến môi trường cần cấu hình (.env)

Trước khi khởi chạy hệ thống trên VPS, bạn cần tạo tệp `.env` tại thư mục gốc của dự án trên VPS và điền đầy đủ các thông tin cấu hình sản xuất sau:

| Tên biến | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | URL | Đường dẫn kết nối API Supabase Cloud của bạn. |
| `VITE_SUPABASE_ANON_KEY` | Chuỗi mã hóa JWT | Khóa công khai của Supabase để client React thao tác RLS. |
| `RESEND_API_KEY` | Chuỗi ký tự (Bảo mật) | Khóa API gửi email của Resend (dạng `re_...`). |
| `SEPAY_API_KEY` | Chuỗi ký tự (Bảo mật) | Token bảo mật tự đặt để kiểm thực Sepay Webhook gửi sang. |
| `PORT` | Số (Mặc định: `3000`) | Cổng lắng nghe mà backend API Server sẽ chạy trên VPS. |

*Mẫu tệp `.env` tham khảo:*
```env
VITE_SUPABASE_URL=https://ixsoouxbldvpyglrbiua.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
RESEND_API_KEY=re_your_resend_api_key_here
SEPAY_API_KEY=your_sepay_webhook_secret_here
PORT=3000
```

---

## 🌐 2. Cổng Lắng Nghe Hệ Thống (Listening Port)
*   Mặc định hệ thống lắng nghe trên cổng: **`3000`** (được cấu hình động qua `process.env.PORT || 3000`).
*   Trong tệp cấu hình Nginx Reverse Proxy trên VPS, hãy đảm bảo bạn cấu hình chuyển hướng luồng `/api/` về đúng cổng này:
    ```nginx
    location /api/ {
        proxy_pass http://localhost:3000;
        # ... các cấu hình proxy headers khác
    }
    ```

---

## 🚀 3. Các Lệnh Vận Hành Dự Án Trên VPS

Sau khi kết nối SSH vào VPS và chuyển tới thư mục của dự án (`/var/www/dscons-landing`), hãy sử dụng các lệnh dưới đây để cài đặt, xây dựng ứng dụng và chạy server:

### 🔹 Bước A: Cài đặt và cập nhật thư viện
```bash
npm install
```

### 🔹 Bước B: Biên dịch (Build) Frontend React SPA
```bash
npm run build
```
*Lệnh này sẽ tạo ra các tệp tĩnh trong thư mục `/dist` để Nginx có thể phân phối trực tiếp tới trình duyệt của người dùng.*

### 🔹 Bước C: Khởi chạy và Quản lý Backend API Server (sử dụng PM2)
Chúng ta sử dụng PM2 để chạy ngầm và giám sát server:

*   **Khởi chạy server lần đầu tiên**:
    ```bash
    pm2 start ecosystem.config.js
    ```
*   **Lưu cấu hình PM2 để tự khởi chạy khi khởi động lại VPS**:
    ```bash
    pm2 save
    pm2 startup
    ```
*   **Kiểm tra trạng thái đang hoạt động của server**:
    ```bash
    pm2 status
    ```
*   **Xem logs thời gian thực của server (để debug lỗi)**:
    ```bash
    pm2 logs dscons-backend
    ```
*   **Khởi động lại server khi bạn cập nhật code backend**:
    ```bash
    pm2 restart dscons-backend
    ```
*   **Dừng hoạt động của server**:
    ```bash
    pm2 stop dscons-backend
    ```

---

## 🔒 4. An toàn dữ liệu & Git
*   Các tệp `.env` (thông tin mật) và `brain.db` (cơ sở dữ liệu cục bộ SQLite) đã được đưa vào danh sách loại trừ trong `.gitignore`. Chúng **sẽ không** bị đẩy lên GitHub nên bạn có thể hoàn toàn an tâm.
