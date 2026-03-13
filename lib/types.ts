export interface Member {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar_url: string;
  skills: string[];
  twitter_handle: string;
  github_url: string;
  linkedin_url: string;
  wallet_address: string;
  is_spotlight: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image_url: string;
  luma_url: string;
  luma_event_id: string;
  is_featured: boolean;
  status: "upcoming" | "past" | "cancelled";
  created_at: string;
}

export interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  tier: "gold" | "silver" | "partner";
  display_order: number;
  created_at: string;
}

export interface Testimonial {
  id: string;
  author_name: string;
  author_handle: string;
  author_title: string;
  author_avatar_url: string;
  content: string;
  image_url: string;
  twitter_url: string;
  is_tweet_embed: boolean;
  display_order: number;
  created_at: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface MissionPillar {
  id: string;
  title: string;
  heading: string;
  description: string;
  bullets: string[];
  icon: string;
  image_url: string;
  cta_text: string;
  cta_url: string;
  display_order: number;
  created_at: string;
}

export interface SiteStats {
  id: string;
  members_count: number;
  events_hosted: number;
  projects_funded: number;
  bounties_completed: number;
  community_reach: number;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  role: "admin" | "editor";
  created_at: string;
}

export interface SiteContent {
  id: string;
  section: string;
  key: string;
  value: string;
  type: "text" | "markdown" | "image" | "url";
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  image_url: string;
  link_url: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
}

export type SkillCategory =
  | "All"
  | "Core Team"
  | "Rust"
  | "Frontend"
  | "Design"
  | "Content"
  | "Growth"
  | "Product"
  | "Community"
  | "DeFi"
  | "NFTs"
  | "Backend";
