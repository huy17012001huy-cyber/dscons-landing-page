import re

with open('src/pages/admin/Dashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Switch import
if 'import Switch from "@/components/ui/sky-toggle";' not in content:
    content = content.replace('import "react-quill/dist/quill.snow.css";', 'import "react-quill/dist/quill.snow.css";\nimport Switch from "@/components/ui/sky-toggle";')

# 2. Add isDark state
if 'const [isDark, setIsDark]' not in content:
    content = content.replace('const [isLoading, setIsLoading] = useState(false);', 'const [isLoading, setIsLoading] = useState(false);\n  const [isDark, setIsDark] = useState(true);')

# 3. Add useEffect for dark theme
if 'document.documentElement.classList.add("dark");' not in content:
    theme_effect = """
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const handleSaveDraft"""
    content = content.replace('  const handleSaveDraft', theme_effect)

# 4. Integrate Switch into Topbar
# Let's find: <header className="h-16 flex items-center justify-between px-8 border-b bg-background sticky top-0 z-10 shrink-0">
topbar_target = """<header className="h-16 flex items-center justify-between px-8 border-b bg-background sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">{sections.find(s => s.id === activeSection)?.name}</h2>
          </div>
          <div className="flex items-center gap-4">"""

topbar_replacement = """<header className="h-16 flex items-center justify-between px-8 border-b bg-background sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">{sections.find(s => s.id === activeSection)?.name}</h2>
          </div>
          <div className="flex items-center gap-4">
            <Switch checked={isDark} onChange={() => setIsDark(!isDark)} />"""
content = content.replace(topbar_target, topbar_replacement)

# 5. Fix Icon Inputs (Replace simple <input> with <IconSelector>) 
# We need to replace in Social Form (Items list), Curriculum (Lessons list), Benefits (Solution items if any)
# I will use a regex to find input fields that end with 'Icon' in placeholder or value but IconSelector is much better handled manually if it's complex. Let's do it using raw string replaces for Social items.

target_social_icon = """<label className="text-sm font-medium">Biểu tượng (Lucide Icon name)</label>
                          <input"""
replacement_social_icon = """<label className="text-sm font-medium">Biểu tượng (Lucide Icon name)</label>
                          <IconSelector value={item.icon} onChange={(val) => {
                             const newItems = [...socialForm.items];
                             newItems[idx].icon = val;
                             setSocialForm({ ...socialForm, items: newItems });
                          }} />
                          {/* <input"""
content = content.replace(target_social_icon, replacement_social_icon)

target_curriculum_icon = """<label className="text-sm font-medium">Icon (Lucide name)</label>
                                  <input"""
replacement_curriculum_icon = """<label className="text-sm font-medium">Icon (Lucide name)</label>
                                  <IconSelector value={l.icon} onChange={(val) => {
                                      const newModules = [...curriculumForm.modules];
                                      newModules[mIdx].lessons[lIdx].icon = val;
                                      setCurriculumForm({ ...curriculumForm, modules: newModules });
                                  }} />
                                  {/* <input"""
content = content.replace(target_curriculum_icon, replacement_curriculum_icon)


with open('src/pages/admin/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Dashboard theme toggle and icons.")
