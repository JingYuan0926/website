import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { getInitials } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import type { Member } from "@/lib/types";

interface MemberSpotlightProps {
  members: Member[];
  content?: Record<string, string>;
  projects?: { name: string; logo: string; link: string }[];
}

/* ── color palette (synced with members page) ──── */

const SKILL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Core Team": { bg: "rgba(242,205,93,0.15)",  text: "#F2CD5D", border: "rgba(242,205,93,0.3)" },
  "Rust":      { bg: "rgba(198,137,174,0.15)", text: "#C689AE", border: "rgba(198,137,174,0.3)" },
  "Frontend":  { bg: "rgba(222,165,75,0.15)",  text: "#DEA54B", border: "rgba(222,165,75,0.3)" },
  "Design":    { bg: "rgba(230,144,104,0.15)", text: "#E69068", border: "rgba(230,144,104,0.3)" },
  "Content":   { bg: "rgba(237,123,132,0.15)", text: "#ED7B84", border: "rgba(237,123,132,0.3)" },
  "Growth":    { bg: "rgba(210,145,146,0.15)", text: "#D29192", border: "rgba(210,145,146,0.3)" },
  "Product":   { bg: "rgba(182,166,159,0.15)", text: "#B6A69F", border: "rgba(182,166,159,0.3)" },
  "Community": { bg: "rgba(127,209,185,0.15)", text: "#7FD1B9", border: "rgba(127,209,185,0.3)" },
};

function getSkillColor(skill: string) {
  return SKILL_COLORS[skill] || SKILL_COLORS["Product"];
}

/* ── canonical member data (synced with members page) */

