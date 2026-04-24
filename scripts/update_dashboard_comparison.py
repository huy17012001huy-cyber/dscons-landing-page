import re

with open('src/pages/admin/Dashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Comparison section
if '{ id: "comparison", name: "Bảng So Sánh", icon: <List className="w-4 h-4" /> }' not in content:
    target = '{ id: "faq", name: "FAQ", icon: <List className="w-4 h-4" /> },'
    replacement = '{ id: "faq", name: "FAQ", icon: <List className="w-4 h-4" /> },\n    { id: "comparison", name: "Bảng So Sánh", icon: <List className="w-4 h-4" /> },'
    content = content.replace(target, replacement)

# Add comparison form state
if 'const [comparisonForm, setComparisonForm]' not in content:
    target = 'const [faqForm, setFaqForm] = useState({'
    replacement = '''const [comparisonForm, setComparisonForm] = useState({
    title: "Bạn đang phân vân với nơi khác?",
    description: "Nhập tên trung tâm bạn đang tìm hiểu. AI của chúng tôi sẽ phân tích khách quan giúp bạn.",
    criteria: [
      { name: "Thực hành trên Dự án thực tế", dscons: true },
      { name: "Chữa bài 1-1 qua Video Ultraview", dscons: true },
      { name: "Web Test Hỏi đáp AI 24/7", dscons: true },
      { name: "Bảo lưu & Học lại miễn phí", dscons: true }
    ]
  });

  const [faqForm, setFaqForm] = useState({'''
    content = content.replace(target, replacement)

if 'if (activeSection === "comparison" && data.draft_content)' not in content:
    target = 'if (activeSection === "faq" && data.draft_content) {'
    replacement = '''if (activeSection === "comparison" && data.draft_content) {
          setComparisonForm({ ...comparisonForm, ...data.draft_content });
        }
        if (activeSection === "faq" && data.draft_content) {'''
    content = content.replace(target, replacement)

if 'if (activeSection === "comparison") content = comparisonForm;' not in content:
    target = 'if (activeSection === "faq") content = faqForm;'
    replacement = '''if (activeSection === "comparison") content = comparisonForm;
      if (activeSection === "faq") content = faqForm;'''
    content = content.replace(target, replacement)   
    
    
with open('src/pages/admin/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Dashboard comparison state.")
