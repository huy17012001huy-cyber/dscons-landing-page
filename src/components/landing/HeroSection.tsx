import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import ScrollAnimate from "./ScrollAnimate";
import { formatTextGradients } from "@/lib/textUtils";

const HeroSection = () => (
  <section className="pt-28 pb-20 sm:pt-36 sm:pb-28 relative overflow-hidden bg-background">
    {/* Grid Pattern & Blur Effects */}
    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 pointer-events-none" />
    <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
    <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 translate-y-1/2" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10">
      <ScrollAnimate>
        <div className="space-y-8">
          <span 
            className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20 backdrop-blur-sm"
            dangerouslySetInnerHTML={{ __html: formatTextGradients("Dành cho Kỹ sư MEP, Giám sát công trường & Sinh viên chuyên ngành") }}
          />
          <h1 
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-[1.1] text-foreground tracking-tight drop-shadow-sm"
            dangerouslySetInnerHTML={{ __html: formatTextGradients("Khóa Học Revit MEP\n**Thực Chiến**\nToàn Diện") }}
          />
          <p 
            className="text-xl text-muted-foreground max-w-xl leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatTextGradients("Làm chủ quy trình dựng hình, phối hợp các hệ thống Cơ - Điện - Nước - PCCC bằng Revit MEP. Cấp bộ thư viện Family và Template chuẩn, áp dụng ngay vào dự án thực tế.") }}
          />
          <div className="pt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <a 
              href="#pricing"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="relative inline-flex items-center justify-center gap-3 font-black transition-all duration-300 ease-out text-white bg-gradient-to-br from-[#33AAEF] via-[#1978DC] to-[#145DAA] shadow-[0_20px_40px_-12px_rgba(25,120,220,0.5)] hover:shadow-[0_25px_50px_-12px_rgba(25,120,220,0.6)] hover:-translate-y-1 active:translate-y-0 px-8 py-6 rounded-xl text-lg w-full sm:w-auto overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                Đăng ký nhận ưu đãi Early Bird
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1.5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
            </a>
            <Button variant="ghost" size="lg" className="text-muted-foreground hover:text-foreground gap-2 py-7 transition-colors">
              <Play className="w-5 h-5" /> Gặp gỡ Giảng viên
            </Button>
          </div>
        </div>
      </ScrollAnimate>
      <ScrollAnimate delay={200}>
        <div className="relative group perspective-1000">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary to-blue-600 rounded-3xl blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
          <div className="aspect-[4/3] rounded-3xl bg-card border border-white/10 overflow-hidden flex items-center justify-center shadow-2xl relative z-10 transform transition-transform duration-700 rotate-y-3 group-hover:rotate-y-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            
            <div className="text-center space-y-6 relative z-20 cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 flex items-center justify-center mx-auto group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-300 shadow-[0_0_30px_rgba(25,120,220,0.3)]">
                <Play className="w-8 h-8 text-primary ml-1 group-hover:text-white transition-colors" />
              </div>
              <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm">Xem Trailer Khóa Học</p>
            </div>
            
            {/* UI Mockup Decorators */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center opacity-50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="w-24 h-2 bg-white/10 rounded-full" />
            </div>
          </div>
        </div>
      </ScrollAnimate>
    </div>
  </section>
);

export default HeroSection;
