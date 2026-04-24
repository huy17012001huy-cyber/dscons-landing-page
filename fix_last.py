with open('src/pages/admin/Dashboard.tsx', 'r', encoding='utf-8') as f:
    lines = f.read().split('\n')

lines[1270] = '                                  <label className="text-xs font-medium opacity-70 uppercase">Mô tả ngắn gọn</label>'

with open('src/pages/admin/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))
