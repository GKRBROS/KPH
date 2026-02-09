-- Update enquiries table with missing pdf_url field
ALTER TABLE public.enquiries 
ADD COLUMN IF NOT EXISTS pdf_url TEXT;

-- Create storage bucket for PDFs if it doesn't exist
-- Note: This is usually done via Supabase Dashboard or API, but documenting here for clarity
-- INSERT INTO storage.buckets (id, name, public) VALUES ('enquiry-pdfs', 'enquiry-pdfs', true);
