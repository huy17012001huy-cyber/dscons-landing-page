import { Button } from "@/components/ui/button";
import ScrollAnimate from "./ScrollAnimate";

const BottomCTA = () => (
  <section className="py-20 bg-foreground">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <ScrollAnimate>
        <div className="space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-background leading-snug">
            Số lượng học viên mỗi lớp có hạn để đảm bảo chất lượng hỗ trợ thực hành tốt nhất. Giữ chỗ của bạn ngay hôm nay!
          </h2>
          <Button
            size="lg"
            className="bg-[hsl(var(--cta))] hover:bg-[hsl(var(--cta))]/90 text-[hsl(var(--cta-foreground))] text-xl px-12 py-7 font-bold shadow-xl hover:shadow-2xl transition-all animate-pulse"
          >
            Điền Form Đăng Ký Ngay
          </Button>
        </div>
      </ScrollAnimate>
    </div>
  </section>
);

export default BottomCTA;
