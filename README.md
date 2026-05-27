# 🚀 DSCons Revit MEP - Landing Page & CRM System

Dự án Landing Page kết hợp hệ thống CRM quản lý học viên thực chiến và tích hợp cổng thanh toán tự động (Sepay) cho **DSCons**.

---

## 🛠️ Tech Stack & Kiến Trúc
Dự án được triển khai dưới mô hình **Single Page Application (SPA)** kết hợp với **Node.js/Bun API Server** và **Supabase Database**:

*   **Frontend**: React (v18), TypeScript, Vite (bundler), Tailwind CSS (styling), Radix UI (shadcn/ui), Framer Motion (animations).
*   **Backend**: Node.js/Bun Express Server (chạy file `server.ts` thông qua `tsx` hoặc `bun`).
*   **Database & Auth**: Supabase Cloud.
*   **Dịch vụ ngoài**:
    *   **Resend API**: Gửi email tự động (Email Chào mừng, Email Chăm sóc học viên, Email biên lai thanh toán).
    *   **Sepay.vn**: Cổng tự động quét giao dịch ngân hàng và khớp thông tin qua Webhook.

---

## 📂 Danh Sách Các File Quan Trọng Cho Deployment
*   `server.ts`: API Server chạy Express nạp trực tiếp các API handler từ `/api` phục vụ trên VPS (Port 3000).
*   `ecosystem.config.js`: Cấu hình PM2 để giám sát và khởi chạy ngầm backend API trên Linux.
*   `deploy_checklist.md`: Bảng checklist chi tiết từng bước chuẩn bị hệ thống và kiểm tra an toàn trước khi lên production.
*   `.gitignore`: Đã cấu hình bỏ qua các tệp nhạy cảm (như `.env` và `resend_config.txt`).

---

## 💻 Chạy Dưới Local Development

### 1. Cài đặt các thư viện phụ thuộc
Đảm bảo bạn đã cài đặt Node.js (phiên bản 18+) hoặc Bun:
```bash
npm install
# hoặc nếu dùng Bun:
bun install
```

### 2. Thiết lập cấu hình môi trường (.env)
Tạo file `.env` ở thư mục gốc và cấu hình các biến sau:
```env
VITE_SUPABASE_URL=https://ixsoouxbldvpyglrbiua.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
SEPAY_API_KEY=your_sepay_webhook_secret_key
```

### 3. Khởi chạy dự án
*   **Chạy Frontend**:
    ```bash
    npm run dev
    ```
*   **Chạy Backend API**:
    ```bash
    npx tsx server.ts
    # hoặc nếu có Bun:
    bun run server.ts
    ```

---

## 🌍 Hướng Dẫn Deploy Lên VPS Linux (Ubuntu Server)

Để đưa ứng dụng lên chạy chính thức trên VPS chạy Linux sử dụng **Nginx** và **PM2**, hãy làm theo các bước cơ bản sau:

### Bước 1: Thiết lập VPS & Cài đặt phần mềm cần thiết
Kết nối SSH vào VPS của bạn và chạy các lệnh cài đặt:
```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài đặt Nginx và Git
sudo apt install nginx git -y

# Cài đặt Node.js (LTS v20) và PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -y -g pm2
```

### Bước 2: Clone dự án & Cài đặt thư viện trên VPS
```bash
# Clone mã nguồn
git clone <YOUR_GIT_REPO_URL> /var/www/dscons-landing
cd /var/www/dscons-landing

# Cài đặt thư viện
npm install
```

### Bước 3: Tạo file cấu hình môi trường `.env`
Tạo file `.env` ngay trên thư mục dự án của VPS:
```bash
nano .env
```
Nhập đầy đủ thông tin khóa bí mật (Supabase, Resend API Key, Sepay Webhook Secret Key).

### Bước 4: Khởi chạy API Server (Backend) & Build Frontend
*   **Chạy Backend ngầm bằng PM2**:
    ```bash
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup
    ```
*   **Build Frontend tĩnh**:
    ```bash
    npm run build
    ```
    *Thư mục `/var/www/dscons-landing/dist` sẽ được sinh ra chứa toàn bộ mã nguồn frontend.*

### Bước 5: Định cấu hình Nginx Server Block
Tạo tệp cấu hình Nginx mới cho tên miền của bạn:
```bash
sudo nano /etc/nginx/sites-available/dscons
```
Dán cấu hình Server Block sau vào:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com; # Thay thế bằng domain của bạn

    root /var/www/dscons-landing/dist;
    index index.html;

    # Xử lý React SPA Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Định tuyến các request API đến Backend Server chạy cổng 3000
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Kích hoạt cấu hình và khởi động lại Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/dscons /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Bước 6: Cấu hình SSL (HTTPS) qua Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Bước 7: Cấu hình cổng thanh toán Sepay Webhook
Truy cập tài khoản Sepay của bạn, cấu hình Webhook trỏ đến:
`https://yourdomain.com/api/sepay-webhook` với Header `Authorization` có giá trị là `Apikey <MÃ_SEPAY_API_KEY_BẠN_ĐẶT_TRONG_ENV>`.

---

## 🔒 Ghi chú An toàn & Bảo mật
*   **Không commit file `.env` hay `resend_config.txt`**: Cả hai file đã được thêm vào `.gitignore` để tránh rò rỉ mã bảo mật trên Git.
*   **Tránh dùng token mặc định**: Trong production, luôn luôn cấu hình đầy đủ `SEPAY_API_KEY` và `RESEND_API_KEY` trong file `.env`.

Chúc bạn triển khai dự án lên VPS thành công rực rỡ! 🚀🎓
