import re

with open('src/pages/admin/Dashboard.tsx', 'r', encoding='utf-8') as f:
    dashboard_content = f.read()

# 1. Add import landingData
if 'import { landingData }' not in dashboard_content:
    dashboard_content = dashboard_content.replace(
        'import { getSectionData, saveDraft, publishSection, toggleVisibility, SectionData } from "@/lib/api";',
        'import { getSectionData, saveDraft, publishSection, toggleVisibility, SectionData } from "@/lib/api";\nimport { landingData } from "@/data/landingContent";\nimport { IconSelector } from "@/components/admin/IconSelector";'
    )

# 2. Add form states
states_to_add = """
  // Header form state
  const [headerForm, setHeaderForm] = useState(landingData.header);
  // PainPoints form state
  const [painPointsForm, setPainPointsForm] = useState(landingData.painPoints);
  // Bonus form state
  const [bonusForm, setBonusForm] = useState({ title: "Bonus", items: [] });
  // Instructor form state
  const [instructorForm, setInstructorForm] = useState(landingData.instructor);
  // Pricing form state
  const [pricingForm, setPricingForm] = useState(landingData.pricing);
"""
if 'const [painPointsForm, setPainPointsForm]' not in dashboard_content:
    dashboard_content = dashboard_content.replace(
        '  // Hero form state',
        states_to_add + '\n  // Hero form state'
    )

# 3. Add to useEffect fetch
fetch_to_add = """
        if (activeSection === "header" && data.draft_content) setHeaderForm({ ...headerForm, ...data.draft_content });
        if (activeSection === "pain-points" && data.draft_content) setPainPointsForm({ ...painPointsForm, ...data.draft_content });
        if (activeSection === "bonus" && data.draft_content) setBonusForm({ ...bonusForm, ...data.draft_content });
        if (activeSection === "instructor" && data.draft_content) setInstructorForm({ ...instructorForm, ...data.draft_content });
        if (activeSection === "pricing" && data.draft_content) setPricingForm({ ...pricingForm, ...data.draft_content });
"""
if 'setPainPointsForm' not in dashboard_content.split('fetchSection = async')[1]:
    dashboard_content = dashboard_content.replace(
        '        if (activeSection === "hero" && data.draft_content) {',
        fetch_to_add + '\n        if (activeSection === "hero" && data.draft_content) {'
    )

# 4. Add to handleSaveDraft
save_to_add = """
      if (activeSection === "header") content = headerForm;
      if (activeSection === "pain-points") content = painPointsForm;
      if (activeSection === "bonus") content = bonusForm;
      if (activeSection === "instructor") content = instructorForm;
      if (activeSection === "pricing") content = pricingForm;
"""
if 'content = headerForm;' not in dashboard_content.split('handleSaveDraft')[1]:
    dashboard_content = dashboard_content.replace(
        '      if (activeSection === "hero") content = heroForm;',
        save_to_add + '\n      if (activeSection === "hero") content = heroForm;'
    )

# 5. Add to handlePublish
publish_to_add = save_to_add
if 'content = headerForm;' not in dashboard_content.split('handlePublish')[1]:
    dashboard_content = dashboard_content.replace(
        '      if (activeSection === "hero") content = heroForm;',
        publish_to_add + '\n      if (activeSection === "hero") content = heroForm;'
    )

with open('src/pages/admin/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(dashboard_content)

print("Updated state, fetch, save/publish logic in Dashboard.tsx")
