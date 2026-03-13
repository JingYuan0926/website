import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Archivo } from "next/font/google";

const archivo = Archivo({ subsets: ["latin"], weight: ["900"], display: "swap" });
import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, ExternalLink, Loader2, ChevronDown } from "lucide-react";
import type { GetStaticProps } from "next";
import { MemberSpotlight } from "@/components/landing/MemberSpotlight";
import { WallOfLove } from "@/components/landing/WallOfLove";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { SAMPLE_TESTIMONIALS } from "@/lib/constants";
import type { Testimonial } from "@/lib/types";

/* ── constants ─────────────────────────────────────── */

const NAV_ITEMS = [
  { label: "EVENTS", href: "#events" },
  { label: "MISSION", href: "#mission" },
  { label: "STATISTICS", href: "#statistics" },
  { label: "COMMUNITY", href: "#community" },
  { label: "TESTIMONIALS", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

const PARTNER_LOGOS = [
  "Solana",
  "Phantom",
  "Jupiter",
  "Raydium",
  "Marinade",
  "Tensor",
  "Helius",
  "Jito",
  "Drift",
  "Pyth",
  "Backpack",
  "Squads",
  "Orca",
];

const LUMA_CALENDAR_URL = "https://luma.com/mysuperteam";

/* ── types ─────────────────────────────────────────── */

interface Organizer {
  name: string;
  avatarUrl: string;
}

interface LumaEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  timeZone: string;
  location: string;
  organizers: Organizer[];
  lumaUrl: string;
  coverUrl: string;
}

/* ── helpers ───────────────────────────────────────── */

const ease = [0.25, 1, 0.5, 1] as const;

async function fetchEvents(
  period: "future" | "past",
  cursor?: string | null
): Promise<{
  events: LumaEvent[];
  hasMore: boolean;
  nextCursor: string | null;
}> {
  const params = new URLSearchParams({ period });
  if (cursor) params.set("cursor", cursor);
  const res = await fetch(`/api/luma-events?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

function groupByDate(events: LumaEvent[]) {
  const groups: {
    label: string;
    day: number;
    month: string;
    weekday: string;
    events: LumaEvent[];
  }[] = [];
  for (const ev of events) {
    const d = new Date(ev.date);
    const day = d.getDate();
    const month = d.toLocaleDateString("en", { month: "short" });
    const weekday = d.toLocaleDateString("en", { weekday: "long" });
    const key = ev.date;
    const existing = groups.find((g) => g.label === key);
    if (existing) {
      existing.events.push(ev);
    } else {
      groups.push({ label: key, day, month, weekday, events: [ev] });
    }
  }
  return groups;
}

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease, delay: i * 0.06 },
  }),
};

const groupVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { duration: 0.35, ease, delay: i * 0.08 },
  }),
};

/* ── data fetching ────────────────────────────────── */

interface LandingProps {
  testimonials: Testimonial[];
}

export const getStaticProps: GetStaticProps<LandingProps> = async () => {
  if (isSupabaseConfigured() && supabase) {
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("display_order");

    return {
      props: { testimonials: (data as Testimonial[]) || [] },
      revalidate: 3600,
    };
  }

  return {
    props: { testimonials: SAMPLE_TESTIMONIALS as unknown as Testimonial[] },
  };
};

/* ── page ──────────────────────────────────────────── */

export default function Landing({ testimonials }: LandingProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-black" style={{ scrollSnapType: "y proximity" }}>
      {/* Announcement bar */}
      <div
        className={`fixed top-0 left-0 right-0 z-[60] bg-[#7fd189] overflow-hidden transition-all duration-300 ${
          isScrolled ? "h-0 opacity-0" : "h-8 opacity-100"
        }`}
      >
        <div className="h-full flex items-center">
          <div className="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap">
            {[...Array(2)].map((_, i) => (
              <span key={i} className="text-xs font-medium text-black mx-8">
                AI agents need structure. Build the foundation now &rarr;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AI agents need structure. Build the foundation now &rarr;
              </span>
            ))}
          </div>
        </div>
      </div>

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
      <section className="relative flex flex-col overflow-hidden" style={{ height: "100dvh", scrollSnapAlign: "start" }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>

        <div
          className="absolute inset-0 backdrop-blur-[2px]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.7) 100%)",
          }}
        />

        <div className="relative z-10 flex-1 flex items-end w-full max-w-[1400px] mx-auto px-6 pb-8 lg:pb-12 pt-32">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.1 }}
              className="text-white font-semibold tracking-tight leading-[1.05]"
              style={{ fontSize: "clamp(3rem, 2rem + 5vw, 6.5rem)" }}
            >
              Structure powers
              <br />
              intelligence
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.2 }}
              className="mt-6 text-white/80 max-w-2xl leading-relaxed"
              style={{ fontSize: "clamp(1.1rem, 0.9rem + 0.8vw, 1.5rem)" }}
            >
              The back-end built for AI content operations. Power web, mobile, and
              agentic applications at scale.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.3 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <a
                href="#"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#9945ff] text-white text-base font-semibold hover:bg-[#8a3ae6] transition-colors duration-150"
              >
                Start building
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-white/40 text-white text-base font-medium hover:bg-white/10 transition-colors duration-150"
              >
                Get a demo
              </a>
            </motion.div>
          </div>
        </div>

        {/* Logo loop — inside hero */}
        <div className="relative z-10 bg-[#9945ff] py-5 overflow-hidden shrink-0">
          <div className="flex animate-[scroll_20s_linear_infinite]">
            {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((name, i) => (
              <span
                key={i}
                className="shrink-0 mx-8 text-white font-bold text-lg tracking-tight whitespace-nowrap opacity-90"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events section */}
      <section
        id="events"
        className="relative px-6 flex items-center overflow-hidden"
        style={{
          minHeight: "100dvh",
          scrollSnapAlign: "start",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="max-w-[1200px] mx-auto w-full py-10">
          <EventsPane />
        </div>
      </section>

      {/* Features section */}
      <FeaturesSection />

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
          {/* Row 1 - top */}
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

          {/* Row 2 - upper middle */}
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

          {/* Row 3 - middle */}
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

          {/* Row 4 - lower middle */}
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

          {/* Row 5 - bottom */}
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
          {/* Glass card */}
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
            {/* Header row */}
            <div className="mb-12">
              <h2
                className="text-white font-semibold tracking-tight leading-[1.08]"
                style={{ fontSize: "clamp(1.75rem, 1.2rem + 2vw, 2.75rem)" }}
              >
                We only deliver results.
              </h2>
              <p className="mt-4 text-[#a1a1aa] text-sm leading-relaxed">
                Building the strongest Solana community in Malaysia.
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-10">
              {[
                { value: "150+", label: "Community Members", desc: "Active builders across Malaysia contributing to the Solana ecosystem." },
                { value: "24", label: "Events Hosted", desc: "Meetups, hackathons, and workshops bringing the community together." },
                { value: "12", label: "Projects Funded", desc: "Startups and projects supported through grants and mentorship." },
                { value: "85", label: "Bounties Completed", desc: "Tasks shipped by community members on Superteam Earn." },
                { value: "5,000+", label: "Community Reach", desc: "People reached across social media and event attendance." },
              ].map((stat) => (
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
        <MemberSpotlight members={[]} />
      </div>

      {/* Wall of Love */}
      <div id="testimonials">
        <WallOfLove testimonials={testimonials} />
      </div>

      {/* FAQ section */}
      <FAQSection />

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
              Ready to build with us?
            </h2>
            <p className="mt-4 text-white/70 text-sm max-w-lg mx-auto leading-relaxed">
              Join Superteam Malaysia and connect with builders, discover opportunities, and grow in the Solana ecosystem.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://t.me/SuperteamMY"
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
                href="https://x.com/SuperteamMY"
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
            {/* Brand */}
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
                <a
                  href="https://x.com/SuperteamMY"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter / X"
                  className="w-9 h-9 rounded-lg bg-[#ffffff0a] border border-[#ffffff15] flex items-center justify-center text-[#a1a1aa] hover:text-white hover:bg-[#ffffff15] transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://t.me/SuperteamMY"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  className="w-9 h-9 rounded-lg bg-[#ffffff0a] border border-[#ffffff15] flex items-center justify-center text-[#a1a1aa] hover:text-white hover:bg-[#ffffff15] transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Navigate */}
            <div className="md:col-span-2">
              <h3 className="text-xs font-semibold tracking-widest uppercase text-[#71717a] mb-4">
                Navigate
              </h3>
              <ul className="space-y-3">
                <li><Link href="/" className="text-sm text-[#a1a1aa] hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/members" className="text-sm text-[#a1a1aa] hover:text-white transition-colors">Members</Link></li>
                <li><a href="https://earn.superteam.fun" target="_blank" rel="noopener noreferrer" className="text-sm text-[#a1a1aa] hover:text-white transition-colors">Superteam Earn</a></li>
              </ul>
            </div>

            {/* Community */}
            <div className="md:col-span-2">
              <h3 className="text-xs font-semibold tracking-widest uppercase text-[#71717a] mb-4">
                Community
              </h3>
              <ul className="space-y-3">
                <li><a href="https://x.com/SuperteamMY" target="_blank" rel="noopener noreferrer" className="text-sm text-[#a1a1aa] hover:text-white transition-colors">Twitter / X</a></li>
                <li><a href="https://t.me/SuperteamMY" target="_blank" rel="noopener noreferrer" className="text-sm text-[#a1a1aa] hover:text-white transition-colors">Telegram</a></li>
                <li><a href="https://superteam.fun" target="_blank" rel="noopener noreferrer" className="text-sm text-[#a1a1aa] hover:text-white transition-colors">Superteam Global</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="md:col-span-4">
              <h3 className="text-xs font-semibold tracking-widest uppercase text-[#71717a] mb-4">
                Newsletter
              </h3>
              <p className="text-sm text-[#a1a1aa] leading-relaxed mb-4">
                Get the latest updates straight to your inbox.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 min-w-0 bg-[#ffffff0a] border border-[#ffffff15] rounded-lg px-3 py-2 text-sm text-white placeholder-[#555] outline-none focus:border-[#9945ff] transition-colors"
                />
                <button className="shrink-0 px-4 py-2 rounded-lg bg-[#9945ff] text-white text-sm font-semibold hover:bg-[#8a3ae6] transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 pt-6 border-t border-[#ffffff15] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#71717a]">
              &copy; {new Date().getFullYear()} Superteam Malaysia. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#71717a]">
              <span>Powered by</span>
              <svg width="16" height="12" viewBox="0 0 397.7 311.7" className="inline-block">
                <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" fill="#14F195" />
                <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="#14F195" />
                <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="#14F195" />
              </svg>
              <span>Solana</span>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
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

/* ── events pane ──────────────────────────────────── */

function EventsPane() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [events, setEvents] = useState<LumaEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const groups = groupByDate(events);
  const tabs = ["upcoming", "past"] as const;

  useEffect(() => {
    let cancelled = false;
    setEvents([]);
    setNextCursor(null);
    setHasMore(false);
    setInitialLoading(true);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;

    const period = tab === "upcoming" ? "future" : "past";
    fetchEvents(period)
      .then((data) => {
        if (cancelled) return;
        setEvents(data.events);
        setHasMore(data.hasMore);
        setNextCursor(data.nextCursor);
        setInitialLoading(false);
      })
      .catch(() => {
        if (!cancelled) setInitialLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tab]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);

    const period = tab === "upcoming" ? "future" : "past";
    fetchEvents(period, nextCursor)
      .then((data) => {
        setEvents((prev) => [...prev, ...data.events]);
        setHasMore(data.hasMore);
        setNextCursor(data.nextCursor);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [loading, hasMore, nextCursor, tab]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { root: scrollRef.current, threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-24 items-center">
      {/* Left — heading + description */}
      <div>
        <h2
          className="text-white font-semibold tracking-tight leading-[1.08]"
          style={{ fontSize: "clamp(1.75rem, 1.2rem + 2vw, 2.75rem)" }}
        >
          Moments that built
          <br />
          our community
        </h2>

        <p className="mt-4 text-[#a1a1aa] text-sm leading-relaxed max-w-lg">
          Find your tribe and ignite your passion. We&rsquo;re here to support
          your journey in the Solana ecosystem. Our events are the best place to
          learn more.
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-8">
          <a
            href="https://luma.com/create?calendar=cal-sZfiZHfUS5piycU"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white text-white text-sm font-semibold hover:bg-white/10 transition-colors"
          >
            Submit your event
            <ExternalLink size={14} />
          </a>
          <a
            href={LUMA_CALENDAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            View all on Luma
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Right — event pane */}
      <div className="rounded-2xl border border-[#262626] bg-[#111111] overflow-hidden lg:max-w-[480px] lg:ml-auto lg:scale-90" style={{ transformOrigin: "center right" }}>
        {/* Tab toggle */}
        <div className="relative flex gap-1 p-2 mx-3 mt-3 rounded-lg bg-[#0a0a0a]">
          <motion.div
            className="absolute top-2 bottom-2 rounded-md bg-[#262626]"
            layoutId="events-tab-indicator"
            style={{
              left: tab === "upcoming" ? "8px" : "50%",
              right: tab === "past" ? "8px" : "50%",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          />
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative z-10 flex-1 px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                tab === t ? "text-white" : "text-[#666] hover:text-white"
              }`}
            >
              {t === "upcoming" ? "Upcoming" : "Past"}
            </button>
          ))}
        </div>

        {/* Scrollable event list */}
        <div
          ref={scrollRef}
          className="max-h-[calc(85vh-80px)] overflow-y-auto p-4 scrollbar-thin"
        >
          {initialLoading && (
            <div className="flex justify-center py-16">
              <Loader2 size={24} className="animate-spin text-[#666]" />
            </div>
          )}

          {!initialLoading && events.length === 0 && (
            <p className="text-center text-sm text-[#666] py-16">
              No {tab === "upcoming" ? "upcoming" : "past"} events found.
            </p>
          )}

          {!initialLoading && events.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease }}
                className="relative"
              >
                <div
                  className="absolute left-[3.5px] top-3 bottom-3 w-px border-l border-dashed border-[#333]"
                  aria-hidden="true"
                />

                <div className="space-y-4">
                  {groups.map((group, gi) => (
                    <motion.div
                      key={group.label}
                      variants={groupVariants}
                      initial="hidden"
                      animate="visible"
                      custom={gi}
                      className="relative"
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <motion.div
                          className="relative z-10 w-2 h-2 rounded-full bg-white shrink-0 ring-4 ring-[#111111]"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            duration: 0.3,
                            ease,
                            delay: gi * 0.08 + 0.1,
                          }}
                        />
                        <span className="text-sm font-semibold text-white">
                          {group.day} {group.month}
                        </span>
                        <span className="text-sm text-[#666]">
                          {group.weekday}
                        </span>
                      </div>

                      <div className="ml-[18px] space-y-2">
                        {group.events.map((event, ei) => (
                          <motion.div
                            key={event.id}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            custom={gi * 2 + ei}
                          >
                            <EventCard event={event} />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {hasMore && (
            <div ref={sentinelRef} className="flex justify-center py-4">
              {loading && (
                <Loader2 size={20} className="animate-spin text-[#666]" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── event card ────────────────────────────────────── */

/* ── features section ─────────────────────────────── */

const FEATURES = [
  {
    label: "BUILDER SUPPORT",
    title: "Hands-on mentorship for builders",
    description:
      "Get paired with experienced mentors who guide you through building on Solana. From architecture reviews to go-to-market strategy.",
    bullets: [
      "1-on-1 mentor matching",
      "Technical architecture reviews",
      "Go-to-market guidance",
      "Community feedback loops",
    ],
    cta: "Find a Mentor",
  },
  {
    label: "EVENTS & HACKATHONS",
    title: "Where builders meet and ship together",
    description:
      "Regular meetups, hackathons, and builder nights across Malaysia. Build alongside the best in the Solana ecosystem.",
    bullets: [
      "Monthly builder nights",
      "Quarterly hackathons",
      "Demo days & showcases",
      "Regional Solana conferences",
    ],
    cta: "View Events",
  },
  {
    label: "GRANTS & FUNDING",
    title: "Capital to turn ideas into reality",
    description:
      "Access grants from the Solana Foundation, ecosystem partners, and our own micro-grant program for early-stage builders.",
    bullets: [
      "Solana Foundation grants",
      "Ecosystem partner funding",
      "Micro-grants for MVPs",
      "Pitch prep & introductions",
    ],
    cta: "Apply for Grants",
  },
  {
    label: "JOBS & BOUNTIES",
    title: "Earn while you build the future",
    description:
      "Discover full-time roles, freelance bounties, and project-based opportunities from top Solana teams worldwide.",
    bullets: [
      "Full-time Web3 roles",
      "Freelance bounties",
      "Project collaborations",
      "Superteam Earn platform",
    ],
    cta: "Explore Opportunities",
  },
  {
    label: "EDUCATION",
    title: "Learn Solana from zero to shipped",
    description:
      "Structured workshops, study groups, and resources to take you from curious to contributing in the Solana ecosystem.",
    bullets: [
      "Rust & Anchor workshops",
      "Frontend integration guides",
      "Security best practices",
      "Study groups & cohorts",
    ],
    cta: "Start Learning",
  },
  {
    label: "ECOSYSTEM",
    title: "Connections that compound over time",
    description:
      "Tap into a network of founders, developers, investors, and creators across the global Superteam network.",
    bullets: [
      "Global Superteam network",
      "Founder introductions",
      "Investor connections",
      "Cross-team collaborations",
    ],
    cta: "Join the Network",
  },
];

function FeaturesSection() {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const sectionHeight = container.offsetHeight;
      const scrolled = -rect.top;
      const scrollableHeight = sectionHeight - window.innerHeight;

      if (scrolled < 0 || scrollableHeight <= 0) {
        setActive(0);
        return;
      }

      const progress = Math.min(scrolled / scrollableHeight, 1);
      const index = Math.min(
        Math.floor(progress * FEATURES.length),
        FEATURES.length - 1
      );
      setActive(index);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const feat = FEATURES[active];

  return (
    <section
      id="mission"
      ref={containerRef}
      className="relative bg-black"
      style={{ height: `${FEATURES.length * 100}vh`, scrollSnapAlign: "start" }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen flex flex-col justify-center px-6">
        <div className="max-w-[1200px] mx-auto w-full mb-8">
          <h3
            className="text-white font-semibold tracking-tight leading-[1.08]"
            style={{ fontSize: "clamp(1.75rem, 1.2rem + 2vw, 2.75rem)" }}
          >
            Our Mission
          </h3>
          <p className="mt-4 text-[#a1a1aa] text-sm leading-relaxed max-w-md">
            Everything we do to empower Solana builders in Malaysia.
          </p>
        </div>
        <div className="max-w-[1200px] mx-auto w-full grid grid-cols-1 lg:grid-cols-[180px_1fr_1fr] gap-8 lg:gap-12">
          {/* Left — numbered nav */}
          <div className="hidden lg:block">
            <div className="relative">
              <div
                className="absolute left-[15px] top-0 bottom-0 w-px border-l border-dashed border-[#333]"
                aria-hidden="true"
              />
              <div className="space-y-0">
                {FEATURES.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (!containerRef.current) return;
                      const sectionHeight = containerRef.current.offsetHeight;
                      const scrollableHeight = sectionHeight - window.innerHeight;
                      const targetScroll =
                        containerRef.current.offsetTop +
                        (i / FEATURES.length) * scrollableHeight;
                      window.scrollTo({ top: targetScroll, behavior: "smooth" });
                    }}
                    className={`relative flex items-center gap-3 py-3 w-full text-left transition-all duration-300 ${
                      active === i
                        ? "text-white"
                        : "text-[#555] hover:text-[#888]"
                    }`}
                  >
                    <span
                      className={`relative z-10 w-[30px] h-[30px] flex items-center justify-center text-xs font-mono shrink-0 transition-all duration-300 ${
                        active === i
                          ? "border border-white text-white"
                          : "border border-[#333] text-[#555]"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`text-[11px] font-semibold tracking-wider whitespace-nowrap transition-colors duration-300 ${
                        active === i ? "text-white" : "text-[#555]"
                      }`}
                    >
                      {f.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Middle — text content */}
          <div className="hidden lg:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease }}
              >
                <h3
                  className="text-white font-semibold tracking-tight leading-[1.1]"
                  style={{ fontSize: "clamp(1.25rem, 1rem + 1.5vw, 2rem)" }}
                >
                  {feat.title}
                </h3>

                <p className="mt-4 text-[#a1a1aa] text-sm leading-relaxed max-w-md">
                  {feat.description}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {feat.bullets.map((b, i) => (
                    <motion.li
                      key={b}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.05 }}
                      className="flex items-center gap-2.5 text-white text-sm"
                    >
                      <span className="w-1 h-1 rounded-full bg-white shrink-0" />
                      {b}
                    </motion.li>
                  ))}
                </ul>

                <a
                  href="#"
                  className="inline-flex items-center justify-center mt-8 px-5 py-2.5 rounded-full border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
                >
                  {feat.cta}
                </a>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right — visual card */}
          <div className="hidden lg:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, ease }}
                className="rounded-2xl border border-[#262626] bg-[#111] overflow-hidden aspect-[4/3]"
              >
                <div className="w-full h-full flex flex-col items-center justify-center p-8">
                  <div className="w-16 h-16 rounded-xl bg-[#1a1a1a] border border-[#333] flex items-center justify-center mb-5">
                    <span className="text-2xl font-mono text-white/60">
                      {String(active + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white text-center">
                    {feat.label}
                  </p>
                  <p className="text-xs text-[#666] mt-2 text-center max-w-[200px]">
                    {feat.title}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile fallback */}
          <div className="lg:hidden">
            <span className="text-xs font-mono text-[#555] tracking-wider">
              {String(active + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-2 text-2xl font-semibold text-white tracking-tight leading-tight">
              {feat.title}
            </h3>
            <p className="mt-4 text-[#a1a1aa] text-base leading-relaxed">
              {feat.description}
            </p>
            <ul className="mt-5 space-y-2">
              {feat.bullets.map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-white text-sm">
                  <span className="w-1 h-1 rounded-full bg-white shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FAQ section ──────────────────────────────────── */

const FAQ_CATEGORIES = [
  {
    label: "General",
    image: "/faq/general.png",
    questions: [
      { q: "What is Superteam Malaysia?", a: "Superteam Malaysia is the leading community for Solana builders in Malaysia. We connect developers, designers, and creators with opportunities, mentorship, and resources in the Web3 ecosystem." },
      { q: "Who can join Superteam Malaysia?", a: "Anyone passionate about building on Solana — developers, designers, marketers, content creators, and community builders. Whether you're a beginner or experienced, there's a place for you." },
      { q: "Is there a membership fee?", a: "No, joining Superteam Malaysia is completely free. We're a community-driven organization supported by the Solana Foundation and ecosystem partners." },
      { q: "How do I become a member?", a: "Join our Telegram group and introduce yourself. Attend our events, participate in bounties, and contribute to the community. Active contributors get recognized and earn member status." },
      { q: "Where are you based?", a: "We're primarily based in Kuala Lumpur, but our community spans across Malaysia. We host events in KL and occasionally in other cities like Penang and Johor Bahru." },
    ],
  },
  {
    label: "Events",
    image: "/faq/events.png",
    questions: [
      { q: "How often do you host events?", a: "We host weekly ecosystem syncs, monthly builder nights, and quarterly hackathons. Check our Luma calendar for the latest schedule." },
      { q: "Are events online or in-person?", a: "We run both. Our weekly syncs are hybrid, builder nights are in-person in KL, and hackathons vary. All events are listed on our Luma page with format details." },
      { q: "Can I speak at an event?", a: "Absolutely! We're always looking for speakers who can share their Web3 journey, technical knowledge, or project updates. Reach out to us on Telegram to propose a talk." },
      { q: "Do you host hackathons?", a: "Yes, we run quarterly hackathons with prizes from ecosystem partners. We also help members participate in global Solana hackathons like Colosseum." },
      { q: "How do I stay updated on events?", a: "Follow us on X (@SuperteamMY), join our Telegram group, and subscribe to our Luma calendar for real-time event updates." },
    ],
  },
  {
    label: "Opportunities",
    image: "/faq/opportunities.png",
    questions: [
      { q: "What kind of bounties are available?", a: "Bounties range from development tasks, content creation, design work, to community management. Check Superteam Earn for the latest opportunities with rewards in SOL and USDC." },
      { q: "How do grants work?", a: "We help connect builders with grants from the Solana Foundation, ecosystem partners, and our own micro-grant program. We also provide guidance on writing grant proposals." },
      { q: "Can you help me find a Web3 job?", a: "Yes! We regularly share job postings from Solana ecosystem companies. Our network includes founders and hiring managers across the ecosystem who actively recruit from our community." },
      { q: "Do you offer mentorship?", a: "We pair builders with experienced mentors for technical guidance, architecture reviews, and go-to-market strategy. Reach out in our Telegram to get matched with a mentor." },
      { q: "How can my project get support?", a: "Present at our demo days, apply for ecosystem grants through us, and leverage our network for introductions to investors and partners. We've helped launch over 12 projects." },
    ],
  },
];

function FAQSection() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const category = FAQ_CATEGORIES[activeCategory];

  return (
    <section
      id="faq"
      className="relative px-6 flex items-center overflow-hidden py-16 lg:py-0"
      style={{ minHeight: "85dvh", scrollSnapAlign: "start", backgroundColor: "#0a0a0a" }}
    >
      {/* City skyline background */}
      <div
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        style={{
          height: "60%",
          backgroundImage: "url(/city.svg)",
          backgroundRepeat: "repeat-x",
          backgroundPosition: "bottom center",
          backgroundSize: "100vw auto",
          opacity: 0.15,
          maskImage: "linear-gradient(to bottom, transparent 0%, black 40%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 40%)",
        }}
      />
      <div className="relative max-w-[1200px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 lg:gap-20">
          {/* Left side */}
          <div className="flex flex-col">
            <h2
              className="text-white font-semibold tracking-tight leading-[1.1]"
              style={{ fontSize: "clamp(1.75rem, 1.2rem + 2vw, 2.75rem)" }}
            >
              Frequently asked
              <br />
              questions
            </h2>

            <div className="mt-8 flex items-center gap-6">
              {FAQ_CATEGORIES.map((cat, i) => (
                <button
                  key={cat.label}
                  onClick={() => {
                    setActiveCategory(i);
                    setOpenIndex(0);
                  }}
                  className={`relative pb-2 text-sm font-semibold transition-colors ${
                    activeCategory === i
                      ? "text-white"
                      : "text-[#555] hover:text-white"
                  }`}
                >
                  {cat.label}
                  {activeCategory === i && (
                    <motion.div
                      layoutId="faq-tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#9945ff]"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Category image — hidden on mobile */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="hidden lg:flex mt-8 flex-1 min-h-0 rounded-xl border border-dashed border-[#333] bg-[#0a0a0a] overflow-hidden items-center justify-center"
              >
                <img
                  src={category.image}
                  alt={category.label}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right side — accordion */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease }}
                className="divide-y divide-[#1a1a1a]"
              >
                {category.questions.map((item, i) => {
                  const isOpen = openIndex === i;
                  return (
                    <div key={i}>
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : i)}
                        className="w-full flex items-center justify-between gap-4 py-5 text-left"
                      >
                        <span
                          className={`text-base font-medium transition-colors ${
                            isOpen ? "text-white" : "text-[#a1a1aa]"
                          }`}
                        >
                          {item.q}
                        </span>
                        <ChevronDown
                          size={18}
                          className={`shrink-0 text-[#666] transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease }}
                            className="overflow-hidden"
                          >
                            <p className="pb-5 text-sm text-[#888] leading-relaxed">
                              {item.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function EventCard({ event }: { event: LumaEvent }) {
  return (
    <a
      href={event.lumaUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl border border-[#262626] bg-[#1a1a1a] hover:bg-[#212121] hover:border-[#3a3a3a] transition-colors duration-200 overflow-hidden"
    >
      <div className="flex items-center gap-3 p-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm">
            <span className="text-[#f0a050] font-medium">{event.time}</span>
            <span className="text-[#555] ml-1.5 text-xs font-medium">
              {event.timeZone}
            </span>
          </p>

          <h3 className="mt-1 text-sm font-semibold leading-snug text-white">
            {event.title}
          </h3>

          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex items-center -space-x-1 w-[38px] shrink-0">
              {event.organizers.slice(0, 3).map((org) => (
                <img
                  key={org.name}
                  src={org.avatarUrl}
                  alt={org.name}
                  className="w-4 h-4 rounded-full border border-[#1a1a1a] object-cover"
                />
              ))}
            </div>
            <span className="text-xs text-[#888] truncate">
              By {event.organizers.map((o) => o.name).join(", ")}
            </span>
          </div>

          <p className="mt-1.5 text-xs text-[#888] inline-flex items-center gap-1.5">
            <MapPin size={11} />
            {event.location}
          </p>
        </div>

        {event.coverUrl && (
          <div className="shrink-0 w-[90px] h-[100px] rounded-lg overflow-hidden">
            <img
              src={event.coverUrl}
              alt=""
              className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />
          </div>
        )}
      </div>
    </a>
  );
}
