-- Create bucket for PDFs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('enquiry-pdfs', 'enquiry-pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- RLS for storage.objects
CREATE POLICY "Allow public upload to enquiry-pdfs"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'enquiry-pdfs');

CREATE POLICY "Allow public select from enquiry-pdfs"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'enquiry-pdfs');
