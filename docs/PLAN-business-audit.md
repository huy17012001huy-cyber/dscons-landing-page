# Kế Hoạch Tối Ưu Hóa Tiếp Thị & Kinh Doanh - Revit MEP

**Tệp khách hàng mục tiêu:** Kỹ sư mới ra trường & Kỹ sư lâu năm (35-40 tuổi).
**Định vị:** Sản phẩm tầm trung, đậm chất thực chiến.
**Mục tiêu:** Đập tan rào cản về giá/thời gian, tối ưu tỷ lệ chuyển đổi (CRO) bằng Lead Magnet và Bảng so sánh có AI.

---

## 🛠️ Chi Tiết Triển Khai (Dưới Góc Độ Chuyên Gia Business)

### Pha 1: Tối Ưu Hệ Thống "Hứng Lead" (Lead Generation)
**Vấn đề:** Khách hàng thấy giá/thời gian chưa phù hợp sẽ thoát trang vĩnh viễn. Bạn đã có sẵn quà nhưng chưa có phễu.
**Giải pháp:**
- **Triển khai:** Tích hợp hệ thống **Exit-intent Popup** (Popup hiện ra khi có ý định tắt Web).
- **Thông điệp mẫu:** "Xin khoan! Bạn đang bận rộn? Hãy tải bộ tài liệu/Video Revit MEP thực chiến rút gọn này để xem trước khi có thời gian học."
- **Quy trình tiếp theo:** Đẩy email thu thập được vào hệ thống chăm sóc `@02-email-automation`.

### Pha 2: Cấu Trúc Lại Nội Dung (Cho 2 Tập Khách Hàng Khác Biệt)
**Vấn đề:** Sinh viên mới ra trường cần "cơ hội việc làm", trong khi kỹ sư 35-40 tuổi cần "trực quan, dễ hiểu, áp dụng ngay vào dự án, không lý thuyết rườm rà".
**Giải pháp:**
- **Cập nhật Hero / Pain Points:** Tách rõ 2 Hook hoặc sử dụng Tabs để cá nhân hóa nội dung.
- **Micro-copy:** Nhấn mạnh thông điệp "Không học học thuật - Làm dự án thực tế" để chốt chặn tệp khách hàng lớn tuổi.

### Pha 3: Vũ Khí Chốt Sale (USP & Bảng So Sánh AI)
**Vấn đề:** Khách hàng cân nhắc giá với các trung tâm khác và lưỡng lự về thời gian.
**Giải pháp:**
- **Thêm tính năng:** Xây dựng phần `ComparisonTable.tsx` (Bảng so sánh).
- **Trải nghiệm AI:** Khách hàng nhập tên trung tâm B, AI sẽ lập tức phân tích và đưa ra lý do khách quan tại sao chọn trung tâm của bạn (Nhấn mạnh về: Dạy dự án thực tế, Support 1-1 qua Ultraview, và tự động hóa giải đáp bằng AI).
- **Xử lý rào cản thời gian:** Bổ sung mạnh thông điệp "Chỉ từ 30 phút mỗi ngày - Theo tiến độ cá nhân" ở phần Pricing.

### Pha 4: Theo Dõi & Đo Lường (Data Analytics)
**Giải pháp:** Bổ sung Event Tracking vào các nút bấm (để đo tỷ lệ "Tải quà tặng" so với "Mua ngay").

---

## 📋 Kiểm Tra & Đo Lường
- Giả lập hành vi tắt trang để kiểm tra Lead-gen Popup.
- Test phản hồi của Bảng so sánh AI với kịch bản gõ tên đối thủ.
- Kiểm duyệt giao diện trên Mobile cho tệp khách hàng trung niên.

---

*Lưu ý: Để thực hiện bảng so sánh AI, chúng ta sẽ cần phải thiết lập API gọi Gemini (hoặc LLM khác) ở phía Backend để bảo mật key.*
