import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Archivo } from "next/font/google";
import { Code2, Palette, Users, Shield, Star, ExternalLink } from "lucide-react";

const archivo = Archivo({ subsets: ["latin"], weight: ["900"], display: "swap" });

/* ── types ─────────────────────────────────────────── */

type MemberRole = "developer" | "designer" | "community" | "core";

interface GridMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  role: MemberRole;
  stars: 1 | 2 | 3;
  avatar_url: string;
  twitter_handle: string;
  skills: string[];
}

/* ── role config ───────────────────────────────────── */

const ROLE_CONFIG: Record<MemberRole, { label: string; icon: typeof Code2; color: string; border: string; bg: string }> = {
  developer: { label: "Developer", icon: Code2, color: "#14F195", border: "border-[#14F195]/40", bg: "bg-[#14F195]/10" },
  designer: { label: "Designer", icon: Palette, color: "#f472b6", border: "border-pink-400/40", bg: "bg-pink-400/10" },
  community: { label: "Community", icon: Users, color: "#60a5fa", border: "border-blue-400/40", bg: "bg-blue-400/10" },
  core: { label: "Core Team", icon: Shield, color: "#dea54b", border: "border-amber-500/40", bg: "bg-amber-500/10" },
};

/* ── mock data ─────────────────────────────────────── */

