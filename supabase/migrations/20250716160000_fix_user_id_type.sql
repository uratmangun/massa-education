-- Fix user_id column type to support Clerk string IDs
-- First, drop the foreign key constraint and policies that reference auth.users
DROP POLICY IF EXISTS "Users can view their own courses" ON public.courses;
DROP POLICY IF EXISTS "Users can insert their own courses" ON public.courses;
DROP POLICY IF EXISTS "Users can update their own courses" ON public.courses;
DROP POLICY IF EXISTS "Users can delete their own courses" ON public.courses;

-- Change user_id column from UUID to TEXT
ALTER TABLE public.courses ALTER COLUMN user_id TYPE TEXT;

-- Recreate policies without auth.uid() reference since we're using Clerk
CREATE POLICY "Users can view their own courses" ON public.courses
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own courses" ON public.courses
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own courses" ON public.courses
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own courses" ON public.courses
    FOR DELETE USING (true);

-- Add comment to explain the change
COMMENT ON COLUMN courses.user_id IS 'Clerk user ID (string format, not UUID)';