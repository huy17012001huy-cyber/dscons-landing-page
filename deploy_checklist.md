# 📋 Hướng Dẫn & Checklist Deployment VPS Linux
> **Dự án:** DSCons Revit MEP - Landing Page & CRM System  
> **Người thực hiện:** DevOps Engineer  
> **Ngày chuẩn bị:** 2026-05-25  

Tài liệu này cung cấp toàn bộ phân tích chi tiết về kiến trúc hiện tại của dự án, các lỗ hổng bảo mật cần khắc phục ngay lập tức, danh sách các file cần tạo thêm và quy trình các bước chuẩn bị để deploy dự án lên VPS Linux thành công vào ngày mai.

---

## 🛠️ 1. Phân Tích Ngôn Ngữ & Framework (Framework Stack)

Dự án hiện tại là một ứng dụng web kết hợp giữa **Frontend tĩnh (SPA)** và **Backend API Serverless**, kết nối với dịch vụ cơ sở dữ liệu **Supabase**.

### Frontend Stack (Ứng dụng khách)
*   **Thư viện chính:** React (v18.3.1)
*   **Ngôn ngữ:** TypeScript (v5.8.3)
*   **Công cụ Build/Bundler:** Vite (v5.4.19)
*   **Giao diện & UI:**
    *   **Tailwind CSS (v3.4.17)** kết hợp với cấu hình tùy chỉnh (`tailwind.config.ts`).
    *   **Radix UI** (Accordion, Alert Dialog, Dialog, Context Menu, Dropdown Menu, Popover, Select, v.v.) kết hợp với các component được thiết kế theo chuẩn **shadcn/ui**.
    *   **Framer Motion / Motion (v12.38.0):** Dùng để xử lý các hiệu ứng động và micro-animations mượt mà.
    *   **Lucide React:** Bộ icons chính của ứng dụng.
*   **Quản lý State & Gọi API:**
    *   **React Query (v5.83.0):** Quản lý bộ đệm và đồng bộ dữ liệu.
    *   **React Router Dom (v6.30.1):** Xử lý định tuyến SPA phía Client.
    *   **React Hook Form & Zod:** Quản lý biểu mẫu và kiểm thực dữ liệu (Validation).

### Backend Stack (API & Webhook)
*   **Thư mục API:** Thư mục `/api` chứa 4 API Endpoint viết bằng **TypeScript** phục vụ các tính năng:
    *   `send-email.ts`: Gửi email tùy chỉnh qua dịch vụ Resend.
    *   `send-order-confirm.ts`: Gửi email xác nhận kèm link quà tặng khi nhận được thanh toán.
    *   `send-sequence.ts`: Gửi chuỗi email chăm sóc (Waitlist/Nurture/Sales sequence) tự động cho học viên.
    *   `sepay-webhook.ts`: Webhook nhận tín hiệu thanh toán tự động từ cổng Sepay, tự động khớp số điện thoại, cập nhật đơn hàng thành `completed` và trừ tồn kho ưu đãi.
*   **Đặc điểm kiến trúc:** Các API này được viết dưới dạng **Vercel Serverless Functions** (sử dụng chữ ký hàm `export default async function handler(req, res)` chạy trên môi trường Node.js).
*   **Cơ sở dữ liệu:** Kết nối và thao tác dữ liệu thông qua `@supabase/supabase-js`.

### Quản lý thư viện (Package Manager)
*   Dự án hỗ trợ song song cả **Bun** (`bun.lock`, `bun.lockb`) và **Node.js** (`package-lock.json`). Điều này rất tiện lợi vì bạn có thể chọn build/run bằng Node hoặc Bun trên VPS. (Khuyên dùng Bun vì tốc độ thực thi rất nhanh và hỗ trợ chạy trực tiếp file TypeScript backend không cần biên dịch).

---

## 🔒 2. Cảnh Báo Bảo Mật: API Key & Thông Tin Nhạy Cảm Lộ Trong Code

