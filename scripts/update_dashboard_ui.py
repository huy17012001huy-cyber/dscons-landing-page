import re

with open('src/pages/admin/Dashboard.tsx', 'r', encoding='utf-8') as f:
    dashboard_content = f.read()

# Generate new form sections
new_forms = """
              ) : activeSection === "header" ? (
                <div className="space-y-6">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Text Nút bấm CTA</label>
                    <input 
                      type="text" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                      value={headerForm.cta || "Đăng ký ngay"}
                      onChange={(e) => setHeaderForm({...headerForm, cta: e.target.value})} 
                    />
                  </div>
                </div>
              ) : activeSection === "pain-points" ? (
                <div className="space-y-6">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Tiêu đề (Headline)</label>
                    <input 
                      type="text" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                      value={painPointsForm.title}
                      onChange={(e) => setPainPointsForm({...painPointsForm, title: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Các vấn đề gặp phải</label>
                      <Button variant="outline" size="sm" onClick={() => setPainPointsForm({...painPointsForm, items: [...(painPointsForm.items || []), {title: "Vấn đề mới", description: ""}]})}>
                        + Thêm vấn đề
                      </Button>
                    </div>
                    {(painPointsForm.items || []).map((item: any, index: number) => (
                      <div key={index} className="p-4 border rounded-md relative bg-muted/20">
                        <Button 
                          variant="ghost" size="sm" 
                          className="absolute right-2 top-2 text-destructive h-8 px-2"
                          onClick={() => {
                            const newItems = [...painPointsForm.items];
                            newItems.splice(index, 1);
                            setPainPointsForm({...painPointsForm, items: newItems});
                          }}
                        >Xóa</Button>
                        <div className="space-y-3 pt-2 pr-12">
                          <input 
                            type="text" 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-bold" 
                            value={item.title}
                            onChange={(e) => {
                              const newItems = [...painPointsForm.items];
                              newItems[index].title = e.target.value;
                              setPainPointsForm({...painPointsForm, items: newItems});
                            }} 
                          />
                          <ReactQuill theme="snow" value={item.description} onChange={(val) => {
                            const newItems = [...painPointsForm.items];
                            newItems[index].description = val;
                            setPainPointsForm({...painPointsForm, items: newItems});
                          }} className="bg-background min-h-[80px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : activeSection === "pricing" ? (
                <div className="space-y-6">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Tiêu đề (Headline)</label>
                    <input 
                      type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                      value={pricingForm.title} onChange={(e) => setPricingForm({...pricingForm, title: e.target.value})} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Giá khóa học</label>
                    <input 
                      type="text" className="flex h-10 w-full rounded-md border text-primary font-bold border-input bg-background px-3 py-2 text-sm" 
                      value={pricingForm.price} onChange={(e) => setPricingForm({...pricingForm, price: e.target.value})} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Mô tả độ dài / lưu ý (*)</label>
                    <input 
                      type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                      value={pricingForm.originalPrice} onChange={(e) => setPricingForm({...pricingForm, originalPrice: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Danh sách quyền lợi</label>
                      <Button variant="outline" size="sm" onClick={() => setPricingForm({...pricingForm, steps: [...(pricingForm.steps || []), "Quyền lợi mới"]})}>
                        + Thêm quyền lợi
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {(pricingForm.steps || []).map((step: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <input type="text" className="flex-1 h-10 rounded-md border bg-background px-3 text-sm" value={step} onChange={(e) => {
                            const newSteps = [...pricingForm.steps];
                            newSteps[index] = e.target.value;
                            setPricingForm({...pricingForm, steps: newSteps});
                          }} />
                          <Button variant="ghost" size="sm" className="text-destructive h-10 px-3" onClick={() => {
                            const newSteps = [...pricingForm.steps];
                            newSteps.splice(index, 1);
                            setPricingForm({...pricingForm, steps: newSteps});
                          }}>Xóa</Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : activeSection === "instructor" ? (
                <div className="space-y-6">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Huy hiệu (Nhãn)</label>
                    <input type="text" className="flex h-10 w-full border rounded-md px-3 bg-background text-sm" value={instructorForm.badge} onChange={(e) => setInstructorForm({...instructorForm, badge: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Tiêu đề chính</label>
                    <input type="text" className="flex h-10 w-full border rounded-md px-3 bg-background text-sm" value={instructorForm.title} onChange={(e) => setInstructorForm({...instructorForm, title: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Mô tả (Subtitle)</label>
                    <textarea className="flex min-h-[60px] w-full border rounded-md px-3 py-2 bg-background text-sm" value={instructorForm.subtitle} onChange={(e) => setInstructorForm({...instructorForm, subtitle: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Tên giảng viên</label>
                      <input type="text" className="flex h-10 w-full border rounded-md px-3 bg-background text-sm font-bold" value={instructorForm.name} onChange={(e) => setInstructorForm({...instructorForm, name: e.target.value})} />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Chức danh</label>
                      <input type="text" className="flex h-10 w-full border rounded-md px-3 bg-background text-sm" value={instructorForm.role} onChange={(e) => setInstructorForm({...instructorForm, role: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Tiểu sử (Bio)</label>
                    <ReactQuill theme="snow" value={instructorForm.bio} onChange={(val) => setInstructorForm({...instructorForm, bio: val})} className="bg-background min-h-[100px]" />
                  </div>
                </div>
              ) : activeSection === "bonus" ? (
                <div className="space-y-6">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Tiêu đề quà tặng</label>
                    <input type="text" className="flex h-10 w-full rounded-md border px-3 bg-background text-sm" value={bonusForm.title || ""} onChange={(e) => setBonusForm({...bonusForm, title: e.target.value})} />
                  </div>
                </div>
"""

fallback_ui = """
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Khu vực kéo thả và chỉnh sửa linh kiện cho <span className="font-bold text-foreground">{sections.find((s: any) => s.id === activeSection)?.name}</span> đang được xây dựng.</p>
                  <img src="https://illustrations.popsy.co/amber/keynote-presentation.svg" alt="construction" className="w-64 mx-auto mt-8 opacity-50" />
                </div>
              )}
"""

if 'activeSection === "pain-points" ? (' not in dashboard_content:
    parts = dashboard_content.split('              ) : (\n                <div className="text-center py-12">')
    if len(parts) > 1:
        new_content = parts[0] + new_forms + fallback_ui + parts[1].split('              )}\n', 1)[1] if '              )}\n' in parts[1] else parts[0] + new_forms + fallback_ui + parts[1].split('              )}\r\n', 1)[1] if '              )}\r\n' in parts[1] else parts[0] + new_forms + fallback_ui + parts[1].split('              )}')[1]
        
        with open('src/pages/admin/Dashboard.tsx', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Updated Dashboard UI successfully")
    else:
        print("Could not find the fallback UI block to replace!")
else:
    print("UI forms already added!")
