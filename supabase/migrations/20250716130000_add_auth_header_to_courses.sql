-- Add authorization_header field to courses table
ALTER TABLE public.courses 
ADD COLUMN authorization_header TEXT DEFAULT 'VITE_SUPABASE_ANON_KEY';

-- Add comment to explain the authorization_header field
COMMENT ON COLUMN public.courses.authorization_header IS 'Optional authorization header for course goals API calls - defaults to VITE_SUPABASE_ANON_KEY';