# 🚀 DSCons CRM MCP Server (Model Context Protocol)

Tài liệu này hướng dẫn cách vận hành, cấu hình và triển khai máy chủ MCP Server quản trị cơ sở dữ liệu học viên & đơn hàng của DSCons qua giao thức bảo mật nội bộ `streamable-http` (SSE).

---

## 🛠️ Yêu Cầu Nền Tảng
*   **Node.js**: Phiên bản >= 18.0 (để hỗ trợ native `fetch` gọi API xác nhận đơn hàng).
*   **Cơ sở dữ liệu**: Kết nối trực tiếp vào tệp SQLite `brain.db` chung của dự án.
*   **Bảo mật**: Chỉ lắng nghe và bind duy nhất trên IP nội bộ `127.0.0.1` cổng `3001` (Localhost-Only). Tuyệt đối **không** mở cổng này ra ngoài internet để bảo vệ an toàn dữ liệu khách hàng.

---

## 📂 Danh Sách MCP Functions Expose (Tools)

Hệ thống cung cấp 3 công cụ (tools) chuẩn hóa cho AI (goClaw Chatbot) gọi qua Telegram:

1.  **`get_business_summary`**: Báo cáo nhanh số học viên waitlist đăng ký mới, số đơn hàng hoàn thành, doanh thu thực tế và slots ưu đãi còn lại của các gói khóa học.
2.  **`manage_order_status`**: Tìm kiếm đơn hàng theo Số điện thoại / Mã đơn hàng, kiểm tra chi tiết đơn hàng, hoặc kích hoạt duyệt thành công / hủy đơn hàng bằng tay. (Khi duyệt thành công sẽ tự động khấu trừ slots kho và gọi sang Express API ở port 3000 để bắn email xác nhận kèm link quà tặng).
3.  **`get_recent_leads`**: Đọc nhanh danh sách học viên đăng ký waitlist mới nhất kèm vị trí công việc, khó khăn (painpoints) và mục tiêu học tập của họ.

---

## 💻 Hướng Dẫn Vận Hành Local (Phát triển)

Chuyển tới thư mục `/mcp` của dự án và thực hiện các lệnh:

1.  **Cài đặt thư viện**:
    ```bash
    npm install
    ```
2.  **Khởi chạy chế độ Development** (tự động reload khi sửa file):
    ```bash
    npm run dev
    ```
3.  **Biên dịch (Build)**:
    ```bash
    npm run build
    ```
4.  **Khởi chạy Production**:
    ```bash
    npm run start
    ```

---

## 🚀 Hướng Dẫn Deploy Lên VPS Ubuntu Production (Sử dụng Systemd)

Để đảm bảo MCP Server luôn chạy ngầm và tự khởi chạy lại khi VPS khởi động lại (Reboot), hãy cấu hình systemd service:

### Bước 1: Tạo tệp Service Systemd trên VPS
Kết nối SSH vào VPS và tạo tệp cấu hình service mới:
```bash
sudo nano /etc/systemd/system/dscons-mcp.service
```

### Bước 2: Dán nội dung cấu hình dưới đây vào:
```ini
[Unit]
Description=DSCons CRM MCP Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/my-website/mcp
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production PORT=3000

[Install]
WantedBy=multi-user.target
```
> [!NOTE]
> *   Hãy đảm bảo `WorkingDirectory` trỏ đúng về thư mục `/mcp` của dự án đã clone trên VPS.
> *   `User` nên đặt là tài khoản vận hành web của bạn (ví dụ `root` hoặc `www-data`).

### Bước 3: Kích hoạt và khởi chạy service
```bash
# Tải lại cấu hình systemd
sudo systemctl daemon-reload

# Bật tính năng tự khởi động cùng hệ thống
sudo systemctl enable dscons-mcp.service

# Khởi chạy MCP Server ngay lập tức
sudo systemctl start dscons-mcp.service

# Kiểm tra trạng thái hoạt động của server
sudo systemctl status dscons-mcp.service

# Xem logs ghi nhận thời gian thực
sudo journalctl -u dscons-mcp.service -f
```

---

## 🧪 Hướng Dẫn Kiểm Thử (Curl Test)

Hệ thống MCP SSE giao tiếp qua hai cổng:
- GET `/mcp` : Khởi tạo luồng Server-Sent Events.
- POST `/messages?sessionId=<session_id>` : Nhận lệnh điều phối dưới dạng giao thức JSON-RPC 2.0.

Anh có thể chạy test nhanh từ máy tính hoặc trực tiếp trên VPS để đảm bảo mọi thứ thông suốt bằng các lệnh sau:

### 1. Báo cáo kinh doanh (`get_business_summary`):
```bash
curl -X POST "http://127.0.0.1:3001/messages?sessionId=test-session" \
     -H "Content-Type: application/json" \
     -d '{
       "jsonrpc": "2.0",
       "id": 1,
       "method": "tools/call",
       "params": {
         "name": "get_business_summary",
         "arguments": {
           "time_range": "today"
         }
       }
     }'
```
