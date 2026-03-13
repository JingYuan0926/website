-- ============================================================
-- Mission Pillars table + FAQ image support
-- ============================================================

-- 1. Mission Pillars table
CREATE TABLE IF NOT EXISTS mission_pillars (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  heading text NOT NULL DEFAULT '',
  description text NOT NULL,
  bullets text[] DEFAULT '{}',
  icon text NOT NULL DEFAULT 'code',
  image_url text DEFAULT '',
  cta_text text DEFAULT '',
  cta_url text DEFAULT '',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Add columns if table already existed
ALTER TABLE mission_pillars ADD COLUMN IF NOT EXISTS heading text NOT NULL DEFAULT '';
ALTER TABLE mission_pillars ADD COLUMN IF NOT EXISTS bullets text[] DEFAULT '{}';
ALTER TABLE mission_pillars ADD COLUMN IF NOT EXISTS cta_text text DEFAULT '';
ALTER TABLE mission_pillars ADD COLUMN IF NOT EXISTS cta_url text DEFAULT '';

ALTER TABLE mission_pillars ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mission_pillars' AND policyname = 'Public read mission_pillars') THEN
    CREATE POLICY "Public read mission_pillars" ON mission_pillars FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mission_pillars' AND policyname = 'Allow write mission_pillars') THEN
    CREATE POLICY "Allow write mission_pillars" ON mission_pillars FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Re-seed with full content
DELETE FROM mission_pillars;

INSERT INTO mission_pillars (title, heading, description, bullets, icon, cta_text, cta_url, display_order) VALUES
  ('Builder Support', 'Hands-on mentorship for builders',
   'Get paired with experienced mentors who guide you through building on Solana. From architecture reviews to go-to-market strategy.',
   ARRAY['1-on-1 mentor matching', 'Technical architecture reviews', 'Go-to-market guidance', 'Community feedback loops'],
   'code', 'Find a Mentor', '/members', 0),
  ('Events & Hackathons', 'Learn, build, and connect IRL',
   'Regular meetups, workshops, and hackathons bringing the Malaysian Solana community together.',
   ARRAY['Monthly builder meetups', 'Hackathon organization', 'Workshop series', 'Networking events'],
   'calendar', 'View Events', '#events', 1),
  ('Grants & Funding', 'Fuel your project''s growth',
   'Access to grants, accelerators, and funding opportunities in the Solana ecosystem.',
   ARRAY['Superteam Grants', 'Ecosystem fund introductions', 'Pitch preparation support', 'Milestone-based funding'],
   'coins', 'Apply for Grants', 'https://earn.superteam.fun', 2),
  ('Jobs & Bounties', 'Earn while you build',
   'Find high-quality opportunities through Superteam Earn and partner projects.',
   ARRAY['Full-time roles at Solana projects', 'Freelance bounties', 'Design & content gigs', 'Open-source contributions'],
   'briefcase', 'Browse Opportunities', 'https://earn.superteam.fun', 3),
  ('Education', 'Level up your Web3 skills',
   'Workshops, bootcamps, and learning resources to accelerate your blockchain development journey.',
   ARRAY['Solana development bootcamps', 'Smart contract workshops', 'DeFi masterclasses', 'Security best practices'],
   'graduation-cap', 'Start Learning', '#', 4),
  ('Ecosystem Growth', 'Grow the Malaysian Solana scene',
   'Connecting Malaysian talent to the global Solana ecosystem and driving local adoption.',
   ARRAY['Regional partnerships', 'University outreach', 'Ecosystem project support', 'Global Superteam network'],
   'globe', 'Get Involved', 'https://t.me/SuperteamMY', 5);

-- 2. Add image_url to faq_items
ALTER TABLE faq_items ADD COLUMN IF NOT EXISTS image_url text DEFAULT '';

-- 3. Add stats_json to site_stats for flexible stat editing
ALTER TABLE site_stats ADD COLUMN IF NOT EXISTS stats_json text DEFAULT '';

-- 3. Enable Realtime for mission_pillars
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'mission_pillars'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE mission_pillars;
  END IF;
END $$;
