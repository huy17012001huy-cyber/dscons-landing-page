import re

file_path = 'src/components/landing/ComparisonTable.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace mojibake with correct text
text = re.sub(r'title: ".*B.*NG SO S.*NH.*"', 'title: "BẢNG SO SÁNH CHẤT LƯỢNG KHÓA HỌC"', text)
text = re.sub(r'\{config\.title \|\| ".*B.*NG SO S.*NH.*"\}', '{config.title || "BẢNG SO SÁNH CHẤT LƯỢNG KHÓA HỌC"}', text)

text = re.sub(r'"Trung t.*m kh.*c"', '"Trung tâm khác"', text)

text = re.sub(r'>.*TI.*U CH.* SO S.*NH<', '>📌 TIÊU CHÍ SO SÁNH<', text)
text = re.sub(r'>TRUNG T.*M KH.*C<', '>TRUNG TÂM KHÁC<', text)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print('Done')
