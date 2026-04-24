import re

with open('src/pages/admin/Dashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = '              ) : activeSection === "testimonials" ? ('
replacement = '''              ) : activeSection === "comparison" ? (
                <div className="space-y-6">
                  <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2">Bảng so sánh AI</h3>
                    <div>
                      <label className="text-sm font-medium">Tiêu đề phụ</label>
                      <input 
                        type="text"
                        value={comparisonForm.title}
                        onChange={(e) => setComparisonForm({...comparisonForm, title: e.target.value})}
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Đoạn mô tả ngắn</label>
                      <textarea
                        value={comparisonForm.description}
                        onChange={(e) => setComparisonForm({...comparisonForm, description: e.target.value})}
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium">Các Tiêu Chí So Sánh Của DSCons</label>
                        <Button 
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setComparisonForm({
                            ...comparisonForm, 
                            criteria: [...comparisonForm.criteria, { name: "Tiêu chí mới", dscons: true }]
                          })}
                        >
                          + Thêm tiêu chí
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        {comparisonForm.criteria.map((c, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input 
                              type="text"
                              value={c.name}
                              onChange={(e) => {
                                const newC = [...comparisonForm.criteria];
                                newC[idx].name = e.target.value;
                                setComparisonForm({...comparisonForm, criteria: newC});
                              }}
                              className="flex-1 px-3 py-2 border rounded-md text-sm"
                            />
                            <div className="flex items-center gap-1">
                              <span className="text-xs">Có tại DSCons?</span>
                              <input 
                                type="checkbox"
                                checked={c.dscons}
                                onChange={(e) => {
                                  const newC = [...comparisonForm.criteria];
                                  newC[idx].dscons = e.target.checked;
                                  setComparisonForm({...comparisonForm, criteria: newC});
                                }}
                                className="w-4 h-4 cursor-pointer"
                              />
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                const newC = comparisonForm.criteria.filter((_, i) => i !== idx);
                                setComparisonForm({...comparisonForm, criteria: newC});
                              }}
                            >
                              Xóa
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeSection === "testimonials" ? ('''

if 'activeSection === "comparison" ?' not in content:
    content = content.replace(target, replacement)

with open('src/pages/admin/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Comparison UI.")