Qua quá trình kiểm tra quét mã nguồn, chúng tôi phát hiện hai lỗ hổng bảo mật **CỰC KỲ NGUY HIỂM** cần phải xử lý ngay lập tức trước khi đưa dự án lên Git hoặc deploy:

> [!CAUTION]
> ### 1. Lộ Resend API Key qua file `resend_config.txt`
> *   **Vấn đề:** Có một file tên là `resend_config.txt` nằm ngay ở thư mục gốc của dự án chứa trực tiếp API Key: `re_your_resend_api_key_here`.
> *   **Rủi ro:** File này **chưa được khai báo trong `.gitignore`**. Nếu bạn đẩy mã nguồn lên một kho chứa Git công khai (GitHub/GitLab), kẻ xấu sẽ lấy được khóa này và sử dụng tài khoản Resend của bạn để gửi hàng triệu email rác, dẫn đến khóa tài khoản hoặc phát sinh chi phí lớn.
> *   **Khắc phục:** 
>     1. Thêm dòng `resend_config.txt` vào cuối file `.gitignore` ngay lập tức.
>     2. Xóa file `resend_config.txt` khỏi Git cache nếu đã lỡ commit bằng lệnh: `git rm --cached resend_config.txt`.
>     3. Khai báo API Key này vào biến môi trường `RESEND_API_KEY` trên VPS thay vì lưu trong file text.

> [!WARNING]
> ### 2. Khóa Bí Mật Mặc Định Bị Hardcode Trong Webhook Sepay
> *   **File ảnh hưởng:** `api/sepay-webhook.ts` (Dòng 17)
> *   **Chi tiết:** `const expectedApiKey = process.env.SEPAY_API_KEY || 'dscons_secret_2026';`
> *   **Rủi ro:** Khóa dự phòng `'dscons_secret_2026'` đang bị hardcode. Nếu bạn quên không cấu hình biến môi trường `SEPAY_API_KEY` trên VPS, kẻ tấn công biết mã nguồn sẽ có thể giả mạo yêu cầu webhook từ Sepay để tự động kích hoạt trạng thái "Đã thanh toán" cho bất kỳ đơn hàng nào mà không cần chuyển khoản thật.
> *   **Khắc phục:** Hãy đảm bảo cấu hình biến môi trường `SEPAY_API_KEY` có độ bảo mật cao trên VPS và khuyến nghị xóa bỏ fallback hardcode này ra khỏi mã nguồn (hoặc thay thế bằng một chuỗi ngẫu nhiên dài hơn).

---

## 📂 3. Các File Cần Tạo Thêm Để Deploy Trên VPS Linux

Vì ban đầu dự án được cấu hình chạy serverless trên Vercel (`vercel.json`), khi chuyển sang VPS chạy Linux sử dụng Nginx, Nginx không thể tự chạy các file `.ts` trong thư mục `/api`. Chúng ta cần tạo thêm **3 file cấu hình** sau ở thư mục gốc để quản lý và vận hành backend.

### 📝 File 1: `server.ts` (Backend API Wrapper)
File này sẽ đóng vai trò là một Node.js/Bun Server dùng **Express** để import và chạy 4 API endpoint của bạn trên cổng `3000`.

*Tạo file `server.ts` ở thư mục gốc với nội dung:*

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Nạp các biến môi trường từ file .env
dotenv.config();

