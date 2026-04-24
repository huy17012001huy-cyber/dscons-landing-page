
import re

file_path = r"e:\ANTIGRAVITY\DSCons_Landing Page_Zoom\src\pages\admin\Dashboard.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

tabs = re.findall(r'<TabsContent.*?value="(.*?)".*?>', content)
with open("scratch/tabs_values.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(tabs))
