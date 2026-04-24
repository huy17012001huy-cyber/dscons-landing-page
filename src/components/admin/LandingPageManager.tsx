import { useState, useEffect } from "react";
import { getLandingPages, createLandingPage, duplicateLandingPage, deleteLandingPage, updateLandingPage, LandingPageData } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Copy, Plus, Trash2, Edit2, Check, X, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Props {
  activePageId: string;
  onPageSelect: (pageId: string) => void;
}

export function LandingPageManager({ activePageId, onPageSelect }: Props) {
  const [pages, setPages] = useState<LandingPageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Create state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const [newTitle, setNewTitle] = useState("");

  // Duplicate state
  const [isDuplicateOpen, setIsDuplicateOpen] = useState(false);
  const [sourcePageId, setSourcePageId] = useState("");
  const [dupSlug, setDupSlug] = useState("");
  const [dupTitle, setDupTitle] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSlug, setEditSlug] = useState("");

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setIsLoading(true);
    const data = await getLandingPages();
    setPages(data);
    setIsLoading(false);
  };

  const handleCreate = async () => {
    if (!newSlug || !newTitle) {
      toast.error("Vui lòng nhập đầy đủ slug và tiêu đề.");
      return;
    }
    try {
      await createLandingPage({ slug: newSlug, title: newTitle });
      toast.success("Tạo trang thành công!");
      setIsCreateOpen(false);
      setNewSlug("");
      setNewTitle("");
      fetchPages();
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra khi tạo trang.");
    }
  };

  const handleDuplicate = async () => {
    if (!dupSlug || !dupTitle) {
      toast.error("Vui lòng nhập đầy đủ slug và tiêu đề.");
      return;
    }
    try {
      toast.loading("Đang nhân bản...", { id: "dup" });
      await duplicateLandingPage(sourcePageId, dupSlug, dupTitle);
      toast.success("Nhân bản trang thành công!", { id: "dup" });
      setIsDuplicateOpen(false);
      setDupSlug("");
      setDupTitle("");
      fetchPages();
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra khi nhân bản trang.", { id: "dup" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa trang này? Hành động không thể hoàn tác.")) return;
    try {
      await deleteLandingPage(id);
      toast.success("Xóa trang thành công!");
      if (activePageId === id) {
        onPageSelect("11111111-1111-1111-1111-111111111111"); // fallback to default
      }
      fetchPages();
    } catch (error: any) {
      toast.error(error.message || "Không thể xóa trang này.");
    }
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await updateLandingPage(id, { title: editTitle, slug: editSlug });
      toast.success("Cập nhật thành công!");
      setEditingId(null);
      fetchPages();
    } catch (error: any) {
      toast.error(error.message || "Lỗi cập nhật.");
    }
  };

  if (isLoading) return <div>Đang tải danh sách trang...</div>;

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Quản lý Landing Pages</CardTitle>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="w-4 h-4 mr-2"/> Tạo trang mới</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo Landing Page mới tinh</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Tiêu đề (Nội bộ)</label>
                <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Chiến dịch Tết 2025..." />
              </div>
              <div>
                <label className="text-sm font-medium">Slug (Đường dẫn)</label>
                <Input value={newSlug} onChange={e => setNewSlug(e.target.value)} placeholder="chien-dich-tet" />
                <p className="text-xs text-muted-foreground mt-1">VD: dscons.vn/chien-dich-tet</p>
              </div>
              <Button onClick={handleCreate} className="w-full">Tạo trang</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 font-medium">Tiêu đề</th>
                <th className="p-3 font-medium">Đường dẫn (Slug)</th>
                <th className="p-3 font-medium">Trạng thái</th>
                <th className="p-3 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    Chưa có Landing Page nào. (Có thể chưa chạy SQL Migration)
                  </td>
                </tr>
              ) : (
                pages.map(page => (
                  <tr key={page.id} className={`border-t ${activePageId === page.id ? 'bg-primary/5' : ''}`}>
                    <td className="p-3">
                      {editingId === page.id ? (
                        <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="h-8" />
                      ) : (
                        <div className="font-medium flex items-center gap-2">
                          {page.title}
                          {activePageId === page.id && <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Đang chọn sửa</span>}
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      {editingId === page.id ? (
                        <Input value={editSlug} onChange={e => setEditSlug(e.target.value)} className="h-8" disabled={page.id === '11111111-1111-1111-1111-111111111111'} />
                      ) : (
                        <span className="text-muted-foreground">/{page.slug === 'default' ? '' : page.slug}</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${page.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700'}`}>
                        {page.is_active ? "Hoạt động" : "Tạm dừng"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {editingId === page.id ? (
                        <div className="flex justify-end gap-2">
                          <Button size="icon" variant="ghost" onClick={() => handleSaveEdit(page.id)}><Check className="w-4 h-4 text-green-500" /></Button>
                          <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}><X className="w-4 h-4 text-red-500" /></Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant={activePageId === page.id ? "default" : "outline"} 
                            size="sm"
                            onClick={() => onPageSelect(page.id)}
                          >
                            {activePageId === page.id ? "Đang chọn" : "Chọn sửa"}
                          </Button>
                          
                          <Button size="icon" variant="ghost" onClick={() => window.open(page.slug === 'default' ? '/' : `/${page.slug}`, '_blank')} title="Xem trang">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          
                          <Button size="icon" variant="ghost" onClick={() => {
                            setEditTitle(page.title);
                            setEditSlug(page.slug);
                            setEditingId(page.id);
                          }} title="Đổi tên/slug">
                            <Edit2 className="w-4 h-4" />
                          </Button>

                          <Dialog open={isDuplicateOpen && sourcePageId === page.id} onOpenChange={(open) => {
                            setIsDuplicateOpen(open);
                            if(open) setSourcePageId(page.id);
                          }}>
                            <DialogTrigger asChild>
                              <Button size="icon" variant="ghost" title="Nhân bản trang này">
                                <Copy className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Nhân bản trang: {page.title}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div>
                                  <label className="text-sm font-medium">Tiêu đề trang mới</label>
                                  <Input value={dupTitle} onChange={e => setDupTitle(e.target.value)} placeholder={`${page.title} (Copy)`} />
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Slug trang mới</label>
                                  <Input value={dupSlug} onChange={e => setDupSlug(e.target.value)} placeholder={`${page.slug}-copy`} />
                                </div>
                                <Button onClick={handleDuplicate} className="w-full">Nhân bản</Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {page.id !== "11111111-1111-1111-1111-111111111111" && (
                            <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(page.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
