-- Community projects (3x3 icons in the community grid)
CREATE TABLE IF NOT EXISTS community_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  logo_url text NOT NULL DEFAULT '',
  website_url text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE community_projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read community_projects" ON community_projects;
CREATE POLICY "Allow read community_projects" ON community_projects FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow write community_projects" ON community_projects;
CREATE POLICY "Allow write community_projects" ON community_projects FOR ALL USING (true) WITH CHECK (true);

-- Seed with existing projects
INSERT INTO community_projects (name, logo_url, website_url, display_order) VALUES
  ('Chaindex', '/community/chaindex.png', 'https://chaindex.xyz/', 0),
  ('Blox', '/community/blox.png', 'https://x.com/blox_malaysia', 1),
  ('Yields', '/community/yields.png', 'https://yields.so/', 2),
  ('Memoo AI', '/community/memooai.png', 'https://memoo.ai/', 3),
  ('CoinGecko', '/community/coingecko.png', 'https://coingecko.com/', 4),
  ('MirrorFi', '/community/mirrorfi.png', 'https://mirrorfi.xyz/', 5);
