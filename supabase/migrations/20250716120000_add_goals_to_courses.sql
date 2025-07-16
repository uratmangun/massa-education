-- Add goals field to courses table
ALTER TABLE public.courses 
ADD COLUMN goals TEXT;

-- Add comment to explain the goals field
COMMENT ON COLUMN public.courses.goals IS 'Optional web link for course goals - can be sent as string to get response with status (success/error) and message';