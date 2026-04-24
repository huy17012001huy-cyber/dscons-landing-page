import { useEffect, useState, lazy, Suspense } from "react";
import HeroSection from "@/components/sections/HeroSection";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ScrollspySidebar from "@/components/landing/ScrollspySidebar";
import ReadingProgress from "@/components/landing/ReadingProgress";
import { ExitPopup } from "@/components/landing/ExitPopup";
import AnoAI from "@/components/ui/animated-shader-background";
import LightGlowBackground from "@/components/ui/light-glow-background";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useParams, useNavigate } from "react-router-dom";
import { getSectionData, recordPageView, getLandingPageBySlug } from "@/lib/api";
import { AnimatePresence } from "framer-motion";
import { PageProvider } from "@/contexts/PageContext";

// Lazy load non-critical sections
const PainPoints = lazy(() => import("@/components/sections/PainPoints"));
const Solution = lazy(() => import("@/components/sections/Solution"));
const Curriculum = lazy(() => import("@/components/sections/Curriculum"));
const Bonus = lazy(() => import("@/components/sections/Bonus"));
const Outcomes = lazy(() => import("@/components/sections/Outcomes"));
const Instructor = lazy(() => import("@/components/sections/Instructor"));
const Testimonials = lazy(() => import("@/components/sections/Testimonials"));
const Pricing = lazy(() => import("@/components/sections/Pricing"));
const FAQ = lazy(() => import("@/components/sections/FAQ"));
const BottomCTA = lazy(() => import("@/components/sections/BottomCTA"));

const SectionSkeleton = () => <div className="w-full h-[400px] bg-muted/5 animate-pulse" />;

const Index = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageId, setPageId] = useState<string>("11111111-1111-1111-1111-111111111111");

  useEffect(() => {
    const init = async () => {
      recordPageView(window.location.pathname);
      
      try {
        let currentPageId = "11111111-1111-1111-1111-111111111111";
        const currentSlug = slug || "default";

        const pageData = await getLandingPageBySlug(currentSlug);
        
        if (!pageData) {
          if (slug) {
            navigate("/");
            return;
          }
        } else {
          currentPageId = pageData.id;
          setPageId(currentPageId);
          
          if (pageData.seo_title) document.title = pageData.seo_title;
          if (pageData.favicon_url) {
            let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.head.appendChild(link);
            }
            link.href = pageData.favicon_url;
          }
        }

        const settingsData = await getSectionData("settings", currentPageId);
        const content = settingsData?.published_content || settingsData?.draft_content;
        
        if (content) {
          setSettings(content);
          if (!pageData?.seo_title && content.site_title) document.title = content.site_title;
          if (!pageData?.favicon_url && content.favicon) {
            let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.head.appendChild(link);
            }
            link.href = content.favicon;
          }
        }
      } catch (error) {
        console.error("Error initializing app:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 800);
      }
    };
    init();
  }, [slug, navigate]);

  return (
    <PageProvider pageId={pageId}>
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 relative overflow-x-hidden">
        <AnimatePresence>
          {isLoading && <LoadingScreen />}
        </AnimatePresence>
      
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="block dark:hidden w-full h-full"><LightGlowBackground /></div>
          <div className="hidden dark:block w-full h-full"><AnoAI /></div>
        </div>

        <div className="relative z-10 w-full">
          {settings?.exit_popup && <ExitPopup config={settings.exit_popup} />}
          <ReadingProgress />
          <Navbar />
          <ScrollspySidebar />
          
          <main className="w-full">
            <div id="hero"><HeroSection /></div>
            
            <Suspense fallback={<SectionSkeleton />}>
              <div id="pain-points"><PainPoints /></div>
              <div id="solution"><Solution /></div>
              <Curriculum />
              <Bonus />
              <Outcomes />
              <Instructor />
              <div id="testimonials"><Testimonials /></div>
              <Pricing />
              <FAQ />
              <BottomCTA />
            </Suspense>
          </main>
          
          <Footer data={settings} />
        </div>
      </div>
    </PageProvider>
  );
};

export default Index;
