import sys

with open('src/pages/admin/Dashboard.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Let's fix lines 1270 to 1273
# 1270 is currently `                            </div>\n`
# 1271 is currently `                                  <label className="text-xs font-medium opacity-70 uppercase">Mô tả ngắn gọn</label>\n`
# 1272 is currently `                              <label className="text-xs font-medium opacity-70 uppercase">Mô tả ngắn gÃ¡Â»Â n</label>\n`
# 1273 is `                              <textarea \n`

lines[1270] = '                            </div>\n'
lines[1271] = '                            <div className="grid gap-2">\n'
lines[1272] = '                              <label className="text-xs font-medium opacity-70 uppercase">Mô tả ngắn gọn</label>\n'

with open('src/pages/admin/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)
