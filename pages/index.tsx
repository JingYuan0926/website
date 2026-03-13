import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Archivo } from "next/font/google";

const archivo = Archivo({ subsets: ["latin"], weight: ["900"], display: "swap" });
import { useState, useEffect, useRef } from "react";
import type { GetStaticProps } from "next";
import { MemberSpotlight } from "@/components/landing/MemberSpotlight";
import { WallOfLove } from "@/components/landing/WallOfLove";
import { HighlightWord } from "@/components/landing/HighlightWord";
import { PartnerMarquee } from "@/components/landing/PartnerMarquee";
import { EventsPane } from "@/components/landing/EventsSection";
import { FeaturesSection } from "@/components/landing/MissionSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { SAMPLE_TESTIMONIALS } from "@/lib/constants";
import type { Testimonial, MissionPillar, Announcement, Partner, Member } from "@/lib/types";

/* ── constants ─────────────────────────────────────── */

const NAV_ITEMS = [
  { label: "HOME", href: "#hero" },
  { label: "EVENTS", href: "#events" },
  { label: "MISSION", href: "#mission" },
  { label: "STATISTICS", href: "#statistics" },
  { label: "COMMUNITY", href: "#community" },
  { label: "TESTIMONIALS", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

const ease = [0.25, 1, 0.5, 1] as const;

/* ── types ─────────────────────────────────────────── */

interface StatItem {
  value: string;
  label: string;
  desc: string;
}

interface ContentMap { [key: string]: string }

interface LandingProps {
  testimonials: Testimonial[];
  missionPillars: MissionPillar[];
  announcements: Announcement[];
  partners: Partner[];
  stats: StatItem[];
  content: ContentMap;
  faqItems: { question: string; answer: string; category: string }[];
  spotlightMembers: Member[];
  communityProjects: { name: string; logo: string; link: string }[];
}

/* ── data fetching ────────────────────────────────── */

export const getStaticProps: GetStaticProps<LandingProps> = async () => {
  if (isSupabaseConfigured() && supabase) {
    const [testimonialsRes, missionRes, announcementsRes, partnersRes, statsRes, contentRes, faqRes, membersRes, projectsRes] = await Promise.all([
      supabase.from("testimonials").select("*").order("display_order"),
      supabase.from("mission_pillars").select("*").order("display_order"),
      supabase.from("announcements").select("*").eq("is_published", true).order("published_at", { ascending: false }).limit(5),
      supabase.from("partners").select("*").order("display_order"),
      supabase.from("site_stats").select("stats_json").limit(1).single(),
      supabase.from("site_content").select("section, key, value"),
      supabase.from("faq_items").select("question, answer, image_url").order("display_order"),
      supabase.from("members").select("*").eq("is_spotlight", true).order("display_order"),
      supabase.from("community_projects").select("name, logo_url, website_url").order("display_order"),
    ]);

    let stats: StatItem[] = [];
    if (statsRes.data?.stats_json) {
      try { stats = JSON.parse(statsRes.data.stats_json); } catch { /* use default */ }
    }

    const content: ContentMap = {};
    if (contentRes.data) {
      for (const row of contentRes.data as { section: string; key: string; value: string }[]) {
        content[`${row.section}.${row.key}`] = row.value;
      }
    }

    return {
      props: {
        testimonials: (testimonialsRes.data as Testimonial[]) || [],
        missionPillars: (missionRes.data as MissionPillar[]) || [],
        announcements: (announcementsRes.data as Announcement[]) || [],
        partners: (partnersRes.data as Partner[]) || [],
        stats,
        content,
        spotlightMembers: (membersRes.data as Member[]) || [],
        communityProjects: (projectsRes.data || []).map((p: { name: string; logo_url: string; website_url: string }) => ({
          name: p.name, logo: p.logo_url, link: p.website_url,
        })),
        faqItems: (faqRes.data || []).map((f: { question: string; answer: string; image_url: string }) => ({
          question: f.question,
          answer: f.answer,
          category: f.image_url || "General",
        })),
      },
      revalidate: 3600,
    };
  }

  return {
    props: {
      testimonials: SAMPLE_TESTIMONIALS as unknown as Testimonial[],
      missionPillars: [],
      announcements: [],
      partners: [],
      stats: [],
      content: {},
      faqItems: [],
      spotlightMembers: [],
      communityProjects: [],
    },
  };
};

/* ── page ──────────────────────────────────────────── */

const DEFAULT_STATS: StatItem[] = [
  { value: "150+", label: "Community Members", desc: "Active builders across Malaysia contributing to the Solana ecosystem." },
  { value: "24", label: "Events Hosted", desc: "Meetups, hackathons, and workshops bringing the community together." },
  { value: "12", label: "Projects Funded", desc: "Startups and projects supported through grants and mentorship." },
  { value: "85", label: "Bounties Completed", desc: "Tasks shipped by community members on Superteam Earn." },
  { value: "5,000+", label: "Community Reach", desc: "People reached across social media and event attendance." },
];

export default function Landing({ testimonials, missionPillars, announcements, partners, stats, content, faqItems, spotlightMembers, communityProjects }: LandingProps) {
  const c = (key: string, fallback: string) => content[key] || fallback;
  const [isScrolled, setIsScrolled] = useState(false);
  const [heroVideo, setHeroVideo] = useState<"malaysia" | "solana">("malaysia");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-black" style={{ scrollSnapType: "y proximity" }}>
      {/* Announcement bar */}
      {(() => {
        const items = announcements.length > 0
          ? announcements.map((a) => a.title)
          : ["AI agents need structure. Build the foundation now"];
        const bannerLink = announcements.length === 1 && announcements[0]?.link_url
          ? announcements[0].link_url
          : undefined;
        const Wrapper = bannerLink ? "a" : "div";
        const wrapperProps = bannerLink ? { href: bannerLink, target: "_blank", rel: "noopener noreferrer" } : {};
        const half = [...items, ...items, ...items, ...items, ...items, ...items];
        return (
          <Wrapper
            {...(wrapperProps as Record<string, unknown>)}
            className={`fixed top-0 left-0 right-0 z-[60] bg-[#7fd189] overflow-hidden transition-all duration-300 ${
              isScrolled ? "h-0 opacity-0" : "h-8 opacity-100"
            } ${bannerLink ? "cursor-pointer" : ""}`}
          >
            <div className="h-full flex items-center">
              <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap">
                {half.map((text, i) => (
                  <span key={`a-${i}`} className="text-xs font-medium text-black shrink-0 mx-12">
                    {text} &rarr;
                  </span>
                ))}
                {half.map((text, i) => (
                  <span key={`b-${i}`} className="text-xs font-medium text-black shrink-0 mx-12">
                    {text} &rarr;
                  </span>
                ))}
              </div>
            </div>
          </Wrapper>
        );
      })()}

      {/* Navigation */}
      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "top-0 bg-black/90 backdrop-blur-md border-b border-white/10"
            : "top-8 bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo/stmy.svg" alt="Superteam" className="h-7 w-7 object-contain" />
            <span className={`text-white font-black text-xl tracking-tight ${archivo.className}`}>
              superteam<sup className="text-[0.5em] align-super">MY</sup>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-3 py-1.5 text-xs font-semibold tracking-wider text-white/70 hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="/members"
              className="text-xs font-semibold tracking-wider px-5 py-2 rounded-full border border-white/30 text-white/80 hover:border-white/60 hover:text-white transition-colors"
            >
              MEMBERS
            </a>
            <a
              href="#cta"
              className="text-xs font-semibold tracking-wider px-5 py-2 rounded-full bg-[#9945ff] text-white hover:bg-[#8a3ae6] transition-colors"
            >
              JOIN US
            </a>
          </div>

          <button className="md:hidden p-2 text-white/70" aria-label="Menu">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M4 8h16M4 16h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero section + logo loop */}
      <section id="hero" className="relative flex flex-col overflow-hidden" style={{ height: "100dvh", scrollSnapAlign: "start" }}>
        <AnimatePresence mode="wait">
          <motion.video
            key={heroVideo}
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 w-full h-full object-cover"
            src={heroVideo === "malaysia" ? "/video.mp4" : "/video-solana.mp4"}
          />
        </AnimatePresence>

        <div
          className="absolute inset-0 backdrop-blur-[2px]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.7) 100%)",
          }}
        />

        <div className="relative z-10 flex-1 flex items-end w-full max-w-[1400px] mx-auto px-6 pb-16 lg:pb-24 pt-32">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.1 }}
              className="text-white font-black tracking-tight leading-[1.02]"
              style={{ fontSize: "clamp(3.5rem, 2.5rem + 5vw, 7rem)" }}
            >
              Empowering{" "}
              <HighlightWord color="#9945ff" cursorUrl="/logo/solana.svg" onClick={() => setHeroVideo("solana")}>
                Solana
              </HighlightWord>
              <br />
              builders in{" "}
              <HighlightWord color="#ed7b84" cursorUrl="/logo/stmy.svg" onClick={() => setHeroVideo("malaysia")}>
                Malaysia
              </HighlightWord>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.2 }}
              className="mt-6 text-white/80 max-w-4xl leading-relaxed"
              style={{ fontSize: "clamp(1.1rem, 0.9rem + 0.7vw, 1.4rem)" }}
            >
              {c("hero.description", "Join our community of developers, designers, and creators or explore bounties, grants, and opportunities to build on Solana from Malaysia to the world.")}
            </motion.p>
          </div>
        </div>

        {/* Logo loop — inside hero */}
        <PartnerMarquee partners={partners} />
      </section>

      {/* Events section */}
      <section
        id="events"
        className="relative px-6 flex items-center overflow-hidden"
        style={{
          minHeight: "100dvh",
          scrollSnapAlign: "start",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="max-w-[1200px] mx-auto w-full py-10">
          <EventsPane content={content} />
        </div>
      </section>

      {/* Mission section */}
      <FeaturesSection pillars={missionPillars} content={content} />

      {/* Statistics section */}
      <section id="statistics" className="relative px-6 overflow-hidden bg-black flex items-center" style={{ minHeight: "calc(100dvh - 60px)", scrollSnapAlign: "start" }}>
        {/* Deep purple gradient background */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 90% 70% at 50% 50%, rgba(80,20,160,0.45) 0%, rgba(60,15,120,0.2) 40%, #0a0a0a 85%)",
        }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[200px] bg-[#6a2ec0]/25" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[160px] bg-[#4a1a8a]/20" />

        {/* Decorative trophy/achievement icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <svg className="absolute top-[4%] left-[3%] opacity-[0.18]" width="120" height="120" viewBox="0 0 24 24" fill="#dea54b" style={{ transform: "rotate(-15deg)" }}>
            <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
          </svg>
          <svg className="absolute top-[6%] left-[20%] opacity-[0.12]" width="50" height="50" viewBox="0 0 24 24" fill="#dea54b" style={{ transform: "rotate(25deg)" }}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <svg className="absolute top-[3%] left-[38%] opacity-[0.10]" width="80" height="80" viewBox="0 0 24 24" fill="#dea54b" style={{ transform: "rotate(-25deg)" }}>
            <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
          </svg>
          <svg className="absolute top-[8%] left-[55%] opacity-[0.14]" width="45" height="45" viewBox="0 0 24 24" fill="#dea54b" style={{ transform: "rotate(8deg)" }}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <svg className="absolute top-[5%] left-[70%] opacity-[0.16]" width="100" height="100" viewBox="0 0 24 24" fill="#dea54b" style={{ transform: "rotate(18deg)" }}>
            <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
          </svg>
          <svg className="absolute top-[10%] right-[5%] opacity-[0.15]" width="70" height="70" viewBox="0 0 24 24" fill="#dea54b" style={{ transform: "rotate(-10deg)" }}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <svg className="absolute top-[25%] left-[1%] opacity-[0.11]" width="55" height="55" viewBox="0 0 24 24" fill="#dea54b" style={{ transform: "rotate(30deg)" }}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <svg className="absolute top-[22%] left-[18%] opacity-[0.13]" width="90" height="90" viewBox="0 0 24 24" fill="#dea54b" style={{ transform: "rotate(-20deg)" }}>
            <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
          </svg>
          <svg className="absolute top-[28%] right-[15%] opacity-[0.12]" width="65" height="65" viewBox="0 0 24 24" fill="#dea54b" style={{ transform: "rotate(15deg)" }}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <svg className="absolute top-[20%] right-[2%] opacity-[0.15]" width="110" height="110" viewBox="0 0 24 24" fill="#dea54b" style={{ transform: "rotate(25deg)" }}>
            <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
          </svg>
          <svg className="absolute top-[42%] left-[5%] opacity-[0.14]" width="95" height="95" viewBox="0 0 24 24" fill="#dea54b" style={{ transform: "rotate(10deg)" }}>
            <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
          </svg>
          <svg className="absolute top-[45%] left-[30%] opacity-[0.10]" width="40" height="40" viewBox="0 0 24 24" fill="#dea54b" style={{ transform: "rotate(-35deg)" }}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <svg className="absolute top-[40%] right-[8%] opacity-[0.16]" width="85" height="85" viewBox="0 0 24 24" fill="#dea54b" style={{ transform: "rotate(-12deg)" }}>
            <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
          </svg>
          <svg className="absolute top-[48%] right-[25%] opacity-[0.11]" width="55" height="55" viewBox="0 0 24 24" fill="#dea54b" style={{ transform: "rotate(20deg)" }}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <svg className="absolute top-[60%] left-[10%] opacity-[0.13]" width="60" height="60" viewBox="0 0 24 24" fill="#dea54b" style={{ transform: "rotate(-22deg)" }}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <svg className="absolute top-[62%] left-[28%] opacity-[0.15]" width="105" height="105" viewBox="0 0 24 24" fill="#dea54b" style={{ transform: "rotate(8deg)" }}>
            <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
          </svg>
          <svg className="absolute top-[58%] right-[5%] opacity-[0.12]" width="50" height="50" viewBox="0 0 24 24" fill="#dea54b" style={{ transform: "rotate(35deg)" }}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <svg className="absolute top-[65%] right-[18%] opacity-[0.14]" width="75" height="75" viewBox="0 0 24 24" fill="#dea54b" style={{ transform: "rotate(-18deg)" }}>
            <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
          </svg>
          <svg className="absolute bottom-[12%] left-[2%] opacity-[0.16]" width="130" height="130" viewBox="0 0 24 24" fill="#dea54b" style={{ transform: "rotate(22deg)" }}>
            <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
          </svg>
          <svg className="absolute bottom-[15%] left-[22%] opacity-[0.11]" width="45" height="45" viewBox="0 0 24 24" fill="#dea54b" style={{ transform: "rotate(-30deg)" }}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <svg className="absolute bottom-[5%] left-[42%] opacity-[0.13]" width="70" height="70" viewBox="0 0 24 24" fill="#dea54b">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <svg className="absolute bottom-[8%] left-[60%] opacity-[0.15]" width="100" height="100" viewBox="0 0 24 24" fill="#dea54b" style={{ transform: "rotate(-5deg)" }}>
            <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
          </svg>
          <svg className="absolute bottom-[10%] right-[3%] opacity-[0.17]" width="140" height="140" viewBox="0 0 24 24" fill="#dea54b" style={{ transform: "rotate(15deg)" }}>
            <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
          </svg>
          <svg className="absolute bottom-[18%] right-[30%] opacity-[0.10]" width="35" height="35" viewBox="0 0 24 24" fill="#dea54b" style={{ transform: "rotate(40deg)" }}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>

        <div className="relative max-w-[1200px] mx-auto">
          <div
            className="rounded-3xl p-5 sm:p-8 lg:p-14"
            style={{
              background: "linear-gradient(135deg, rgba(100,40,180,0.15) 0%, rgba(60,20,120,0.08) 100%)",
              border: "1px solid rgba(153,69,255,0.18)",
              backdropFilter: "blur(40px) saturate(1.5)",
              WebkitBackdropFilter: "blur(40px) saturate(1.5)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(153,69,255,0.12)",
            }}
          >
            <div className="mb-12">
              <h2
                className="text-white font-semibold tracking-tight leading-[1.08]"
                style={{ fontSize: "clamp(1.75rem, 1.2rem + 2vw, 2.75rem)" }}
              >
                {c("results.title", "We only deliver results.")}
              </h2>
              <p className="mt-4 text-[#a1a1aa] text-sm leading-relaxed">
                {c("results.description", "Building the strongest Solana community in Malaysia.")}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-10">
              {(stats.length > 0 ? stats : DEFAULT_STATS).map((stat) => (
                <div key={stat.label}>
                  <p
                    className="font-semibold tracking-tight text-white"
                    style={{ fontSize: "clamp(2rem, 1.5rem + 2vw, 3.5rem)" }}
                  >
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {stat.label}
                  </p>
                  <p className="mt-1.5 text-xs text-[#888] leading-relaxed">
                    {stat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Member Spotlight */}
      <div id="community">
        <MemberSpotlight members={spotlightMembers} content={content} projects={communityProjects} />
      </div>

      {/* Wall of Love */}
      <div id="testimonials">
        <WallOfLove testimonials={testimonials} content={content} />
      </div>

      {/* FAQ section */}
      <FAQSection faqItems={faqItems} content={content} />

      {/* Footer */}
      <footer id="cta" className="border-t border-[#ffffff15] bg-black" style={{ scrollSnapAlign: "start" }}>
        {/* CTA banner */}
        <div
          className="relative overflow-hidden"
          style={{
            backgroundColor: "#4a15a0",
            backgroundImage:
              "linear-gradient(#14F19540 1px, transparent 1px), linear-gradient(90deg, #14F19540 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        >
          <div className="absolute top-0 right-1/4 w-[500px] h-[300px] rounded-full blur-[150px] bg-[#14F195]/15 pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[250px] rounded-full blur-[120px] bg-[#14F195]/10 pointer-events-none" />

          <div className="relative max-w-[1200px] mx-auto px-6 py-16 lg:py-20 text-center">
            <h2
              className="text-white font-semibold tracking-tight leading-[1.08]"
              style={{ fontSize: "clamp(1.75rem, 1.2rem + 2vw, 2.75rem)" }}
            >
              {c("join_cta.headline", "Ready to build with us?")}
            </h2>
            <p className="mt-4 text-white/70 text-sm max-w-lg mx-auto leading-relaxed">
              {c("join_cta.description", "Join Superteam Malaysia and connect with builders, discover opportunities, and grow in the Solana ecosystem.")}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={c("join_cta.telegram_url", "https://t.me/SuperteamMY")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold text-sm hover:bg-white/90 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                </svg>
                Join Telegram
              </a>
              <a
                href={c("join_cta.twitter_url", "https://x.com/SuperteamMY")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/40 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Follow on X
              </a>
            </div>
          </div>
        </div>

        {/* Footer content */}
        <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
            <div className="md:col-span-4">
              <div className="flex items-center gap-2 mb-5">
                <img src="/logo/stmy.svg" alt="Superteam" className="h-7 w-7 object-contain" />
                <span className={`text-white font-black text-xl tracking-tight ${archivo.className}`}>
                  superteam<sup className="text-[0.5em] align-super">MY</sup>
                </span>
              </div>
              <p className="text-[#a1a1aa] text-sm leading-relaxed max-w-sm">
                The home for Solana builders in Malaysia. Supporting developers,
                designers, and creators in the Web3 ecosystem.
              </p>
              <div className="flex items-center gap-4 mt-6">
                <a href={c("join_cta.twitter_url", "https://x.com/SuperteamMY")} target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" className="w-9 h-9 rounded-lg bg-[#ffffff0a] border border-[#ffffff15] flex items-center justify-center text-[#a1a1aa] hover:text-white hover:bg-[#ffffff15] transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </a>
                <a href={c("join_cta.telegram_url", "https://t.me/SuperteamMY")} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="w-9 h-9 rounded-lg bg-[#ffffff0a] border border-[#ffffff15] flex items-center justify-center text-[#a1a1aa] hover:text-white hover:bg-[#ffffff15] transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" /></svg>
                </a>
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-xs font-semibold tracking-widest uppercase text-[#71717a] mb-4">Navigate</h3>
              <ul className="space-y-3">
                <li><Link href="/" className="text-sm text-[#a1a1aa] hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/members" className="text-sm text-[#a1a1aa] hover:text-white transition-colors">Members</Link></li>
                <li><a href="https://earn.superteam.fun" target="_blank" rel="noopener noreferrer" className="text-sm text-[#a1a1aa] hover:text-white transition-colors">Superteam Earn</a></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-xs font-semibold tracking-widest uppercase text-[#71717a] mb-4">Community</h3>
              <ul className="space-y-3">
                <li><a href="https://x.com/SuperteamMY" target="_blank" rel="noopener noreferrer" className="text-sm text-[#a1a1aa] hover:text-white transition-colors">Twitter / X</a></li>
                <li><a href="https://t.me/SuperteamMY" target="_blank" rel="noopener noreferrer" className="text-sm text-[#a1a1aa] hover:text-white transition-colors">Telegram</a></li>
                <li><a href="https://superteam.fun" target="_blank" rel="noopener noreferrer" className="text-sm text-[#a1a1aa] hover:text-white transition-colors">Superteam Global</a></li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <h3 className="text-xs font-semibold tracking-widest uppercase text-[#71717a] mb-4">Newsletter</h3>
              <p className="text-sm text-[#a1a1aa] leading-relaxed mb-4">Get the latest updates straight to your inbox.</p>
              <div className="flex items-center gap-2">
                <input type="email" placeholder="Enter your email" className="flex-1 min-w-0 bg-[#ffffff0a] border border-[#ffffff15] rounded-lg px-3 py-2 text-sm text-white placeholder-[#555] outline-none focus:border-[#9945ff] transition-colors" />
                <button className="shrink-0 px-4 py-2 rounded-lg bg-[#9945ff] text-white text-sm font-semibold hover:bg-[#8a3ae6] transition-colors">Subscribe</button>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-6 border-t border-[#ffffff15] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#71717a]">&copy; {new Date().getFullYear()} Superteam Malaysia. All rights reserved.</p>
            <div className="flex items-center gap-2 text-xs text-[#71717a]">
              <span>Powered by</span>
              <img src="/logo/solana.png" alt="Solana" className="inline-block w-4 h-4 object-contain" />
              <span>Solana</span>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes partnerScroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
