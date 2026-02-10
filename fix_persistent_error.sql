-- FIX PERSISTENT CONFIGURATION ERROR (UPDATED)
-- We found the specific trigger causing the issue: "trg_send_admin_template"
-- We will use CASCADE to ensure all dependencies are removed.

-- 1. Drop the specific trigger identified in the error
DROP TRIGGER IF EXISTS "trg_send_admin_template" ON "public"."enquiries" CASCADE;

-- 2. Drop other potential triggers (just in case)
DROP TRIGGER IF EXISTS "on_enquiry_created" ON "public"."enquiries" CASCADE;
DROP TRIGGER IF EXISTS "enquiry_created" ON "public"."enquiries" CASCADE;
DROP TRIGGER IF EXISTS "send_whatsapp_notification" ON "public"."enquiries" CASCADE;
DROP TRIGGER IF EXISTS "webhook_handler" ON "public"."enquiries" CASCADE;

-- 3. Drop functions with CASCADE
-- This will automatically remove any triggers we missed that depend on these functions.
DROP FUNCTION IF EXISTS "public"."handle_new_enquiry"() CASCADE;
DROP FUNCTION IF EXISTS "public"."send_whatsapp_notification"() CASCADE;
DROP FUNCTION IF EXISTS "public"."notify_whatsapp"() CASCADE;
DROP FUNCTION IF EXISTS "public"."send_admin_template"() CASCADE;

-- 4. If the function was strangely named "trigger" (based on the error message)
DROP FUNCTION IF EXISTS "public"."trigger"() CASCADE;

-- 5. Clean up any leftover WATI settings if they exist (optional)
-- DROP TABLE IF EXISTS "wati_settings";
