import re

with open('src/pages/admin/Dashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add video field
video_field = """                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Link YouTube Video</label>
                    <input type="text" placeholder="https://www.youtube.com/watch?v=..." className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={(heroForm as any).videoUrl || ""} onChange={(e) => setHeroForm({...heroForm, videoUrl: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Link Ảnh nền / Image URL</label>
                    <input type="text" placeholder="https://..." className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={(heroForm as any).imageUrl || ""} onChange={(e) => setHeroForm({...heroForm, imageUrl: e.target.value})} />
                  </div>"""

if 'Link YouTube Video' not in content:
    content = content.replace(
        '                  <div className="grid grid-cols-2 gap-4">',
        video_field + '\n                  <div className="grid grid-cols-2 gap-4">'
    )
    with open('src/pages/admin/Dashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added video and image fields to Hero config!")
else:
    print("Already added.")
