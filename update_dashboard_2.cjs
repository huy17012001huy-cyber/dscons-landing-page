const fs = require('fs');
const path = require('path');

const dashboardPath = path.join(__dirname, 'src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

let changed = false;

// 7. Inject LandingPageManager component
if (!content.includes('<LandingPageManager')) {
  // It has <div className="flex-1 overflow-y-auto p-6 md:p-10">\n        <div className="max-w-5xl mx-auto space-y-6">
  content = content.replace(
    /<div className="flex-1 overflow-y-auto p-6 md:p-10">\s*<div className="max-w-5xl mx-auto space-y-6">/g,
    `<div className="flex-1 overflow-y-auto p-6 md:p-10">\n        <div className="max-w-5xl mx-auto space-y-6">\n          <LandingPageManager activePageId={activePageId} onPageSelect={setActivePageId} />`
  );
  changed = true;
}

if (changed) {
  fs.writeFileSync(dashboardPath, content, 'utf8');
  console.log('Successfully injected LandingPageManager into Dashboard.tsx');
} else {
  console.log('No changes needed in Dashboard.tsx or failed to find insertion point');
}
