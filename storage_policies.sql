-- 1. Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('enquiry-attachments', 'enquiry-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public Access for Enquiry Attachments" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload for Enquiry Attachments" ON storage.objects;

-- 3. Create policies (Skipping ALTER TABLE as RLS is enabled by default)

-- Allow public access to view files
CREATE POLICY "Public Access for Enquiry Attachments"
ON storage.objects FOR SELECT
USING ( bucket_id = 'enquiry-attachments' );

-- Allow public access to upload files
CREATE POLICY "Public Upload for Enquiry Attachments"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'enquiry-attachments' );
