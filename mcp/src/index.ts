import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';
import * as z from 'zod';
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables (to know port of main site, etc.)
dotenv.config();

// Determine SQLite brain.db path dynamically
let dbPath = path.join(process.cwd(), '..', 'brain.db');
if (!fs.existsSync(dbPath)) {
  dbPath = path.join(__dirname, '..', '..', 'brain.db');
}
if (!fs.existsSync(dbPath)) {
  dbPath = 'e:\\ANTIGRAVITY\\DSCons_Landing Page_Zoom\\brain.db';
}

console.log(`[${new Date().toISOString()}] Target SQLite Database path: ${dbPath}`);

// Initialize SQLite connection
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(`[${new Date().toISOString()}] Database connection error:`, err.message);
  } else {
    console.log(`[${new Date().toISOString()}] Connected to SQLite database: ${dbPath}`);
  }
});

// SQLite async wrappers
const dbAll = (sql: string, params: any[] = []): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const dbGet = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbRun = (sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

// Helper for logger
const logAction = (toolName: string, params: any) => {
  console.log(`[${new Date().toISOString()}] [MCP-CALL] Tool: ${toolName} | Params: ${JSON.stringify(params)}`);
};

// Initialize MCP Server Factory
const createMcpServer = () => {
  const server = new McpServer({
    name: 'dscons-mcp-server',
    version: '1.0.0',
  }, {
    capabilities: {
      tools: {},
      logging: {}
    }
  });

  // Tool 1: get_business_summary
  server.registerTool('get_business_summary', {
    description: 'Retrieve dynamic business reports (registrations, sales, revenue, and remaining stocks) for a given time range.',
    inputSchema: {
      time_range: z.enum(['today', 'yesterday', 'week', 'month']).default('today').describe('Filtering range for reporting metrics')
    }
  }, async ({ time_range }) => {
    logAction('get_business_summary', { time_range });
    try {
      // Generate date filter SQL
      let dateFilter = "date(created_at) = date('now')";
      let rangeLabel = "Hôm nay";
      
      if (time_range === 'yesterday') {
        dateFilter = "date(created_at) = date('now', '-1 day')";
        rangeLabel = "Hôm qua";
      } else if (time_range === 'week') {
        dateFilter = "created_at >= datetime('now', '-7 days')";
        rangeLabel = "7 ngày gần đây";
      } else if (time_range === 'month') {
        dateFilter = "created_at >= datetime('now', '-30 days')";
        rangeLabel = "30 ngày gần đây";
      }

      // Query 1: Waitlist leads count
      const leadsCountRow = await dbGet(`SELECT count(*) as count FROM customers WHERE ${dateFilter}`);
      const leadsCount = leadsCountRow?.count || 0;

      // Query 2: Completed orders metrics
      const salesRow = await dbGet(`SELECT count(*) as count, sum(amount) as revenue FROM orders WHERE status = 'completed' AND ${dateFilter}`);
      const ordersCompleted = salesRow?.count || 0;
      const revenue = salesRow?.revenue || 0;

      // Query 3: Pending orders count
      const pendingRow = await dbGet(`SELECT count(*) as count FROM orders WHERE status = 'pending' AND ${dateFilter}`);
      const ordersPending = pendingRow?.count || 0;

      // Query 4: Course product stock
      const products = await dbAll(`SELECT id, name, price, stock FROM products`);

      // Format money
      const formatVND = (val: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
      };

      let textOutput = `📊 BÁO CÁO KINH DOANH DSCONS (${rangeLabel}):\n`;
      textOutput += `- Đăng ký danh sách chờ (Waitlist): ${leadsCount} học viên mới.\n`;
      textOutput += `- Đơn hàng đã hoàn tất: ${ordersCompleted} đơn.\n`;
      textOutput += `- Doanh thu thực tế nhận được: ${formatVND(revenue)}.\n`;
      textOutput += `- Đơn hàng đang chờ thanh toán: ${ordersPending} đơn.\n\n`;
      textOutput += `Remaining stock (Slots ưu đãi khóa học còn lại):\n`;
      
      products.forEach((p: any) => {
        const shortName = p.name.split('—')[1]?.trim() || p.name;
        textOutput += `+ ${shortName}: Còn ${p.stock} slots (Giá bán: ${formatVND(p.price)})\n`;
      });

      return {
        content: [{ type: 'text', text: textOutput }]
      };
    } catch (error: any) {
      console.error(`[ERROR] get_business_summary failed:`, error);
      return {
        content: [{ type: 'text', text: `Error generating business summary: ${error.message}` }],
        isError: true
      };
    }
  });

  // Tool 2: manage_order_status
  server.registerTool('manage_order_status', {
    description: 'Search, check, complete, or cancel specific student order records.',
    inputSchema: {
      query: z.string().describe('Target order ID (DS-xxx) or student phone number'),
      action: z.enum(['check', 'complete', 'cancel']).default('check').describe('Operations: check (view detail), complete (confirm paid & send email), cancel (void order)')
    }
  }, async ({ query, action }) => {
    logAction('manage_order_status', { query, action });
    try {
      // 1. Search for order by ID or customer phone
      let order = await dbGet(
        `SELECT * FROM orders WHERE id = ? OR customer_phone = ? ORDER BY created_at DESC LIMIT 1`,
        [query, query]
      );

      // If order not found and the action is check, try finding customer first to create fallback order
      if (!order) {
        if (action === 'complete') {
          // Find customer
          const customer = await dbGet(`SELECT * FROM customers WHERE phone = ?`, [query]);
          const name = customer ? customer.name : 'Học viên vãng lai';
          const newOrderId = `DS-${Date.now()}`;
          
          console.log(`Order not found for phone ${query}. Creating fallback completed order.`);
          
          // Insert fallback completed order
          await dbRun(
            `INSERT INTO orders (id, customer_phone, customer_name, product_id, amount, status, payment_date)
             VALUES (?, ?, ?, 'revit-mep-thuc-chien', 3900000, 'completed', datetime('now'))`,
            [newOrderId, query, name]
          );
          
          order = await dbGet(`SELECT * FROM orders WHERE id = ?`, [newOrderId]);
        } else {
          return {
            content: [{ type: 'text', text: `❌ Không tìm thấy thông tin đơn hàng trùng khớp với từ khóa "${query}".` }]
          };
        }
      }

      // 2. Perform requested action
      const formatVND = (val: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
      };

      if (action === 'check') {
        let statusLabel = order.status === 'completed' ? '🟢 COMPLETED (Đã thanh toán)' : 
                          order.status === 'cancelled' ? '🔴 CANCELLED (Đã hủy)' : '🟡 PENDING (Chờ thanh toán)';
        
        let detailText = `🔔 THÔNG TIN ĐƠN HÀNG:\n`;
        detailText += `- Mã đơn hàng: ${order.id}\n`;
        detailText += `- Học viên: ${order.customer_name} (SĐT: ${order.customer_phone})\n`;
        detailText += `- Gói đăng ký: ${order.product_id}\n`;
        detailText += `- Giá trị đơn hàng: ${formatVND(order.amount)}\n`;
        detailText += `- Trạng thái hiện tại: ${statusLabel}\n`;
        if (order.payment_date) {
          detailText += `- Ngày thanh toán: ${order.payment_date}\n`;
        }
        if (order.sepay_transaction_id) {
          detailText += `- Mã giao dịch Sepay: ${order.sepay_transaction_id}\n`;
        }

        return { content: [{ type: 'text', text: detailText }] };
      }

      if (action === 'cancel') {
        await dbRun(`UPDATE orders SET status = 'cancelled' WHERE id = ?`, [order.id]);
        return {
          content: [{ type: 'text', text: `🟢 Đã hủy thành công đơn hàng ${order.id} của học viên ${order.customer_name}.` }]
        };
      }

      if (action === 'complete') {
        if (order.status === 'completed') {
          return {
            content: [{ type: 'text', text: `ℹ️ Đơn hàng ${order.id} của học viên ${order.customer_name} đã ở trạng thái HOÀN THÀNH từ trước.` }]
          };
        }

        // Update order status to completed
        await dbRun(
          `UPDATE orders SET status = 'completed', payment_date = datetime('now') WHERE id = ?`,
          [order.id]
        );

        // Decrement stock slots
        if (order.product_id) {
          const product = await dbGet(`SELECT * FROM products WHERE id = ?`, [order.product_id]);
          if (product && product.stock > 0) {
            await dbRun(`UPDATE products SET stock = stock - 1 WHERE id = ?`, [order.product_id]);
          }
        }

        // Trigger confirmation email flow via main express api
        let emailTriggerStatus = "Không gửi được email (thiếu thông tin khách hàng)";
        const customer = await dbGet(`SELECT * FROM customers WHERE phone = ?`, [order.customer_phone]);
        const product = await dbGet(`SELECT * FROM products WHERE id = ?`, [order.product_id]);

        if (customer && customer.email && product) {
          try {
            const apiPort = process.env.PORT || 3000;
            const url = `http://localhost:${apiPort}/api/send-order-confirm`;
            
            const emailBody = {
              email: customer.email,
              customerName: order.customer_name,
              productName: product.name,
              amount: order.amount,
              downloadUrl: product.download_url
            };

            console.log(`[EMAIL-TRIGGER] Sending manual trigger request to ${url}`);
            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(emailBody)
            });

            if (res.ok) {
              emailTriggerStatus = "🟢 Đã tự động gửi email xác nhận học tập thành công kèm link quà tặng.";
            } else {
              const errJson = await res.json() as any;
              emailTriggerStatus = `⚠️ Lỗi gửi email tự động: ${errJson.error || 'Server error'}`;
            }
          } catch (e: any) {
            emailTriggerStatus = `⚠️ Không thể gọi API gửi email: ${e.message}`;
          }
        }

        return {
          content: [{
            type: 'text',
            text: `🟢 Đã kích hoạt duyệt thành công đơn hàng ${order.id} cho học viên ${order.customer_name}!\n` +
                  `- Trạng thái đơn hàng: COMPLETED\n` +
                  `- Khấu trừ slots kho thành công.\n` +
                  `- Email flow: ${emailTriggerStatus}`
          }]
        };
      }

      return { content: [{ type: 'text', text: 'Unknown action operations.' }] };
    } catch (error: any) {
      console.error(`[ERROR] manage_order_status failed:`, error);
      return {
        content: [{ type: 'text', text: `Error managing order status: ${error.message}` }],
        isError: true
      };
    }
  });

  // Tool 3: get_recent_leads
  server.registerTool('get_recent_leads', {
    description: 'Retrieve latest registered customers/leads containing details about their positions, goals, and painpoints.',
    inputSchema: {
      limit: z.number().default(5).describe('Maximum number of leads to fetch'),
      has_painpoints_only: z.boolean().default(true).describe('Filter to only display leads who explicitly filled detailed painpoint profiles')
    }
  }, async ({ limit, has_painpoints_only }) => {
    logAction('get_recent_leads', { limit, has_painpoints_only });
    try {
      let query = `SELECT name, phone, email, role, painpoint, goal, created_at FROM customers`;
      let params: any[] = [];

      if (has_painpoints_only) {
        query += ` WHERE painpoint IS NOT NULL AND painpoint != ''`;
      }

      query += ` ORDER BY created_at DESC LIMIT ?`;
      params.push(limit);

      const leads = await dbAll(query, params);

      if (leads.length === 0) {
        return {
          content: [{ type: 'text', text: 'ℹ️ Không tìm thấy học viên đăng ký mới nào trùng khớp điều kiện.' }]
        };
      }

      let textOutput = `📝 DANH SÁCH HỌC VIÊN ĐĂNG KÝ GẦN ĐÂY:\n\n`;
      leads.forEach((l: any, idx: number) => {
        textOutput += `${idx + 1}. Học viên: ${l.name} (${l.phone})\n`;
        textOutput += `   - Vai trò: ${l.role || 'Không xác định'}\n`;
        textOutput += `   - Khó khăn: "${l.painpoint || 'Không ghi rõ'}"\n`;
        textOutput += `   - Mục tiêu: "${l.goal || 'Không ghi rõ'}"\n`;
        textOutput += `   - Ngày đăng ký: ${l.created_at}\n\n`;
      });

      return {
        content: [{ type: 'text', text: textOutput.trim() }]
      };
    } catch (error: any) {
      console.error(`[ERROR] get_recent_leads failed:`, error);
      return {
        content: [{ type: 'text', text: `Error fetching recent leads: ${error.message}` }],
        isError: true
      };
    }
  });

  return server;
};

