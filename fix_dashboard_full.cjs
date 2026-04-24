const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'admin', 'Dashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// The broken state initialization area
const brokenStart = '  const [activeSection, setActiveSection] = useState("header");';
const brokenEnd = '      if (activeSection === "header") {';

const startIndex = content.indexOf(brokenStart);
const endIndex = content.indexOf(brokenEnd);

if (startIndex !== -1 && endIndex !== -1) {
    const head = content.substring(0, startIndex + brokenStart.length);
    const tail = content.substring(endIndex);
    
    const restoredCode = `
  const [activePageId, setActivePageId] = useState("11111111-1111-1111-1111-111111111111");
  const [pages, setPages] = useState<any[]>([]);
  const [isPageSwitcherOpen, setIsPageSwitcherOpen] = useState(false);
  const [sectionData, setSectionData] = useState<SectionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [competitorQueries, setCompetitorQueries] = useState<any[]>([]);
  const [isDark, setIsDark] = useState(true);

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
      document.title = \`\${settingsForm.site_title} | Admin\`;
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
`;
    
    fs.writeFileSync(filePath, head + restoredCode + tail);
    console.log('Successfully restored and fixed Dashboard.tsx states.');
} else {
    console.log('Could not find broken area.');
}
