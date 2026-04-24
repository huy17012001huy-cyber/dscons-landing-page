import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Gift, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { collectLead } from "@/lib/api";
import { toast } from "sonner";

interface ExitPopupProps {
  config: {
    enabled: boolean;
    title: string;
    description: string;
    buttonText: string;
    showEmailField: boolean;
    buttonLink?: string;
    footerText?: string;
  };
}

export const ExitPopup = ({ config }: ExitPopupProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!config.enabled || hasShown) return;

    // Theo dõi thời gian vào trang
    const pageEntryTime = Date.now();

    const checkConditions = () => {
      const timeOnPage = (Date.now() - pageEntryTime) / 1000;
      const scrollY = window.scrollY;
      
      // ĐIỀU KIỆN CẦN: Đã ở trên trang > 60s VÀ đã cuộn xuống > 1500px
      return timeOnPage > 60 && scrollY > 1500;
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && checkConditions()) {
        setIsVisible(true);
        setHasShown(true);
      }
    };

    // Mobile/Desktop scroll up detection
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (hasShown) return;
      
      const currentScrollY = window.scrollY;
      const scrollDiff = lastScrollY - currentScrollY;

      // Nếu cuộn ngược lên > 200px (thao tác tìm nút thoát hoặc menu) và thỏa mãn điều kiện
      if (scrollDiff > 200 && checkConditions()) {
        setIsVisible(true);
        setHasShown(true);
      }
      lastScrollY = currentScrollY;
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [config.enabled, hasShown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (config.showEmailField) {
      if (!email) {
        toast.error("Vui lòng nhập email của bạn");
        return;
      }

      setIsSubmitting(true);
      try {
        await collectLead(email);
        toast.success("Cảm ơn bạn đã quan tâm! Chúng tôi sẽ gửi tài liệu sớm nhất.");
        setIsVisible(false);
      } catch (error) {
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
      } finally {
        setIsSubmitting(false);
      }
    } else if (config.buttonLink) {
      window.open(config.buttonLink, "_blank");
      setIsVisible(false);
    } else {
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          className="relative w-full max-w-lg bg-card border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] rounded-[2.5rem] overflow-hidden p-8 sm:p-12 text-center isolate"
        >
          {/* Decorative background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 blur-[100px] -z-10" />

          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-6 top-6 p-2 rounded-full hover:bg-muted transition-colors z-10 opacity-50 hover:opacity-100"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon Header */}
          <div className="relative w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 group">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-30" />
            <Gift className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
          </div>

          {/* Content */}
          <h3 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight leading-tight">
            {config.title}
          </h3>
          <p className="text-muted-foreground text-lg mb-10 leading-relaxed px-4">
            {config.description}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
            {config.showEmailField && (
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="Nhập email của bạn..."
                  className="w-full h-14 pl-12 pr-4 rounded-2xl border bg-background/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-lg font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 rounded-2xl text-xl font-bold shadow-2xl shadow-primary/30 bg-primary text-primary-foreground group overflow-hidden relative"
            >
              <span className="relative z-10 flex items-center justify-center">
                {isSubmitting ? "Đang gửi..." : config.buttonText}
                <Send className="ml-2 w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-10 pt-10 border-t border-dashed">
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] opacity-50 font-black">
              {config.footerText || "DSCons Global Academy — Revit MEP Thực Chiến"}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
