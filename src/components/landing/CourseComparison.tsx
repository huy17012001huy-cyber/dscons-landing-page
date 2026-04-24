import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Check, RotateCcw, Minus, ChevronDown, Sparkles } from "lucide-react";
import { getSectionData, saveCompetitorQuery } from "@/lib/api";
import { Button } from "@/components/ui/button";
import React from "react";
import { formatTextGradients } from "@/lib/textUtils";
import { toast } from "sonner";
import { analyzeCompetitor } from "@/lib/gemini";

const isExactMatch = (html: any, keyword: string) => {
  if (!html || typeof html !== 'string') {
    html = String(html || "");
  }
  if (!html) return false;
  const stripped = html.replace(/<[^>]*>?/gm, '').trim().toLowerCase();
  return stripped === keyword.toLowerCase();
};

const ALLOWED_AI_HTML_TAGS = new Set(["strong", "ul", "ol", "li", "br", "p", "em"]);
const BLOCK_AI_HTML_TAGS = /<(ul|ol|li|p|br)\b/i;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const sanitizeAIHtml = (value: any, preserveNewlines = false) => {
  let html = value == null ? "" : String(value);
  if (!html) return "";

  if (preserveNewlines && !BLOCK_AI_HTML_TAGS.test(html)) {
    html = html.replace(/\r\n|\r|\n/g, "<br />");
  }

  if (typeof document === "undefined") {
    return escapeHtml(html);
  }

  const template = document.createElement("template");
  template.innerHTML = html;

  const sanitizeNode = (node: Node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const element = node as HTMLElement;
    const tagName = element.tagName.toLowerCase();

    if (tagName === "script" || tagName === "style") {
      element.remove();
      return;
    }

    if (!ALLOWED_AI_HTML_TAGS.has(tagName)) {
      element.replaceWith(...Array.from(element.childNodes));
      return;
    }

    Array.from(element.attributes).forEach((attribute) => {
      element.removeAttribute(attribute.name);
    });
  };

  const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_ELEMENT);
  const nodes: Node[] = [];
  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }
  nodes.forEach(sanitizeNode);

  return template.innerHTML;
};

