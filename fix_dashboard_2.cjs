const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/Dashboard.tsx', 'utf8');

// 1. Remove Quản lý Landing Pages from sidebar
const sidebarTarget = `            <button 
              onClick={() => setActiveSection("landing-pages")}
              className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors \${
                activeSection === "landing-pages" 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }\`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Quản lý Landing Pages
            </button>`;
if(content.includes(sidebarTarget)) {
    content = content.replace(sidebarTarget, '');
} else {
    console.log("Could not find sidebar target");
}

// 2. Remove the conditional wrap I added earlier
const wrapStartTarget = `        {/* Content Area & Live Preview Split */}
        {activeSection === "landing-pages" ? (
          <div className="flex-1 overflow-y-auto p-6 md:p-10">
            <div className="max-w-5xl mx-auto space-y-6">
              <LandingPageManager activePageId={activePageId} onPageSelect={setActivePageId} />
            </div>
          </div>
        ) : (
        <div className="flex-1 overflow-hidden flex relative">`;
const wrapStartReplace = `        {/* Content Area & Live Preview Split */}
        <div className="flex-1 overflow-hidden flex relative">`;
if(content.includes(wrapStartTarget)) {
    content = content.replace(wrapStartTarget, wrapStartReplace);
} else {
    console.log("Could not find wrap target");
}

const wrapEndTarget = `  )}
      </main>`;
const wrapEndReplace = `      </main>`;
if(content.includes(wrapEndTarget)) {
    content = content.replace(wrapEndTarget, wrapEndReplace);
}

// 3. Inject LandingPageManager into the settings view
const settingsTarget = `              ) : activeSection === "settings" ? (
                <div className="space-y-8 pb-12">`;
const settingsReplace = `              ) : activeSection === "settings" ? (
                <div className="space-y-8 pb-12">
                  {/* Landing Pages Management */}
                  <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <LayoutDashboard className="w-5 h-5 text-primary" /> Quản lý Landing Pages
                    </h3>
                    <LandingPageManager activePageId={activePageId} onPageSelect={setActivePageId} />
                  </div>`;
if(content.includes(settingsTarget)) {
    content = content.replace(settingsTarget, settingsReplace);
} else {
    console.log("Could not find settings target");
}

fs.writeFileSync('src/pages/admin/Dashboard.tsx', content);
console.log('Successfully refactored Dashboard.tsx');
