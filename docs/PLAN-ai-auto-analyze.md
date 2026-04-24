# Kế hoạch Triển khai Tính năng "AI Nhận định tự động"

**Tóm tắt yêu cầu:** Biến nút "BẤT ĐẦU SO SÁNH TỰ ĐỘNG" (hiện tại đang là nút tĩnh mở modal) thành một quy trình tích hợp AI thực sự. Khi người dùng nhập thông tin về trung tâm đối thủ, AI (Gemini) sẽ được gọi để phân tích và điền tự động các tiêu chí so sánh vào cột "Trung tâm khác".

## Giai đoạn 1: Chuẩn bị Backend và API
1. **Thiết lập API Endpoint:**
   - Đảm bảo hàm `analyzeCompetitor` trong `src/lib/gemini.ts` đã được cấu hình đúng để gọi Gemini API (hoặc API tương đương mà hệ thống đang dùng).
   - Truyền ngữ cảnh (Prompt) chuẩn xác cho AI: Yêu cầu AI đóng vai một chuyên gia tư vấn giáo dục, phân tích điểm mạnh/yếu của "Trung tâm X" dựa trên các tiêu chí (Số lượng buổi học, Cam kết đầu ra, Chấm bài, v.v.).

2. **Định dạng dữ liệu trả về:**
   - Bắt buộc AI trả về định dạng JSON thuần túy (hoặc có cơ chế parse chuỗi trả về).
   - JSON cần map 1-1 với cấu trúc của các tiêu chí con (`itemIdx` hoặc `label`). Ví dụ: `{ "số lượng buổi": "Chỉ có 8 buổi", "cam kết": "Không rõ ràng", ... }`.

## Giai đoạn 2: Quản lý State trên Frontend
1. **Cập nhật State ở `Index.tsx` hoặc `CourseComparison.tsx`:**
   - Thêm state `isAnalyzing` (boolean) để hiển thị trạng thái loading (spinner/hiệu ứng xoay xoay).
   - Thêm state `showResult` (boolean) để chuyển đổi giao diện sau khi phân tích xong.
   - Thêm state `finalVerdict` (string) để lưu trữ lời nhận xét tổng quan của AI về đối thủ đó để hiển thị trên top của bảng.

2. **Cập nhật hàm xử lý sự kiện `handleAIAnalyze`:**
   - Ràng buộc: Người dùng phải nhập tên trung tâm thì mới được nhấn phân tích.
   - Gọi `analyzeCompetitor(competitorName)`:
     - `await` kết quả trả về.
     - Cập nhật state `localData` sao cho trường `competitor` của từng item được điền thông tin AI trả về.
   - Bắt lỗi (try/catch) phòng trường hợp API lỗi hoặc timeout, hiển thị toast thông báo cho người dùng.

## Giai đoạn 3: Cập nhật UI
1. **Trạng thái đang phân tích (Loading State):**
   - Nút nhấn chuyển thành trạng thái "Đang phân tích dữ liệu AI...".
   - Các ô ở cột "Trung tâm khác" hiển thị hiệu ứng skeleton loading hoặc nhấp nháy chữ.

2. **Hiển thị kết quả:**
   - Đổ dữ liệu từ `item.competitor` vào các ô. Các ô này cần kế thừa hệ thống Gradient mới nhất (đã được implement qua hàm `formatTextGradients`).
   - Hiển thị hộp thoại nhỏ nhắn nhủ `finalVerdict` của AI ở góc trên hoặc dưới bảng so sánh.

## Giai đoạn 4: Kiểm thử và Tối ưu (Verify & Optimize)
1. **Edge Cases:**
   - Người dùng nhập những từ khóa không liên quan (ví dụ: "Trung tâm ăn uống") -> AI phải từ chối khéo.
   - API trả về chậm -> Set timeout hợp lý (khoảng 15-20s) và báo lỗi nếu quá hạn.
2. **Review UX:**
   - Đảm bảo Modal không bị giật lag trong quá trình AI phân tích.

---
*Lưu ý: Bạn có thể gõ lệnh `/create` (hoặc báo cho tôi) để bắt đầu thực thi code cho kế hoạch này!*
