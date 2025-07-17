-- Create policy to allow anyone to upload files to course-content bucket (for development)
CREATE POLICY "Allow anyone to upload course images" ON storage.objects
FOR INSERT 
TO public
WITH CHECK (bucket_id = 'course-content');

-- Create policy to allow public read access to course-content bucket
CREATE POLICY "Allow public read access to course images" ON storage.objects
FOR SELECT 
TO public
USING (bucket_id = 'course-content');

-- Create policy to allow anyone to update files in course-content bucket (for development)
CREATE POLICY "Allow anyone to update course images" ON storage.objects
FOR UPDATE 
TO public
USING (bucket_id = 'course-content');

-- Create policy to allow anyone to delete files in course-content bucket (for development)
CREATE POLICY "Allow anyone to delete course images" ON storage.objects
FOR DELETE 
TO public
USING (bucket_id = 'course-content');

-- Ensure the bucket exists and is properly configured
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-content',
  'course-content',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;
