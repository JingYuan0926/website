import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Archivo } from "next/font/google";
import { Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { marked } from "marked";
import type { Member as DBMember } from "@/lib/types";

const archivo = Archivo({ subsets: ["latin"], weight: ["900"], display: "swap" });

const NAV_ITEMS = [
  { label: "HOME", href: "/#hero" },
  { label: "EVENTS", href: "/#events" },
  { label: "MISSION", href: "/#mission" },
  { label: "STATISTICS", href: "/#statistics" },
  { label: "COMMUNITY", href: "/#community" },
  { label: "TESTIMONIALS", href: "/#testimonials" },
  { label: "FAQ", href: "/#faq" },
];

/* ── types ────────────────────────────────────────── */

interface Member {
  name: string;
  title: string;
  company: string;
  avatar: string;
  primaryRole: string;
  secondaryRole?: string;
  skills: string[];
  twitter?: string;
  bio: string;
}

/* ── color palette per skill ─────────────────────── */

const SKILL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "All":       { bg: "rgba(153,69,255,0.15)", text: "#9945FF", border: "rgba(153,69,255,0.3)" },
  "Core Team": { bg: "rgba(242,205,93,0.15)",  text: "#F2CD5D", border: "rgba(242,205,93,0.3)" },
  "Rust":      { bg: "rgba(198,137,174,0.15)", text: "#C689AE", border: "rgba(198,137,174,0.3)" },
  "Frontend":  { bg: "rgba(222,165,75,0.15)",  text: "#DEA54B", border: "rgba(222,165,75,0.3)" },
  "Design":    { bg: "rgba(230,144,104,0.15)", text: "#E69068", border: "rgba(230,144,104,0.3)" },
  "Content":   { bg: "rgba(237,123,132,0.15)", text: "#ED7B84", border: "rgba(237,123,132,0.3)" },
  "Growth":    { bg: "rgba(210,145,146,0.15)", text: "#D29192", border: "rgba(210,145,146,0.3)" },
  "Product":   { bg: "rgba(182,166,159,0.15)", text: "#B6A69F", border: "rgba(182,166,159,0.3)" },
  "Community": { bg: "rgba(127,209,185,0.15)", text: "#7FD1B9", border: "rgba(127,209,185,0.3)" },
};

/* ── filter categories ───────────────────────────── */

const SKILL_FILTERS = [
  "All",
  "Core Team",
  "Rust",
  "Frontend",
  "Design",
  "Content",
  "Growth",
  "Product",
  "Community",
] as const;

/* ── map DB member → card member ─────────────────── */

function mapDBMember(m: DBMember): Member {
  const raw = m.skills && m.skills.length > 0 ? m.skills : ["Community"];
  // Sort Core Team first
  const skills = [...raw];
  const coreIdx = skills.indexOf("Core Team");
  if (coreIdx > 0) { skills.splice(coreIdx, 1); skills.unshift("Core Team"); }
  return {
    name: m.name,
    title: m.title || "",
    company: "",
    avatar: m.avatar_url || `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(m.name)}`,
    primaryRole: skills[0],
    secondaryRole: skills[1],
    skills,
    twitter: m.twitter_handle ? `https://x.com/${m.twitter_handle}` : undefined,
    bio: m.bio || "",
  };
}

/* ── helpers ──────────────────────────────────────── */

const ease = [0.25, 1, 0.5, 1] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease, delay: i * 0.04 },
  }),
};

function getSkillColor(skill: string) {
  return SKILL_COLORS[skill] || SKILL_COLORS["Product"];
}

/* ── member card with flip ───────────────────────── */

function sortSkills(skills: string[]) {
  // Core Team always first, rest keep order
  const sorted = [...skills];
  const coreIdx = sorted.indexOf("Core Team");
  if (coreIdx > 0) {
    sorted.splice(coreIdx, 1);
    sorted.unshift("Core Team");
  }
  return sorted;
}