// Import trực tiếp các handler từ thư mục api
import sendEmailHandler from './api/send-email';
import sendOrderConfirmHandler from './api/send-order-confirm';
import sendSequenceHandler from './api/send-sequence';
import sepayWebhookHandler from './api/sepay-webhook';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Middleware giả lập cấu trúc Request và Response của Vercel Serverless
const vercelCompat = (handler: any) => {
  return async (req: express.Request, res: express.Response) => {
    try {
      // Giả lập req.method
      const compatReq = req as any;
      
      // Giả lập res.status().json() và res.setHeader()
      const compatRes = {
        setHeader: (name: string, values: string[]) => {
          res.setHeader(name, values);
        },
        status: (code: number) => {
          return {
            json: (data: any) => {
              res.status(code).json(data);
            }
          };
        }
      } as any;

      await handler(compatReq, compatRes);
    } catch (error) {
      console.error(`Lỗi thực thi API [${req.path}]:`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
};

// Định nghĩa các Route tương thích hoàn toàn với Client gọi
app.post('/api/send-email', vercelCompat(sendEmailHandler));
app.post('/api/send-order-confirm', vercelCompat(sendOrderConfirmHandler));
app.post('/api/send-sequence', vercelCompat(sendSequenceHandler));
app.post('/api/sepay-webhook', vercelCompat(sepayWebhookHandler));

// Phục vụ các file tĩnh của React nếu chạy chung cổng (hoặc để Nginx tự phục vụ - Khuyên dùng Nginx)
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 API Server đang chạy mượt mà tại http://localhost:${PORT}`);
});
```

### 📝 File 2: `ecosystem.config.js` (Cấu hình PM2)
Để giữ cho backend server (`server.ts`) luôn chạy ngầm trên VPS và tự khởi động lại khi hệ thống reboot.

*Tạo file `ecosystem.config.js` ở thư mục gốc với nội dung:*

```javascript
module.exports = {
  apps: [
    {
      name: "dscons-backend",
      script: "bun", // Khuyên dùng Bun để chạy trực tiếp file .ts cực kỳ mượt
      args: "run server.ts",
      // Nếu bạn dùng Node.js thì thay bằng:
      // script: "node_modules/.bin/tsx",
      // args: "server.ts",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
```

### 📝 File 3: Cấu hình Nginx (`dscons.nginx.conf`)
Đây là cấu hình khối server của Nginx để xử lý tên miền của bạn, định tuyến request và bật SSL. Bạn sẽ tạo file này trong thư mục `/etc/nginx/sites-available/dscons` trên VPS Linux.

*Nội dung cấu hình Nginx mẫu:*

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com; # Thay thế bằng domain thật

    # 1. Frontend: Phục vụ trực tiếp thư mục file tĩnh đã build của React
    root /var/www/dscons-landing/dist;
    index index.html;

    # Xử lý Router SPA của React (Tránh lỗi 404 khi F5 trang)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 2. Backend API & Webhook: Reverse Proxy sang Bun/Express Server chạy trên port 3000
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

    # Giới hạn kích thước tải lên (nếu có form gửi file)
    client_max_body_size 10M;
}
```

---

## 📋 4. Checklist Chuẩn Bị Toàn Diện Trước Khi Deploy Ngày Mai

Hãy hoàn thành toàn bộ các đầu việc dưới đây để đảm bảo quá trình deploy diễn ra trơn tru, không gặp sự cố gián đoạn.

### 🔹 Bước 1: Bảo mật Mã nguồn & Git
- [ ] 1. Thêm `resend_config.txt` vào file `.gitignore` để tránh bị đẩy lên GitHub.
- [ ] 2. (Quan trọng) Chạy thử build offline ở máy cá nhân bằng lệnh `bun run build` hoặc `npm run build` để kiểm tra xem có bất kỳ lỗi TypeScript nào trong thư mục `src/` không.
- [ ] 3. Push toàn bộ mã nguồn sạch lên Git repository (GitHub/GitLab ở dạng Private).

### 🔹 Bước 2: Thiết lập VPS Linux (Ví dụ Ubuntu 22.04 LTS)
- [ ] 1. Truy cập SSH vào VPS: `ssh root@<IP_CUA_VPS>`.
- [ ] 2. Cập nhật gói hệ thống:
  ```bash
  sudo apt update && sudo apt upgrade -y
  ```
- [ ] 3. Cài đặt các công cụ nền tảng:
  - **Nginx:** `sudo apt install nginx git -y`
  - **Bun (Khuyên dùng):** `curl -fsSL https://bun.sh/install | bash && source ~/.bashrc`
  - **NodeJS (Phương án dự phòng):**
    ```bash
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
    sudo npm install -y -g pm2
    ```

### 🔹 Bước 3: Cấu hình Dự án & Biến Môi Trường trên VPS
- [ ] 1. Clone mã nguồn về thư mục `/var/www/dscons-landing`:
  ```bash
  git clone <YOUR_GIT_REPO_URL> /var/www/dscons-landing
  ```
- [ ] 2. Chuyển vào thư mục và cài đặt các thư viện:
  ```bash
  cd /var/www/dscons-landing
  bun install # hoặc npm install
  ```
- [ ] 3. Tạo file cấu hình môi trường sản xuất `.env` ngay trên VPS:
  ```bash
  nano .env
  ```
- [ ] 4. Điền đầy đủ thông tin bảo mật vào file `.env` (Tuyệt đối không lưu lộ API Key):
  ```env
  VITE_SUPABASE_URL=https://ixsoouxbldvpyglrbiua.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsIn... (Anon Key thật của bạn)
  RESEND_API_KEY=re_your_resend_api_key_here
  SEPAY_API_KEY=dscons_secret_25052026_prod # Hãy đổi thành một token cực khó đoán
  ```

### 🔹 Bước 4: Khởi chạy Backend Server & Build Frontend
- [ ] 1. Khởi chạy API backend server ngầm bằng PM2:
  ```bash
  pm2 start ecosystem.config.js
  pm2 save
  pm2 startup
  ```
  *(Kiểm tra xem server chạy tốt không bằng lệnh: `pm2 status` hoặc `pm2 logs`)*
- [ ] 2. Build ứng dụng React thành file tĩnh:
  ```bash
  bun run build # hoặc npm run build
  ```
  *(Lệnh này sẽ tạo ra thư mục tĩnh `/var/www/dscons-landing/dist`)*

### 🔹 Bước 5: Định cấu hình Nginx & Cấp SSL (HTTPS)
- [ ] 1. Tạo file cấu hình Nginx cho tên miền:
  ```bash
  sudo nano /etc/nginx/sites-available/dscons
  ```
  *(Dán nội dung cấu hình Nginx ở mục 3 vào, thay thế `yourdomain.com` bằng tên miền thật).*
- [ ] 2. Kích hoạt cấu hình và khởi động lại Nginx:
  ```bash
  sudo ln -s /etc/nginx/sites-available/dscons /etc/nginx/sites-enabled/
  sudo nginx -t # Kiểm tra cú pháp xem có lỗi gì không
  sudo systemctl restart nginx
  ```
- [ ] 3. Cấp chứng chỉ SSL (HTTPS) miễn phí qua Certbot:
  ```bash
  sudo apt install certbot python3-certbot-nginx -y
  sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
  ```
  *(Chọn tự động Redirect HTTP sang HTTPS để toàn bộ web chạy qua cổng bảo mật `443`)*

### 🔹 Bước 6: Cấu hình Database & Tích hợp Cổng thanh toán (Sepay)
- [ ] 1. **Supabase Database:** Kiểm tra xem các bảng `orders`, `products`, `cms_sections`, `email_templates` đã chạy đúng schema và có đầy đủ dữ liệu mồi chưa.
- [ ] 2. **Cấu hình Webhook Sepay:**
  - Đăng nhập vào trang quản trị [sepay.vn](https://sepay.vn).
  - Vào phần cấu hình Tích hợp Webhook, tạo một webhook mới.
  - Điền URL: `https://yourdomain.com/api/sepay-webhook`
  - Chọn kiểu phương thức gửi: **POST** (định dạng JSON).
  - Điền Header `Authorization` có giá trị là: `Apikey <mã SEPAY_API_KEY bạn đã đặt trong file .env>` (Ví dụ: `Apikey dscons_secret_25052026_prod`).
- [ ] 3. **Kiểm tra luồng cuối:** Thử thanh toán một giao dịch test nhỏ để xem hệ thống Sepay gọi Webhook có tự khớp và gửi email tự động qua Resend thành công hay không.

Chúc ae bứt phá thành công và có buổi ra mắt dự án mượt mà vào ngày mai! Có vấn đề gì phát sinh cứ ping Huy hoặc đội hỗ trợ nhé! 🚀🎓
