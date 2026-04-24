import re

with open('src/pages/admin/Dashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add getCompetitorQueries import
if 'getCompetitorQueries' not in content:
    content = content.replace('saveDraft, publishSection', 'saveDraft, publishSection, getCompetitorQueries')

# 2. Add queries state
if 'const [competitorQueries, setCompetitorQueries]' not in content:
    content = content.replace('const [isLoading, setIsLoading] = useState(false);', 'const [isLoading, setIsLoading] = useState(false);\n  const [competitorQueries, setCompetitorQueries] = useState<any[]>([]);')

# 3. Fetch queries when entering comparison section
if 'setCompetitorQueries' in content and 'getCompetitorQueries()' not in content:
    target = 'if (activeSection === "comparison" && data.draft_content) {'
    replacement = '''if (activeSection === "comparison") {
          const queries = await getCompetitorQueries();
          setCompetitorQueries(queries);
          if (data.draft_content) {
            setComparisonForm({ ...comparisonForm, ...data.draft_content });
          }
        } else if (activeSection === "faq" && data.draft_content) {'''
    content = content.replace('if (activeSection === "comparison" && data.draft_content) {', replacement)
    
    # 4. Render History inside activeSection === "comparison"
    # Find activeSection === "comparison" ? ( block and add history table before closing
    # We will just append it below the criteria list div
    target_ui = '</Button>\n                          </div>\n                        ))}\n                      </div>\n                    </div>\n                  </div>\n                </div>'
    replacement_ui = '''</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-card p-6 rounded-xl border shadow-sm mt-6">
                    <h3 className="font-bold text-lg border-b pb-2 mb-4">Lịch sử Học viên Tra cứu</h3>
                    {competitorQueries.length === 0 ? (
                      <p className="text-muted-foreground text-sm">Chưa có lượt tra cứu nào.</p>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                        {competitorQueries.map((q, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-muted/50 p-2 rounded-md">
                            <span className="font-medium text-sm">{q.query}</span>
                            <span className="text-xs text-muted-foreground">{new Date(q.created_at).toLocaleString('vi-VN')}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>'''
    content = content.replace(target_ui, replacement_ui)


with open('src/pages/admin/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Comparison History UI.")
