import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Archivo } from "next/font/google";
import { Search } from "lucide-react";

const archivo = Archivo({ subsets: ["latin"], weight: ["900"], display: "swap" });

const NAV_ITEMS = [
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
  "Rust",
  "Core Team",
  "Frontend",
  "Design",
  "Content",
  "Growth",
  "Product",
  "Community",
] as const;

/* ── mock members ────────────────────────────────── */

const MEMBERS: Member[] = [
  { name: "Aiman Rizq", title: "Full-Stack Developer", company: "Superteam MY", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=aiman", primaryRole: "Core Team", secondaryRole: "Rust", skills: ["Core Team", "Rust", "Frontend"], twitter: "https://x.com/", bio: "Building DeFi protocols on Solana since 2022. Passionate about open-source and decentralized systems." },
  { name: "Mei Lin", title: "Smart Contract Engineer", company: "Helius", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=meilin", primaryRole: "Rust", secondaryRole: "Product", skills: ["Rust", "Product"], twitter: "https://x.com/", bio: "Security-focused smart contract developer specializing in Anchor programs." },
  { name: "Raj Kumar", title: "Frontend Engineer", company: "Jupiter", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=raj", primaryRole: "Frontend", secondaryRole: "Design", skills: ["Frontend", "Design"], twitter: "https://x.com/", bio: "Crafting beautiful Web3 user experiences with React and Tailwind." },
  { name: "Siti Nurha", title: "Product Designer", company: "Phantom", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=siti", primaryRole: "Design", secondaryRole: "Product", skills: ["Design", "Product"], twitter: "https://x.com/", bio: "Designing intuitive interfaces for DeFi products used by millions." },
  { name: "Wei Jie", title: "Protocol Engineer", company: "Jito", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=weijie", primaryRole: "Rust", secondaryRole: "Product", skills: ["Rust", "Product"], twitter: "https://x.com/", bio: "Low-level protocol optimization and MEV research on Solana." },
  { name: "Priya Devi", title: "DevRel Engineer", company: "Solana Foundation", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=priya", primaryRole: "Community", secondaryRole: "Content", skills: ["Community", "Content", "Growth"], twitter: "https://x.com/", bio: "Bridging developers and the Solana ecosystem through education." },
  { name: "Hafiz Azman", title: "Backend Developer", company: "Drift", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=hafiz", primaryRole: "Rust", secondaryRole: "Frontend", skills: ["Rust", "Frontend"], twitter: "https://x.com/", bio: "Infrastructure and indexing for on-chain data at scale." },
  { name: "Yuki Tan", title: "Mobile Developer", company: "Backpack", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=yuki", primaryRole: "Frontend", secondaryRole: "Product", skills: ["Frontend", "Product"], twitter: "https://x.com/", bio: "Building mobile-first Solana wallets and dApps." },
  { name: "Arjun Singh", title: "Data Scientist", company: "Pyth Network", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=arjun", primaryRole: "Product", secondaryRole: "Rust", skills: ["Product", "Rust"], bio: "On-chain data analytics and oracle research." },
  { name: "Farah Amin", title: "Community Lead", company: "Superteam MY", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=farah", primaryRole: "Core Team", secondaryRole: "Community", skills: ["Core Team", "Community", "Growth"], twitter: "https://x.com/", bio: "Growing the Superteam MY community and organizing flagship events." },
  { name: "Daniel Lim", title: "Security Researcher", company: "OtterSec", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=daniel", primaryRole: "Rust", skills: ["Rust"], twitter: "https://x.com/", bio: "Finding and fixing vulnerabilities in Solana programs." },
  { name: "Aisyah Rani", title: "Technical Writer", company: "Superteam MY", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=aisyah", primaryRole: "Content", secondaryRole: "Community", skills: ["Content", "Community"], twitter: "https://x.com/", bio: "Making complex Solana concepts accessible to everyone." },
  { name: "Zhen Wei", title: "Game Developer", company: "Star Atlas", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=zhenwei", primaryRole: "Rust", secondaryRole: "Frontend", skills: ["Rust", "Frontend"], twitter: "https://x.com/", bio: "Building on-chain gaming experiences and NFT integrations." },
  { name: "Kavitha Nair", title: "UI Engineer", company: "Tensor", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=kavitha", primaryRole: "Frontend", secondaryRole: "Design", skills: ["Frontend", "Design"], twitter: "https://x.com/", bio: "Creative coding meets blockchain — building interactive NFT experiences." },
  { name: "Adam Hakim", title: "Blockchain Researcher", company: "Anza", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=adam", primaryRole: "Rust", secondaryRole: "Product", skills: ["Rust", "Product"], bio: "Researching zero-knowledge proofs and consensus on Solana." },
  { name: "Li Wen", title: "DeFi Strategist", company: "Marinade", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=liwen", primaryRole: "Product", secondaryRole: "Growth", skills: ["Product", "Growth"], twitter: "https://x.com/", bio: "Designing sustainable DeFi mechanisms and tokenomics." },
  { name: "Nurul Huda", title: "Content Creator", company: "Superteam MY", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=nurul", primaryRole: "Core Team", secondaryRole: "Content", skills: ["Core Team", "Content", "Growth"], twitter: "https://x.com/", bio: "Creating educational Solana content for the Malaysian community." },
  { name: "Cheng Hao", title: "DevOps Engineer", company: "Helius", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=chenghao", primaryRole: "Rust", secondaryRole: "Product", skills: ["Rust", "Product"], twitter: "https://x.com/", bio: "Running validator and RPC infrastructure for the Solana network." },
  { name: "Amira Zainal", title: "Marketing Lead", company: "Superteam MY", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=amira", primaryRole: "Core Team", secondaryRole: "Growth", skills: ["Core Team", "Growth", "Community"], twitter: "https://x.com/", bio: "Scaling Web3 projects through strategic marketing and partnerships." },
  { name: "Rizal Ahmad", title: "Full-Stack Developer", company: "Squads", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=rizal", primaryRole: "Rust", secondaryRole: "Frontend", skills: ["Rust", "Frontend"], twitter: "https://x.com/", bio: "Shipping full-stack dApps from KL to the world." },
];

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

function MemberCard({ member, index }: { member: Member; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const primaryColor = getSkillColor(member.primaryRole);
  const secondaryColor = member.secondaryRole ? getSkillColor(member.secondaryRole) : primaryColor;
  const isCoreTeam = member.skills.includes("Core Team");

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
          className={`relative rounded-2xl bg-[#111111] overflow-hidden ${isCoreTeam ? "border border-[#F2CD5D]/40" : "border border-[#1f1f1f]"}`}
          style={{
            backfaceVisibility: "hidden",
            ...(isCoreTeam ? { boxShadow: "0 0 15px rgba(242,205,93,0.15), 0 0 30px rgba(242,205,93,0.08)" } : {}),
          }}
        >
          {/* Skill pill */}
          <div className="absolute top-4 left-4 z-10">
            <span
              className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide"
              style={{
                backgroundColor: primaryColor.bg,
                color: primaryColor.text,
                border: `1px solid ${primaryColor.border}`,
              }}
            >
              {member.primaryRole}
            </span>
          </div>

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
          <div className="px-4 py-4">
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">
              {member.name}
            </h3>
            <p className="text-xs text-[#666] mt-0.5 font-medium uppercase tracking-wider">
              {member.company}
            </p>
          </div>
        </div>

        {/* ── Back ──────────────────────────────────── */}
        <div
          className={`absolute inset-0 rounded-2xl overflow-hidden flex flex-col ${isCoreTeam ? "border border-[#F2CD5D]/40" : "border border-[#1f1f1f]"}`}
          style={{
            backfaceVisibility: "hidden",
            ...(isCoreTeam ? { boxShadow: "0 0 15px rgba(242,205,93,0.15), 0 0 30px rgba(242,205,93,0.08)" } : {}),
            transform: "rotateY(180deg)",
            background: `linear-gradient(160deg, ${primaryColor.bg} 0%, ${secondaryColor.bg} 35%, #111111 65%, #111111 100%)`,
          }}
        >
          {/* Top accent line */}
          <div className="h-1 shrink-0" style={{ background: `linear-gradient(to right, ${primaryColor.text}, ${secondaryColor.text})` }} />

          <div className="flex-1 flex flex-col p-5 min-h-0">
            {/* Avatar + name */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2"
                style={{ borderColor: primaryColor.border }}
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
                <p className="text-xs font-medium truncate" style={{ color: primaryColor.text }}>
                  {member.title}
                </p>
              </div>
            </div>

            {/* Company */}
            <div className="flex items-center gap-1.5 mb-3">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5" className="shrink-0">
                <path d="M3 21h18M3 7v14m6-14v14m6-14v14m6-14v14M6 7h12l-6-4-6 4z" />
              </svg>
              <span className="text-xs text-[#888]">{member.company}</span>
            </div>

            {/* Bio */}
            <p className="text-xs text-[#999] leading-relaxed mb-4 line-clamp-3">
              {member.bio}
            </p>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {member.skills.map((skill) => {
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
                  Follow on X
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
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filtered = useMemo(() => {
    let result = MEMBERS;

    if (activeFilter !== "All") {
      result = result.filter(
        (m) => m.primaryRole === activeFilter || m.secondaryRole === activeFilter || m.skills.includes(activeFilter)
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.title.toLowerCase().includes(q) ||
          m.company.toLowerCase().includes(q) ||
          m.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    return result;
  }, [search, activeFilter]);

  return (
    <div className="bg-black min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo/stmy.svg" alt="Superteam" className="h-7 w-7 object-contain" />
            <span className={`text-white font-black text-xl tracking-tight ${archivo.className}`}>
              superteam<sup className="text-[0.5em] align-super">MY</sup>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-3 py-1.5 text-xs font-semibold tracking-wider text-white/70 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/#cta"
              className="text-xs font-semibold tracking-wider px-5 py-2 rounded-full bg-[#9945ff] text-white hover:bg-[#8a3ae6] transition-colors"
            >
              JOIN US
            </Link>
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
      <div className="max-w-[1400px] mx-auto px-6 pt-16 pb-24">
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
                {filtered.map((member, i) => (
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
