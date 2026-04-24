
import json

file_path = r"e:\ANTIGRAVITY\DSCons_Landing Page_Zoom\src\pages\admin\Dashboard.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "bonus" in line.lower() or "quà tặng" in line.lower():
        print(f"Bonus line {i+1}: {line.strip()[:100]}")
    if "testimonials" in line.lower() or "đánh giá" in line.lower():
        print(f"Testimonial line {i+1}: {line.strip()[:100]}")
