import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MissionPillar } from "@/lib/types";

interface ContentMap { [key: string]: string }

const ease = [0.25, 1, 0.5, 1] as const;

const FEATURES: { label: string; title: string; description: string; bullets: string[]; cta: string; ctaUrl?: string; imageUrl?: string; imageLink?: string }[] = [
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

export function FeaturesSection({ pillars, content = {} }: { pillars?: MissionPillar[]; content?: ContentMap }) {
  const c = (key: string, fallback: string) => content[key] || fallback;
  const features = pillars && pillars.length > 0
    ? pillars.map((p) => ({
        label: p.title.toUpperCase(),
        title: p.heading || p.title,
        description: p.description,
        bullets: p.bullets || [],
        cta: p.cta_text || "",
        ctaUrl: p.cta_url || "#",
        imageUrl: p.image_url || "",
      }))
    : FEATURES;

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
        Math.floor(progress * features.length),
        features.length - 1
      );
      setActive(index);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [features.length]);

  const feat = features[active];

  return (
    <section
      id="mission"
      ref={containerRef}
      className="relative bg-black"
      style={{ height: `${features.length * 100}vh`, scrollSnapAlign: "start" }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen flex flex-col justify-center px-6">
        <div className="max-w-[1200px] mx-auto w-full mb-8">
          <h3
            className="text-white font-semibold tracking-tight leading-[1.08]"
            style={{ fontSize: "clamp(1.75rem, 1.2rem + 2vw, 2.75rem)" }}
          >
            {c("mission.title", "Our Mission")}
          </h3>
          <p className="mt-4 text-[#a1a1aa] text-sm leading-relaxed max-w-md">
            {c("mission.description", "Everything we do to empower Solana builders in Malaysia.")}
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
                {features.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (!containerRef.current) return;
                      const sectionHeight = containerRef.current.offsetHeight;
                      const scrollableHeight = sectionHeight - window.innerHeight;
                      const targetScroll =
                        containerRef.current.offsetTop +
                        (i / features.length) * scrollableHeight;
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

                {feat.cta && (
                <a
                  href={feat.ctaUrl || "#"}
                  className="inline-flex items-center justify-center mt-8 px-5 py-2.5 rounded-full border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
                >
                  {feat.cta}
                </a>
                )}
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
                {feat.imageUrl ? (
                  <img src={feat.imageUrl} alt={feat.label} className="w-full h-full object-cover" />
                ) : (
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
                )}
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
