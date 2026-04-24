const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'admin', 'Dashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const rightPanelStartRegex = /\{\/\* Right Panel: Live Preview \*\/}/;
const rightPanelEndRegex = /\s*<\/div>\s*<\/div>\s*<\/main>\s*<\/div>\s*\);\s*}\s*$/;

const startMatch = content.match(rightPanelStartRegex);
const endMatch = content.match(rightPanelEndRegex);

if (startMatch && endMatch) {
    const head = content.substring(0, startMatch.index);
    const tail = content.substring(endMatch.index);
    
    const newRightPanel = `          {/* Right Panel: Live Preview */}
          {activeSection !== "settings" && activeSection !== "system-settings" && (
            <div className="flex-1 w-full bg-background relative isolate overflow-x-hidden overflow-y-auto">
               {activeSection === "header" && (
                  <div className="pointer-events-none origin-top-left scale-[0.8] w-[125%] h-full">
                    <NavbarPreview data={headerForm} />
                    <div className="mt-[-1px]">
                      <HeroPreview data={heroForm} />
                    </div>
                  </div>
                )}
                {activeSection === "pain-points" && <div className="pointer-events-none origin-top-left scale-[0.8] w-[125%]"><PainPointsPreview data={painPointsForm} /></div>}
                {activeSection === "benefits" && <div className="pointer-events-none origin-top-left scale-[0.8] w-[125%]"><SolutionPreview data={benefitsForm} /></div>}
                {activeSection === "curriculum" && <div className="pointer-events-none origin-top-left scale-[0.8] w-[125%]"><CurriculumPreview data={curriculumForm} /></div>}
                {activeSection === "bonus" && <div className="pointer-events-none origin-top-left scale-[0.8] w-[125%]"><BonusPreview data={bonusForm} /></div>}
                {activeSection === "instructor" && <div className="pointer-events-none origin-top-left scale-[0.8] w-[125%]"><InstructorPreview data={instructorForm} /></div>}
                {activeSection === "pricing" && <div className="pointer-events-none origin-top-left scale-[0.8] w-[125%]"><PricingPreview data={pricingForm} /></div>}
                {activeSection === "faq" && <div className="pointer-events-none origin-top-left scale-[0.8] w-[125%]"><FAQPreview data={faqForm} /></div>}
                {activeSection === "comparison" && (
                  <div className="w-full mt-12 space-y-12 px-6">
                     <div className="flex justify-center scale-110">
                        <div className="bg-primary text-white px-10 py-8 rounded-2xl text-xl font-black gap-4 flex items-center shadow-2xl shadow-primary/20">
                           <Bot size={32} />
                           {comparisonForm.buttonText || "BẮT ĐẦU SO SÁNH TỰ ĐỘNG"}
                        </div>
                     </div>
                     <div className="relative">
                        <div className="absolute -top-10 left-0 text-[10px] font-black uppercase tracking-[0.3em] opacity-30 text-primary">
                          FULL MODAL PREVIEW CONTENT
                        </div>
                        <ComparisonPreview data={comparisonForm} isPreview={true} />
                     </div>
                  </div>
                )}
                {activeSection === "social" && <div className="pointer-events-none origin-top-left scale-[0.8] w-[125%]"><OutcomesPreview data={socialForm} /></div>}
                {activeSection === "testimonials" && <div className="pointer-events-none origin-top-left scale-[0.8] w-[125%]"><TestimonialsPreview data={testimonialsForm} /></div>}
                {activeSection === "cta" && (
                  <div className="pointer-events-none origin-top-left scale-[0.8] w-[125%] flex flex-col gap-12">
                    <BottomCTAPreview />
                    <Footer data={ctaForm} />
                  </div>
                )}
            </div>
          )}`;

    fs.writeFileSync(filePath, head + newRightPanel + tail);
    console.log('Successfully fixed Dashboard layout with regex.');
} else {
    console.log('Could not find markers with regex:', { start: !!startMatch, end: !!endMatch });
}
