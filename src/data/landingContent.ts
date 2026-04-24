export const landingData = {
  pageSections: [
    { id: "hero", title: "Giới thiệu" },
    { id: "pain-points", title: "Vấn đề" },
    { id: "solution", title: "Giải pháp" },
    { id: "curriculum", title: "Chương trình" },
    { id: "bonus", title: "Quà tặng" },
    { id: "outcomes", title: "Kết quả" },
    { id: "instructor", title: "Giảng viên" },
    { id: "testimonials", title: "Đánh giá" },
    { id: "pricing", title: "Học phí" },
    { id: "faq", title: "FAQ" }
  ],
  header: {
    logo: "DSCons",
    navLinks: [
      { name: "Chương trình", href: "#curriculum" },
      { name: "Giảng viên", href: "#instructor" },
      { name: "Học phí", href: "#pricing" },
      { name: "FAQ", href: "#faq" },
    ],
    cta: "Đăng ký ngay",
    ctaHref: "#pricing"
  },
  hero: {
    badge: "Thực Chiến Cấp Tốc",
    title: "Thành thạo Revit MEP & Bóc tách khối lượng trong 6 Tuần",
    description: "Bạn vừa ra trường cần cơ hội việc làm? Hay một kỹ sư lâu năm muốn cập nhật phần mềm mới? Không học lý thuyết suông - Làm dự án thực tế 100%. Dễ hiểu, học lại miễn phí.",
    primaryCta: "Đăng ký ngay",
    primaryCtaHref: "#pricing",
    secondaryCta: "Xem lộ trình học",
    secondaryCtaHref: "#curriculum",
    startDate: "Khai giảng: 15/05/2026",
    scheduleText: "Lịch học: Thứ 3 - 5 (19h30 - 21h30)"
  },
  painPoints: {
    badge: "VẤN ĐỀ THƯỜNG GẶP",
    title: "Đừng để rào cản kinh nghiệm cản bước thăng tiến...",
    techLogosHeading: "Công cụ và công nghệ trong khóa học",
    techLogos: [
      { id: "logo-1", description: "", image: "https://svgl.app/library/nvidia-wordmark-light.svg", className: "h-7 w-auto" },
      { id: "logo-2", description: "", image: "https://svgl.app/library/supabase_wordmark_light.svg", className: "h-7 w-auto" },
      { id: "logo-3", description: "", image: "https://svgl.app/library/openai_wordmark_light.svg", className: "h-7 w-auto" },
      { id: "logo-4", description: "", image: "https://svgl.app/library/turso-wordmark-light.svg", className: "h-7 w-auto" },
      { id: "logo-5", description: "", image: "https://svgl.app/library/vercel_wordmark.svg", className: "h-7 w-auto" },
      { id: "logo-6", description: "", image: "https://svgl.app/library/github_wordmark_light.svg", className: "h-7 w-auto" },
      { id: "logo-7", description: "", image: "https://svgl.app/library/claude-ai-wordmark-icon_light.svg", className: "h-7 w-auto" },
      { id: "logo-8", description: "", image: "https://svgl.app/library/clerk-wordmark-light.svg", className: "h-7 w-auto" },
    ],
    items: [
      {
        title: "Tụt hậu công nghệ (Tâm lý KS kinh nghiệm)",
        description: "Quen vẽ CAD tay nhiều năm, các dự án lớn bắt đầu đòi hỏi mô hình BIM nhưng lo ngại có tuổi sẽ khó tiếp thu phần mềm 3D."
      },
      {
        title: "Chật vật tìm việc (Tâm lý KS trẻ tuổi)",
        description: "Mới ra trường, thiếu kinh nghiệm thực tế. Các công ty khắt khe, không muốn bỏ vài tháng đào tạo lại từ một người tay ngang."
      },
      {
        title: "Bóc tách khối lượng hay sai lệch",
        description: "Bóc tách thủ công dễ sai sót do thiếu trực quan, dẫn đến thâm hụt dự toán và bị ảnh hưởng tiêu cực đến hiệu suất dự án."
      },
      {
        title: "Chưa biết tích hợp AI vào công việc",
        description: "Làm việc theo cách truyền thống, mất nhiều giờ google tìm giải pháp lỗi trong khi AI đã có thể giải đáp rốt ráo ngay lập tức."
      }
    ]
  },
  solution: {
    badge: "GIẢI PHÁP TỪ DSCons",
    title: "Chìa khóa vàng: Nắm vững Revit MEPF trọn vẹn",
    items: [
      {
        title: "Thành thạo dựng hình 3D Full các hệ",
        description: "Lên mô hình chính xác, kiểm soát mọi chi tiết hệ thống từ điện, nước, điều hòa đến chữa cháy."
      },
      {
        title: "Bóc tách khối lượng hoàn toàn tự động",
        description: "Từ cơ bản đến chuyên sâu, hỗ trợ tự động lập bảng dự toán chính xác tuyệt đối."
      },
      {
        title: "Tạo lập hồ sơ bản vẽ không sai lệch",
        description: "Cắt mặt bằng, tạo mặt cắt và sơ đồ không gian 3D tự động, chuyên nghiệp."
      },
      {
        title: "Tuyệt chiêu phối hợp quản lý dự án (BIM)",
        description: "Xuất bản vẽ mượt mà sang CAD, PDF và sử dụng Navisworks để xử lý va chạm tối ưu."
      }
    ]
  },
  curriculum: {
    badge: "LỘ TRÌNH ĐÀO TẠO",
    title: "12 Buổi Thực Chiến Xuyên Suốt Lộ Trình",
    subtitle: "Lựa chọn linh hoạt: Tham gia Live Class (Tối Thứ 3 & 6) HOẶC tự học qua Video Record với sự hỗ trợ giải đáp 24/7 từ AI và Giảng viên.",
    modules: [
      { 
        id: "m1", 
        title: "MODULE 1 • DỰNG HÌNH 3D CÁC HỆ THỐNG MEPF", 
        lessons: [
          {
            id: "01",
            title: "Khởi động và Thiết lập Dự án",
            desc: "Tổng quan về Revit MEP, cài đặt và thiết lập dự án chuẩn mực.",
            icon: "Monitor",
            details: ["Làm quen giao diện", "Lập dự án & Workset", "Bộ kiểm soát hiển thị cơ bàn"]
          },
          {
            id: "02",
            title: "Dựng Hình Mạng Lưới (HVAC & Plumbing)",
            desc: "Vào việc thực hành hệ thống thông gió và thiết lập Cấp thoát nước trực quan.",
            icon: "Layers",
            details: ["Ống gió & Thiết bị (HVAC)", "Mạng lưới nước (Plumbing)", "Lắp đặt linh phụ kiện"]
          },
          {
            id: "03",
            title: "Hệ Thống Chữa Cháy & Mạng Lưới Điện",
            desc: "Hoàn hiện hệ thống PCCC (Fire Protection) và Điện (Electrical).",
            icon: "Zap",
            details: ["Bố trí ống chữa cháy (FP)", "Hệ thống thang máng cáp", "Cài đặt mạng lưới Tủ điện"]
          }
        ]
      },
      { 
        id: "m2", 
        title: "MODULE 2 • QUẢN LÝ MÔ HÌNH VÀ BÓC TÁCH", 
        lessons: [
          {
            id: "04",
            title: "Tạo Family và Tùy Biến 3D",
            desc: "Làm chủ việc điều chế Family để sử dụng tái chế cho vô vàn dự án.",
            icon: "Wrench",
            details: ["Hệ tư tưởng Revit Family", "Trình tạo Parameter", "Xây dựng Family thiết bị"]
          },
          {
            id: "05",
            title: "Quản lý View và View Template",
            desc: "Thiết lập, tinh chỉnh danh mục View, chuẩn hóa góc độ hiển thị và filter linh hoạt.",
            icon: "Eye",
            details: ["Tự tạo View Template", "Tô điểm màu sắc bằng Filter", "Bộ thủ thuật Đồ họa (Graphic)"]
          },
          {
            id: "06",
            title: "Bóc Tách Khối Lượng Tự Động",
            desc: "Kiến trúc hóa bảng tính, giải phóng việc đếm tay - nhường máy tính tính toán.",
            icon: "FileText",
            details: ["Schedules & Quantities", "Công thức bảng vật tư tự động", "Bóc tách Fitting, Pipe, Duct"]
          }
        ]
      },
      { 
        id: "m3", 
        title: "MODULE 3 • HỒ SƠ & BẢN VẼ CUỐI CÙNG", 
        lessons: [
          {
            id: "07",
            title: "Detailing & Trình Bày Bản Vẽ",
            desc: "Sắp xếp trang tính, cắt ngang hệ thống tạo mặt cắt chuyên nghiệp.",
            icon: "Layout",
            details: ["Dàn trang bản vẽ (Sheets)", "Đính Tag text & Annotation", "Cắt mặt cắt, Callout"]
          },
          {
            id: "08",
            title: "In Ấn, Xuất Bản & Tích Hợp Navisworks",
            desc: "Đóng gói hồ sơ, in PDF xuất CAD chuẩn. Nhảy sang Navis kiểm soát va chạm.",
            icon: "Printer",
            details: ["In PDF đồng loạt, Cấu hình CAD", "Overview môi trường Navisworks", "Nghệ thuật phát hiện va chạm"]
          }
        ]
      }
    ]
  },
  bonus: {
    title: "Vũ khí bí mật **ăn đứt đối thủ**",
    subtitle: "🎁 ƯU ĐÃI TẶNG KÈM 6.150K",
    description: "Học phí 3.900K nhưng DSCons tặng bạn gói quà lưu niệm đồ sộ trị giá tới 6.150K.",
    boxLeftTitle: "Hệ Sinh Thái Kế Thừa Từ DSCons",
    boxLeftSubtitle: "⭐ TỔNG TRỊ GIÁ 6.150K",
    boxLeftDesc: "Tuyệt đối không để học viên tay trắng lên đấu trường. Khóa học trao tận tay hệ thống Tool add-in kết hợp hàng trăm Video chất xám cao nhất, rút ngắn 50% thời lượng thao tác bằng tay.",
    boxLeftNote: "_ Nhận ngay 5 quà tặng đặc quyền",
    features: [
      { icon: "Package", cmd: "Thư viện Family 3D (2000K)", desc: "Trợ thủ làm dự án siêu nhanh, độc quyền DSCons (Tặng sau khóa học).", mediaType: "image", mediaUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80" },
      { icon: "Wrench", cmd: "Bộ DSCons Tool 4 Tháng (700K)", desc: "Tăng x30% tốc độ rải tay, dùng nghiện như lisp CAD. Kích hoạt vào học.", mediaType: "youtube", mediaUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
      { icon: "Video", cmd: "Khóa Video Dựng hình (1000K)", desc: "Giáo trình video full các hệ cơ điện để nhâm nhi và thực hành tại nhà.", mediaType: "video", mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
      { icon: "Layers", cmd: "Khóa học Navisworks (700K)", desc: "Kiểm soát các đầu mối va chạm gắt gao giữa hệ thống (Giải cứu công trình).", mediaType: "none", mediaUrl: "" },
      { icon: "FileText", cmd: "Khóa Bóc Tách/Shopdrawing (1750K)", desc: "Bộ video tự động tính khối lượng tạo hồ sơ bản vẽ chuẩn từng nét thiết kế.", mediaType: "none", mediaUrl: "" }
    ]
  },
  outcomes: {
    badge: "SAU KHÓA HỌC",
    title: "Chấm dứt kỷ nguyên sửa chữa bản vẽ tay lắt nhắt",
    description: "Bạn sẽ dứt điểm được nỗi sợ phần mềm mới, tự tự bước vào quy trình tự động hóa của các dự án lớn (BIM). Không còn cảnh thức đêm sửa CAD.",
    items: [
      {
        icon: "AppWindow",
        title: "Nắm quyền Sinh sát 3D",
        description: "Kiểm soát toàn cục từng milimet kết cấu hệ thống với mô hình 3D đa diện."
      },
      {
        icon: "Bot",
        title: "Giải Trí Với BoQ Tự Động",
        description: "Thay vì dùng Excel vất vả, hãy học cách lướt Web để xem máy tính móc khối lượng giúp bạn."
      },
      {
        icon: "Bug",
        title: "Chuyên Gia Navisworks",
        description: "Cản bước mọi va chạm từ tủ bù điện cho với kết cấu bê tông chỉ với 1 click rà soát."
      },
      {
        icon: "PackageOpen",
        title: "Workflow Siêu Tốc Cấp Bậc VIP",
        description: "Có trong tay kỹ năng tận dụng ngàn mẫu template tái sử dụng để làm nhanh như máy."
      },
      {
        icon: "Rocket",
        title: "Thương Hiệu Cá Nhân Tỏa Sáng",
        description: "Trình sếp/đối tác một Profile ngập tràn BIM - bạn sẽ không lo bị ép giá."
      },
      {
        icon: "BrainCircuit",
        title: "Tư Duy Của Lãnh Đạo",
        description: "Tầm nhìn bao quát toàn bộ dự án để biết khi nào chỗ nào hỏng thiết kế - chỗ nào thiếu linh kiện."
      }
    ]
  },
  instructor: {
    badge: "TEAM ĐÀO TẠO DSCons",
    title: "Đội Ngũ Thực Chiến, Không Dạy Lý Thuyết Suông",
    subtitle: "Dày dạn kinh nghiệm thực chiến từ các dự án quy mô lớn. DSCons cam kết theo sát, 'cầm tay chỉ việc' cho đến khi bạn tự tin bung sức nghiệm thu dự án.",
    videoUrl: "",
    imageUrl: "https://lebachhiep.com/_next/image?url=%2Fhiep.png&w=640&q=75",
    name: "Phạm Quang Huy & Trịnh Thị Hà Thu",
    role: "Kỹ Sư MEPF & BIM Manager",
    bio: "Phạm Quang Huy - Chuyên gia Đào Tạo với 3 năm kinh nghiệm thực tiễn. Trịnh Thị Hà Thu với thâm niên BIM Manager hơn 7 năm. Đây là cặp đôi vàng giúp rất nhiều lứa kĩ sư lội ngược dòng lên vị trí thu nhập cao hơn.",
    achievementsHeading: "Lý do bạn nên đồng hành cùng DSCons",
    achievements: [
      { icon: "Rocket", text: "Cam kết chuẩn đầu ra: Cọ xát trên dự án thực tế" },
      { icon: "Users", text: "Lớp học kèm sát sao, hỗ trợ 1 kèm 1 sửa bài tập gắt gao" },
      { icon: "Award", text: "Gia nhập gia đình Kỹ sư Thiết kế C&M độc quyền" },
      { icon: "Code", text: "Kề vai sát cánh, lưu hình video 100% thời lượng cho Học lại" }
    ]
  },
  pricing: {
    badge: "BẢNG GIÁ ĐẦU TƯ",
    title: "Đầu tư ngay - Khai mở sự nghiệp",
    originalPrice: "Chỉ từ 30 phút mỗi ngày - Học theo tiến độ cá nhân của bạn.",
    packages: [
      {
        name: "Gói Tiêu Chuẩn",
        price: "1.900K",
        description: "Phù hợp cho sinh viên hoặc người mới bắt đầu làm quen với Revit MEP.",
        isRecommended: false,
        features: [
          "Truy cập toàn bộ video bài giảng",
          "Thực hành trên dự án mẫu",
          "Tham gia cộng đồng học viên",
          "Hỗ trợ giải đáp cơ bản trong 3 tháng"
        ],
        buttonText: "Liên hệ tư vấn",
        buttonHref: "https://zalo.me/0917379181",
      },
      {
        name: "Gói Thực Chiến",
        price: "3.900K",
        description: "Lựa chọn tốt nhất cho kỹ sư muốn làm chủ Revit MEP và triển khai dự án thực tế.",
        isRecommended: true,
        features: [
          "Mọi quyền lợi của Gói Tiêu Chuẩn",
          "Template tiêu chuẩn DSCons",
          "Family Revit MEP trọn bộ",
          "Sửa lỗi trực tiếp trên mô hình của học viên",
          "Hỗ trợ 1-1 không giới hạn thời gian",
          "Cấp đầy đủ Chứng nhận sau khi Tốt nghiệp"
        ],
        buttonText: "Đăng ký ngay",
        buttonHref: "https://zalo.me/0917379181",
      }
    ]
  },
  stats: [
    { value: "12", label: "Buổi học" },
    { value: "5", label: "Quà Tặng" },
    { value: "1:1", label: "Kèm Cặp" },
    { value: "100%", label: "Thực Chiến" }
  ],
  testimonials: {
    badge: "ĐÁNH GIÁ THỰC TẾ",
    title: "Từ trải nghiệm của Học viên",
    textItems: [
      {
        name: "Lê Hoàng Anh",
        role: "BIM Manager - Coteccons",
        content: "Trước đây team tôi mất 2 tuần cho 1 bộ hồ sơ Shop Drawing. Sau khi áp dụng quy trình Revit MEP thực chiến của DSCons, thời gian giảm xuống còn 4 ngày. Hiệu quả kinh tế thấy rõ ngay lập tức!"
      },
      {
        name: "Nguyễn Thanh Sơn",
        role: "Kỹ sư MEP - Tập đoàn Hòa Bình",
        content: "Khóa học không chỉ dạy lệnh, mà dạy tư duy xử lý va chạm và xuất khối lượng chính xác 99%. Đây là bệ phóng giúp tôi đạt mức lương 25M+ sau 1 năm theo đuổi BIM."
      },
      {
        name: "Phạm Thúy Hằng",
        role: "Kỹ sư thiết kế Điện - REE M&E",
        content: "Là nữ kỹ sư, tôi từng e ngại Revit khó. Nhưng sự hỗ trợ 1-1 Ultraview của DSCons đã giúp tôi làm chủ phần mềm chỉ sau 1 tháng. Giờ tôi tự tin triển khai dự án cao ốc 40 tầng."
      },
      {
        name: "Trần Minh Quang",
        role: "BIM Coordinator - Archetype Group",
        content: "Hệ thống bài giảng rất 'thực chiến', sát với thực tế thi công tại Việt Nam. Đặc biệt bộ Template chuẩn giúp tôi rút ngắn 70% thời gian thiết lập dự án ban đầu."
      },
      {
        name: "Vũ Đức Trọng",
        role: "Kỹ sư HVAC - Searefico",
        content: "Phần tính toán tải lạnh và ống gió trên Revit được hướng dẫn cực sâu. Tôi đã áp dụng và phát hiện sai sót của đơn vị tư vấn trước đó, giúp chủ đầu tư tiết kiệm hàng trăm triệu."
      },
      {
        name: "Đặng Huy Hoàng",
        role: "Freelancer MEP Designer",
        content: "Từ khi có kỹ năng Revit MEP chuyên sâu, tôi nhận được nhiều job dự án nước ngoài hơn. Thu nhập thụ động của tôi tăng đáng kể nhờ tốc độ xử lý bản vẽ cực nhanh."
      },
      {
        name: "Trương Ngọc Bảo",
        role: "Sinh viên năm cuối - ĐH Bách Khoa",
        content: "Cảm ơn DSCons đã giúp em có chứng chỉ uy tín và kỹ năng thực tế. Nhờ đó, em đã trúng tuyển vào Sigma Corp ngay khi chưa nhận bằng tốt nghiệp."
      },
      {
        name: "Nguyễn Hữu Tài",
        role: "Giám đốc kỹ thuật - SME Consulting",
        content: "Tôi cử 5 nhân sự đi học và kết quả vượt mong đợi. Quy trình làm việc của team đồng bộ hoàn toàn, chất lượng hồ sơ thiết kế nâng tầm chuyên nghiệp hẳn."
      },
      {
        name: "Lý Văn Thắng",
        role: "Giám sát cơ điện (M&E)",
        content: "Hiểu Revit giúp tôi quản lý thầu phụ tốt hơn. Việc soi va chạm trên mô hình 3D trước khi ra công trường giúp giảm thiểu 90% lỗi đục phá, sửa chữa."
      },
      {
        name: "Hoàng Văn Linh",
        role: "Kỹ sư Cấp thoát nước - Delta Group",
        content: "Khóa học Revit MEP duy nhất tôi thấy dạy kỹ về phần xử lý độ dốc và phụ kiện đường ống phức tạp. Kiến thức thực tế đến từng con ốc!"
      }
    ],
    videoItems: [
      {
        name: "Phạm Văn Nam",
        role: "Học viên Revit MEP",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      }
    ],
    partners: [
      { name: "Vingroup", logoUrl: "https://svgl.app/library/vercel_wordmark.svg" },
      { name: "Taikisha", logoUrl: "https://svgl.app/library/supabase_wordmark_light.svg" },
      { name: "Hawee", logoUrl: "https://svgl.app/library/github_wordmark_light.svg" }
    ],
    partnersRow2: [
      { name: "Coteccons", logoUrl: "" },
      { name: "Hoa Binh", logoUrl: "" },
      { name: "Ricons", logoUrl: "" }
    ],
    partnersRow3: [
      { name: "Unicons", logoUrl: "" },
      { name: "Newtecons", logoUrl: "" },
      { name: "Sol E&C", logoUrl: "" }
    ]
  },
  bottomCta: {
    title: "Chần chừ hôm nay, tuột mất bệ phóng sự nghiệp ngày mai",
    description: "Các kỹ sư khác đang thuần thục Revit MEP mỗi ngày để nâng cao mức lương. Tham gia vào hệ sinh thái của DSCons ngay hôm nay để nhận quyền lợi Kèm 1-1 Ultraview, học lại miễn phí và Kho quà tặng (Trị giá 6.150K).",
    button: "Đăng ký Khóa thực chiến · 3.900K",
    href: "#pricing",
    countdownDate: "2026-05-15T19:30:00",
    scheduleText: "Thứ 3 - 5 (19h30 - 21h30)",
    supportLink: "https://zalo.me/0917379181",
    copyright: "© 2026 DSCons Global Academy. All rights reserved.",
    statusText: "Khóa K4 đang bắt đầu",
    socialLinks: {
      facebook: "https://facebook.com",
      youtube: "https://youtube.com",
      website: "https://dscons.vn",
      zalo: "https://zalo.me/0917379181"
    }
  },
  faq: {
    badge: "GIẢI ĐÁP THẮC MẮC",
    title: "Giải đáp thắc mắc thường gặp",
    questions: [
      { q: "Tôi đã lớn tuổi, liệu có theo kịp công nghệ 3D (BIM) không?", a: "Khóa học thiết kế riêng quy trình chậm-chắc. Nếu phần nào chưa rõ, giảng viên sẽ Ultraview hướng dẫn 1-kèm-1 trực tiếp trên máy của bạn nên không lo bị tụt lại." },
      { q: "Chức năng hỏi đáp AI 24/7 hoạt động như thế nào?", a: "Ngoài giờ hỗ trợ của giảng viên, bạn được cấp quyền truy cập công cụ AI chuyên dòng Revit MEP của DSCons. Bất cứ khi nào bí lệnh hay gặp lỗi, AI sẽ phân tích và đưa ra hướng dẫn trong tích tắc." },
      { q: "Lịch bộn bề, tôi phải làm sao nếu lỡ buổi học Live?", a: "Phần mềm quay màn hình rực nét sẽ lưu lại 100% buổi học. Bạn có thể tự học theo tiến độ cá nhân thông qua Video Record. Hệ thống hỗ trợ 1-1 vẫn luôn sẵn sàng tương tác với bạn." }
    ]
  },
  footer: {
    copyright: "© DSCons Việt Nam. All Rights Reserved."
  }
};
