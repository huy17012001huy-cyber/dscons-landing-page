const fs = require('fs');
const path = require('path');

const dashboardPath = path.join(__dirname, 'src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

let changed = false;

// 1. Add LandingPageManager import
if (!content.includes('LandingPageManager')) {
  content = content.replace(
    /import { IconSelector } from "@\/components\/admin\/IconSelector";/,
    `import { IconSelector } from "@/components/admin/IconSelector";\nimport { LandingPageManager } from "@/components/admin/LandingPageManager";`
  );
  changed = true;
}

// 2. Add activePageId state
if (!content.includes('const [activePageId, setActivePageId]')) {
  content = content.replace(
    /const \[activeSection, setActiveSection\] = useState\("header"\);/,
    `const [activeSection, setActiveSection] = useState("header");\n  const [activePageId, setActivePageId] = useState("11111111-1111-1111-1111-111111111111");`
  );
  changed = true;
}

// 3. Add activePageId to dependency array of fetchSection useEffect
if (!content.includes('[activeSection, activePageId]')) {
  content = content.replace(
    /}, \[activeSection\]\);/g,
    `}, [activeSection, activePageId]);`
  );
  changed = true;
}

// 4. Add activePageId to getSectionData
if (content.includes('getSectionData(')) {
  content = content.replace(/getSectionData\("([^"]+)"\)/g, 'getSectionData("$1", activePageId)');
  content = content.replace(/getSectionData\(activeSection\)/g, 'getSectionData(activeSection, activePageId)');
  changed = true;
}

// 5. Add activePageId to saveDraft
if (content.includes('saveDraft(')) {
  content = content.replace(/saveDraft\("([^"]+)", ([^,]+)\)/g, 'saveDraft("$1", $2, activePageId)');
  content = content.replace(/saveDraft\(activeSection, ([^,]+)\)/g, 'saveDraft(activeSection, $1, activePageId)');
  changed = true;
}

// 6. Add activePageId to publishSection
if (content.includes('publishSection(')) {
  content = content.replace(/publishSection\("([^"]+)", ([^,]+), ([^,]+)\)/g, 'publishSection("$1", $2, $3, activePageId)');
  content = content.replace(/publishSection\(activeSection, ([^,]+), ([^,]+)\)/g, 'publishSection(activeSection, $1, $2, activePageId)');
  changed = true;
}

// 7. Inject LandingPageManager component
if (!content.includes('<LandingPageManager')) {
  content = content.replace(
    /<main className="flex-1 overflow-y-auto p-6 md:p-10">\n\s*<div className="max-w-5xl mx-auto space-y-6">/g,
    `<main className="flex-1 overflow-y-auto p-6 md:p-10">\n        <div className="max-w-5xl mx-auto space-y-6">\n          <LandingPageManager activePageId={activePageId} onPageSelect={setActivePageId} />`
  );
  changed = true;
}

if (changed) {
  fs.writeFileSync(dashboardPath, content, 'utf8');
  console.log('Updated Dashboard.tsx');
} else {
  console.log('No changes needed in Dashboard.tsx');
}
