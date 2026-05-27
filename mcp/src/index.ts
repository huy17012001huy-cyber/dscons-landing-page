import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';
import * as z from 'zod';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables (to know port of main site, and Supabase credentials)
let envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  envPath = path.join(process.cwd(), '..', '.env');
}
if (!fs.existsSync(envPath)) {
  envPath = path.join(__dirname, '..', '..', '.env');
}
if (!fs.existsSync(envPath)) {
  envPath = 'e:\\ANTIGRAVITY\\DSCons_Landing Page_Zoom\\.env';
}
console.log(`[${new Date().toISOString()}] Loading environment from: ${envPath}`);
dotenv.config({ path: envPath });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(`[${new Date().toISOString()}] [CRITICAL] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment!`);
} else {
  console.log(`[${new Date().toISOString()}] MCP Server initialized to connect directly to Supabase REST API: ${supabaseUrl}`);
}

// Supabase API Fetch Helper
async function supabaseFetch(path: string, options: any = {}) {
  const url = `${supabaseUrl}/rest/v1/${path}`;
  const headers = {
    'apikey': supabaseAnonKey,
    'Authorization': `Bearer ${supabaseAnonKey}`,
    'Content-Type': 'application/json',
    ...options.headers
  };
  const res = await fetch(url, {
    ...options,
    headers
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase API error (${res.status}): ${text}`);
  }
  if (res.status === 204) {
    return null;
  }
  return res.json();
}

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
    description: 'Retrieve dynamic business reports (registrations, sales, revenue, and remaining stocks) for a given time range directly from Supabase.',
    inputSchema: {
      time_range: z.enum(['today', 'yesterday', 'week', 'month']).default('today').describe('Filtering range for reporting metrics')
    }
  }, async ({ time_range }) => {
    logAction('get_business_summary', { time_range });
    try {
      let dateQuery = "";
      let rangeLabel = "Hôm nay";
      
      if (time_range === 'today') {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        dateQuery = `&created_at=gte.${todayStart.toISOString()}`;
      } else if (time_range === 'yesterday') {
        const yesterdayStart = new Date();
        yesterdayStart.setDate(yesterdayStart.getDate() - 1);
        yesterdayStart.setHours(0, 0, 0, 0);
        const yesterdayEnd = new Date();
        yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
        yesterdayEnd.setHours(23, 59, 59, 999);
        dateQuery = `&created_at=gte.${yesterdayStart.toISOString()}&created_at=lte.${yesterdayEnd.toISOString()}`;
        rangeLabel = "Hôm qua";
      } else if (time_range === 'week') {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);
        dateQuery = `&created_at=gte.${weekStart.toISOString()}`;
        rangeLabel = "7 ngày gần đây";
      } else if (time_range === 'month') {
        const monthStart = new Date();
        monthStart.setDate(monthStart.getDate() - 30);
        dateQuery = `&created_at=gte.${monthStart.toISOString()}`;
        rangeLabel = "30 ngày gần đây";
      }

      // Query 1: Waitlist leads count
      const leads = await supabaseFetch(`customers?select=id${dateQuery}`);
      const leadsCount = leads?.length || 0;

      // Query 2: Completed orders metrics
      const completedOrders = await supabaseFetch(`orders?status=eq.completed&select=amount${dateQuery}`);
      const ordersCompleted = completedOrders?.length || 0;
      const revenue = (completedOrders || []).reduce((sum: number, o: any) => sum + Number(o.amount || 0), 0);

      // Query 3: Pending orders count
      const pendingOrders = await supabaseFetch(`orders?status=eq.pending&select=id${dateQuery}`);
      const ordersPending = pendingOrders?.length || 0;

      // Query 4: Course product stock
      const products = await supabaseFetch(`products?select=id,name,price,stock`);

      // Format money
      const formatVND = (val: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
      };

      let textOutput = `📊 BÁO CÁO KINH DOANH DSCONS (${rangeLabel}) [SUPABASE]:\n`;
      textOutput += `- Đăng ký danh sách chờ (Waitlist): ${leadsCount} học viên mới.\n`;
      textOutput += `- Đơn hàng đã hoàn tất: ${ordersCompleted} đơn.\n`;
      textOutput += `- Doanh thu thực tế nhận được: ${formatVND(revenue)}.\n`;
      textOutput += `- Đơn hàng đang chờ thanh toán: ${ordersPending} đơn.\n\n`;
      textOutput += `Remaining stock (Slots ưu đãi khóa học còn lại):\n`;
      
      (products || []).forEach((p: any) => {
        const shortName = p.name.split('—')[1]?.trim() || p.name;
        textOutput += `+ ${shortName}: Còn ${p.stock} slots (Giá bán: ${formatVND(p.price)})\n`;
      });

      return {
        content: [{ type: 'text', text: textOutput }]
      };
    } catch (error: any) {
      console.error(`[ERROR] get_business_summary failed:`, error);
      return {
        content: [{ type: 'text', text: `Error generating business summary from Supabase: ${error.message}` }],
        isError: true
      };
    }
  });

  // Tool 2: manage_order_status
  server.registerTool('manage_order_status', {
    description: 'Search, check, complete, or cancel specific student order records in Supabase.',
    inputSchema: {
      query: z.string().describe('Target order ID (DS-xxx) or student phone number'),
      action: z.enum(['check', 'complete', 'cancel']).default('check').describe('Operations: check (view detail), complete (confirm paid & send email), cancel (void order)')
    }
  }, async ({ query, action }) => {
    logAction('manage_order_status', { query, action });
    try {
      // 1. Search for order by ID or customer phone in Supabase
      let orders = [];
      if (query.toUpperCase().startsWith('DS-')) {
        orders = await supabaseFetch(`orders?id=eq.${query}&select=*`);
      } else {
        orders = await supabaseFetch(`orders?customer_phone=eq.${query}&select=*&order=created_at.desc`);
      }

      if (!orders || orders.length === 0) {
        return {
          content: [{ type: 'text', text: `❌ Không tìm thấy thông tin đơn hàng trùng khớp với từ khóa "${query}" trên hệ thống Supabase.` }]
        };
      }

      const order = orders[0];

      // 2. Perform requested action
      const formatVND = (val: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
      };

      if (action === 'check') {
        let statusLabel = order.status === 'completed' ? '🟢 COMPLETED (Đã thanh toán)' : 
                          order.status === 'cancelled' ? '🔴 CANCELLED (Đã hủy)' : '🟡 PENDING (Chờ thanh toán)';
        
        let detailText = `🔔 THÔNG TIN ĐƠN HÀNG (SUPABASE):\n`;
        detailText += `- Mã đơn hàng: ${order.id}\n`;
        detailText += `- Học viên: ${order.customer_name} (SĐT: ${order.customer_phone})\n`;
        detailText += `- Gói đăng ký: ${order.product_id}\n`;
        detailText += `- Giá trị đơn hàng: ${formatVND(Number(order.amount))}\n`;
        detailText += `- Trạng thái hiện tại: ${statusLabel}\n`;
        if (order.payment_date) {
          detailText += `- Ngày thanh toán: ${order.payment_date}\n`;
        }
        if (order.sepay_transaction_id) {
          detailText += `- Giao dịch Sepay: ${order.sepay_transaction_id}\n`;
        }

        return { content: [{ type: 'text', text: detailText }] };
      }

      if (action === 'cancel') {
        await supabaseFetch(`orders?id=eq.${order.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'cancelled' })
        });
        return {
          content: [{ type: 'text', text: `🟢 Đã hủy thành công đơn hàng ${order.id} của học viên ${order.customer_name} trên Supabase.` }]
        };
      }

      if (action === 'complete') {
        if (order.status === 'completed') {
          return {
            content: [{ type: 'text', text: `ℹ️ Đơn hàng ${order.id} của học viên ${order.customer_name} đã ở trạng thái HOÀN THÀNH từ trước trên Supabase.` }]
          };
        }

        // Update order status to completed
        await supabaseFetch(`orders?id=eq.${order.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            status: 'completed',
            payment_date: new Date().toISOString()
          })
        });

        // Decrement stock slots
        if (order.product_id) {
          const productList = await supabaseFetch(`products?id=eq.${order.product_id}&select=stock`);
          if (productList && productList.length > 0) {
            const stock = productList[0].stock;
            if (stock > 0) {
              await supabaseFetch(`products?id=eq.${order.product_id}`, {
                method: 'PATCH',
                body: JSON.stringify({ stock: stock - 1 })
              });
            }
          }
        }

        // Trigger confirmation email flow via main express api
        let emailTriggerStatus = "Không gửi được email (thiếu thông tin khách hàng)";
        const customers = await supabaseFetch(`customers?phone=eq.${order.customer_phone}&select=*`);
        const productList = await supabaseFetch(`products?id=eq.${order.product_id}&select=*`);

        if (customers && customers.length > 0 && productList && productList.length > 0) {
          const customer = customers[0];
          const product = productList[0];
          if (customer.email) {
            try {
              const apiPort = process.env.PORT || 3000;
              const url = `http://localhost:${apiPort}/api/send-order-confirm`;
              
              const emailBody = {
                email: customer.email,
                customerName: order.customer_name,
                productName: product.name,
                amount: Number(order.amount),
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
        }

        return {
          content: [{
            type: 'text',
            text: `🟢 Đã duyệt thành công đơn hàng ${order.id} cho học viên ${order.customer_name} trên Supabase!\n` +
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
        content: [{ type: 'text', text: `Error managing order status on Supabase: ${error.message}` }],
        isError: true
      };
    }
  });

  // Tool 3: get_recent_leads
  server.registerTool('get_recent_leads', {
    description: 'Retrieve latest registered customers/leads containing details about their positions, goals, and painpoints directly from Supabase.',
    inputSchema: {
      limit: z.number().default(5).describe('Maximum number of leads to fetch'),
      has_painpoints_only: z.boolean().default(true).describe('Filter to only display leads who explicitly filled detailed painpoint profiles')
    }
  }, async ({ limit, has_painpoints_only }) => {
    logAction('get_recent_leads', { limit, has_painpoints_only });
    try {
      let queryUrl = `customers?order=created_at.desc&limit=${limit}`;
      if (has_painpoints_only) {
        queryUrl = `customers?painpoint=not.eq.&painpoint=not.is.null&order=created_at.desc&limit=${limit}`;
      }

      const leads = await supabaseFetch(queryUrl);

      if (!leads || leads.length === 0) {
        return {
          content: [{ type: 'text', text: 'ℹ️ Không tìm thấy học viên đăng ký mới nào trên Supabase.' }]
        };
      }

      let textOutput = `📝 DANH SÁCH HỌC VIÊN ĐĂNG KÝ GẦN ĐÂY (SUPABASE):\n\n`;
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
        content: [{ type: 'text', text: `Error fetching recent leads from Supabase: ${error.message}` }],
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

// Stateless HTTP Endpoint (POST) to support streamable-http transport
app.post('/mcp', async (req, res) => {
  const token = req.query.token as string;
  const expectedToken = process.env.GOCLAW_GATEWAY_TOKEN || 'f25bab0eedc7c444138a8a5e6003c9a7';
  
  if (token !== expectedToken) {
    console.warn(`[${new Date().toISOString()}] [SECURITY] Unauthorized POST request attempt. Token: "${token}"`);
    res.status(401).send('Unauthorized: Invalid or missing token');
    return;
  }

  const requestMessage = req.body;
  if (!requestMessage || typeof requestMessage !== 'object') {
    res.status(400).send('Bad Request: Invalid JSON-RPC message body');
    return;
  }

  const responses: any[] = [];
  const mockTransport = {
    start: async () => {
      if (mockTransport.onmessage) {
        mockTransport.onmessage(requestMessage);
      }
    },
    close: async () => {},
    send: async (message: any) => {
      responses.push(message);
    },
    onmessage: undefined as any,
    onclose: undefined as any,
    onerror: undefined as any
  };

  const mcpServer = createMcpServer();

  try {
    await mcpServer.connect(mockTransport);
    
    // Wait for the response to be captured (max 5000ms timeout)
    const startTime = Date.now();
    while (responses.length === 0 && Date.now() - startTime < 5000) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    await mcpServer.close();

    if (responses.length > 0) {
      res.json(responses[0]);
    } else {
      res.status(204).end(); // No Content for notifications
    }
  } catch (error: any) {
    console.error(`[${new Date().toISOString()}] Error handling stateless HTTP request:`, error);
    res.status(500).send(`Error processing request: ${error.message}`);
  }
});

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
        // Unset callback to break recursion close loop
        transport.onclose = undefined;
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
  console.log(`[${new Date().toISOString()}] 🚀 DSCons CRM MCP Server is now active (Supabase Sync Mode)!`);
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


