import { supabase } from "./supabase";

export type SectionData = {
  id?: string;
  section_name: string;
  page_id?: string;
  draft_content: any;
  published_content: any;
  is_visible: boolean;
};

export type LandingPageData = {
  id: string;
  slug: string;
  title: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  tracking_scripts?: string;
  favicon_url?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

// ==========================================
// LANDING PAGES CRUD
// ==========================================

export const getLandingPages = async (): Promise<LandingPageData[]> => {
  const { data, error } = await supabase
    .from("landing_pages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching landing pages:", error);
    return [];
  }
  return data || [];
};

export const getLandingPageBySlug = async (slug: string): Promise<LandingPageData | null> => {
  const { data, error } = await supabase
    .from("landing_pages")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(`Error fetching landing page with slug ${slug}:`, error);
    return null;
  }
  return data;
};

export const createLandingPage = async (pageData: Partial<LandingPageData>) => {
  const { data, error } = await supabase
    .from("landing_pages")
    .insert([pageData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateLandingPage = async (pageId: string, pageData: Partial<LandingPageData>) => {
  const { data, error } = await supabase
    .from("landing_pages")
    .update({ ...pageData, updated_at: new Date() })
    .eq("id", pageId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteLandingPage = async (pageId: string) => {
  // Prevent deleting the default page
  if (pageId === "11111111-1111-1111-1111-111111111111") {
    throw new Error("Không thể xóa trang mặc định.");
  }
  const { error } = await supabase
    .from("landing_pages")
    .delete()
    .eq("id", pageId);

  if (error) throw error;
};

export const duplicateLandingPage = async (sourcePageId: string, newSlug: string, newTitle: string) => {
  try {
    // 1. Lấy thông tin trang gốc
    const { data: sourcePage, error: fetchPageError } = await supabase
      .from("landing_pages")
      .select("*")
      .eq("id", sourcePageId)
      .single();
      
    if (fetchPageError) throw fetchPageError;

    // 2. Tạo trang mới
    const { data: newPage, error: createError } = await supabase
      .from("landing_pages")
      .insert([{
        slug: newSlug,
        title: newTitle,
        seo_title: sourcePage.seo_title,
        seo_description: sourcePage.seo_description,
        seo_keywords: sourcePage.seo_keywords,
        tracking_scripts: sourcePage.tracking_scripts,
        favicon_url: sourcePage.favicon_url,
      }])
      .select()
      .single();

    if (createError) throw createError;

    // 3. Lấy tất cả sections của trang gốc
    const { data: sourceSections, error: fetchSectionsError } = await supabase
      .from("cms_sections")
      .select("*")
      .eq("page_id", sourcePageId);

    if (fetchSectionsError) throw fetchSectionsError;

    // 4. Copy sections sang trang mới
    if (sourceSections && sourceSections.length > 0) {
      const newSections = sourceSections.map(section => ({
        page_id: newPage.id,
        section_name: section.section_name,
        draft_content: section.draft_content,
        published_content: section.published_content,
        is_visible: section.is_visible,
      }));

      const { error: insertSectionsError } = await supabase
        .from("cms_sections")
        .insert(newSections);

      if (insertSectionsError) throw insertSectionsError;
    }

    return newPage;
  } catch (error) {
    console.error("Error duplicating landing page:", error);
    throw error;
  }
};


// ==========================================
// CMS SECTIONS CRUD
// ==========================================

const DEFAULT_PAGE_ID = "11111111-1111-1111-1111-111111111111";

// Lấy thông tin 1 section cụ thể
export const getSectionData = async (sectionName: string, pageId: string = DEFAULT_PAGE_ID): Promise<SectionData | null> => {
  const { data, error } = await supabase
    .from("cms_sections")
    .select("*")
    .eq("page_id", pageId)
    .eq("section_name", sectionName)
    .maybeSingle();

  if (error) {
    console.error("Error fetching section data:", error);
    return null;
  }
  return data;
};

// Lưu nháp (chỉ cập nhật draft_content)
export const saveDraft = async (sectionName: string, draftContent: any, pageId: string = DEFAULT_PAGE_ID) => {
  const { error } = await supabase
    .from("cms_sections")
    .upsert(
      { 
        page_id: pageId, 
        section_name: sectionName, 
        draft_content: draftContent, 
        updated_at: new Date() 
      },
      { onConflict: 'page_id, section_name' }
    );

  if (error) throw error;
};

// Xuất bản (copy toàn bộ draft_content sang published_content)
export const publishSection = async (sectionName: string, content: any, isVisible: boolean, pageId: string = DEFAULT_PAGE_ID) => {
  const { error } = await supabase
    .from("cms_sections")
    .upsert(
      { 
        page_id: pageId,
        section_name: sectionName,
        draft_content: content,
        published_content: content, 
        is_visible: isVisible,
        updated_at: new Date() 
      },
      { onConflict: 'page_id, section_name' }
    );

  if (error) throw error;
};

// Toggle Ẩn/Hiện
export const toggleVisibility = async (sectionName: string, isVisible: boolean, pageId: string = DEFAULT_PAGE_ID) => {
  const { error } = await supabase
    .from("cms_sections")
    .update({ is_visible: isVisible })
    .eq("page_id", pageId)
    .eq("section_name", sectionName);

  if (error) throw error;
};


// ==========================================
// OTHER FUNCTIONS
// ==========================================

export const saveCompetitorQuery = async (query: string, studentNeed: string = "", competitorData: any = null, studentHesitation: string = "") => {
  try {
    const { error } = await supabase.from("competitor_queries").insert({ 
      query,
      student_need: studentNeed,
      student_hesitation: studentHesitation,
      competitor_data: competitorData
    });
    if (error) console.error("Supabase insert error:", error);
  } catch (err) {
    console.error("Error saving competitor query", err);
  }
};

export const getCompetitorQueries = async () => {
  const { data, error } = await supabase
    .from("competitor_queries")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching competitor queries", error);
    return [];
  }
  return data;
};

export const uploadImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop() || "png";
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('landing_images')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('landing_images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Unexpected upload error:", error);
    return null;
  }
};

export const collectLead = async (email: string, popupType: string = 'exit-intent') => {
  const { error } = await supabase
    .from("popup_leads")
    .insert({ email, popup_type: popupType });
    
  if (error) throw error;
  
  const settings = await getSectionData("settings");
  const webhookUrl = settings?.published_content?.webhook_url;
  
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, popupType, timestamp: new Date() })
      });
    } catch (err) {
      console.error("Error sending webhook:", err);
    }
  }
};

export const recordPageView = async (path: string) => {
  try {
    const { error } = await supabase
      .from("page_views")
      .insert({ page_path: path });
    if (error) console.error("Error recording page view:", error);
  } catch (err) {
    console.error("Unexpected error in recordPageView:", err);
  }
};

export const getPageStats = async () => {
  const { data, error } = await supabase
    .from("page_views")
    .select("created_at")
    .order("created_at", { ascending: false });
    
  if (error) throw error;
  
  return data;
};
