import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { landingData } from "@/data/landingContent";

import { getSectionData } from "@/lib/api";
import { usePageContext } from "@/contexts/PageContext";
import { formatTextGradients } from "@/lib/textUtils";

import * as LucideIcons from "lucide-react";

const getIcon = (iconName: string) => {
  const Icon = (LucideIcons as any)[iconName] || LucideIcons.AppWindow;
  return <Icon size={24} className="text-primary" />;
};

export default function Outcomes() {
  const { pageId } = usePageContext();
  const [data, setData] = useState(landingData.outcomes);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const dbData = await getSectionData("social", pageId);
      if (dbData) {
        setIsVisible(dbData.is_visible);
        if (dbData.published_content) {
          setData({ ...landingData.outcomes, ...dbData.published_content });
        }
      }
    };
    loadData();
  }, []);

  if (!isVisible || !data) return null;

  return (
    <section id="outcomes" className="py-24 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-[13px] mb-4 tracking-wider uppercase border border-primary/20">
            {data.badge}
          </span>
          <h2 
            className="text-3xl md:text-[44px] font-bold mb-4 text-foreground"
            dangerouslySetInnerHTML={{ __html: formatTextGradients(data.title) }}
          />
          <div 
            className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium"
            dangerouslySetInnerHTML={{ __html: formatTextGradients(data.description) }}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items?.map((item: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card p-8 rounded-2xl border-[1px] border-border shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-card-hover transition-all duration-300 ease-out hover:-translate-y-1 flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                {getIcon(item.icon)}
              </div>
              <h3 className="text-[17px] font-bold mb-3 text-foreground">{item.title}</h3>
              <div className="text-[14px] text-muted-foreground leading-relaxed content-richtext" dangerouslySetInnerHTML={{ __html: formatTextGradients(item.description) }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
