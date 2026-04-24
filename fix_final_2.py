with open('src/pages/admin/Dashboard.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

replacements = [
    ('Màu ï¿½ ï¿½ï¿½Ã¡Â»Â ', 'Màu đỏ'),
    ('hiộ n thÃ¡Â»â¬¹', 'hiển thị'),
    ('bộ ï¿½ phÃ¡ÂºÂ­n này', 'bộ phận này'),
    ('bộ ï¿½ phÃ¡ÂºÂ­n:', 'bộ phận:'),
    ('ï¿½ Â ï¿½ ï¿½ ng ký ngay', 'Đăng ký ngay'),
    ('HÃ¡Â»Â c viên', 'Học viên'),
    ('Nộ ï¿½i dung', 'Nội dung'),
    ('ngắn gÃ¡Â»Â n', 'ngắn gọn'),
    ('ï¿½ Â Ã’Â¡nh dấu', 'Đánh dấu'),
    ('Tiêu ï¿½ ï¿½ï¿½Ã¡Â»Â ', 'Tiêu đề'),
    ('0ï¿½ ï¿½ï¿½', '0đ'),
    ('kÃ’Â©o thả', 'kéo thả'),
    ('chÃ¡Â»â¬°nh sÃ¡Â»Â­a', 'chỉnh sửa'),
    ('linh kiÃ¡Â»â¬¡n', 'linh kiện'),
    ('ï¿½ ï¿½ï¿½ang ï¿½ ï¿½ï¿½Đ°ợc xÃ’Â¢y dÃ¡Â»Â±ng', 'đang được xây dựng'),
    ('classNội dung khối bên trái', 'className="w-4 h-4" /> Nội dung khối bên trái'),
    ('Link  iï¿½u hï¿½ï¿½ng', 'Link điều hướng'),
    ('Chưa ï¿½ ï¿½ï¿½ï¿½ ï¿½ ng nhÃ¡ÂºÂ­p', 'Chưa đăng nhập'),
    ('Nháº­n Æ°u ï¿½ Ã£i ngay', 'Nhận ưu đãi ngay'),
    ('Thá»±c Chiáº¿n', 'Thực Chiến'),
    ('ï¿½ Â oÃ¡ÂºÂ¡n mÃ’Â´ tả', 'Đoạn mô tả'),
    ('Nháº­n tÃ i liï¿½!u ngay', 'Nhận tài liệu ngay'),
    ('ï¿½ Â ï¿½ ï¿½ ng xuất', 'Đăng xuất'),
    ('Tiộ u sÃ¡Â»Â­', 'Tiểu sử'),
    ('chi tiÃ¡ÂºÂ¿t...', 'chi tiết...'),
    ('ï¿½ Â ang Ẩn', 'Đang Ẩn'),
    ('ï¿½ Â Ã’Â£', 'Đã'),
    ('vÃ’Â¹ng', 'vùng'),
    ('TiÃ¡Â»ï¿½ u sÃ¡Â»Â­', 'Tiểu sử'),
    ('Link Ã¡ÂºÂ¢nh nÃ¡Â»Â n', 'Link Ảnh nền'),
    ('ï¿½ Â', 'Đ'),
    ('Ã¡ÂºÂ£', 'ả'),
    ('Ã’Âª', 'ê'),
    ('Ã¡Â»Â ', 'ồ'),
    ('Ã’Â ', 'à'),
    ('Ã¡Â»Â¥', 'ụ'),
    ('Ã¡ÂºÂ·', 'ặ'),
    ('Ã¡ÂºÂ¥', 'ấ'),
    ('Ã’Â³', 'ó'),
    ('Ã¡ÂºÂ§', 'ầ'),
    ('Ã¡Â»ï¿½', 'ộ'),
    ('Ã¡Â»â¬º', 'ư'),
    ('Ã’Â½', 'ý'),
    ('Ã¡Â»Â ', 'ọ'),
    ('Ã¡Â»Â£', 'ợ')
]

for pat, repl in replacements:
    text = text.replace(pat, repl)

with open('src/pages/admin/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
