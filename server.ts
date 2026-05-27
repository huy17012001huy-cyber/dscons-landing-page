import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Nạp các biến môi trường từ file .env
dotenv.config();

// Import trực tiếp các handler từ thư mục api
import sendEmailHandler from './api/send-email';
import sendOrderConfirmHandler from './api/send-order-confirm';
import sendSequenceHandler from './api/send-sequence';
import sepayWebhookHandler from './api/sepay-webhook';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Middleware giả lập cấu trúc Request và Response tương thích với Vercel Serverless
const vercelCompat = (handler: any) => {
  return async (req: express.Request, res: express.Response) => {
    try {
      // Giả lập req.method, req.body, req.headers
      const compatReq = req as any;
      compatReq.headers = req.headers;
      
      // Giả lập res.status().json() và res.setHeader()
      const compatRes = {
        setHeader: (name: string, values: string[]) => {
          res.setHeader(name, values);
        },
        status: (code: number) => {
          return {
            json: (data: any) => {
              res.status(code).json(data);
            }
          };
        }
      } as any;

      await handler(compatReq, compatRes);
    } catch (error) {
      console.error(`Lỗi thực thi API [${req.path}]:`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
};

// Định nghĩa các Route tương thích hoàn toàn với Client gọi
app.post('/api/send-email', vercelCompat(sendEmailHandler));
app.post('/api/send-order-confirm', vercelCompat(sendOrderConfirmHandler));
app.post('/api/send-sequence', vercelCompat(sendSequenceHandler));
app.post('/api/sepay-webhook', vercelCompat(sepayWebhookHandler));

// Phục vụ các file tĩnh của React nếu chạy chung cổng (hoặc để Nginx tự phục vụ)
app.use(express.static(path.join(process.cwd(), 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 DSCons API Server is running on port ${PORT}`);
});
