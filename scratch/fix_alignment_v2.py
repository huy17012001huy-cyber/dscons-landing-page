
import os
import sys

# Set encoding to utf-8 for stdout
if sys.stdout.encoding != 'utf-8':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

file_path = r"e:\ANTIGRAVITY\DSCons_Landing Page_Zoom\src\components\landing\CourseComparison.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# DSCons column - Change items-center to items-start to allow top-alignment
content = content.replace('<div className="p-5 md:p-6 flex items-center justify-center text-center bg-primary/5 border-x border-border">',
                          '<div className="p-5 md:p-6 flex items-start justify-center text-center bg-primary/5 border-x border-border">')

# Competitor column - already items-center, but make sure it starts from top
content = content.replace('<div className="p-5 md:p-6 flex flex-col items-center gap-4">',
                          '<div className="p-5 md:p-6 flex flex-col items-center justify-start gap-4">')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated alignment to start-aligned for perfect horizontal matching")
