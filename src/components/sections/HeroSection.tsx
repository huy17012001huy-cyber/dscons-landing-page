import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { landingData } from "@/data/landingContent";
import { getSectionData } from "@/lib/api";
import { usePageContext } from "@/contexts/PageContext";
import { formatTextGradients } from "@/lib/textUtils";

import YouTubePlayer from "@/components/ui/YouTubePlayer";

export default function HeroSection({ data: previewData }: { data?: any }) {
  const { pageId } = usePageContext();
  const [hero, setHero] = useState(landingData.hero);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (previewData) {
      setHero({ ...landingData.hero, ...previewData });
      return;
    }

    const loadHeroData = async () => {
      const data = await getSectionData("hero", pageId);
      if (data) {
        setIsVisible(data.is_visible);
        if (data.published_content) {
          setHero({ ...landingData.hero, ...data.published_content });
        }
      }
    };
    loadHeroData();
  }, [previewData]);

  if (!isVisible) return null;

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4">
      <div
        className={`max-w-7xl mx-auto flex flex-col gap-12 ${hero.mediaType === 'none'
            ? 'items-center text-center'
            : (hero.mediaPosition === 'left' ? 'lg:flex-row-reverse items-center text-left' : 'lg:flex-row items-center text-left')
          }`}
      >
        {/* Content Side */}
        <div className={`flex-1 flex flex-col ${hero.mediaType === 'none' ? 'items-center justify-center max-w-4xl mx-auto' : 'items-start'}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/10 text-primary font-medium text-sm border border-primary/20"
          >
            {hero.badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`text-[28px] sm:text-[44px] md:text-[56px] font-semibold leading-[1.1] tracking-[-0.4px] text-foreground mb-6 whitespace-pre-wrap ${hero.mediaType === 'none' ? 'mx-auto' : ''}`}
            dangerouslySetInnerHTML={{ __html: formatTextGradients(hero.title) }}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl whitespace-pre-wrap ${hero.mediaType === 'none' ? 'mx-auto' : ''}`}
            dangerouslySetInnerHTML={{ __html: formatTextGradients(hero.description) }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <a
              href={hero.primaryCtaHref || "#pricing"}
              onClick={(e) => { 
                const href = hero.primaryCtaHref || "#pricing";
                if (href.startsWith('#')) {
                  e.preventDefault(); 
                  document.getElementById(href.substring(1))?.scrollIntoView({ behavior: 'smooth' }); 
                }
              }}
              className="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 ease-out text-white bg-gradient-to-b from-[#33AAEF] to-[#1978DC] shadow-btn-pro hover:shadow-btn-pro-hover active:from-[#1978DC] active:to-[#145DAA] px-7 sm:px-10 py-3.5 sm:py-4 text-[15px] sm:text-[17px] rounded-xl animate-pulse-glow"
            >
              {hero.primaryCta}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </a>
            <a
              href={hero.secondaryCtaHref || "#curriculum"}
              onClick={(e) => { 
                const href = hero.secondaryCtaHref || "#curriculum";
                if (href.startsWith('#')) {
                  e.preventDefault(); 
                  document.getElementById(href.substring(1))?.scrollIntoView({ behavior: 'smooth' }); 
                }
              }}
              className="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 ease-out bg-card text-foreground border-2 border-border shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:border-slate-300 hover:shadow-md px-7 sm:px-10 py-3.5 sm:py-4 text-[15px] sm:text-[17px] rounded-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"></path></svg>
              {hero.secondaryCta}
            </a>
          </motion.div>

          {/* Schedule Info */}
          {((hero as any).startDate || (hero as any).scheduleText) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className={`flex flex-col sm:flex-row gap-4 mt-6 ${hero.mediaType === 'none' ? 'mx-auto justify-center' : ''}`}
            >
              {(hero as any).startDate && (
                <motion.div 
                  animate={{ 
                    scale: [1, 1.02, 1],
                    boxShadow: [
                      "0 0 0px rgba(51, 170, 239, 0)",
                      "0 0 20px rgba(51, 170, 239, 0.2)",
                      "0 0 0px rgba(51, 170, 239, 0)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 px-4 py-2 rounded-lg border border-primary/20 backdrop-blur-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-days"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path><path d="M16 18h.01"></path></svg>
                  <span>Khai giảng: {(hero as any).startDate}</span>
                </motion.div>
              )}
              {(hero as any).scheduleText && (
                <motion.div 
                  animate={{ 
                    scale: [1, 1.02, 1],
                    boxShadow: [
                      "0 0 0px rgba(51, 170, 239, 0)",
                      "0 0 20px rgba(51, 170, 239, 0.2)",
                      "0 0 0px rgba(51, 170, 239, 0)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  className="flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 px-4 py-2 rounded-lg border border-primary/20 backdrop-blur-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <span>Lịch học: {(hero as any).scheduleText}</span>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Stats - Dynamic grid based on media presence */}
          {hero.stats && hero.stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={`grid gap-3 sm:gap-4 w-full mt-10 ${
                hero.mediaType === 'none' 
                  ? 'grid-cols-2 sm:grid-cols-4 mx-auto' 
                  : 'grid-cols-2 max-w-lg'
              }`}
            >
              {hero.stats.map((stat: any, index: number) => (
                <div key={index} className="bg-card rounded-xl p-4 sm:p-5 border-[2px] border-border shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-[28px] sm:text-[32px] font-black text-foreground mb-1.5 leading-none">{stat.value}</span>
                  <span className="text-[12px] sm:text-[13px] font-bold text-muted-foreground uppercase tracking-widest leading-tight">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Media Side */}
        {hero.mediaType !== 'none' && (hero.videoUrl || hero.imageUrl) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex-1 w-full max-w-2xl overflow-hidden rounded-2xl border bg-card shadow-lg aspect-[16/9] relative"
          >
            {hero.mediaType === "video" && hero.videoUrl ? (
              <YouTubePlayer
                url={hero.videoUrl}
                className="absolute inset-0 w-full h-full"
                title="Hero Video"
              />
            ) : hero.imageUrl ? (
              <img src={hero.imageUrl} alt="Hero Media" className="w-full h-full object-cover" />
            ) : null}
          </motion.div>
        )}
      </div>
    </section>
  );
}
