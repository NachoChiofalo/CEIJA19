ALTER TABLE public.museum_contributions
  ADD COLUMN IF NOT EXISTS contact_phone TEXT;

DROP POLICY IF EXISTS "Anyone can submit a contribution" ON public.museum_contributions;

CREATE POLICY "Anyone can submit a contribution"
ON public.museum_contributions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(full_name) > 0 AND length(full_name) <= 200
  AND length(relationship) > 0 AND length(relationship) <= 200
  AND length(story) > 0 AND length(story) <= 5000
  AND (contact_email IS NULL OR length(contact_email) <= 320)
  AND (contact_phone IS NULL OR length(contact_phone) <= 50)
  AND (attachment_url IS NULL OR length(attachment_url) <= 1000)
);
