const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'admin', 'Dashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix handleSaveDraft
content = content.replace(
    /if \(activeSection === "header"\) \{[\s\S]*?saveDraft\("hero", heroForm\);[\s\S]*?\}/,
    `if (activeSection === "header") {
        await Promise.all([
          saveDraft("header", headerForm, activePageId),
          saveDraft("hero", heroForm, activePageId)
        ]);
        toast.success("Thao tác thành công!");
        return;
      }`
);

content = content.replace(
    /if \(activeSection === "settings" \|\| activeSection === "system-settings", activePageId\) \{[\s\S]*?saveDraft\("settings", settingsForm\);/,
    `if (activeSection === "settings" || activeSection === "system-settings") {
        await saveDraft("settings", settingsForm, activePageId);`
);

content = content.replace(
    /if \(activeSection === "social", activePageId\) content = socialForm;[\s\S]*?await saveDraft\(activeSection, content\);/,
    `if (activeSection === "social") content = socialForm;
      
      await saveDraft(activeSection, content, activePageId);`
);

// 2. Fix handlePublish
content = content.replace(
    /if \(activeSection === "header", activePageId\) \{[\s\S]*?publishSection\("hero", heroForm, true\);[\s\S]*?\}/,
    `if (activeSection === "header") {
        await Promise.all([
          publishSection("header", headerForm, true, activePageId),
          publishSection("hero", heroForm, true, activePageId)
        ]);
        toast.success("Thao tác thành công!");
        return;
      }`
);

content = content.replace(
    /if \(activeSection === "settings" \|\| activeSection === "system-settings", activePageId\) \{[\s\S]*?publishSection\("settings", settingsForm, true\);/,
    `if (activeSection === "settings" || activeSection === "system-settings") {
        await publishSection("settings", settingsForm, true, activePageId);`
);

content = content.replace(
    /if \(!content\) \{[\s\S]*?toast\.error\("Đã xảy ra lỗi!", activePageId\);[\s\S]*?return;[\s\S]*?\}[\s\S]*?await publishSection\(activeSection, content, sectionData\?\.is_visible \?\? true\);/,
    `if (!content) {
        toast.error("Đã xảy ra lỗi!");
        return;
      }

      await publishSection(activeSection, content, sectionData?.is_visible ?? true, activePageId);`
);

// 3. Fix handleToggleVisibility
content = content.replace(
    /const handleToggleVisibility = async \(\) => \{[\s\S]*?if \(!sectionData, activePageId\) return;[\s\S]*?await toggleVisibility\(activeSection, newViz\);/,
    `const handleToggleVisibility = async () => {
    if (!sectionData) return;
    try {
      const newViz = !sectionData.is_visible;
      await toggleVisibility(activeSection, newViz, activePageId);`
);

fs.writeFileSync(filePath, content);
console.log('Successfully fixed function syntax and API calls in Dashboard.tsx.');
