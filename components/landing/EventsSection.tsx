import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ExternalLink, Loader2 } from "lucide-react";

interface ContentMap { [key: string]: string }

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
const ease = [0.25, 1, 0.5, 1] as const;

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

export function EventsPane({ content = {} }: { content?: ContentMap }) {
  const c = (key: string, fallback: string) => content[key] || fallback;
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
          {c("events.title", "Moments that built our community").split(/(our community)/g).map((part, i) =>
            part === "our community" ? <span key={i}><br />our community</span> : <span key={i}>{part}</span>
          )}
        </h2>

        <p className="mt-4 text-[#a1a1aa] text-sm leading-relaxed max-w-lg">
          {c("events.description", "Find your tribe and ignite your passion. We're here to support your journey in the Solana ecosystem. Our events are the best place to learn more.")}
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-8">
          <a
            href={c("events.submit_url", "https://luma.com/create?calendar=cal-sZfiZHfUS5piycU")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white text-white text-sm font-semibold hover:bg-white/10 transition-colors"
          >
            {c("events.submit_label", "Submit your event")}
            <ExternalLink size={14} />
          </a>
          <a
            href={c("events.luma_url", LUMA_CALENDAR_URL)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            {c("events.luma_label", "View all on Luma")}
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Right — event pane */}
      <div className="rounded-2xl border border-[#262626] bg-[#111111] overflow-hidden lg:w-[480px] lg:ml-auto lg:scale-90 min-h-[520px]" style={{ transformOrigin: "center right" }}>
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
          className="h-[500px] overflow-y-auto p-4 scrollbar-thin"
        >
          {initialLoading && (
            <div className="flex items-center justify-center h-full">
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
