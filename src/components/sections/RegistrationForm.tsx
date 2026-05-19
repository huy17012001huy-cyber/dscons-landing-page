import { useState } from "react";
import { Send, User, Phone, Briefcase, AlertCircle, Target, CheckCircle2 } from "lucide-react";

const RegistrationForm = () => {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      // THAY THẾ LINK NÀY BẰNG LINK FORMSPREE CỦA BẠN (ví dụ: https://formspree.io/f/xyzababc)
      const response = await fetch("https://formspree.io/f/xaqknddj", {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <section id="registration" className="py-24 relative overflow-hidden bg-muted/30">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] -z-10" />

      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
            <Target className="w-4 h-4" />
            <span>Đăng ký tham gia</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Đăng Ký Tham Gia Khóa Học
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Vui lòng điền thông tin bên dưới để chúng tôi có thể hỗ trợ bạn tốt nhất.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            <div className="relative bg-background/80 backdrop-blur-xl rounded-2xl p-6 md:p-10 border border-white/10 shadow-2xl">

              {status === "success" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
                  <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Đăng Ký Thành Công!</h3>
                  <p className="text-muted-foreground">
                    Cảm ơn bạn đã đăng ký. Đội ngũ tư vấn sẽ liên hệ với bạn trong thời gian sớm nhất.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-8 px-6 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    Gửi thêm lượt đăng ký
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Tên */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-foreground flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      Họ và tên của bạn là gì? <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      id="name"
                      name="Họ và tên"
                      placeholder="Nhập họ và tên đầy đủ..."
                      className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    />
                  </div>

                  {/* SĐT */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      Số điện thoại/Zalo của bạn là gì? <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="tel"
                      id="phone"
                      name="Số điện thoại"
                      placeholder="Nhập số điện thoại có sử dụng Zalo..."
                      className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    />
                  </div>

                  {/* Đối tượng */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary" />
                      Bạn đang là sinh viên hay kỹ sư Cơ Điện đã đi làm? <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      <label className="flex items-center p-4 border border-white/10 rounded-xl cursor-pointer hover:bg-muted/80 transition-colors has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                        <input required type="radio" name="Đối tượng" value="Sinh viên" className="w-4 h-4 text-primary bg-background border-muted" />
                        <span className="ml-3 font-medium">Sinh viên Cơ Điện</span>
                      </label>
                      <label className="flex items-center p-4 border border-white/10 rounded-xl cursor-pointer hover:bg-muted/80 transition-colors has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                        <input required type="radio" name="Đối tượng" value="Kỹ sư đã đi làm" className="w-4 h-4 text-primary bg-background border-muted" />
                        <span className="ml-3 font-medium">Kỹ sư đã đi làm</span>
                      </label>
                    </div>
                  </div>

                  {/* Khó khăn */}
                  <div className="space-y-2">
                    <label htmlFor="painpoint" className="text-sm font-medium text-foreground flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-primary" />
                      Khó khăn lớn nhất trong công việc hiện tại của bạn là gì?
                    </label>
                    <textarea
                      id="painpoint"
                      name="Khó khăn gặp phải"
                      rows={3}
                      placeholder="Ví dụ: Chưa rành vẽ 3D, bóc khối lượng hay bị sai..."
                      className="w-full p-4 rounded-xl bg-muted/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none resize-none"
                    />
                  </div>

                  {/* Mong muốn */}
                  <div className="space-y-2">
                    <label htmlFor="goal" className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      Bạn mong muốn khóa học mang lại kỹ năng thực chiến nào nhất?
                    </label>
                    <textarea
                      id="goal"
                      name="Kỹ năng mong muốn"
                      rows={3}
                      placeholder="Ví dụ: Tự tin thiết kế và ra bản vẽ Shopdrawing độc lập..."
                      className="w-full p-4 rounded-xl bg-muted/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] disabled:opacity-70 disabled:cursor-not-allowed mt-8"
                  >
                    {status === "submitting" ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Đang gửi...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Gửi Đăng Ký Ngay
                        <Send className="w-5 h-5 ml-1" />
                      </span>
                    )}
                  </button>

                  {status === "error" && (
                    <p className="text-red-500 text-sm text-center mt-4">
                      Có lỗi xảy ra khi gửi. Vui lòng thử lại sau.
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm;
