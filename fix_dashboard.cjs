const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/Dashboard.tsx', 'utf8');

const splitPoint = '{/* Content Area & Live Preview Split */}';

if (content.includes(splitPoint)) {
  const parts = content.split(splitPoint);
  
  // parts[0] is everything before splitPoint
  // parts[1] is everything after splitPoint
  
  let newParts1 = parts[1].replace(
    '<div className="flex-1 overflow-hidden flex relative">',
    `{activeSection === "landing-pages" ? (
          <div className="flex-1 overflow-y-auto p-6 md:p-10">
            <div className="max-w-5xl mx-auto space-y-6">
              <LandingPageManager activePageId={activePageId} onPageSelect={setActivePageId} />
            </div>
          </div>
        ) : (
        <div className="flex-1 overflow-hidden flex relative">`
  );
  
  // Add closing parenthesis before </main>
  const endTarget = '</main>';
  newParts1 = newParts1.replace(endTarget, `  )}\n      </main>`);
  
  content = parts[0] + splitPoint + newParts1;
  
  fs.writeFileSync('src/pages/admin/Dashboard.tsx', content);
  console.log('Successfully updated Dashboard.tsx!');
} else {
  console.log('Split point not found!');
}
