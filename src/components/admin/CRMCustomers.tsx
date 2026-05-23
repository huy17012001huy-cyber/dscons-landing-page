import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { 
  Users, Search, RefreshCw, GraduationCap, Briefcase, Eye, ChevronDown, ChevronUp, AlertCircle, Target, Mail
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role?: string;
  painpoint?: string;
  goal?: string;
  emails_sent?: string;
  created_at: string;
}

export function CRMCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sendingTestId, setSendingTestId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Không thể tải danh sách học viên";
      console.error("Error fetching customers:", err);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendTestSequence = async (customer: Customer) => {
    if (!customer.email) {
      toast.error("Học viên không có địa chỉ email để gửi!");
      return;
    }
    
    setSendingTestId(customer.id);
    toast.info(`Đang gửi test sequence gồm 3 email tới ${customer.email}...`);

    try {
      const response = await fetch("/api/send-sequence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: `${customer.email}+test`,
          name: customer.name
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Gửi email thất bại");
      }

      // Cập nhật emails_sent trong DB
      const currentList = customer.emails_sent
        ? customer.emails_sent.split(",").map(e => e.trim()).filter(Boolean)
        : [];
      
      const newEmails = ["Welcome Email", "Nurture Email 1", "Sales Email 1"];
      const updatedList = [...currentList];
      newEmails.forEach(e => {
        if (!updatedList.includes(e)) {
          updatedList.push(e);
        }
      });

      const emailsSentStr = updatedList.join(", ");
      
      const { error: updateError } = await supabase
        .from("customers")
        .update({ emails_sent: emailsSentStr })
        .eq("id", customer.id);

      if (updateError) {
        console.error("Lỗi cập nhật log email trong DB:", updateError);
      }

      toast.success("Đã kích hoạt gửi thành công 3 email test sequence!");
      fetchCustomers(); // Làm mới danh sách để hiển thị badge đã cập nhật
    } catch (err: any) {
      console.error("Lỗi khi gửi test sequence:", err);
      toast.error(err.message || "Gửi test sequence thất bại");
    } finally {
      setSendingTestId(null);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Filter and Search logic
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = 
      roleFilter === "all" || 
      (roleFilter === "student" && c.role?.toLowerCase().includes("sinh viên")) ||
      (roleFilter === "engineer" && (c.role?.toLowerCase().includes("kỹ sư") || c.role?.toLowerCase().includes("đi làm")));
      
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm space-y-4">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <Users className="w-5 h-5 text-primary" /> Quản lý Khách hàng & Học viên (Customers)
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Danh sách chi tiết thông tin học viên đăng ký tư vấn hoặc mua khóa học Revit MEP.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchCustomers} 
              disabled={isLoading}
              className="gap-2 h-9 rounded-xl border-border/50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Làm mới</span>
            </Button>
          </div>
        </div>

        {/* Search & Filtering bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Tìm theo tên học viên hoặc số điện thoại..."
              className="h-10 w-full pl-9 pr-4 rounded-xl border bg-background/50 text-sm focus:ring-2 focus:ring-primary/20 transition-all border-border/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={roleFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setRoleFilter("all")}
              className="rounded-xl h-10 px-3.5"
            >
              Tất cả
            </Button>
            <Button 
              variant={roleFilter === "student" ? "default" : "outline"}
              size="sm"
              onClick={() => setRoleFilter("student")}
              className="rounded-xl h-10 px-3.5 gap-1.5"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Sinh viên</span>
            </Button>
            <Button 
              variant={roleFilter === "engineer" ? "default" : "outline"}
              size="sm"
              onClick={() => setRoleFilter("engineer")}
              className="rounded-xl h-10 px-3.5 gap-1.5"
            >
              <Briefcase className="w-4 h-4" />
              <span>Đi làm</span>
            </Button>
          </div>
        </div>

        {/* Data Display */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Đang tải dữ liệu học viên...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground border border-dashed rounded-xl border-border/40">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-sm">Không tìm thấy thông tin học viên phù hợp.</p>
          </div>
        ) : (
          <div className="border border-border/40 rounded-xl overflow-hidden bg-background/20">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3.5 px-4">Họ và Tên</th>
                    <th className="py-3.5 px-4">Số điện thoại</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Đối tượng</th>
                    <th className="py-3.5 px-4">Email đã gửi</th>
                    <th className="py-3.5 px-4">Ngày đăng ký</th>
                    <th className="py-3.5 px-4 text-right">Chi tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30 text-sm">
                  {filteredCustomers.map((customer) => {
                    const isExpanded = expandedId === customer.id;
                    const isStudent = customer.role?.toLowerCase().includes("sinh viên");
                    const emailsList = customer.emails_sent
                      ? customer.emails_sent.split(",").map(e => e.trim()).filter(Boolean)
                      : [];
                    const emailsCount = emailsList.length;
                    
                    return (
                      <React.Fragment key={customer.id}>
                        <tr 
                          className={`hover:bg-muted/10 transition-colors cursor-pointer ${
                            isExpanded ? "bg-muted/20" : ""
                          }`}
                          onClick={() => handleToggleExpand(customer.id)}
                        >
                          <td className="py-4 px-4 font-semibold text-foreground">
                            {customer.name}
                          </td>
                          <td className="py-4 px-4 font-mono text-muted-foreground">
                            {customer.phone}
                          </td>
                          <td className="py-4 px-4 text-muted-foreground">
                            {customer.email || "—"}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs border ${
                              isStudent 
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                                : "bg-sky-500/10 text-sky-500 border-sky-500/20"
                            }`}>
                              {isStudent ? <GraduationCap className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
                              {customer.role || "Chưa chọn"}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                              emailsCount > 0 
                                ? "bg-blue-500/10 text-blue-500 border-blue-500/20" 
                                : "bg-muted text-muted-foreground border-border/40"
                            }`}>
                              <Mail className="w-3.5 h-3.5" />
                              {emailsCount} email
                            </span>
                          </td>
                          <td className="py-4 px-4 text-xs text-muted-foreground">
                            {new Date(customer.created_at).toLocaleString("vi-VN")}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </Button>
                          </td>
                        </tr>
                        
                        {/* Expandable row */}
                        <AnimatePresence>
                          {isExpanded && (
                            <tr>
                              <td colSpan={7} className="p-0 border-none bg-muted/5">
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="px-6 py-4 border-b border-border/30 space-y-4"
                                >
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 p-4 bg-background/50 rounded-xl border border-border/30">
                                      <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-wider">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>Khó khăn / Rào cản lớn nhất</span>
                                      </div>
                                      <p className="text-sm text-foreground leading-relaxed pl-6 italic">
                                        "{customer.painpoint || "Không chia sẻ khó khăn nào"}"
                                      </p>
                                    </div>

                                    <div className="space-y-2 p-4 bg-background/50 rounded-xl border border-border/30">
                                      <div className="flex items-center gap-2 text-xs font-bold text-sky-500 uppercase tracking-wider">
                                        <Target className="w-4 h-4" />
                                        <span>Mong muốn đạt được sau khóa học</span>
                                      </div>
                                      <p className="text-sm text-foreground leading-relaxed pl-6 italic">
                                        "{customer.goal || "Không chia sẻ mong muốn nào"}"
                                      </p>
                                    </div>
                                  </div>

                                  {/* Lịch sử gửi Email */}
                                  <div className="space-y-2 p-4 bg-background/50 rounded-xl border border-border/30">
                                    <div className="flex items-center justify-between gap-2 text-xs font-bold text-blue-500 uppercase tracking-wider">
                                      <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        <span>Lịch sử gửi Email tự động ({emailsCount})</span>
                                      </div>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={sendingTestId === customer.id}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSendTestSequence(customer);
                                        }}
                                        className="h-7 rounded-lg px-2.5 text-[11px] font-bold border-primary/30 hover:bg-primary/5 text-primary transition-all flex items-center gap-1"
                                      >
                                        {sendingTestId === customer.id ? (
                                          <>
                                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                            Đang gửi...
                                          </>
                                        ) : (
                                          <>
                                            <Mail className="w-3 h-3" />
                                            Gửi test sequence (3 email)
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                    {emailsCount === 0 ? (
                                      <p className="text-xs text-muted-foreground pl-6 italic">
                                        Chưa gửi email nào cho học viên này.
                                      </p>
                                    ) : (
                                      <div className="pl-6 space-y-2 pt-1">
                                        {emailsList.map((emailName, index) => (
                                          <div key={index} className="flex items-center gap-2 text-sm text-foreground">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                                            <span className="font-medium">{emailName}</span>
                                            <span className="text-[10px] text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20 font-semibold uppercase">Đã gửi</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              </td>
                            </tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="bg-muted/20 px-4 py-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
              <span>Đang hiển thị <strong className="text-foreground">{filteredCustomers.length}</strong> trên tổng số <strong className="text-foreground">{customers.length}</strong> học viên</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
