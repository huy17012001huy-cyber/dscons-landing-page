import React, { useState, useRef } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";
import { uploadImage } from "@/lib/api";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
  placeholder?: string;
}

export function ImageUpload({ value, onChange, className = "", placeholder }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const url = await uploadImage(file);
    if (url) {
      onChange(url);
    } else {
      alert("Lỗi khi tải ảnh lên. Vui lòng kiểm tra lại quyền truy cập Supabase Storage (bạn đã chạy sql tạo bucket chưa?).");
    }
    setIsUploading(false);
    
    // Xoá value để có thể upload lại file cùng tên nếu cần
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = () => {
    onChange("");
  };

  return (
    <div className={`relative w-full ${className}`}>
      {value ? (
        <div className="relative group rounded-md overflow-hidden border border-border bg-muted flex items-center justify-center p-2">
          <img src={value} alt="Uploaded" className="max-h-32 object-contain" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <button
              onClick={removeImage}
              className="bg-destructive text-destructive-foreground p-2 rounded-full hover:bg-destructive/90"
              title="Xóa ảnh"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-center"
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
          ) : (
            <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
          )}
          <p className="text-sm font-medium">
            {isUploading ? "Đang tải lên..." : (placeholder || "Bấm để tải ảnh lên")}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Hỗ trợ PNG, JPG, WebP</p>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
