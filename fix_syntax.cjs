const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/Dashboard.tsx', 'utf8');

const replacement = `    } catch(e) {
      toast.error("Đã xảy ra lỗi!");
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col h-screen sticky top-0 shrink-0">
        <div className="h-16 flex items-center px-6 border-b gap-2">
          <LayoutDashboard className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold">DSCons CMS</h1>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Quản lý giao diện</p>
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors \${
                  activeSection === sec.id 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }\`}
              >
                {sec.icon}
                {sec.name}
              </button>
            ))}
          </div>

          <div className="mt-8 space-y-1">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Hệ thống</p>
            <button 
              onClick={() => setActiveSection("settings")}
              className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors \${
                activeSection === "settings" 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }\`}
            >
              <Settings className="w-4 h-4" />
              Cài đặt Landing Page
            </button>
          </div>
        </div>

        <div className="p-4 border-t">`;

content = content.replace(/    \} catch\(e\) \{\s*toast\.error\("Đã xảy ra lỗi!"\);\s*\}\s*<\/div>\s*<\/div>\s*<div className="p-4 border-t">/m, replacement);
fs.writeFileSync('src/pages/admin/Dashboard.tsx', content);
console.log('Restored syntax successfully.');
