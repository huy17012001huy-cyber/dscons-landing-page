import sys

with open('src/pages/admin/Dashboard.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# The array `lines` contains all lines.
# Line 1271 is lines[1270] -> `                            </div>`
# Line 1272 is lines[1271] -> `                            <div className="grid gap-2">`
# Line 1273 is lines[1272] -> `                              <label className="text-xs font-medium opacity-70 uppercase">Mô tả ngắn gọn</label>`
# Line 1274 is lines[1273] -> `                                className="flex min-h-[60px] w-full rounded-md border px-3 py-2 bg-background text-sm" `

lines.insert(1273, '                              <textarea \n')

with open('src/pages/admin/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)
