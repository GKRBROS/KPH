-- WATI WhatsApp Integration Schema for KPH

-- Add WhatsApp fields to existing enquiries table
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS whatsapp_sent BOOLEAN DEFAULT false;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS whatsapp_status TEXT;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS whatsapp_response JSONB;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS pdf_url TEXT;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS image_urls TEXT[];
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS sqft TEXT;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS project_details TEXT;

-- WhatsApp Numbers Table (for admin-managed recipient numbers)
CREATE TABLE IF NOT EXISTS whatsapp_numbers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone_number TEXT NOT NULL,
    label TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WATI Settings Table (for API configuration)
CREATE TABLE IF NOT EXISTS wati_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    api_endpoint TEXT NOT NULL DEFAULT '',
    api_key TEXT NOT NULL DEFAULT '',
    template_name TEXT NOT NULL DEFAULT 'enquiry_notification',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE whatsapp_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE wati_settings ENABLE ROW LEVEL SECURITY;

-- Policies for WhatsApp Numbers (admin only)
CREATE POLICY "Allow authenticated users to manage whatsapp numbers"
ON whatsapp_numbers FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Policies for WATI Settings (admin only)
CREATE POLICY "Allow authenticated users to manage wati settings"
ON wati_settings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert default WATI settings row
INSERT INTO wati_settings (api_endpoint, api_key, template_name)
VALUES ('', '', 'enquiry_notification')
ON CONFLICT DO NOTHING;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for WATI settings
DROP TRIGGER IF EXISTS update_wati_settings_updated_at ON wati_settings;
CREATE TRIGGER update_wati_settings_updated_at
    BEFORE UPDATE ON wati_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();