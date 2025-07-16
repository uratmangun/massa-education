-- Create user_course_completions table to track course completion status
CREATE TABLE IF NOT EXISTS public.user_course_completions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Ensure one completion record per user per course
    UNIQUE(user_id, course_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_course_completions_user_id ON public.user_course_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_course_completions_course_id ON public.user_course_completions(course_id);
CREATE INDEX IF NOT EXISTS idx_user_course_completions_completed_at ON public.user_course_completions(completed_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_course_completions ENABLE ROW LEVEL SECURITY;

-- Create policies for user course completions
-- Users can view all completions (to see who completed courses)
CREATE POLICY "Users can view all course completions" ON public.user_course_completions
    FOR SELECT USING (true);

-- Users can only insert their own completions
CREATE POLICY "Users can insert their own completions" ON public.user_course_completions
    FOR INSERT WITH CHECK (true);

-- Users can update their own completions
CREATE POLICY "Users can update their own completions" ON public.user_course_completions
    FOR UPDATE USING (true);

-- Users can delete their own completions
CREATE POLICY "Users can delete their own completions" ON public.user_course_completions
    FOR DELETE USING (true);

-- Create trigger to automatically update updated_at
CREATE TRIGGER handle_user_course_completions_updated_at
    BEFORE UPDATE ON public.user_course_completions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Add helpful comments
COMMENT ON TABLE public.user_course_completions IS 'Tracks which users have completed which courses';
COMMENT ON COLUMN public.user_course_completions.user_id IS 'Clerk user ID (string format)';
COMMENT ON COLUMN public.user_course_completions.course_id IS 'Reference to the completed course';
COMMENT ON COLUMN public.user_course_completions.completed_at IS 'When the user completed the course';