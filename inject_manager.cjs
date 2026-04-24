const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'admin', 'Dashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const injection = `              ) : activeSection === "settings" ? (
                <div className="space-y-8 pb-12">
                  {/* Landing Pages Management */}
                  <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <LayoutDashboard className="w-5 h-5 text-primary" /> Quản lý Landing Pages
                    </h3>
                    <LandingPageManager activePageId={activePageId} onPageSelect={setActivePageId} />
                  </div>`;

// Use a more flexible regex for the settings block header
const settingsRegex = /\)\s*:\s*activeSection\s*===\s*["']settings["']\s*\?\s*\(\s*<div\s*className=["']space-y-8\s*pb-12["']>/;

if (settingsRegex.test(content)) {
    content = content.replace(settingsRegex, injection);
    fs.writeFileSync(filePath, content);
    console.log('Successfully injected LandingPageManager into Settings view.');
} else {
    console.log('Could not find settings block header.');
    // Check if it's already there
    if (content.includes('LandingPageManager')) {
        console.log('LandingPageManager already exists in file.');
    }
}
