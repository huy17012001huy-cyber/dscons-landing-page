-- 1. Create custom profiles table for App Auth
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users on delete cascade,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'member'::text CHECK (role IN ('super_admin', 'member')),
  created_at timestamp with time zone NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);

-- Turn on RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Create CMS Sections table
CREATE TABLE public.cms_sections (
  id text NOT NULL,
  section_name text NOT NULL,
  draft_content jsonb NOT NULL DEFAULT '{}'::jsonb,
  published_content jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_visible boolean NOT NULL DEFAULT true,
  updated_at timestamp with time zone NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT cms_sections_pkey PRIMARY KEY (id)
);

-- Turn on RLS for cms_sections
ALTER TABLE public.cms_sections ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies for cms_sections
-- Anyone can READ published_content (so standard users can load the website)
CREATE POLICY "Public can view published content" ON public.cms_sections
FOR SELECT USING (true);

-- Only authenticated users (Admins) can UPDATE
CREATE POLICY "Admins can update sections" ON public.cms_sections
FOR UPDATE USING (auth.role() = 'authenticated');

-- Only authenticated users can INSERT
CREATE POLICY "Admins can insert sections" ON public.cms_sections
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 4. Initial Seed Data (Optional but recommended)
INSERT INTO public.cms_sections (id, section_name, draft_content, published_content, is_visible)
VALUES 
  ('header', 'Header', '{"logo":"DSCons","navLinks":[{"name":"Chương trình","href":"#curriculum"}],"cta":"Đăng ký ngay"}', '{"logo":"DSCons","navLinks":[{"name":"Chương trình","href":"#curriculum"}],"cta":"Đăng ký ngay"}', true),
  ('hero', 'Hero Section', '{"badge":"Thực Chiến Cấp Tốc","title":"Thành thạo Revit MEP","description":"Nội dung demo...","primaryCta":"Đăng ký ngay","secondaryCta":"Xem lộ trình học"}', '{"badge":"Thực Chiến Cấp Tốc","title":"Thành thạo Revit MEP","description":"Nội dung demo...","primaryCta":"Đăng ký ngay","secondaryCta":"Xem lộ trình học"}', true)
ON CONFLICT (id) DO NOTHING;
