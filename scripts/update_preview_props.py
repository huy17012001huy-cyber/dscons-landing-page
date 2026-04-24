import os
import re

components_dir = "src/components/sections"

# List of components to update
components = [
    "HeroSection.tsx",
    "PainPoints.tsx",
    "Solution.tsx",
    "Curriculum.tsx",
    "Bonus.tsx",
    "Instructor.tsx",
    "Pricing.tsx",
    "FAQ.tsx",
]

for comp in components:
    filepath = os.path.join(components_dir, comp)
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Replace export default function X() with export default function X({ data: previewData }: { data?: any })
    match = re.search(r'export default function (\w+)\(\)\s*\{', content)
    if match:
        func_name = match.group(1)
        content = content.replace(f'export default function {func_name}() {{', f'export default function {func_name}({{ data: previewData }}: {{ data?: any }}) {{')
    
    # 2. Find the state setter. Usually const [state, setState] = useState(landingData.x)
    # We will look for useEffect(() => {
    
    # Let's see the common pattern in useEffect
    effect_match = re.search(r'useEffect\(\(\) => \{([\s\S]*?)\}, \[\]\);', content)
    
    if effect_match:
        original_effect_body = effect_match.group(1)
        
        # What is the state variable?
        # e.g. const [hero, setHero] = useState
        setter_match = re.search(r'const \[[a-zA-Z]+, (set[a-zA-Z]+)\] = useState', content)
        if setter_match:
            setter_name = setter_match.group(1)
            
            new_effect = f"""useEffect(() => {{
    if (previewData) {{
      {setter_name}({{ ...landingData.{comp.split('.')[0].lower()}, ...previewData }});
      return;
    }}
{original_effect_body}}}, [previewData]);"""
            
            content = content.replace(effect_match.group(0), new_effect)
            
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Updated {comp}")
        else:
            print(f"Setter not found in {comp}")
    else:
        print(f"useEffect not found in {comp}")

# For ComparisonTable.tsx (it's in src/components/landing)
filepath = "src/components/landing/ComparisonTable.tsx"
if os.path.exists(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    if 'export default function ComparisonTable() {' in content:
        content = content.replace('export default function ComparisonTable() {', 'export default function ComparisonTable({ data: previewData }: { data?: any }) {')
        
    effect_match = re.search(r'useEffect\(\(\) => \{([\s\S]*?)\}, \[\]\);', content)
    if effect_match:
        original_effect_body = effect_match.group(1)
        new_effect = f"""useEffect(() => {{
    if (previewData) {{
      setConfig(previewData);
      return;
    }}
{original_effect_body}}}, [previewData]);"""
        content = content.replace(effect_match.group(0), new_effect)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated ComparisonTable.tsx")

