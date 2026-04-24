import re

with open('src/pages/admin/Dashboard.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace specific labels by matching the surrounding tags

# Giảng viên Tab
text = re.sub(r'<label className=\"text-sm font-medium\">Ti.*? \(Bio\)</label>', '<label className="text-sm font-medium">Tiểu sử (Bio)</label>', text)
text = re.sub(r'<label className=\"text-sm font-medium\">Link .*? Image URL</label>', '<label className="text-sm font-medium">Link Ảnh nền / Image URL</label>', text)
text = re.sub(r'Thay đổi nội dung text, hình ảnh cho v.*?ng {', 'Thay đổi nội dung text, hình ảnh cho vùng {', text)

# Other common labels
text = re.sub(r'<label className=\"text-sm font-medium\">.*?o.*?n m.*? tả ngắn</label>', '<label className="text-sm font-medium">Đoạn mô tả ngắn</label>', text)
text = re.sub(r'value={headerForm\.cta \|\| ".*?"}', 'value={headerForm.cta || "Đăng ký ngay"}', text)
text = re.sub(r'toast\.success\(`.*?hi.*?n th.*?.*?:.*?ẩn.*?b.*? ph.*?n n.*?y!`\);', 'toast.success(`Đã ${newViz ? \'hiển thị\' : \'ẩn\'} bộ phận này!`);', text)
text = re.sub(r'toast\.success\(".*? lưu nháp b.*? ph.*?n: " \+ activeSection\);', 'toast.success("Đã lưu nháp bộ phận: " + activeSection);', text)
text = re.sub(r'Khu v.*?c kéo thả và ch.*?nh s.*?a linh ki.*?n cho', 'Khu vực kéo thả và chỉnh sửa linh kiện cho', text)
text = re.sub(r'đang.*?đ.*?c x.*?y d.*?ng\.</p>', 'đang được xây dựng.</p>', text)
text = re.sub(r'user\?\.email \|\| "Chưa .*?ng nh.*?p"', 'user?.email || "Chưa đăng nhập"', text)
text = re.sub(r'Màu .*?</label>', 'Màu đỏ</label>', text)
text = re.sub(r'<span className=\"text-\[10px\] text-muted-foreground\">Màu .*?</span>', '<span className="text-[10px] text-muted-foreground">Màu đỏ</span>', text)
text = re.sub(r'\"Người mới\", role: \"H.*?c viên\", content: \"N.*?i dung cảm nhận\.\.\.\"', '"Người mới", role: "Học viên", content: "Nội dung cảm nhận..."', text)
text = re.sub(r'\"0.*?\"', '"0đ"', text)
text = re.sub(r'Revit .*? đặc biệt\.', 'Revit MEP Miễn phí và ưu đãi đặc biệt.', text)
text = re.sub(r'Nhận .*?u .*?i ngay', 'Nhận ưu đãi ngay', text)
text = re.sub(r'Link .*?u h.*?ng \(Anchor Link\)', 'Link điều hướng (Anchor Link)', text)
text = re.sub(r'Đánh dấu là gói Khuyến Nghị \(Nổi bật\)', 'Đánh dấu là gói Khuyến Nghị (Nổi bật)', text)

# Some fallback replacements for specific bad strings if regex misses
bad_to_good = [
    ('Tiộ u sÃ¡Â»Â­', 'Tiểu sử'),
    ('Link Ã¡ÂºÂ¢nh nÃ¡Â»Â n', 'Link Ảnh nền'),
    ('vÃ’Â¹ng', 'vùng'),
    ('Màu ï¿½ ï¿½ï¿½Ã¡Â»Â ', 'Màu đỏ'),
    ('ï¿½ Â ï¿½ ï¿½ ng xuất', 'Đăng xuất'),
    ('ï¿½ Â ang Ẩn', 'Đang Ẩn'),
    ('ï¿½ Â Ã’Â£', 'Đã')
]
for b, g in bad_to_good:
    text = text.replace(b, g)

with open('src/pages/admin/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
