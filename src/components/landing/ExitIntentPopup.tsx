import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, Send } from "lucide-react";
import { usePageContext } from "@/contexts/PageContext";
import { getSectionData } from "@/lib/api";

export default function ExitIntentPopup() {
  const { pageId } = usePageContext();
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [hasReachedBottom, setHasReachedBottom] = useState(false);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    const loadConfig = async () => {
      const data = await getSectionData("settings", pageId);
      if (data && data.published_content?.exit_popup) {
        setConfig(data.published_content.exit_popup);
      }
    };
    loadConfig();
  }, [pageId]);

  useEffect(() => {
    if (!config || !config.enabled || hasTriggered) return;

  useEffect(() => {
    if (!config || !config.enabled || hasTriggered) return;

    // Theo dõi thời gian vào trang
    const pageEntryTime = Date.now();

    const checkConditions = () => {
      const timeOnPage = (Date.now() - pageEntryTime) / 1000;
      const scrollY = window.scrollY;
      
      // ĐIỀU KIỆN CẦN: Đã ở trên trang > 15s VÀ đã cuộn xuống > 1500px
      return timeOnPage > 15 && scrollY > 1500;
    };

    // 1. Phát hiện ý định thoát (Mouse Leave)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && checkConditions() && !hasTriggered) {
        setIsVisible(true);
        setHasTriggered(true);
      }
    };

    // 2. Phát hiện cuộn ngược lên nhanh (Scroll Up)
    let lastScrollY = window.scrollY;
    const handleScrollIntent = () => {
      const currentScrollY = window.scrollY;
      const scrollDiff = lastScrollY - currentScrollY;
      
      // Nếu cuộn ngược lên > 250px và thỏa mãn điều kiện thời gian/chiều sâu
      if (scrollDiff > 250 && checkConditions() && !hasTriggered) {
        setIsVisible(true);
        setHasTriggered(true);
      }
      lastScrollY = currentScrollY;
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScrollIntent, { passive: true });

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScrollIntent);
    };
  }, [config, hasTriggered]);

  if (!config || !config.enabled) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-lg overflow-hidden border shadow-2xl bg-card rounded-[2.5rem] border-primary/20"
          >
            <button
              onClick={() => setIsVisible(false)}
              className="absolute z-10 p-2 rounded-full top-6 right-6 text-muted-foreground hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 text-center sm:p-12">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-8 rounded-3xl bg-primary/10 rotate-6">
                <MessageSquare className="w-10 h-10 text-primary -rotate-6" />
              </div>
              
              <h2 className="mb-4 text-2xl font-black tracking-tight text-foreground sm:text-3xl uppercase italic">
                {config.title || "Bạn còn thắc mắc?"}
              </h2>
              
              <p className="mb-10 text-[#a1a1aa] leading-relaxed font-medium">
                {config.description || "Đừng rời đi nếu bạn vẫn chưa rõ về lộ trình. Hãy để lại thông tin hoặc kết nối trực tiếp để được hỗ trợ 1-1 ngay nhé!"}
              </p>

              {config.showEmailField ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    // Gửi email logic here
                    alert("Cảm ơn bạn! Chúng tôi sẽ liên hệ sớm nhất.");
                    setIsVisible(false);
                  }}
                  className="flex flex-col gap-4"
                >
                  <input
                    type="email"
                    required
                    placeholder="Nhập email để nhận tư vấn..."
                    className="flex h-14 w-full rounded-2xl border border-input bg-background px-5 text-base focus-visible:ring-2 focus-visible:ring-primary/50 transition-all outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-8 font-black transition-all border border-transparent rounded-2xl h-14 text-white bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20"
                  >
                    <Send className="w-5 h-5" />
                    Gửi Ngay Cho Tôi
                  </button>
                </form>
              ) : (
                <a
                  href={config.buttonLink || "#"}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setIsVisible(false)}
                  className="inline-flex items-center justify-center gap-2 px-10 font-black transition-all border border-transparent rounded-2xl h-16 text-white bg-gradient-to-r from-[#1978DC] to-[#33AAEF] hover:shadow-2xl hover:shadow-primary/30 w-full text-lg uppercase tracking-wider"
                >
                  <MessageSquare className="w-6 h-6" />
                  Kết nối tư vấn ngay
                </a>
              )}
              
              <p className="text-[11px] font-bold tracking-widest text-muted-foreground/50 mt-8 uppercase">
                {config.footerText || "DSCons Global Academy - Đồng hành cùng sự nghiệp của bạn"}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
