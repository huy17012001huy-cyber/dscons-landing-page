import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, X, Send, Award, BookOpen, Gift, 
  GraduationCap, ChevronRight, HelpCircle, RotateCcw,
  CreditCard, ShieldCheck, MessageCircle, Zap 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { saveChatbotQuestion } from "@/lib/api";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: Date;
  actions?: { text: string; link: string }[];
}

const QUICK_QUESTIONS = [
  {
    id: "q1",
    short: "1. Vẽ CAD 2D có học được không?",
    full: "Chưa biết gì về Revit, chỉ biết vẽ CAD 2D thì có học được không bạn?",
    reply: [
      "Học tốt bạn ơi!",
      "Lộ trình thực chiến của DSCons đi từ số 0, cầm tay chỉ việc từ cách cài phần mềm đến thao tác cơ bản nhất.",
      "Bạn chỉ cần biết vẽ CAD 2D cơ bản là vào lớp học được ngay. Nhiều ae đi trước chưa từng mở Revit bao giờ, học xong vẫn dựng hình 3D mượt mà."
    ]
  },
  {
    id: "q2",
    short: "2. Học Online qua Zoom có hiệu quả không?",
    full: "Học Online qua Zoom thế này liệu có hiệu quả bằng học trực tiếp tại trung tâm không?",
    reply: [
      "Hiệu quả hơn nhiều bạn nhé.",
      "Thứ nhất, bạn được thực hành trực tiếp trên chiếc máy tính quen thuộc của bạn ở nhà.",
      "Thứ hai, khi bạn thực hành gặp lỗi khó, giảng viên sẽ Ultraview sửa lỗi trực tiếp trên máy của bạn ngay lập tức. Học lớp Offline đông người, giảng viên khó mà soi lỗi cho từng người kỹ như vậy được.",
      "Thứ ba, mỗi buổi học đều có video record quay lại để bạn xem lại trọn đời. Học Offline ở trung tâm nếu bạn quên bài là coi như mất luôn."
    ]
  },
  {
    id: "q3",
    short: "3. Đi công trình bận, tăng ca sao học?",
    full: "Mình bận đi công trình, tăng ca suốt, sợ không có thời gian theo học trực tiếp?",
    reply: [
      "Rất nhiều ae kỹ sư đi làm bận rộn như bạn vẫn học cực tốt.",
      "Sau mỗi buổi học, mình đều gửi lại video tóm tắt thao tác chính (khoảng 15 phút) kèm video record đầy đủ buổi học.",
      "Bạn bận thì cứ xem lại video lúc rảnh rồi làm bài tập nộp. Trợ giảng hỗ trợ gỡ lỗi từ 8h sáng đến 10h tối mỗi ngày, không lo bị bỏ lại phía sau."
    ]
  },
  {
    id: "q4",
    short: "4. Học phí 3.900K hơi cao đúng không?",
    full: "Học phí Gói Thực Chiến 3.900K nghe hơi cao so với các khóa học tự học giá rẻ trên mạng?",
    reply: [
      "Nghe con số thì tưởng cao, nhưng bạn hãy soi kỹ giá trị nhận được:",
      "Bạn được học trực tiếp tương tác 12 buổi, được chấm bài, đánh giá lỗi chi tiết từng buổi. Đặc biệt là cam kết hoàn tiền 100% nếu học xong bạn thấy không hài lòng (mình cam kết bằng video ở buổi khai giảng luôn).",
      "Chưa kể bạn được tặng kèm bộ thư viện Family 3D chuẩn dự án thực tế trị giá 2.000K, bộ DSCons Tool 4 tháng trị giá 700K giúp vẽ nhanh hơn 30%.",
      "Tự học mò mẫm trên mạng giá rẻ thường bị im hơi lặng hình khi gặp lỗi, mất cả năm trời vẫn dậm chân tại chỗ. Ở đây, bạn bỏ ra 3.900K để mua lại quy trình chuẩn, rút ngắn thời gian để thăng tiến nhanh nhất."
    ]
  },
  {
    id: "q5",
    short: "5. Quà tặng có dùng vào việc thật không?",
    full: "Quà tặng đi kèm (như Family 3D, DSCons Tool) có thực sự dùng được vào dự án thật không mình?",
    reply: [
      "Dùng ngay lập tức bạn ơi.",
      "Bộ Family này được mình đúc kết từ hơn 20 dự án thực tế lớn nhỏ của DSCons, đã chuẩn hóa thông số để kéo thả là dùng được ngay, không lỗi.",
      "DSCons Tool là Addin Revit độc quyền giúp bạn rải ống tự động, đặt giá đỡ siêu nhanh, tiết kiệm khoảng 30% thời gian vẽ."
    ]
  },
  {
    id: "q6",
    short: "6. QS MEP bóc khối lượng có nhanh hơn?",
    full: "Mình làm QS MEP (bóc tách dự toán), học Revit MEP có giúp bóc tách khối lượng nhanh hơn không?",
    reply: [
      "QS MEP học cái này cực kỳ sướng!",
      "Thay vì ngồi đếm tay còng lưng từng cái cút, tê trên bản vẽ 2D rồi gõ Excel dễ sai số be bét, Revit MEP giúp bạn bóc tách tự động hoàn toàn từ mô hình 3D.",
      "Chỉ cần bạn bấm 1 nút, hệ thống tự động xuất bảng thống kê khối lượng chính xác 100%, tiết kiệm đến 80% thời gian làm dự toán."
    ]
  },
  {
    id: "q7",
    short: "7. Cam kết chất lượng & Bảo hành học tập?",
    full: "Học xong có chắc chắn làm được việc ngay không? Trung tâm có cam kết gì không bạn?",
    reply: [
      "DSCons cam kết bằng hành động thực tế, không hứa hẹn suông:",
      "1. Cam kết hoàn tiền 100% học phí ở cuối khóa nếu bạn thấy không hài lòng với chất lượng giảng dạy.\n2. Bảo hành học tập trọn đời: Bạn được học lại hoàn toàn miễn phí ở các khóa sau nếu chưa tự tin làm việc.\n3. Nhóm hỗ trợ Zalo vẫn giữ nguyên để giải đáp kỹ thuật ngay cả khi bạn đã kết thúc khóa học và đi làm dự án ở công ty."
    ]
  },
  {
    id: "q8",
    short: "8. Gói Combo & All In One khác biệt gì?",
    full: "Gói Combo 6.400K và Gói All In One 12.000K có gì đặc quyền khác biệt?",
    reply: [
      "Gói Combo (6.400K) giúp bạn học chuyên sâu: Có đủ quyền lợi gói Thực Chiến + mua khóa Combine giảm 50% (còn 2.500K) + tặng khóa Thiết lập Template + tặng khóa Thiết kế CV tuyển dụng.",
      "Gói All In One (12.000K) là gói toàn diện trọn đời: Học miễn phí tất cả khóa học hiện tại và mọi khóa mới ra sau này trên website của Mr. Nam + tặng Tool DSCons vĩnh viễn (trị giá 5.000K) + giới thiệu việc làm trực tiếp đến các nhà thầu cơ điện lớn."
    ]
  },
  {
    id: "q9",
    short: "9. Có được đóng học phí làm nhiều đợt?",
    full: "Mình chưa đủ tài chính đóng ngay một lúc, có được đóng làm nhiều đợt không?",
    reply: [
      "Được bạn nhé. Mình hỗ trợ ae linh hoạt nhất có thể.",
      "Bạn có thể cọc trước 500K để giữ chỗ và giữ nguyên ưu đãi học phí tốt nhất.",
      "Học phí còn lại bạn có thể chia làm 2 đợt đóng trong tháng đầu tiên, hoặc làm thủ tục trả góp học phí trực tiếp với trung tâm cực kỳ nhanh chóng."
    ]
  },
  {
    id: "q10",
    short: "10. Đi làm vướng lỗi có được hỗ trợ?",
    full: "Sau khóa học thì khi đi làm dự án thực tế gặp lỗi, mình có được hỗ trợ tiếp không?",
    reply: [
      "Hỗ trợ trọn đời nha ae.",
      "Nhóm Zalo lớp học của mình không bao giờ xóa. Khi ae đi làm dự án gặp lỗi file hay vướng mắc kỹ thuật, cứ nhắn vào nhóm, giảng viên và trợ giảng vẫn luôn túc trực hỗ trợ ae nhiệt tình như lúc đang học."
    ]
  }
];

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasInitiated, setHasInitiated] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dsc_chatbot_messages");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const formatted = parsed.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }));
          setMessages(formatted);
          setHasInitiated(true);
        }
      }
    } catch (e) {
      console.error("Error loading chat history from localstorage:", e);
    }
  }, []);

  // Save chat history to localStorage when messages change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem("dsc_chatbot_messages", JSON.stringify(messages));
      } catch (e) {
        console.error("Error saving chat history to localstorage:", e);
      }
    }
  }, [messages]);

  // Show tooltip after 4s once page loads (only if chat never opened)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen && !hasInitiated) {
        setShowTooltip(true);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [isOpen, hasInitiated]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Save student query into Supabase dynamically
  const saveStudentQuestion = async (queryText: string, category: string = "Gõ tự do") => {
    try {
      await saveChatbotQuestion(queryText, category);
    } catch (err) {
      console.error("Error saving student question to Supabase:", err);
    }
  };

  // Map quick question ID to structured category
  const getQuestionCategory = (qId: string): string => {
    switch (qId) {
      case "q1": return "Lộ trình học";
      case "q2": return "Hình thức học (Zoom)";
      case "q3": return "Thời gian học (Bận rộn)";
      case "q4": return "Học phí";
      case "q5": return "Quà tặng & Add-in";
      case "q6": return "QS MEP & Khối lượng";
      case "q7": return "Cam kết & Bảo hành";
      case "q8": return "Các gói học (Combo)";
      case "q9": return "Học phí (Trả góp/Cọc)";
      case "q10": return "Hỗ trợ sau khóa học";
      default: return "Câu hỏi gợi ý";
    }
  };

  // Helper to render lucide icon on Action Pill buttons
  const renderActionIcon = (link: string) => {
    if (link.startsWith("#pricing")) return <CreditCard size={14} className="mr-1.5 flex-shrink-0" />;
    if (link.startsWith("#curriculum")) return <BookOpen size={14} className="mr-1.5 flex-shrink-0" />;
    if (link.startsWith("#testimonials")) return <MessageCircle size={14} className="mr-1.5 flex-shrink-0" />;
    if (link.startsWith("#bonus")) return <Gift size={14} className="mr-1.5 flex-shrink-0" />;
    if (link.startsWith("#outcomes")) return <ShieldCheck size={14} className="mr-1.5 flex-shrink-0" />;
    if (link.startsWith("#faq")) return <HelpCircle size={14} className="mr-1.5 flex-shrink-0" />;
    if (link.includes("dang-ky")) return <GraduationCap size={14} className="mr-1.5 flex-shrink-0" />;
    return <Zap size={14} className="mr-1.5 flex-shrink-0" />;
  };

  // Handle action link smart clicks (Smooth scroll for # anchors)
  const handleActionClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    if (link.startsWith("#")) {
      e.preventDefault();
      const elementId = link.substring(1);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        // Close on mobile for better visibility
        if (window.innerWidth < 640) {
          setIsOpen(false);
        }
      } else {
        // Fallback to home page with anchor
        window.location.href = "/" + link;
      }
    }
  };

  // Reset/Clear local chat history
  const handleResetChat = () => {
    if (window.confirm("Ae có muốn dọn dẹp lịch sử trò chuyện và bắt đầu lại cuộc hội thoại mới không?")) {
      localStorage.removeItem("dsc_chatbot_messages");
      setMessages([]);
      setHasInitiated(false);
      setIsOpen(false);
    }
  };

  // Handle bot multi-message sending with delays
  const sendBotMessages = async (texts: string[], actions?: { text: string; link: string }[]) => {
    for (let i = 0; i < texts.length; i++) {
      setIsTyping(true);
      const delay = Math.max(800, texts[i].length * 15);
      await new Promise((resolve) => setTimeout(resolve, delay));
      setIsTyping(false);

      const newMsg: Message = {
        id: `bot-${Date.now()}-${i}`,
        sender: "bot",
        text: texts[i],
        timestamp: new Date(),
        actions: i === texts.length - 1 ? actions : undefined
      };
      setMessages((prev) => [...prev, newMsg]);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setShowTooltip(false);

    if (!hasInitiated) {
      setHasInitiated(true);
      const welcomeParts = [
        "Chào ae! Rất vui được gặp ae. 😊",
        "Có phải ae đang gặp cảnh thức đêm ròng rã ngoài công trường để xử lý mấy cái lỗi xung đột nham nhở?\nỐng nước đâm qua dầm, ống gió đè lên ống chữa cháy... phát hiện ra khi đã lắp đặt xong, phải đục phá nát bét cả công trình.",
        "Hay ae đang vẽ CAD 2D mỏi mắt, rồi ngồi bóc tách khối lượng bằng Excel đếm tay thủ công sai số be be sếp trả lại?\nBản vẽ thiết kế thì có cũng được/chẳng sao, nhưng ra công trường lắp không nổi vì không nhìn thấy không gian 3D.",
        "Yên tâm, mình ở đây để đồng hành cùng ae. Mình là Huy DSCons đây.\n\nAe cần mình tư vấn lộ trình thực chiến nào để ra nghề chắc tay và bứt phá thu nhập nhanh nhất?"
      ];
      sendBotMessages(welcomeParts);
    }
  };

  const handleQuickQuestionClick = (q: typeof QUICK_QUESTIONS[number]) => {
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: q.full,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);

    // Save to database asynchronously
    const cat = getQuestionCategory(q.id);
    saveStudentQuestion(q.full, cat);

    // Dynamic actions focusing on smart navigation (avoiding general links)
    let actions: { text: string; link: string }[] = [];
    if (q.id === "q4" || q.id === "q8") {
      actions = [
        { text: "Xem Bảng Học Phí Chi Tiết 📊", link: "#pricing" },
        { text: "Xem Nhận Xét Lớp Học 💬", link: "#testimonials" }
      ];
    } else if (q.id === "q9") {
      actions = [
        { text: "Xem Bảng Học Phí Chi Tiết 📊", link: "#pricing" },
        { text: "Nhận Tư Vấn Đóng Phí Nhiều Đợt 📞", link: "/dang-ky" }
      ];
    } else if (q.id === "q1" || q.id === "q2" || q.id === "q3") {
      actions = [
        { text: "Xem Lộ Trình 12 Buổi Học 📚", link: "#curriculum" },
        { text: "Xem Quà Tặng & Add-in Nhận Kèm 🎁", link: "#bonus" }
      ];
    } else if (q.id === "q5") {
      actions = [
        { text: "Xem Chi Tiết Quà Tặng & Add-in 🎁", link: "#bonus" },
        { text: "Xem Lộ Trình Học Chi Tiết 📚", link: "#curriculum" }
      ];
    } else if (q.id === "q6") {
      actions = [
        { text: "Quy Trình Bóc Khối Lượng Tự Động 3D 📐", link: "#curriculum" },
        { text: "Xem Đánh Giá Học Viên MEP 💬", link: "#testimonials" }
      ];
    } else {
      actions = [
        { text: "Xem Cam Kết Đầu Ra & Hoàn Tiền 🎯", link: "#outcomes" },
        { text: "Xem Đánh Giá Lớp Học 💬", link: "#testimonials" }
      ];
    }
    sendBotMessages(q.reply, actions);
  };

  const handleCustomSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userVal = inputVal.trim();
    setInputVal("");

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userVal,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);

    const query = userVal.toLowerCase();

    // Save to database with automatic category analysis
    let category = "Gõ tự do - Chưa rõ chủ đề";
    if (query.includes("học phí") || query.includes("giá") || query.includes("bao nhiêu tiền") || query.includes("chi phí")) {
      category = "Học phí";
    } else if (query.includes("combo") || query.includes("các gói") || query.includes("gói học")) {
      category = "Các gói học (Combo)";
    } else if (query.includes("trả góp") || query.includes("nhiều đợt") || query.includes("chia đợt") || query.includes("cọc")) {
      category = "Hình thức thanh toán";
    } else if (query.includes("lộ trình") || query.includes("học cái gì") || query.includes("nội dung") || query.includes("buổi")) {
      category = "Lộ trình học";
    } else if (query.includes("zoom") || query.includes("online") || query.includes("offline")) {
      category = "Hình thức học (Zoom)";
    } else if (query.includes("bận") || query.includes("công trình") || query.includes("tăng ca")) {
      category = "Thời gian học (Bận rộn)";
    } else if (query.includes("quà") || query.includes("tặng") || query.includes("family") || query.includes("tool") || query.includes("addin")) {
      category = "Quà tặng & Add-in";
    } else if (query.includes("qs") || query.includes("khối lượng") || query.includes("bóc tách")) {
      category = "QS MEP & Khối lượng";
    } else if (query.includes("cam kết") || query.includes("hoàn tiền") || query.includes("bảo hành")) {
      category = "Cam kết & Bảo hành";
    } else if (query.includes("hỗ trợ") || query.includes("sau khóa") || query.includes("group") || query.includes("zalo")) {
      category = "Hỗ trợ sau khóa học";
    } else if (query.includes("đăng ký") || query.includes("học") || query.includes("slot") || query.includes("mua")) {
      category = "Đăng ký khóa học";
    }
    saveStudentQuestion(userVal, category);

    // Match keywords for dynamic response
    let matchedQ = QUICK_QUESTIONS.find((q) => {
      if (q.id === "q1" && (query.includes("cad") || query.includes("chưa biết gì") || query.includes("chưa học bao giờ") || query.includes("không biết gì") || query.includes("mới bắt đầu"))) return true;
      if (q.id === "q2" && (query.includes("zoom") || query.includes("online") || query.includes("trực tiếp") || query.includes("trung tâm") || query.includes("offline"))) return true;
      if (q.id === "q3" && (query.includes("bận") || query.includes("công trình") || query.includes("tăng ca") || query.includes("thời gian") || query.includes("không có giờ"))) return true;
      if (q.id === "q4" && (query.includes("học phí") || query.includes("nhiêu tiền") || query.includes("giá") || query.includes("học phí cao") || query.includes("chi phí"))) return true;
      if (q.id === "q5" && (query.includes("quà") || query.includes("family") || query.includes("tool") || query.includes("addin") || query.includes("thư viện") || query.includes("tặng"))) return true;
      if (q.id === "q6" && (query.includes("qs") || query.includes("khối lượng") || query.includes("bóc tách") || query.includes("dự toán") || query.includes("excel"))) return true;
      if (q.id === "q7" && (query.includes("cam kết") || query.includes("hoàn tiền") || query.includes("uy tín") || query.includes("đảm bảo"))) return true;
      if (q.id === "q8" && (query.includes("combo") || query.includes("all in one") || query.includes("các gói") || query.includes("gói khác"))) return true;
      if (q.id === "q9" && (query.includes("chia đợt") || query.includes("nhiều đợt") || query.includes("trả góp") || query.includes("đóng làm") || query.includes("cọc trước"))) return true;
      if (q.id === "q10" && (query.includes("hỗ trợ") || query.includes("sau khóa") || query.includes("đi làm") || query.includes("group") || query.includes("zalo"))) return true;
      return false;
    });

    if (matchedQ) {
      let actions: { text: string; link: string }[] = [];
      if (matchedQ.id === "q4" || matchedQ.id === "q8" || matchedQ.id === "q9") {
        actions = [
          { text: "Xem Bảng Học Phí Chi Tiết 📊", link: "#pricing" },
          { text: "Xem Lộ Trình 12 Buổi Học 📚", link: "#curriculum" }
        ];
      } else if (matchedQ.id === "q1" || matchedQ.id === "q2" || matchedQ.id === "q3") {
        actions = [
          { text: "Xem Lộ Trình 12 Buổi Học 📚", link: "#curriculum" },
          { text: "Xem Quà Tặng & Add-in Nhận Kèm 🎁", link: "#bonus" }
        ];
      } else if (matchedQ.id === "q5") {
        actions = [
          { text: "Xem Chi Tiết Quà Tặng & Add-in 🎁", link: "#bonus" },
          { text: "Xem Lộ Trình Học Chi Tiết 📚", link: "#curriculum" }
        ];
      } else if (matchedQ.id === "q6") {
        actions = [
          { text: "Quy Trình Bóc Khối Lượng Tự Động 3D 📐", link: "#curriculum" },
          { text: "Xem Nhận Xét Của Học Viên MEP 💬", link: "#testimonials" }
        ];
      } else {
        actions = [
          { text: "Xem Cam Kết Đầu Ra & Hoàn Tiền 🎯", link: "#outcomes" },
          { text: "Xem Nhận Xét Thực Tế Lớp Học 💬", link: "#testimonials" }
        ];
      }
      sendBotMessages(matchedQ.reply, actions);
    } else if (query.includes("đăng ký") || query.includes("học") || query.includes("slot") || query.includes("cọc") || query.includes("mua")) {
      const closingMessages = [
        "Ae thấy đấy, thay vì tự mò mẫm học Revit MEP mất cả năm trời vừa mệt mỏi vừa dễ nản...",
        "Tham gia lớp thực chiến 6 tuần cùng mình là ae đã tự tin ra nghề chắc tay, vẽ mô hình 3D chuẩn chỉ và bóc tách khối lượng nhanh như chớp. 🚀",
        "Hiện tại lớp học chỉ giới hạn 15-25 học viên để mình chấm/chữa bài kỹ nhất cho từng người, và slot ưu đãi học phí sắp hết hạn nộp rồi.",
        "Nếu mô hình 3D không xuất ra được khối lượng thì chỉ là một bức tranh để ngắm thôi, phải bắt tay vào làm thực tế mới ra nghề được ae ạ!",
        "Ae chỉ cần cọc trước 500K là giữ chắc một chỗ học tốt kèm ưu đãi tốt nhất rồi.\n\nAe bấm nút bên dưới để điền form đăng ký slot hoặc chuyển khoản cọc giữ chỗ luôn nhé!"
      ];
      sendBotMessages(closingMessages, [
        { text: "👉 Đăng Ký Slot & Nhận Ưu Đãi", link: "/dang-ky" },
        { text: "Xem Bảng Học Phí Chi Tiết 📊", link: "#pricing" }
      ]);
    } else if (query.includes("tài liệu") || query.includes("xin file") || query.includes("miễn phí") || query.includes("quà") || query.includes("template")) {
      const nurtureMessages = [
        "Quá chuẩn luôn bạn ơi! Đi học hay tự ôn thì bộ công cụ chuẩn là cực kỳ quan trọng.",
        "Để giúp ae làm quen trước, mình tặng ae một bộ tài liệu cực chất gồm Template rải ống cơ điện chuẩn chỉnh kèm bộ Family 3D cơ bản hoàn toàn miễn phí.",
        "Ae bấm vào link nút dưới để điền thông tin nhận quà ngay và đăng ký nhận bản tin chia sẻ kinh nghiệm Revit MEP thực chiến hàng tuần nhé!",
        "Cứ nghiên cứu kỹ đi, khi nào sẵn sàng bứt phá sự nghiệp thì nhắn mình nhé! 💪"
      ];
      sendBotMessages(nurtureMessages, [
        { text: "👉 Điền Form Nhận Quà Miễn Phí", link: "/dang-ky" },
        { text: "Xem Quà Tặng & Add-in Nhận Kèm 🎁", link: "#bonus" }
      ]);
    } else {
      const fallbackMessages = [
        "Cảm ơn ae đã nhắn nha! Câu hỏi rất hay luôn.",
        "Tin nhắn của ae đã được hệ thống lưu lại rồi. Mình hoặc các bạn trợ lý kỹ thuật tại DSCons sẽ chủ động liên hệ hỗ trợ trực tiếp cho ae ngay qua Zalo hoặc SĐT nhé.",
        "Trong lúc chờ đợi, ae có thể bấm vào các nút câu hỏi nhanh ở trên để cuộn xem trực tiếp, hoặc bấm nút dưới để xem chi tiết lộ trình học nhé! 👇"
      ];
      sendBotMessages(fallbackMessages, [
        { text: "Xem Lộ Trình Học Thực Chiến 📚", link: "#curriculum" },
        { text: "Xem Đánh Giá Của Học Viên Đi Trước 💬", link: "#testimonials" }
      ]);
    }
  };

  return (
    <>
      {/* 1. Floating Action Chat Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Hover/Intro Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mb-3 mr-1 bg-card/95 backdrop-blur-md text-card-foreground border border-border py-3 px-4 rounded-2xl shadow-xl max-w-[270px] relative text-sm font-medium"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                }}
                className="absolute top-1.5 right-1.5 p-0.5 rounded-full hover:bg-muted text-muted-foreground transition-colors"
              >
                <X size={13} />
              </button>
              <div className="flex gap-2.5 items-start pr-3">
                <div className="relative flex-shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold text-white text-xs shadow-md">
                    Huy
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-card"></span>
                </div>
                <div>
                  <p className="font-semibold text-xs text-primary mb-0.5">Huy DSCons</p>
                  <p className="text-[12px] leading-snug font-normal text-muted-foreground">
                    Ae có vướng mắc gì về Revit MEP thực chiến không? Chat với mình nhé! 💬
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The main round toggle button */}
        <motion.button
          onClick={isOpen ? () => setIsOpen(false) : handleOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-btn-pro hover:shadow-btn-pro-hover transition-all duration-300 relative border border-white/10 ${
            isOpen 
              ? "bg-muted-foreground/80 dark:bg-muted/80 backdrop-blur-md" 
              : "bg-gradient-to-r from-primary to-accent animate-pulse-glow"
          }`}
          aria-label="Mở khung chat"
        >
          {isOpen ? (
            <X size={24} className="animate-in spin-in-90 duration-200" />
          ) : (
            <div className="relative">
              <MessageSquare size={24} className="animate-in zoom-in-50 duration-200" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-background"></span>
            </div>
          )}
        </motion.button>
      </div>

      {/* 2. Chat Window Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.93 }}
            transition={{ type: "spring", stiffness: 350, damping: 26 }}
            className="fixed bottom-24 right-6 w-[360px] sm:w-[400px] h-[550px] sm:h-[600px] bg-card/95 backdrop-blur-md border border-border/80 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header section with gradient */}
            <div className="bg-gradient-to-r from-primary/95 to-accent/95 p-4 flex items-center justify-between border-b border-border/10 text-white relative">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white shadow-inner border border-white/20">
                    Huy
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-primary animate-pulse"></span>
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                    Huy DSCons
                    <span className="text-[10px] bg-white/20 font-medium px-1.5 py-0.5 rounded-full text-white">Thực chiến</span>
                  </h3>
                  <p className="text-xs text-white/80 font-normal mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                    Đang trực tuyến 24/7
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={handleResetChat}
                    className="p-1.5 rounded-full hover:bg-white/10 text-white/90 transition-colors"
                    title="Làm mới trò chuyện"
                  >
                    <RotateCcw size={16} />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/90 transition-colors"
                  title="Thu nhỏ"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat Messages Body Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20 custom-scrollbar relative">
              <div className="text-center">
                <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border font-medium">
                  Đồng hành thực chiến cùng ae 🛠️
                </span>
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                >
                  {/* Avatar for bot */}
                  {msg.sender === "bot" && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 shadow-sm mt-0.5">
                      Huy
                    </div>
                  )}

                  <div className="flex flex-col max-w-[80%] space-y-1.5">
                    {/* Message Bubble box */}
                    <div
                      className={`p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-sm border ${
                        msg.sender === "user"
                          ? "bg-primary text-white border-primary"
                          : "bg-card text-foreground border-border"
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Rendering action buttons inside chat bubble if provided */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="flex flex-col gap-2 pt-1">
                        {msg.actions.map((act, index) => (
                          <a
                            key={index}
                            href={act.link}
                            onClick={(e) => handleActionClick(e, act.link)}
                            className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl font-bold text-xs shadow-btn-pro hover:shadow-btn-pro-hover text-white transition-all border border-white/10 ${
                              act.link.startsWith("#")
                                ? "bg-gradient-to-r from-primary to-accent"
                                : "bg-gradient-to-r from-amber-500 to-orange-500 animate-pulse-glow"
                            }`}
                          >
                            <div className="flex items-center gap-1.5 min-w-0 text-left">
                              {renderActionIcon(act.link)}
                              <span className="truncate">{act.text}</span>
                            </div>
                            <ChevronRight size={14} className="flex-shrink-0 ml-1.5" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Bot typing simulator indicator */}
              {isTyping && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5">
                    Huy
                  </div>
                  <div className="bg-card border border-border p-3 px-4 rounded-2xl shadow-sm max-w-[70%]">
                    <div className="flex items-center gap-1.5 py-1">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies suggested questions selection */}
            <div className="border-t border-border bg-card p-2 flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-none py-2.5 px-3">
              <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 mr-1 uppercase flex-shrink-0">
                <HelpCircle size={12} className="text-primary" /> Hỏi nhanh:
              </span>
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleQuickQuestionClick(q)}
                  className="px-3 py-1.5 bg-muted/60 border border-border hover:border-primary/40 hover:bg-primary/5 text-foreground hover:text-primary rounded-full text-xs font-medium transition-all transition-colors flex-shrink-0 cursor-pointer"
                >
                  {q.short}
                </button>
              ))}
            </div>

            {/* Bottom Form Chat Input Area */}
            <form onSubmit={handleCustomSend} className="p-3 border-t border-border bg-card flex gap-2 items-center">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Hỏi Huy về lộ trình, học phí, cam kết..."
                className="flex-1 bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-card transition-all placeholder:text-muted-foreground/80 text-foreground"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white shadow-md hover:opacity-90 transition-all flex items-center justify-center cursor-pointer"
                title="Gửi câu hỏi"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
