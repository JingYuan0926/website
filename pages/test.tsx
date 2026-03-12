import { useState, useRef, useCallback, useEffect } from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ExternalLink, Loader2 } from "lucide-react";

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

const LUMA_CALENDAR_URL = "https://luma.com/mysuperteam";

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

/* ── motion presets ────────────────────────────────── */

const ease = [0.25, 1, 0.5, 1] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease, delay: i * 0.06 },
  }),
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease } },
};

const groupVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { duration: 0.35, ease, delay: i * 0.08 },
  }),
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

/* ── helpers ───────────────────────────────────────── */

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

/* ── page ──────────────────────────────────────────── */

export default function TestEventsPage() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [events, setEvents] = useState<LumaEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const groups = groupByDate(events);

  // Fetch initial batch on tab change
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

  // Load next page on scroll
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

  // Intersection observer for infinite scroll
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

  const tabs = ["upcoming", "past"] as const;

  return (
    <>
      <Head>
        <title>{`Events \u2014 Superteam Malaysia`}</title>
        <meta
          name="description"
          content="Upcoming events, meetups, and hackathons from Superteam Malaysia."
        />
      </Head>

      <main className="pt-28 pb-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left — sticky hero text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
              className="lg:sticky lg:top-28"
            >
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease, delay: 0.1 }}
                className="text-fluid-2xl font-semibold tracking-tight leading-[1.1]"
              >
                Join us for our
                <br />
                upcoming events.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease, delay: 0.2 }}
                className="mt-5 text-text-secondary leading-relaxed max-w-md"
              >
                Find your tribe and ignite your passion. We&rsquo;re here to
                support your journey in the Solana ecosystem. Our events are the
                best place to learn more.
              </motion.p>

              <motion.a
                href={LUMA_CALENDAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.35 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 rounded-full bg-text-primary text-bg text-sm font-semibold transition-opacity"
              >
                View all on Luma
                <ExternalLink size={14} />
              </motion.a>
            </motion.div>

            {/* Right — event pane */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.15 }}
              className="rounded-2xl border border-[#262626] bg-[#1a1a1a] overflow-hidden"
            >
              {/* Tab toggle with sliding indicator */}
              <div className="relative flex gap-1 p-2 mx-3 mt-3 rounded-lg bg-[#141414]">
                <motion.div
                  className="absolute top-2 bottom-2 rounded-md bg-[#262626]"
                  layoutId="tab-indicator"
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
                      tab === t ? "text-white" : "text-[#888] hover:text-white"
                    }`}
                  >
                    {t === "upcoming" ? "Upcoming" : "Past"}
                  </button>
                ))}
              </div>

              <div
                ref={scrollRef}
                className="max-h-[520px] overflow-y-auto p-5 scrollbar-thin"
              >
                {/* Initial loading */}
                {initialLoading && (
                  <div className="flex justify-center py-12">
                    <Loader2 size={24} className="animate-spin text-[#888]" />
                  </div>
                )}

                {/* Empty state */}
                {!initialLoading && events.length === 0 && (
                  <p className="text-center text-sm text-[#888] py-12">
                    No {tab === "upcoming" ? "upcoming" : "past"} events found.
                  </p>
                )}

                {/* Timeline */}
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

                      <div className="space-y-6">
                        {groups.map((group, gi) => (
                          <motion.div
                            key={group.label}
                            variants={groupVariants}
                            initial="hidden"
                            animate="visible"
                            custom={gi}
                            className="relative"
                          >
                            <div className="flex items-center gap-2.5 mb-3">
                              <motion.div
                                className="relative z-10 w-2 h-2 rounded-full bg-white shrink-0 ring-4 ring-[#1a1a1a]"
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
                              <span className="text-sm text-[#888]">
                                {group.weekday}
                              </span>
                            </div>

                            <div className="ml-[18px] space-y-3">
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

                {/* Scroll sentinel + spinner */}
                {hasMore && (
                  <div ref={sentinelRef} className="flex justify-center py-4">
                    {loading && (
                      <Loader2
                        size={20}
                        className="animate-spin text-[#888]"
                      />
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}

/* ── event card ────────────────────────────────────── */

function EventCard({ event }: { event: LumaEvent }) {
  return (
    <a
      href={event.lumaUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl border border-[#262626] bg-[#212121] hover:bg-[#262626] hover:border-[#3a3a3a] transition-colors duration-200 overflow-hidden"
    >
      <div className="flex items-center gap-5 p-5">
        <div className="flex-1 min-w-0">
          <p className="text-base">
            <span className="text-[#f0a050] font-medium">{event.time}</span>
            <span className="text-[#666] ml-1.5 text-sm font-medium">
              {event.timeZone}
            </span>
          </p>

          <h3 className="mt-1.5 text-[17px] font-semibold leading-snug text-white">
            {event.title}
          </h3>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center -space-x-1 w-[38px] shrink-0">
              {event.organizers.slice(0, 3).map((org) => (
                <img
                  key={org.name}
                  src={org.avatarUrl}
                  alt={org.name}
                  className="w-4 h-4 rounded-full border border-[#212121] object-cover"
                />
              ))}
            </div>
            <span className="text-sm text-[#888] truncate">
              By {event.organizers.map((o) => o.name).join(", ")}
            </span>
          </div>

          <p className="mt-2.5 text-sm text-[#888] inline-flex items-center gap-1.5">
            <MapPin size={12} />
            {event.location}
          </p>
        </div>

        {event.coverUrl && (
          <div className="shrink-0 w-[140px] h-[160px] rounded-xl overflow-hidden">
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
