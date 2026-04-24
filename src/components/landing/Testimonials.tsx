import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ScrollAnimate from "./ScrollAnimate";

const reviews = [
  { name: "Nguyễn Văn A", role: "Kỹ sư MEP", quote: "Khóa học rất thực tế, bộ thư viện được cấp giúp mình tiết kiệm 50% thời gian triển khai dự án." },
  { name: "Trần Thị B", role: "Sinh viên năm 4", quote: "Giảng viên hướng dẫn rất tận tình, mình từ zero đã có thể tự tin làm dự án Revit MEP." },
  { name: "Lê Hoàng C", role: "Giám sát công trường", quote: "Template và Family chuẩn giúp team mình thống nhất workflow, tăng năng suất đáng kể." },
];

const Testimonials = () => (
  <section className="py-20 bg-background">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollAnimate>
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-4">Học viên nói gì?</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Những phản hồi thực tế từ các kỹ sư và sinh viên đã tham gia khóa học.</p>
      </ScrollAnimate>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {reviews.map((r, i) => (
          <ScrollAnimate key={r.name} delay={i * 150}>
            <Card className="border-border hover:shadow-lg transition-shadow h-full">
              <CardContent className="p-6 space-y-4">
                <Quote className="w-8 h-8 text-primary/30" />
                <p className="text-foreground leading-relaxed italic">"{r.quote}"</p>
                <div className="flex items-center gap-1 text-[hsl(var(--cta))]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{r.name}</p>
                  <p className="text-sm text-muted-foreground">{r.role}</p>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimate>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {[1, 2].map((n) => (
          <ScrollAnimate key={n} delay={n * 100}>
            <div className="aspect-video rounded-xl bg-muted border border-border flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Hình ảnh dự án MEP 3D - Placeholder #{n}</p>
            </div>
          </ScrollAnimate>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
