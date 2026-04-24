import re
with open('src/pages/admin/Dashboard.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix Instructor labels specifically
text = re.sub(r'<label className="text-sm font-medium">Ti.*?<\/label>', '<label className="text-sm font-medium">Tiểu sử (Bio)</label>', text)
text = re.sub(r'<label className="text-sm font-medium">Link .*?<\/label>', '<label className="text-sm font-medium">Link Ảnh nền / Image URL</label>', text)

with open('src/pages/admin/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Done fix labels')
