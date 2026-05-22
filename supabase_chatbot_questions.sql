-- SQL Script to create the chatbot_questions table for storing student inquiries from the chatbot
CREATE TABLE IF NOT EXISTS public.chatbot_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    query_text TEXT NOT NULL,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.chatbot_questions ENABLE ROW LEVEL SECURITY;

-- Allow anyone (anonymous public users) to INSERT questions
CREATE POLICY "Allow anonymous insert on chatbot_questions"
ON public.chatbot_questions
FOR INSERT
TO public
WITH CHECK (true);

-- Allow only authenticated administrators to SELECT (read) the questions
CREATE POLICY "Allow authenticated select on chatbot_questions"
ON public.chatbot_questions
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated administrators to DELETE questions (for clean up)
CREATE POLICY "Allow authenticated delete on chatbot_questions"
ON public.chatbot_questions
FOR DELETE
TO authenticated
USING (true);
