const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'admin', 'Dashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Find the start of the logic mess (handleSaveDraft)
const saveDraftIndex = content.indexOf('const handleSaveDraft = async () => {');
// 2. Find the start of the UI part (return ()
const returnIndex = content.indexOf('return (');

if (saveDraftIndex !== -1 && returnIndex !== -1) {
    const header = content.substring(0, saveDraftIndex);
    const footer = content.substring(returnIndex);
    
    const fixedLogic = `  const handleSaveDraft = async () => {
    try {
      if (activeSection === "header") {
        await Promise.all([
          saveDraft("header", headerForm, activePageId),
          saveDraft("hero", heroForm, activePageId)
        ]);
        toast.success("Thao tác thành công!");
        return;
      }

      if (activeSection === "settings" || activeSection === "system-settings") {
        await saveDraft("settings", settingsForm, activePageId);
        toast.success("Thao tác thành công!");
        return;
      }

      let content = sectionData?.draft_content || {};
      if (activeSection === "pain-points") content = painPointsForm;
      if (activeSection === "bonus") content = bonusForm;
      if (activeSection === "instructor") content = instructorForm;
      if (activeSection === "pricing") content = pricingForm;
      if (activeSection === "cta") content = ctaForm;
      if (activeSection === "comparison") content = comparisonForm;
      if (activeSection === "faq") content = faqForm;
      if (activeSection === "testimonials") content = testimonialsForm;
      if (activeSection === "benefits") content = benefitsForm;
      if (activeSection === "curriculum") content = curriculumForm;
      if (activeSection === "social") content = socialForm;
      
      await saveDraft(activeSection, content, activePageId);
      toast.success("Đã lưu nháp bộ phận: " + activeSection);
    } catch(e) {
      console.error("Save draft error:", e);
      toast.error("Đã xảy ra lỗi!");
    }
  };

  const handlePublish = async () => {
    try {
      if (activeSection === "header") {
        await Promise.all([
          publishSection("header", headerForm, true, activePageId),
          publishSection("hero", heroForm, true, activePageId)
        ]);
        toast.success("Thao tác thành công!");
        return;
      }

      if (activeSection === "settings" || activeSection === "system-settings") {
        await publishSection("settings", settingsForm, true, activePageId);
        toast.success("Thao tác thành công!");
        return;
      }

      let content = sectionData?.draft_content || {};
      if (activeSection === "pain-points") content = painPointsForm;
      if (activeSection === "bonus") content = bonusForm;
      if (activeSection === "instructor") content = instructorForm;
      if (activeSection === "pricing") content = pricingForm;
      if (activeSection === "cta") content = ctaForm;
      if (activeSection === "comparison") content = comparisonForm;
      if (activeSection === "faq") content = faqForm;
      if (activeSection === "testimonials") content = testimonialsForm;
      if (activeSection === "benefits") content = benefitsForm;
      if (activeSection === "curriculum") content = curriculumForm;
      if (activeSection === "social") content = socialForm;

      if (!content) {
        toast.error("Đã xảy ra lỗi!");
        return;
      }

      await publishSection(activeSection, content, sectionData?.is_visible ?? true, activePageId);
      toast.success("Thao tác thành công!");
    } catch(e) {
      console.error("Publish error:", e);
      toast.error("Đã xảy ra lỗi!");
    }
  };

  const handleToggleVisibility = async () => {
    if (!sectionData) return;
    try {
      const newViz = !sectionData.is_visible;
      await toggleVisibility(activeSection, newViz, activePageId);
      setSectionData({...sectionData, is_visible: newViz});
      toast.success(\`Đã \${newViz ? 'hiển thị' : 'ẩn'} bộ phận này!\`);
    } catch(e) {
      console.error("Visibility toggle error:", e);
      toast.error("Đã xảy ra lỗi!");
    }
  };

  `;
    
    fs.writeFileSync(filePath, header + fixedLogic + footer);
    console.log('Successfully reconstructed Dashboard.tsx and fixed corruption.');
} else {
    console.log('Error: Could not find indices for reconstruction.');
}
