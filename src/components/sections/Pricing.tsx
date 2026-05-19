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
          {pricing.packages?.map((pkg: any, index: number) => {
            const isMiddle = index === 1;
            const pkgColor = pkg.badgeColor || (index === 0 ? "#059669" : isMiddle ? "#1978DC" : "#DC2626");
            const badgeText = pkg.badgeText || (isMiddle ? "Khuyến Nghị" : null);
            
            return (
            <div 
              key={index} 
              className={`relative h-full transition-all duration-500 ${
                isMiddle 
                  ? 'lg:scale-[1.12] lg:-translate-y-4 z-30' 
                  : 'lg:scale-95 z-10 hover:z-20 hover:scale-100'
              }`}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -8 }}
                className="relative group h-full"
              >
              {/* Khung viền và Card chính */}
              <div 
                className={`relative h-full w-full rounded-[26px] p-[2px] ${isMiddle ? 'shadow-[0_20px_60px_rgba(0,0,0,0.3)]' : 'shadow-lg hover:shadow-xl'}`}
              >
                {/* Lớp viền nền */}
                <div className="absolute inset-0 rounded-[26px] overflow-hidden z-0">
                  {isMiddle ? (
                    /* Viền xoay kép siêu tốc cho gói giữa */
                    <div 
                      className="absolute inset-[-100%] animate-[spin_3s_linear_infinite]"
                      style={{ 
                        background: `conic-gradient(from 0deg, transparent 0%, transparent 35%, ${pkgColor} 45%, #ffffff 50%, transparent 50%, transparent 85%, ${pkgColor} 95%, #ffffff 100%)` 
                      }}
                    />
                  ) : (
                    /* Viền Gradient tỏa sáng nhịp thở cho gói hai bên */
                    <div 
                      className="absolute inset-0 animate-pulse"
                      style={{ 
                        background: `linear-gradient(135deg, ${pkgColor}, ${pkgColor}50, ${pkgColor})`,
                        opacity: 0.9
                      }}
                    />
                  )}
                </div>

                {/* Nội dung chính của gói (Inner Card) - Bắt buộc dùng bg-card đặc (không trong suốt) để che ánh sáng bên trong */}
                <div 
                  className="relative flex flex-col h-full rounded-[24px] p-8 z-10 bg-card"
                >
                  {/* Nhãn (Badge) - Thụt hẳn vào bên trong góc phải */}
                  {badgeText && (
                    <div 
                      className="absolute top-5 right-5 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest text-white shadow-lg z-50"
                      style={{ backgroundColor: pkgColor }}
                    >
                      {badgeText}
                    </div>
                  )}

                  {/* Hiệu ứng Glow thường trực chìm dưới nền (Chỉ Gói Giữa) */}
                  <div 
                    className={`absolute -inset-4 transition-opacity duration-500 blur-[50px] z-[-1] pointer-events-none ${
                      isMiddle ? 'opacity-20' : 'opacity-0 group-hover:opacity-10'
                    }`}
                    style={{ backgroundColor: pkgColor }}
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
                        style={{ backgroundColor: `${pkgColor}30` }}
                      >
                        <Check 
                          className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-500 group-hover/item:rotate-[360deg]" 
                          style={{ color: pkgColor }}
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
                      className="w-full flex items-center justify-center h-14 rounded-2xl font-black text-[16px] uppercase tracking-wider transition-all duration-500 relative overflow-hidden group shadow-md text-white hover:shadow-xl hover:-translate-y-0.5"
                      style={{ 
                        background: `linear-gradient(135deg, ${pkgColor} 0%, ${pkgColor}DD 100%)`
                      }}
                    >
                      <span className="relative z-10">{pkg.buttonText || "Đăng ký ngay"}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    </a>
                  </div>
                </div>
              </div>
              </motion.div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
