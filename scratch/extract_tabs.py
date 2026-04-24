
import re

file_path = r"e:\ANTIGRAVITY\DSCons_Landing Page_Zoom\src\pages\admin\Dashboard.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# find the bonus tab content
bonus_match = re.search(r'value="bonus".*?</TabsContent>', content, re.DOTALL)
if bonus_match:
    with open("scratch/bonus_tab.tsx", "w", encoding="utf-8") as f:
        f.write(bonus_match.group(0))

testimonials_match = re.search(r'value="testimonials".*?</TabsContent>', content, re.DOTALL)
if testimonials_match:
    with open("scratch/testimonials_tab.tsx", "w", encoding="utf-8") as f:
        f.write(testimonials_match.group(0))
