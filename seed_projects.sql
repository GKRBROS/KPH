-- Insert Dummy Projects
INSERT INTO public.projects (id, title, description, location, category, cover_image_url, sqft, completion_date)
VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Modern Villa Makeover', 'A complete transformation of a 2-story villa including exterior texturing and interior premium emulsion finish. We used high-grade weather-proof paint for the exterior to withstand tropical monsoons.', 'Edathua, Kerala', 'Full Home Makeover', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', '3500 sq.ft', '2023-11-15'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Luxury Apartment Interior', 'Premium interior painting for a 3BHK apartment using Royal Luxury Emulsion. The project featured accent walls with texture designs in the living room and master bedroom.', 'Thiruvalla, Kerala', 'Interior Painting', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c', '1800 sq.ft', '2023-12-20'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Colonial House Restoration', 'Restoring the exterior charm of a 50-year-old colonial house. Extensive waterproofing and crack filling were done before applying the final coat of premium exterior paint.', 'Changanassery, Kerala', 'Exterior Painting', 'https://images.unsplash.com/photo-1600566753190-17409d5d2041', '2800 sq.ft', '2024-01-05');

-- Link existing or new work_images to these projects (Inserting new dummy images linked to projects)
INSERT INTO public.work_images (project_id, name, type, location, image_url, storage_path, is_published)
VALUES
    -- Project 1 Images
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Villa Exterior Front', 'Exterior', 'Edathua', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', 'dummy/p1_1.jpg', true),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Villa Living Room', 'Interior', 'Edathua', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0', 'dummy/p1_2.jpg', true),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Villa Kitchen', 'Interior', 'Edathua', 'https://images.unsplash.com/photo-1600566752355-35792bedcfe1', 'dummy/p1_3.jpg', true),
    
    -- Project 2 Images
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Apartment Living Area', 'Interior', 'Thiruvalla', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c', 'dummy/p2_1.jpg', true),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Master Bedroom', 'Interior', 'Thiruvalla', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea', 'dummy/p2_2.jpg', true),
    
    -- Project 3 Images
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Colonial Exterior', 'Exterior', 'Changanassery', 'https://images.unsplash.com/photo-1600566753190-17409d5d2041', 'dummy/p3_1.jpg', true),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Garden View', 'Exterior', 'Changanassery', 'https://images.unsplash.com/photo-1600596542815-60c3750436d0', 'dummy/p3_2.jpg', true);