function MemberCard({ member, index }: { member: Member; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const [pillHover, setPillHover] = useState(false);
  const sorted = sortSkills(member.skills);
  const firstColor = getSkillColor(sorted[0]);
  const secondColor = sorted[1] ? getSkillColor(sorted[1]) : firstColor;
  const isCoreTeam = sorted.includes("Core Team");

  const visible = sorted.slice(0, 2);
  const remaining = sorted.length - 2;

  const hasGradientBorder = sorted.length >= 2;
  const gradientBorderOverlay = hasGradientBorder ? (
    <span
      className="absolute inset-0 rounded-2xl pointer-events-none z-10"
      style={{
        padding: "1px",
        background: `linear-gradient(135deg, ${firstColor.text}90, ${secondColor.text}90)`,
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
      }}
    />
  ) : null;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      className="cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={() => setFlipped((f) => !f)}
    >
      <div
        className="relative w-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ── Front ─────────────────────────────────── */}
        <div
          className="relative rounded-2xl bg-[#111111] overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            border: hasGradientBorder ? "1px solid transparent" : `1px solid ${firstColor.text}80`,
            ...(isCoreTeam ? { boxShadow: `0 0 15px ${firstColor.text}25, 0 0 30px ${firstColor.text}12` } : {}),
          }}
        >
          {gradientBorderOverlay}
          {/* Avatar */}
          <div className="relative aspect-[4/5] bg-[#0a0a0a] overflow-hidden">
            <img
              src={member.avatar}
              alt={member.name}
              className="w-full h-full object-cover"
            />

            {/* Social link */}
            {member.twitter && (
              <a
                href={member.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 z-10 w-8 h-8 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/80 transition-all duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            )}
          </div>

          {/* Info */}
          <div className="px-4 py-4 text-center">
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">
              {member.name}
            </h3>
            <p className="text-xs text-[#666] mt-0.5 font-medium uppercase tracking-wider min-h-[1.25rem]">
              {member.title || "\u00A0"}
            </p>
            <div
              className="flex justify-center flex-wrap gap-1.5 mt-2"
              onClick={(e) => e.stopPropagation()}
            >
              {visible.map((skill) => {
                const sc = getSkillColor(skill);
                return (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide"
                    style={{
                      backgroundColor: sc.bg,
                      color: sc.text,
                      border: `1px solid ${sc.border}`,
                    }}
                  >
                    {skill}
                  </span>
                );
              })}
              {remaining > 0 && (
                <span
                  className="relative"
                  onMouseEnter={() => setPillHover(true)}
                  onMouseLeave={() => setPillHover(false)}
                >
                  <span
                    className="relative inline-flex px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide overflow-hidden cursor-default"
                    style={{
                      background: `linear-gradient(135deg, ${firstColor.bg}, ${secondColor.bg})`,
                      color: "#999",
                    }}
                  >
                    <span
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{
                        padding: "1px",
                        background: `linear-gradient(135deg, ${firstColor.border}, ${secondColor.border})`,
                        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        WebkitMaskComposite: "xor",
                        maskComposite: "exclude",
                      }}
                    />
                    +{remaining}
                  </span>
                  {pillHover && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30">
                      <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-[#1a1a1a] border border-[#333] shadow-xl shadow-black/60 min-w-max">
                        {sorted.slice(2).map((skill) => {
                          const sc = getSkillColor(skill);
                          return (
                            <span
                              key={skill}
                              className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide whitespace-nowrap"
                              style={{
                                backgroundColor: sc.bg,
                                color: sc.text,
                                border: `1px solid ${sc.border}`,
                              }}
                            >
                              {skill}
                            </span>
                          );
                        })}
                      </div>
                      <div
                        className="w-2 h-2 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1 border-r border-b border-[#333]"
                        style={{ backgroundColor: "#1a1a1a" }}
                      />
                    </div>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Back ──────────────────────────────────── */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col"
          style={{
            backfaceVisibility: "hidden",
            border: hasGradientBorder ? "1px solid transparent" : `1px solid ${firstColor.text}80`,
            ...(isCoreTeam ? { boxShadow: `0 0 15px ${firstColor.text}25, 0 0 30px ${firstColor.text}12` } : {}),
            transform: "rotateY(180deg)",
            background: `linear-gradient(160deg, ${firstColor.bg} 0%, ${secondColor.bg} 35%, #111111 65%, #111111 100%)`,
          }}
        >
          {gradientBorderOverlay}
          {/* Top accent line */}
          <div className="h-1 shrink-0" style={{ background: `linear-gradient(to right, ${firstColor.text}, ${secondColor.text})` }} />

          <div className="flex-1 flex flex-col p-5 min-h-0">
            {/* Avatar + name */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2"
                style={{ borderColor: firstColor.border }}
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white tracking-wide uppercase truncate">
                  {member.name}
                </h3>
                <p className="text-xs font-medium truncate" style={{ color: firstColor.text }}>
                  {member.title}
                </p>
              </div>
            </div>

            {/* Bio */}
            <div
              className="text-xs text-[#999] leading-relaxed mb-4 line-clamp-3 [&_h1]:text-sm [&_h1]:font-bold [&_h1]:text-white [&_h2]:text-sm [&_h2]:font-bold [&_h2]:text-white [&_h3]:text-xs [&_h3]:font-bold [&_h3]:text-white [&_em]:italic [&_strong]:font-bold [&_strong]:text-white [&_a]:text-[#9945ff] [&_a]:underline [&_p]:mb-1"
              dangerouslySetInnerHTML={{ __html: marked.parse(member.bio || "", { async: false }) as string }}
            />

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {sorted.map((skill) => {
                const sc = getSkillColor(skill);
                return (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide"
                    style={{
                      backgroundColor: sc.bg,
                      color: sc.text,
                      border: `1px solid ${sc.border}`,
                    }}
                  >
                    {skill}
                  </span>
                );
              })}
            </div>

            {/* Social link */}
            {member.twitter && (
              <div className="mt-4 pt-3 border-t border-[#ffffff10]">
                <a
                  href={member.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-[#888] hover:text-white transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  @{member.twitter.replace(/https?:\/\/(x|twitter)\.com\//, "")}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── page ─────────────────────────────────────────── */

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("members")
      .select("*")
      .order("display_order")
      .then(({ data }) => {
        if (data) setMembers((data as DBMember[]).map(mapDBMember));
      });
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = useMemo(() => {
    let result = members;

    if (activeFilter !== "All") {
      result = result.filter(
        (m: Member) => m.primaryRole === activeFilter || m.secondaryRole === activeFilter || m.skills.includes(activeFilter)
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m: Member) =>
          m.name.toLowerCase().includes(q) ||
          m.title.toLowerCase().includes(q) ||
          m.company.toLowerCase().includes(q) ||
          m.skills.some((s: string) => s.toLowerCase().includes(q))
      );
    }

    return result;
  }, [members, search, activeFilter]);

  return (
    <div className="bg-black min-h-screen">
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
              href="/#cta"
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

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 pt-28 pb-24">
        {/* Title */}
        <div className="mb-10">
          <h1
            className={`text-white font-black tracking-tight leading-[1.08] ${archivo.className}`}
            style={{ fontSize: "clamp(2rem, 1.5rem + 2.5vw, 3.25rem)" }}
          >
            Our Members
          </h1>
          <p
            className="mt-3 text-[#a1a1aa] leading-relaxed max-w-xl"
            style={{ fontSize: "clamp(0.875rem, 0.8rem + 0.25vw, 1.05rem)" }}
          >
            Talented builders, designers, and creators shaping Malaysia&rsquo;s Web3
            landscape.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="mb-10 space-y-5">
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" />
            <input
              type="text"
              placeholder="Search by name, role, company, or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#111] border border-[#222] text-sm text-white placeholder-[#555] outline-none focus:border-[#9945ff]/50 transition-colors"
            />
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            {SKILL_FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              const color = SKILL_COLORS[filter];
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200"
                  style={
                    isActive
                      ? { backgroundColor: color.text, color: "#111" }
                      : {
                          backgroundColor: "transparent",
                          color: color.text,
                          border: `1px solid ${color.border}`,
                        }
                  }
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-xs text-[#555] font-medium">
            {filtered.length} member{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Members grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeFilter}-${search}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#111] border border-[#222] flex items-center justify-center mb-4">
                  <Search size={24} className="text-[#444]" />
                </div>
                <p className="text-sm text-[#666]">No members found</p>
                <p className="text-xs text-[#444] mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
                {filtered.map((member: Member, i: number) => (
                  <MemberCard key={member.name} member={member} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
