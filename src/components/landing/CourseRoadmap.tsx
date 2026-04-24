import { CalendarDays, DollarSign, User } from "lucide-react";
import ScrollAnimate from "./ScrollAnimate";

const phases = [
  { num: 1, title: "Nền tảng Revit MEP & Setup Dự án chuẩn" },
  { num: 2, title: "Dựng hình chi tiết các hệ thống HVAC, Điện, Cấp thoát nước, PCCC" },
  { num: 3, title: "Quản lý hiển thị, Family & Phối hợp xử lý va chạm" },
  { num: 4, title: "Trình bày bản vẽ (Shop drawing), bóc tách khối lượng và In ấn" },
];

const infos = [
  { icon: CalendarDays, label: "Lịch học", value: "12 buổi qua Zoom" },
  { icon: DollarSign, label: "Học phí", value: "Liên hệ tư vấn" },
  { icon: User, label: "Giảng viên", value: "Kỹ sư MEP Senior" },
];

const CourseRoadmap = () => (
  <section className="py-20 bg-muted/30">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollAnimate>
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-4">Lộ trình khóa học</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Chương trình học được thiết kế bài bản từ cơ bản đến nâng cao, phù hợp cho cả người mới bắt đầu.</p>
      </ScrollAnimate>

      <div className="grid lg:grid-cols-3 gap-8 mb-16">
        {infos.map((i, idx) => (
          <ScrollAnimate key={i.label} delay={idx * 100}>
            <div className="flex items-center gap-4 bg-background rounded-xl p-5 border border-border shadow-sm">
              <div className="w-11 h-11 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <i.icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{i.label}</p>
                <p className="font-semibold text-foreground">{i.value}</p>
              </div>
            </div>
          </ScrollAnimate>
        ))}
      </div>

      <div className="relative max-w-2xl mx-auto">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
        <div className="space-y-10">
          {phases.map((p, idx) => (
            <ScrollAnimate key={p.num} delay={idx * 150}>
              <div className="relative flex items-start gap-6 pl-0">
                <div className="relative z-10 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shrink-0">
                  {p.num}
                </div>
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground font-medium">Phase {p.num}</p>
                  <p className="text-foreground font-semibold text-lg">{p.title}</p>
                </div>
              </div>
            </ScrollAnimate>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default CourseRoadmap;
