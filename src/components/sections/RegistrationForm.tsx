import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Send, User, Phone, Mail, Briefcase, AlertCircle, Target, CheckCircle2, CreditCard, BookOpen, Gift, ShieldCheck, Check, Sparkles, QrCode, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";

const PACKAGES = [
  {
    id: "revit-mep-thuc-chien",
    name: "Gói Thực Chiến",
    price: 3900000,
    priceDisplay: "3.900.000đ",
    badge: "Phổ biến nhất",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    features: [
      "12 buổi học tương tác Zoom với Giảng viên",
      "5 quà tặng trị giá 6.150K",
      "Chấm bài tập chi tiết mỗi buổi học",
      "Hỗ trợ kỹ thuật 1-1 từ 8h00 - 22h00",
      "Cam kết hoàn tiền 100% nếu không thành thạo",
      "Được đăng ký học lại miễn phí 1 lần"
    ]
  },
  {
    id: "revit-mep-combo",
    name: "Gói Combo",
    price: 6400000,
    priceDisplay: "6.400.000đ",
    badge: "Khuyên dùng",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    features: [
      "Đầy đủ đặc quyền của Gói Thực Chiến",
      "Tặng khóa học thiết lập Template (Trị giá 1.000K)",
      "Mua khóa Combine (Phối hợp hệ) giảm 50% (Chỉ 2.500K)",
      "Tặng khóa viết CV & Kỹ năng đàm phán lương",
      "Duy trì nhóm hỗ trợ Zalo trọn đời sau khóa học"
    ]
  },
  {
    id: "revit-mep-all-in-one",
    name: "Gói All In One",
    price: 12000000,
    priceDisplay: "12.000.000đ",
    badge: "Toàn diện & Trọn đời",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    features: [
      "Đầy đủ đặc quyền Gói Thực Chiến & Combo",
      "Học FREE toàn bộ khóa học trên web trọn đời",
      "Tặng bộ DSCons Tool vĩnh viễn (Trị giá 5.000K)",
      "Nhận trọn bộ 9 quà tặng phát triển kỹ năng",
      "Kết nối giới thiệu việc làm tới đối tác doanh nghiệp"
    ]
  }
];

