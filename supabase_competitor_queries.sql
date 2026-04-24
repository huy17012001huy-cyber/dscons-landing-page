-- SQL Script to create the competitor_queries table
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.competitor_queries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    query TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bật Row Level Security (RLS)
ALTER TABLE public.competitor_queries ENABLE ROW LEVEL SECURITY;

-- Policy cho phép mọi người (ẩn danh) thêm dữ liệu vào (INSERT)
CREATE POLICY "Allow anonymous insert on competitor_queries"
ON public.competitor_queries
FOR INSERT
TO public, anon
WITH CHECK (true);

-- Policy cho phép Admin (đã đăng nhập) đọc dữ liệu (SELECT)
CREATE POLICY "Allow authenticated full access on competitor_queries"
ON public.competitor_queries
FOR SELECT
TO authenticated
USING (true);

-- Cho phép Admin xoá dữ liệu
CREATE POLICY "Allow authenticated delete on competitor_queries"
ON public.competitor_queries
FOR DELETE
TO authenticated
USING (true);
