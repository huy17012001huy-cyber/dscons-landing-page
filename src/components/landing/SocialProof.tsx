import { Users, HeadphonesIcon, ShieldCheck } from "lucide-react";
import ScrollAnimate from "./ScrollAnimate";

const stats = [
  { icon: Users, value: "+1000", label: "Học viên đã tốt nghiệp" },
  { icon: HeadphonesIcon, value: "24/7", label: "Hỗ trợ qua Cộng đồng Zalo" },
  { icon: ShieldCheck, value: "100%", label: "Cam kết chất lượng đầu ra" },
];

const logos = ["Autodesk Revit", "Navisworks", "BIM 360"];

const SocialProof = () => (
  <section className="py-12 bg-muted/50 border-y border-border">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollAnimate>
        <div className="flex flex-wrap items-center justify-center gap-8 mb-10">
          {logos.map((name) => (
            <div key={name} className="px-6 py-3 rounded-lg bg-background border border-border text-muted-foreground text-sm font-medium">
              {name}
            </div>
          ))}
        </div>
      </ScrollAnimate>
      <div className="grid sm:grid-cols-3 gap-8">
        {stats.map((s, i) => (
          <ScrollAnimate key={s.label} delay={i * 150}>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <s.icon className="w-6 h-6 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">{s.value}</p>
              <p className="text-muted-foreground text-sm">{s.label}</p>
            </div>
          </ScrollAnimate>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProof;