const MEMBERS: GridMember[] = [
  { id: "1", name: "Ahmad Rizal", title: "Full-Stack Developer", bio: "Building on Solana since 2022. Core contributor to multiple DeFi protocols and hackathon mentor.", role: "developer", stars: 3, avatar_url: "", twitter_handle: "ahmadrizal", skills: ["Rust", "TypeScript", "DeFi"] },
  { id: "2", name: "Siti Nurhaliza", title: "UI/UX Designer", bio: "Designing intuitive Web3 experiences. Previously at a top fintech startup in KL.", role: "designer", stars: 3, avatar_url: "", twitter_handle: "sitinur_design", skills: ["Figma", "UI/UX", "Branding"] },
  { id: "3", name: "Wei Chen", title: "Rust Engineer", bio: "Solana program developer. Hackathon winner. Open source contributor to Anchor framework.", role: "core", stars: 3, avatar_url: "", twitter_handle: "weichen_sol", skills: ["Rust", "Anchor", "Security"] },
  { id: "4", name: "Priya Sharma", title: "Community Lead", bio: "Growing the Solana community in Malaysia. Events organizer and content creator.", role: "community", stars: 3, avatar_url: "", twitter_handle: "priya_sol", skills: ["Events", "Content", "Growth"] },
  { id: "5", name: "Farid Hassan", title: "DeFi Researcher", bio: "Exploring decentralized finance protocols. Writing about Solana DeFi ecosystem.", role: "developer", stars: 2, avatar_url: "", twitter_handle: "farid_defi", skills: ["DeFi", "Research", "Writing"] },
  { id: "6", name: "Mei Ling Tan", title: "Frontend Developer", bio: "React & Next.js specialist. Building beautiful Web3 interfaces and dApps.", role: "developer", stars: 2, avatar_url: "", twitter_handle: "meiling_dev", skills: ["React", "Next.js", "Web3"] },
  { id: "7", name: "Kamal Ibrahim", title: "Smart Contract Dev", bio: "Anchor framework enthusiast. Building secure programs on Solana mainnet.", role: "developer", stars: 3, avatar_url: "", twitter_handle: "kamal_anchor", skills: ["Rust", "Anchor", "Solana"] },
  { id: "8", name: "Nurul Aisyah", title: "Product Designer", bio: "Creating delightful user experiences for DeFi products and NFT platforms.", role: "designer", stars: 2, avatar_url: "", twitter_handle: "nurul_px", skills: ["Product", "UI/UX", "Figma"] },
  { id: "9", name: "Raj Patel", title: "Backend Engineer", bio: "Building scalable infrastructure for Solana dApps. Previously at Grab.", role: "developer", stars: 2, avatar_url: "", twitter_handle: "raj_backend", skills: ["Node.js", "Infra", "APIs"] },
  { id: "10", name: "Lim Jia Wen", title: "Growth Lead", bio: "Helping Solana projects reach Malaysian audiences through strategic campaigns.", role: "community", stars: 2, avatar_url: "", twitter_handle: "jiawen_growth", skills: ["Marketing", "Growth", "Strategy"] },
  { id: "11", name: "Aisha Rahman", title: "Content Creator", bio: "Creating educational content about Solana ecosystem in Bahasa Malaysia.", role: "community", stars: 2, avatar_url: "", twitter_handle: "aisha_web3", skills: ["Content", "Education", "Social"] },
  { id: "12", name: "Daniel Tan", title: "Protocol Engineer", bio: "Working on cross-chain bridges and MEV solutions on Solana.", role: "core", stars: 3, avatar_url: "", twitter_handle: "dtan_crypto", skills: ["Rust", "Bridges", "MEV"] },
  { id: "13", name: "Hafiz Zain", title: "Mobile Developer", bio: "Building Solana mobile experiences with React Native and Expo.", role: "developer", stars: 1, avatar_url: "", twitter_handle: "hafiz_mobile", skills: ["React Native", "Mobile", "Web3"] },
  { id: "14", name: "Chloe Wong", title: "Brand Designer", bio: "Crafting visual identities for Web3 startups. Logo, branding, and illustration.", role: "designer", stars: 2, avatar_url: "", twitter_handle: "chloe_brand", skills: ["Branding", "Illustration", "Design"] },
  { id: "15", name: "Arjun Singh", title: "DevRel Engineer", bio: "Developer relations and technical writing. Making Solana accessible to all.", role: "core", stars: 2, avatar_url: "", twitter_handle: "arjun_devrel", skills: ["DevRel", "Docs", "Community"] },
  { id: "16", name: "Tan Mei Xin", title: "NFT Artist", bio: "Generative art and NFT collections on Solana. Exploring digital art frontiers.", role: "designer", stars: 1, avatar_url: "", twitter_handle: "meixinart", skills: ["NFT", "Art", "Generative"] },
  { id: "17", name: "Yusuf Ali", title: "Security Researcher", bio: "Auditing Solana programs. Helping projects ship secure smart contracts.", role: "developer", stars: 3, avatar_url: "", twitter_handle: "yusuf_sec", skills: ["Security", "Audit", "Rust"] },
  { id: "18", name: "Kim Soo-jin", title: "Data Analyst", bio: "On-chain analytics and dashboards for Solana DeFi protocols.", role: "developer", stars: 1, avatar_url: "", twitter_handle: "soojin_data", skills: ["Analytics", "Python", "Data"] },
  { id: "19", name: "Zara Ismail", title: "Event Coordinator", bio: "Organizing hackathons and meetups across Malaysia for the Solana community.", role: "community", stars: 2, avatar_url: "", twitter_handle: "zara_events", skills: ["Events", "Logistics", "Community"] },
  { id: "20", name: "Marcus Lee", title: "Fullstack Engineer", bio: "Building end-to-end dApps with Next.js and Anchor. Shipped 5 projects.", role: "developer", stars: 2, avatar_url: "", twitter_handle: "marcus_dev", skills: ["Fullstack", "Next.js", "Anchor"] },
  { id: "21", name: "Anita Krishnan", title: "Technical Writer", bio: "Documentation and tutorials for Solana developers. Clear, concise guides.", role: "community", stars: 1, avatar_url: "", twitter_handle: "anita_writes", skills: ["Docs", "Tutorials", "Education"] },
  { id: "22", name: "Jason Ng", title: "Trading Bot Dev", bio: "Building automated trading systems on Jupiter and Raydium.", role: "developer", stars: 2, avatar_url: "", twitter_handle: "jason_bot", skills: ["Bots", "DeFi", "TypeScript"] },
  { id: "23", name: "Fatimah Zahra", title: "Motion Designer", bio: "Creating animations and motion graphics for Solana ecosystem projects.", role: "designer", stars: 1, avatar_url: "", twitter_handle: "fatimah_motion", skills: ["Motion", "After Effects", "3D"] },
  { id: "24", name: "Ryan Loh", title: "Blockchain Engineer", bio: "Validator operations and infrastructure. Running Solana validators since genesis.", role: "core", stars: 3, avatar_url: "", twitter_handle: "ryan_validator", skills: ["Validator", "Infra", "DevOps"] },
  { id: "25", name: "Shen Wei", title: "Frontend Dev", bio: "Specializing in wallet integrations and Solana Pay implementations.", role: "developer", stars: 1, avatar_url: "", twitter_handle: "shenwei_fe", skills: ["React", "Wallet", "Solana Pay"] },
  { id: "26", name: "Amira Yusof", title: "UX Researcher", bio: "User research for Web3 products. Making crypto intuitive for everyone.", role: "designer", stars: 2, avatar_url: "", twitter_handle: "amira_ux", skills: ["UX Research", "Testing", "Design"] },
  { id: "27", name: "Vincent Chow", title: "Game Developer", bio: "Building on-chain games with Solana. Unity and Unreal Engine integration.", role: "developer", stars: 1, avatar_url: "", twitter_handle: "vince_gamedev", skills: ["Gaming", "Unity", "Solana"] },
  { id: "28", name: "Nadia Samad", title: "Social Media Lead", bio: "Managing Superteam Malaysia's social presence and community engagement.", role: "community", stars: 2, avatar_url: "", twitter_handle: "nadia_social", skills: ["Social", "Content", "Strategy"] },
  { id: "29", name: "Adam Khalid", title: "Rust Developer", bio: "Contributing to Solana core libraries. Systems programming enthusiast.", role: "developer", stars: 3, avatar_url: "", twitter_handle: "adam_rust", skills: ["Rust", "Systems", "Open Source"] },
  { id: "30", name: "Grace Teo", title: "Graphic Designer", bio: "Visual design for Web3 brands. From logos to landing pages.", role: "designer", stars: 1, avatar_url: "", twitter_handle: "grace_design", skills: ["Graphics", "Branding", "Web"] },
  { id: "31", name: "Imran Shah", title: "QA Engineer", bio: "Testing Solana dApps end-to-end. Automated testing frameworks for Web3.", role: "developer", stars: 1, avatar_url: "", twitter_handle: "imran_qa", skills: ["Testing", "QA", "Automation"] },
  { id: "32", name: "Hannah Lim", title: "Partnership Lead", bio: "Building strategic partnerships between Solana projects and Malaysian companies.", role: "core", stars: 2, avatar_url: "", twitter_handle: "hannah_biz", skills: ["Partnerships", "BD", "Strategy"] },
  { id: "33", name: "Ravi Kumar", title: "ML Engineer", bio: "Applying machine learning to on-chain data analysis on Solana.", role: "developer", stars: 1, avatar_url: "", twitter_handle: "ravi_ml", skills: ["ML", "Python", "Data"] },
  { id: "34", name: "Syafiqah Aziz", title: "Illustrator", bio: "Creating unique illustrations and visual assets for NFT collections.", role: "designer", stars: 1, avatar_url: "", twitter_handle: "syafiqah_art", skills: ["Illustration", "NFT", "Art"] },
  { id: "35", name: "Tommy Ooi", title: "Cloud Architect", bio: "Designing cloud infrastructure for Solana RPC nodes and indexers.", role: "developer", stars: 2, avatar_url: "", twitter_handle: "tommy_cloud", skills: ["AWS", "DevOps", "Infra"] },
  { id: "36", name: "Rina Matsuda", title: "Community Mod", bio: "Moderating community channels and helping newcomers get started.", role: "community", stars: 1, avatar_url: "", twitter_handle: "rina_mod", skills: ["Moderation", "Support", "Community"] },
  { id: "37", name: "Kelvin Yeoh", title: "Solidity & Rust Dev", bio: "Cross-chain developer. Porting EVM projects to Solana via Neon.", role: "developer", stars: 2, avatar_url: "", twitter_handle: "kelvin_xchain", skills: ["Solidity", "Rust", "Cross-chain"] },
  { id: "38", name: "Dewi Putri", title: "Video Producer", bio: "Creating video content and tutorials for the Solana ecosystem.", role: "community", stars: 1, avatar_url: "", twitter_handle: "dewi_video", skills: ["Video", "YouTube", "Editing"] },
  { id: "39", name: "Alex Fong", title: "Tokenomics Designer", bio: "Designing sustainable token economics for Solana projects.", role: "developer", stars: 2, avatar_url: "", twitter_handle: "alex_tokens", skills: ["Tokenomics", "Economics", "DeFi"] },
  { id: "40", name: "Suraya Idris", title: "Operations Lead", bio: "Managing day-to-day operations of Superteam Malaysia chapter.", role: "core", stars: 3, avatar_url: "", twitter_handle: "suraya_ops", skills: ["Operations", "Management", "Strategy"] },
  { id: "41", name: "Ben Tay", title: "SDK Developer", bio: "Building developer tools and SDKs for the Solana ecosystem.", role: "developer", stars: 2, avatar_url: "", twitter_handle: "ben_sdk", skills: ["SDK", "TypeScript", "Tools"] },
  { id: "42", name: "Nur Hidayah", title: "3D Artist", bio: "Creating 3D assets and metaverse experiences on Solana.", role: "designer", stars: 1, avatar_url: "", twitter_handle: "hidayah_3d", skills: ["3D", "Blender", "Metaverse"] },
  { id: "43", name: "Chris Kok", title: "DApp Developer", bio: "Shipping production dApps on Solana. Focus on lending protocols.", role: "developer", stars: 1, avatar_url: "", twitter_handle: "chris_dapp", skills: ["DApp", "Lending", "React"] },
  { id: "44", name: "Maya Abdullah", title: "PR & Comms", bio: "Public relations and communications for Superteam Malaysia.", role: "community", stars: 1, avatar_url: "", twitter_handle: "maya_pr", skills: ["PR", "Comms", "Media"] },
  { id: "45", name: "Derek Liew", title: "Platform Engineer", bio: "Building the Superteam Malaysia platform. Infra and tooling.", role: "core", stars: 3, avatar_url: "", twitter_handle: "derekliew", skills: ["Platform", "Infra", "Next.js"] },
  { id: "46", name: "Jing Yuan", title: "Full-Stack Dev", bio: "Shipping Web3 products end-to-end. React, Solana, and everything in between.", role: "developer", stars: 3, avatar_url: "", twitter_handle: "jingyuan", skills: ["Fullstack", "React", "Solana"] },
  { id: "47", name: "Li Xin", title: "Data Engineer", bio: "Building data pipelines for Solana on-chain analytics.", role: "developer", stars: 1, avatar_url: "", twitter_handle: "lixin_data", skills: ["Data", "Pipeline", "Analytics"] },
  { id: "48", name: "Faris Azman", title: "Podcast Host", bio: "Hosting the Solana Malaysia podcast. Interviewing builders weekly.", role: "community", stars: 1, avatar_url: "", twitter_handle: "faris_pod", skills: ["Podcast", "Content", "Interviews"] },
];

