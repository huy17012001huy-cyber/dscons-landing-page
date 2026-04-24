import re

with open('src/pages/admin/Dashboard.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(r'\"ï¿½ Â ang Ẩn\"', '"Đang Ẩn"', text)
text = re.sub(r'ï¿½ ï¿½ï¿½ang ï¿½ ï¿½ï¿½Đ°ợc xÃ’Â¢y dÃ¡Â»Â±ng\.</p>', 'đang được xây dựng.</p>', text)
text = re.sub(r'\"Nháº­n Æ°u ï¿½ Ã£i ngay\"', '"Nhận ưu đãi ngay"', text)
text = re.sub(r'<label className=\"text-sm font-medium\">Tiêu ï¿½ ï¿½ï¿½Ã¡Â»Â </label>', '<label className="text-sm font-medium">Tiêu đề</label>', text)
text = re.sub(r'ï¿½ Â ï¿½ ï¿½ ng xuất', 'Đăng xuất', text)
text = re.sub(r'ï¿½ Â Ã’Â¡nh dấu là gói Khuyến Nghị \(Nổi bật\)', 'Đánh dấu là gói Khuyến Nghị (Nổi bật)', text)
text = re.sub(r'Mô tả ngắn gÃ¡Â»Â n', 'Mô tả ngắn gọn', text)
text = re.sub(r'<label className=\"text-sm font-medium\">Tiêu ï¿½ ï¿½ï¿½Ã¡Â»Â  phụ</label>', '<label className="text-sm font-medium">Tiêu đề phụ</label>', text)

with open('src/pages/admin/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Finished')
