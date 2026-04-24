import { useState, useEffect } from "react";
import { landingData } from "@/data/landingContent";
import { getSectionData } from "@/lib/api";
import { usePageContext } from "@/contexts/PageContext";
import { formatTextGradients } from "@/lib/textUtils";
import { Countdown } from "@/components/ui/countdown";

export default function BottomCTA({ data: previewData }: { data?: any }) {
  const { pageId } = usePageContext();
  const [cta, setCta] = useState(landingData.bottomCta);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (previewData) {
      setCta({ ...landingData.bottomCta, ...previewData });
      return;
    }

    const loadData = async () => {
      const data = await getSectionData("cta", pageId);
      if (data) {
        setIsVisible(data.is_visible);
        if (data.published_content) {
          setCta({ ...landingData.bottomCta, ...data.published_content });
        }
      }
    };
    loadData();
  }, [previewData]);

  if (!isVisible || !cta) return null;

  return (
    <section className="py-12 px-4 bg-[#0a0a0b] text-white relative overflow-hidden">
      {/* Aurora Background Effects - Subtle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none opacity-40"></div>
      
      <div className="max-w-5xl mx-auto text-center flex flex-col items-center gap-6 bg-[#111113]/60 backdrop-blur-xl p-6 md:p-12 rounded-[2rem] border border-white/10 shadow-[0_0_40px_-12px_rgba(0,0,0,0.5)] relative z-10">
        <div className="absolute inset-0 bg-[url('https://lebachhiep.com/grid.svg')] opacity-5 pointer-events-none"></div>
        
        <div className="space-y-2 relative z-10">
          <h2 
            className="text-2xl md:text-4xl font-black leading-[1.2] tracking-tight"
            dangerouslySetInnerHTML={{ __html: formatTextGradients(cta.title) }}
          />
          <p 
            className="text-base md:text-lg text-[#a1a1aa] max-w-2xl mx-auto leading-relaxed font-medium opacity-80"
            dangerouslySetInnerHTML={{ __html: formatTextGradients(cta.description) }}
          />
        </div>
        
        {((cta as any).countdownDate || (cta as any).scheduleText) && (
          <div className="relative z-10 bg-white/[0.01] backdrop-blur-2xl border border-white/5 rounded-2xl p-4 md:p-6 w-full max-w-xl shadow-inner">
            {(cta as any).scheduleText && (
              <div className="flex items-center justify-center gap-2 text-primary font-bold mb-4 bg-primary/10 w-fit mx-auto px-4 py-1 rounded-full border border-primary/20 tracking-wide uppercase text-[11px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"></path><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h5"></path><path d="M17.5 17.5 16 16.3V14"></path><circle cx="16" cy="16" r="6"></circle></svg>
                <span>{(cta as any).scheduleText}</span>
              </div>
            )}
            {(cta as any).countdownDate && (
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#a1a1aa] uppercase mb-3 opacity-60">🔥 Đăng ký ngay trước khi kết thúc đếm ngược</span>
                <div className="scale-[0.85] md:scale-90">
                  <Countdown targetDate={(cta as any).countdownDate} />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col items-center gap-4 w-full sm:w-auto relative z-10">
          <a 
            href={cta.href} 
            onClick={(e) => { 
              if (cta.href?.startsWith('#')) {
                e.preventDefault(); 
                document.getElementById(cta.href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' }); 
              }
            }} 
            target={cta.href?.startsWith('#') ? "_self" : "_blank"}
            rel="noreferrer"
            className="relative inline-flex items-center justify-center gap-2.5 font-black transition-all duration-300 ease-out text-white bg-gradient-to-br from-[#33AAEF] via-[#1978DC] to-[#145DAA] shadow-[0_10px_25px_-10px_rgba(25,120,220,0.5)] hover:shadow-[0_15px_35px_-10px_rgba(25,120,220,0.6)] hover:-translate-y-1 active:translate-y-0 px-8 sm:px-10 py-3 sm:py-4 text-sm sm:text-base rounded-xl w-full sm:w-auto overflow-hidden group">
            <span className="relative z-10 flex items-center gap-2.5">
              {cta.button}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
          </a>
          
          <p className="text-[#a1a1aa] text-[12px] font-medium opacity-40 italic">
            * Hỗ trợ học viên bóc tách khối lượng & 1-1 không giới hạn thời gian
          </p>
        </div>
      </div>
    </section>
  );
}
