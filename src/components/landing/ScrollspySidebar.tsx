import { useEffect, useState } from "react";
import { landingData } from "@/data/landingContent";

export default function ScrollspySidebar() {
  const { pageSections } = landingData;
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    if (!pageSections) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let currentActive = "";
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            currentActive = entry.target.id;
          }
        });
        
        if (currentActive) {
          setActiveSection(currentActive);
        }
      },
      {
        rootMargin: "-10% 0px -50% 0px",
        threshold: 0.05,
      }
    );

    // Sử dụng setTimeout ngắn để đảm bảo tất cả React DOM ids đã được gắn xuống Document
    const timeout = setTimeout(() => {
      pageSections.forEach((section) => {
        const el = document.getElementById(section.id);
        if (el) observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [pageSections]);

  if (!pageSections) return null;

  // Tìm index của mục đang active
  const activeIndex = pageSections.findIndex((s) => s.id === activeSection);
  const fillPercentage = activeIndex >= 0 ? ((activeIndex + 1) / pageSections.length) * 100 : 0;

  return (
    <div className="hidden xl:flex fixed left-8 top-1/2 -translate-y-1/2 z-40 bg-background/95 backdrop-blur-md rounded-2xl border shadow-lg py-6 px-4 w-[260px] flex-col">
      <div className="relative pl-4 border-l-2 border-muted">
        {/* Thanh tiến độ dọc bằng màu đỏ (Kéo dài đến item đang active) */}
        <div
          className="absolute top-[-1px] left-[-2px] w-[2px] bg-primary transition-all duration-500 ease-out"
          style={{ height: `${fillPercentage}%` }}
        />

        <div className="flex flex-col w-full gap-0.5">
          {pageSections.map((section, index) => {
            const isActive = activeSection === section.id;
            const numStr = String(index + 1).padStart(2, "0");

            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`group flex items-center gap-3 py-2 px-3 transition-colors duration-300 ${
                  isActive
                    ? "bg-primary/5 border-r-[3px] border-primary rounded-l-md"
                    : "hover:bg-muted/50 rounded-md"
                }`}
              >
                <span
                  className={`font-mono text-sm font-semibold transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground/60 group-hover:text-primary/70"
                  }`}
                >
                  {numStr}
                </span>
                <span
                  className={`text-[15px] tracking-wide transition-colors ${
                    isActive
                      ? "text-primary font-bold"
                      : "text-muted-foreground font-bold group-hover:text-foreground"
                  }`}
                >
                  {section.title}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
