import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: any, res: any) {
  // Chỉ chấp nhận POST request
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    // 1. Xác thực bảo mật API Key từ Sepay gửi sang
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const expectedApiKey = process.env.SEPAY_API_KEY;

    if (!expectedApiKey || authHeader !== `Apikey ${expectedApiKey}`) {
      console.warn('Cảnh báo: Webhook nhận yêu cầu không hợp lệ (Sai hoặc thiếu SEPAY_API_KEY).');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const body = req.body;
    console.log('Sepay webhook payload received:', body);

    const { id, transferAmount, content, transferType } = body;

    // Chỉ xử lý giao dịch nhận tiền (tiền vào tài khoản)
    if (transferType !== 'in') {
      return res.status(200).json({ success: true, message: 'Bỏ qua giao dịch chuyển tiền ra.' });
    }

    // 2. Trích xuất số điện thoại học viên từ nội dung chuyển khoản
    // Tìm cụm chữ DS kèm 9 đến 11 số (ví dụ: DS0912345678 hoặc DS 0912345678)
    const contentStr = content ? String(content) : '';
    const match = contentStr.match(/DS\s*(\d{9,11})/i);

    if (!match) {
      console.warn(`Không tìm thấy Số điện thoại hợp lệ trong nội dung: "${contentStr}"`);
      return res.status(200).json({
        success: true,
        message: 'Nội dung chuyển khoản không khớp mẫu cú pháp. Cần kiểm tra thủ công.'
      });
    }

    const phone = match[1];
    console.log(`Đã trích xuất số điện thoại học viên: ${phone}`);

    // 3. Tìm kiếm đơn hàng đang chờ thanh toán (pending) của SĐT này
    const { data: pendingOrders, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_phone', phone)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (orderError) {
      console.error('Lỗi truy vấn đơn hàng Supabase:', orderError);
      return res.status(500).json({ error: 'Database error fetching pending order' });
    }

    // Trường hợp 3.1: Không có đơn hàng pending trùng SĐT (Học viên quét sai hoặc chuyển khoản không báo trước)
    if (!pendingOrders || pendingOrders.length === 0) {
      console.warn(`Không tìm thấy đơn hàng chờ thanh toán cho SĐT: ${phone}. Tạo đơn hàng bù.`);
      
      // Tìm xem học viên đã điền form chưa
      const { data: customer } = await supabase
        .from('customers')
        .select('*')
        .eq('phone', phone)
        .single();
      
      const customerName = customer ? customer.name : 'Học viên vãng lai';

      // Tạo luôn một đơn hàng thành công trực tiếp (fallback) để tránh thất thoát lịch sử dòng tiền
      const { error: insertError } = await supabase
        .from('orders')
        .insert({
          id: `DS-${Date.now()}`,
          customer_phone: phone,
          customer_name: customerName,
          product_id: 'revit-mep-thuc-chien', // Mặc định gói thực chiến nếu không khớp
          amount: Number(transferAmount),
          status: 'completed',
          sepay_transaction_id: String(id),
          payment_date: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Lỗi khi tạo đơn hàng bù (fallback):', insertError);
        return res.status(500).json({ error: 'Database error creating fallback order' });
      }

      return res.status(200).json({
        success: true,
        message: 'Đã tự động tạo và hoàn thành đơn hàng bù thành công cho học viên.'
      });
    }

    // Trường hợp 3.2: Có đơn hàng pending -> Cập nhật thành công!
    const orderToComplete = pendingOrders[0];
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'completed',
        amount: Number(transferAmount), // Số tiền thực tế nhận được
        sepay_transaction_id: String(id),
        payment_date: new Date().toISOString(),
      })
      .eq('id', orderToComplete.id);

    if (updateError) {
      console.error('Lỗi cập nhật đơn hàng thành công:', updateError);
      return res.status(500).json({ error: 'Database error updating order' });
    }

    // 4. Khấu trừ tồn kho của gói sản phẩm (slots ưu đãi còn lại)
    if (orderToComplete.product_id) {
      const { data: product } = await supabase
        .from('products')
        .select('stock')
        .eq('id', orderToComplete.product_id)
        .single();

      if (product && product.stock > 0) {
        const { error: stockError } = await supabase
          .from('products')
          .update({ stock: product.stock - 1 })
          .eq('id', orderToComplete.product_id);
        
        if (stockError) {
          console.error('Lỗi cập nhật tồn kho:', stockError);
        }
      }
    }

    console.log(`[Thành công] Đã hoàn tất đơn hàng ${orderToComplete.id} cho SĐT: ${phone}`);
    return res.status(200).json({
      success: true,
      message: `Đơn hàng ${orderToComplete.id} đã được khớp tự động.`
    });

  } catch (err: any) {
    console.error('Lỗi hệ thống Webhook:', err);
    return res.status(500).json({ error: err.message });
  }
}
