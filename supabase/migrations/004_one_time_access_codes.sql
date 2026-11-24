-- Enforce one-time usage on access_codes without invalidating the single minted session.
-- Run in Supabase SQL Editor or via `supabase db push`

ALTER TABLE public.access_codes
  ADD COLUMN IF NOT EXISTS used_at timestamptz;

-- Backfill any codes that already created a visitor session so they cannot be reused
UPDATE public.access_codes ac
SET used_at = first_session.first_used_at
FROM (
  SELECT access_code_id, MIN(created_at) AS first_used_at
  FROM public.access_sessions
  GROUP BY access_code_id
) AS first_session
WHERE ac.id = first_session.access_code_id
  AND ac.used_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_access_codes_unused
  ON public.access_codes (code_hash)
  WHERE used_at IS NULL AND is_active = true AND revoked_at IS NULL;
