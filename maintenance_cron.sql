-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule Daily PDF Cleanup (runs at midnight)
-- REPLACEMENT NEEDED: Replace <project-ref> and <service-role-key> with your actual values
SELECT cron.schedule(
  'daily-pdf-cleanup',
  '0 0 * * *',
  $$
  SELECT
    net.http_post(
      url:='https://<project-ref>.supabase.co/functions/v1/cleanup-pdfs',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer <service-role-key>"}'::jsonb
    ) as request_id;
  $$
);

-- Schedule Database Keep-Alive (runs every 6 hours)
SELECT cron.schedule(
  'keep-alive-ping',
  '0 */6 * * *',
  $$ SELECT 1; $$
);
