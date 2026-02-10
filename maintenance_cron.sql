-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule Daily PDF Cleanup (runs at midnight)
SELECT cron.schedule(
  'daily-pdf-cleanup',
  '0 0 * * *',
  $$
  SELECT
    net.http_post(
      url:='https://ggbxrwqkymztlhsolkcc.supabase.co/functions/v1/cleanup-pdfs',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnYnhyd3FreW16dGxoc29sa2NjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzk0ODk1MSwiZXhwIjoyMDgzNTI0OTUxfQ.lyEldoX1g612pc6VW5nIz-uD--LAqR7ZnK0x_hpQ0RU"}'::jsonb
    ) as request_id;
  $$
);

-- Schedule Database Keep-Alive (runs every 6 hours)
SELECT cron.schedule(
  'keep-alive-ping',
  '0 */6 * * *',
  $$ SELECT 1; $$
);
