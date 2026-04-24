import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { landingData } from "@/data/landingContent";
import { Check, Rocket, Users, Award, Code, Star, Zap, Target, BookOpen, Crown, Gem, ShieldCheck, HelpCircle } from "lucide-react";
import { formatTextGradients } from "@/lib/textUtils";
import { getSectionData } from "@/lib/api";
import { usePageContext } from "@/contexts/PageContext";

import YouTubePlayer from "@/components/ui/YouTubePlayer";

export default function Instructor({ data: previewData }: { data?: any }) {
  const { pageId } = usePageContext();
  const [instructor, setInstructor] = useState(landingData.instructor);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (previewData) {
      setInstructor({ ...landingData.instructor, ...previewData });
      return;
    }

    const loadData = async () => {
      const dbData = await getSectionData("instructor", pageId);
      if (dbData) {
        setIsVisible(dbData.is_visible);
        if (dbData.published_content) {
          setInstructor({ ...landingData.instructor, ...dbData.published_content });
        }
      }
    };
    loadData();
  }, [previewData]);

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Rocket": return <Rocket size={20} />;
      case "Users": return <Users size={20} />;
      case "Award": return <Award size={20} />;
      case "Code": return <Code size={20} />;
      case "Star": return <Star size={20} />;
      case "Zap": return <Zap size={20} />;
      case "Target": return <Target size={20} />;
      case "BookOpen": return <BookOpen size={20} />;
      case "Crown": return <Crown size={20} />;
      case "Gem": return <Gem size={20} />;
      case "ShieldCheck": return <ShieldCheck size={20} />;
      case "Check": return <Check size={20} />;
      default: return <Check size={20} />;
    }
  };

  if (!isVisible) return null;

  return (
    <section id="instructor" className="py-24 px-4 bg-card">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-[13px] mb-4 tracking-wider uppercase border border-primary/20">
            {instructor.badge}
          </span>
          <h2 
            className="text-3xl md:text-[44px] font-bold mb-4 text-foreground leading-[1.3]"
            dangerouslySetInnerHTML={{ __html: formatTextGradients(instructor.title) }}
          />
          <div 
            className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium"
            dangerouslySetInnerHTML={{ __html: formatTextGradients(instructor.subtitle) }}
          />
        </motion.div>

        {/* Video Introduction Area */}
        {instructor.videoUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="mb-16 rounded-3xl overflow-hidden border-4 border-primary/20 shadow-2xl aspect-video bg-black relative"
          >
            <YouTubePlayer 
              url={instructor.videoUrl} 
              className="absolute inset-0 w-full h-full"
              title="Instructor Intro Video"
            />
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Box Left - Profile */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center text-center p-8 sm:p-10 bg-card rounded-2xl border-[1px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-t-[3px] border-t-primary"
          >
             <div className="w-28 h-28 rounded-full border-4 border-muted overflow-hidden mb-6 flex-shrink-0">
               <img src={instructor.imageUrl || "https://lebachhiep.com/_next/image?url=%2Fhiep.png&w=640&q=75"} alt={instructor.name} className="w-full h-full object-cover" />
             </div>
             <h3 className="text-[24px] font-extrabold mb-1">{instructor.name}</h3>
             <p className="text-primary font-medium text-[15px] mb-6">{instructor.role}</p>
             <div 
               className="text-muted-foreground leading-relaxed text-[15px]"
               dangerouslySetInnerHTML={{ __html: formatTextGradients(instructor.bio) }}
             />
          </motion.div>

          {/* Box Right - Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col p-8 sm:p-10 bg-card rounded-2xl border-[1px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
          >
            <h3 className="text-[20px] font-bold mb-6 text-foreground">{instructor.achievementsHeading}</h3>
            <div className="flex flex-col space-y-6">
              {instructor.achievements.map((item: any, index: number) => (
                <div key={index} className="flex items-start gap-4 group">
                  <div className="text-primary mt-0.5 shrink-0">
                    {renderIcon(item.icon)}
                  </div>
                  <span className="text-[15px] font-medium text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