const ComparisonModal = ({ isOpen, setIsOpen, config, localData, handleInputChange, handleAIAnalyze, isAnalyzing, showResult, aiData, isStatic = false, studentNeed, setStudentNeed }: any) => {
  useEffect(() => {
    if (!isStatic && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isStatic]);

  if (!isOpen) return null;

  const containerClasses = isStatic 
    ? "relative w-full z-0" 
    : "fixed inset-0 z-50 flex items-center justify-center px-4 bg-background/95 backdrop-blur-xl p-4 md:p-10";
    
  return (
    <div 
      className={containerClasses}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isStatic) setIsOpen(false);
      }}
    >
      <motion.div 
        initial={isStatic ? {} : { opacity: 0, scale: 0.98, y: 10 }} 
        animate={isStatic ? {} : { opacity: 1, scale: 1, y: 0 }} 
        exit={isStatic ? {} : { opacity: 0, scale: 0.98, y: 10 }} 
        className={isStatic ? "w-full" : "w-full max-w-6xl max-h-[90vh] shadow-2xl rounded-[2rem] overflow-y-auto custom-scrollbar border border-border/50 bg-card relative"}
      >
        {/* Header Section */}
        {!isStatic && (
          <div className="bg-card px-6 py-6 md:px-12 md:py-8 border-b border-border flex flex-col md:flex-row items-center justify-between gap-6 shrink-0 sticky top-0 z-40 shadow-sm">
            <div className="text-center md:text-left flex-1">
              {config.badge && (
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider mb-3 border border-primary/20">
                  {config.badge}
                </span>
              )}
              <h2 
                className="text-2xl md:text-3xl font-black text-foreground tracking-tight leading-tight"
                dangerouslySetInnerHTML={{ __html: formatTextGradients(config.title || "So sánh chất lượng đào tạo") }}
              />
              {config.description && (
                <p 
                  className="mt-3 text-muted-foreground text-sm md:text-base max-w-2xl"
                  dangerouslySetInnerHTML={{ __html: formatTextGradients(config.description) }}
                />
              )}
            </div>

            <button 
            onClick={() => setIsOpen(false)} 
            className="absolute top-6 right-6 p-2.5 rounded-full bg-background hover:bg-muted transition-colors text-muted-foreground hover:text-foreground border border-border z-50 shadow-sm"
          >
            <X size={20} />
          </button>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button 
                variant="outline"
                onClick={() => {
                  localStorage.removeItem("dscons_comparison_draft");
                  localStorage.removeItem("dscons_student_need");
                  window.location.reload();
                }} 
                className="bg-background hover:bg-muted text-muted-foreground px-4 py-6 rounded-2xl text-sm font-medium gap-2 shadow-sm transition-all"
              >
                <RotateCcw size={16} />
                Làm mới
              </Button>
              <Button 
                onClick={handleAIAnalyze} 
                disabled={isAnalyzing} 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-2xl text-base font-bold gap-3 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Bot className="animate-spin" size={20} />
                    Đang phân tích...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Bắt đầu phân tích AI
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Student Need Input Section */}
        {!isStatic && (
          <div className="bg-muted/30 px-6 py-6 md:px-12 border-b border-border shrink-0">
            <div className="max-w-4xl mx-auto">
              <label className="flex items-center gap-2 text-sm font-black text-foreground mb-3 uppercase tracking-wider">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Sparkles size={14} />
                </div>
                Mục tiêu / Nhu cầu của bạn (Tùy chọn):
              </label>
              <textarea 
                value={studentNeed || ""}
                onChange={(e) => setStudentNeed(e.target.value)}
                placeholder="VD: Mình là sinh viên năm cuối, muốn học cấp tốc trong 2 tháng để xin việc ngay. Mình yếu phần dựng hình 3D và chưa biết bóc tách khối lượng. Mình cần trung tâm hỗ trợ giải đáp ngoài giờ học nhiệt tình và ưu tiên học thực hành trên dự án thực tế..."
                rows={4}
                className="w-full bg-background border border-border rounded-2xl p-4 text-[14px] md:text-base text-foreground focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all resize-none shadow-sm placeholder:text-muted-foreground/40 font-medium leading-relaxed"
              />
              <p className="mt-3 text-[12px] text-muted-foreground flex items-center gap-2 font-medium italic">
                <Bot size={14} className="text-primary" />
                Dựa vào nhu cầu này, Trợ lý AI sẽ phân tích xem khóa học DSCons có thực sự phù hợp với bạn hay không.
              </p>
            </div>
          </div>
        )}

        {/* Table Content */}
        <div className="bg-background/50">
          <div className="min-w-[600px]">
            {/* Table Header */}
            <div className="grid grid-cols-[1.5fr_1fr_1fr] border-b border-border bg-card shadow-sm">
              <div className="p-5 md:p-6 text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-widest">Tiêu chí</div>
              <div className="p-5 md:p-6 text-center text-xs md:text-sm font-black text-primary uppercase tracking-widest bg-primary/5 border-x border-border">DSCons</div>
              <div className="p-5 md:p-6 text-center text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-widest">Trung tâm khác</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-border">
              {(Array.isArray(localData) ? localData : []).map((cat: any, catIdx: number) => {
                if (!cat) return null;
                return (
                <div key={catIdx} className="bg-card/30">
                  {/* Category Row */}
                  <div className="bg-muted px-6 py-3 border-y border-border flex items-center gap-3 shadow-sm backdrop-blur-md bg-muted/90">
                    <ChevronDown size={14} className="text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest text-foreground/80">{cat.name}</span>
                  </div>

                  {/* Items Rows */}
                  <div className="divide-y divide-border">
                    {(Array.isArray(cat.items) ? cat.items : []).map((item: any, itemIdx: number) => {
                      if (!item) return null;
                      return (
                      <div key={itemIdx} className="grid grid-cols-[1.5fr_1fr_1fr] group hover:bg-muted/20 transition-colors">
                        {/* Criterion Label */}
                        <div className="p-5 md:p-6 flex items-start gap-4">
                          <span className="text-[11px] md:text-[12px] font-bold text-muted-foreground/50 mt-1">
                            {itemIdx + 1}
                          </span>
                          <span 
                            className="text-[13px] md:text-sm font-semibold text-foreground/80 leading-relaxed flex-1"
                            dangerouslySetInnerHTML={{ __html: formatTextGradients(item.label) }}
                          />
                        </div>

                        {/* DSCons Value */}
                        <div className="p-5 md:p-6 flex items-start justify-center text-center bg-primary/5 border-x border-border">
                          <div className="flex flex-col items-center gap-2">
                             {item.dsconsIcon === 'check' || (!item.dsconsIcon && (isExactMatch(item.dscons, 'có') || isExactMatch(item.dscons, 'check'))) ? (
                               <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-600">
                                 <Check size={18} strokeWidth={3} />
                               </div>
                             ) : item.dsconsIcon === 'cross' || (!item.dsconsIcon && isExactMatch(item.dscons, 'không')) ? (
                               <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 text-rose-600">
                                 <X size={18} strokeWidth={3} />
                               </div>
                             ) : null}
                             {/* Only display the text if it's not EXACTLY "Có" or "Không" without a manual icon override */}
                             {(!item.dsconsIcon && (isExactMatch(item.dscons, 'có') || isExactMatch(item.dscons, 'không'))) ? null : (
                               <span 
                                 className={`text-[13px] md:text-[14px] font-bold ${item.highlight ? 'text-rose-500' : 'text-foreground'}`}
                                 dangerouslySetInnerHTML={{ __html: formatTextGradients(item.dscons) }}
                               />
                             )}
                          </div>
                        </div>

                        {/* Competitor Value */}
                        <div className="p-5 md:p-6 flex flex-col items-center justify-start gap-4">
                          {isStatic ? (
                            <div className="flex flex-col items-center gap-2">
                               {isExactMatch(item.competitor || "", 'có') || isExactMatch(item.competitor || "", 'check') ? (
                                 <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-600">
                                   <Check size={18} strokeWidth={3} />
                                 </div>
                               ) : isExactMatch(item.competitor || "", 'không') ? (
                                 <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 text-rose-600">
                                   <X size={18} strokeWidth={3} />
                                 </div>
                               ) : null}
                               <div 
                                 className="text-center text-sm text-muted-foreground italic"
                                 dangerouslySetInnerHTML={{ __html: formatTextGradients(item.competitor || "Chưa có thông tin") }}
                               />
                            </div>
                          ) : (
                            <div className="w-full space-y-3">
                              {(isExactMatch(item.dscons || "", 'có') || isExactMatch(item.dscons || "", 'không')) && (
                                <div className="flex justify-center gap-4">
                                  <button 
                                    type="button"
                                    title="Có"
                                    className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                                      isExactMatch(item.competitor || "", 'có') 
                                      ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-600 scale-110 shadow-sm" 
                                      : isExactMatch(item.competitor || "", 'không')
                                      ? "opacity-20 grayscale bg-muted/10 border-border text-muted-foreground"
                                      : "bg-emerald-500/5 border-emerald-500/20 text-emerald-600/50 hover:bg-emerald-500/10"
                                    }`}
                                    onClick={() => {
                                      const current = item.competitor || "";
                                      if (isExactMatch(current, 'có')) {
                                        handleInputChange(catIdx, itemIdx, current.replace(/có/gi, "").trim());
                                      } else {
                                        handleInputChange(catIdx, itemIdx, "Có " + current.replace(/không/gi, "").trim());
                                      }
                                    }}
                                  >
                                    <Check size={18} strokeWidth={3} />
                                  </button>
                                  <button 
                                    type="button"
                                    title="Không"
                                    className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                                      isExactMatch(item.competitor || "", 'không') 
                                      ? "bg-rose-500/15 border-rose-500/50 text-rose-600 scale-110 shadow-sm" 
                                      : isExactMatch(item.competitor || "", 'có')
                                      ? "opacity-20 grayscale bg-muted/10 border-border text-muted-foreground"
                                      : "bg-rose-500/5 border-rose-500/20 text-rose-600/50 hover:bg-rose-500/10"
                                    }`}
                                    onClick={() => {
                                      const current = item.competitor || "";
                                      if (isExactMatch(current, 'không')) {
                                        handleInputChange(catIdx, itemIdx, current.replace(/không/gi, "").trim());
                                      } else {
                                        handleInputChange(catIdx, itemIdx, "Không " + current.replace(/có/gi, "").trim());
                                      }
                                    }}
                                  >
                                    <X size={18} strokeWidth={3} />
                                  </button>
                                </div>
                              )}
                              <textarea
                                value={item.competitor}
                                onChange={(e) => handleInputChange(catIdx, itemIdx, e.target.value)}
                                placeholder="Ghi chú thêm..."
                                rows={2}
                                className="w-full bg-background border border-border rounded-xl p-3 text-[13px] text-foreground focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all resize-none shadow-sm placeholder:text-muted-foreground/50"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )})
                    }
                  </div>
                </div>
              )})}
            </div>
          </div>
        </div>

        {/* Footer / AI Verdict Section removed from here, moved to separate Modal */}
      </motion.div>
    </div>
  );
};

