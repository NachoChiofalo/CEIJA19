CREATE TABLE public.museum_contributions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  contact_email TEXT,
  attachment_url TEXT,
  story TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.museum_contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a contribution"
ON public.museum_contributions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(full_name) > 0 AND length(full_name) <= 200
  AND length(relationship) > 0 AND length(relationship) <= 200
  AND length(story) > 0 AND length(story) <= 5000
  AND (contact_email IS NULL OR length(contact_email) <= 320)
  AND (attachment_url IS NULL OR length(attachment_url) <= 1000)
);