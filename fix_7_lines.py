with open('src/pages/admin/Dashboard.tsx', 'r', encoding='utf-8') as f:
    lines = f.read().split('\n')

# Line numbers (0-indexed, so -1 from the grep output)
lines[339] = '            <LogOut className="h-4 w-4 mr-2" /> Đăng xuất'
lines[356] = '              <EyeOff className="w-4 h-4" /> {sectionData?.is_visible === false ? "Đang Ẩn" : "Ẩn Section này"}'
lines[627] = '                      <label className="text-sm font-medium">Tiêu đề phụ</label>'
lines[1028] = '                    <label className="text-sm font-medium">Tiêu đề</label>'
lines[1470] = '                            Đánh dấu là gói Khuyến Nghị (Nổi bật)'
lines[1670] = '                  <p className="text-muted-foreground">Khu vực kéo thả và chỉnh sửa linh kiện cho <span className="font-bold text-foreground">{activeSection === "settings" ? "Cài đặt giao diện" : sections.find((s: any) => s.id === activeSection)?.name}</span> đang được xây dựng.</p>'
lines[1734] = '                            {settingsForm.exit_popup.buttonText || "Nhận ưu đãi ngay"}'

with open('src/pages/admin/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print('Done 7 lines fix')
