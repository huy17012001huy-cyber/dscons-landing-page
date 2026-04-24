import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { landingData } from "@/data/landingContent";
import { XCircle } from "lucide-react";
import { getSectionData } from "@/lib/api";
import { usePageContext } from "@/contexts/PageContext";
import { Logos3 } from "@/components/blocks/logos3";
import { formatTextGradients } from "@/lib/textUtils";

export default function PainPoints({ data: previewData }: { data?: any }) {
  const { pageId } = usePageContext();
  const [painPoints, setPainPoints] = useState(landingData.painPoints);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (previewData) {
      setPainPoints({ ...landingData.painPoints, ...previewData });
      return;
    }

    const loadData = async () => {
      const dbData = await getSectionData("pain-points", pageId);
      if (dbData) {
        setIsVisible(dbData.is_visible);
        if (dbData.published_content) {
          // Merge default techLogos if missing in DB to avoid empty logos
          const publishedContent = dbData.published_content;
          if (!publishedContent.techLogos || publishedContent.techLogos.length === 0) {
            publishedContent.techLogos = landingData.painPoints.techLogos;
          }
          if (!publishedContent.techLogosHeading) {
            publishedContent.techLogosHeading = landingData.painPoints.techLogosHeading;
          }
          setPainPoints({ ...landingData.painPoints, ...publishedContent });
        }
      }
    };
    loadData();
  }, [previewData]);

  if (!isVisible) return null;

  return (
    <section className="py-24 px-4 bg-muted/50 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <Logos3 
          heading={painPoints.techLogosHeading} 
          logos={painPoints.techLogos} 
          className="mb-12"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          {painPoints.badge && (<div className="inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wider uppercase mb-6 bg-primary/10 text-primary border-transparent">{painPoints.badge}</div>)}
            <h2 className="text-3xl md:text-4xl font-bold whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatTextGradients(painPoints.title) }} />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {painPoints.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-card p-5 sm:p-6 rounded-2xl border-[2px] flex flex-col gap-3 shadow-card hover:shadow-card-hover transition-all duration-300 ease-out hover:-translate-y-1"
            >
              <span className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-primary/0 group-hover:border-primary/40 transition-all duration-300 rounded-tl-sm pointer-events-none"></span>
              <span className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-primary/0 group-hover:border-primary/40 transition-all duration-300 rounded-tr-sm pointer-events-none"></span>
              <span className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-primary/0 group-hover:border-primary/40 transition-all duration-300 rounded-bl-sm pointer-events-none"></span>
              <span className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-primary/0 group-hover:border-primary/40 transition-all duration-300 rounded-br-sm pointer-events-none"></span>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-1 shrink-0">
                <XCircle size={20} className="sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold leading-tight" dangerouslySetInnerHTML={{ __html: formatTextGradients(item.title) }} />
              <div className="text-sm text-muted-foreground leading-relaxed prose-p:my-0 prose-ul:my-0" dangerouslySetInnerHTML={{ __html: formatTextGradients(item.description) }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
