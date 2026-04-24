import { Wrench, FolderOpen, LifeBuoy, Award } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ScrollAnimate from "./ScrollAnimate";

const benefits = [
  { icon: Wrench, title: "Kỹ năng thực chiến", desc: "Trực tiếp dựng hình, combine hệ thống và xử lý va chạm (Clash Detection) trên dự án thực tế." },
  { icon: FolderOpen, title: "Tài nguyên độc quyền", desc: "Tặng kèm bộ thư viện Family cơ điện và Template Revit MEP độc quyền được setup chuẩn chỉnh." },
  { icon: LifeBuoy, title: "Hỗ trợ trọn đời", desc: "Giải đáp thắc mắc, sửa lỗi model trực tiếp qua Zalo/UltraViewer từ giảng viên." },
  { icon: Award, title: "Chứng nhận & Sự nghiệp", desc: "Nhận chứng nhận hoàn thành và kết nối cơ hội việc làm ngành MEP." },
];

const BenefitsGrid = () => (
  <section className="py-20 bg-background">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollAnimate>
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-4">Bạn sẽ nhận được gì?</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Khóa học được thiết kế giúp bạn tự tin triển khai dự án MEP thực tế ngay sau khi hoàn thành.</p>
      </ScrollAnimate>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((b, i) => (
          <ScrollAnimate key={b.title} delay={i * 100}>
            <Card className="border-border hover:shadow-lg hover:border-primary/30 transition-all group h-full">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <b.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{b.title}</CardTitle>
                <CardDescription className="leading-relaxed">{b.desc}</CardDescription>
              </CardHeader>
            </Card>
          </ScrollAnimate>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsGrid;
