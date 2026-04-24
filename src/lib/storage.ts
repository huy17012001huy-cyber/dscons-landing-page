import { supabase } from './supabase';

export const uploadImage = async (file: File, bucketName: string = 'public_images'): Promise<string | null> => {
  try {
    // Check if it's a valid image
    if (!file.type.startsWith('image/')) {
      throw new Error('Chỉ cho phép tải lên định dạng hình ảnh.');
    }

    // Generate a unique filename using timestamp and a random string to avoid collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Lỗi upload ảnh:', error.message);
      throw error;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Lỗi trong quá trình xử lý ảnh:', error);
    throw error;
  }
};