interface MemberData {
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

const CANONICAL_MEMBERS: MemberData[] = [
  { name: "Aiman Rizq", title: "Full-Stack Developer", company: "Superteam MY", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=aiman", primaryRole: "Core Team", secondaryRole: "Rust", skills: ["Core Team", "Rust", "Frontend"], twitter: "aimanrizq", bio: "Building DeFi protocols on Solana since 2022." },
  { name: "Mei Lin", title: "Smart Contract Engineer", company: "Helius", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=meilin", primaryRole: "Rust", secondaryRole: "Product", skills: ["Rust", "Product"], twitter: "meilin", bio: "Security-focused smart contract developer." },
  { name: "Raj Kumar", title: "Frontend Engineer", company: "Jupiter", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=raj", primaryRole: "Frontend", secondaryRole: "Design", skills: ["Frontend", "Design"], twitter: "rajkumar", bio: "Crafting beautiful Web3 user experiences." },
  { name: "Siti Nurha", title: "Product Designer", company: "Phantom", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=siti", primaryRole: "Design", secondaryRole: "Product", skills: ["Design", "Product"], twitter: "sitinurha", bio: "Designing intuitive interfaces for DeFi products." },
  { name: "Wei Jie", title: "Protocol Engineer", company: "Jito", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=weijie", primaryRole: "Rust", secondaryRole: "Product", skills: ["Rust", "Product"], twitter: "weijie", bio: "Low-level protocol optimization and MEV research." },
  { name: "Priya Devi", title: "DevRel Engineer", company: "Solana Foundation", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=priya", primaryRole: "Community", secondaryRole: "Content", skills: ["Community", "Content", "Growth"], twitter: "priyadevi", bio: "Bridging developers and the Solana ecosystem." },
  { name: "Hafiz Azman", title: "Backend Developer", company: "Drift", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=hafiz", primaryRole: "Rust", secondaryRole: "Frontend", skills: ["Rust", "Frontend"], twitter: "hafizazman", bio: "Infrastructure and indexing for on-chain data." },
  { name: "Yuki Tan", title: "Mobile Developer", company: "Backpack", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=yuki", primaryRole: "Frontend", secondaryRole: "Product", skills: ["Frontend", "Product"], twitter: "yukitan", bio: "Building mobile-first Solana wallets." },
  { name: "Arjun Singh", title: "Data Scientist", company: "Pyth Network", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=arjun", primaryRole: "Product", secondaryRole: "Rust", skills: ["Product", "Rust"], bio: "On-chain data analytics and oracle research." },
  { name: "Farah Amin", title: "Community Lead", company: "Superteam MY", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=farah", primaryRole: "Core Team", secondaryRole: "Community", skills: ["Core Team", "Community", "Growth"], twitter: "farahamin", bio: "Growing the Superteam MY community." },
  { name: "Daniel Lim", title: "Security Researcher", company: "OtterSec", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=daniel", primaryRole: "Rust", skills: ["Rust"], twitter: "daniellim", bio: "Finding and fixing vulnerabilities in Solana programs." },
  { name: "Aisyah Rani", title: "Technical Writer", company: "Superteam MY", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=aisyah", primaryRole: "Content", secondaryRole: "Community", skills: ["Content", "Community"], twitter: "aisyahrani", bio: "Making complex Solana concepts accessible." },
  { name: "Zhen Wei", title: "Game Developer", company: "Star Atlas", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=zhenwei", primaryRole: "Rust", secondaryRole: "Frontend", skills: ["Rust", "Frontend"], twitter: "zhenwei", bio: "Building on-chain gaming experiences." },
  { name: "Kavitha Nair", title: "UI Engineer", company: "Tensor", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=kavitha", primaryRole: "Frontend", secondaryRole: "Design", skills: ["Frontend", "Design"], twitter: "kavithanair", bio: "Creative coding meets blockchain." },
  { name: "Adam Hakim", title: "Blockchain Researcher", company: "Anza", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=adam", primaryRole: "Rust", secondaryRole: "Product", skills: ["Rust", "Product"], bio: "Researching zero-knowledge proofs on Solana." },
  { name: "Li Wen", title: "DeFi Strategist", company: "Marinade", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=liwen", primaryRole: "Product", secondaryRole: "Growth", skills: ["Product", "Growth"], twitter: "liwen", bio: "Designing sustainable DeFi mechanisms." },
  { name: "Nurul Huda", title: "Content Creator", company: "Superteam MY", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=nurul", primaryRole: "Core Team", secondaryRole: "Content", skills: ["Core Team", "Content", "Growth"], twitter: "nurulhuda", bio: "Creating educational Solana content." },
  { name: "Cheng Hao", title: "DevOps Engineer", company: "Helius", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=chenghao", primaryRole: "Rust", secondaryRole: "Product", skills: ["Rust", "Product"], twitter: "chenghao", bio: "Running validator and RPC infrastructure." },
  { name: "Amira Zainal", title: "Marketing Lead", company: "Superteam MY", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=amira", primaryRole: "Core Team", secondaryRole: "Growth", skills: ["Core Team", "Growth", "Community"], twitter: "amirazainal", bio: "Scaling Web3 projects through strategic marketing." },
  { name: "Rizal Ahmad", title: "Full-Stack Developer", company: "Squads", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=rizal", primaryRole: "Rust", secondaryRole: "Frontend", skills: ["Rust", "Frontend"], twitter: "rizalahmad", bio: "Shipping full-stack dApps from KL to the world." },
];

function generateMockMembers(count: number): Member[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `mock-${i}`,
    name: "You?",
    title: "Be the Next Superteam Member",
    bio: "",
    avatar_url: `https://api.dicebear.com/9.x/notionists/svg?seed=mock${i}`,
    skills: [],
    twitter_handle: "",
    github_url: "",
    linkedin_url: "",
    wallet_address: "",
    is_spotlight: false,
    display_order: i,
    created_at: "",
    updated_at: "",
  }));
}

// --- Pixel Solana logo ---
const LOGO_COLS = 12;
const ROWS = 11;
const PAD = 14;
const COLS = LOGO_COLS + PAD * 2;

const SOLANA_SHAPE: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,1,1,1,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1],
  [0,1,1,1,1,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,1,1,1,1,1,1,1,1,1,1],
];

const VPAD = 2;
const TOTAL_ROWS = ROWS + VPAD * 2;

function cellInShape(r: number, c: number): boolean {
  const lr = r - VPAD;
  const lc = c - PAD;
  return lr >= 0 && lr < ROWS && lc >= 0 && lc < LOGO_COLS && SOLANA_SHAPE[lr][lc] === 1;
}

function cellIsOutline(r: number, c: number): boolean {
  if (!cellInShape(r, c)) return false;
  for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
    if (!cellInShape(r + dr, c + dc)) return true;
  }
  return false;
}

const ALL_OUTLINE: [number, number][] = [];
for (let r = 0; r < TOTAL_ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    if (cellIsOutline(r, c)) ALL_OUTLINE.push([r, c]);
  }
}
const OUTLINE_SET = new Set(ALL_OUTLINE.map(([r, c]) => `${r},${c}`));

const CLEAR_ROWS = [0, VPAD + 3, VPAD + 7, TOTAL_ROWS - 1];

// Card center rows (4th row of each 7×7 card)
const RIGHT_CARD_ROW = 4;  // right card rows 1-7, middle
const LEFT_CARD_ROW = 10;  // left card rows 7-13, center = 10
const RIGHT_CARD_COL = 29; // left edge of right card (cols 29-35)
const LEFT_CARD_COL = 9;   // right edge of left card (cols 3-9)

function buildPath(r: number, c: number, cardSide: "left" | "right"): Map<string, number> {
  const path = new Map<string, number>();
  let idx = 0;

  const targetRow = cardSide === "right" ? RIGHT_CARD_ROW : LEFT_CARD_ROW;
  const stopCol = cardSide === "left" ? LEFT_CARD_COL : RIGHT_CARD_COL;
  const logoEdge = cardSide === "left" ? PAD - 2 : PAD + LOGO_COLS + 1;

  // Phase 1: Route horizontally from avatar toward logo edge
  // Check if straight horizontal to logo edge is clear
  let currentRow = r;
  let straightClear = true;
  if (cardSide === "left") {
    for (let col = c - 1; col >= logoEdge; col--) {
      if (OUTLINE_SET.has(`${r},${col}`)) { straightClear = false; break; }
    }
  } else {
    for (let col = c + 1; col <= logoEdge; col++) {
      if (OUTLINE_SET.has(`${r},${col}`)) { straightClear = false; break; }
    }
  }

  if (!straightClear) {
    // Route through nearest clear row to get past logo
    let bestRow = -1;
    let bestDist = Infinity;
    for (const cr of CLEAR_ROWS) {
      const dist = Math.abs(r - cr);
      if (dist >= bestDist) continue;
      let blocked = false;
      const dir = cr > r ? 1 : -1;
      for (let row = r + dir; row !== cr + dir; row += dir) {
        if (OUTLINE_SET.has(`${row},${c}`)) { blocked = true; break; }
      }
      if (!blocked) { bestDist = dist; bestRow = cr; }
    }
    if (bestRow === -1) bestRow = CLEAR_ROWS[0];

    // Vertical to clear row
    if (bestRow < r) {
      for (let row = r - 1; row >= bestRow; row--) path.set(`${row},${c}`, idx++);
    } else if (bestRow > r) {
      for (let row = r + 1; row <= bestRow; row++) path.set(`${row},${c}`, idx++);
    }
    currentRow = bestRow;
  }

  // Horizontal to logo edge
  if (cardSide === "left") {
    for (let col = c - 1; col >= logoEdge; col--) path.set(`${currentRow},${col}`, idx++);
  } else {
    for (let col = c + 1; col <= logoEdge; col++) path.set(`${currentRow},${col}`, idx++);
  }
  let currentCol = logoEdge;

  // Phase 2: Route vertically to card center row
  if (currentRow < targetRow) {
    for (let row = currentRow + 1; row <= targetRow; row++) path.set(`${row},${currentCol}`, idx++);
  } else if (currentRow > targetRow) {
    for (let row = currentRow - 1; row >= targetRow; row--) path.set(`${row},${currentCol}`, idx++);
  }

  // Phase 3: Route horizontally to card edge
  if (cardSide === "left") {
    for (let col = currentCol - 1; col >= stopCol; col--) path.set(`${targetRow},${col}`, idx++);
  } else {
    for (let col = currentCol + 1; col <= stopCol; col++) path.set(`${targetRow},${col}`, idx++);
  }

  return path;
}

// --- Solana ecosystem projects ---
const DEFAULT_ECOSYSTEM_PROJECTS: EcoProject[] = [
  { name: "Chaindex", color: "#4FC5E8", logo: "/community/chaindex.png", link: "https://chaindex.xyz/" },
  { name: "Blox", color: "#FF6B6B", logo: "/community/blox.png", link: "https://x.com/blox_malaysia" },
  { name: "Yields", color: "#45B26B", logo: "/community/yields.png", link: "https://yields.so/" },
  { name: "Memoo AI", color: "#AB9FF2", logo: "/community/memooai.png", link: "https://memoo.ai/" },
  { name: "CoinGecko", color: "#83CF6A", logo: "/community/coingecko.png", link: "https://coingecko.com/" },
  { name: "MirrorFi", color: "#6C5CE7", logo: "/community/mirrorfi.png", link: "https://mirrorfi.xyz/" },
];

interface EcoProject { name: string; color: string; logo: string; link?: string }

interface EcoSpawn {
  project: EcoProject;
  delay: number;
  duration: number;
  id: number;
  isCenter: boolean;
}

function DetailCardContent({ member }: { member: Member }) {
  const canonical = CANONICAL_MEMBERS.find((m) => m.name === member.name);
  const primaryColor = getSkillColor(canonical?.primaryRole || member.skills[0] || "Product");
  const secondaryColor = getSkillColor(canonical?.secondaryRole || canonical?.primaryRole || member.skills[0] || "Product");

  return (
    <div className="w-full h-full flex flex-col pointer-events-auto overflow-hidden">
      {/* Top accent gradient */}
      <div
        className="h-1 shrink-0"
        style={{ background: `linear-gradient(to right, ${primaryColor.text}, ${secondaryColor.text})` }}
      />

      <div
        className="flex-1 flex flex-col items-center text-center p-3 min-h-0"
        style={{
          background: `linear-gradient(160deg, ${primaryColor.bg} 0%, ${secondaryColor.bg} 35%, transparent 65%)`,
        }}
      >
        {/* Centered avatar */}
        <div className="flex-1 flex items-center justify-center my-1">
          {member.avatar_url ? (
            <div
              className="w-32 h-32 rounded-xl overflow-hidden border-2"
              style={{ borderColor: primaryColor.border }}
            >
              <img
                src={member.avatar_url}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              className="w-32 h-32 rounded-xl flex items-center justify-center font-bold text-2xl border-2"
              style={{ borderColor: primaryColor.border, backgroundColor: primaryColor.bg, color: primaryColor.text }}
            >
              {getInitials(member.name)}
            </div>
          )}
        </div>

        {/* Name + role + twitter */}
        <h3 className="text-base font-bold text-white tracking-wide uppercase truncate w-full mt-2">
          {member.name}
        </h3>
        {member.title && (
          <p className="text-xs text-[#ccc] font-medium mt-1">{member.title}</p>
        )}
        {member.twitter_handle && (
          <a
            href={`https://x.com/${member.twitter_handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#888] hover:text-white transition-colors mt-1"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            @{member.twitter_handle}
          </a>
        )}

        {/* Skills */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-2">
          {member.skills.slice(0, 4).map((skill) => {
            const sc = getSkillColor(skill);
            return (
              <span
                key={skill}
                className="px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide"
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

      </div>
    </div>
  );
}

export function MemberSpotlight({ members, content = {}, projects: projectsProp = [] }: MemberSpotlightProps) {
  const c = (key: string, fallback: string) => content[key] || fallback;
  // Use DB projects if available, fallback to defaults
  const ECOSYSTEM_PROJECTS: EcoProject[] = projectsProp.length > 0
    ? projectsProp.map((p) => ({ name: p.name, color: "#9945FF", logo: p.logo, link: p.link }))
    : DEFAULT_ECOSYSTEM_PROJECTS;

  const realMembers = members.filter((m) => m.is_spotlight);
  const mockMembers = generateMockMembers(ALL_OUTLINE.length);
  // Use real members first, fill remaining slots with mock/hardcoded
  const spotlightMembers = realMembers.length > 0
    ? [...realMembers.slice(0, ALL_OUTLINE.length), ...mockMembers].slice(0, ALL_OUTLINE.length)
    : mockMembers;

  const [active, setActive] = useState<Member | null>(null);
  const [activeCol, setActiveCol] = useState<number>(0);
  const [activeRow, setActiveRow] = useState<number>(0);
  const [activeCardSide, setActiveCardSide] = useState<"left" | "right">("left");
  const [pathCells, setPathCells] = useState<Map<string, number>>(new Map());
  const [showCard, setShowCard] = useState(false);
  const [locked, setLocked] = useState(false);
  const cardTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const logoMidCol = PAD + LOGO_COLS / 2;

  // Ecosystem spawns — each spawn gets its own random timing
  const [leftSpawns, setLeftSpawns] = useState<Map<string, EcoSpawn>>(new Map());
  const [rightSpawns, setRightSpawns] = useState<Map<string, EcoSpawn>>(new Map());
  const spawnIdRef = useRef(0);
  const [hoveredSpawnId, setHoveredSpawnId] = useState<number | null>(null);

  useEffect(() => {
    const generate = () => {
      const shuffled = [...ECOSYSTEM_PROJECTS].sort(() => Math.random() - 0.5);
      let pi = 0;
      const occupied = new Set<string>();

      // Exclusion zones with 1-cell buffer so 3×3 spawns don't get clipped by panes
      function inExclusion(r: number, c: number): boolean {
        if (r >= 0 && r <= 7 && c >= 0 && c <= 14) return true;
        if (r >= 10 && r <= 14 && c >= 31 && c <= 39) return true;
        return false;
      }

      function placeBlocks(
        minR: number, maxR: number, minC: number, maxC: number, count: number
      ): Map<string, EcoSpawn> {
        const map = new Map<string, EcoSpawn>();
        const centers: [number, number][] = [];
        for (let r = minR; r <= maxR; r++) {
          for (let c = minC; c <= maxC; c++) centers.push([r, c]);
        }
        const picked = centers.sort(() => Math.random() - 0.5);
        let placed = 0;
        for (const [cr, cc] of picked) {
          if (placed >= count || pi >= shuffled.length) break;
          let ok = true;
          for (let dr = -1; dr <= 1 && ok; dr++) {
            for (let dc = -1; dc <= 1 && ok; dc++) {
              const key = `${cr + dr},${cc + dc}`;
              if (occupied.has(key) || inExclusion(cr + dr, cc + dc)) ok = false;
            }
          }
          if (!ok) continue;
          const base = {
            project: shuffled[pi++],
            delay: Math.random() * 4000,
            duration: 3000 + Math.random() * 2000,
            id: spawnIdRef.current++,
          };
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const key = `${cr + dr},${cc + dc}`;
              occupied.add(key);
              map.set(key, { ...base, isCenter: dr === 0 && dc === 0 });
            }
          }
          placed++;
        }
        return map;
      }

      // Left: centers row 2..TOTAL_ROWS-3, col 2..PAD-3 (exclusion zones filter out heading area)
      const newLeft = placeBlocks(2, TOTAL_ROWS - 3, 2, PAD - 3, 3 + Math.floor(Math.random() * 2));
      // Right: centers row 2..TOTAL_ROWS-3, col PAD+LOGO_COLS+3..COLS-3 (exclusion zones filter out button area)
      const newRight = placeBlocks(2, TOTAL_ROWS - 3, PAD + LOGO_COLS + 3, COLS - 3, 3 + Math.floor(Math.random() * 2));
      setLeftSpawns(newLeft);
      setRightSpawns(newRight);
    };

    const timeout = setTimeout(generate, 150);
    const interval = setInterval(generate, 8000);
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, []);

  useEffect(() => {
    return () => {
      if (cardTimerRef.current) clearTimeout(cardTimerRef.current);
    };
  }, []);

  function activateMember(member: Member, r: number, c: number) {
    setActive(member);
    setActiveCol(c);
    setActiveRow(r);
    setShowCard(false);

    const cardSide: "left" | "right" = r === VPAD ? "right" : c >= logoMidCol ? "right" : "left";
    setActiveCardSide(cardSide);
    const newPath = buildPath(r, c, cardSide);
    setPathCells(newPath);

    if (cardTimerRef.current) clearTimeout(cardTimerRef.current);
    const triggerDelay = newPath.size * 25;
    cardTimerRef.current = setTimeout(() => setShowCard(true), triggerDelay + 100);
  }

  function handleHover(member: Member, r: number, c: number) {
    if (locked) return;
    activateMember(member, r, c);
  }

  function handleClick(member: Member, r: number, c: number) {
    if (locked && active?.id === member.id) {
      // Click same locked avatar → unlock
      setLocked(false);
      setActive(null);
      setPathCells(new Map());
      setShowCard(false);
      if (cardTimerRef.current) clearTimeout(cardTimerRef.current);
      return;
    }
    setLocked(true);
    activateMember(member, r, c);
  }

  function clearActive() {
    if (locked) return;
    setActive(null);
    setPathCells(new Map());
    setShowCard(false);
    if (cardTimerRef.current) clearTimeout(cardTimerRef.current);
  }

  const activeSide = showCard && active ? activeCardSide : null;

  return (
    <section
      className="relative overflow-hidden bg-black flex flex-col items-center justify-center"
      style={{ height: "100dvh", scrollSnapAlign: "start" }}
    >
      <style>{`
        @keyframes ecoFade {
          0% { opacity: 0; transform: scale(0.7); }
          15% { opacity: 1; transform: scale(1); }
          75% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.7); }
        }
        @keyframes pulseGoldBorder {
          0%, 100% {
            box-shadow: inset 0 0 10px rgba(255,184,0,0.5), 0 0 6px rgba(255,184,0,0.2);
          }
          50% {
            box-shadow: inset 0 0 22px rgba(255,184,0,0.9), 0 0 16px rgba(255,184,0,0.5);
          }
        }
        @keyframes beamPulse {
          0%, 100% {
            background-color: rgba(255, 184, 0, 0.15);
            border-color: rgba(255, 184, 0, 0.25);
            box-shadow: none;
          }
          50% {
            background-color: rgba(255, 184, 0, 0.55);
            border-color: rgba(255, 184, 0, 0.65);
            box-shadow: inset 0 0 10px rgba(255,184,0,0.35);
          }
        }
      `}</style>

{/* Heading + View all members are now grid-placed below */}

      {/* Mobile: title + avatar grid + button */}
      <div className="lg:hidden relative z-10 w-full px-6 pt-16 pb-8">
        <h2
          className="text-white font-semibold tracking-tight leading-[1.1] mb-3"
          style={{ fontSize: "clamp(1.75rem, 1.2rem + 2vw, 2.75rem)" }}
        >
          {c("community.title", "Meet the community")}
        </h2>
        <p className="text-[#a1a1aa] text-sm leading-relaxed mb-8">
          {c("community.description", "Talented builders, designers, and creators shaping Malaysia\u2019s Web3 landscape.")}
        </p>
        <div className="grid grid-cols-5 gap-2">
          {spotlightMembers.slice(0, 15).map((m: Member, i: number) => (
            <div key={m.id || i} className="aspect-square rounded-lg overflow-hidden bg-[#1a1a1a]">
              {m.avatar_url ? (
                <img src={m.avatar_url} alt={m.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white/40">
                  {getInitials(m.name)}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/members"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-white/20 text-sm font-semibold text-white/70 hover:text-white hover:border-white/40 hover:bg-white/5 transition-colors"
          >
            See all members
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Desktop: Full-width pixel grid */}
      <div className="hidden lg:block relative z-10 w-screen">
        <AnimatedSection>
          <div className="relative" onMouseLeave={clearActive}>
            <div
              className="grid gap-[2px]"
              style={{
                gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              }}
            >
                {Array.from({ length: TOTAL_ROWS * COLS }).map((_, i) => {
                  const r = Math.floor(i / COLS);
                  const c = i % COLS;
                  const isEdge = OUTLINE_SET.has(`${r},${c}`);

                  // Outline cell — member avatar
                  if (isEdge) {
                    const outlineIdx = ALL_OUTLINE.findIndex(
                      ([or, oc]) => or === r && oc === c
                    );
                    const member = spotlightMembers[outlineIdx];
                    return (
                      <button
                        key={i}
                        onMouseEnter={() => handleHover(member, r, c)}
                        onClick={() => handleClick(member, r, c)}
                        className={`relative rounded-[2px] overflow-hidden transition-all duration-150 group aspect-square ${
                          active?.id === member.id ? "z-10 scale-110" : "hover:scale-105"
                        }`}
                      >
                        <img
                          src={member.avatar_url}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                        <div
                          className={`absolute inset-0 pointer-events-none border-2 border-[#FFB800] rounded-[2px] transition-opacity duration-150 ${
                            active?.id === member.id ? "opacity-100" : "opacity-0"
                          }`}
                          style={{
                            animation: active?.id === member.id && locked ? "pulseGoldBorder 1.5s ease-in-out infinite" : "none",
                            boxShadow: active?.id === member.id && !locked ? "inset 0 0 10px rgba(255,184,0,0.5)" : undefined,
                          }}
                        />
                      </button>
                    );
                  }

                  // All other cells — black grid with possible path or ecosystem spawn
                  const pathDelay = pathCells.get(`${r},${c}`);
                  const isOnPath = pathDelay !== undefined;

                  const cellSide = c < PAD ? "left" : c >= PAD + LOGO_COLS ? "right" : null;
                  const spawns = cellSide === "left" ? leftSpawns : cellSide === "right" ? rightSpawns : null;
                  const spawn = spawns?.get(`${r},${c}`);
                  const showSpawn = !!spawn && activeSide !== cellSide && !isOnPath;

                  return (
                    <div
                      key={i}
                      onMouseEnter={() => { if (!locked && !isOnPath) clearActive(); }}
                      className="rounded-[2px] relative aspect-square flex items-center justify-center"
                      style={isOnPath && locked ? {
                        animation: "beamPulse 2s ease-in-out infinite",
                        animationDelay: `${(pathDelay ?? 0) * 60}ms`,
                        borderWidth: 1,
                        borderStyle: "solid",
                      } : {
                        backgroundColor: isOnPath ? "rgba(255, 184, 0, 0.25)" : "rgb(0,0,0)",
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderColor: isOnPath ? "rgba(255, 184, 0, 0.35)" : "rgba(255,255,255,0.3)",
                        boxShadow: isOnPath ? "inset 0 0 8px rgba(255,184,0,0.2)" : "none",
                        transition: "background-color 120ms ease, border-color 120ms ease, box-shadow 120ms ease",
                        transitionDelay: isOnPath ? `${pathDelay * 25}ms` : "0ms",
                      }}
                    >
                      {showSpawn && spawn.isCenter && (
                        <div
                          key={spawn.id}
                          onMouseEnter={() => setHoveredSpawnId(spawn.id)}
                          onMouseLeave={() => setHoveredSpawnId(null)}
                          onClick={() => { if (spawn.project.link) window.open(spawn.project.link, "_blank"); }}
                          className={`rounded-sm overflow-hidden ${spawn.project.link ? "cursor-pointer" : "cursor-default"}`}
                          style={{
                            position: "absolute",
                            top: "calc(-100% - 2px)",
                            left: "calc(-100% - 2px)",
                            width: "calc(300% + 4px)",
                            height: "calc(300% + 4px)",
                            zIndex: 5,
                            animation: `ecoFade ${spawn.duration}ms ease both`,
                            animationDelay: `${spawn.delay}ms`,
                            animationPlayState: hoveredSpawnId === spawn.id ? "paused" : "running",
                            backgroundColor: `black`,
                            border: `1px solid ${spawn.project.color}40`,
                            boxShadow: `inset 0 0 14px ${spawn.project.color}25`,
                          }}
                        >
                          <img
                            src={spawn.project.logo}
                            alt={spawn.project.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}

              </div>

              {/* Heading pane — rows 0-5, cols 1-12 (absolute overlay) */}
              <div
                className="absolute bg-black z-10 flex flex-col justify-center px-6"
                style={{
                  top: `${(0 / TOTAL_ROWS) * 100}%`,
                  left: `${(1 / COLS) * 100}%`,
                  width: `${(12 / COLS) * 100}%`,
                  height: `${(6 / TOTAL_ROWS) * 100}%`,
                }}
              >
                <h2
                  className="text-white font-semibold tracking-tight leading-[1.1]"
                  style={{ fontSize: "clamp(1.75rem, 1.2rem + 2vw, 2.75rem)" }}
                >
                  {c("community.title", "Meet the community")}
                </h2>
                <p className="mt-5 text-[#a1a1aa] text-sm leading-relaxed">
                  {c("community.description", "Talented builders, designers, and creators shaping Malaysia\u2019s Web3 landscape.")}
                </p>
              </div>

              {/* View all members pane — rows 12-13, cols 33-38 (absolute overlay) */}
              <div
                className="absolute bg-black z-10 flex items-center justify-center"
                style={{
                  top: `${(12 / TOTAL_ROWS) * 100}%`,
                  left: `${(33 / COLS) * 100}%`,
                  width: `${(6 / COLS) * 100}%`,
                  height: `${(2 / TOTAL_ROWS) * 100}%`,
                }}
              >
                <Link
                  href="/members"
                  className="text-sm font-semibold text-white/70 hover:text-white transition-colors inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/5"
                >
                  View all members
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Right detail card — rows 1-7, cols 29-35 (7×7) */}
              <div
                className={`absolute bg-black z-20 pointer-events-none transition-all duration-300 ${
                  showCard && active && activeCardSide === "right" ? "opacity-100" : "opacity-0"
                } ${
                  active?.skills.includes("Core Team")
                    ? "border border-amber-500/40"
                    : "border border-white/[0.06]"
                }`}
                style={{
                  top: `${(1 / TOTAL_ROWS) * 100}%`,
                  left: `${(29 / COLS) * 100}%`,
                  width: `${(7 / COLS) * 100}%`,
                  height: `${(7 / TOTAL_ROWS) * 100}%`,
                }}
              >
                {active && <DetailCardContent member={active} />}
              </div>

              {/* Left detail card — rows 7-13, cols 3-9 (7×7) */}
              <div
                className={`absolute bg-black z-20 pointer-events-none transition-all duration-300 ${
                  showCard && active && activeCardSide === "left" ? "opacity-100" : "opacity-0"
                } ${
                  active?.skills.includes("Core Team")
                    ? "border border-amber-500/40"
                    : "border border-white/[0.06]"
                }`}
                style={{
                  top: `${(7 / TOTAL_ROWS) * 100}%`,
                  left: `${(3 / COLS) * 100}%`,
                  width: `${(7 / COLS) * 100}%`,
                  height: `${(7 / TOTAL_ROWS) * 100}%`,
                }}
              >
                {active && <DetailCardContent member={active} />}
              </div>
            </div>
        </AnimatedSection>
      </div>

      {/* Fade overlays to blend grid edges */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
    </section>
  );
}
