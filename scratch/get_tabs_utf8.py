
import re

file_path = r"e:\ANTIGRAVITY\DSCons_Landing Page_Zoom\src\pages\admin\Dashboard.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

output = []
for i, line in enumerate(lines):
    if "<TabsTrigger" in line:
        output.append(f"Line {i+1}: {line.strip()}")

with open("scratch/tabs_utf8.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(output))
