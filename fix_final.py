import re
with open('src/pages/admin/Dashboard.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

regexes = [
    (r'Lịch sử H.*?c vi.*?n Tra cứu', 'Lịch sử Học viên Tra cứu'),
    (r'Ng.*?i mới', 'Người mới'),
    (r'M.*?u .*?đ.*? \b', 'Màu đỏ '),
    (r'Hi.*?n th.*? ô nhập Email thu th.*?p thông tin', 'Hiển thị ô nhập Email thu thập thông tin'),
    (r'\+ Th.*?m B.*?i H.*?c', '+ Thêm Bài Học'),
    (r'Quy.*?n l.*?i của gói', 'Quyền lợi của gói'),
    (r'Google/AI API Key \(Dùng cho Bảng So S.*?nh\)', 'Google/AI API Key (Dùng cho Bảng So Sánh)'),
    (r'ï¿½ Â ï¿½ ï¿½ ng ký ngay', 'Đăng ký ngay'),
    (r'N.*?i dung mới', 'Nội dung mới'),
    (r'C.*?i .*?t giao diện', 'Cài đặt giao diện'),
    (r'ï¿½ ï¿½ï¿½ang ï¿½ ï¿½ï¿½ï¿½ Â°.*?c x.*?y d.*?ng', 'đang được xây dựng'),
    (r'Mô tả n.*?i dung', 'Mô tả nội dung'),
    (r'>Ti.*?u .*?bảng<', '>Tiêu đề bảng<'),
    (r'Các Gói H.*?c Ph.*?</', 'Các Gói Học Phí</'),
    (r'ï¿½ Â ang Ẩn', 'Đang Ẩn'),
    (r'C.*?u h.*?i mới\?', 'Câu hỏi mới?'),
    (r'C.*?u tr.*? l.*?i\.\.\.', 'Câu trả lời...'),
    (r'Quy.*?n l.*?i mới', 'Quyền lợi mới'),
    (r'Ti.*?u đ.*? phụ', 'Tiêu đề phụ'),
    (r'Mô tả n.*?i dung bên trái', 'Mô tả nội dung bên trái'),
    (r'Mô tả .*? d.*?i / l.*?u ý', 'Mô tả độ dài / lưu ý'),
    (r'Ti.*?u .*? phụ bên trái', 'Tiêu đề phụ bên trái'),
    (r'Tên b.*?i h.*?c', 'Tên bài học'),
    (r'\+ Th.*?m L.*?i .*?ch', '+ Thêm Lợi Ích'),
    (r'0ï¿½ ï¿½ï¿½', '0đ'),
    (r'Quy.*?n l.*?i 1', 'Quyền lợi 1'),
    (r'Danh sách Modules & B.*?i h.*?c', 'Danh sách Modules & Bài học'),
    (r'N.*?i dung ti.*?u .*? ch.*?nh', 'Nội dung tiêu đề chính'),
    (r'Ti.*? u s.*? \(Bio\)', 'Tiểu sử (Bio)'),
    (r'Chưa ï¿½ ï¿½ï¿½ï¿½ ï¿½ ng nh.*?p', 'Chưa đăng nhập'),
    (r'ï¿½ Â o.*?n m.*? m.*? tả ngắn', 'Đoạn mô tả ngắn'),
    (r'Ti.*?u .*? Popup', 'Tiêu đề Popup'),
    (r'Link  i.*?u h.*?ng \(Anchor Link\)', 'Link điều hướng (Anchor Link)'),
    (r'N.*?i dung khối bên trái \(Sidebar\)', 'Nội dung khối bên trái (Sidebar)'),
    (r'Nhận t.*?i li.*?!u ngay', 'Nhận tài liệu ngay'),
    (r'ï¿½ Â Ã.*? lưu nháp b.*? ph.*?n:', 'Đã lưu nháp bộ phận:'),
    (r'C.*?i .*?t hệ thống', 'Cài đặt hệ thống'),
    (r'ï¿½ Â Ã.*?nh d.*?u l.*? gói Khuyến Nghị \(Nổi bật\)', 'Đánh dấu là gói Khuyến Nghị (Nổi bật)'),
    (r'Link .*?nh n.*?n / Image URL', 'Link Ảnh nền / Image URL'),
    (r'ï¿½ Â ï¿½ ï¿½ ng xu.*?t', 'Đăng xuất'),
    (r'Nh.*?n Lead Email', 'Nhận Lead Email'),
    (r'Nhận .*?u .*? đ.*?i ngay', 'Nhận ưu đãi ngay'),
    (r'Bi.*? u t.*?ng', 'Biểu tượng'),
    (r'Ti.*?u .*? quà tặng', 'Tiêu đề quà tặng'),
    (r'ï¿½ Â Ã.*? (hi.*?n th.*?|ẩn) b.*? ph.*?n n.*?y!', lambda m: f"Đã {m.group(1)} bộ phận này!"),
    (r'Tên h.*?c vi.*?n', 'Tên học viên'),
    (r'\+ Th.*?m l.*?i cảm nhận', '+ Thêm lời cảm nhận'),
    (r'\+ Th.*?m quy.*?n l.*?i', '+ Thêm quyền lợi'),
    (r'Ti.*?u .*? l.*?i .*?ch', 'Tiêu đề lợi ích'),
    (r'M.*?u ï¿½ ï¿½ï¿½.*? ', 'Màu đỏ '),
    (r'H.*? c vi.*?n', 'Học viên'),
    (r'C.*?u h.*?i', 'Câu hỏi'),
    (r'Ti.*?u đ.*?</', 'Tiêu đề</'),
    (r'ï¿½ Â o.*?n m.*? t.*? ngắn', 'Đoạn mô tả ngắn'),
    (r'vÃ’Â¹ng', 'vùng')
]

for pat, repl in regexes:
    text = re.sub(pat, repl, text)

with open('src/pages/admin/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Done')
