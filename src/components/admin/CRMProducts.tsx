import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, Edit2, Save, X, RefreshCw, Layers, DollarSign, Package, Link2, Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CRMProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form states for editing
  const [editStock, setEditStock] = useState<number>(0);
  const [editDownloadUrl, setEditDownloadUrl] = useState<string>("");

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("price", { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      toast.error(err.message || "Không thể tải danh sách khóa học");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleStartEdit = (product: any) => {
    setEditingId(product.id);
    setEditStock(product.stock);
    setEditDownloadUrl(product.download_url || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({
          stock: editStock,
          download_url: editDownloadUrl
        })
        .eq("id", id);

      if (error) throw error;

      setProducts(products.map(p => 
        p.id === id ? { ...p, stock: editStock, download_url: editDownloadUrl } : p
      ));
      
      setEditingId(null);
      toast.success("Cập nhật thông tin khóa học thành công!");
    } catch (err: any) {
      console.error("Error updating product:", err);
      toast.error(err.message || "Không thể lưu thay đổi");
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <Layers className="w-5 h-5 text-primary" /> Quản lý Gói Khóa học (Products)
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Xem và điều chỉnh số lượng slot ưu đãi còn lại (Kho) và cấu hình link tải quà tặng tự động.
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchProducts} 
            disabled={isLoading}
            className="gap-2 h-9 rounded-xl border-border/50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Đang tải danh sách khóa học...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Không có sản phẩm/khóa học nào trong hệ thống.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {products.map((product) => {
              const isEditing = editingId === product.id;
              
              return (
                <motion.div 
                  key={product.id}
                  layout
                  className={`p-5 rounded-xl border transition-all duration-300 ${
                    isEditing 
                      ? "bg-muted/30 border-primary/40 shadow-md shadow-primary/5" 
                      : "bg-background/40 hover:bg-muted/20 border-border/40 hover:border-border/80"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary/10 text-primary uppercase border border-primary/10">
                          {product.id}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Seed: {product.created_at ? new Date(product.created_at).toLocaleDateString("vi-VN") : "Hệ thống"}
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-foreground leading-snug">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-6 pt-1 text-sm">
                        <span className="text-primary font-bold flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4" /> {formatPrice(product.price)}
                        </span>
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <Package className="w-4 h-4" /> Còn lại: <span className="font-bold text-foreground">{product.stock} slots</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      {!isEditing ? (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleStartEdit(product)}
                          className="h-9 px-3 gap-1.5 rounded-lg border border-border/40 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Chỉnh sửa</span>
                        </Button>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <Button 
                            size="sm" 
                            onClick={() => handleSaveEdit(product.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 px-3 gap-1.5 rounded-lg"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Lưu</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleCancelEdit}
                            className="h-9 px-3 gap-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Hủy</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isEditing && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-4 pt-4 border-t border-border/50 grid grid-cols-1 md:grid-cols-3 gap-4"
                      >
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                            <Package className="w-3.5 h-3.5" /> Số lượng slots tồn kho
                          </label>
                          <input 
                            type="number" 
                            className="h-9 w-full rounded-lg border bg-background px-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-bold" 
                            value={editStock} 
                            onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="md:col-span-2 space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                            <Link2 className="w-3.5 h-3.5" /> Link tải tài liệu / quà tặng (Download URL)
                          </label>
                          <input 
                            type="text" 
                            className="h-9 w-full rounded-lg border bg-background px-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-mono" 
                            placeholder="https://drive.google.com/..."
                            value={editDownloadUrl} 
                            onChange={(e) => setEditDownloadUrl(e.target.value)}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!isEditing && product.download_url && (
                    <div className="mt-3 text-xs bg-muted/20 px-3 py-1.5 rounded-lg border border-border/30 flex items-center gap-1.5 text-muted-foreground truncate font-mono">
                      <Link2 className="w-3 h-3 text-primary flex-shrink-0" />
                      <span className="truncate">{product.download_url}</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