const RegistrationForm = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPackage, setSelectedPackage] = useState<string>("revit-mep-combo");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  useEffect(() => {
    const pkgParam = searchParams.get("package");
    if (pkgParam) {
      const found = PACKAGES.find(p => p.id === pkgParam || p.id.toLowerCase().includes(pkgParam.toLowerCase()) || pkgParam.toLowerCase().includes(p.id.toLowerCase()));
      if (found) {
        setSelectedPackage(found.id);
      }
    }
  }, [searchParams]);
  
  // Thông tin đăng ký lưu trữ tạm thời để tạo đơn hàng
  const [registrationData, setRegistrationData] = useState<{
    orderId: string;
    name: string;
    phone: string;
    amount: number;
    downloadUrl: string;
  } | null>(null);

  // Chế độ Test giao dịch 2.000đ (Bật mặc định để kiểm nghiệm webhook siêu mượt)
  const [isTestMode, setIsTestMode] = useState<boolean>(true);
  const [isTestModeAllowed, setIsTestModeAllowed] = useState<boolean>(true);
  const [paymentCompleted, setPaymentCompleted] = useState<boolean>(false);

  // Cấu hình ngân hàng & test mode động từ database
  const [BANK_ACCOUNT, setBankAccount] = useState<string>("105870479657");
  const [BANK_CODE, setBankCode] = useState<string>("VietinBank");
  const [bankOwner, setBankOwner] = useState<string>("PHAM QUANG HUY");

  useEffect(() => {
    const fetchSystemSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("system_settings")
          .select("key, value");
        
        if (data && !error) {
          const testModeVal = data.find(s => s.key === "is_test_mode")?.value;
          const bankAccVal = data.find(s => s.key === "bank_account")?.value;
          const bankCodeVal = data.find(s => s.key === "bank_code")?.value;
          const bankOwnerVal = data.find(s => s.key === "bank_owner")?.value;

          if (testModeVal !== undefined) {
            const isAllowed = testModeVal === "true";
            setIsTestModeAllowed(isAllowed);
            setIsTestMode(isAllowed);
          }
          if (bankAccVal) setBankAccount(bankAccVal);
          if (bankCodeVal) setBankCode(bankCodeVal);
          if (bankOwnerVal) setBankOwner(bankOwnerVal);
        }
      } catch (err) {
        console.error("Lỗi khi tải cấu hình hệ thống từ Supabase:", err);
      }
    };

    fetchSystemSettings();
  }, []);

  // Polling cơ sở dữ liệu Supabase để tự động phát hiện trạng thái đơn hàng thành công
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;
    if (step === 3 && registrationData && !paymentCompleted) {
      intervalId = setInterval(async () => {
        try {
          const { data, error } = await supabase
            .from("orders")
            .select("status")
            .eq("id", registrationData.orderId)
            .single();

          if (data && data.status === "completed") {
            setPaymentCompleted(true);
            setStatus("success");
            clearInterval(intervalId);
          }
        } catch (err) {
          console.error("Lỗi khi kiểm tra trạng thái đơn hàng:", err);
        }
      }, 4000); // Mỗi 4 giây quét 1 lần
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [step, registrationData, paymentCompleted]);

  const handleNextStep = () => {
    setStep(2);
    // Tự động cuộn mượt lên đầu form đăng ký
    const element = document.getElementById("registration-form-box");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBackStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("Họ và tên") as string;
    const phone = formData.get("Số điện thoại") as string;
    const email = formData.get("Email") as string;
    const role = formData.get("Đối tượng") as string;
    const painpoint = formData.get("Khó khăn gặp phải") as string;
    const goal = formData.get("Kỹ năng mong muốn") as string;

    const chosenPkg = PACKAGES.find(p => p.id === selectedPackage)!;
    const finalAmount = isTestMode ? 2000 : chosenPkg.price;
    const fakeDownloadUrl = chosenPkg.id === "revit-mep-thuc-chien" 
      ? "https://drive.google.com/drive/folders/1_revit_mep_thuc_chien_gifts_fake" 
      : chosenPkg.id === "revit-mep-combo" 
      ? "https://drive.google.com/drive/folders/2_revit_mep_combo_gifts_fake" 
      : "https://drive.google.com/drive/folders/3_revit_mep_all_in_one_gifts_fake";

    try {
      // 1. Thêm/Cập nhật thông tin học viên vào Supabase
      const { data: existingCustomer } = await supabase
        .from("customers")
        .select("emails_sent")
        .eq("phone", phone)
        .maybeSingle();

      const isTest = email.toLowerCase().includes('+test');
      const newRegEmails = isTest
        ? ["Email 1: Chào mừng (Waitlist)", "Email 2: Bài học xương máu (Nurture)", "Email 3: Chốt lộ trình (Sales)"]
        : ["Email 1: Chào mừng (Waitlist)"];

      const emailsList = existingCustomer?.emails_sent 
        ? existingCustomer.emails_sent.split(",").map(e => e.trim()).filter(Boolean) 
        : [];

      newRegEmails.forEach(e => {
        if (!emailsList.includes(e)) {
          emailsList.push(e);
        }
      });
      const finalEmails = emailsList.join(", ");

      const { error: customerError } = await supabase
        .from("customers")
        .upsert({
          name: name,
          phone: phone,
          email: email,
          role: role,
          painpoint: painpoint,
          goal: goal,
          emails_sent: finalEmails
        }, { onConflict: "phone" });

      if (customerError) throw customerError;

      // 2. Tạo ID đơn hàng ngẫu nhiên duy nhất
      const orderId = `DS-${Date.now().toString().slice(-6)}`;

      // 3. Tạo đơn hàng trạng thái pending
      const { error: orderError } = await supabase
        .from("orders")
        .insert({
          id: orderId,
          customer_phone: phone,
          customer_name: name,
          product_id: selectedPackage,
          amount: finalAmount,
          status: "pending"
        });

      if (orderError) throw orderError;

      // 3.5. Kích hoạt gửi chuỗi email qua Resend API bảo mật
      try {
        await fetch('/api/send-sequence', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            name: name
          })
        });
        console.log("Email sequence triggered successfully.");
      } catch (emailErr) {
        console.error("Lỗi kích hoạt gửi email sequence:", emailErr);
      }

      // 4. Lưu thông tin đăng ký để hiển thị QR thanh toán
      setRegistrationData({
        orderId: orderId,
        name: name,
        phone: phone,
        amount: finalAmount,
        downloadUrl: fakeDownloadUrl
      });

      setStatus("idle");
      setStep(3);

      // Cuộn lên đầu
      const element = document.getElementById("registration-form-box");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }

    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      setStatus("error");
    }
  };

  // Hàm giả lập thanh toán thành công (dành cho chế độ Test giúp dev/user xác nhận nhanh mà không cần chuyển tiền thật)
  const handleSimulatePayment = async () => {
    if (!registrationData) return;
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          status: "completed",
          sepay_transaction_id: `SIMULATED-${Date.now()}`,
          payment_date: new Date().toISOString()
        })
        .eq("id", registrationData.orderId);

      if (error) throw error;
      setPaymentCompleted(true);
      setStatus("success");
    } catch (err) {
      console.error("Lỗi giả lập thanh toán:", err);
    }
  };

  return (
    <section id="registration" className="py-24 relative overflow-hidden bg-muted/30">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] -z-10" />

      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
            <Sparkles className="w-4 h-4" />
            <span>DSCons Tuyển Sinh 2026</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Đăng Ký Khóa Học Revit MEP
          </h2>
          <p className="text-muted-foreground text-lg">
            Học thực chiến từ chuyên gia hàng đầu — Sở hữu kỹ năng làm việc vượt trội & Quà tặng tài liệu cao cấp.
          </p>
        </div>

        {/* Tiến Trình Các Bước Đăng Ký */}
        <div className="max-w-4xl mx-auto mb-10 flex items-center justify-between px-4 md:px-20 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
          <div className={`absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500`} 
               style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }} />

          <button onClick={() => step > 1 && setStep(1)} className="relative z-10 flex flex-col items-center gap-2 focus:outline-none">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border transition-all duration-300 ${
              step >= 1 ? "bg-primary border-primary text-white" : "bg-background border-white/10 text-muted-foreground"
            }`}>
              {step > 1 ? <Check className="w-5 h-5" /> : "1"}
            </div>
            <span className={`text-xs font-semibold ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>Chọn gói học</span>
          </button>

          <button onClick={() => step > 2 && setStep(2)} className="relative z-10 flex flex-col items-center gap-2 focus:outline-none">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border transition-all duration-300 ${
              step >= 2 ? "bg-primary border-primary text-white" : "bg-background border-white/10 text-muted-foreground"
            }`}>
              {step > 2 ? <Check className="w-5 h-5" /> : "2"}
            </div>
            <span className={`text-xs font-semibold ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>Thông tin đăng ký</span>
          </button>

          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border transition-all duration-300 ${
              step === 3 ? "bg-primary border-primary text-white" : "bg-background border-white/10 text-muted-foreground"
            }`}>
              {paymentCompleted ? <Check className="w-5 h-5" /> : "3"}
            </div>
            <span className={`text-xs font-semibold ${step === 3 ? "text-primary" : "text-muted-foreground"}`}>Thanh toán an toàn</span>
          </div>
        </div>

        {/* Khung Nội Dung Form */}
        <div id="registration-form-box" className="max-w-4xl mx-auto">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
              {/* Toggle chế độ Test của Vực phát triển */}
              {isTestModeAllowed && (
                <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-2xl max-w-lg mx-auto">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <div>
                      <h4 className="text-sm font-bold">Chế độ Test Giao Dịch 2.000đ</h4>
                      <p className="text-xs text-muted-foreground">Quét mã và chuyển khoản 2,000 VNĐ tiền thật để xác minh webhook.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={isTestMode} onChange={(e) => setIsTestMode(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              )}

              {/* Grid 3 Gói Khóa học thiết kế cao cấp */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PACKAGES.map((pkg) => (
                  <div 
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`relative rounded-2xl p-6 border transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-xl ${
                      selectedPackage === pkg.id 
                        ? "bg-background/80 border-primary shadow-[0_0_25px_rgba(37,99,235,0.15)] scale-[1.03]" 
                        : "bg-background/40 border-white/5 hover:border-white/15 hover:scale-[1.01]"
                    }`}
                  >
                    {/* Đường viền Gradient khi được chọn */}
                    {selectedPackage === pkg.id && (
                      <div className="absolute -inset-px bg-gradient-to-b from-primary to-blue-600 rounded-2xl -z-10 opacity-30 blur-[2px]" />
                    )}

                    <div>
                      {/* Tiêu đề & Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${pkg.badgeColor}`}>
                          {pkg.badge}
                        </span>
                        {selectedPackage === pkg.id && (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{pkg.name}</h3>
                      <div className="flex items-baseline gap-1.5 mb-6">
                        <span className="text-3xl font-extrabold text-foreground">{pkg.priceDisplay}</span>
                      </div>

                      {/* Danh sách đặc quyền */}
                      <ul className="space-y-3 mb-8">
                        {pkg.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPackage(pkg.id);
                        handleNextStep();
                      }}
                      className={`w-full py-3.5 rounded-xl font-bold transition-all text-sm ${
                        selectedPackage === pkg.id
                          ? "bg-primary text-white hover:bg-primary/95 shadow-lg shadow-primary/20"
                          : "bg-white/5 text-foreground hover:bg-white/10"
                      }`}
                    >
                      Đăng ký gói này
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStep}
                  className="px-10 py-4 rounded-xl bg-primary text-white font-bold text-base flex items-center gap-2 hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:scale-[1.02]"
                >
                  Tiếp tục điền thông tin
                  <Send className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-500">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-45 transition duration-1000" />
                <div className="relative bg-background/90 backdrop-blur-xl rounded-2xl p-6 md:p-10 border border-white/10 shadow-2xl">
                  
                  {/* Tóm tắt gói đã chọn */}
                  <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Gói học đã chọn:</p>
                      <h4 className="font-bold text-foreground">
                        {PACKAGES.find(p => p.id === selectedPackage)?.name}
                      </h4>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Số tiền thanh toán:</p>
                      <h4 className="font-bold text-primary text-lg">
                        {isTestMode ? "2.000 VNĐ (Chế độ Test)" : PACKAGES.find(p => p.id === selectedPackage)?.priceDisplay}
                      </h4>
                    </div>
                  </div>

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

                    {/* Email */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        Địa chỉ Email của bạn là gì? <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="email"
                        id="email"
                        name="Email"
                        placeholder="Ví dụ: nguyenvana@gmail.com..."
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
                        rows={2}
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
                        rows={2}
                        placeholder="Ví dụ: Tự tin thiết kế và ra bản vẽ Shopdrawing độc lập..."
                        className="w-full p-4 rounded-xl bg-muted/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none resize-none"
                      />
                    </div>

                    {/* Các nút bấm */}
                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={handleBackStep}
                        className="w-1/3 h-14 rounded-xl border border-white/10 text-foreground font-bold hover:bg-white/5 transition-colors"
                      >
                        Quay lại chọn gói
                      </button>

                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="w-2/3 h-14 rounded-xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {status === "submitting" ? (
                          <span className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Đang xử lý...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Đăng Ký & Nhận Mã QR
                            <Send className="w-5 h-5 ml-1" />
                          </span>
                        )}
                      </button>
                    </div>

                    {status === "error" && (
                      <p className="text-red-500 text-sm text-center mt-4">
                        Có lỗi kết nối cơ sở dữ liệu. Vui lòng thử lại sau.
                      </p>
                    )}
                  </form>
                </div>
              </div>
            </div>
          )}

          {step === 3 && registrationData && (
            <div className="max-w-3xl mx-auto animate-in zoom-in duration-500">
              {!paymentCompleted ? (
                // MÀN HÌNH CHỜ THANH TOÁN QR
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-30" />
                  <div className="relative bg-background/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6 md:p-10">
                    
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                        <QrCode className="w-6 h-6 text-primary" />
                        Quét Mã QR Chuyển Khoản An Toàn
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Giao dịch được xử lý hoàn toàn tự động qua cổng bảo mật Sepay.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      {/* Cột 1: Mã QR nhận tiền tự động điền thông số */}
                      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-white/10">
                        <img 
                          src={`https://qr.sepay.vn/img?acc=${BANK_ACCOUNT}&bank=${BANK_CODE}&amount=${registrationData.amount}&des=SEVQR%20DS${registrationData.phone}`}
                          alt="VietQR Code" 
                          className="w-64 h-64 object-contain"
                        />
                        <div className="mt-4 text-center">
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100 flex items-center gap-1.5 justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            Số tiền + Nội dung tự động 100%
                          </span>
                        </div>
                      </div>

                      {/* Cột 2: Thông tin chuyển khoản & Trạng thái */}
                      <div className="space-y-5">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2 text-sm">
                          <div className="flex justify-between"><span className="text-muted-foreground">Khách hàng:</span><span className="font-semibold">{registrationData.name}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Mã đơn hàng:</span><span className="font-semibold text-primary">{registrationData.orderId}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Học phí cần đóng:</span><span className="font-extrabold text-white text-base">{registrationData.amount.toLocaleString()} VNĐ</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Nội dung bắt buộc:</span><span className="font-extrabold text-amber-400 text-base font-mono">SEVQR DS{registrationData.phone}</span></div>
                        </div>

                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl text-xs space-y-2">
                          <p className="font-bold text-primary">💡 HƯỚNG DẪN:</p>
                          <p className="text-muted-foreground">1. Mở App Ngân hàng bất kỳ trên điện thoại của bạn.</p>
                          <p className="text-muted-foreground">2. Chọn chức năng quét mã **QR** và trỏ camera vào hình bên cạnh.</p>
                          <p className="text-muted-foreground">3. Kiểm tra thông tin điền sẵn (đúng số tiền và nội dung) rồi bấm chuyển khoản.</p>
                        </div>

                        {/* Loading spinner polling trạng thái ngân hàng */}
                        <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl">
                          <RefreshCw className="w-5 h-5 text-primary animate-spin" />
                          <span className="text-xs text-muted-foreground font-medium">Đang chờ cổng ngân hàng xác nhận giao dịch...</span>
                        </div>

                        {/* Nút giả lập (Chỉ hiển thị khi bật Test Mode) */}
                        {isTestMode && (
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={handleSimulatePayment}
                              className="w-full py-3 rounded-xl bg-amber-600/20 text-amber-400 hover:bg-amber-600/30 border border-amber-500/20 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                            >
                              Giả lập chuyển khoản thành công 2,000đ (Chế độ Test)
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // MÀN HÌNH THANH TOÁN THÀNH CÔNG (SUCCESS PAGE)
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-35 animate-pulse" />
                  <div className="relative bg-background/95 backdrop-blur-xl rounded-2xl border border-green-500/30 shadow-2xl p-8 md:p-12 text-center space-y-6">
                    
                    <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(34,197,94,0.3)] animate-bounce">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-3xl font-extrabold text-foreground">Ghi Nhận Thanh Toán Thành Công!</h3>
                      <p className="text-muted-foreground text-sm max-w-md mx-auto">
                        Cảm ơn bạn **{registrationData.name}** đã đăng ký tham gia khóa học tại DSCons. Dòng tiền của bạn đã được đối soát tự động thành công.
                      </p>
                    </div>

                    {/* Hộp tài liệu số độc quyền */}
                    <div className="max-w-lg mx-auto p-6 bg-green-500/5 border border-green-500/20 rounded-2xl space-y-4">
                      <div className="flex items-center gap-3">
                        <Gift className="w-6 h-6 text-green-500 shrink-0" />
                        <div className="text-left">
                          <h4 className="text-sm font-bold text-white">Quà Tặng & Tài Liệu Số Đã Được Kích Hoạt!</h4>
                          <p className="text-xs text-muted-foreground">Tải ngay bộ quà tặng thư viện Family MEP và bài học video để chuẩn bị trước.</p>
                        </div>
                      </div>
                      
                      <a 
                        href={registrationData.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-12 rounded-xl bg-green-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-500 transition-colors shadow-lg shadow-green-600/20"
                      >
                        <BookOpen className="w-4 h-4" />
                        Bấm Tải Quà Tặng & Tài Liệu Ngay 🎁
                      </a>
                    </div>

                    <div className="text-xs text-muted-foreground max-w-sm mx-auto space-y-1">
                      <p>● Hóa đơn số của đơn hàng **{registrationData.orderId}** đã được đồng bộ lên CRM.</p>
                      <p>● Tư vấn viên DSCons sẽ liên hệ trực tiếp hỗ trợ bạn vào lớp Zoom học qua Zalo trong vòng 15 phút.</p>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                      <button
                        onClick={() => {
                          setStep(1);
                          setPaymentCompleted(false);
                          setRegistrationData(null);
                          setStatus("idle");
                        }}
                        className="px-6 py-2.5 bg-white/5 rounded-lg text-xs text-muted-foreground hover:bg-white/10 hover:text-white transition-colors"
                      >
                        Quay lại trang chính
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm;
