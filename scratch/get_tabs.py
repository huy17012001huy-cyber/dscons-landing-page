
import re

file_path = r"e:\ANTIGRAVITY\DSCons_Landing Page_Zoom\src\pages\admin\Dashboard.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "<TabsTrigger" in line:
        print(f"Line {i+1}: {line.strip()}")
