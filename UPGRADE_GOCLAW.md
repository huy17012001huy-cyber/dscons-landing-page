# 🤖 Hướng Dẫn Cập Nhật Chatbot goClaw (app.dscons.io.vn)

Tài liệu này hướng dẫn chi tiết các bước để cập nhật phiên bản mới của chatbot `goclaw` trên VPS `103.97.126.214`.

---

## 📌 Tổng Quan Hệ Thống Chatbot

*   **Đường dẫn trên VPS**: `/var/www/dscons_chatbot_goclaw/`
*   **Docker Container**:
    *   `goclaw_gateway` (Container chính chạy chatbot)
    *   `goclaw_postgres` (Cơ sở dữ liệu PostgreSQL + Vector)
*   **Các tệp cấu hình quan trọng cần bảo vệ**:
    *   `docker-compose.yml` (Cấu hình chạy Docker)
    *   `.env` (Biến môi trường bí mật)
    *   `config.json` (Cấu hình chatbot)

---

## 🚀 Quy Trình Cập Nhật Phiên Bản Mới (Clean Update)

Khi trên GitHub của dự án (ví dụ `nextlevelbuilder/goclaw`) có bản phát hành mới (như `v3.14.0`), hãy thực hiện các bước sau để cập nhật một cách an toàn mà không làm mất cấu hình chạy của bạn:

### Bước 1: SSH vào VPS
Sử dụng terminal hoặc các công cụ SSH để truy cập vào VPS:
```bash
ssh -p 2018 root@103.97.126.214
# Nhập mật khẩu: JpFn0YBmvd
```

### Bước 2: Di chuyển vào thư mục chatbot
```bash
cd /var/www/dscons_chatbot_goclaw
```

### Bước 3: Sao lưu cấu hình hiện tại
Tạo thư mục sao lưu tạm thời để lưu lại các tệp cài đặt cấu hình chạy của bạn:
```bash
mkdir -p /root/goclaw_backup
cp docker-compose.yml .env config.json /root/goclaw_backup/
```

### Bước 4: Xóa bỏ các thay đổi tạm thời trong code
Nhằm tránh xung đột khi chuyển đổi phiên bản mã nguồn:
```bash
git reset --hard HEAD
git clean -fd
```

### Bước 5: Thêm nguồn GitHub chính thức (nếu chưa có) và tải tag mới
```bash
# Thêm remote upstream chỉ cần chạy 1 lần đầu tiên
git remote add upstream https://github.com/nextlevelbuilder/goclaw.git 2>/dev/null || true

# Tải danh sách tag/phiên bản mới về VPS
git fetch upstream --tags
```

### Bước 6: Chuyển sang phiên bản mới muốn cập nhật
Thay thế `v3.14.0` bằng tag phiên bản bạn muốn cập nhật:
```bash
# Checkout sang tag phiên bản mới và tạo nhánh release mới
git checkout tags/v3.14.0 -b release-v3.14.0
```
> [!NOTE]
> Nếu nhánh `release-v3.14.0` đã tồn tại từ trước và báo lỗi, bạn có thể ép buộc tạo lại bằng lệnh:
> `git checkout -B release-v3.14.0 tags/v3.14.0`

### Bước 7: Khôi phục lại cấu hình chạy của bạn
```bash
cp /root/goclaw_backup/docker-compose.yml .
cp /root/goclaw_backup/.env .
cp /root/goclaw_backup/config.json .
```

### Bước 8: Biên dịch lại mã nguồn và khởi chạy
Do hệ thống của bạn tự build từ source code Go trong Dockerfile, bạn cần build lại không sử dụng cache để áp dụng code mới:
```bash
docker compose build --no-cache
docker compose up -d
```

---

## 🛠️ Các Lệnh Kiểm Tra & Xử Lý Sự Cố Thường Gặp

### 1. Xem trạng thái các container đang chạy
```bash
docker ps -a
```
*Đảm bảo cả 2 container `goclaw_gateway` và `goclaw_postgres` đều hiển thị trạng thái `Up ... (healthy)`.*

### 2. Theo dõi log hoạt động của Chatbot
```bash
docker logs goclaw_gateway --tail 100 -f
```
*(Nhấn `Ctrl + C` để thoát khỏi chế độ theo dõi log)*

### 3. Khởi động lại dịch vụ Chatbot
```bash
docker restart goclaw_gateway
```

### 4. Kiểm tra cấu hình kết nối database bên trong container
```bash
docker exec -it goclaw_gateway env | grep GOCLAW
```
