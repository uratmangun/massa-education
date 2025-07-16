-- Add message_to_send column to courses table
ALTER TABLE courses ADD COLUMN message_to_send TEXT;

-- Add comment to explain the column purpose
COMMENT ON COLUMN courses.message_to_send IS 'Custom message that will be sent to the goals API endpoint';