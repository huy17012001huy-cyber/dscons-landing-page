with open('src/pages/admin/Dashboard.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

replacements = [
    ("toast.success(`ï¿½ Â Ã’Â£ ${newViz ? 'hiộ n thÃ¡Â»â¬¹' : 'ẩn'} bộ ï¿½ phÃ¡ÂºÂ­n này!`);", "toast.success(`Đã ${newViz ? 'hiển thị' : 'ẩn'} bộ phận này!`);"),
    ("Nội dung khối bên trái (Sidebar)", "Nội dung khối bên trái (Sidebar)"),
    ("value={headerForm.cta || \"ï¿½ Â ï¿½ ï¿½ ng ký ngay\"}", "value={headerForm.cta || \"Đăng ký ngay\"}"),
    ("Tiêu ï¿½ ï¿½ï¿½Ã¡Â»Â ", "Tiêu đề"),
    ("Màu ï¿½ ï¿½ï¿½Ã¡Â»Â ", "Màu đỏ"),
    ("ï¿½ Â ï¿½ ï¿½ ng xuất", "Đăng xuất"),
    ("0ï¿½ ï¿½ï¿½", "0đ"),
    ("Revit Màu đỏ đặc biệt", "Revit MEP Miễn phí và ưu đãi đặc biệt"),
    ("toast.success(\"ï¿½ Â Ã’Â£ lưu nháp bộ ï¿½ phÃ¡ÂºÂ­n: \" + activeSection);", "toast.success(\"Đã lưu nháp bộ phận: \" + activeSection);"),
    ("Chưa ï¿½ ï¿½ï¿½ï¿½ ï¿½ ng nhÃ¡ÂºÂ­p", "Chưa đăng nhập"),
    ("HÃ¡Â»Â c viên", "Học viên"),
    ("Nộ ï¿½i dung cảm nhận...", "Nội dung cảm nhận..."),
    ("ï¿½ Â oÃ¡ÂºÂ¡n mÃ’Â´ tả ngắn", "Đoạn mô tả ngắn"),
    ("Tiộ u sÃ¡Â»Â­ (Bio)", "Tiểu sử (Bio)"),
    ("Mô tả ngắn gÃ¡Â»Â n", "Mô tả ngắn gọn"),
    ("ï¿½ Â ang Ẩn", "Đang Ẩn"),
    ("Nháº­n Æ°u ï¿½ Ã£i ngay", "Nhận ưu đãi ngay"),
    ("Link  iï¿½u hï¿½ï¿½ng (Anchor Link)", "Link điều hướng (Anchor Link)"),
    ("Khu vÃ¡Â»Â±c kéo thả và chỉnh sửa linh kiện cho <span className=\"font-bold text-foreground\">{activeSection === \"settings\" ? \"Cài đặt giao diện\" : sections.find((s: any) => s.id === activeSection)?.name}</span> ï¿½ ï¿½ï¿½ang ï¿½ ï¿½ï¿½Đ°ợc xÃ’Â¢y dÃ¡Â»Â±ng.", "Khu vực kéo thả và chỉnh sửa linh kiện cho <span className=\"font-bold text-foreground\">{activeSection === \"settings\" ? \"Cài đặt giao diện\" : sections.find((s: any) => s.id === activeSection)?.name}</span> đang được xây dựng."),
    ("ï¿½ Â Ã’Â¡nh dấu là gói Khuyến Nghị (Nổi bật)", "Đánh dấu là gói Khuyến Nghị (Nổi bật)")
]

for pat, repl in replacements:
    text = text.replace(pat, repl)

with open('src/pages/admin/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
