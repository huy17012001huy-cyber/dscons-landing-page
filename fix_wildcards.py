import re

with open('src/pages/admin/Dashboard.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Top level sections
text = re.sub(r'Ch.*?nh s.*?a n.*?i dung', 'Chỉnh sửa nội dung', text)
text = re.sub(r'Thay đ.*?i n.*?i dung text, h.*?nh.*?nh', 'Thay đổi nội dung text, hình ảnh', text)
text = re.sub(r'Thay .*?i n.*?i dung text, h.*?nh.*?nh', 'Thay đổi nội dung text, hình ảnh', text)
text = re.sub(r'Logo Image \(T.*?y ch.*?n t.*?i l.*?n\)', 'Logo Image (Tùy chọn tải lên)', text)
text = re.sub(r'Links Menu.*?u H.*?ng', 'Links Menu Điều Hướng', text)
text = re.sub(r'C.*?i đ.*?t Landing Page', 'Cài đặt Landing Page', text)
text = re.sub(r'C.*?i .*?t Landing Page', 'Cài đặt Landing Page', text)
text = re.sub(r'>.*?\sng xu.*?t<', '>Đăng xuất<', text)
text = re.sub(r'C.*?c v.*?n đ.*? g.*?p ph.*?i', 'Các vấn đề gặp phải', text)
text = re.sub(r'C.*?c v.*?n .*? g.*?p ph.*?i', 'Các vấn đề gặp phải', text)

# Labels
text = re.sub(r'<label className="text-sm font-medium">Ti.*?u đ.*? ch.*? th.*?ch.*?label>', '<label className="text-sm font-medium">Tiêu đề chú thích (Badge)</label>', text)
text = re.sub(r'<label className="text-sm font-medium">Ti.*?u .*? ch.*? th.*?ch.*?label>', '<label className="text-sm font-medium">Tiêu đề chú thích (Badge)</label>', text)
text = re.sub(r'<label className="text-sm font-medium">Ti.*?u đ.*? ch.*?nh.*?label>', '<label className="text-sm font-medium">Tiêu đề chính</label>', text)
text = re.sub(r'<label className="text-sm font-medium">Ti.*?u .*? ch.*?nh.*?label>', '<label className="text-sm font-medium">Tiêu đề chính</label>', text)
text = re.sub(r'<label className="text-sm font-medium">Ti.*?u đ.*? \(Headline\).*?label>', '<label className="text-sm font-medium">Tiêu đề (Headline)</label>', text)
text = re.sub(r'<label className="text-sm font-medium">Ti.*?u .*? \(Headline\).*?label>', '<label className="text-sm font-medium">Tiêu đề (Headline)</label>', text)
text = re.sub(r'<label className="text-sm font-medium">Ti.*?u đ.*? FAQ \(Headline\).*?label>', '<label className="text-sm font-medium">Tiêu đề FAQ (Headline)</label>', text)
text = re.sub(r'<label className="text-sm font-medium">Ti.*?u .*? FAQ \(Headline\).*?label>', '<label className="text-sm font-medium">Tiêu đề FAQ (Headline)</label>', text)

text = re.sub(r'<label className="text-sm font-medium">Danh s.*?ch c.*?u h.*?i.*?gi.*?i đ.*?p.*?label>', '<label className="text-sm font-medium">Danh sách câu hỏi & giải đáp</label>', text)
text = re.sub(r'<label className="text-sm font-medium">Danh s.*?ch c.*?u h.*?i.*?gi.*?i .*?p.*?label>', '<label className="text-sm font-medium">Danh sách câu hỏi & giải đáp</label>', text)
text = re.sub(r'<label className="text-sm font-medium">Danh s.*?ch Gi.*?i ph.*?p.*?L.*?i .*?ch.*?</label>', '<label className="text-sm font-medium">Danh sách Giải pháp / Lợi ích</label>', text)

text = re.sub(r'<label className="text-sm font-medium">T.*?n gi.*?ng vi.*?n</label>', '<label className="text-sm font-medium">Tên giảng viên</label>', text)
text = re.sub(r'<label className="text-xs font-medium opacity-70 uppercase">Ti.*?u đ.*? qu.*? t.*?ng \(K.*?m gi.*? tr.*?\)</label>', '<label className="text-xs font-medium opacity-70 uppercase">Tiêu đề quà tặng (Kèm giá trị)</label>', text)
text = re.sub(r'<label className="text-xs font-medium opacity-70 uppercase">Ti.*?u .*? qu.*? t.*?ng \(K.*?m gi.*? tr.*?\)</label>', '<label className="text-xs font-medium opacity-70 uppercase">Tiêu đề quà tặng (Kèm giá trị)</label>', text)

text = re.sub(r'<label className="text-xs font-medium">Gi.*? b.*?n</label>', '<label className="text-xs font-medium">Giá bán</label>', text)
text = re.sub(r'<label className="text-sm font-medium">Ch.*?n lo.*?i \/ T.*?nh n.*?ng n.*?i b.*?t</label>', '<label className="text-sm font-medium">Chọn loại / Tính năng nổi bật</label>', text)
text = re.sub(r'Đ.*?y l.*? lo.*?i đ.*?c khuy.*?n d.*?ng', 'Đây là loại được khuyên dùng', text)
text = re.sub(r'<label className="text-sm font-medium">M.*?c th.*?t.*?\/ M.*?c ti.*?u</label>', '<label className="text-sm font-medium">Mục tiêu / Lợi ích</label>', text)
text = re.sub(r'<label className="text-sm font-medium">Vai tr.*?\/ Ch.*?c v.*?</label>', '<label className="text-sm font-medium">Vai trò / Chức vụ</label>', text)
text = re.sub(r'<label className="text-sm font-medium">L.*?i nh.*?n x.*?t \(Review\)</label>', '<label className="text-sm font-medium">Lời nhận xét (Review)</label>', text)

# Buttons / actions
text = re.sub(r'\+ Th.*?m v.*?n.*?\n', '+ Thêm vấn đề\n', text)
text = re.sub(r'\+ Th.*?m c.*?u h.*?i\n', '+ Thêm câu hỏi\n', text)
text = re.sub(r'\+ Th.*?m l.*?i .*?ch\n', '+ Thêm lợi ích\n', text)
text = re.sub(r'\+ Th.*?m gi.*?ng vi.*?n\n', '+ Thêm giảng viên\n', text)
text = re.sub(r'\+ Th.*?m g.*?i c.*?c\n', '+ Thêm gói cước\n', text)

text = re.sub(r'<option value="image">H.*?nh .*?nh</option>', '<option value="image">Hình ảnh</option>', text)
text = re.sub(r'X.*?a<', 'Xóa<', text)

# Settings specific
text = re.sub(r'<h3 className="text-lg font-semibold">T.*?y ch.*?n hi.*?n th.*?</h3>', '<h3 className="text-lg font-semibold">Tùy chọn hiển thị</h3>', text)
text = re.sub(r'Ch.*?n ch.*? đ.*? s.*?ng \/ t.*?i', 'Chọn chế độ sáng / tối', text)
text = re.sub(r'Ch.*? đ.*? Dark Mode', 'Chế độ Dark Mode', text)
text = re.sub(r'Huy.*?n b.*?, hi.*?n đ.*?i \(Khuy.*?n ngh.*?\)', 'Huyền bí, hiện đại (Khuyến nghị)', text)

# Other sections
text = re.sub(r'Đ.*? l.*?i email đ.*? nh.*?n ngay b.*? t.*?i li.*?u Revit MEP Mi.*?n ph.*? v.*? .*?u đ.*?i đ.*?c bi.*?t.', 'Để lại email để nhận ngay bộ tài liệu Revit MEP Miễn phí và ưu đãi đặc biệt.', text)
text = re.sub(r'Đ.*?ng b.*? l.*? c.*? h.*?i th.*?ng ti.*?n!', 'Đừng bỏ lỡ cơ hội thăng tiến!', text)

with open('src/pages/admin/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed with regex wildcards")
