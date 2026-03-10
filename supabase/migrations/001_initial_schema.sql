-- Superteam Malaysia Database Schema
-- Run this in the Supabase SQL Editor to set up all tables

-- Members table
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text DEFAULT '',
  bio text DEFAULT '',
  avatar_url text DEFAULT '',
  skills text[] DEFAULT '{}',
  twitter_handle text DEFAULT '',
  github_url text DEFAULT '',
  linkedin_url text DEFAULT '',
  wallet_address text DEFAULT '',
  is_spotlight boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  date timestamptz NOT NULL,
  location text DEFAULT '',
  image_url text DEFAULT '',
  luma_url text DEFAULT '',
  luma_event_id text DEFAULT '',
  is_featured boolean DEFAULT false,
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'past', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Partners table
CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text DEFAULT '',
  website_url text DEFAULT '',
  tier text DEFAULT 'partner' CHECK (tier IN ('gold', 'silver', 'partner')),
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  author_title text DEFAULT '',
  author_avatar_url text DEFAULT '',
  content text NOT NULL,
  twitter_url text DEFAULT '',
  is_tweet_embed boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- FAQ items table
CREATE TABLE IF NOT EXISTS faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Site stats (single row table)
CREATE TABLE IF NOT EXISTS site_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  members_count integer DEFAULT 0,
  events_hosted integer DEFAULT 0,
  projects_funded integer DEFAULT 0,
  bounties_completed integer DEFAULT 0,
  community_reach integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Profiles (admin users, linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  role text DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  created_at timestamptz DEFAULT now()
);

-- Insert default stats row
INSERT INTO site_stats (members_count, events_hosted, projects_funded, bounties_completed, community_reach)
VALUES (150, 24, 12, 85, 5000);

-- Insert default FAQ items
INSERT INTO faq_items (question, answer, display_order) VALUES
('What is Superteam Malaysia?', 'Superteam Malaysia is the local chapter of the global Superteam network, dedicated to empowering builders, creators, founders, and talent in the Solana ecosystem across Malaysia.', 1),
('How do I join?', 'You can join by connecting with us on Twitter (@SuperteamMY) or Telegram (t.me/SuperteamMY). We welcome developers, designers, content creators, and anyone passionate about Web3.', 2),
('What opportunities are available?', 'We offer access to bounties, grants, jobs, hackathons, and project collaborations through Superteam Earn and our partner network.', 3),
('How can projects collaborate with us?', 'Projects looking to build or expand in Malaysia can reach out to us via Twitter or Telegram. We help connect projects with local talent and community.', 4),
('Do I need to be a developer to join?', 'Not at all. Superteam Malaysia welcomes designers, content creators, growth marketers, community managers, and anyone interested in contributing to the Solana ecosystem.', 5);

-- Enable Row Level Security
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read members" ON members FOR SELECT USING (true);
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read partners" ON partners FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read faq_items" ON faq_items FOR SELECT USING (true);
CREATE POLICY "Public read site_stats" ON site_stats FOR SELECT USING (true);

-- Authenticated write policies (admin/editor)
CREATE POLICY "Auth write members" ON members FOR ALL USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'editor'))
);
CREATE POLICY "Auth write events" ON events FOR ALL USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'editor'))
);
CREATE POLICY "Auth write partners" ON partners FOR ALL USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'editor'))
);
CREATE POLICY "Auth write testimonials" ON testimonials FOR ALL USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'editor'))
);
CREATE POLICY "Auth write faq_items" ON faq_items FOR ALL USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'editor'))
);
CREATE POLICY "Auth write site_stats" ON site_stats FOR ALL USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'editor'))
);

-- Profile policies
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins manage profiles" ON profiles FOR ALL USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'editor');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Storage buckets (run these separately in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('events', 'events', true);
