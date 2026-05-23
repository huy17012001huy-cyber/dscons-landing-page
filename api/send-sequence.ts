import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

interface ExtendedRequest {
  method: string;
  body: {
    email?: string;
    name?: string;
  };
}

interface ExtendedResponse {
  setHeader(name: string, values: string[]): void;
  status(code: number): {
    json(data: Record<string, unknown>): void;
  };
}

export default async function handler(req: ExtendedRequest, res: ExtendedResponse) {
  // Only allow POST request
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const { email, name } = req.body;
    if (!email || !name) {
      return res.status(400).json({ error: 'Thiếu thông tin email hoặc tên học viên' });
    }

    // Lọc sạch "+test" để tương thích hoàn toàn với chế độ Resend Sandbox (Chỉ cho phép gửi đến chính chủ đăng ký)
    const cleanEmail = email.replace(/\+test/i, '');

    // Khởi tạo Supabase client trong môi trường Serverless
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

    // A. Đọc cấu hình từ system_settings
    let resendApiKey = process.env.RESEND_API_KEY;
    let senderEmail = 'onboarding@resend.dev';

    try {
      const { data: settings } = await supabase.from('system_settings').select('key, value');
      if (settings) {
        const keyConfig = settings.find(s => s.key === 'resend_api_key');
        const emailConfig = settings.find(s => s.key === 'resend_sender_email');
        if (keyConfig && keyConfig.value) resendApiKey = keyConfig.value;
        if (emailConfig && emailConfig.value) senderEmail = emailConfig.value;
      }
    } catch (dbErr) {
      console.error("Lỗi đọc cấu hình system_settings từ database:", dbErr);
    }

    // Fallback đọc từ file nếu DB lỗi hoặc không có giá trị
    if (!resendApiKey) {
      try {
        const configPath = path.join(process.cwd(), 'resend_config.txt');
        if (fs.existsSync(configPath)) {
          resendApiKey = fs.readFileSync(configPath, 'utf8').trim();
        }
      } catch (err) {
        console.error('Lỗi khi đọc file resend_config.txt:', err);
      }
    }

    if (!resendApiKey) {
      return res.status(500).json({ error: 'Không tìm thấy Resend API Key trong Database hoặc file resend_config.txt.' });
    }

    // B. Đọc các mẫu email từ email_templates
    let email1_subject = 'Chào mừng ae đến với thế giới Revit MEP Thực Chiến! 🚀';
    let email1_html = `
      <p>Chào ae, mình là Huy DSCons đây.</p>
      <p>Rất vui vì ae đã tin tưởng điền form đăng ký vào hàng ngũ danh sách chờ của DSCons.</p>
      <p>Biết ae kỹ sư cơ điện bận rộn ngoài công trường, tăng ca suốt, mình sẽ đi thẳng vào vấn đề, không có lý thuyết giáo điều sáo rỗng. Ở đây chỉ có kinh nghiệm thực chiến từ hơn 20 dự án lớn nhỏ mà DSCons đã trực tiếp thi công và bàn giao thành công.</p>
      <p>Như đã hứa, món quà đặc quyền để ae làm quen trước đã được kích hoạt:</p>
      <ul>
        <li><strong>Template rải ống cơ điện chuẩn chỉnh của DSCons</strong> (đã tối ưu thông số).</li>
        <li><strong>Bộ Family 3D cơ bản</strong> giúp kéo thả rải thiết bị mượt mà không lỗi.</li>
      </ul>
      <p>👉 <strong><a href="https://drive.google.com/drive/folders/2_revit_mep_combo_gifts_fake" target="_blank">Ae bấm vào đây để tải Bộ Quà Tặng & Tài Liệu đặc quyền nhé</a></strong></p>
      <p><em>Lưu ý:</em> Vào ngày kia (2 ngày nữa), mình sẽ gửi cho ae một bài chia sẻ cực kỳ đắt giá về cái bẫy "vẽ mô hình 3D chỉ để ngắm" mà 90% kỹ sư Revit mới vào nghề đều mắc phải khiến sếp và chủ đầu tư trả lại bản vẽ liên tục. Ae nhớ mở hòm thư đón đọc nhé!</p>
      <p>Chúc ae một ngày làm việc hiệu quả, vẽ mô hình mượt mà không lỗi!</p>
      <p>— Huy DSCons</p>
    `;

    let email2_subject = 'Cái bẫy "Mô hình 3D chỉ để ngắm" và bài học xương máu của mình... ⚠️';
    let email2_html = `
      <p>Chào ae, lại là Huy DSCons đây.</p>
      <p>Hôm nay mình muốn chia sẻ với ae một bài học xương máu từ thời mình mới chập chững bước chân vào nghề làm Revit MEP.</p>
      <p>Hồi đó, mình hăm hở dựng hình 3D phối màu lung linh, nhìn mô hình chạy trên máy sướng mắt lắm. Nghĩ bụng thế này là đỉnh rồi. Cho đến ngày mang bản vẽ ra ngoài công trường thực tế để lắp đặt...</p>
      <p>Hỡi ôi! Ống nước chữa cháy đè bẹp dí ống gió, ống thoát nước đâm thẳng xuyên qua dầm bê tông cốt thép. Công nhân đục phá nát bét cả trần thạch cao, hao hụt vật tư trầm trọng. Sếp gọi lên văn phòng mắng vuốt mặt không kịp.</p>
      <p>Rút ra bài học cực kỳ đắt giá: <strong>Nếu mô hình 3D không giải quyết được va chạm thực tế và không xuất ra được khối lượng chính xác để thi công, thì nó chỉ là một bức tranh để ngắm thôi, vô giá trị!</strong></p>
      <p>Bí quyết thực chiến ở đây là: <strong>Vẽ để thi công chứ không phải vẽ để chụp ảnh.</strong></p>
      <p>Một mô hình Revit MEP thực chiến đúng nghĩa phải đạt 3 tiêu chí:</p>
      <ol>
        <li><strong>Không còn va chạm:</strong> Mọi ống gió, ống nước phải né dầm, né cột chuẩn chỉ từ khâu thiết kế 3D.</li>
        <li><strong>Khối lượng tự động:</strong> Bấm 1 nút là Excel xuất ra chính xác 100% từng cái tê, cút, chếch để đi mua vật tư, không phải ngồi đếm tay còng lưng sai sót be bét.</li>
        <li><strong>Template chuẩn:</strong> Giúp tăng tốc độ vẽ nhanh hơn 30% so với vẽ CAD 2D truyền thống.</li>
      </ol>
      <p>Ngày mai, mình sẽ chỉ cho ae lộ trình chi tiết chỉ trong 6 tuần để làm chủ toàn bộ quy trình thực chiến này nhằm nâng cao tay nghề và bứt phá thu nhập nhanh nhất.</p>
      <p>Hẹn gặp lại ae trong hòm thư ngày mai nhé!</p>
      <p>— Huy DSCons</p>
    `;

    let email3_subject = 'Chỉ 6 tuần để chấm dứt cảnh "CAD 2D đếm tay còng lưng" 🎯';
    let email3_html = `
      <p>Chào ae, Huy DSCons đây.</p>
      <p>Hai hôm nay chúng ta đã nói về tư duy vẽ thực chiến và tránh cái bẫy mô hình 3D chỉ để ngắm. Hôm nay, mình muốn rủ ae cùng bắt tay vào hành động thật sự.</p>
      <p>Thay vì ae cứ phải ngồi mò mẫm tự học Revit trên mạng mất cả năm trời, bế tắc khi gặp lỗi file không ai sửa, dễ chán nản rồi dậm chân tại chỗ...</p>
      <p>Chỉ với 6 tuần học trực tiếp tương tác trực tuyến qua Zoom cùng mình, ae sẽ hoàn toàn tự tin làm chủ Revit MEP thực chiến, tự tin vẽ mô hình chuẩn chỉ và tự nhận thêm việc ngoài kiếm thêm thu nhập 10-15 triệu mỗi tháng dễ dàng.</p>
      <p>DSCons mang đến 3 gói học thực chiến tối ưu nhất cho ae chọn lựa:</p>
      <ul>
        <li><strong>Gói Thực Chiến (3.900K):</strong> 12 buổi học tương tác trực tuyến qua Zoom, chấm bài chi tiết, hỗ trợ 1-1 từ 8h - 22h, tặng bộ Family 3D trị giá 2.000K.</li>
        <li><strong>Gói Combo (6.400K):</strong> Đầy đủ ưu đãi Gói Thực Chiến + tặng khóa học Thiết lập Template (1.000K) + tặng khóa viết CV xin việc + hỗ trợ Zalo trọn đời.</li>
        <li><strong>Gói All In One (12.000K):</strong> Học toàn bộ khóa học trọn đời + tặng bộ phần mềm DSCons Tool vĩnh viễn (5.000K) + giới thiệu việc làm trực tiếp tới nhà thầu cơ điện lớn.</li>
      </ul>
      <p>⚠️ <strong>Cam kết vàng của Huy:</strong> Mình cam kết bằng video trực tiếp ở buổi khai giảng — hoàn trả 100% học phí cuối khóa nếu ae thấy không hài lòng với chất lượng giảng dạy. Rủi ro của ae bằng 0!</p>
      <p>Lớp học giới hạn chỉ từ 15-25 học viên để mình trực tiếp hỗ trợ qua phần mềm Ultraview sửa lỗi kỹ nhất cho từng người, và các suất ưu đãi học phí sắp đóng lại rồi.</p>
      <p>👉 <strong><a href="https://www.dscons.io.vn/dang-ky" target="_blank">Ae bấm vào đây để Đăng Ký Giữ Chỗ & Nhận Mã Ưu Đãi Học Phí ngay hôm nay nhé!</a></strong></p>
      <p>Đừng để năm 2026 trôi qua mà ae vẫn loay hoay với bản vẽ CAD 2D còng lưng nữa. Hãy bứt phá sự nghiệp ngay hôm nay!</p>
      <p>— Huy DSCons</p>
    `;

    try {
      const { data: templates } = await supabase.from('email_templates').select('id, subject, html_content');
      if (templates) {
        const t1 = templates.find(t => t.id === 'waitlist-welcome');
        const t2 = templates.find(t => t.id === 'nurture-1');
        const t3 = templates.find(t => t.id === 'sales-1');

        if (t1) {
          email1_subject = t1.subject;
          email1_html = t1.html_content;
        }
        if (t2) {
          email2_subject = t2.subject;
          email2_html = t2.html_content;
        }
        if (t3) {
          email3_subject = t3.subject;
          email3_html = t3.html_content;
        }
      }
    } catch (dbErr) {
      console.error("Lỗi đọc email_templates từ database, sử dụng mẫu mặc định:", dbErr);
    }

    // Hỗ trợ cá nhân hóa tên học viên trong HTML mẫu email động
    email1_html = email1_html.replace(/\{\{name\}\}/g, name);
    email2_html = email2_html.replace(/\{\{name\}\}/g, name);
    email3_html = email3_html.replace(/\{\{name\}\}/g, name);

    const isTest = email.toLowerCase().includes('+test');

    const sendEmail = async (subject: string, html: string) => {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'resend-node'
        },
        body: JSON.stringify({
          from: `DSCons Revit MEP <${senderEmail}>`,
          to: [cleanEmail],
          subject: subject,
          html: html
        })
      });
      const data = (await response.json()) as Record<string, unknown>;
      if (!response.ok) {
        throw new Error(typeof data.message === 'string' ? data.message : 'Lỗi gửi mail qua Resend API');
      }
      return data;
    };

    if (isTest) {
      // Gửi cả 3 email ngay lập tức trong chế độ test
      console.log(`[Test Mode] Sending all 3 emails immediately to ${email}`);
      const res1 = await sendEmail(email1_subject, email1_html);
      const res2 = await sendEmail(email2_subject, email2_html);
      const res3 = await sendEmail(email3_subject, email3_html);

      return res.status(200).json({
        success: true,
        testMode: true,
        results: [res1, res2, res3],
        message: 'Đã gửi cả 3 email lập tức trong chế độ Test!'
      });
    } else {
      // Gửi Email 1 ngay lập tức
      const res1 = await sendEmail(email1_subject, email1_html);
      
      // Cho một dự án production thật, các email 2 và 3 có thể được lập lịch gửi qua 1 hàng đợi hoặc DB cron.
      return res.status(200).json({
        success: true,
        testMode: false,
        result: res1,
        message: 'Đã gửi Email 1 chào mừng thành công!'
      });
    }

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Lỗi gửi chuỗi email sequence';
    console.error('Lỗi API send-sequence:', error);
    return res.status(500).json({ error: errorMsg });
  }
}
