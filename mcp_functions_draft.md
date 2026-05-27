# 🤖 Bản Thảo Đề Xuất Các MCP Functions Quản Trị Hệ Thống DSCons Qua Telegram (Top 3 Được Chọn)

Dựa trên phân tích chi tiết toàn bộ codebase của anh (hệ thống cơ sở dữ liệu SQLite/Supabase, các API webhook thanh toán Sepay, email sequence tự động qua Resend, và dữ liệu chatbot kỹ thuật), dưới đây là **3 MCP functions** anh đã lựa chọn để triển khai đầu tiên giúp anh vận hành hệ thống DSCons trực tiếp qua Telegram hàng ngày.

---

### 1. Báo cáo kinh doanh nhanh (`get_business_summary`)
*   **Độ ưu tiên:** ⭐⭐⭐⭐⭐ (5/5)
*   **Tình huống dùng hàng ngày:** "Xem nhanh doanh số bán khóa học, số học viên đăng ký mới và số chỗ ưu đãi (slots) còn lại cuối mỗi ngày ngay trên điện thoại."
*   **Input params:**
    *   `time_range` (Kiểu dữ liệu: `string` | Các giá trị: `today`, `yesterday`, `week`, `month` | Mặc định: `today`)
*   **Output dự kiến:**
    ```text
    📊 BÁO CÁO KINH DOANH DSCONS (Hôm nay):
    - Đăng ký danh sách chờ (Waitlist): 8 học viên mới.
    - Đơn hàng hoàn tất (Đã thanh toán): 3 đơn hàng.
    - Doanh thu thực tế: 14,200,000 VND (Khớp tự động qua Sepay).
    - Đơn hàng đang chờ (Pending): 2 đơn.
    - Chỗ ưu đãi còn lại (Slots):
      + Gói Thực Chiến (3.9M): Còn 11 / 45 slots.
      + Gói Combo (6.4M): Còn 27 / 28 slots.
      + Gói All In One (12M): Còn 12 / 12 slots.
    ```
*   **💬 Ví dụ câu nhắn Telegram sẽ trigger:**
    *   *"Hôm nay doanh thu thế nào rồi em?"*
    *   *"Xem báo cáo doanh số ngày hôm qua."*
    *   *"Báo cáo tình hình đăng ký tuần này cho anh với."*

---

### 2. Quản lý và duyệt đơn hàng nhanh (`manage_order_status`)
*   **Độ ưu tiên:** ⭐⭐⭐⭐ (4/5)
*   **Tình huống dùng hàng ngày:** "Kiểm tra nhanh tình trạng thanh toán của một học viên hoặc chủ động duyệt đơn thủ công (kích hoạt email quà tặng ngay lập tức) khi học viên chuyển khoản mặt hoặc ghi sai cú pháp."
*   **Input params:**
    *   `query` (Kiểu dữ liệu: `string` | Mô tả: Số điện thoại học viên hoặc Mã đơn hàng dạng `DS-xxx`)
    *   `action` (Kiểu dữ liệu: `string` | Các giá trị: `check` - chỉ xem, `complete` - duyệt thành công, `cancel` - hủy đơn | Mặc định: `check`)
*   **Output dự kiến:**
    ```text
    🔔 THÔNG TIN ĐƠN HÀNG:
    - ID đơn hàng: DS-1779856538
    - Họ tên: Nguyễn Văn A (SĐT: 0912345678)
    - Gói đăng ký: Khóa học Revit MEP Thực Chiến — GÓI COMBO
    - Số tiền: 6,400,000 VND
    - Trạng thái hiện tại: 🟡 PENDING (Chờ chuyển khoản)

    👉 [Thực hiện duyệt thành công]
    Trạng thái đơn hàng đã được cập nhật thành: 🟢 COMPLETED.
    Hệ thống đã tự động gửi Email xác nhận thanh toán kèm link tải tài liệu đặc quyền đến học viên!
    ```
*   **💬 Ví dụ câu nhắn Telegram sẽ trigger:**
    *   *"Kiểm tra đơn hàng của số điện thoại 0912345678."*
    *   *"Duyệt thành công đơn hàng DS-1779856538 bằng tay giúp anh."*
    *   *"Hủy đơn hàng của số 0987654321."*

---

### 3. Đọc phản hồi và khó khăn học viên (`get_recent_leads`)
*   **Độ ưu tiên:** ⭐⭐⭐⭐ (4/5)
*   **Tình huống dùng hàng ngày:** "Đọc nhanh danh sách học viên mới đăng ký waitlist cùng vị trí công việc, khó khăn thực tế (painpoint) và mục tiêu (goal) của họ để điều hướng nội dung email marketing hoặc tư vấn trực tiếp chuẩn xác."
*   **Input params:**
    *   `limit` (Kiểu dữ liệu: `integer` | Mặc định: `5`)
    *   `has_painpoints_only` (Kiểu dữ liệu: `boolean` | Lọc những người viết chi tiết khó khăn | Mặc định: `true`)
*   **Output dự kiến:**
    ```text
    📝 DANH SÁCH HỌC VIÊN ĐĂNG KÝ MỚI:
    1. Anh Trần Văn B (SĐT: 0987654321)
       - Vai trò: Kỹ sư cơ điện (MEP Site Engineer)
       - Khó khăn: "Đi công trường vẽ CAD 2D rất mất thời gian, bóc tách khối lượng ống tê cút còng lưng toàn bị sai số."
       - Mục tiêu: "Làm chủ Revit MEP trong 6 tuần để nhận thêm dự án thiết kế ngoài kiếm thêm thu nhập."
    ```
*   **💬 Ví dụ câu nhắn Telegram sẽ trigger:**
    *   *"Hôm nay có kỹ sư nào mới đăng ký waitlist không em?"*
    *   *"Xem cho anh 5 học viên mới đăng ký gần nhất đang gặp khó khăn gì."*
    *   *"Mấy bạn mới điền form đang có mục tiêu học tập là gì thế?"*