// Setup Express App
const app = createMcpExpressApp();

// Active sessions map (stores transport and McpServer instances per sessionId)
const activeSessions: Record<string, { transport: SSEServerTransport; mcpServer: McpServer }> = {};

// SSE Endpoint (GET)
app.get('/mcp', async (req, res) => {
  const token = req.query.token as string;
  const expectedToken = process.env.GOCLAW_GATEWAY_TOKEN || 'f25bab0eedc7c444138a8a5e6003c9a7';
  
  if (token !== expectedToken) {
    console.warn(`[${new Date().toISOString()}] [SECURITY] Unauthorized SSE connection attempt. Token: "${token}"`);
    res.status(401).send('Unauthorized: Invalid or missing token');
    return;
  }

  console.log(`[${new Date().toISOString()}] [SECURITY] Authorized SSE Connection request received (Token verified)`);
  
  // Create a fresh McpServer instance for this connection
  const mcpServer = createMcpServer();

  try {
    // Create new SSE Transport for client
    const transport = new SSEServerTransport('/messages', res);
    const sessionId = transport.sessionId;
    
    activeSessions[sessionId] = { transport, mcpServer };

    // Remove transport on close
    transport.onclose = async () => {
      console.log(`[${new Date().toISOString()}] SSE Transport closed for session: ${sessionId}`);
      try {
        await mcpServer.close();
      } catch (err) {
        console.error(`Error closing mcpServer for session ${sessionId}:`, err);
      }
      delete activeSessions[sessionId];
    };

    // Connect transport to our per-connection MCP server
    await mcpServer.connect(transport);
    console.log(`[${new Date().toISOString()}] SSE Connection established for session: ${sessionId}`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] SSE connection setup failed:`, error);
    if (!res.headersSent) {
      res.status(500).send('Error initiating SSE transport');
    }
  }
});

// Messages Endpoint (POST)
app.post('/messages', async (req, res) => {
  const sessionId = req.query.sessionId as string;
  if (!sessionId) {
    console.error(`[${new Date().toISOString()}] Received message without sessionId parameter`);
    res.status(400).send('Missing sessionId query parameter');
    return;
  }

  const session = activeSessions[sessionId];
  if (!session) {
    console.error(`[${new Date().toISOString()}] Received message for inactive/unknown session: ${sessionId}`);
    res.status(404).send('Session not found');
    return;
  }

  try {
    await session.transport.handlePostMessage(req, res, req.body);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error processing message payload:`, error);
    if (!res.headersSent) {
      res.status(500).send('Error processing control message');
    }
  }
});

// Bind server ONLY to 127.0.0.1 (Localhost only) and Port 3001
const PORT = 3001;
const HOST = '127.0.0.1';

app.listen(PORT, HOST, () => {
  console.log(`[${new Date().toISOString()}] =============================================`);
  console.log(`[${new Date().toISOString()}] 🚀 DSCons CRM MCP Server is now active!`);
  console.log(`[${new Date().toISOString()}] 🌐 Listening locally at http://${HOST}:${PORT}`);
  console.log(`[${new Date().toISOString()}] - Endpoint GET:  http://${HOST}:${PORT}/mcp  (SSE)`);
  console.log(`[${new Date().toISOString()}] - Endpoint POST: http://${HOST}:${PORT}/messages`);
  console.log(`[${new Date().toISOString()}] =============================================`);
});

// Handle graceful termination
process.on('SIGINT', async () => {
  console.log(`[${new Date().toISOString()}] Terminating MCP Server...`);
  for (const sessionId in activeSessions) {
    try {
      await activeSessions[sessionId].transport.close();
      await activeSessions[sessionId].mcpServer.close();
      delete activeSessions[sessionId];
    } catch (e) {
      console.error(`Error closing session ${sessionId}:`, e);
    }
  }
  process.exit(0);
});