export default function CourseComparison({ data: previewData, isPreview = false }: { data?: any; isPreview?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [aiData, setAiData] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [localData, setLocalData] = useState<any[]>([]);
  const [studentNeed, setStudentNeed] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      const data = previewData || await getSectionData("comparison");
      let content = data?.published_content || data?.draft_content || data;
      if (!content || !content.categories) {
        content = { title: "So sánh chất lượng khóa học", categories: [], buttonText: "Bắt đầu so sánh tự động", description: "" };
      }
      setConfig(content);
      
      // Load saved draft from localStorage if available
      const savedDraft = localStorage.getItem("dscons_comparison_draft");
      const savedNeed = localStorage.getItem("dscons_student_need");
      
      if (savedNeed && !isPreview) {
        setStudentNeed(savedNeed);
      }
      
      if (savedDraft && !isPreview) {
        try {
          const parsedDraft = JSON.parse(savedDraft);
          // Check if parsedDraft structure matches current config structure
          if (parsedDraft.length === (Array.isArray(content.categories) ? content.categories.length : 0)) {
            setLocalData(parsedDraft);
            return;
          }
        } catch (e) {
          console.error("Lỗi khi load dữ liệu so sánh tạm:", e);
        }
      }
      
      setLocalData((Array.isArray(content.categories) ? content.categories : []).map((cat: any) => ({ ...cat, items: (Array.isArray(cat.items) ? cat.items : []).map((item: any) => ({ ...item, competitor: "" })) })));
    };
    loadData();
  }, [previewData]);

  const handleStudentNeedChange = (value: string) => {
    setStudentNeed(value);
    if (!isPreview) {
      localStorage.setItem("dscons_student_need", value);
    }
  };

  const handleInputChange = (catIdx: number, itemIdx: number, value: string) => {
    const newData = [...localData];
    if (newData[catIdx] && newData[catIdx].items[itemIdx]) {
      newData[catIdx].items[itemIdx].competitor = value;
      setLocalData(newData);
      if (!isPreview) {
        localStorage.setItem("dscons_comparison_draft", JSON.stringify(newData));
      }
    }
  };

  const handleAIAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const dataForAI = localData.flatMap(cat => 
        (Array.isArray(cat.items) ? cat.items : []).map((item: any) => ({ 
          category: cat.name, 
          criterion: item.label, 
          dscons: item.dscons, 
          competitor: item.competitor || "Chưa có thông tin" 
        }))
      );

      // Async save query to DB
      if (!isPreview) {
        saveCompetitorQuery(
          studentNeed || "Chưa nhập nhu cầu", 
          studentNeed, 
          dataForAI
        ).catch(err => console.error("Could not save query", err));
      }

      const result = await analyzeCompetitor(dataForAI, studentNeed);
      
      if (result && result.aiData) {
        setAiData(result.aiData);
        setIsResultModalOpen(true);
        toast.success("AI đã hoàn tất nhận định!");
      } else {
        throw new Error("AI không trả về kết luận. Vui lòng thử lại.");
      }
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi phân tích AI");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!config) return null;

  if (isPreview) {
    return (
      <div className="w-full bg-card rounded-[2rem] border border-border shadow-xl overflow-hidden">
        <div className="p-4 md:p-6">
           <ComparisonModal 
             isOpen={true} 
             setIsOpen={() => {}} 
             config={config} 
             localData={localData} 
             handleInputChange={handleInputChange} 
             handleAIAnalyze={handleAIAnalyze} 
             isAnalyzing={isAnalyzing} 
             showResult={isResultModalOpen} 
             aiData={aiData} 
             isStatic={true} 
             studentNeed={studentNeed}
             setStudentNeed={handleStudentNeedChange}
           />
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
        className="flex flex-col items-center justify-center mt-24 md:mt-32 mb-8 px-4 text-center relative"
      >
        <div className="absolute -inset-20 bg-primary/10 blur-[80px] rounded-full z-0 pointer-events-none" />
        
        <div className="relative z-10 mb-7 flex flex-col items-center gap-3">
           <motion.span 
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-black uppercase tracking-widest inline-flex items-center gap-2 shadow-sm"
           >
             <Sparkles size={14} /> {config.ctaBadge || "Tính năng độc quyền"}
           </motion.span>
           
           <h4 
             className="text-2xl md:text-[28px] font-black text-foreground max-w-lg leading-[1.2] tracking-tight"
             dangerouslySetInnerHTML={{ __html: formatTextGradients(config?.ctaTitle || "Bạn vẫn còn đang phân vân?") }}
           />
           
           <p 
             className="text-muted-foreground text-[15px] md:text-base max-w-md font-medium leading-relaxed"
             dangerouslySetInnerHTML={{
               __html: formatTextGradients(config?.ctaDescription || 'Hãy để <span class="font-bold text-primary">Trợ lý AI</span> tự động phân tích và so sánh chi tiết giúp bạn đưa ra quyết định tốt nhất!')
             }}
           />
        </div>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full max-w-sm relative z-10">
          <Button 
            onClick={() => setIsOpen(true)} 
            className="w-full bg-primary hover:opacity-90 text-white px-8 py-10 rounded-[2rem] text-lg md:text-xl font-black gap-4 transition-all shadow-xl shadow-primary/20 group border-b-4 border-primary-dark/30 active:border-b-0 active:translate-y-1"
          >
            <Bot size={28} className="group-hover:rotate-12 transition-transform" />
            {config.buttonText || "BẮT ĐẦU SO SÁNH TỰ ĐỘNG"}
          </Button>
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <ComparisonModal 
            isOpen={isOpen} 
            setIsOpen={setIsOpen} 
            config={config} 
            localData={localData} 
            handleInputChange={handleInputChange} 
            handleAIAnalyze={handleAIAnalyze} 
            isAnalyzing={isAnalyzing} 
            studentNeed={studentNeed}
            setStudentNeed={handleStudentNeedChange}
          />
        )}
      </AnimatePresence>

      {/* AI Result Modal */}
      <AnimatePresence>
        {isResultModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-background/95 backdrop-blur-xl p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="w-[95vw] max-w-6xl shadow-2xl rounded-[2rem] overflow-hidden border border-border/50 bg-card max-h-[90vh] flex flex-col relative"
            >
              {/* Header */}
              <div className="bg-primary/5 px-6 py-8 md:px-12 md:py-8 border-b border-border relative shrink-0">
                <button 
                  onClick={() => setIsResultModalOpen(false)} 
                  className="absolute top-6 right-6 p-2.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground border border-border bg-background"
                >
                  <X size={20} />
                </button>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
                    <Bot size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-3xl font-black text-foreground uppercase tracking-tight">Báo Cáo Phân Tích Khách Quan</h3>
                    <p className="text-sm md:text-base text-muted-foreground mt-1">Được thực hiện bởi AI Chuyên gia kiểm định chất lượng đào tạo BIM</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar flex-1 bg-muted/10">
                {aiData && (
                  <div className="space-y-10">
                    {/* Intro */}
                    <div
                      className="bg-background rounded-2xl p-6 md:p-8 shadow-sm border border-border/50 text-foreground text-base md:text-lg leading-relaxed [&>strong]:font-black [&>strong]:text-primary"
                      dangerouslySetInnerHTML={{ __html: sanitizeAIHtml(aiData.intro, true) }}
                    />

                    {/* Table */}
                    <div className="overflow-x-auto rounded-2xl border border-border shadow-sm">
                      <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                          <tr className="bg-primary/5 text-primary text-sm uppercase tracking-wider">
                            <th className="p-5 border-b border-r border-border/50 font-black w-1/5">Nhóm nội dung</th>
                            <th className="p-5 border-b border-r border-border/50 font-black w-1/5">DSCons</th>
                            <th className="p-5 border-b border-r border-border/50 font-black w-1/5 text-muted-foreground">Trung tâm khác</th>
                            <th className="p-5 border-b border-border/50 font-black w-2/5">Đánh giá chuyên môn</th>
                          </tr>
                        </thead>
                        <tbody className="bg-background">
                          {(Array.isArray(aiData.table) ? aiData.table : []).map((row: any, i: number) => (
                            <tr key={i} className="hover:bg-muted/30 transition-colors">
                              <td className="p-5 border-b border-r border-border/50 font-bold text-foreground align-top">
                                {row.criteria}
                              </td>
                              <td className="p-5 border-b border-r border-border/50 font-semibold text-primary align-top [&>ul]:list-disc [&>ul]:pl-4 [&>ul>li]:mb-2" dangerouslySetInnerHTML={{ __html: sanitizeAIHtml(row.dscons) }}>
                              </td>
                              <td className="p-5 border-b border-r border-border/50 text-muted-foreground align-top [&>ul]:list-disc [&>ul]:pl-4 [&>ul>li]:mb-2" dangerouslySetInnerHTML={{ __html: sanitizeAIHtml(row.other) }}>
                              </td>
                              <td className="p-5 border-b border-border/50 text-foreground align-top leading-relaxed [&>ul]:list-none [&>ul]:pl-0 [&>ul>li]:mb-3 [&>ul>li>strong]:text-primary" dangerouslySetInnerHTML={{ __html: sanitizeAIHtml(row.evaluation) }}>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Conclusion */}
                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-10">
                      <h3 className="text-xl md:text-2xl font-black text-primary mb-6 flex items-center gap-3">
                        <Sparkles className="text-primary" size={28} />
                        {aiData.conclusionTitle || "Kết Luận Chuyên Môn"}
                      </h3>
                      <ul className="space-y-4">
                        {(Array.isArray(aiData.conclusionPoints) ? aiData.conclusionPoints : []).map((point: string, i: number, arr: string[]) => {
                          const isLast = i === arr.length - 1;
                          if (isLast) {
                            return (
                              <motion.li 
                                key={i} 
                                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                animate={{ 
                                  opacity: 1, 
                                  y: 0, 
                                  scale: 1,
                                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                                }}
                                transition={{ 
                                  opacity: { duration: 0.7, delay: 0.2 },
                                  y: { duration: 0.7, delay: 0.2, type: "spring" },
                                  scale: { duration: 0.7, delay: 0.2, type: "spring" },
                                  backgroundPosition: { repeat: Infinity, duration: 5, ease: "easeInOut" }
                                }}
                                className="flex gap-4 items-start bg-[length:200%_200%] bg-gradient-to-r from-red-600/10 via-rose-500/20 to-red-700/10 border-2 border-red-500/50 p-6 md:p-8 rounded-2xl shadow-2xl shadow-red-500/20 mt-8 relative overflow-hidden group"
                              >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-rose-400 to-red-600 opacity-80" />
                                
                                <motion.div 
                                  animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                  className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/30 blur-[40px] rounded-full pointer-events-none"
                                />

                                <div className="mt-1 bg-gradient-to-br from-red-600 to-rose-700 p-3 rounded-2xl text-white shadow-lg shadow-red-500/40 shrink-0 relative z-10">
                                  <Sparkles size={28} strokeWidth={2.5} className="animate-bounce" />
                                </div>
                                <span className="leading-relaxed text-foreground md:text-xl font-bold [&>strong]:text-red-600 dark:[&>strong]:text-red-400 relative z-10" dangerouslySetInnerHTML={{ __html: sanitizeAIHtml(point.replace(/Khuyến nghị TÓM LẠI:/i, '')) }}></span>
                              </motion.li>
                            );
                          }
                          return (
                            <li key={i} className="flex gap-4 items-start text-foreground text-base md:text-lg">
                              <div className="mt-1 bg-primary/20 p-1 rounded-full text-primary shrink-0">
                                <Check size={16} strokeWidth={3} />
                              </div>
                              <span className="leading-relaxed [&>strong]:text-primary" dangerouslySetInnerHTML={{ __html: sanitizeAIHtml(point) }}></span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer CTA */}
              <div className="p-6 border-t border-border bg-muted/20 flex justify-end shrink-0">
                <Button onClick={() => setIsResultModalOpen(false)} className="bg-primary text-white font-bold rounded-xl px-10 py-6 text-lg hover:scale-105 transition-transform">
                  Đã hiểu, đóng báo cáo
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
