import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { landingData } from "@/data/landingContent";
import { Check } from "lucide-react";
import { getSectionData } from "@/lib/api";
import { usePageContext } from "@/contexts/PageContext";
import { formatTextGradients } from "@/lib/textUtils";

export default function Pricing({ data: previewData }: { data?: any }) {
  const { pageId } = usePageContext();
  const [pricing, setPricing] = useState(landingData.pricing);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (previewData) {
      setPricing({ ...landingData.pricing, ...previewData });
      return;
    }

    const loadData = async () => {
      const dbData = await getSectionData("pricing", pageId);
      if (dbData) {
        setIsVisible(dbData.is_visible);
        if (dbData.published_content) {
          setPricing({ ...landingData.pricing, ...dbData.published_content });
        }
      }
    };
    loadData();
  }, [previewData]);

  if (!isVisible) return null;

  return (
    <section id="pricing" className="py-24 px-4 bg-muted/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          {pricing.badge && (
            <div className="inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wider uppercase mb-6 bg-primary/10 text-primary border-transparent">
              {pricing.badge}
            </div>
          )}
          <h2 className="text-3xl md:text-5xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: formatTextGradients(pricing.title) }} />
          <p className="text-xl text-muted-foreground">{pricing.originalPrice}</p>
        </motion.div>

        <div className={`grid grid-cols-1 gap-8 mx-auto ${
          pricing.packages?.length >= 3 
            ? "lg:grid-cols-3 max-w-7xl" 
            : pricing.packages?.length === 2 
              ? "md:grid-cols-2 max-w-4xl" 
              : "max-w-md"
        }`}>
          {pricing.packages?.map((pkg: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative group h-full"
            >
              {/* Khung viền dải sáng Gradient chạy vòng tròn */}
              {(pkg.isRecommended || pkg.badgeText) && (
                <div className="absolute -inset-[3px] rounded-[26px] overflow-hidden pointer-events-none z-0">
                  <div 
                    className="absolute inset-[-100%] animate-border-spin opacity-100"
                    style={{ 
                      background: `conic-gradient(from 0deg, 
                        transparent 0%, 
                        transparent 35%, 
                        ${pkg.badgeColor || "#1978DC"} 45%, 
                        #ffffff 50%, 
                        ${pkg.badgeColor || "#1978DC"} 55%, 
                        transparent 65%, 
                        transparent 100%)` 
                    }}
                  />
                </div>
              )}

              {/* Nhãn (Badge) - Đặt ở z-index cao nhất */}
              {(pkg.isRecommended || pkg.badgeText) && (
                <div 
                  className="absolute top-0 right-6 transform -translate-y-1/2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest text-white shadow-xl z-50 ring-2 ring-background"
                  style={{ backgroundColor: pkg.badgeColor || (pkg.isRecommended ? "#1978DC" : "#6B7280") }}
                >
                  {pkg.badgeText || "Khuyến Nghị"}
                </div>
              )}

              {/* Nội dung chính của gói */}
              <div 
                className={`relative flex flex-col h-full rounded-[22px] bg-card p-8 transition-all duration-500 z-10 ${
                  (pkg.isRecommended || pkg.badgeText) 
                    ? "shadow-[0_20px_50px_rgba(0,0,0,0.2)]" 
                    : "border-2 border-border shadow-sm hover:border-primary/30"
                }`}
                style={ (pkg.isRecommended || pkg.badgeText) ? {
                  borderColor: 'transparent'
                } : {}}
              >
                {/* Hiệu ứng Glow khi hover */}
                <div 
                  className="absolute -inset-2 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-3xl z-[-1] pointer-events-none"
                  style={{ backgroundColor: pkg.badgeColor || "#1978DC" }}
                />

                <div className="mb-6 flex-1">
                  <h3 className="text-2xl font-bold mb-3 tracking-tight" dangerouslySetInnerHTML={{ __html: formatTextGradients(pkg.name) }} />
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-5xl font-black tracking-tighter" dangerouslySetInnerHTML={{ __html: formatTextGradients(pkg.price) }} />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: formatTextGradients(pkg.description) }} />
                </div>

                <hr className="my-6 border-border/60" />
                
                <motion.ul 
                  className="space-y-4 mb-10 flex-1"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.15,
                        delayChildren: 0.4
                      }
                    }
                  }}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  {pkg.features?.map((step: string, idx: number) => (
                    <motion.li 
                      key={idx}
                      variants={{
                        hidden: { opacity: 0, x: -20, filter: 'blur(5px)' },
                        show: { opacity: 1, x: 0, filter: 'blur(0px)' }
                      }}
                      className="flex items-start gap-3 group/item cursor-default"
                    >
                      <div 
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 group-hover/item:scale-125 group-hover/item:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                        style={{ backgroundColor: (pkg.isRecommended || pkg.badgeText) ? `${pkg.badgeColor || "#1978DC"}30` : 'rgba(255,255,255,0.05)' }}
                      >
                        <Check 
                          className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-500 group-hover/item:rotate-[360deg] ${(pkg.isRecommended || pkg.badgeText) ? '' : 'text-muted-foreground'}`} 
                          style={{ color: (pkg.isRecommended || pkg.badgeText) ? (pkg.badgeColor || "#1978DC") : undefined }}
                        />
                      </div>
                      <span className="text-sm md:text-[15px] font-medium leading-snug transition-colors duration-300 group-hover/item:text-foreground" dangerouslySetInnerHTML={{ __html: formatTextGradients(step) }} />
                    </motion.li>
                  ))}
                </motion.ul>

                <div className="space-y-3">
                  <a
                    href={pkg.buttonHref || pricing.buttonHref || "#pricing"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full flex items-center justify-center h-14 rounded-2xl font-black text-[16px] uppercase tracking-wider transition-all duration-500 relative overflow-hidden group shadow-md ${
                      (pkg.isRecommended || pkg.badgeText)
                        ? "text-white hover:shadow-xl hover:-translate-y-0.5" 
                        : "bg-primary/10 text-primary hover:bg-primary/20"
                    }`}
                    style={ (pkg.isRecommended || pkg.badgeText) ? { 
                      background: `linear-gradient(135deg, ${pkg.badgeColor || "#1978DC"} 0%, ${pkg.badgeColor ? pkg.badgeColor + 'DD' : "#145DAA"} 100%)`
                    } : {}}
                  >
                    <span className="relative z-10">{pkg.buttonText || "Đăng ký ngay"}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
