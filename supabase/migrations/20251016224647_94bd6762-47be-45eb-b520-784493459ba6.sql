-- Create storage bucket for assignment files
INSERT INTO storage.buckets (id, name, public)
VALUES ('assignment-files', 'assignment-files', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for assignment files bucket
CREATE POLICY "Users can upload their own assignment files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'assignment-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own assignment files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'assignment-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own assignment files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'assignment-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add file_path column to assignments table to store uploaded document
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS file_path TEXT;
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS file_name TEXT;