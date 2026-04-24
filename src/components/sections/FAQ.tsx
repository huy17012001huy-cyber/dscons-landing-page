import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { landingData } from "@/data/landingContent";
import { getSectionData } from "@/lib/api";
import { usePageContext } from "@/contexts/PageContext";
import { formatTextGradients } from "@/lib/textUtils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CourseComparison from "@/components/landing/CourseComparison";

export default function FAQ({ data: previewData }: { data?: any }) {
  const { pageId } = usePageContext();
  const [faq, setFaq] = useState(landingData.faq);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (previewData) {
      setFaq({ ...landingData.faq, ...previewData });
      return;
    }

    const loadData = async () => {
      const data = await getSectionData("faq", pageId);
      if (data) {
        setIsVisible(data.is_visible);
        if (data.published_content) {
          setFaq({ ...landingData.faq, ...data.published_content });
        }
      }
    };
    loadData();
  }, [previewData]);

  if (!isVisible || !faq) return null;

  return (
    <section id="faq" className="py-24 px-4 bg-background">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          {faq.badge && (<div className="inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wider uppercase mb-6 bg-primary/10 text-primary border-transparent">{faq.badge}</div>)}
            <h2 className="text-3xl md:text-4xl font-bold">{faq.title}</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion 
            type={previewData ? "multiple" : "single"} 
            collapsible 
            className="w-full space-y-4"
            {...(previewData ? { value: faq.questions?.map((_: any, i: number) => `item-${i}`) } : {})}
          >
            {faq.questions?.map((q: any, i: number) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-[2px] bg-card rounded-xl px-4 sm:px-6 shadow-sm hover:shadow-md data-[state=open]:border-primary/40 data-[state=open]:shadow-md transition-all duration-300 overflow-hidden">
                <AccordionTrigger className="text-left text-[17px] sm:text-[20px] font-bold hover:text-primary py-7 hover:no-underline transition-all group">
                  <span className="group-data-[state=open]:text-primary transition-colors">{q.q}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div 
                    className="text-muted-foreground text-[16px] leading-relaxed pb-8 pt-2 content-richtext"
                    dangerouslySetInnerHTML={{ __html: formatTextGradients(q.a) }}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <div className="mt-16">
          <CourseComparison />
        </div>
      </div>
    </section>
  );
}
