-- Add completion_date and date_format columns if they don't exist
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS completion_date DATE,
ADD COLUMN IF NOT EXISTS date_format VARCHAR(20) DEFAULT 'full';

-- Also add other missing columns likely implied by the code if they aren't there
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS sqft VARCHAR(50);
