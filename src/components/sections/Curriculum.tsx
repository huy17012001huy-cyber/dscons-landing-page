import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { landingData } from "@/data/landingContent";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Play } from "lucide-react";
import { getSectionData } from "@/lib/api";
import { usePageContext } from "@/contexts/PageContext";
import { formatTextGradients } from "@/lib/textUtils";

import * as LucideIcons from "lucide-react";

const getIcon = (iconName: string) => {
  const Icon = (LucideIcons as any)[iconName] || LucideIcons.Play;
  return <Icon size={20} />;
};

export default function Curriculum({ data: previewData }: { data?: any }) {
  const { pageId } = usePageContext();
  const [data, setData] = useState(landingData.curriculum);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (previewData) {
      setData({ ...landingData.curriculum, ...previewData });
      return;
    }

    const loadData = async () => {
      const dbData = await getSectionData("curriculum", pageId);
      if (dbData) {
        setIsVisible(dbData.is_visible);
        if (dbData.published_content) {
          setData({ ...landingData.curriculum, ...dbData.published_content });
        }
      }
    };
    loadData();
  }, [previewData]);

  if (!isVisible || !data) return null;

  return (
    <section id="curriculum" className="py-24 px-4 bg-muted/30 relative">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          {data.badge && (
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4 border border-primary/20 tracking-wider uppercase">
              {data.badge}
            </span>
          )}
          <h2 
            className="text-3xl md:text-5xl font-bold mb-4"
            dangerouslySetInnerHTML={{ __html: formatTextGradients(data.title) }}
          />
        </motion.div>

        <div className="relative p-6 md:p-10 border border-border bg-card/50 rounded-3xl overflow-hidden shadow-sm">
          {/* Subtle decoration inside the frame */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
          
          <div className="space-y-12 relative z-10">
            {data.modules?.map((module: any) => (
              <div key={module.id} className="w-full">
                <h3 
                  className="text-sm font-semibold tracking-wider text-primary uppercase mb-6 pl-4 border-l-4 border-primary"
                  dangerouslySetInnerHTML={{ __html: formatTextGradients(module.title) }}
                />
                
                <Accordion type="single" collapsible className="w-full space-y-3" defaultValue="lesson-01">
                  {module.lessons?.map((lesson: any) => (
                    <AccordionItem 
                      key={lesson.id} 
                      value={`lesson-${lesson.id}`} 
                      className="border-[2px] bg-background rounded-xl px-4 md:px-6 shadow-sm hover:shadow-md data-[state=open]:border-primary/40 data-[state=open]:shadow-md transition-all duration-300 overflow-hidden"
                    >
                      <AccordionTrigger className="hover:no-underline py-5 md:py-6 group">
                        <div className="flex items-start gap-4 text-left w-full pr-4">
                          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary group-data-[state=open]:bg-primary group-data-[state=open]:text-white transition-colors duration-300">
                            {getIcon(lesson.icon)}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors flex items-center gap-2">
                              <span className="font-mono text-muted-foreground group-hover:text-primary/70">{lesson.id}</span>
                              <span dangerouslySetInnerHTML={{ __html: formatTextGradients(lesson.title) }} />
                            </h4>
                            <div className="text-sm md:text-base text-muted-foreground font-normal line-clamp-2 sm:line-clamp-none content-richtext" dangerouslySetInnerHTML={{ __html: formatTextGradients(lesson.desc) }} />
                          </div>
                        </div>
                      </AccordionTrigger>
                      
                      <AccordionContent className="pb-6 border-t pt-4 mt-2">
                        <div className="pl-16 space-y-4">
                          {lesson.details?.map((detail: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-3">
                              <Play size={14} className="text-primary mt-1 flex-shrink-0 stroke-[3px]" />
                              <span className="text-base text-muted-foreground font-medium content-richtext" dangerouslySetInnerHTML={{ __html: formatTextGradients(detail) }} />
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
