import type { SkillCategory } from "./types";

export const SITE_NAME = "Superteam Malaysia";
export const SITE_DESCRIPTION =
  "The home for Solana builders in Malaysia. Join the community, discover opportunities, and build the future of Web3.";
export const SITE_URL = "https://my.superteam.fun";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Members", href: "/members" },
] as const;

export const SOCIAL_LINKS = {
  twitter: "https://x.com/SuperteamMY",
  telegram: "https://t.me/SuperteamMY",
  discord: "#",
  superteamGlobal: "https://superteam.fun",
} as const;

export const SKILL_CATEGORIES: SkillCategory[] = [
  "All",
  "Core Team",
  "Rust",
  "Frontend",
  "Backend",
  "Design",
  "Content",
  "Growth",
  "Product",
  "Community",
  "DeFi",
  "NFTs",
];

export const MISSION_PILLARS = [
  {
    title: "Builder Support",
    description: "Mentorship, resources, and technical guidance for Solana developers in Malaysia.",
    icon: "code",
  },
  {
    title: "Events & Hackathons",
    description: "Regular meetups, workshops, and hackathons to connect and learn.",
    icon: "calendar",
  },
  {
    title: "Grants & Funding",
    description: "Access to grants, accelerators, and funding opportunities in the Solana ecosystem.",
    icon: "coins",
  },
  {
    title: "Jobs & Bounties",
    description: "Find high-quality opportunities through Superteam Earn and partner projects.",
    icon: "briefcase",
  },
  {
    title: "Education",
    description: "Workshops, bootcamps, and learning resources to level up your Web3 skills.",
    icon: "graduation-cap",
  },
  {
    title: "Ecosystem Growth",
    description: "Connecting Malaysian talent to the global Solana ecosystem.",
    icon: "globe",
  },
] as const;

export const FAQ_DEFAULT = [
  {
    question: "What is Superteam Malaysia?",
    answer:
      "Superteam Malaysia is the local chapter of the global Superteam network, dedicated to empowering builders, creators, founders, and talent in the Solana ecosystem across Malaysia.",
  },
  {
    question: "How do I join?",
    answer:
      "You can join by connecting with us on Twitter (@SuperteamMY) or Telegram (t.me/SuperteamMY). We welcome developers, designers, content creators, and anyone passionate about Web3.",
  },
  {
    question: "What opportunities are available?",
    answer:
      "We offer access to bounties, grants, jobs, hackathons, and project collaborations through Superteam Earn and our partner network.",
  },
  {
    question: "How can projects collaborate with us?",
    answer:
      "Projects looking to build or expand in Malaysia can reach out to us via Twitter or Telegram. We help connect projects with local talent and community.",
  },
  {
    question: "Do I need to be a developer to join?",
    answer:
      "Not at all. Superteam Malaysia welcomes designers, content creators, growth marketers, community managers, and anyone interested in contributing to the Solana ecosystem.",
  },
] as const;

