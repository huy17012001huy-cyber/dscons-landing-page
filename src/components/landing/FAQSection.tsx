import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import ScrollAnimate from "./ScrollAnimate";

const faqs = [
  { q: "Khóa học diễn ra qua Zoom thì có được xem lại video không?", a: "Có, tất cả các buổi học đều được ghi hình và gửi lại cho học viên sau mỗi buổi. Bạn có thể xem lại không giới hạn số lần trong suốt thời gian khóa học." },
  { q: "Chưa biết gì về Revit có theo học được khóa MEP này không?", a: "Khóa học được thiết kế từ cơ bản đến nâng cao nên hoàn toàn phù hợp cho người mới bắt đầu. Giảng viên sẽ hướng dẫn từng bước từ giao diện Revit đến triển khai dự án thực tế." },
  { q: "Chính sách thanh toán và bảo lưu khóa học ra sao?", a: "Học viên có thể thanh toán một lần hoặc chia thành 2 đợt. Chính sách bảo lưu linh hoạt, cho phép bảo lưu tối đa 1 khóa kế tiếp nếu có lý do chính đáng." },
];

const FAQSection = () => (
  <section className="py-20 bg-muted/30">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollAnimate>
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-4">Câu hỏi thường gặp</h2>
        <p className="text-center text-muted-foreground mb-12">Những thắc mắc phổ biến từ học viên trước khi đăng ký khóa học.</p>
      </ScrollAnimate>
      <ScrollAnimate delay={150}>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-background rounded-xl border border-border px-6">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollAnimate>
    </div>
  </section>
);

export default FAQSection;
