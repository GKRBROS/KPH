-- Create uploads bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true) 
ON CONFLICT (id) DO NOTHING;

-- Add RLS policy for uploads to be publicly accessible/writable (Simplify for dev, tighten for prod)
-- Note: You might need to enable RLS on storage.objects first if not enabled, but usually it is.
CREATE POLICY "Public Uploads" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'uploads' );
CREATE POLICY "Public Select" ON storage.objects FOR SELECT USING ( bucket_id = 'uploads' );

-- Add columns to workers table safely
ALTER TABLE workers ADD COLUMN IF NOT EXISTS employee_image TEXT;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS joining_date DATE;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS resigning_date DATE;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS address TEXT;
