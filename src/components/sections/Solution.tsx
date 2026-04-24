import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { landingData } from "@/data/landingContent";
import { CheckCircle2 } from "lucide-react";
import { getSectionData } from "@/lib/api";
import { usePageContext } from "@/contexts/PageContext";
import { formatTextGradients } from "@/lib/textUtils";

export default function Solution({ data: previewData }: { data?: any }) {
  const { pageId } = usePageContext();
  const [data, setData] = useState(landingData.solution);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (previewData) {
      setData({ ...landingData.solution, ...previewData });
      return;
    }

    const loadData = async () => {
      const dbData = await getSectionData("benefits", pageId);
      if (dbData) {
        setIsVisible(dbData.is_visible);
        if (dbData.published_content) {
          setData({ ...landingData.solution, ...dbData.published_content });
        }
      }
    };
    loadData();
  }, [previewData]);

  if (!isVisible || !data) return null;

  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          {data.badge && (<div className="inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wider uppercase mb-6 bg-primary/10 text-primary border-transparent">{data.badge}</div>)}
            <h2 
            className="text-[28px] sm:text-[36px] font-bold leading-[1.2]"
            dangerouslySetInnerHTML={{ __html: formatTextGradients(data.title) }}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {data.items?.map((item: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-start gap-4 group p-6 sm:p-8 rounded-2xl bg-card border-[2px] shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold" dangerouslySetInnerHTML={{ __html: formatTextGradients(item.title) }} />
                <div 
                  className="text-muted-foreground leading-relaxed [&>p]:mb-0" 
                  dangerouslySetInnerHTML={{ __html: formatTextGradients(item.description) }} 
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
