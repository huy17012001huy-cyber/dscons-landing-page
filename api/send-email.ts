import fs from 'fs';
import path from 'path';

interface EmailBody {
  to?: string | string[];
  subject?: string;
  html?: string;
}

interface ExtendedRequest {
  method: string;
  body: EmailBody;
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
    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Thiếu thông tin gửi email (to, subject, hoặc html)' });
    }

    // Đọc API Key từ file resend_config.txt hoặc env
    let apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      try {
        const configPath = path.join(process.cwd(), 'resend_config.txt');
        if (fs.existsSync(configPath)) {
          apiKey = fs.readFileSync(configPath, 'utf8').trim();
        }
      } catch (err) {
        console.error('Lỗi khi đọc file resend_config.txt:', err);
      }
    }

    if (!apiKey) {
      return res.status(500).json({ error: 'Không tìm thấy Resend API Key trong resend_config.txt hoặc biến môi trường.' });
    }

    // Gọi API của Resend bằng fetch mặc định (không cần cài thêm thư viện npm)
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'resend-node'
      },
      body: JSON.stringify({
        from: 'DSCons Revit MEP <onboarding@resend.dev>', // Email mặc định test của Resend
        to: Array.isArray(to) ? to : [to],
        subject: subject,
        html: html
      })
    });

    const data = (await response.json()) as Record<string, unknown>;
    if (!response.ok) {
      const message = typeof data.message === 'string' ? data.message : 'Lỗi gửi email từ Resend';
      throw new Error(message);
    }

    console.log('Gửi email thành công qua Resend:', data);
    return res.status(200).json({ success: true, data });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Lỗi API gửi email';
    console.error('Lỗi API gửi email:', error);
    return res.status(500).json({ error: errorMsg });
  }
}
