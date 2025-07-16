-- Add instructions column to courses table
ALTER TABLE courses ADD COLUMN instructions TEXT;

-- Add comment to explain the column purpose
COMMENT ON COLUMN courses.instructions IS 'Instructions for students on what message to send to complete the course';