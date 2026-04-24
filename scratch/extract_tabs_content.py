
import re

file_path = r"e:\ANTIGRAVITY\DSCons_Landing Page_Zoom\src\pages\admin\Dashboard.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

with open("scratch/bonus_chunk.tsx", "w", encoding="utf-8") as f:
    m = re.search(r'(<TabsContent value="bonus".*?</TabsContent>)', content, re.DOTALL)
    if m:
        f.write(m.group(1))

with open("scratch/testimonials_chunk.tsx", "w", encoding="utf-8") as f:
    m = re.search(r'(<TabsContent value="testimonials".*?</TabsContent>)', content, re.DOTALL)
    if m:
        f.write(m.group(1))
