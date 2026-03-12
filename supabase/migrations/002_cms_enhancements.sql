-- ============================================================
-- CMS Enhancements: site_content, announcements, storage, realtime
-- ============================================================

-- 1. Site Content table (landing page CMS)
CREATE TABLE IF NOT EXISTS site_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  section text NOT NULL,
  key text NOT NULL,
  value text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'text',
  updated_at timestamptz DEFAULT now(),
  UNIQUE(section, key)
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read site_content" ON site_content FOR SELECT USING (true);
CREATE POLICY "Auth write site_content" ON site_content FOR ALL USING (auth.role() = 'authenticated');

-- Pre-seed with current hardcoded content
INSERT INTO site_content (section, key, value, type) VALUES
  ('hero', 'headline', 'The Home for Solana Builders in Malaysia', 'text'),
  ('hero', 'description', 'Connect, collaborate, and grow together with a community of founders, developers, and creators shaping the future on Solana.', 'text'),
  ('hero', 'cta_primary', 'Join Community', 'text'),
  ('hero', 'cta_secondary', 'Explore Opportunities', 'text'),
  ('mission', 'title', 'Empowering Malaysia''s Solana Builders', 'text'),
  ('mission', 'description', 'From mentorship to funding, we provide everything builders need to succeed in the Solana ecosystem.', 'text'),
  ('join_cta', 'headline', 'Ready to build with us?', 'text'),
  ('join_cta', 'description', 'Join Superteam Malaysia and connect with builders, discover opportunities, and grow in the Solana ecosystem.', 'text'),
  ('join_cta', 'telegram_url', 'https://t.me/SuperteamMY', 'url'),
  ('join_cta', 'twitter_url', 'https://x.com/SuperteamMY', 'url')
ON CONFLICT (section, key) DO NOTHING;

-- 2. Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  image_url text,
  link_url text,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published announcements" ON announcements FOR SELECT USING (is_published = true);
CREATE POLICY "Auth write announcements" ON announcements FOR ALL USING (auth.role() = 'authenticated');

-- 3. Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('events', 'events', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('general', 'general', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read storage" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "Auth upload storage" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update storage" ON storage.objects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete storage" ON storage.objects FOR DELETE USING (auth.role() = 'authenticated');

-- 4. Enable Realtime (using DO block to skip tables already added)
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY['members','events','partners','testimonials','faq_items','site_content','announcements','site_stats'])
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND tablename = t
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE %I', t);
    END IF;
  END LOOP;
END $$;
