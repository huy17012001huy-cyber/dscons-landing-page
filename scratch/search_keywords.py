
import json
import re

file_path = r"e:\ANTIGRAVITY\DSCons_Landing Page_Zoom\src\pages\admin\Dashboard.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

gifts = re.findall(r'(.{0,100}quà tặng.{0,100})', content, re.IGNORECASE)
testimonials = re.findall(r'(.{0,100}đánh giá.{0,100})', content, re.IGNORECASE)

with open("scratch/search_results.json", "w", encoding="utf-8") as f:
    json.dump({"gifts": gifts, "testimonials": testimonials}, f, ensure_ascii=False, indent=2)
