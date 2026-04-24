import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getSectionData } from "@/lib/api";
import { usePageContext } from "@/contexts/PageContext";
import { formatTextGradients } from "@/lib/textUtils";
import { Package, Video as VideoIcon, FileText, Wrench, Layers, Gift, Zap, Rocket, Star, Heart, Play, Globe, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function Bonus({ data: previewData }: { data?: any }) {
  const { pageId } = usePageContext();
  const [bonus, setBonus] = useState({ 
    title: "Vũ khí bí mật **ăn đứt đối thủ**",
    subtitle: "🎁 ƯU ĐÃI TẶNG KÈM 6.150K",
    description: "Học phí 3.900K nhưng DSCons tặng bạn gói quà lưu niệm đồ sộ trị giá tới 6.150K.",
    boxLeftTitle: "Hệ Sinh Thái Kế Thừa Từ DSCons",
    boxLeftSubtitle: "⭐ TỔNG TRỊ GIÁ 6.150K",
    boxLeftDesc: "Tuyệt đối không để học viên tay trắng lên đấu trường. Khóa học trao tận tay hệ thống Tool add-in kết hợp hàng trăm Video chất xám cao nhất, rút ngắn 50% thời lượng thao tác bằng tay.",
    boxLeftNote: "_ Nhận ngay 5 quà tặng đặc quyền",
    features: [] as any[]
  });
  const [isVisible, setIsVisible] = useState(true);

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Package": return <Package size={20} />;
      case "Video": return <VideoIcon size={20} />;
      case "FileText": return <FileText size={20} />;
      case "Wrench": return <Wrench size={20} />;
      case "Layers": return <Layers size={20} />;
      case "Gift": return <Gift size={20} />;
      case "Zap": return <Zap size={20} />;
      case "Rocket": return <Rocket size={20} />;
      case "Star": return <Star size={20} />;
      case "Heart": return <Heart size={20} />;
      case "Globe": return <Globe size={20} />;
      default: return <Gift size={20} />;
    }
  };

  const renderMedia = (item: any) => {
    if (!item.mediaUrl) return null;
    
    if (item.mediaType === "youtube") {
      const videoId = item.mediaUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)?.[1];
      return (
        <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
          <iframe 
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} 
            title={item.cmd}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          />
        </div>
      );
    }
    
    if (item.mediaType === "video") {
      return (
        <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
          <video src={item.mediaUrl} controls autoPlay className="w-full h-full object-contain" />
        </div>
      );
    }
    
    if (item.mediaType === "image") {
      return (
        <div className="w-full max-h-[80vh] flex items-center justify-center bg-black/20 rounded-lg overflow-hidden">
          <img src={item.mediaUrl} alt={item.cmd} className="max-w-full max-h-[80vh] object-contain" />
        </div>
      );
    }

    if (item.mediaType === "website") {
      return (
        <div className="w-full h-[80vh] rounded-lg overflow-hidden bg-white">
          <div className="bg-muted px-4 py-2 flex items-center justify-between border-b">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-amber-500/50" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
            </div>
            <div className="text-[10px] font-mono text-muted-foreground truncate max-w-[200px]">
              {item.mediaUrl}
            </div>
            <a href={item.mediaUrl} target="_blank" rel="noreferrer" className="text-primary hover:text-primary/80">
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <iframe 
            src={item.mediaUrl} 
            title={item.cmd}
            className="w-full h-[calc(100%-40px)] border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          />
        </div>
      );
    }
    
    return null;
  };

  useEffect(() => {
    if (previewData) {
      setBonus(prev => ({ ...prev, ...previewData }));
      return;
    }

    const loadData = async () => {
      const dbData = await getSectionData("bonus", pageId);
      if (dbData) {
        setIsVisible(dbData.is_visible);
        if (dbData.published_content) {
          setBonus(prev => ({ ...prev, ...dbData.published_content }));
        }
      }
    };
    loadData();
  }, [previewData]);

  if (!isVisible) return null;

  const displayFeatures = bonus.features && bonus.features.length > 0 ? bonus.features : [
    { icon: "Package", cmd: "Thư viện Family 3D (2000K)", desc: "Trợ thủ làm dự án siêu nhanh, độc quyền DSCons (Tặng sau khóa học)." },
    { icon: "Wrench", cmd: "Bộ DSCons Tool 4 Tháng (700K)", desc: "Tăng x30% tốc độ rải tay, dùng nghiện như lisp CAD. Kích hoạt vào học." },
    { icon: "Video", cmd: "Khóa Video Dựng hình (1000K)", desc: "Giáo trình video full các hệ cơ điện để nhâm nhi và thực hành tại nhà." },
    { icon: "Layers", cmd: "Khóa học Navisworks (700K)", desc: "Kiểm soát các đầu mối va chạm gắt gao giữa hệ thống (Giải cứu công trình)." },
    { icon: "FileText", cmd: "Khóa Bóc Tách/Shopdrawing (1750K)", desc: "Bộ video tự động tính khối lượng tạo hồ sơ bản vẽ chuẩn từng nét thiết kế." },
  ];

  return (
    <section id="bonus" className="py-24 px-4 relative overflow-hidden bg-background">
      {/* Nền Gradient mờ sau lưng */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span 
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4 border border-primary/20"
            dangerouslySetInnerHTML={{ __html: formatTextGradients(bonus.subtitle) }}
          />
          <h2 
            className="text-3xl md:text-5xl font-bold mb-4"
            dangerouslySetInnerHTML={{ __html: formatTextGradients(bonus.title) }}
          />
          <div 
            className="text-lg text-muted-foreground max-w-2xl mx-auto [&>p]:mb-0"
            dangerouslySetInnerHTML={{ __html: formatTextGradients(bonus.description) }}
          />
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Box Trái */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:w-1/2 p-8 border border-white/5 rounded-2xl bg-card/60 backdrop-blur-xl shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
            <div className="relative z-10">
              <span 
                className="inline-block px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 font-semibold text-xs mb-6 uppercase tracking-wider"
                dangerouslySetInnerHTML={{ __html: formatTextGradients(bonus.boxLeftSubtitle) }}
              />
              <h3 
                className="text-3xl font-bold mb-4"
                dangerouslySetInnerHTML={{ __html: formatTextGradients(bonus.boxLeftTitle) }}
              />
              <div 
                className="text-muted-foreground leading-relaxed mb-8 content-richtext"
                dangerouslySetInnerHTML={{ __html: formatTextGradients(bonus.boxLeftDesc) }}
              />
              <div 
                className="text-sm font-mono text-primary font-bold flex items-center gap-2"
                dangerouslySetInnerHTML={{ __html: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg> ${formatTextGradients(bonus.boxLeftNote)}` }}
              />
            </div>
          </motion.div>

          {/* Box Phải với Corner Brackets */}
          <div className="md:w-1/2 space-y-4 relative">
            {displayFeatures.map((item, index) => {
              const hasMedia = item.mediaUrl && item.mediaType && item.mediaType !== "none";
              const CardContent = (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`group flex items-center gap-4 p-5 rounded-xl border bg-card/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative border-white/5 hover:border-primary/30 ${hasMedia ? "cursor-pointer" : ""}`}
                >
                  <>
                    <div className="absolute top-[-1px] left-[-1px] w-3 h-3 border-t-2 border-l-2 border-primary rounded-tl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-[-1px] right-[-1px] w-3 h-3 border-t-2 border-r-2 border-primary rounded-tr opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-[-1px] left-[-1px] w-3 h-3 border-b-2 border-l-2 border-primary rounded-bl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-[-1px] right-[-1px] w-3 h-3 border-b-2 border-r-2 border-primary rounded-br opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </>
                  
                  <div className={`p-3 rounded-lg bg-black/20 text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors duration-300 shadow-inner border border-white/5`}>
                    {renderIcon(item.icon)}
                  </div>
                  <div>
                    <h4 
                      className="font-bold font-mono text-foreground transition-colors duration-300 group-hover:text-primary"
                      dangerouslySetInnerHTML={{ __html: formatTextGradients(item.cmd) }}
                    />
                    <p 
                      className="text-sm text-muted-foreground mt-1 mb-2 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: formatTextGradients(item.desc) }}
                    />
                    {hasMedia && (
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-300 px-3 py-1.5 rounded-full mt-1">
                        {item.mediaType === "image" ? <Package className="w-3.5 h-3.5" /> : 
                         item.mediaType === "website" ? <Globe className="w-3.5 h-3.5" /> :
                         <Play className="w-3.5 h-3.5" />}
                        {item.mediaType === "website" ? "Xem trang Web" : "Xem chi tiết"}
                      </div>
                    )}
                  </div>
                </motion.div>
              );

              if (hasMedia) {
                return (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      {CardContent}
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl p-1 bg-background/50 backdrop-blur-xl border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                      <div className="p-1">
                        {renderMedia(item)}
                      </div>
                    </DialogContent>
                  </Dialog>
                );
              }

              return <div key={index}>{CardContent}</div>;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
