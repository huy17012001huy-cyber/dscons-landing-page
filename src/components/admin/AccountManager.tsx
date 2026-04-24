import React, { useState } from "react";
import { Save, Plus, Trash2, Key, User, Mail, ShieldAlert, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function AccountManager({ currentUser }: { currentUser: any }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminName, setAdminName] = useState(currentUser?.user_metadata?.full_name || "Admin");
  
  // Mocked list for now, as Supabase Auth doesn't expose listUsers to anon clients
  const [admins, setAdmins] = useState([
    { id: 1, email: currentUser?.email || "admin@dscons.vn", role: "Super Admin", name: currentUser?.user_metadata?.full_name || "Admin" }
  ]);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showMockPassword, setShowMockPassword] = useState(false);

  const handleUpdateInfo = async () => {
    if (!currentUser) return;
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: adminName }
      });
      if (error) throw error;
      
      // Update the local mock list to reflect the name change immediately
      setAdmins([{ id: 1, email: currentUser?.email || "admin@dscons.vn", role: "Super Admin", name: adminName }]);
      
      toast.success("Đã cập nhật thông tin thành công!");
    } catch (error: any) {
      toast.error(error.message || "Lỗi cập nhật thông tin");
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      toast.error("Mật khẩu không khớp hoặc bị trống!");
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Đã thay đổi mật khẩu thành công!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Lỗi đổi mật khẩu");
    }
  };

  const handleRemoveAdmin = (id: number) => {
    toast.info("Yêu cầu cấu hình Backend (Supabase Admin API) để xóa tài khoản.");
    setAdmins(admins.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Edit Profile */}
      <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <User className="w-5 h-5 text-primary" /> Thông tin Cá nhân
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Email đăng nhập</label>
            <input 
              type="text" 
              className="flex h-10 w-full rounded-md border bg-muted px-3 py-2 text-sm cursor-not-allowed" 
              value={currentUser?.email || ""} 
              disabled
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Tên hiển thị</label>
            <input 
              type="text" 
              className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" 
              value={adminName} 
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="Nhập tên..."
            />
          </div>
        </div>
        <Button onClick={handleUpdateInfo} className="bg-primary text-primary-foreground">
          Cập nhật thông tin
        </Button>
      </div>

      {/* Change Password */}
      <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Key className="w-5 h-5 text-primary" /> Đổi mật khẩu
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Mật khẩu mới</label>
            <div className="relative">
              <input 
                type={showNewPassword ? "text" : "password"} 
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm pr-10" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Xác nhận mật khẩu mới</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm pr-10" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
        <Button onClick={handleUpdatePassword} variant="outline" className="border-primary text-primary hover:bg-primary/10">
          Đổi mật khẩu
        </Button>
      </div>

      {/* Admin List */}
      <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-primary" /> Tài khoản Quản trị
          </h3>
        </div>

        <div className="border rounded-md divide-y overflow-hidden">
          {admins.map((admin) => (
            <div key={admin.id} className="flex items-center justify-between p-3 bg-background hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs uppercase">
                  {admin.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{admin.name}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {admin.email}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Key className="w-3 h-3" /> 
                        {showMockPassword ? "(Đã mã hóa bảo mật)" : "••••••••"}
                      </p>
                      <button 
                        type="button"
                        onClick={() => setShowMockPassword(!showMockPassword)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        title="Xem mật khẩu"
                      >
                        {showMockPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                  onClick={() => handleRemoveAdmin(admin.id)}
                  disabled={admin.email === currentUser?.email}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
