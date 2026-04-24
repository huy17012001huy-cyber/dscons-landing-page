import HeroPreview from "@/components/sections/HeroSection";
import PainPointsPreview from "@/components/sections/PainPoints";
import SolutionPreview from "@/components/sections/Solution";
import CurriculumPreview from "@/components/sections/Curriculum";
import BonusPreview from "@/components/sections/Bonus";
import InstructorPreview from "@/components/sections/Instructor";
import PricingPreview from "@/components/sections/Pricing";
import FAQPreview from "@/components/sections/FAQ";
import ComparisonPreview from "@/components/landing/CourseComparison";
import NavbarPreview from "@/components/landing/Navbar";
import OutcomesPreview from "@/components/sections/Outcomes";
import TestimonialsPreview from "@/components/sections/Testimonials";
import BottomCTAPreview from "@/components/sections/BottomCTA";
import Footer from "@/components/landing/Footer";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  LogOut, LayoutDashboard, Type, ImageIcon, List, Settings, Save, UploadCloud, 
  EyeOff, Loader2, Eye, X, Gift, Key, Globe, LayoutTemplate, AlertCircle, 
  CheckCircle2, Check, RotateCcw, Map, Trophy, Users, MessageSquare, CreditCard, HelpCircle, 
  Scale, MousePointerClick, Palette, Bot, ChevronDown, ChevronUp, Video, Trash2, Tag, Download, Calendar
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { getLandingPages, getSectionData, saveDraft, publishSection, getCompetitorQueries, toggleVisibility, SectionData, getPageStats } from "@/lib/api";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { formatTextGradients } from "@/lib/utils";
import { landingData } from "@/data/landingContent";
import { IconSelector } from "@/components/admin/IconSelector";
import { LandingPageManager } from "@/components/admin/LandingPageManager";
import { AccountManager } from "@/components/admin/AccountManager";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Switch from "@/components/ui/sky-toggle";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const { signOut, user } = useAuth();
  const [activeSection, setActiveSection] = useState("header");
  const [activePageId, setActivePageId] = useState("11111111-1111-1111-1111-111111111111");
  const [pages, setPages] = useState<any[]>([]);
  const [isPageSwitcherOpen, setIsPageSwitcherOpen] = useState(false);
  const [sectionData, setSectionData] = useState<SectionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [competitorQueries, setCompetitorQueries] = useState<any[]>([]);
  const [isDark, setIsDark] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [historyDateFilter, setHistoryDateFilter] = useState("");

  const filteredQueries = historyDateFilter 
    ? competitorQueries.filter(q => {
        const d = new Date(q.created_at);
        const localDateStr = d.toLocaleDateString('en-CA');
        return localDateStr === historyDateFilter;
      })
    : competitorQueries;

  const handleExportHistory = () => {
    const dataToExport = filteredQueries.map((q, idx) => ({
      "STT": idx + 1,
      "Thời gian": new Date(q.created_at).toLocaleString('vi-VN'),
      "Nhu cầu": q.student_need || q.query || "Không nhập nhu cầu",
      "Dữ liệu đối chiếu": q.competitor_data ? JSON.stringify(q.competitor_data) : ""
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LichSuTraCuu");
    
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, "LichSuTraCuu.xlsx");
  };

  const sections = [
    { id: "header", name: "Giới thiệu (Header)", icon: <LayoutTemplate className="w-4 h-4" /> },
    { id: "pain-points", name: "Vấn đề (PainPoints)", icon: <AlertCircle className="w-4 h-4" /> },
    { id: "benefits", name: "Giải pháp (Solution)", icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: "curriculum", name: "Lộ trình học", icon: <Map className="w-4 h-4" /> },
    { id: "bonus", name: "Quà tặng (Bonus)", icon: <Gift className="w-4 h-4" /> },
    { id: "social", name: "Kết quả (Outcomes)", icon: <Trophy className="w-4 h-4" /> },
    { id: "instructor", name: "Giảng viên", icon: <Users className="w-4 h-4" /> },
    { id: "testimonials", name: "Testimonials", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "pricing", name: "Học phí (Pricing)", icon: <CreditCard className="w-4 h-4" /> },
    { id: "faq", name: "FAQ", icon: <HelpCircle className="w-4 h-4" /> },
    { id: "comparison", name: "Bảng So Sánh", icon: <Scale className="w-4 h-4" /> },
    { id: "cta", name: "Bottom CTA", icon: <MousePointerClick className="w-4 h-4" /> },
    { id: "system-settings", name: "Cài đặt giao diện", icon: <Palette className="w-4 h-4" /> },
  ];

  // Form states
  const [headerForm, setHeaderForm] = useState(landingData.header);
  const [painPointsForm, setPainPointsForm] = useState(landingData.painPoints);
  const [bonusForm, setBonusForm] = useState((landingData as any).bonus || { title: "Đừng bỏ lỡ cơ hội thăng tiến!", features: [] });
  const [instructorForm, setInstructorForm] = useState(landingData.instructor);
  const [pricingForm, setPricingForm] = useState(landingData.pricing);
  const [heroForm, setHeroForm] = useState(landingData.hero);
  const [ctaForm, setCtaForm] = useState(landingData.bottomCta);
  const [comparisonForm, setComparisonForm] = useState({
    title: "Đừng bỏ lỡ cơ hội thăng tiến!",
    description: "Để lại email để nhận ngay bộ tài liệu Revit MEP Miễn phí và ưu đãi đặc biệt.",
    categories: []
  });
  const [comparisonActiveTab, setComparisonActiveTab] = useState<"config" | "history">("config");
  const [faqForm, setFaqForm] = useState(landingData.faq);
  const [testimonialsForm, setTestimonialsForm] = useState(landingData.testimonials);
  const [benefitsForm, setBenefitsForm] = useState(landingData.solution);
  const [socialForm, setSocialForm] = useState(landingData.outcomes);
  const [curriculumForm, setCurriculumForm] = useState(landingData.curriculum);

  const [settingsForm, setSettingsForm] = useState({
    api_key: "",
    webhook_url: "",
    exit_popup: {
      enabled: true,
      title: "Đừng bỏ lỡ cơ hội thăng tiến!",
      description: "Để lại email để nhận ngay bộ tài liệu Revit MEP Miễn phí và ưu đãi đặc biệt.",
      buttonText: "Nhận tài liệu ngay",
      showEmailField: true,
      buttonLink: "",
      footerText: "DSCons Global Academy — Revit MEP Thực Chiến"
    },
    site_title: "",
    favicon: "",
    tracking: { heatmap_url: "" },
    admin: { email: user?.email || "", role: "Admin" }
  });

  useEffect(() => {
    if (settingsForm.site_title) {
      document.title = `${settingsForm.site_title} | Admin`;
    }
    if (settingsForm.favicon) {
      let link = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = settingsForm.favicon;
    }
  }, [settingsForm.site_title, settingsForm.favicon]);

  const [pageStats, setPageStats] = useState<any[]>([]);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const data = await getLandingPages();
        setPages(data);
      } catch (err) {
        console.error("Error fetching pages:", err);
      }
    };
    fetchPages();
  }, []);

  useEffect(() => {
    const fetchSection = async () => {
      setIsLoading(true);
      if (activeSection === "header") {
        const [hData, hrData] = await Promise.all([
          getSectionData("header", activePageId),
          getSectionData("hero", activePageId)
        ]);
        if (hData?.draft_content) setHeaderForm(prev => ({ ...prev, ...hData.draft_content }));
        if (hrData?.draft_content) setHeroForm(prev => ({ ...prev, ...hrData.draft_content }));
      } else if (activeSection === "settings" || activeSection === "system-settings") {
        const [sData, stats] = await Promise.all([
          getSectionData("settings", activePageId),
          getPageStats()
        ]);
        if (sData?.draft_content) setSettingsForm(prev => ({ ...prev, ...sData.draft_content }));
        if (stats) setPageStats(stats);
      } else {
        const data = await getSectionData(activeSection, activePageId);
        if (data) {
          setSectionData(data);
          if (activeSection === "pain-points" && data.draft_content) setPainPointsForm(prev => ({ ...prev, ...data.draft_content }));
          if (activeSection === "bonus" && data.draft_content) {
            const content = { ...data.draft_content };
            if (content.items && !content.features) content.features = content.items;
            setBonusForm(prev => ({ ...prev, ...content }));
          }
          if (activeSection === "instructor" && data.draft_content) setInstructorForm(prev => ({ ...prev, ...data.draft_content }));
          if (activeSection === "pricing" && data.draft_content) setPricingForm(prev => ({ ...prev, ...data.draft_content }));
          if (activeSection === "cta" && data.draft_content) setCtaForm(prev => ({ ...prev, ...data.draft_content }));
          if (activeSection === "comparison") {
            try {
              const queries = await getCompetitorQueries();
              setCompetitorQueries(queries || []);
              if (data.draft_content) {
                const content = { ...data.draft_content };
                if (!content.categories && content.criteria) {
                  content.categories = [{ 
                    name: "DỮ LIỆU CŨ", 
                    items: (Array.isArray(content.criteria) ? content.criteria : []).map((c: any) => ({
                      label: c.name || "Tiêu chí",
                      dscons: c.dscons ? "Có" : "Không",
                      highlight: false
                    }))
                  }];
                }
                setComparisonForm(prev => ({ ...prev, ...content }));
              }
            } catch (err) {
              console.error("Error loading comparison data:", err);
            }
          }
          if (activeSection === "faq" && data.draft_content) setFaqForm(prev => ({ ...prev, ...data.draft_content }));
          if (activeSection === "testimonials" && data.draft_content) {
            setTestimonialsForm(prev => ({ 
              ...prev, 
              textItems: [],
              videoItems: [],
              partnersRow3: [], 
              ...data.draft_content 
            }));
          }
          if (activeSection === "benefits" && data.draft_content) setBenefitsForm(prev => ({ ...prev, ...data.draft_content }));
          if (activeSection === "social" && data.draft_content) setSocialForm(prev => ({ ...prev, ...data.draft_content }));
          if (activeSection === "curriculum" && data.draft_content) setCurriculumForm(prev => ({ ...prev, ...data.draft_content }));
        }
      }
      setIsLoading(false);
    };
    fetchSection();
  }, [activeSection, activePageId]);

  useEffect(() => {
    // Basic theme toggle using class
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const syncComparisonData = () => {
    // 1. Calculate lesson count
    const totalLessons = curriculumForm.modules.reduce((acc: number, mod: any) => acc + (mod.lessons?.length || 0), 0);
    
    // 2. Get main price
    const mainPackage = pricingForm.packages.find((p: any) => p.isRecommended) || pricingForm.packages[0];
    const totalPrice = mainPackage?.price || "3.900.000đ";
    
    // 3. Get bonus items
    const bonusItems = (bonusForm.features || []).map((f: any) => ({
      label: f.cmd || f.title || "Quà tặng",
      dscons: f.desc || "Có",
      highlight: false
    }));

    // 4. Create categories
    const newCategories = [
      {
        name: "🎓 THÔNG TIN KHÓA HỌC",
        items: [
          { label: "Số lượng buổi học", dscons: `${totalLessons} buổi`, highlight: false },
          { label: "Học phí", dscons: totalPrice, highlight: true },
          { label: "Hình thức học", dscons: "Online qua Zoom hoặc Offline trung tâm tại Hà Nội", highlight: false },
          { label: "Học lại", dscons: "1 lần học lại miễn phí", highlight: false },
        ]
      },
      {
        name: "🎁 QUÀ TẶNG VÀ ƯU ĐÃI",
        items: bonusItems
      },
      {
        name: "🏅 HÌNH THỨC HỌC & CHỨNG NHẬN",
        items: [
           { label: "CẤP CHỨNG NHẬN", dscons: "Có", highlight: false },
           { label: "BẢO LƯU KHÓA HỌC", dscons: "Có", highlight: false },
        ]
      }
    ];

    setComparisonForm({
      ...comparisonForm,
      categories: newCategories
    });
    toast.success("Đã đồng bộ dữ liệu từ các phần khác!");
  };

  const syncTestimonials = () => {
    setTestimonialsForm({
      ...testimonialsForm,
      badge: landingData.testimonials.badge,
      title: landingData.testimonials.title,
      textItems: landingData.testimonials.textItems,
      videoItems: landingData.testimonials.videoItems,
      partners: landingData.testimonials.partners,
      partnersRow2: landingData.testimonials.partnersRow2,
      partnersRow3: landingData.testimonials.partnersRow3,
    });
    toast.success("Đã đồng bộ đánh giá & đối tác từ dữ liệu mẫu!");
  };

    const handleSaveDraft = async () => {
    try {
      if (activeSection === "header") {
        await Promise.all([
          saveDraft("header", headerForm, activePageId),
          saveDraft("hero", heroForm, activePageId)
        ]);
        toast.success("Thao tác thành công!");
        return;
      }

      if (activeSection === "settings" || activeSection === "system-settings") {
        await saveDraft("settings", settingsForm, activePageId);
        toast.success("Thao tác thành công!");
        return;
      }

      let content = sectionData?.draft_content || {};
      if (activeSection === "pain-points") content = painPointsForm;
      if (activeSection === "bonus") content = bonusForm;
      if (activeSection === "instructor") content = instructorForm;
      if (activeSection === "pricing") content = pricingForm;
      if (activeSection === "cta") content = ctaForm;
      if (activeSection === "comparison") content = comparisonForm;
      if (activeSection === "faq") content = faqForm;
      if (activeSection === "testimonials") content = testimonialsForm;
      if (activeSection === "benefits") content = benefitsForm;
      if (activeSection === "curriculum") content = curriculumForm;
      if (activeSection === "social") content = socialForm;
      
      await saveDraft(activeSection, content, activePageId);
      toast.success("Đã lưu nháp bộ phận: " + activeSection);
    } catch(e) {
      console.error("Save draft error:", e);
      toast.error(e.message || "Đã xảy ra lỗi khi lưu nháp!");
    }
  };

  const handlePublish = async () => {
    try {
      if (activeSection === "header") {
        await Promise.all([
          publishSection("header", headerForm, true, activePageId),
          publishSection("hero", heroForm, true, activePageId)
        ]);
        toast.success("Thao tác thành công!");
        return;
      }

      if (activeSection === "settings" || activeSection === "system-settings") {
        await publishSection("settings", settingsForm, true, activePageId);
        toast.success("Thao tác thành công!");
        return;
      }

      let content = sectionData?.draft_content || {};
      if (activeSection === "pain-points") content = painPointsForm;
      if (activeSection === "bonus") content = bonusForm;
      if (activeSection === "instructor") content = instructorForm;
      if (activeSection === "pricing") content = pricingForm;
      if (activeSection === "cta") content = ctaForm;
      if (activeSection === "comparison") content = comparisonForm;
      if (activeSection === "faq") content = faqForm;
      if (activeSection === "testimonials") content = testimonialsForm;
      if (activeSection === "benefits") content = benefitsForm;
      if (activeSection === "curriculum") content = curriculumForm;
      if (activeSection === "social") content = socialForm;

      if (!content) {
        toast.error("Đã xảy ra lỗi!");
        return;
      }

      await publishSection(activeSection, content, sectionData?.is_visible ?? true, activePageId);
      toast.success("Thao tác thành công!");
    } catch(e) {
      console.error("Publish error:", e);
      toast.error(e.message || "Đã xảy ra lỗi khi xuất bản!");
    }
  };

  const handleToggleVisibility = async () => {
    if (!sectionData) return;
    try {
      const newViz = !sectionData.is_visible;
      await toggleVisibility(activeSection, newViz, activePageId);
      setSectionData({...sectionData, is_visible: newViz});
      toast.success(`Đã ${newViz ? 'hiển thị' : 'ẩn'} bộ phận này!`);
    } catch(e) {
      console.error("Visibility toggle error:", e);
      toast.error("Đã xảy ra lỗi!");
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col h-screen sticky top-0 shrink-0">
        <div className="relative px-4 py-4 border-b">
          <button 
            onClick={() => setIsPageSwitcherOpen(!isPageSwitcherOpen)}
            className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-200 group ${
              isPageSwitcherOpen ? "bg-primary/10 ring-1 ring-primary/20" : "hover:bg-muted/80"
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <img src={settingsForm.favicon || "/favicon.ico"} alt="DSCons" className="w-8 h-8 object-contain" />
            </div>
            <div className="flex-1 text-left overflow-hidden">
              <div className="flex items-center gap-1">
                <h1 className="text-sm font-bold text-foreground uppercase tracking-wider">DSCons CMS</h1>
                {isPageSwitcherOpen ? <ChevronUp className="w-3 h-3 text-muted-foreground/50" /> : <ChevronDown className="w-3 h-3 text-muted-foreground/50" />}
              </div>
              <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 max-w-full">
                <p className="text-[10px] font-bold text-primary truncate">
                  {pages.find(p => p.id === activePageId)?.title || "Trang mặc định"}
                </p>
              </div>
            </div>
          </button>

          <AnimatePresence>
            {isPageSwitcherOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-4 right-4 top-[calc(100%+8px)] bg-card border border-border/50 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
              >
                <div className="p-2 max-h-[320px] overflow-y-auto custom-scrollbar">
                  <div className="px-3 py-2 mb-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em]">Danh sách trang</p>
                  </div>
                  {pages.length === 0 ? (
                    <div className="flex flex-col items-center py-6 px-4">
                      <Loader2 className="w-6 h-6 text-primary animate-spin mb-2" />
                      <p className="text-xs text-muted-foreground">Đang tải dữ liệu...</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {pages.map(page => (
                        <button
                          key={page.id}
                          onClick={() => {
                            setActivePageId(page.id);
                            setIsPageSwitcherOpen(false);
                          }}
                          className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 group/item ${
                            activePageId === page.id 
                              ? "bg-primary/10 border border-primary/10" 
                              : "hover:bg-muted border border-transparent"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            activePageId === page.id ? "bg-primary text-primary-foreground" : "bg-muted group-hover/item:bg-card border border-border/50"
                          }`}>
                            <Globe className="w-4 h-4" />
                          </div>
                          <div className="flex-1 truncate">
                            <p className={`text-sm font-medium truncate ${activePageId === page.id ? "text-foreground" : "text-muted-foreground group-hover/item:text-foreground"}`}>
                              {page.title}
                            </p>
                            <p className="text-[10px] text-muted-foreground/60 truncate font-mono">
                              {page.slug === "/" ? "trang-chu" : page.slug}
                            </p>
                          </div>
                          {activePageId === page.id && (
                            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                              <CheckCircle2 className="w-3 h-3 text-primary" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-2 border-t border-border/50 bg-muted/30">
                   <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-xs h-9 gap-2 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                    onClick={() => {
                      setActiveSection("settings");
                      setIsPageSwitcherOpen(false);
                    }}
                   >
                     <Settings className="w-3.5 h-3.5" /> 
                     <span>Quản lý hệ thống trang</span>
                   </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Quản lý giao diện</p>
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  activeSection === sec.id 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {sec.icon}
                {sec.name}
              </button>
            ))}
          </div>

          <div className="mt-8 space-y-1">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Hệ thống</p>
            <button 
              onClick={() => setActiveSection("settings")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeSection === "settings" 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              <Settings className="w-4 h-4" />
              Cài đặt Landing Page
            </button>
          </div>
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {(user?.user_metadata?.full_name?.[0] || user?.email?.[0] || "A").toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.user_metadata?.full_name || "Admin"}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user?.email || "Chưa đăng nhập"}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={signOut} className="w-full justify-start mt-2 text-muted-foreground hover:bg-muted hover:text-foreground">
            <LogOut className="h-4 w-4 mr-2" /> Đăng xuất
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-8 border-b bg-background sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">
              {sections.find(s => s.id === activeSection)?.name}
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleToggleVisibility} className="gap-2 text-muted-foreground border-dashed">
              <EyeOff className="w-4 h-4" /> {sectionData?.is_visible === false ? "Đang Ẩn" : "Ẩn Section này"}
            </Button>
            <div className="w-px h-6 bg-border mx-2"></div>
            <Button variant="outline" size="sm" onClick={handleSaveDraft} className="gap-2">
              <Save className="w-4 h-4" /> Lưu nháp
            </Button>
            <Button size="sm" onClick={handlePublish} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
              <UploadCloud className="w-4 h-4" /> Xuất bản (Publish)
            </Button>
          </div>
        </header>

        {/* Content Area & Live Preview Split */}
        <div className="flex-1 overflow-hidden flex relative">
          {/* Left Panel: Form */}
          <div className={`${activeSection === "settings" || activeSection === "system-settings" || (activeSection === "comparison" && comparisonActiveTab === "history") ? "w-full" : activeSection === "comparison" ? "w-[40%]" : "w-[500px]"} flex-shrink-0 overflow-y-auto border-r border-border bg-card/50 transition-all duration-300`}>
            <div className="p-6 border-b bg-muted/40 sticky top-0 z-10 backdrop-blur-sm">
              <h3 className="font-semibold text-lg">Chỉnh sửa nội dung</h3>
              <p className="text-sm text-muted-foreground">Thay đổi nội dung text, hình ảnh cho vùng {activeSection === "settings" ? "Cài đặt hệ thống" : sections.find(s => s.id === activeSection)?.name}.</p>
            </div>
            
            <div className="p-6">
              {activeSection === "header" ? (
                <Tabs defaultValue="header-info" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="header-info">Header</TabsTrigger>
                    <TabsTrigger value="hero-info">Hero</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="header-info" className="space-y-6">
                    <div className="grid gap-2 mb-4">
                      <label className="text-sm font-medium">Text bên cạnh logo</label>
                      <input 
                        type="text" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                        value={headerForm.logo || ""}
                        onChange={(e) => setHeaderForm({...headerForm, logo: e.target.value})} 
                      />
                    </div>
                    <div className="grid gap-2 mb-4">
                      <label className="text-sm font-medium">Logo Image (Tùy chọn tải lên)</label>
                      <ImageUpload 
                        value={headerForm.logoImage || ""} 
                        onChange={(url) => setHeaderForm({...headerForm, logoImage: url})} 
                        placeholder="Tải logo lên (Nên dùng PNG ngang)"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Text Nút bấm CTA</label>
                        <input 
                          type="text" 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                          value={headerForm.cta || "Đăng ký ngay"}
                          onChange={(e) => setHeaderForm({...headerForm, cta: e.target.value})} 
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium text-primary">Link Nút bấm (VD: #pricing hoặc link ngoài)</label>
                        <input 
                          type="text" 
                          className="flex h-10 w-full rounded-md border border-primary/20 bg-background px-3 py-2 text-sm font-mono" 
                          value={(headerForm as any).ctaHref || "#pricing"}
                          onChange={(e) => setHeaderForm({...headerForm, ctaHref: e.target.value} as any)} 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4 mt-6">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Links Menu Điều Hướng</label>
                        <Button variant="outline" size="sm" onClick={() => {
                          const firstSection = landingData.pageSections[0];
                          setHeaderForm({
                            ...headerForm, 
                            navLinks: [
                              ...(headerForm.navLinks || []), 
                              { name: firstSection ? firstSection.title : "Mục mới", href: `#${firstSection ? firstSection.id : "hero"}` }
                            ]
                          });
                        }}>
                          + Thêm Menu
                        </Button>
                      </div>
                      {(headerForm.navLinks || []).map((link: any, index: number) => (
                        <div key={index} className="flex gap-2 items-center p-3 border rounded-md relative bg-muted/20">
                          <input 
                            type="text" 
                            className="flex-1 h-9 rounded-md border bg-background px-3 text-sm" 
                            placeholder="Tên hiển thị (VD: Giảng viên)"
                            value={link.name}
                            onChange={(e) => {
                              const newLinks = [...headerForm.navLinks];
                              newLinks[index].name = e.target.value;
                              setHeaderForm({...headerForm, navLinks: newLinks});
                            }} 
                          />
                          <select
                            className="flex-1 h-9 rounded-md border bg-background px-3 text-sm"
                            value={(link.href || "").replace("#", "")}
                            onChange={(e) => {
                              const newLinks = [...headerForm.navLinks];
                              const selectedId = e.target.value;
                              newLinks[index].href = "#" + selectedId;
                              
                              const matchedSection = landingData.pageSections.find(s => s.id === selectedId);
                              if (matchedSection) {
                                newLinks[index].name = matchedSection.title;
                              }
                              
                              setHeaderForm({...headerForm, navLinks: newLinks});
                            }}
                          >
                            {landingData.pageSections.map(s => (
                              <option key={s.id} value={s.id}>{s.title}</option>
                            ))}
                          </select>
                          <div className="flex items-center">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" disabled={index === 0} onClick={() => {
                              const newLinks = [...headerForm.navLinks];
                              [newLinks[index - 1], newLinks[index]] = [newLinks[index], newLinks[index - 1]];
                              setHeaderForm({...headerForm, navLinks: newLinks});
                            }}>↑</Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" disabled={index === (headerForm.navLinks || []).length - 1} onClick={() => {
                              const newLinks = [...headerForm.navLinks];
                              [newLinks[index + 1], newLinks[index]] = [newLinks[index], newLinks[index + 1]];
                              setHeaderForm({...headerForm, navLinks: newLinks});
                            }}>↓</Button>
                            <Button variant="ghost" size="icon" className="text-destructive h-8 w-8 ml-1 shrink-0" onClick={() => {
                              const newLinks = [...headerForm.navLinks];
                              newLinks.splice(index, 1);
                              setHeaderForm({...headerForm, navLinks: newLinks});
                            }}><X className="w-4 h-4" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="hero-info" className="space-y-6">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Tiêu đề</label>
                      <input type="text" className="flex h-10 w-full border rounded-md px-3 bg-background text-sm" value={heroForm.badge} onChange={(e) => setHeroForm({...heroForm, badge: e.target.value})} />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Tiêu đề</label>
                      <textarea className="flex min-h-[80px] w-full border rounded-md px-3 py-2 bg-background text-sm" value={heroForm.title} onChange={(e) => setHeroForm({...heroForm, title: e.target.value})} />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Mô tả</label>
                      <textarea className="flex min-h-[100px] w-full border rounded-md px-3 py-2 bg-background text-sm" value={heroForm.description} onChange={(e) => setHeroForm({...heroForm, description: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Text Nút bấm chính</label>
                        <input type="text" className="flex h-10 w-full border rounded-md px-3 bg-background text-sm" value={heroForm.primaryCta || ""} onChange={(e) => setHeroForm({...heroForm, primaryCta: e.target.value})} />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Link Nút bấm chính</label>
                        <input type="text" className="flex h-10 w-full border rounded-md px-3 bg-background text-sm font-mono" placeholder="#pricing" value={(heroForm as any).primaryCtaHref || ""} onChange={(e) => setHeroForm({...heroForm, primaryCtaHref: e.target.value} as any)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Text Nút bấm phụ</label>
                        <input type="text" className="flex h-10 w-full border rounded-md px-3 bg-background text-sm" value={heroForm.secondaryCta || ""} onChange={(e) => setHeroForm({...heroForm, secondaryCta: e.target.value})} />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Link Nút bấm phụ</label>
                        <input type="text" className="flex h-10 w-full border rounded-md px-3 bg-background text-sm font-mono" placeholder="#curriculum" value={(heroForm as any).secondaryCtaHref || ""} onChange={(e) => setHeroForm({...heroForm, secondaryCtaHref: e.target.value} as any)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Nhãn ngày khai giảng</label>
                        <input type="text" className="flex h-10 w-full border rounded-md px-3 bg-background text-sm" placeholder="VD: Khai giảng: 15/05/2026" value={(heroForm as any).startDate || ""} onChange={(e) => setHeroForm({...heroForm, startDate: e.target.value} as any)} />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Nhãn lịch học</label>
                        <input type="text" className="flex h-10 w-full border rounded-md px-3 bg-background text-sm" placeholder="VD: Lịch học: Thứ 3 - 5 (19h30 - 21h30)" value={(heroForm as any).scheduleText || ""} onChange={(e) => setHeroForm({...heroForm, scheduleText: e.target.value} as any)} />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 border rounded-md bg-muted/10">
                       <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            id="showMedia" 
                            checked={(heroForm as any).mediaType !== 'none'} 
                            onChange={(e) => setHeroForm({...heroForm, mediaType: e.target.checked ? 'video' : 'none'} as any)}
                          />
                          <label htmlFor="showMedia" className="text-sm font-bold uppercase cursor-pointer">Hiển thị Media (Video/Hình ảnh)</label>
                       </div>
                       
                       {(heroForm as any).mediaType !== 'none' && (
                         <div className="flex items-center gap-2 border-l pl-4">
                            <label className="text-xs font-medium opacity-70">Vị trí Media:</label>
                            <select 
                              className="h-8 border rounded-md px-2 bg-background text-xs"
                              value={heroForm.mediaPosition || 'right'}
                              onChange={(e) => setHeroForm({...heroForm, mediaPosition: e.target.value})}
                            >
                               <option value="right">Bên phải</option>
                               <option value="left">Bên trái</option>
                            </select>
                         </div>
                       )}
                    </div>

                    {(heroForm as any).mediaType !== 'none' && (
                    <div className="grid gap-4 p-4 border rounded-md bg-muted/10">
                      <h4 className="font-semibold text-sm uppercase text-primary">Cài đặt Media</h4>
                      <div className="grid gap-3">
                        <label className="text-xs font-medium opacity-70">Chọn loại hiển thị</label>
                        <select 
                          className="flex h-10 w-full border rounded-md px-3 bg-background text-sm" 
                          value={(heroForm as any).mediaType || "video"} 
                          onChange={(e) => setHeroForm({...heroForm, mediaType: e.target.value})}
                        >
                          <option value="video">Video YouTube</option>
                          <option value="image">Hình ảnh</option>
                        </select>
                      </div>
                      
                      {((heroForm as any).mediaType === "image") ? (
                        <div className="grid gap-2">
                          <label className="text-xs font-medium opacity-70">Hình ảnh hiển thị</label>
                          <ImageUpload 
                            value={(heroForm as any).imageUrl || ""} 
                            onChange={(url) => setHeroForm({...heroForm, imageUrl: url})} 
                            placeholder="Tải ảnh Hero lên..."
                          />
                        </div>
                      ) : (
                        <div className="grid gap-2">
                          <label className="text-xs font-medium opacity-70">YouTube Video ID hoặc URL</label>
                          <input 
                            type="text" 
                            className="flex h-10 w-full border rounded-md px-3 bg-background text-sm" 
                            placeholder="VD: dQw4w9WgXcQ"
                            value={(heroForm as any).videoUrl || ""} 
                            onChange={(e) => setHeroForm({...heroForm, videoUrl: e.target.value})} 
                          />
                        </div>
                      )}
                    </div>
                    )}
                  </TabsContent>
                </Tabs>
              ) : activeSection === "pain-points" ? (
                <div className="space-y-6">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Tiêu đề chính</label>
                    <input 
                      type="text" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                      value={painPointsForm.title}
                      onChange={(e) => setPainPointsForm({...painPointsForm, title: e.target.value})} 
                    />
                  </div>
                  
                  <div className="bg-muted/30 p-4 border rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h4 className="font-semibold text-sm">Cài đặt Logo Công Nghệ</h4>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-medium">Tiêu đề vùng Logo</label>
                      <input 
                        type="text" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                        value={painPointsForm.techLogosHeading || "Công cụ và công nghệ trong khóa học"}
                        onChange={(e) => setPainPointsForm({...painPointsForm, techLogosHeading: e.target.value})} 
                        placeholder="VD: Công cụ và công nghệ trong khóa học"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium">Danh sách Logo</label>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 text-xs"
                          onClick={() => {
                            const currentLogos = painPointsForm.techLogos || landingData.painPoints.techLogos;
                            setPainPointsForm({
                              ...painPointsForm, 
                              techLogos: [
                                ...currentLogos, 
                                { id: `logo-${Date.now()}`, description: "Tên công nghệ", image: "", className: "h-7 w-auto" }
                              ]
                            });
                          }}
                        >
                          + Thêm Logo
                        </Button>
                      </div>
                      <p className="text-[11px] text-muted-foreground mb-2">Bạn có thể lấy link ảnh logo SVG miễn phí tại <a href="https://svgl.app" target="_blank" rel="noreferrer" className="text-primary hover:underline">svgl.app</a></p>
                      
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                        {(painPointsForm.techLogos || landingData.painPoints.techLogos).map((logo: any, idx: number) => (
                          <div key={logo.id || idx} className="flex gap-2 items-start p-3 border rounded-md bg-background relative group">
                            <div className="flex-1 space-y-2">
                              <input 
                                type="text" 
                                className="flex h-8 w-full rounded-md border bg-background px-2 text-xs font-medium" 
                                placeholder="Tên công nghệ (Alt text)"
                                value={logo.description}
                                onChange={(e) => {
                                  const currentLogos = [...(painPointsForm.techLogos || landingData.painPoints.techLogos)];
                                  currentLogos[idx] = { ...currentLogos[idx], description: e.target.value };
                                  setPainPointsForm({...painPointsForm, techLogos: currentLogos});
                                }} 
                              />
                              <div className="flex gap-2 w-full">
                                <input 
                                  type="text" 
                                  className="flex h-8 w-full rounded-md border bg-background px-2 text-xs" 
                                  placeholder="URL Hình ảnh (https://...)"
                                  value={logo.image}
                                  onChange={(e) => {
                                    const currentLogos = [...(painPointsForm.techLogos || landingData.painPoints.techLogos)];
                                    currentLogos[idx] = { ...currentLogos[idx], image: e.target.value };
                                    setPainPointsForm({...painPointsForm, techLogos: currentLogos});
                                  }} 
                                />
                                <div className="relative flex shrink-0">
                                  <input 
                                    type="file" 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    accept="image/*"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      
                                      const toastId = toast.loading("Đang tải ảnh lên...");
                                      try {
                                        // Use the already imported uploadImage from @/lib/api
                                        const url = await uploadImage(file);
                                        if (url) {
                                          const currentLogos = [...(painPointsForm.techLogos || landingData.painPoints.techLogos)];
                                          currentLogos[idx] = { ...currentLogos[idx], image: url };
                                          setPainPointsForm({...painPointsForm, techLogos: currentLogos});
                                          toast.success("Tải ảnh thành công!", { id: toastId });
                                        } else {
                                          toast.error("Tải ảnh thất bại. Vui lòng thử lại.", { id: toastId });
                                        }
                                      } catch (err: any) {
                                        console.error(err);
                                        toast.error(`Lỗi: ${err.message || "Không thể tải ảnh lên"}`, { id: toastId });
                                      }
                                      e.target.value = ''; // Reset input
                                    }}
                                  />
                                  <Button type="button" variant="secondary" size="sm" className="h-8 text-xs font-medium px-3 whitespace-nowrap bg-muted hover:bg-muted/80">
                                    Tải lên
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center overflow-hidden shrink-0 border">
                              {logo.image ? (
                                <img src={logo.image} alt={logo.description} className="max-w-full max-h-full object-contain p-1" />
                              ) : (
                                <span className="text-[10px] text-muted-foreground text-center">No img</span>
                              )}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                              onClick={() => {
                                const currentLogos = [...(painPointsForm.techLogos || landingData.painPoints.techLogos)];
                                currentLogos.splice(idx, 1);
                                setPainPointsForm({...painPointsForm, techLogos: currentLogos});
                              }}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Các vấn đề gặp phải</label>
                      <Button variant="outline" size="sm" onClick={() => setPainPointsForm({...painPointsForm, items: [...(painPointsForm.items || []), {title: "Đừng bỏ lỡ cơ hội thăng tiến!", description: ""}]})}>
                        + Thêm vấn đề
                      </Button>
                    </div>
                    {(painPointsForm.items || []).map((item: any, index: number) => (
                      <div key={index} className="p-4 border rounded-md relative bg-muted/20">
                        <Button 
                          variant="ghost" size="sm" 
                          className="absolute right-2 top-2 text-destructive h-8 px-2"
                          onClick={() => {
                            const newItems = [...painPointsForm.items];
                            newItems.splice(index, 1);
                            setPainPointsForm({...painPointsForm, items: newItems});
                          }}
                        >Xóa</Button>
                        <div className="space-y-3 pt-2 pr-12">
                          <input 
                            type="text" 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-bold" 
                            value={item.title}
                            onChange={(e) => {
                              const newItems = [...painPointsForm.items];
                              newItems[index].title = e.target.value;
                              setPainPointsForm({...painPointsForm, items: newItems});
                            }} 
                          />
                          <ReactQuill theme="snow" value={item.description} onChange={(val) => {
                            const newItems = [...painPointsForm.items];
                            newItems[index].description = val;
                            setPainPointsForm({...painPointsForm, items: newItems});
                          }} className="bg-background min-h-[80px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : activeSection === "faq" ? (
                <div className="space-y-6">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Tiêu đề</label>
                    <input 
                      type="text" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" 
                      value={faqForm.title}
                      onChange={(e) => setFaqForm({...faqForm, title: e.target.value})} 
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Danh sách câu hỏi & giải đáp</label>
                      <Button variant="outline" size="sm" onClick={() => setFaqForm({...faqForm, questions: [...faqForm.questions, {q: "Câu hỏi mới?", a: "Câu trả lời..."}]})}>
                        + Thêm câu hỏi
                      </Button>
                    </div>
                    
                    {faqForm.questions.map((item, index) => (
                      <div key={index} className="p-4 border rounded-md bg-muted/20 relative group">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="absolute right-2 top-2 h-8 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            const newQs = [...faqForm.questions];
                            newQs.splice(index, 1);
                            setFaqForm({...faqForm, questions: newQs});
                          }}
                        >
                          Xóa
                        </Button>
                        <div className="space-y-3 pr-16">
                          <input 
                            type="text" 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-semibold" 
                            value={item.q}
                            onChange={(e) => {
                              const newQs = [...faqForm.questions];
                              newQs[index].q = e.target.value;
                              setFaqForm({...faqForm, questions: newQs});
                            }} 
                            placeholder="Câu hỏi"
                          />
                          <div className="bg-background">
                            <ReactQuill 
                              theme="snow"
                              value={item.a}
                              onChange={(val) => {
                                const newQs = [...faqForm.questions];
                                newQs[index].a = val;
                                setFaqForm({...faqForm, questions: newQs});
                              }} 
                              className="text-sm shrink-0 min-h-[80px]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : activeSection === "comparison" ? (
                <ErrorBoundary>
                  <div className="space-y-6">
                    {/* Tab Navigation */}
                    <div className="flex border-b border-border mb-6">
                      <button 
                        onClick={() => setComparisonActiveTab("config")}
                        className={`px-6 py-3 font-bold text-sm transition-all relative ${comparisonActiveTab === "config" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        Cấu hình Bảng So Sánh
                        {comparisonActiveTab === "config" && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                      </button>
                      <button 
                        onClick={() => setComparisonActiveTab("history")}
                        className={`px-6 py-3 font-bold text-sm transition-all relative ${comparisonActiveTab === "history" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        Lịch sử Học viên Tra Cứu
                        {comparisonActiveTab === "history" && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                      </button>
                    </div>

                    {comparisonActiveTab === "config" ? (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
                          <div className="flex items-center justify-between border-b pb-2">
                            <h3 className="font-bold text-lg">Bảng so sánh AI</h3>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Tiêu đề chính (Banner phía trên bảng)</label>
                              <input 
                                type="text"
                                value={comparisonForm.title}
                                onChange={(e) => setComparisonForm({...comparisonForm, title: e.target.value})}
                                className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-foreground font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-primary">Nội dung nút bấm</label>
                              <input 
                                type="text"
                                value={comparisonForm.buttonText || ""}
                                onChange={(e) => setComparisonForm({...comparisonForm, buttonText: e.target.value})}
                                placeholder="VD: BẮT ĐẦU SO SÁNH TỰ ĐỘNG"
                                className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-foreground"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium">Đoạn mô tả ngắn (Banner phía trên bảng)</label>
                            <textarea
                              value={comparisonForm.description}
                              onChange={(e) => setComparisonForm({...comparisonForm, description: e.target.value})}
                              className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-foreground"
                              rows={3}
                              placeholder="Nhập mô tả ngắn gọn về bảng so sánh..."
                            />
                          </div>
                          
                          <div className="space-y-4 pt-4 border-t border-border">
                            <h4 className="font-bold text-sm text-primary uppercase">Khu vực kêu gọi sử dụng AI (Nằm trong phần FAQ)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Nhãn phụ (Badge)</label>
                                <input 
                                  type="text"
                                  value={comparisonForm.ctaBadge || ""}
                                  onChange={(e) => setComparisonForm({...comparisonForm, ctaBadge: e.target.value})}
                                  placeholder="VD: Tính năng độc quyền"
                                  className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-foreground"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Tiêu đề kêu gọi</label>
                                <input 
                                  type="text"
                                  value={comparisonForm.ctaTitle || ""}
                                  onChange={(e) => setComparisonForm({...comparisonForm, ctaTitle: e.target.value})}
                                  placeholder="VD: Bạn vẫn còn đang phân vân?"
                                  className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-foreground"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Mô tả kêu gọi</label>
                              <textarea 
                                value={comparisonForm.ctaDescription || ""}
                                onChange={(e) => setComparisonForm({...comparisonForm, ctaDescription: e.target.value})}
                                placeholder="VD: Hãy để Trợ lý AI tự động phân tích và so sánh chi tiết giúp bạn..."
                                className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-foreground"
                                rows={2}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-6 pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <label className="text-base font-bold text-primary uppercase tracking-wider">Cấu trúc nội dung</label>
                            <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10" onClick={() => {
                              const newCats = [...(comparisonForm.categories || [])];
                              newCats.push({ name: "Nhóm mới", items: [{ label: "Tiêu chí mới", dscons: "Thông tin", highlight: false }] });
                              setComparisonForm({...comparisonForm, categories: newCats});
                            }}>
                              + Thêm nhóm nội dung
                            </Button>
                          </div>
                          {(Array.isArray(comparisonForm.categories) ? comparisonForm.categories : []).map((cat: any, catIdx: number) => {
                            if (!cat) return null;
                            return (
                              <div key={catIdx} className="p-5 border-2 rounded-2xl bg-muted/5 space-y-6 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary/20"></div>
                                
                                <div className="flex items-center gap-4">
                                   <div className="flex-1">
                                     <label className="text-[10px] font-bold uppercase opacity-50 mb-1 block">Tên nhóm (VD: Thông tin khóa học)</label>
                                     <input 
                                       type="text" className="w-full h-10 rounded-md border bg-background px-3 text-sm font-black uppercase italic text-primary" 
                                       value={typeof cat?.name === 'string' ? cat.name : String(cat?.name || "")} onChange={(e) => {
                                         const newCats = [...(comparisonForm.categories || [])];
                                         if (newCats[catIdx]) {
                                           newCats[catIdx].name = e.target.value;
                                           setComparisonForm({...comparisonForm, categories: newCats});
                                         }
                                       }} 
                                     />
                                   </div>
                                   <div className="pt-5">
                                     <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => {
                                       if (confirm("Bạn có chắc muốn xóa nhóm này?")) {
                                         const newCats = [...(comparisonForm.categories || [])];
                                         newCats.splice(catIdx, 1);
                                         setComparisonForm({...comparisonForm, categories: newCats});
                                       }
                                     }}>Xóa Nhóm</Button>
                                   </div>
                                </div>

                                <div className="space-y-6">
                                  {(Array.isArray(cat.items) ? cat.items : []).map((item: any, itemIdx: number) => {
                                     if (!item) return null;
                                     return (
                                       <div key={itemIdx} className="p-4 border rounded-xl bg-background shadow-sm space-y-4 relative group hover:border-primary/30 transition-colors">
                                          <div className="grid grid-cols-[1fr_150px_50px] gap-6 items-start">
                                             <div className="space-y-1">
                                                <label className="text-[10px] font-bold uppercase opacity-50">Tiêu chí so sánh (Bên trái)</label>
                                                <textarea 
                                                  className="w-full min-h-[44px] rounded-md border px-3 py-2 text-sm bg-background text-foreground font-medium focus:ring-2 focus:ring-primary/20" 
                                                  placeholder="VD: Số lượng buổi học..."
                                                  value={typeof item?.label === 'string' ? item.label : String(item?.label || "")} 
                                                  onChange={(e) => {
                                                    const newCats = [...(comparisonForm.categories || [])];
                                                    if (newCats[catIdx] && newCats[catIdx].items[itemIdx]) {
                                                      newCats[catIdx].items[itemIdx].label = e.target.value;
                                                      setComparisonForm({...comparisonForm, categories: newCats});
                                                    }
                                                  }} 
                                                />
                                             </div>
                                             <div className="space-y-1">
                                                <label className="text-[10px] font-bold uppercase opacity-50">Hiển thị</label>
                                                <div className="flex items-center gap-2 h-10 px-2 border rounded-md bg-muted/20">
                                                   <input 
                                                     type="checkbox" checked={item?.highlight || false} 
                                                     className="w-4 h-4 cursor-pointer"
                                                     onChange={(e) => {
                                                       const newCats = [...(comparisonForm.categories || [])];
                                                       if (newCats[catIdx] && newCats[catIdx].items[itemIdx]) {
                                                         newCats[catIdx].items[itemIdx].highlight = e.target.checked;
                                                         setComparisonForm({...comparisonForm, categories: newCats});
                                                       }
                                                     }} 
                                                   />
                                                   <span className="text-[11px] font-bold text-destructive">Màu đỏ</span>
                                                </div>
                                             </div>
                                             <div className="pt-5 flex items-center gap-1">
                                                <Button 
                                                  variant="ghost" 
                                                  size="icon" 
                                                  className="h-8 w-8 hover:bg-muted" 
                                                  disabled={itemIdx === 0}
                                                  title="Di chuyển lên trên"
                                                  onClick={() => {
                                                    const newCats = [...(comparisonForm.categories || [])];
                                                    if (newCats[catIdx] && newCats[catIdx].items) {
                                                      const temp = newCats[catIdx].items[itemIdx];
                                                      newCats[catIdx].items[itemIdx] = newCats[catIdx].items[itemIdx - 1];
                                                      newCats[catIdx].items[itemIdx - 1] = temp;
                                                      setComparisonForm({...comparisonForm, categories: newCats});
                                                    }
                                                  }}
                                                >
                                                  <ChevronUp className="w-4 h-4" />
                                                </Button>
                                                <Button 
                                                  variant="ghost" 
                                                  size="icon" 
                                                  className="h-8 w-8 hover:bg-muted" 
                                                  disabled={itemIdx === (cat.items.length - 1)}
                                                  title="Di chuyển xuống dưới"
                                                  onClick={() => {
                                                    const newCats = [...(comparisonForm.categories || [])];
                                                    if (newCats[catIdx] && newCats[catIdx].items) {
                                                      const temp = newCats[catIdx].items[itemIdx];
                                                      newCats[catIdx].items[itemIdx] = newCats[catIdx].items[itemIdx + 1];
                                                      newCats[catIdx].items[itemIdx + 1] = temp;
                                                      setComparisonForm({...comparisonForm, categories: newCats});
                                                    }
                                                  }}
                                                >
                                                  <ChevronDown className="w-4 h-4" />
                                                </Button>
                                                <Button 
                                                  variant="ghost" 
                                                  size="icon" 
                                                  className="h-8 w-8 text-destructive hover:bg-destructive/10" 
                                                  title="Xoá tiêu chí này"
                                                  onClick={() => {
                                                    const newCats = [...(comparisonForm.categories || [])];
                                                    if (newCats[catIdx] && newCats[catIdx].items) {
                                                      newCats[catIdx].items.splice(itemIdx, 1);
                                                      setComparisonForm({...comparisonForm, categories: newCats});
                                                    }
                                                  }}
                                                >
                                                  <X className="w-4 h-4" />
                                                </Button>
                                             </div>
                                          </div>

                                          <div className="space-y-1">
                                             <div className="flex items-center justify-between mb-1">
                                               <label className="text-[10px] font-bold uppercase opacity-50 block">Nội dung cột DSCons (In đậm, Link...)</label>
                                               <div className="flex items-center gap-2 bg-muted/30 px-2 py-1 rounded-md">
                                                  <span className="text-[10px] uppercase font-bold text-muted-foreground/70 mr-1">Gắn Icon:</span>
                                                  <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    type="button"
                                                    title="Hiển thị Icon Tick"
                                                    className={`h-7 w-7 p-0 rounded-full transition-all duration-300 ${
                                                      item?.dsconsIcon === "check" 
                                                      ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-600 shadow-sm ring-1 ring-emerald-500" 
                                                      : "hover:bg-emerald-500/10 border-border text-muted-foreground"
                                                    }`}
                                                    onClick={() => {
                                                      const newCats = [...(comparisonForm.categories || [])];
                                                      if (newCats[catIdx] && newCats[catIdx].items[itemIdx]) {
                                                        newCats[catIdx].items[itemIdx].dsconsIcon = item?.dsconsIcon === "check" ? undefined : "check";
                                                        setComparisonForm({...comparisonForm, categories: newCats});
                                                      }
                                                    }}
                                                  >
                                                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                                  </Button>
                                                  <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    type="button"
                                                    title="Hiển thị Icon X"
                                                    className={`h-7 w-7 p-0 rounded-full transition-all duration-300 ${
                                                      item?.dsconsIcon === "cross" 
                                                      ? "bg-rose-500/15 border-rose-500/50 text-rose-600 shadow-sm ring-1 ring-rose-500" 
                                                      : "hover:bg-rose-500/10 border-border text-muted-foreground"
                                                    }`}
                                                    onClick={() => {
                                                      const newCats = [...(comparisonForm.categories || [])];
                                                      if (newCats[catIdx] && newCats[catIdx].items[itemIdx]) {
                                                        newCats[catIdx].items[itemIdx].dsconsIcon = item?.dsconsIcon === "cross" ? undefined : "cross";
                                                        setComparisonForm({...comparisonForm, categories: newCats});
                                                      }
                                                    }}
                                                  >
                                                    <X className="w-3.5 h-3.5" strokeWidth={3} />
                                                  </Button>
                                               </div>
                                             </div>
                                             <div className="bg-background rounded-md overflow-hidden border focus-within:ring-2 focus-within:ring-primary/20 min-h-[120px]">
                                                <ReactQuill 
                                                  theme="snow"
                                                  value={typeof item?.dscons === 'string' ? item.dscons : String(item?.dscons || "")} 
                                                  onChange={(val) => {
                                                    const newCats = [...(comparisonForm.categories || [])];
                                                    if (newCats[catIdx] && newCats[catIdx].items[itemIdx]) {
                                                      newCats[catIdx].items[itemIdx].dscons = val;
                                                      setComparisonForm({...comparisonForm, categories: newCats});
                                                    }
                                                  }}
                                                  modules={{
                                                    toolbar: [
                                                      ['bold', 'italic', 'underline', 'link'],
                                                      [{ 'color': [] }],
                                                      ['clean']
                                                    ],
                                                  }}
                                                  className="bg-background text-foreground"
                                                />
                                             </div>
                                          </div>
                                       </div>
                                     );
                                  })}
                                  <Button variant="ghost" size="sm" className="w-full border-2 border-dashed border-primary/20 text-primary hover:bg-primary/5 py-6" onClick={() => {
                                     const newCats = [...(comparisonForm.categories || [])];
                                     if (newCats[catIdx]) {
                                       if (!newCats[catIdx].items) newCats[catIdx].items = [];
                                       newCats[catIdx].items.push({ label: "Tiêu chí mới", dscons: "Thông tin", highlight: false });
                                       setComparisonForm({...comparisonForm, categories: newCats});
                                     }
                                  }}>+ Thêm tiêu chí vào nhóm này</Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-card p-6 rounded-xl border shadow-sm">
                          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                            <div>
                              <h3 className="font-bold text-lg">Lịch sử Học viên Tra cứu</h3>
                              <div className="text-xs text-muted-foreground">Lưu trữ tất cả lượt tra cứu</div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                              <div className="relative w-full md:w-auto">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input 
                                  type="date" 
                                  value={historyDateFilter}
                                  onChange={(e) => setHistoryDateFilter(e.target.value)}
                                  className="h-9 w-full md:w-[160px] rounded-md border border-input bg-background pl-9 pr-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </div>
                              {historyDateFilter && (
                                <Button variant="ghost" size="sm" onClick={() => setHistoryDateFilter("")} className="h-9 px-2 text-xs">
                                  Xóa lọc
                                </Button>
                              )}
                              <Button onClick={handleExportHistory} variant="outline" size="sm" className="h-9 gap-2 w-full md:w-auto">
                                <Download className="w-4 h-4" /> Xuất Excel
                              </Button>
                            </div>
                          </div>
                          
                          {filteredQueries.length === 0 ? (
                            <div className="text-center py-12 bg-muted/20 rounded-xl border-2 border-dashed border-border">
                              <p className="text-muted-foreground">Chưa có lượt tra cứu nào phù hợp.</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {filteredQueries.map((q, idx) => (
                                <details key={idx} className="group bg-muted/30 border border-border rounded-xl overflow-hidden transition-all hover:border-primary/30">
                                  <summary className="flex justify-between items-center p-4 cursor-pointer hover:bg-muted/50 transition-colors list-none">
                                    <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {idx + 1}
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="font-bold text-foreground">Nhu cầu: {q.student_need || q.query || "Không nhập nhu cầu"}</span>
                                        <span className="text-xs text-muted-foreground">{new Date(q.created_at).toLocaleString('vi-VN')}</span>
                                      </div>
                                    </div>
                                    <ChevronDown size={20} className="text-muted-foreground group-open:rotate-180 transition-transform" />
                                  </summary>
                                  <div className="p-4 border-t border-border bg-card space-y-4">
                                    {q.student_need && (
                                      <div>
                                        <h4 className="text-xs font-bold uppercase text-muted-foreground mb-1">Nhu cầu chi tiết:</h4>
                                        <p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg">{q.student_need}</p>
                                      </div>
                                    )}
                                    
                                    {q.competitor_data && Array.isArray(q.competitor_data) && (
                                      <div>
                                        <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Dữ liệu đối chiếu:</h4>
                                        <div className="overflow-x-auto rounded-lg border">
                                          <table className="w-full text-xs table-fixed">
                                            <thead className="bg-muted">
                                              <tr>
                                                <th className="w-1/3 px-3 py-2 text-left border-r">Tiêu chí</th>
                                                <th className="w-1/3 px-3 py-2 text-left border-r text-primary">DSCons</th>
                                                <th className="w-1/3 px-3 py-2 text-left">Trung tâm khác</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {q.competitor_data.map((item: any, i: number) => (
                                                <tr key={i} className="border-t">
                                                  <td className="px-3 py-2 border-r font-medium break-words">{item.criterion}</td>
                                                  <td className="px-3 py-2 border-r text-primary font-bold break-words">
                                                    <div dangerouslySetInnerHTML={{ __html: item.dscons }} className="prose prose-sm max-w-none prose-p:my-0" />
                                                  </td>
                                                  <td className="px-3 py-2 italic text-muted-foreground break-words">{item.competitor}</td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    )}
                                </div>
                              </details>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                </ErrorBoundary>
              ) : activeSection === "testimonials" ? (
                <div className="space-y-6">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Tiêu đề</label>
                    <input 
                      type="text" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" 
                      value={testimonialsForm.title}
                      onChange={(e) => setTestimonialsForm({...testimonialsForm, title: e.target.value})} 
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Nhận xét của Học viên (Dạng Chữ)</label>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setTestimonialsForm({...testimonialsForm, textItems: [...(testimonialsForm.textItems || []), {name: "Người mới", role: "Học viên", content: "Nội dung cảm nhận..."}]})}>
                        + Thêm nhận xét chữ
                      </Button>
                    </div>
                    
                    {(testimonialsForm.textItems || []).map((item: any, index: number) => (
                      <div key={`text-${index}`} className="p-4 border rounded-md bg-muted/20 relative group">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="absolute right-2 top-2 h-8 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            const newItems = [...(testimonialsForm.textItems || [])];
                            newItems.splice(index, 1);
                            setTestimonialsForm({...testimonialsForm, textItems: newItems});
                          }}
                        >
                          Xóa
                        </Button>
                        <div className="space-y-3 pr-16">
                          <div className="grid grid-cols-2 gap-3">
                            <input 
                              type="text" 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-semibold" 
                              value={item.name}
                              onChange={(e) => {
                                const newItems = [...(testimonialsForm.textItems || [])];
                                newItems[index].name = e.target.value;
                                setTestimonialsForm({...testimonialsForm, textItems: newItems});
                              }} 
                              placeholder="Tên học viên"
                            />
                            <input 
                              type="text" 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                              value={item.role}
                              onChange={(e) => {
                                const newItems = [...(testimonialsForm.textItems || [])];
                                newItems[index].role = e.target.value;
                                setTestimonialsForm({...testimonialsForm, textItems: newItems});
                              }} 
                              placeholder="Chức danh"
                            />
                          </div>
                          <div className="bg-background">
                            <ReactQuill 
                              theme="snow"
                              value={item.content || ""}
                              onChange={(val) => {
                                const newItems = [...(testimonialsForm.textItems || [])];
                                newItems[index].content = val;
                                setTestimonialsForm({...testimonialsForm, textItems: newItems});
                              }} 
                              className="text-sm shrink-0 min-h-[80px]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-4 mt-8 pt-8 border-t">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Nhận xét của Học viên (Dạng Video)</label>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setTestimonialsForm({...testimonialsForm, videoItems: [...(testimonialsForm.videoItems || []), {name: "Người mới", role: "Học viên", videoUrl: ""}]})}>
                          + Thêm nhận xét video
                        </Button>
                      </div>
                      
                      {(testimonialsForm.videoItems || []).map((item: any, index: number) => (
                        <div key={`video-${index}`} className="p-4 border rounded-md bg-muted/20 relative group">
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="absolute right-2 top-2 h-8 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              const newItems = [...(testimonialsForm.videoItems || [])];
                              newItems.splice(index, 1);
                              setTestimonialsForm({...testimonialsForm, videoItems: newItems});
                            }}
                          >
                            Xóa
                          </Button>
                          <div className="space-y-3 pr-16">
                            <div className="grid grid-cols-2 gap-3">
                              <input 
                                type="text" 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-semibold" 
                                value={item.name}
                                onChange={(e) => {
                                  const newItems = [...(testimonialsForm.videoItems || [])];
                                  newItems[index].name = e.target.value;
                                  setTestimonialsForm({...testimonialsForm, videoItems: newItems});
                                }} 
                                placeholder="Tên học viên"
                              />
                              <input 
                                type="text" 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                                value={item.role}
                                onChange={(e) => {
                                  const newItems = [...(testimonialsForm.videoItems || [])];
                                  newItems[index].role = e.target.value;
                                  setTestimonialsForm({...testimonialsForm, videoItems: newItems});
                                }} 
                                placeholder="Chức danh"
                              />
                            </div>
                            <div className="bg-background">
                              <div className="flex flex-col gap-2 mt-2">
                                <div className="flex items-center gap-2">
                                  <Video className="w-4 h-4 text-muted-foreground" />
                                  <input 
                                    type="text" 
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                                    value={item.videoUrl || ""}
                                    onChange={(e) => {
                                      const newItems = [...(testimonialsForm.videoItems || [])];
                                      newItems[index].videoUrl = e.target.value;
                                      setTestimonialsForm({...testimonialsForm, videoItems: newItems});
                                    }} 
                                    placeholder="Link Video (YouTube/Google Drive/MP4)"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <ImageIcon className="w-4 h-4 text-muted-foreground" />
                                  <input 
                                    type="text" 
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                                    value={item.thumbnailUrl || ""}
                                    onChange={(e) => {
                                      const newItems = [...(testimonialsForm.videoItems || [])];
                                      newItems[index].thumbnailUrl = e.target.value;
                                      setTestimonialsForm({...testimonialsForm, videoItems: newItems});
                                    }} 
                                    placeholder="Link ảnh đại diện tùy chọn (Nếu ảnh tự động bị xấu)"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                  <div className="grid gap-4 mt-8 pt-8 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Đối tác / Doanh nghiệp (Dòng 1)</label>
                        <p className="text-xs text-muted-foreground mt-1">Danh sách logo đối tác chạy tự động (từ phải qua trái).</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setTestimonialsForm({...testimonialsForm, partners: [...(testimonialsForm.partners || []), {name: "Đối tác mới", logoUrl: ""}]})}>
                        + Thêm đối tác D1
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(testimonialsForm.partners || []).map((partner: any, index: number) => (
                        <div key={index} className="p-3 border rounded-md bg-muted/20 flex gap-3 relative group items-center">
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            className="absolute -right-2 -top-2 w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-sm z-10"
                            onClick={() => {
                              const newPartners = [...(testimonialsForm.partners || [])];
                              newPartners.splice(index, 1);
                              setTestimonialsForm({...testimonialsForm, partners: newPartners});
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                          <div className="w-12 h-12 rounded bg-background border flex items-center justify-center shrink-0 overflow-hidden p-1">
                            {partner.logoUrl ? (
                              <img src={partner.logoUrl} alt={partner.name} className="max-w-full max-h-full object-contain" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-muted-foreground/50" />
                            )}
                          </div>
                          <div className="space-y-2 flex-1 min-w-0">
                            <input 
                              type="text" 
                              className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs font-medium" 
                              value={partner.name}
                              onChange={(e) => {
                                const newPartners = [...(testimonialsForm.partners || [])];
                                newPartners[index].name = e.target.value;
                                setTestimonialsForm({...testimonialsForm, partners: newPartners});
                              }} 
                              placeholder="Tên đối tác"
                            />
                            <input 
                              type="text" 
                              className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs" 
                              value={partner.logoUrl || ""}
                              onChange={(e) => {
                                const newPartners = [...(testimonialsForm.partners || [])];
                                newPartners[index].logoUrl = e.target.value;
                                setTestimonialsForm({...testimonialsForm, partners: newPartners});
                              }} 
                              placeholder="URL Logo (SVG/PNG)"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 mt-8 pt-8 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Đối tác / Doanh nghiệp (Dòng 2)</label>
                        <p className="text-xs text-muted-foreground mt-1">Danh sách logo đối tác chạy tự động (từ trái qua phải).</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setTestimonialsForm({...testimonialsForm, partnersRow2: [...(testimonialsForm.partnersRow2 || []), {name: "Đối tác mới", logoUrl: ""}]})}>
                        + Thêm đối tác D2
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(testimonialsForm.partnersRow2 || []).map((partner: any, index: number) => (
                        <div key={`row2-${index}`} className="p-3 border rounded-md bg-muted/20 flex gap-3 relative group items-center">
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            className="absolute -right-2 -top-2 w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-sm z-10"
                            onClick={() => {
                              const newPartners = [...(testimonialsForm.partnersRow2 || [])];
                              newPartners.splice(index, 1);
                              setTestimonialsForm({...testimonialsForm, partnersRow2: newPartners});
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                          <div className="w-12 h-12 rounded bg-background border flex items-center justify-center shrink-0 overflow-hidden p-1">
                            {partner.logoUrl ? (
                              <img src={partner.logoUrl} alt={partner.name} className="max-w-full max-h-full object-contain" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-muted-foreground/50" />
                            )}
                          </div>
                          <div className="space-y-2 flex-1 min-w-0">
                            <input 
                              type="text" 
                              className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs font-medium" 
                              value={partner.name}
                              onChange={(e) => {
                                const newPartners = [...(testimonialsForm.partnersRow2 || [])];
                                newPartners[index].name = e.target.value;
                                setTestimonialsForm({...testimonialsForm, partnersRow2: newPartners});
                              }} 
                              placeholder="Tên đối tác"
                            />
                            <input 
                              type="text" 
                              className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs" 
                              value={partner.logoUrl || ""}
                              onChange={(e) => {
                                const newPartners = [...(testimonialsForm.partnersRow2 || [])];
                                newPartners[index].logoUrl = e.target.value;
                                setTestimonialsForm({...testimonialsForm, partnersRow2: newPartners});
                              }} 
                              placeholder="URL Logo (SVG/PNG)"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 mt-8 pt-8 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Đối tác / Doanh nghiệp (Dòng 3)</label>
                        <p className="text-xs text-muted-foreground mt-1">Danh sách logo đối tác chạy tự động (Dòng mới thêm).</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setTestimonialsForm({...testimonialsForm, partnersRow3: [...(testimonialsForm.partnersRow3 || []), {name: "Đối tác mới", logoUrl: ""}]})}>
                        + Thêm đối tác D3
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(testimonialsForm.partnersRow3 || []).map((partner: any, index: number) => (
                        <div key={`row3-${index}`} className="p-3 border rounded-md bg-muted/20 flex gap-3 relative group items-center">
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            className="absolute -right-2 -top-2 w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-sm z-10"
                            onClick={() => {
                              const newPartners = [...(testimonialsForm.partnersRow3 || [])];
                              newPartners.splice(index, 1);
                              setTestimonialsForm({...testimonialsForm, partnersRow3: newPartners});
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                          <div className="w-12 h-12 rounded bg-background border flex items-center justify-center shrink-0 overflow-hidden p-1">
                            {partner.logoUrl ? (
                              <img src={partner.logoUrl} alt={partner.name} className="max-w-full max-h-full object-contain" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-muted-foreground/50" />
                            )}
                          </div>
                          <div className="space-y-2 flex-1 min-w-0">
                            <input 
                              type="text" 
                              className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs font-medium" 
                              value={partner.name}
                              onChange={(e) => {
                                const newPartners = [...(testimonialsForm.partnersRow3 || [])];
                                newPartners[index].name = e.target.value;
                                setTestimonialsForm({...testimonialsForm, partnersRow3: newPartners});
                              }} 
                              placeholder="Tên đối tác"
                            />
                            <input 
                              type="text" 
                              className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs" 
                              value={partner.logoUrl || ""}
                              onChange={(e) => {
                                const newPartners = [...(testimonialsForm.partnersRow3 || [])];
                                newPartners[index].logoUrl = e.target.value;
                                setTestimonialsForm({...testimonialsForm, partnersRow3: newPartners});
                              }} 
                              placeholder="URL Logo (SVG/PNG)"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : activeSection === "benefits" ? (
                <div className="space-y-6">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Tiêu đề</label>
                    <input 
                      type="text" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" 
                      value={benefitsForm.title}
                      onChange={(e) => setBenefitsForm({...benefitsForm, title: e.target.value})} 
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Danh sách Giải pháp / Lợi ích</label>
                      <Button variant="outline" size="sm" onClick={() => setBenefitsForm({...benefitsForm, items: [...benefitsForm.items, {title: "Đừng bỏ lỡ cơ hội thăng tiến!", description: "Mô tả chi tiết..."}]})}>
                        + Thêm Lợi Ích
                      </Button>
                    </div>
                    
                    {benefitsForm.items.map((item, index) => (
                      <div key={index} className="p-4 border rounded-md bg-muted/20 relative group">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="absolute right-2 top-2 h-8 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            const newItems = [...benefitsForm.items];
                            newItems.splice(index, 1);
                            setBenefitsForm({...benefitsForm, items: newItems});
                          }}
                        >
                          Xóa
                        </Button>
                        <div className="space-y-3 pr-16">
                          <input 
                            type="text" 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-semibold" 
                            value={item.title}
                            onChange={(e) => {
                              const newItems = [...benefitsForm.items];
                              newItems[index].title = e.target.value;
                              setBenefitsForm({...benefitsForm, items: newItems});
                            }} 
                            placeholder="Tiêu đề lợi ích"
                          />
                          <ReactQuill
                            theme="snow"
                            value={item.description}
                            onChange={(val) => {
                              const newItems = [...benefitsForm.items];
                              newItems[index].description = val;
                              setBenefitsForm({...benefitsForm, items: newItems});
                            }}
                            className="bg-background text-foreground shrink-0 min-h-[80px]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : activeSection === "curriculum" ? (
                <div className="space-y-6">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Tiêu đề</label>
                    <input 
                      type="text" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" 
                      value={curriculumForm.title}
                      onChange={(e) => setCurriculumForm({...curriculumForm, title: e.target.value})} 
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Danh sách Modules & Bài học</label>
                      <Button variant="outline" size="sm" onClick={() => setCurriculumForm({...curriculumForm, modules: [...curriculumForm.modules, {id: "m" + Date.now(), title: "Đừng bỏ lỡ cơ hội thăng tiến!", lessons: []}]})}>
                        + Thêm Module
                      </Button>
                    </div>
                    
                    {curriculumForm.modules.map((module, mIndex) => (
                      <div key={mIndex} className="p-4 border-[2px] border-primary/20 rounded-lg bg-background relative">
                        <div className="flex items-center gap-2 mb-4 pr-16">
                          <input 
                            type="text" 
                            className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm font-bold text-primary" 
                            value={module.title}
                            onChange={(e) => {
                              const newMods = [...curriculumForm.modules];
                              newMods[mIndex].title = e.target.value;
                              setCurriculumForm({...curriculumForm, modules: newMods});
                            }} 
                            placeholder="TÊN MODULE"
                          />
                          <Button 
                            variant="destructive" size="sm" 
                            onClick={() => {
                              const newMods = [...curriculumForm.modules];
                              newMods.splice(mIndex, 1);
                              setCurriculumForm({...curriculumForm, modules: newMods});
                            }}
                          >Xóa Module</Button>
                        </div>

                        <div className="space-y-4 pl-4 border-l-2 border-border ml-2">
                          {module.lessons.map((lesson, lIndex) => (
                            <div key={lIndex} className="p-3 border rounded-md bg-muted/30">
                              <div className="flex flex-col gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-[150px]">
                                    <IconSelector 
                                      value={lesson.icon || "Monitor"}
                                      onChange={(iconName) => {
                                        const newMods = [...curriculumForm.modules];
                                        newMods[mIndex].lessons[lIndex].icon = iconName;
                                        setCurriculumForm({...curriculumForm, modules: newMods});
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="flex items-start gap-2">
                                  <input type="text" className="w-16 h-8 text-xs rounded border px-2 bg-background" value={lesson.id} onChange={(e) => {
                                    const newMods = [...curriculumForm.modules];
                                    newMods[mIndex].lessons[lIndex].id = e.target.value;
                                    setCurriculumForm({...curriculumForm, modules: newMods});
                                  }} placeholder="Buổi..." />
                                  <input type="text" className="flex-1 h-8 text-sm font-medium rounded border px-2 bg-background" value={lesson.title} onChange={(e) => {
                                    const newMods = [...curriculumForm.modules];
                                    newMods[mIndex].lessons[lIndex].title = e.target.value;
                                    setCurriculumForm({...curriculumForm, modules: newMods});
                                  }} placeholder="Tên bài học" />
                                  <Button variant="ghost" size="sm" className="h-8 text-destructive px-2" onClick={() => {
                                    const newMods = [...curriculumForm.modules];
                                    newMods[mIndex].lessons.splice(lIndex, 1);
                                    setCurriculumForm({...curriculumForm, modules: newMods});
                                  }}>Xóa</Button>
                                </div>
                              </div>
                              <div className="bg-background">
                                <ReactQuill
                                  theme="snow"
                                  value={lesson.desc}
                                  onChange={(val) => {
                                    const newMods = [...curriculumForm.modules];
                                    newMods[mIndex].lessons[lIndex].desc = val;
                                    setCurriculumForm({...curriculumForm, modules: newMods});
                                  }}
                                  className="text-sm bg-background mb-2 shrink-0 min-h-[80px]"
                                />
                              </div>
                              
                              <div className="bg-background border rounded p-2 text-xs">
                                <div className="font-medium mb-1 flex justify-between">Chi tiết: 
                                  <span className="text-primary cursor-pointer" onClick={() => {
                                    const newMods = [...curriculumForm.modules];
                                    newMods[mIndex].lessons[lIndex].details.push("Nội dung mới");
                                    setCurriculumForm({...curriculumForm, modules: newMods});
                                  }}>+ Thêm ý</span>
                                </div>
                                {lesson.details.map((detail, dIndex) => (
                                  <div key={dIndex} className="flex items-center gap-1 mb-1">
                                    <span className="opacity-50">-</span>
                                    <input type="text" className="flex-1 border-b bg-transparent px-1 focus:outline-none" value={detail} onChange={(e) => {
                                      const newMods = [...curriculumForm.modules];
                                      newMods[mIndex].lessons[lIndex].details[dIndex] = e.target.value;
                                      setCurriculumForm({...curriculumForm, modules: newMods});
                                    }} />
                                    <button className="text-destructive font-bold px-1" onClick={() => {
                                      const newMods = [...curriculumForm.modules];
                                      newMods[mIndex].lessons[lIndex].details.splice(dIndex, 1);
                                      setCurriculumForm({...curriculumForm, modules: newMods});
                                    }}>x</button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                          <Button size="sm" variant="secondary" className="w-full" onClick={() => {
                            const newMods = [...curriculumForm.modules];
                            newMods[mIndex].lessons.push({id: "Mới", title: "Đừng bỏ lỡ cơ hội thăng tiến!", desc: "Mô tả", icon: "Play", details: []});
                            setCurriculumForm({...curriculumForm, modules: newMods});
                          }}>+ Thêm Bài Học</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : activeSection === "social" ? (
                <div className="space-y-6">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Badge (Thẻ nhãn)</label>
                    <input 
                      type="text" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                      value={socialForm.badge}
                      onChange={(e) => setSocialForm({...socialForm, badge: e.target.value})} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Tiêu đề</label>
                    <input 
                      type="text" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                      value={socialForm.title}
                      onChange={(e) => setSocialForm({...socialForm, title: e.target.value})} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Mô tả chung</label>
                    <textarea 
                      className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                      value={socialForm.description}
                      onChange={(e) => setSocialForm({...socialForm, description: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Các Kết Quả Thực Tế (Icon Cards)</label>
                      <Button variant="outline" size="sm" onClick={() => setSocialForm({...socialForm, items: [...socialForm.items, {icon: "Rocket", title: "Đừng bỏ lỡ cơ hội thăng tiến!", description: ""}]})}>
                        + Thêm thẻ
                      </Button>
                    </div>
                    {socialForm.items.map((item, index) => (
                      <div key={index} className="p-4 border rounded-md relative bg-muted/30">
                        <Button 
                          variant="ghost" size="sm" 
                          className="absolute right-2 top-2 text-destructive h-8 px-2"
                          onClick={() => {
                            const newItems = [...socialForm.items];
                            newItems.splice(index, 1);
                            setSocialForm({...socialForm, items: newItems});
                          }}
                        >Xóa</Button>
                        <div className="grid gap-3 pt-2">
                          <div className="w-[150px]">
                            <IconSelector 
                              value={item.icon}
                              onChange={(iconName) => {
                                const newItems = [...socialForm.items];
                                newItems[index].icon = iconName;
                                setSocialForm({...socialForm, items: newItems});
                              }}
                            />
                          </div>
                          <input 
                            type="text" 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-bold" 
                            value={item.title}
                            onChange={(e) => {
                              const newItems = [...socialForm.items];
                              newItems[index].title = e.target.value;
                              setSocialForm({...socialForm, items: newItems});
                            }} 
                            placeholder="Tiêu đề lợi ích"
                          />
                          <div className="bg-background">
                            <ReactQuill
                              theme="snow"
                              value={item.description}
                              onChange={(val) => {
                                const newItems = [...socialForm.items];
                                newItems[index].description = val;
                                setSocialForm({...socialForm, items: newItems});
                              }}
                              className="text-sm bg-background min-h-[80px]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : activeSection === "instructor" ? (
                <div className="space-y-6">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Huy hiệu (Nhãn)</label>
                    <input type="text" className="flex h-10 w-full border rounded-md px-3 bg-background text-sm" value={instructorForm.badge} onChange={(e) => setInstructorForm({...instructorForm, badge: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Tiêu đề</label>
                    <input type="text" className="flex h-10 w-full border rounded-md px-3 bg-background text-sm" value={instructorForm.title} onChange={(e) => setInstructorForm({...instructorForm, title: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Mô tả (Subtitle)</label>
                    <textarea className="flex min-h-[60px] w-full border rounded-md px-3 py-2 bg-background text-sm" value={instructorForm.subtitle} onChange={(e) => setInstructorForm({...instructorForm, subtitle: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Link YouTube Video</label>
                    <input type="text" placeholder="https://www.youtube.com/watch?v=..." className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={instructorForm.videoUrl || ""} onChange={(e) => setInstructorForm({...instructorForm, videoUrl: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Link Ảnh nền / Image URL</label>
                    <input type="text" placeholder="https://..." className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={instructorForm.imageUrl || ""} onChange={(e) => setInstructorForm({...instructorForm, imageUrl: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Tên giảng viên</label>
                      <input type="text" className="flex h-10 w-full border rounded-md px-3 bg-background text-sm font-bold" value={instructorForm.name} onChange={(e) => setInstructorForm({...instructorForm, name: e.target.value})} />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Chức danh</label>
                      <input type="text" className="flex h-10 w-full border rounded-md px-3 bg-background text-sm" value={instructorForm.role} onChange={(e) => setInstructorForm({...instructorForm, role: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Tiểu sử (Bio)</label>
                    <ReactQuill theme="snow" value={instructorForm.bio} onChange={(val) => setInstructorForm({...instructorForm, bio: val})} className="bg-background min-h-[100px]" />
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="grid gap-1">
                        <label className="text-sm font-medium text-primary">Tiêu đề khối bên phải</label>
                        <input 
                          type="text" 
                          className="flex h-9 w-full rounded-md border bg-background px-3 text-sm font-bold" 
                          value={instructorForm.achievementsHeading || ""} 
                          onChange={(e) => setInstructorForm({...instructorForm, achievementsHeading: e.target.value})} 
                          placeholder="Lý do nên đồng hành..."
                        />
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setInstructorForm({...instructorForm, achievements: [...(instructorForm.achievements || []), {icon: "Check", text: "Nội dung mới"}]})}>
                        + Thêm mục mới
                      </Button>
                    </div>
                    <div className="grid gap-3">
                      {(instructorForm.achievements || []).map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-3 items-start p-3 border rounded-md bg-muted/20 relative group">
                          <div className="w-[140px] shrink-0">
                            <label className="text-[10px] font-bold opacity-50 uppercase mb-1 block">Icon</label>
                            <IconSelector 
                              value={item.icon} 
                              onChange={(iconName) => {
                                const newAch = [...(instructorForm.achievements || [])];
                                newAch[idx] = { ...newAch[idx], icon: iconName };
                                setInstructorForm({...instructorForm, achievements: newAch});
                              }} 
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-[10px] font-bold opacity-50 uppercase mb-1 block">Nội dung dòng {idx + 1}</label>
                            <input 
                              type="text" 
                              className="flex h-10 w-full rounded-md border bg-background px-3 text-sm" 
                              value={item.text} 
                              onChange={(e) => {
                                const newAch = [...(instructorForm.achievements || [])];
                                newAch[idx] = { ...newAch[idx], text: e.target.value };
                                setInstructorForm({...instructorForm, achievements: newAch});
                              }} 
                            />
                          </div>
                          <Button 
                            variant="ghost" size="icon" 
                            className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              const newAch = [...instructorForm.achievements];
                              newAch.splice(idx, 1);
                              setInstructorForm({...instructorForm, achievements: newAch});
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : activeSection === "bonus" ? (
                <div className="space-y-6">
                  <div className="bg-muted/10 p-4 rounded-lg border border-primary/20 space-y-4">
                    <h3 className="font-bold flex items-center gap-2 text-primary">
                      <LayoutDashboard className="w-5 h-5" /> Nội dung tiêu đề chính
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Huy hiệu (Badge/Subtitle)</label>
                        <input 
                          type="text" 
                          className="flex h-10 w-full rounded-md border px-3 bg-background text-sm" 
                          value={bonusForm.subtitle || ""} 
                          onChange={(e) => setBonusForm({...bonusForm, subtitle: e.target.value})} 
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Tiêu đề</label>
                        <input 
                          type="text" 
                          className="flex h-10 w-full rounded-md border px-3 bg-background text-sm font-bold" 
                          value={bonusForm.title || ""} 
                          onChange={(e) => setBonusForm({...bonusForm, title: e.target.value})} 
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Mô tả tổng quát</label>
                      <ReactQuill 
                        theme="snow" 
                        value={bonusForm.description || ""} 
                        onChange={(val) => setBonusForm({...bonusForm, description: val})} 
                        className="bg-background min-h-[80px]" 
                      />
                    </div>
                  </div>

                  <div className="bg-muted/10 p-4 rounded-lg border border-primary/20 space-y-4">
                    <h3 className="font-bold flex items-center gap-2 text-primary">
                      <LayoutDashboard className="w-4 h-4" /> Nội dung khối bên trái (Sidebar)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Tiêu đề</label>
                        <input 
                          type="text" 
                          className="flex h-10 w-full rounded-md border px-3 bg-background text-sm" 
                          value={bonusForm.boxLeftSubtitle || ""} 
                          onChange={(e) => setBonusForm({...bonusForm, boxLeftSubtitle: e.target.value})} 
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Tiêu đề</label>
                        <input 
                          type="text" 
                          className="flex h-10 w-full rounded-md border px-3 bg-background text-sm font-bold" 
                          value={bonusForm.boxLeftTitle || ""} 
                          onChange={(e) => setBonusForm({...bonusForm, boxLeftTitle: e.target.value})} 
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Mô tả nội dung bên trái</label>
                      <ReactQuill 
                        theme="snow" 
                        value={bonusForm.boxLeftDesc || ""} 
                        onChange={(val) => setBonusForm({...bonusForm, boxLeftDesc: val})} 
                        className="bg-background min-h-[100px]" 
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Ghi chú chân trang (Footer Note)</label>
                      <input 
                        type="text" 
                        className="flex h-10 w-full rounded-md border px-3 bg-background text-sm italic" 
                        value={bonusForm.boxLeftNote || ""} 
                        onChange={(e) => setBonusForm({...bonusForm, boxLeftNote: e.target.value})} 
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-primary flex items-center gap-2">
                        <Gift className="w-4 h-4" /> Danh sách quà tặng chi tiết
                      </label>
                      <Button variant="outline" size="sm" onClick={() => {
                        const newFeatures = [...(bonusForm.features || [])];
                        newFeatures.push({ icon: "Gift", cmd: "Quà tặng mới", desc: "Mô tả chi tiết quà tặng" });
                        setBonusForm({...bonusForm, features: newFeatures});
                      }}>
                        + Thêm quà tặng
                      </Button>
                    </div>

                    {(bonusForm.features || []).map((feature: any, index: number) => (
                      <div key={index} className="p-4 border rounded-md relative bg-muted/20 group">
                        <Button 
                          variant="ghost" size="sm" 
                          className="absolute right-2 top-2 text-destructive h-8 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            const newFeatures = [...(bonusForm.features || [])];
                            newFeatures.splice(index, 1);
                            setBonusForm({...bonusForm, features: newFeatures});
                          }}
                        >Xóa</Button>
                        <div className="grid grid-cols-[120px_1fr] gap-4 pt-2 text-foreground">
                          <div className="grid gap-2">
                            <label className="text-xs font-medium opacity-70 uppercase">BIỂU TƯỢNG</label>
                            <IconSelector 
                              value={feature.icon}
                              onChange={(iconName) => {
                                const newFeatures = [...(bonusForm.features || [])];
                                newFeatures[index] = { ...newFeatures[index], icon: iconName };
                                setBonusForm({...bonusForm, features: newFeatures});
                              }}
                            />
                          </div>
                          <div className="grid gap-3">
                            <div className="grid gap-2">
                              <label className="text-xs font-medium opacity-70 uppercase">Tiêu đề</label>
                              <input 
                                type="text" 
                                className="flex h-10 w-full rounded-md border px-3 bg-background text-sm font-bold" 
                                value={feature.cmd}
                                onChange={(e) => {
                                  const newFeatures = [...(bonusForm.features || [])];
                                  newFeatures[index].cmd = e.target.value;
                                  setBonusForm({...bonusForm, features: newFeatures});
                                }} 
                              />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-xs font-medium opacity-70 uppercase">Mô tả ngắn gọn</label>
                              <textarea 
                                className="flex min-h-[60px] w-full rounded-md border px-3 py-2 bg-background text-sm" 
                                value={feature.desc}
                                onChange={(e) => {
                                  const newFeatures = [...(bonusForm.features || [])];
                                  newFeatures[index].desc = e.target.value;
                                  setBonusForm({...bonusForm, features: newFeatures});
                                }} 
                              ></textarea>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 mt-2 p-3 bg-card border rounded-md">
                              <div className="grid gap-2">
                                <label className="text-xs font-medium opacity-70 uppercase">Loại Media</label>
                                <select 
                                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                  value={feature.mediaType || "none"}
                                  onChange={(e) => {
                                    const newFeatures = [...(bonusForm.features || [])];
                                    newFeatures[index].mediaType = e.target.value;
                                    setBonusForm({...bonusForm, features: newFeatures});
                                  }}
                                >
                                  <option value="none">Không có</option>
                                  <option value="image">Hình ảnh</option>
                                  <option value="video">Video (Drive/Link)</option>
                                  <option value="youtube">YouTube</option>
                                  <option value="website">Đường link Web (Iframe)</option>
                                </select>
                              </div>
                              <div className="grid gap-2">
                                <label className="text-xs font-medium opacity-70 uppercase">URL Media</label>
                                <input 
                                  type="text" 
                                  className="flex h-9 w-full rounded-md border px-3 bg-background text-sm" 
                                  value={feature.mediaUrl || ""}
                                  placeholder={feature.mediaType === 'youtube' ? "https://youtube.com/watch?v=..." : "https://..."}
                                  onChange={(e) => {
                                    const newFeatures = [...(bonusForm.features || [])];
                                    newFeatures[index].mediaUrl = e.target.value;
                                    setBonusForm({...bonusForm, features: newFeatures});
                                  }} 
                                  disabled={!feature.mediaType || feature.mediaType === "none"}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : activeSection === "pricing" ? (
                <div className="space-y-6">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Tiêu đề</label>
                    <input 
                      type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                      value={pricingForm.title} onChange={(e) => setPricingForm({...pricingForm, title: e.target.value})} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Mô tả độ dài / lưu ý (*)</label>
                    <input 
                      type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                      value={pricingForm.originalPrice} onChange={(e) => setPricingForm({...pricingForm, originalPrice: e.target.value})} 
                    />
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <label className="text-base font-semibold">Các Gói Học Phí</label>
                      <Button variant="outline" size="sm" onClick={() => {
                        const newPackages = [...(pricingForm.packages || [])];
                        newPackages.push({
                          name: "Gói mới", price: "0đ", description: "Để lại email để nhận ngay bộ tài liệu Revit MEP Miễn phí và ưu đãi đặc biệt.", isRecommended: false, badgeText: "", badgeColor: "#1978DC", features: ["Quyền lợi 1"]
                        });
                        setPricingForm({...pricingForm, packages: newPackages});
                      }}>
                        + Thêm gói mới
                      </Button>
                    </div>

                    {(pricingForm.packages || []).map((pkg: any, pkgIndex: number) => (
                      <div key={pkgIndex} className="p-4 border rounded-md relative bg-muted/10 space-y-4">
                        <Button 
                          variant="ghost" size="sm" 
                          className="absolute right-2 top-2 text-destructive h-8 px-2"
                          onClick={() => {
                            const newPackages = [...pricingForm.packages];
                            newPackages.splice(pkgIndex, 1);
                            setPricingForm({...pricingForm, packages: newPackages});
                          }}
                        >Xóa Gói</Button>
                        
                        <div className="grid gap-4 md:grid-cols-2 pt-2 pr-16">
                          <div className="grid gap-2">
                            <label className="text-xs font-medium">Tên gói</label>
                            <input type="text" className="flex h-9 w-full rounded-md border bg-background px-3 text-sm font-bold" 
                              value={pkg.name} onChange={(e) => {
                                const newPackages = [...pricingForm.packages];
                                newPackages[pkgIndex].name = e.target.value;
                                setPricingForm({...pricingForm, packages: newPackages});
                              }} />
                          </div>
                          <div className="grid gap-2">
                            <label className="text-xs font-medium">Giá bán</label>
                            <input type="text" className="flex h-9 w-full rounded-md border text-primary bg-background px-3 text-sm font-bold" 
                              value={pkg.price} onChange={(e) => {
                                const newPackages = [...pricingForm.packages];
                                newPackages[pkgIndex].price = e.target.value;
                                setPricingForm({...pricingForm, packages: newPackages});
                              }} />
                          </div>
                          <div className="grid gap-2 md:col-span-2">
                            <label className="text-xs font-medium">Mô tả ngắn</label>
                            <input type="text" className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" 
                              value={pkg.description} onChange={(e) => {
                                const newPackages = [...pricingForm.packages];
                                newPackages[pkgIndex].description = e.target.value;
                                setPricingForm({...pricingForm, packages: newPackages});
                              }} />
                          </div>
                          <div className="grid gap-2">
                            <label className="text-xs font-medium">Text nút bấm</label>
                            <input type="text" className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" 
                              value={pkg.buttonText || "Liên hệ đăng ký ngay"} onChange={(e) => {
                                const newPackages = [...pricingForm.packages];
                                newPackages[pkgIndex].buttonText = e.target.value;
                                setPricingForm({...pricingForm, packages: newPackages});
                              }} />
                          </div>
                          <div className="grid gap-2">
                            <label className="text-xs font-medium text-primary">Link nút bấm</label>
                            <input type="text" className="flex h-9 w-full rounded-md border border-primary/30 bg-background px-3 text-sm font-mono" 
                              value={pkg.buttonHref || ""} onChange={(e) => {
                                const newPackages = [...pricingForm.packages];
                                newPackages[pkgIndex].buttonHref = e.target.value;
                                setPricingForm({...pricingForm, packages: newPackages});
                              }} placeholder="VD: https://zalo.me/..." />
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-end gap-6 pt-4 border-t border-muted/30 mt-3">
                          <div className="flex items-center space-x-2 h-10">
                            <input type="checkbox" id={`rec-${pkgIndex}`} className="w-4 h-4 rounded border-input accent-primary" 
                              checked={pkg.isRecommended} onChange={(e) => {
                                const newPackages = [...pricingForm.packages];
                                newPackages[pkgIndex].isRecommended = e.target.checked;
                                setPricingForm({...pricingForm, packages: newPackages});
                              }} />
                            <label htmlFor={`rec-${pkgIndex}`} className="text-sm font-bold text-primary/80 cursor-pointer select-none">
                              Gói Nổi bật
                            </label>
                          </div>

                          <div className="flex-1 space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
                              <Tag className="w-3 h-3" /> Thêm nhãn (Badge)
                            </label>
                            <input type="text" className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all" 
                              placeholder="VD: Khuyến Nghị, Bán Chạy..."
                              value={pkg.badgeText || ""} onChange={(e) => {
                                const newPackages = [...pricingForm.packages];
                                newPackages[pkgIndex].badgeText = e.target.value;
                                setPricingForm({...pricingForm, packages: newPackages});
                              }} />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
                              <Palette className="w-3 h-3" /> Màu sắc
                            </label>
                            <div className="relative group">
                              <input type="color" className="h-9 w-14 rounded-md border-2 border-muted bg-background p-0.5 cursor-pointer hover:border-primary/50 transition-all overflow-hidden" 
                                value={pkg.badgeColor || "#1978DC"} onChange={(e) => {
                                  const newPackages = [...pricingForm.packages];
                                  newPackages[pkgIndex].badgeColor = e.target.value;
                                  setPricingForm({...pricingForm, packages: newPackages});
                                }} />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 pt-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-medium text-muted-foreground">Quyền lợi của gói</label>
                            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => {
                              const newPackages = [...pricingForm.packages];
                              newPackages[pkgIndex].features = [...(pkg.features || []), "Quyền lợi mới"];
                              setPricingForm({...pricingForm, packages: newPackages});
                            }}>+ Thêm quyền lợi</Button>
                          </div>
                          <div className="space-y-2">
                            {(pkg.features || []).map((feat: string, featIndex: number) => (
                              <div key={featIndex} className="flex items-center gap-2">
                                <input type="text" className="flex-1 h-8 rounded-md border bg-background px-3 text-xs" value={feat} onChange={(e) => {
                                  const newPackages = [...pricingForm.packages];
                                  newPackages[pkgIndex].features[featIndex] = e.target.value;
                                  setPricingForm({...pricingForm, packages: newPackages});
                                }} />
                                <Button variant="ghost" size="sm" className="text-destructive h-8 px-2" onClick={() => {
                                  const newPackages = [...pricingForm.packages];
                                  newPackages[pkgIndex].features.splice(featIndex, 1);
                                  setPricingForm({...pricingForm, packages: newPackages});
                                }}>Xóa</Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                            ) : activeSection === "settings" ? (
                <div className="space-y-8 pb-12">
                  {/* Landing Pages Management */}
                  <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <LayoutDashboard className="w-5 h-5 text-primary" /> Quản lý Landing Pages
                    </h3>
                    <LandingPageManager activePageId={activePageId} onPageSelect={setActivePageId} />
                  </div>
                  {/* Stats Section */}
                  <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <LayoutDashboard className="w-5 h-5 text-primary" /> Thống kê Truy cập
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                        <p className="text-sm text-muted-foreground">Tổng lượt truy cập</p>
                        <p className="text-3xl font-bold text-primary">{pageStats.length}</p>
                      </div>
                      <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/10">
                        <p className="text-sm text-muted-foreground">Lượt truy cập hôm nay</p>
                        <p className="text-3xl font-bold text-green-600">
                          {pageStats.filter(s => new Date(s.created_at).toDateString() === new Date().toDateString()).length}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Admin Account */}
                  <AccountManager currentUser={user} />
                </div>
              ) : activeSection === "system-settings" ? (
                <div className="space-y-8 pb-12">
                  {/* API & Webhook Config */}
                  <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Settings className="w-5 h-5 text-primary" /> Cấu hình Hệ thống
                    </h3>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium text-muted-foreground">Google/AI API Key (Dùng cho Bảng So Sánh)</label>
                        <div className="relative">
                          <input 
                            type={showApiKey ? "text" : "password"} 
                            className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm pr-10" 
                            value={settingsForm.api_key} 
                            onChange={(e) => setSettingsForm({...settingsForm, api_key: e.target.value})}
                            placeholder="Nhập API Key..."
                          />
                          <button
                            type="button"
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium text-muted-foreground">Webhook URL (Make/n8n) - Nhận Lead Email</label>
                        <input 
                          type="text" 
                          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" 
                          value={settingsForm.webhook_url} 
                          onChange={(e) => setSettingsForm({...settingsForm, webhook_url: e.target.value})}
                          placeholder="https://hook.make.com/..."
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-dashed">
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Tiêu đề trang (SEO Title)</label>
                          <input 
                            type="text" 
                            className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm font-bold" 
                            value={settingsForm.site_title || ""} 
                            onChange={(e) => setSettingsForm({...settingsForm, site_title: e.target.value})}
                            placeholder="VD: DSCons - Revit MEP Thực Chiến"
                          />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Favicon / Logo (Tab trình duyệt)</label>
                          <ImageUpload 
                            value={settingsForm.favicon || ""} 
                            onChange={(url) => setSettingsForm({...settingsForm, favicon: url})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Exit Popup Config */}
                  <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-primary" /> Câu hỏit-Intent Popup
                      </h3>
                      <Switch 
                        checked={settingsForm.exit_popup.enabled} 
                        onCheckedChange={(checked) => setSettingsForm({
                          ...settingsForm, 
                          exit_popup: { ...settingsForm.exit_popup, enabled: checked }
                        })} 
                      />
                    </div>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Tiêu đề</label>
                        <input 
                          type="text" 
                          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm font-bold" 
                          value={settingsForm.exit_popup.title} 
                          onChange={(e) => setSettingsForm({
                            ...settingsForm, 
                            exit_popup: { ...settingsForm.exit_popup, title: e.target.value }
                          })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Mô tả nội dung</label>
                        <textarea 
                          className="flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm" 
                          value={settingsForm.exit_popup.description} 
                          onChange={(e) => setSettingsForm({
                            ...settingsForm, 
                            exit_popup: { ...settingsForm.exit_popup, description: e.target.value }
                          })}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                         <input 
                           type="checkbox" 
                           id="show-email"
                           checked={settingsForm.exit_popup.showEmailField}
                           onChange={(e) => setSettingsForm({
                             ...settingsForm, 
                             exit_popup: { ...settingsForm.exit_popup, showEmailField: e.target.checked }
                           })}
                         />
                         <label htmlFor="show-email" className="text-sm font-medium">Hiển thị ô nhập Email thu thập thông tin</label>
                      </div>
                      
                      {!settingsForm.exit_popup.showEmailField && (
                        <div className="grid gap-2 pt-2 animate-in slide-in-from-top-2">
                          <label className="text-sm font-medium text-primary">Link điều hướng khi click nút</label>
                          <input 
                            type="text" 
                            className="flex h-10 w-full rounded-md border-primary/30 bg-background px-3 py-2 text-sm font-mono" 
                            value={settingsForm.exit_popup.buttonLink || ""} 
                            onChange={(e) => setSettingsForm({
                              ...settingsForm, 
                              exit_popup: { ...settingsForm.exit_popup, buttonLink: e.target.value }
                            })}
                            placeholder="https://zalo.me/... hoặc link tài liệu"
                          />
                        </div>
                      )}
                      
                      <div className="grid gap-2 pt-2">
                        <label className="text-sm font-medium">Dòng text chân Popup</label>
                        <input 
                          type="text" 
                          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" 
                          value={settingsForm.exit_popup.footerText || ""} 
                          onChange={(e) => setSettingsForm({
                            ...settingsForm, 
                            exit_popup: { ...settingsForm.exit_popup, footerText: e.target.value }
                          })}
                          placeholder="VD: DSCons Global Academy..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeSection === "cta" ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">Nội dung CTA cuối trang</h3>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Tiêu đề</label>
                        <textarea 
                          className="flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm font-bold" 
                          value={ctaForm.title} 
                          onChange={(e) => setCtaForm({ ...ctaForm, title: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Mô tả nội dung</label>
                        <textarea 
                          className="flex min-h-[120px] w-full rounded-md border bg-background px-3 py-2 text-sm" 
                          value={ctaForm.description} 
                          onChange={(e) => setCtaForm({ ...ctaForm, description: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Text trên nút bấm</label>
                        <input 
                          type="text" 
                          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" 
                          value={ctaForm.button} 
                          onChange={(e) => setCtaForm({ ...ctaForm, button: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Link điều hướng (Anchor Link)</label>
                        <input 
                          type="text" 
                          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm font-mono" 
                          value={ctaForm.href} 
                          onChange={(e) => setCtaForm({ ...ctaForm, href: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2 border-t pt-4 mt-2">
                        <h4 className="text-sm font-bold text-primary">Cài đặt Đếm Ngược (Countdown)</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <label className="text-xs font-medium">Ngày hết hạn (Đếm ngược)</label>
                            <input 
                              type="datetime-local" 
                              className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm font-mono" 
                              value={(ctaForm as any).countdownDate || ""} 
                              onChange={(e) => setCtaForm({ ...ctaForm, countdownDate: e.target.value } as any)}
                            />
                            <p className="text-[10px] text-muted-foreground">VD: 2026-05-15T19:30</p>
                          </div>
                          <div className="grid gap-2">
                            <label className="text-xs font-medium">Lịch học / Ghi chú</label>
                            <input 
                              type="text" 
                              className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" 
                              placeholder="VD: Thứ 3 - 5 (19h30 - 21h30)"
                              value={(ctaForm as any).scheduleText || ""} 
                              onChange={(e) => setCtaForm({ ...ctaForm, scheduleText: e.target.value } as any)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium text-red-500">Link hỗ trợ (VD: Zalo)</label>
                        <input 
                          type="text" 
                          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm font-mono" 
                          value={ctaForm.supportLink || ""} 
                          onChange={(e) => setCtaForm({ ...ctaForm, supportLink: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Link Facebook</label>
                        <input 
                          type="text" 
                          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm font-mono" 
                          value={ctaForm.socialLinks?.facebook || ""} 
                          onChange={(e) => setCtaForm({ ...ctaForm, socialLinks: { ...ctaForm.socialLinks, facebook: e.target.value } })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Link YouTube</label>
                        <input 
                          type="text" 
                          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm font-mono" 
                          value={ctaForm.socialLinks?.youtube || ""} 
                          onChange={(e) => setCtaForm({ ...ctaForm, socialLinks: { ...ctaForm.socialLinks, youtube: e.target.value } })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Link Trang web</label>
                        <input 
                          type="text" 
                          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm font-mono" 
                          value={ctaForm.socialLinks?.website || ""} 
                          onChange={(e) => setCtaForm({ ...ctaForm, socialLinks: { ...ctaForm.socialLinks, website: e.target.value } })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Link Zalo (Social Icon)</label>
                        <input 
                          type="text" 
                          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm font-mono" 
                          value={ctaForm.socialLinks?.zalo || ""} 
                          onChange={(e) => setCtaForm({ ...ctaForm, socialLinks: { ...ctaForm.socialLinks, zalo: e.target.value } })}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-6 border-t">
                    <h3 className="text-lg font-medium border-b pb-2">Nội dung Footer (Chân trang)</h3>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Dòng bản quyền (Copyright)</label>
                        <input 
                          type="text" 
                          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" 
                          value={ctaForm.copyright || ""} 
                          onChange={(e) => setCtaForm({ ...ctaForm, copyright: e.target.value })}
                          placeholder="© 2026 DSCons Global Academy. All rights reserved."
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium text-primary">Text thông báo trạng thái (VD: Khóa K4 đang bắt đầu)</label>
                        <input 
                          type="text" 
                          className="flex h-10 w-full rounded-md border border-primary/30 bg-background px-3 py-2 text-sm" 
                          value={ctaForm.statusText || ""} 
                          onChange={(e) => setCtaForm({ ...ctaForm, statusText: e.target.value })}
                          placeholder="Khóa K4 đang bắt đầu"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Khu vực kéo thả và chỉnh sửa linh kiện cho <span className="font-bold text-foreground">{activeSection === "settings" ? "Cài đặt giao diện" : sections.find((s: any) => s.id === activeSection)?.name}</span> đang được xây dựng.</p>
                  <img src="https://illustrations.popsy.co/amber/keynote-presentation.svg" alt="construction" className="w-64 mx-auto mt-8 opacity-50" />
                </div>
              )}
            </div>
          </div>
                    {/* Right Panel: Live Preview */}
          {activeSection !== "settings" && activeSection !== "system-settings" && !(activeSection === "comparison" && comparisonActiveTab === "history") && (
            <div className="flex-1 w-full bg-background relative isolate overflow-x-hidden overflow-y-auto">
               {activeSection === "header" && (
                  <div className="pointer-events-none origin-top-left scale-[0.8] w-[125%] h-full">
                    <NavbarPreview data={headerForm} />
                    <div className="mt-[-1px]">
                      <HeroPreview data={heroForm} />
                    </div>
                  </div>
                )}
                {activeSection === "pain-points" && <div className="pointer-events-none origin-top-left scale-[0.8] w-[125%]"><PainPointsPreview data={painPointsForm} /></div>}
                {activeSection === "benefits" && <div className="pointer-events-none origin-top-left scale-[0.8] w-[125%]"><SolutionPreview data={benefitsForm} /></div>}
                {activeSection === "curriculum" && <div className="pointer-events-none origin-top-left scale-[0.8] w-[125%]"><CurriculumPreview data={curriculumForm} /></div>}
                {activeSection === "bonus" && <div className="pointer-events-none origin-top-left scale-[0.8] w-[125%]"><BonusPreview data={bonusForm} /></div>}
                {activeSection === "instructor" && <div className="pointer-events-none origin-top-left scale-[0.8] w-[125%]"><InstructorPreview data={instructorForm} /></div>}
                {activeSection === "pricing" && <div className="pointer-events-none origin-top-left scale-[0.8] w-[125%]"><PricingPreview data={pricingForm} /></div>}
                {activeSection === "faq" && <div className="pointer-events-none origin-top-left scale-[0.8] w-[125%]"><FAQPreview data={faqForm} /></div>}
                {activeSection === "comparison" && (
                  <div className="w-full mt-12 space-y-12 px-6">
                     <div className="flex justify-center scale-110">
                        <div className="bg-primary text-white px-10 py-8 rounded-2xl text-xl font-black gap-4 flex items-center shadow-2xl shadow-primary/20">
                           <Bot size={32} />
                           {comparisonForm.buttonText || "BẮT ĐẦU SO SÁNH TỰ ĐỘNG"}
                        </div>
                     </div>
                     <div className="relative">
                        <div className="absolute -top-10 left-0 text-[10px] font-black uppercase tracking-[0.3em] opacity-30 text-primary">
                          FULL MODAL PREVIEW CONTENT
                        </div>
                        <ComparisonPreview data={comparisonForm} isPreview={true} />
                     </div>
                  </div>
                )}
                {activeSection === "social" && <div className="pointer-events-none origin-top-left scale-[0.8] w-[125%]"><OutcomesPreview data={socialForm} /></div>}
                {activeSection === "testimonials" && <div className="pointer-events-none origin-top-left scale-[0.8] w-[125%]"><TestimonialsPreview data={testimonialsForm} /></div>}
                {activeSection === "cta" && (
                  <div className="pointer-events-none origin-top-left scale-[0.8] w-[125%] flex flex-col gap-12">
                    <BottomCTAPreview data={ctaForm} />
                    <Footer data={ctaForm} />
                  </div>
                )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}