// Sample data for development (used when Supabase is not connected)
export const SAMPLE_MEMBERS = [
  {
    id: "1",
    name: "Ahmad Rizal",
    title: "Full-Stack Developer",
    bio: "Building on Solana since 2022. Core contributor to multiple DeFi protocols.",
    avatar_url: "",
    skills: ["Rust", "Frontend", "DeFi"],
    twitter_handle: "ahmadrizal",
    github_url: "",
    linkedin_url: "",
    wallet_address: "",
    is_spotlight: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Siti Nurhaliza",
    title: "UI/UX Designer",
    bio: "Designing intuitive Web3 experiences. Previously at a top fintech startup.",
    avatar_url: "",
    skills: ["Design", "Product", "Frontend"],
    twitter_handle: "sitinur_design",
    github_url: "",
    linkedin_url: "",
    wallet_address: "",
    is_spotlight: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Wei Chen",
    title: "Rust Engineer",
    bio: "Solana program developer. Hackathon winner. Open source contributor.",
    avatar_url: "",
    skills: ["Rust", "Backend", "Core Team"],
    twitter_handle: "weichen_sol",
    github_url: "",
    linkedin_url: "",
    wallet_address: "",
    is_spotlight: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Priya Sharma",
    title: "Community Lead",
    bio: "Growing the Solana community in Malaysia. Events organizer and content creator.",
    avatar_url: "",
    skills: ["Community", "Content", "Growth"],
    twitter_handle: "priya_sol",
    github_url: "",
    linkedin_url: "",
    wallet_address: "",
    is_spotlight: false,
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Farid Hassan",
    title: "DeFi Researcher",
    bio: "Exploring decentralized finance. Writing about Solana DeFi protocols.",
    avatar_url: "",
    skills: ["DeFi", "Content", "Growth"],
    twitter_handle: "farid_defi",
    github_url: "",
    linkedin_url: "",
    wallet_address: "",
    is_spotlight: false,
    display_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Mei Ling Tan",
    title: "Frontend Developer",
    bio: "React & Next.js specialist. Building beautiful Web3 interfaces.",
    avatar_url: "",
    skills: ["Frontend", "Design", "Product"],
    twitter_handle: "meiling_dev",
    github_url: "",
    linkedin_url: "",
    wallet_address: "",
    is_spotlight: false,
    display_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
] as const;

export const SAMPLE_EVENTS = [
  {
    id: "1",
    title: "Solana Builder Night KL",
    description: "Monthly meetup for Solana developers in Kuala Lumpur. Network, share projects, and learn from each other.",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Kuala Lumpur, Malaysia",
    image_url: "",
    luma_url: "https://lu.ma",
    luma_event_id: "",
    is_featured: true,
    status: "upcoming" as const,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Web3 Workshop: Intro to Solana",
    description: "A beginner-friendly workshop covering the fundamentals of building on Solana.",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Penang, Malaysia",
    image_url: "",
    luma_url: "https://lu.ma",
    luma_event_id: "",
    is_featured: false,
    status: "upcoming" as const,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Superteam Malaysia Hackathon",
    description: "48-hour hackathon building on Solana. Prizes, mentors, and the chance to ship something real.",
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Cyberjaya, Malaysia",
    image_url: "",
    luma_url: "https://lu.ma",
    luma_event_id: "",
    is_featured: true,
    status: "upcoming" as const,
    created_at: new Date().toISOString(),
  },
] as const;

export const SAMPLE_STATS: {
  members_count: number;
  events_hosted: number;
  projects_funded: number;
  bounties_completed: number;
  community_reach: number;
} = {
  members_count: 150,
  events_hosted: 24,
  projects_funded: 12,
  bounties_completed: 85,
  community_reach: 5000,
};

export const SAMPLE_PARTNERS = [
  { id: "1", name: "Solana Foundation", logo_url: "", website_url: "https://solana.org", tier: "gold" as const, display_order: 1, created_at: new Date().toISOString() },
  { id: "2", name: "Superteam", logo_url: "", website_url: "https://superteam.fun", tier: "gold" as const, display_order: 2, created_at: new Date().toISOString() },
  { id: "3", name: "Helius", logo_url: "", website_url: "https://helius.dev", tier: "silver" as const, display_order: 3, created_at: new Date().toISOString() },
  { id: "4", name: "Jupiter", logo_url: "", website_url: "https://jup.ag", tier: "silver" as const, display_order: 4, created_at: new Date().toISOString() },
  { id: "5", name: "Marinade", logo_url: "", website_url: "https://marinade.finance", tier: "partner" as const, display_order: 5, created_at: new Date().toISOString() },
  { id: "6", name: "Tensor", logo_url: "", website_url: "https://tensor.trade", tier: "partner" as const, display_order: 6, created_at: new Date().toISOString() },
] as const;

export const SAMPLE_TESTIMONIALS = [
  {
    id: "1",
    author_name: "Superteam Malaysia",
    author_handle: "@SuperteamMY",
    author_title: "",
    author_avatar_url: "https://pbs.twimg.com/profile_images/1815610981788577792/QFDj2MR3_400x400.jpg",
    content: "Proud to announce that Superteam Malaysia is officially one of the fastest-growing chapters in the @SuperteamDAO network!\n\nFrom hackathons to builder meetups, our community has shipped some incredible projects this year.\n\nLet's keep building. #Solana #SuperteamMY",
    image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
    twitter_url: "https://x.com/SuperteamMY",
    is_tweet_embed: true,
    display_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    author_name: "Raj Gokal",
    author_handle: "@rajgokal",
    author_title: "",
    author_avatar_url: "https://pbs.twimg.com/profile_images/1886878480450322432/OR8STiCW_400x400.jpg",
    content: "Solana is one of the strongest ecosystems out there and keeps growing. It was an awesome evening at the Founder's Villa Demo Day 2, with our fellow #VC friends and some innovative projects building on @solana 🔥\n\n@SuperteamMY is killing it! 🤩\n\n#Solana #ecosystem #Malaysia",
    image_url: "",
    twitter_url: "https://x.com/rajgokal",
    is_tweet_embed: true,
    display_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    author_name: "Mert Mumtaz",
    author_handle: "@0xMert_",
    author_title: "",
    author_avatar_url: "https://pbs.twimg.com/profile_images/1858654533204598784/pMsaIFBF_400x400.jpg",
    content: "The Superteam model works. Decentralized community chapters driving local adoption is how you actually grow a blockchain ecosystem.\n\nMalaysia chapter is a great example of this in action.",
    image_url: "",
    twitter_url: "https://x.com/0xMert_",
    is_tweet_embed: true,
    display_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    author_name: "Sarah L.",
    author_handle: "@sarahdesigns",
    author_title: "Product Designer",
    author_avatar_url: "",
    content: "The events and workshops have been invaluable for learning about @solana. I went from curious to contributing within months.\n\nIf you're a designer interested in Web3, join @SuperteamMY!",
    image_url: "",
    twitter_url: "https://x.com/sarahdesigns",
    is_tweet_embed: true,
    display_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    author_name: "Superteam Malaysia",
    author_handle: "@SuperteamMY",
    author_title: "",
    author_avatar_url: "https://pbs.twimg.com/profile_images/1815610981788577792/QFDj2MR3_400x400.jpg",
    content: "Solana in Malaysia is just getting started 🚀\n\nWe hosted 12 events, onboarded 50+ new builders, and helped launch 8 projects this quarter alone.\n\nThe best is yet to come. #Solana #Malaysia #Web3",
    image_url: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&h=400&fit=crop",
    twitter_url: "https://x.com/SuperteamMY",
    is_tweet_embed: true,
    display_order: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    author_name: "Wei Chen",
    author_handle: "@weichen_dev",
    author_title: "Full Stack Developer",
    author_avatar_url: "",
    content: "Just shipped my first Solana dApp after joining the @SuperteamMY hackathon. The mentorship was incredible — shoutout to the whole team for making this happen!\n\n#BuildOnSolana",
    image_url: "",
    twitter_url: "https://x.com/weichen_dev",
    is_tweet_embed: true,
    display_order: 6,
    created_at: new Date().toISOString(),
  },
  {
    id: "7",
    author_name: "Aisha Rahman",
    author_handle: "@aisha_web3",
    author_title: "Community Manager",
    author_avatar_url: "",
    content: "@SuperteamMY hosted the best Web3 meetup in KL last week. Great vibes, amazing people, and real conversations about building on @solana.\n\nThis is what community looks like. #Solana #Malaysia",
    image_url: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600&h=400&fit=crop",
    twitter_url: "https://x.com/aisha_web3",
    is_tweet_embed: true,
    display_order: 7,
    created_at: new Date().toISOString(),
  },
  {
    id: "8",
    author_name: "Daniel Tan",
    author_handle: "@dtan_crypto",
    author_title: "DeFi Researcher",
    author_avatar_url: "",
    content: "The bounty program through Superteam has been a game changer. Earned my first SOL by contributing actual value to real projects.\n\nHighly recommend for anyone getting into #Solana dev.",
    image_url: "",
    twitter_url: "",
    is_tweet_embed: false,
    display_order: 8,
    created_at: new Date().toISOString(),
  },
  {
    id: "9",
    author_name: "Raj M.",
    author_handle: "@rajbuilds",
    author_title: "Startup Founder",
    author_avatar_url: "",
    content: "Through Superteam Malaysia, I found my co-founder and got our first grant. This community is a launchpad for builders.\n\nFrom idea to funded in 3 months. Wild.\n\n#SuperteamMY #Solana #Web3",
    image_url: "",
    twitter_url: "https://x.com/rajbuilds",
    is_tweet_embed: true,
    display_order: 9,
    created_at: new Date().toISOString(),
  },
] as const;
