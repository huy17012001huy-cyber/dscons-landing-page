import re

with open('src/pages/admin/Dashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure we import Eye
if 'Eye' not in content:
    content = content.replace('LogOut,', 'LogOut, Eye,')

# Target the main content area
target_start = """        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 relative">"""

replacement_start = """        {/* Content Area - Split Screen */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Form Area */}
          <div className="w-1/2 border-r p-6 lg:p-8 overflow-y-auto relative bg-background custom-scrollbar">"""

target_end = """              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}"""

replacement_end = """              ) : null}
            </motion.div>
          </AnimatePresence>
          </div>
          
          {/* Right: Live Preview Area */}
          <div className="w-1/2 bg-muted/20 overflow-y-auto relative flex flex-col border-l shadow-inner custom-scrollbar">
            <div className="sticky top-0 bg-background/80 backdrop-blur z-20 border-b px-4 py-3 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">Live Preview</h3>
              </div>
              <div className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-lg font-medium">Bản xem trước trực tiếp</div>
            </div>
            
            <div className="flex-1 w-full bg-background relative isolate">
               {/* Render the actual landing page section component dynamically based on form state */}
               {activeSection === "hero" && <div className="pointer-events-none origin-top-left scale-[0.65] w-[153%]"><HeroPreview data={heroForm} /></div>}
               {activeSection === "pain-points" && <div className="pointer-events-none origin-top-left scale-[0.65] w-[153%]"><PainPointsPreview data={painPointsForm} /></div>}
               {activeSection === "solution" && <div className="pointer-events-none origin-top-left scale-[0.65] w-[153%]"><SolutionPreview data={solutionForm} /></div>}
               {activeSection === "curriculum" && <div className="pointer-events-none origin-top-left scale-[0.65] w-[153%]"><CurriculumPreview data={curriculumForm} /></div>}
               {activeSection === "bonus" && <div className="pointer-events-none origin-top-left scale-[0.65] w-[153%]"><BonusPreview data={bonusForm} /></div>}
               {activeSection === "instructor" && <div className="pointer-events-none origin-top-left scale-[0.65] w-[153%]"><InstructorPreview data={instructorForm} /></div>}
               {activeSection === "pricing" && <div className="pointer-events-none origin-top-left scale-[0.65] w-[153%]"><PricingPreview data={pricingForm} /></div>}
               {activeSection === "faq" && <div className="pointer-events-none origin-top-left scale-[0.65] w-[153%]"><FAQPreview data={faqForm} /></div>}
               {activeSection === "comparison" && <div className="pointer-events-none origin-top-left scale-[0.65] w-[153%]"><ComparisonPreview data={comparisonForm} /></div>}
               
               {/* Nút mờ (Overlay) ở chế độ preview */}
               <div className="absolute inset-0 z-50 pointer-events-auto cursor-not-allowed border-4 border-dashed border-primary/20 hover:border-primary/50 transition-colors flex items-start justify-center pt-8">
                  <div className="bg-background/90 px-4 py-2 rounded-full border shadow-sm text-sm text-muted-foreground opacity-0 hover:opacity-100 transition-opacity">
                    Chế độ xem trước - Chỉ đọc
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}"""

content = content.replace(target_start, replacement_start)
content = content.replace(target_end, replacement_end)

# We need to import the preview components at the top!
# Since we haven't refactored yet, we will just import the existing components from src/components/sections/
imports = """import HeroPreview from "@/components/sections/HeroSection";
import PainPointsPreview from "@/components/sections/PainPoints";
import SolutionPreview from "@/components/sections/Solution";
import CurriculumPreview from "@/components/sections/Curriculum";
import BonusPreview from "@/components/sections/Bonus";
import InstructorPreview from "@/components/sections/Instructor";
import PricingPreview from "@/components/sections/Pricing";
import FAQPreview from "@/components/sections/FAQ";
import ComparisonPreview from "@/components/landing/ComparisonTable";
"""
content = imports + content

with open('src/pages/admin/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Dashboard layout for Live Preview")
