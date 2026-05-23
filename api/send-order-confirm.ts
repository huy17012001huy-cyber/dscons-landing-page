import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

interface OrderConfirmBody {
  email?: string;
  customerName?: string;
  productName?: string;
  amount?: number;
  downloadUrl?: string;
}

interface ExtendedRequest {
  method: string;
  body: OrderConfirmBody;
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
    const { email, customerName, productName, amount, downloadUrl } = req.body;

    if (!email || !customerName || !productName || !amount || !downloadUrl) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc để gửi email xác nhận đơn hàng' });
    }

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

    // Định dạng giá tiền VNĐ
    const amountDisplay = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);

    // B. Đọc mẫu email từ email_templates
    let subject = `Xác nhận đăng ký thành công khóa học ${productName}! 🎓`;
    let html = `
      <p>Chào ae, mình là Huy DSCons đây.</p>
      <p>Mình gửi hòm thư này để xác nhận đã nhận được khoản thanh toán của ae cho khóa học <strong>${productName}</strong>.</p>
      <p>Dưới đây là chi tiết biên nhận hóa đơn số của ae:</p>
      <ul>
        <li><strong>Học viên:</strong> ${customerName}</li>
        <li><strong>Sản phẩm đăng ký:</strong> ${productName}</li>
        <li><strong>Số tiền đã đóng:</strong> ${amountDisplay}</li>
      </ul>
      <p>🎁 <strong>Hướng dẫn nhận học liệu & Quà tặng đặc quyền:</strong></p>
      <p>Để bắt đầu học tập và làm quen ngay lập tức, ae hãy bấm vào đường dẫn dưới đây để tải toàn bộ tài liệu đặc quyền (Template rải ống cơ điện chuẩn chỉnh và bộ Family 3D cơ bản):</p>
      <p>👉 <strong><a href="${downloadUrl}" target="_blank">Bấm vào đây để Tải Quà Tặng & Tài Liệu Học Tập ngay 🎁</a></strong></p>
      <p>Đồng thời, tư vấn viên của DSCons sẽ trực tiếp liên hệ hỗ trợ ae vào lớp Zoom học qua Zalo trong vòng 15 phút tới. Ae hãy chú ý điện thoại nhé!</p>
      <p>Một lần nữa, vô cùng cảm ơn sự tin tưởng và quyết định bứt phá tay nghề của ae cùng DSCons.</p>
      <p>Hẹn gặp lại ae trong lớp học Zoom nhé!</p>
      <p>— Huy DSCons</p>
    `;

    try {
      const { data: template } = await supabase
        .from('email_templates')
        .select('subject, html_content')
        .eq('id', 'order-confirmation')
        .single();

      if (template) {
        subject = template.subject.replace(/\{\{product_name\}\}/g, productName);
        html = template.html_content
          .replace(/\{\{product_name\}\}/g, productName)
          .replace(/\{\{amount\}\}/g, amountDisplay)
          .replace(/\{\{download_url\}\}/g, downloadUrl);
      }
    } catch (dbErr) {
      console.error("Lỗi đọc email_templates xác nhận đơn hàng từ database, sử dụng mẫu mặc định:", dbErr);
    }

    // Lọc sạch "+test" để tương thích hoàn toàn với chế độ Resend Sandbox
    const cleanEmail = email.replace(/\+test/i, '');

    // Gọi API của Resend bằng fetch
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
      const message = typeof data.message === 'string' ? data.message : 'Lỗi gửi email xác nhận từ Resend';
      throw new Error(message);
    }

    console.log('Gửi email xác nhận đơn hàng thành công qua Resend:', data);
    return res.status(200).json({ success: true, data });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Lỗi gửi email xác nhận đơn hàng';
    console.error('Lỗi API send-order-confirm:', error);
    return res.status(500).json({ error: errorMsg });
  }
}
