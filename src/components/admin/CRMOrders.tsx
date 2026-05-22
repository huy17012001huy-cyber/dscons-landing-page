import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, Search, RefreshCw, CheckCircle, Clock, Plus, X, 
  ArrowRightLeft, FileSpreadsheet, Calendar, User, Phone, Check, 
  HelpCircle, Sparkles, DollarSign, Package
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CRMOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  // Manual Add Order Form States
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newProductId, setNewProductId] = useState("");
  const [newAmount, setNewAmount] = useState<number>(0);
  const [newStatus, setNewStatus] = useState("completed");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [ordersRes, productsRes] = await Promise.all([
        supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("products")
          .select("*")
      ]);

      if (ordersRes.error) throw ordersRes.error;
      if (productsRes.error) throw productsRes.error;

      setOrders(ordersRes.data || []);
      setProducts(productsRes.data || []);
      
      if (productsRes.data && productsRes.data.length > 0) {
        setNewProductId(productsRes.data[0].id);
        setNewAmount(productsRes.data[0].price);
      }
    } catch (err: any) {
      console.error("Error fetching CRM orders:", err);
      toast.error(err.message || "Không thể tải dữ liệu đơn hàng");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update amount automatically when product selection changes
  const handleProductChange = (prodId: string) => {
    setNewProductId(prodId);
    const selectedProd = products.find(p => p.id === prodId);
    if (selectedProd) {
      setNewAmount(selectedProd.price);
    }
  };

  // 1. manual status toggle function (pending -> completed)
  const handleManualComplete = async (order: any) => {
    try {
      // Begin manual completion sequence
      // A. Decrement product stock if order is currently pending
      if (order.status !== "completed") {
        const selectedProd = products.find(p => p.id === order.product_id);
        if (selectedProd) {
          const currentStock = selectedProd.stock;
          const newStock = Math.max(0, currentStock - 1);
          
          const { error: stockErr } = await supabase
            .from("products")
            .update({ stock: newStock })
            .eq("id", order.product_id);

          if (stockErr) throw stockErr;
        }
      }

      // B. Set order to completed
      const { error: orderErr } = await supabase
        .from("orders")
        .update({
          status: "completed",
          payment_date: new Date().toISOString(),
          sepay_transaction_id: `MANUAL-${Date.now()}`
        })
        .eq("id", order.id);

      if (orderErr) throw orderErr;

      toast.success(`Đơn hàng ${order.id} đã được xác nhận hoàn tất thành công!`);
      fetchData(); // reload
    } catch (err: any) {
      console.error("Manual confirmation error:", err);
      toast.error(err.message || "Lỗi xác nhận thanh toán");
    }
  };

  // 2. manual add order submission
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName || !newCustomerPhone || !newProductId) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    try {
      // A. Upsert Customer details (checks phone uniqueness)
      const { data: customerData, error: custErr } = await supabase
        .from("customers")
        .upsert({
          name: newCustomerName,
          phone: newCustomerPhone,
          role: "Kỹ sư đã đi làm" // default for manual panel entry
        }, { onConflict: "phone" })
        .select()
        .single();

      if (custErr) throw custErr;

      // B. Insert order
      const newOrderId = `DS-${Date.now().toString().slice(-6)}`;
      const { error: orderErr } = await supabase
        .from("orders")
        .insert([{
          id: newOrderId,
          customer_phone: newCustomerPhone,
          customer_name: newCustomerName,
          product_id: newProductId,
          amount: newAmount,
          status: newStatus,
          payment_date: newStatus === "completed" ? new Date().toISOString() : null,
          sepay_transaction_id: newStatus === "completed" ? `MANUAL-${Date.now()}` : null
        }]);

      if (orderErr) throw orderErr;

      // C. Decrement product stock if order status is completed
      if (newStatus === "completed") {
        const selectedProd = products.find(p => p.id === newProductId);
        if (selectedProd) {
          const newStock = Math.max(0, selectedProd.stock - 1);
          await supabase
            .from("products")
            .update({ stock: newStock })
            .eq("id", newProductId);
        }
      }

      toast.success(`Đã thêm đơn hàng mới thành công: ${newOrderId}`);
      setIsAddFormOpen(false);
      
      // Reset state
      setNewCustomerName("");
      setNewCustomerPhone("");
      if (products.length > 0) {
        setNewProductId(products[0].id);
        setNewAmount(products[0].price);
      }
      
      fetchData(); // reload
    } catch (err: any) {
      console.error("Create manual order error:", err);
      toast.error(err.message || "Lỗi tạo đơn hàng mới");
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(amount);
  };

  // Filters logic
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer_phone.includes(searchTerm) ||
      (o.sepay_transaction_id && o.sepay_transaction_id.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesStatus = 
      statusFilter === "all" || 
      o.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Upper command row */}
      <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <CreditCard className="w-5 h-5 text-primary" /> Quản lý Đơn hàng & Thanh toán (Orders)
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Theo dõi lịch sử giao dịch quét mã QR. Xác nhận thanh toán tự động qua Webhook Sepay và cho phép bù đơn thủ công.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setIsAddFormOpen(!isAddFormOpen)}
              className="gap-2 h-9 rounded-xl bg-primary text-primary-foreground font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Đơn Hàng</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchData} 
              disabled={isLoading}
              className="gap-2 h-9 rounded-xl border-border/50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Làm mới</span>
            </Button>
          </div>
        </div>

        {/* Manual Add Order Section */}
        <AnimatePresence>
          {isAddFormOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="border border-primary/20 bg-muted/20 p-5 rounded-xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Tạo Đơn Hàng Mới (Thủ Công)</span>
                </h4>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsAddFormOpen(false)}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleCreateOrder} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> Họ và tên học viên *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="VD: Nguyễn Văn A"
                    className="h-9 w-full rounded-lg border bg-background px-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> Số điện thoại *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="VD: 0912345678"
                    className="h-9 w-full rounded-lg border bg-background px-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" /> Chọn Gói Khóa Học *
                  </label>
                  <select 
                    className="h-9 w-full rounded-lg border bg-background px-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                    value={newProductId}
                    onChange={(e) => handleProductChange(e.target.value)}
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" /> Số tiền thanh toán (VNĐ)
                  </label>
                  <input 
                    type="number" 
                    required
                    className="h-9 w-full rounded-lg border bg-background px-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                    value={newAmount}
                    onChange={(e) => setNewAmount(parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Trạng thái đơn hàng
                  </label>
                  <select 
                    className="h-9 w-full rounded-lg border bg-background px-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="pending">Chờ Thanh Toán (Pending)</option>
                    <option value="completed">Đã Hoàn Tất (Completed)</option>
                  </select>
                </div>

                <div className="flex items-end pt-1">
                  <Button 
                    type="submit" 
                    className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold h-9 w-full rounded-lg"
                  >
                    Lưu &amp; Tạo Đơn
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Tìm theo Mã đơn, tên học viên, SĐT, hoặc Mã giao dịch Sepay..."
              className="h-10 w-full pl-9 pr-4 rounded-xl border bg-background/50 text-sm focus:ring-2 focus:ring-primary/20 transition-all border-border/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
              className="rounded-xl h-10 px-3.5"
            >
              Tất cả
            </Button>
            <Button 
              variant={statusFilter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("completed")}
              className="rounded-xl h-10 px-3.5 gap-1.5 text-emerald-500 hover:text-emerald-500/90"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Đã thanh toán</span>
            </Button>
            <Button 
              variant={statusFilter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("pending")}
              className="rounded-xl h-10 px-3.5 gap-1.5 text-amber-500 hover:text-amber-500/90"
            >
              <Clock className="w-4 h-4" />
              <span>Chờ chuyển khoản</span>
            </Button>
          </div>
        </div>

        {/* Main data list */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Đang tải dữ liệu đơn hàng...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground border border-dashed rounded-xl border-border/40">
            <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-sm">Không tìm thấy đơn giao dịch nào.</p>
          </div>
        ) : (
          <div className="border border-border/40 rounded-xl overflow-hidden bg-background/20">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3.5 px-4">Mã Đơn</th>
                    <th className="py-3.5 px-4">Học Viên</th>
                    <th className="py-3.5 px-4">Sản Phẩm</th>
                    <th className="py-3.5 px-4">Số Tiền</th>
                    <th className="py-3.5 px-4">Trạng Thái</th>
                    <th className="py-3.5 px-4">Giao Dịch Sepay / Ngày TT</th>
                    <th className="py-3.5 px-4 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30 text-sm">
                  {filteredOrders.map((order) => {
                    const isCompleted = order.status === "completed";
                    const selectedProd = products.find(p => p.id === order.product_id);
                    
                    return (
                      <tr key={order.id} className="hover:bg-muted/10 transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-foreground">
                          {order.id}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-foreground">{order.customer_name}</div>
                          <div className="text-xs text-muted-foreground font-mono">{order.customer_phone}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-xs font-medium text-muted-foreground line-clamp-1" title={selectedProd?.name || order.product_id}>
                            {selectedProd?.name || order.product_id}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-bold text-primary">
                          {formatPrice(order.amount)}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            isCompleted 
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                              : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          }`}>
                            {isCompleted ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>Thành Công</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 animate-pulse" />
                                <span>Chờ Chuyển</span>
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {isCompleted ? (
                            <div className="space-y-0.5">
                              <div className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                                <ArrowRightLeft className="w-3 h-3 text-emerald-500" />
                                <span>{order.sepay_transaction_id || "Bù thủ công"}</span>
                              </div>
                              <div className="text-[10px] text-muted-foreground/60">
                                {order.payment_date ? new Date(order.payment_date).toLocaleString("vi-VN") : ""}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground/50 italic">Chưa giao dịch</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          {!isCompleted ? (
                            <Button 
                              size="sm"
                              onClick={() => handleManualComplete(order)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 px-2.5 rounded-lg gap-1 font-semibold"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Bù đơn</span>
                            </Button>
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center ml-auto border border-emerald-500/20" title="Hoàn tất">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="bg-muted/20 px-4 py-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
              <span>Đang hiển thị <strong className="text-foreground">{filteredOrders.length}</strong> trên tổng số <strong className="text-foreground">{orders.length}</strong> đơn hàng</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
