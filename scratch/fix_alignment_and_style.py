
import os
import sys
import re

# Set encoding to utf-8 for stdout
if sys.stdout.encoding != 'utf-8':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

file_path = r"e:\ANTIGRAVITY\DSCons_Landing Page_Zoom\src\components\landing\CourseComparison.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Standardize student column padding and alignment
# Change p-4 to p-5 to match center column
content = content.replace('<div className="p-4 md:p-6 flex flex-col justify-center items-center gap-3">', 
                          '<div className="p-5 md:p-6 flex flex-col items-center gap-4">')

# 2. Fix static view icon size (was 16, should be 18)
content = content.replace('<Check size={16} strokeWidth={3} />', '<Check size={18} strokeWidth={3} />')
content = content.replace('<X size={16} strokeWidth={3} />', '<X size={18} strokeWidth={3} />')

# 3. Update student buttons to match DSCons badge exactly
# We'll use a more aggressive replacement for the buttons block
pattern = r'(\{\(\(item\.dscons \|\| ""\)\.toLowerCase\(\)\.includes\(\'có\'\) \|\| \(item\.dscons \|\| ""\)\.toLowerCase\(\)\.includes\(\'không\'\)\) && \(\s+<div className="flex justify-center gap-3">)(.*?)(\s+<\/div>\s+\)\}\s+<textarea)'

replacement = r'''{((item.dscons || "").toLowerCase().includes('có') || (item.dscons || "").toLowerCase().includes('không')) && (
                                <div className="flex justify-center gap-4">
                                  <button 
                                    type="button"
                                    title="Có"
                                    className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                                      (item.competitor || "").toLowerCase().includes('có') 
                                      ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-600 scale-110 shadow-sm" 
                                      : (item.competitor || "").toLowerCase().includes('không')
                                      ? "opacity-20 grayscale bg-muted/10 border-border text-muted-foreground"
                                      : "bg-emerald-500/5 border-emerald-500/20 text-emerald-600/50 hover:bg-emerald-500/10"
                                    }`}
                                    onClick={() => {
                                      const current = item.competitor || "";
                                      if (current.toLowerCase().includes('có')) {
                                        handleInputChange(catIdx, itemIdx, current.replace(/có/gi, "").trim());
                                      } else {
                                        handleInputChange(catIdx, itemIdx, "Có " + current.replace(/không/gi, "").trim());
                                      }
                                    }}
                                  >
                                    <Check size={18} strokeWidth={3} />
                                  </button>
                                  <button 
                                    type="button"
                                    title="Không"
                                    className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                                      (item.competitor || "").toLowerCase().includes('không') 
                                      ? "bg-rose-500/15 border-rose-500/50 text-rose-600 scale-110 shadow-sm" 
                                      : (item.competitor || "").toLowerCase().includes('có')
                                      ? "opacity-20 grayscale bg-muted/10 border-border text-muted-foreground"
                                      : "bg-rose-500/5 border-rose-500/20 text-rose-600/50 hover:bg-rose-500/10"
                                    }`}
                                    onClick={() => {
                                      const current = item.competitor || "";
                                      if (current.toLowerCase().includes('không')) {
                                        handleInputChange(catIdx, itemIdx, current.replace(/không/gi, "").trim());
                                      } else {
                                        handleInputChange(catIdx, itemIdx, "Không " + current.replace(/có/gi, "").trim());
                                      }
                                    }}
                                  >
                                    <X size={18} strokeWidth={3} />
                                  </button>
                                </div>
                              )}
                              <textarea'''

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated CourseComparison.tsx with perfect alignment and identical styles")
