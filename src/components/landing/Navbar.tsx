import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { getSectionData } from "@/lib/api";
import { landingData } from "@/data/landingContent";
import Switch from "@/components/ui/sky-toggle";

const Navbar = ({ data }: { data?: any }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [activeSection, setActiveSection] = useState("");
  const [headerData, setHeaderData] = useState(data || landingData.header);

  useEffect(() => {
    if (data) {
      setHeaderData({ ...landingData.header, ...data });
    } else {
      const loadData = async () => {
        const dbData = await getSectionData("header");
        if (dbData && dbData.published_content) {
          setHeaderData({ ...landingData.header, ...dbData.published_content });
        }
      };
      loadData();
    }
  }, [data]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
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
      { rootMargin: "-10% 0px -50% 0px", threshold: 0.05 }
    );

    const timeout = setTimeout(() => {
      landingData.pageSections?.forEach((section) => {
        const el = document.getElementById(section.id);
        if (el) observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    // Basic theme toggle using class
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/90 backdrop-blur-md shadow-sm border-b" : "bg-transparent border-transparent"
      }`}
    >
      <div className="w-full px-4 lg:px-8 xl:px-12 flex items-center justify-between h-16">
        {/* Logo - Left */}
        <div className="flex shrink-0 justify-start">
          <a href="#" className="flex items-center gap-3">
            {headerData.logoImage ? (
              <img src={headerData.logoImage} alt="Logo" className="max-h-12 object-contain" />
            ) : (
              <div className="logo-3d w-10 h-10"><div className="logo-3d-face text-sm">H</div></div>
            )}
            <span className="text-[16px] sm:text-[18px] font-extrabold tracking-tight text-foreground whitespace-nowrap ml-1">
               {headerData.logo || "DSCons"}
            </span>
          </a>
        </div>

        {/* Desktop Nav - Center */}
        <div className="hidden lg:flex flex-1 items-center justify-center gap-6 xl:gap-10 whitespace-nowrap mx-4 xl:mx-8 overflow-x-auto no-scrollbar">
          {(headerData.navLinks || []).map((link, idx) => {
            const sectionId = (link.href || "").replace("#", "");
            const isActive = activeSection === sectionId;
            return (
              <a
                key={idx}
                href={link.href || "#"}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`text-[14px] xl:text-[15px] font-bold transition-colors shrink-0 ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </div>

        {/* CTA - Right */}
        <div className="flex shrink-0 justify-end items-center gap-3 xl:gap-4">
          <div className="mr-1 sm:mr-2">
            <Switch checked={isDark} onChange={() => setIsDark(!isDark)} />
          </div>
          <a
            href={headerData.ctaHref || "#pricing"}
            onClick={(e) => {
              const href = headerData.ctaHref || "#pricing";
              if (href.startsWith('#')) {
                e.preventDefault();
                document.getElementById(href.substring(1))?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="hidden sm:inline-flex px-4 xl:px-5 py-2 text-white text-[13px] xl:text-[14px] font-semibold rounded-lg bg-gradient-to-b from-[#33AAEF] to-[#1978DC] shadow-btn-pro hover:shadow-btn-pro-hover active:from-[#1978DC] active:to-[#145DAA] transition-all duration-200 whitespace-nowrap"
          >
            {headerData.cta}
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
