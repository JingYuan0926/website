import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, ExternalLink, Loader2 } from "lucide-react";

/* ── constants ─────────────────────────────────────── */

const NAV_ITEMS = [
  "PRODUCTS",
  "SOLUTIONS",
  "RESOURCES",
  "DOCS",
  "ENTERPRISE",
  "PRICING",
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

/* ── page ──────────────────────────────────────────── */

export default function Landing() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          isScrolled
            ? "bg-black/90 backdrop-blur-md border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-white font-black text-xl tracking-tight">
              Sanity
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item}
                href="#"
                className="px-3 py-1.5 text-xs font-semibold tracking-wider text-white/70 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="#"
              className="text-xs font-semibold tracking-wider text-white/70 hover:text-white transition-colors"
            >
              LOG IN
            </a>
            <a
              href="#"
              className="text-xs font-semibold tracking-wider px-5 py-2 rounded-full border border-white/40 text-white hover:bg-white/10 transition-colors"
            >
              CONTACT SALES
            </a>
            <a
              href="#"
              className="text-xs font-semibold tracking-wider px-5 py-2 rounded-full bg-[#f36b37] text-white hover:bg-[#e05a28] transition-colors"
            >
              GET STARTED
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

      {/* Hero section */}
      <section className="relative flex-1 flex items-end overflow-hidden">
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

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 pb-20 lg:pb-28 pt-32">
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
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#f36b37] text-white text-base font-semibold hover:bg-[#e05a28] transition-colors duration-150"
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
      </section>

      {/* Logo loop */}
      <div className="bg-[#f36b37] py-5 overflow-hidden shrink-0">
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

      {/* Past Events section */}
      <section
        className="relative px-6 min-h-screen flex items-center"
        style={{
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="max-w-[1100px] mx-auto w-full py-20">
          <EventsPane />
        </div>
      </section>

      {/* Features section */}
      <FeaturesSection />

      <style jsx>{`
        @keyframes scroll {
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
    <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 lg:gap-16 items-center">
      {/* Left — heading + description */}
      <div>
        <h2
          className="text-white font-semibold tracking-tight leading-[1.08]"
          style={{ fontSize: "clamp(2.25rem, 1.5rem + 3vw, 4rem)", whiteSpace: "nowrap" }}
        >
          Moments that built
          <br />
          our community
        </h2>

        <p className="mt-6 text-[#a1a1aa] text-xl leading-relaxed max-w-lg">
          Find your tribe and ignite your passion. We&rsquo;re here to support
          your journey in the Solana ecosystem. Our events are the best place to
          learn more.
        </p>

        <a
          href={LUMA_CALENDAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
        >
          View all on Luma
          <ExternalLink size={14} />
        </a>
      </div>

      {/* Right — event pane */}
      <div className="rounded-2xl border border-[#262626] bg-[#111111] overflow-hidden">
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
          className="max-h-[calc(100vh-280px)] overflow-y-auto p-4 scrollbar-thin"
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
      ref={containerRef}
      className="relative bg-black"
      style={{ height: `${FEATURES.length * 100}vh` }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen flex items-center px-6">
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
                  style={{ fontSize: "clamp(1.75rem, 1.2rem + 2vw, 2.75rem)" }}
                >
                  {feat.title}
                </h3>

                <p className="mt-5 text-[#a1a1aa] text-base leading-relaxed max-w-md">
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
