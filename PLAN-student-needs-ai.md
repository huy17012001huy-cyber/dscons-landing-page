# Plan: AI Comparison Tailored to Student Needs

## 1. Overview
Hệ thống hiện tại so sánh khóa học giữa DSCons và đối thủ một cách chung chung. Yêu cầu mới cần bổ sung một trường nhập liệu "Nhu cầu của học viên" vào bảng so sánh. AI sẽ sử dụng thông tin này để cá nhân hóa kết quả phân tích: đánh giá từng nhóm nội dung và đưa ra kết luận chốt hạ dựa trên chính xác những gì học viên mong muốn đạt được.

## 2. Project Type
**WEB** (Frontend UI update + Backend/API prompt update)

## 3. Success Criteria
- [ ] Giao diện có thêm ô nhập (Textarea) "Nhu cầu của bạn" trước nút bấm "Bắt đầu so sánh".
- [ ] Dữ liệu nhu cầu được truyền thành công vào hàm `analyzeCompetitor`.
- [ ] Prompt của Gemini AI được cập nhật để đặt "Nhu cầu học viên" làm hệ quy chiếu chính.
- [ ] AI trả về báo cáo trong đó phần `evaluation` và `conclusionPoints` có liên hệ trực tiếp đến nhu cầu của học viên.

## 4. Tech Stack
- React (TailwindCSS, Framer Motion) cho UI component.
- Google Gemini API (Prompt Engineering).

## 5. File Structure
Các file sẽ bị ảnh hưởng:
- `src/components/landing/CourseComparison.tsx`: Cập nhật UI thêm trường nhập liệu và truyền dữ liệu.
- `src/lib/gemini.ts`: Cập nhật hàm gọi API và Prompt.

## 6. Task Breakdown

### Task 1: Thêm ô nhập "Nhu cầu" vào Landing Page
- **Agent:** `frontend-specialist`
- **Skills:** `react-best-practices`
- **Priority:** P1
- **INPUT:** `CourseComparison.tsx`
- **OUTPUT:** Thêm thẻ `<textarea>` hoặc `<input>` để học viên nhập nhu cầu mong muốn. Truyền giá trị này vào cả hàm AI và hàm lưu Database.

### Task 2: Nâng cấp AI Prompt
- **Agent:** `backend-specialist`
- **Skills:** `api-patterns`
- **Priority:** P1
- **INPUT:** `gemini.ts`
- **OUTPUT:** Cập nhật prompt truyền `studentNeed` và ra lệnh cho AI phải bám sát nhu cầu này để đánh giá và chốt sale.

### Task 3: Cập nhật Database và API để lưu Lịch sử tra cứu
- **Agent:** `backend-specialist`
- **Skills:** `database-design`
- **Priority:** P2
- **INPUT:** `api.ts`, Supabase Schema
- **OUTPUT:** Hàm `saveCompetitorQuery(query, studentNeed, competitorData)` sẽ lưu thêm `student_need` (text) và `competitor_data` (jsonb). Cần update schema bảng `competitor_queries` trên Supabase nếu cần (hoặc dùng field json/text).

### Task 4: Chia Tab phần Bảng So Sánh trên Admin Dashboard
- **Agent:** `frontend-specialist`
- **Skills:** `react-best-practices`
- **Priority:** P2
- **INPUT:** `Dashboard.tsx`
- **OUTPUT:** Trong `activeSection === "comparison"`, tạo 2 Tabs (Tab 1: Cấu hình Bảng So sánh, Tab 2: Lịch sử Tra cứu).
- **VERIFY:** Admin dễ dàng xem được học viên đã tra cứu những trung tâm nào, nhập nhu cầu gì, và thông tin chi tiết từng tiêu chí họ nhập.

## 7. Phase X: Verification
- [ ] Giao diện có thêm ô nhập nhu cầu và AI dựa vào đó để trả kết quả.
- [ ] Database lưu được nhu cầu và thông tin đối thủ.
- [ ] Admin Dashboard có 2 tab rõ ràng, hiển thị danh sách lịch sử đẹp mắt.
