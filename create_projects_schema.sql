-- 1. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    category TEXT, -- e.g., 'Interior', 'Exterior', 'Full Home'
    cover_image_url TEXT,
    completion_date DATE,
    sqft TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add foreign key to work_images
ALTER TABLE public.work_images 
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE;

-- 3. Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies
CREATE POLICY "Allow public read access to projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to projects" ON public.projects FOR ALL USING (auth.role() = 'authenticated'); -- Adjust based on actual auth model if needed, or allow anon for now if testing without auth
-- flexible policy for dev:
CREATE POLICY "Allow all access to projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);

-- Update work_images policy if needed (already allows all)
