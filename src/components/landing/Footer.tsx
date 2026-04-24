import { useState, useEffect } from "react";
import { landingData } from "@/data/landingContent";
import { getSectionData } from "@/lib/api";
import { usePageContext } from "@/contexts/PageContext";
import { Facebook, Youtube, Send, Phone, MessageCircle, Globe } from "lucide-react";

const Footer = ({ data: previewData }: { data?: any }) => {
  const [cta, setCta] = useState(landingData.bottomCta);
  const { pageId } = usePageContext();

  useEffect(() => {
    // Determine if we are in Preview mode (data contains CTA fields)
    const isPreview = previewData && (previewData.title || previewData.socialLinks || previewData.copyright);

    const loadData = async () => {
      let combinedData = { ...landingData.bottomCta };

      if (isPreview) {
        // In preview mode, use the provided data directly
        combinedData = { ...combinedData, ...previewData };
      } else {
        // In live mode or if only settings are provided, load from DB
        const serverData = await getSectionData("cta", pageId);
        if (serverData && serverData.published_content) {
          combinedData = { ...combinedData, ...serverData.published_content };
        }
        
        // If we have settings (like favicon) from Index.tsx, merge it
        if (previewData && previewData.favicon) {
          combinedData.favicon = previewData.favicon;
        }
      }
      
      setCta(combinedData);
    };

    loadData();
  }, [previewData, pageId]);

  return (
    <footer className="w-full py-20 border-t border-white/5 bg-[#0a0a0b] relative overflow-hidden mt-20">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Top Section - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              {cta?.favicon ? (
                <img 
                  src={cta.favicon} 
                  alt="Logo" 
                  className="w-10 h-10 rounded-xl object-contain shadow-[0_10px_20px_-5px_rgba(51,170,239,0.3)]"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[#1978DC] text-white flex items-center justify-center font-black text-xl shadow-[0_10px_20px_-5px_rgba(51,170,239,0.5)]">
                  D
                </div>
              )}
              <span className="font-black text-2xl tracking-tight text-white">DSCons</span>
            </div>
            <p className="text-base text-[#a1a1aa] leading-relaxed font-medium">
              Hệ thống đào tạo Revit MEP Thực chiến. Từ con số 0 đến tự tin bóc tách khối lượng và triển khai mô hình BIM chuẩn quốc tế.
            </p>
          </div>

          {/* Column 2: Course Links */}
          <div className="space-y-6">
            <h4 className="font-black uppercase tracking-[0.2em] text-xs text-white/40">KHÓA HỌC</h4>
            <ul className="space-y-4">
              <li><a href="#curriculum" className="text-sm font-bold text-[#a1a1aa] hover:text-primary transition-colors flex items-center gap-2 group"><div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></div>Chương trình</a></li>
              <li><a href="#instructor" className="text-sm font-bold text-[#a1a1aa] hover:text-primary transition-colors flex items-center gap-2 group"><div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></div>Giảng viên</a></li>
              <li><a href="#pricing" className="text-sm font-bold text-[#a1a1aa] hover:text-primary transition-colors flex items-center gap-2 group"><div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></div>Học phí</a></li>
              <li><a href="#faq" className="text-sm font-bold text-[#a1a1aa] hover:text-primary transition-colors flex items-center gap-2 group"><div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></div>FAQ</a></li>
            </ul>
          </div>

          {/* Column 3: Support Links */}
          <div className="space-y-6">
            <h4 className="font-black uppercase tracking-[0.2em] text-xs text-white/40">HỖ TRỢ</h4>
            <ul className="space-y-4">
              <li><a href="#pricing" className="text-sm font-bold text-[#a1a1aa] hover:text-primary transition-colors flex items-center gap-2 group"><div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></div>Thanh toán</a></li>
              <li><a href="#faq" className="text-sm font-bold text-[#a1a1aa] hover:text-primary transition-colors flex items-center gap-2 group"><div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></div>Câu hỏi thường gặp</a></li>
              <li><a href={cta.supportLink || "#"} target="_blank" rel="noreferrer" className="inline-flex items-center px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all font-bold text-sm border border-primary/20">Liên hệ hỗ trợ</a></li>
            </ul>
          </div>

          {/* Column 4: Social Media */}
          <div className="space-y-6 flex flex-col lg:items-center">
            <h4 className="font-black uppercase tracking-[0.2em] text-xs text-white/40 text-center">THEO DÕI CHÚNG TÔI</h4>
            <div className="flex flex-wrap justify-center items-center gap-3">
              {(cta.socialLinks?.facebook || landingData.bottomCta.socialLinks?.facebook) && (
                <a href={cta.socialLinks?.facebook || landingData.bottomCta.socialLinks?.facebook || "#"} target="_blank" rel="noreferrer" 
                   className="w-11 h-11 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] hover:shadow-[0_0_20px_rgba(24,119,242,0.5)] hover:-translate-y-1 transition-all duration-300">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {(cta.socialLinks?.youtube || landingData.bottomCta.socialLinks?.youtube) && (
                <a href={cta.socialLinks?.youtube || landingData.bottomCta.socialLinks?.youtube || "#"} target="_blank" rel="noreferrer" 
                   className="w-11 h-11 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] hover:shadow-[0_0_20px_rgba(255,0,0,0.5)] hover:-translate-y-1 transition-all duration-300">
                  <Youtube className="w-5 h-5" />
                </a>
              )}
              {(cta.socialLinks?.website || landingData.bottomCta.socialLinks?.website) && (
                <a href={cta.socialLinks?.website || landingData.bottomCta.socialLinks?.website || "#"} target="_blank" rel="noreferrer" 
                   className="w-11 h-11 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:bg-primary hover:text-white hover:border-primary hover:shadow-[0_0_20px_rgba(51,170,239,0.5)] hover:-translate-y-1 transition-all duration-300">
                  <Globe className="w-5 h-5" />
                </a>
              )}
              {(cta.socialLinks?.zalo || landingData.bottomCta.socialLinks?.zalo) && (
                <a href={cta.socialLinks?.zalo || landingData.bottomCta.socialLinks?.zalo || "#"} target="_blank" rel="noreferrer" 
                   className="w-11 h-11 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:bg-[#0068FF] hover:text-white hover:border-[#0068FF] hover:shadow-[0_0_20px_rgba(0,104,255,0.5)] hover:-translate-y-1 transition-all duration-300">
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
          
        </div>

        {/* Bottom Section */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm font-medium text-[#71717a] text-center md:text-left">
            {cta.copyright || "© 2026 DSCons Global Academy. All rights reserved."}
            <a href="/login" className="ml-4 text-xs text-white/10 hover:text-primary transition-colors">Admin Portal</a>
          </p>
          <div className="text-sm font-black tracking-widest text-primary/80 uppercase px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10">
            {cta.statusText || "Khóa K4 đang bắt đầu"}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
