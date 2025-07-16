-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    sections JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create an index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_courses_user_id ON public.courses(user_id);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON public.courses(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own courses
CREATE POLICY "Users can view their own courses" ON public.courses
    FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own courses
CREATE POLICY "Users can insert their own courses" ON public.courses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own courses
CREATE POLICY "Users can update their own courses" ON public.courses
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own courses
CREATE POLICY "Users can delete their own courses" ON public.courses
    FOR DELETE USING (auth.uid() = user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER handle_courses_updated_at
    BEFORE UPDATE ON public.courses
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();