/* ── helpers ────────────────────────────────────────── */

const ease = [0.25, 1, 0.5, 1] as const;

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function getRoleColor(role: MemberRole) {
  return ROLE_CONFIG[role].color;
}

function getStarColor(stars: number) {
  if (stars === 3) return "#dea54b";
  if (stars === 2) return "#a0a0a0";
  return "#6b5b3e";
}

/* ── page ──────────────────────────────────────────── */

export default function MembersPage() {
  const [selectedId, setSelectedId] = useState<string | null>("3");
  const [roleFilter, setRoleFilter] = useState<MemberRole | null>(null);
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const filtered = useMemo(() => {
    let result = MEMBERS;
    if (roleFilter) result = result.filter((m) => m.role === roleFilter);
    if (starFilter) result = result.filter((m) => m.stars === starFilter);
    return result;
  }, [roleFilter, starFilter]);

  const selected = MEMBERS.find((m) => m.id === selectedId) || null;
  const roleConf = selected ? ROLE_CONFIG[selected.role] : null;

  return (
    <div className="bg-black min-h-screen">
      {/* Navigation */}
      <header className="fixed left-0 right-0 z-50 top-0 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo/stmy.svg" alt="Superteam" className="h-7 w-7 object-contain" />
            <span className={`text-white font-black text-xl tracking-tight ${archivo.className}`}>
              superteam<sup className="text-[0.5em] align-super">MY</sup>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/" className="px-3 py-1.5 text-xs font-semibold tracking-wider text-white/70 hover:text-white transition-colors">
              HOME
            </Link>
            <Link href="/members" className="px-3 py-1.5 text-xs font-semibold tracking-wider text-white transition-colors">
              MEMBERS
            </Link>
          </nav>

          <a
            href="https://t.me/SuperteamMY"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold tracking-wider px-5 py-2 rounded-full bg-[#9945ff] text-white hover:bg-[#8a3ae6] transition-colors"
          >
            JOIN US
          </a>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-16">
        <div
          className="min-h-[calc(100dvh-64px)] px-4 sm:px-6 py-6 sm:py-8"
          style={{
            backgroundColor: "#0a0a0a",
            backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          <div className="max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1
                className="text-white font-semibold tracking-tight leading-[1.08]"
                style={{ fontSize: "clamp(1.5rem, 1rem + 2vw, 2.25rem)" }}
              >
                Member Roster
              </h1>
              <p className="mt-2 text-[#a1a1aa] text-sm">
                {filtered.length} hunter{filtered.length !== 1 ? "s" : ""} registered
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {/* Role filters */}
              {(Object.keys(ROLE_CONFIG) as MemberRole[]).map((role) => {
                const conf = ROLE_CONFIG[role];
                const Icon = conf.icon;
                const isActive = roleFilter === role;
                return (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(isActive ? null : role)}
                    className={`group relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-200 border ${
                      isActive
                        ? `${conf.bg} ${conf.border} text-white`
                        : "bg-[#ffffff06] border-white/[0.08] text-[#666] hover:border-white/20 hover:text-white"
                    }`}
                    title={conf.label}
                  >
                    <Icon size={14} style={isActive ? { color: conf.color } : undefined} />
                    <span className="hidden sm:inline">{conf.label}</span>
                  </button>
                );
              })}

              {/* Divider */}
              <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />

              {/* Star filters */}
              {[1, 2, 3].map((s) => {
                const isActive = starFilter === s;
                return (
                  <button
                    key={s}
                    onClick={() => setStarFilter(isActive ? null : s)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 border ${
                      isActive
                        ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                        : "bg-[#ffffff06] border-white/[0.08] text-[#666] hover:border-white/20 hover:text-white"
                    }`}
                    title={`${s} star${s !== 1 ? "s" : ""}`}
                  >
                    {Array.from({ length: s }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={isActive ? "#dea54b" : "transparent"}
                        stroke={isActive ? "#dea54b" : "currentColor"}
                      />
                    ))}
                  </button>
                );
              })}

              {/* Reset */}
              {(roleFilter || starFilter) && (
                <button
                  onClick={() => { setRoleFilter(null); setStarFilter(null); }}
                  className="px-3 py-2 rounded-lg text-xs font-semibold text-[#666] hover:text-white border border-transparent hover:border-white/20 transition-all"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Grid + Detail layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
              {/* Left — Member grid */}
              <div
                className="rounded-2xl border border-[#262626] bg-[#111111] p-3 sm:p-4 overflow-hidden"
                style={{
                  boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1.5 sm:gap-2">
                  <AnimatePresence>
                    {filtered.map((member, i) => {
                      const isSelected = selectedId === member.id;
                      const roleColor = getRoleColor(member.role);
                      return (
                        <motion.button
                          key={member.id}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.25, ease, delay: Math.min(i * 0.015, 0.3) }}
                          onClick={() => setSelectedId(member.id)}
                          className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-200 group ${
                            isSelected
                              ? "ring-2 ring-offset-1 ring-offset-[#111111] z-10"
                              : "hover:ring-1 hover:ring-white/30"
                          }`}
                          style={isSelected ? { ["--tw-ring-color" as string]: roleColor, boxShadow: `0 0 12px ${roleColor}40` } : undefined}
                          title={member.name}
                        >
                          {/* Avatar / Initials */}
                          <div
                            className="w-full h-full flex items-center justify-center text-[10px] sm:text-xs font-bold font-mono transition-all duration-200"
                            style={{
                              backgroundColor: isSelected ? `${roleColor}25` : "#1a1a1a",
                              color: isSelected ? roleColor : "#555",
                              border: `1px solid ${isSelected ? `${roleColor}60` : "#2a2a2a"}`,
                              borderRadius: "8px",
                            }}
                          >
                            {member.avatar_url ? (
                              <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="group-hover:text-white transition-colors">
                                {getInitials(member.name)}
                              </span>
                            )}
                          </div>

                          {/* Star indicator */}
                          <div className="absolute bottom-0.5 right-0.5 flex gap-px">
                            {Array.from({ length: member.stars }).map((_, si) => (
                              <Star key={si} size={6} fill={getStarColor(member.stars)} stroke="none" />
                            ))}
                          </div>

                          {/* Role dot */}
                          <div
                            className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: roleColor }}
                          />
                        </motion.button>
                      );
                    })}
                  </AnimatePresence>

                  {/* Empty slots to fill the grid */}
                  {filtered.length === 0 && (
                    <div className="col-span-full flex items-center justify-center py-20">
                      <p className="text-[#555] text-sm font-mono">No members match your filters.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right — Detail card */}
              <div className="lg:sticky lg:top-[88px] lg:self-start">
                <AnimatePresence mode="wait">
                  {selected ? (
                    <motion.div
                      key={selected.id}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.25, ease }}
                      className="rounded-2xl border overflow-hidden"
                      style={{
                        borderColor: `${getRoleColor(selected.role)}30`,
                        background: "linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(15,15,15,0.98) 100%)",
                        boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 40px ${getRoleColor(selected.role)}08`,
                      }}
                    >
                      {/* Card header with role banner */}
                      <div
                        className="px-5 py-3 flex items-center justify-between"
                        style={{ borderBottom: `1px solid ${getRoleColor(selected.role)}20` }}
                      >
                        <div className="flex items-center gap-2">
                          {roleConf && (
                            <>
                              <roleConf.icon size={14} style={{ color: roleConf.color }} />
                              <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: roleConf.color }}>
                                {roleConf.label}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: selected.stars }).map((_, i) => (
                            <Star key={i} size={14} fill={getStarColor(selected.stars)} stroke="none" />
                          ))}
                          {Array.from({ length: 3 - selected.stars }).map((_, i) => (
                            <Star key={i} size={14} fill="none" stroke="#333" strokeWidth={1.5} />
                          ))}
                        </div>
                      </div>

                      {/* Avatar area */}
                      <div className="px-5 pt-6 pb-4 flex items-start gap-5">
                        <div
                          className="w-24 h-24 shrink-0 rounded-xl flex items-center justify-center overflow-hidden"
                          style={{
                            border: `2px solid ${getRoleColor(selected.role)}40`,
                            backgroundColor: `${getRoleColor(selected.role)}10`,
                          }}
                        >
                          {selected.avatar_url ? (
                            <img src={selected.avatar_url} alt={selected.name} className="w-full h-full object-cover" />
                          ) : (
                            <span
                              className="text-2xl font-bold font-mono"
                              style={{ color: getRoleColor(selected.role) }}
                            >
                              {getInitials(selected.name)}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h2 className="text-white font-semibold text-lg tracking-tight leading-tight">
                            {selected.name}
                          </h2>
                          <p className="text-[#888] text-sm mt-0.5">{selected.title}</p>

                          {selected.twitter_handle && (
                            <a
                              href={`https://x.com/${selected.twitter_handle}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 mt-2 text-xs text-[#666] hover:text-white transition-colors"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                              </svg>
                              @{selected.twitter_handle}
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Bio */}
                      <div className="px-5 pb-4">
                        <p className="text-sm text-[#a1a1aa] leading-relaxed">
                          {selected.bio}
                        </p>
                      </div>

                      {/* Skills */}
                      <div className="px-5 pb-5">
                        <p className="text-[10px] font-semibold tracking-widest uppercase text-[#555] mb-2">
                          Skills
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {selected.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-1 rounded text-[11px] font-medium"
                              style={{
                                backgroundColor: `${getRoleColor(selected.role)}12`,
                                color: getRoleColor(selected.role),
                                border: `1px solid ${getRoleColor(selected.role)}25`,
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Obtainable Materials style stats */}
                      <div
                        className="mx-5 mb-5 rounded-xl p-4"
                        style={{
                          backgroundColor: "#0a0a0a",
                          border: "1px solid #1a1a1a",
                        }}
                      >
                        <p className="text-[10px] font-semibold tracking-widest uppercase text-[#555] mb-3">
                          Contributions
                        </p>
                        <div className="space-y-2">
                          {[
                            { label: "Events Attended", freq: selected.stars >= 2 ? 4 : 2 },
                            { label: "Bounties Completed", freq: selected.stars >= 3 ? 5 : selected.stars >= 2 ? 3 : 1 },
                            { label: "Projects Shipped", freq: selected.stars >= 3 ? 4 : selected.stars >= 2 ? 2 : 1 },
                          ].map((stat) => (
                            <div key={stat.label} className="flex items-center justify-between">
                              <span className="text-xs text-[#888]">{stat.label}</span>
                              <div className="flex gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    size={10}
                                    fill={i < stat.freq ? "#dea54b" : "transparent"}
                                    stroke={i < stat.freq ? "#dea54b" : "#333"}
                                    strokeWidth={1.5}
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="rounded-2xl border border-[#262626] bg-[#111] p-8 flex flex-col items-center justify-center min-h-[300px]"
                    >
                      <Users size={32} className="text-[#333] mb-3" />
                      <p className="text-sm text-[#555] text-center">
                        Select a member from the grid
                        <br />
                        to view their profile
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
