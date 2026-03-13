import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { SkillBadge } from "@/components/shared/SkillBadge";
import { getInitials } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import type { Member } from "@/lib/types";

interface MemberSpotlightProps {
  members: Member[];
}

function mockAvatar(i: number): string {
  const gender = i % 2 === 0 ? "men" : "women";
  const id = ((i * 7 + 3) % 99) + 1;
  return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;
}

const FIRST_NAMES = [
  "Alex","Sarah","Rizal","Wei","Amir","Priya","Jun","Nurul","David","Mei",
  "Farhan","Jade","Arjun","Siti","Marcus","Hana","Ravi","Aisyah","Brandon","Yuki",
  "Liam","Sofia","Kai","Nina","Omar","Chloe","Zain","Aisha","Ethan","Mira",
  "Hafiz","Luna","Raj","Farah","Dani","Ivy","Samir","Tina","Leon","Amy",
  "Nate","Zara","Joel","Mia","Fikri","Rose","Adam","Lily","Tariq","Emi",
  "Yusuf","Rina","Aiden","Maya","Imran","Nora","Leo","Dina","Ryan","Kira",
  "Zack","Sera","Adi","Jia","Erik","Suki","Faris","Lena","Max","Yuna",
  "Dex","Vera","Ali","Anya",
];
const LAST_NAMES = [
  "Chen","Lim","Ahmad","Ling","Hassan","Sharma","Kai","Aina","Tan","Xin",
  "Yusof","Wong","Nair","Fatimah","Lee","Kimura","Kumar","Malik","Ong","Tanaka",
  "Park","Silva","Nakamura","Patel","Osman","Dubois","Karim","Ibrahim","Moore","Das",
  "Razak","Torres","Gupta","Hasan","Kim","Flores","Shah","Costa","Wu","Reed",
  "Ismail","Zhou","Santos","Lopez","Aziz","Rivera","Khan","Yang","Mahdi","Sato",
  "Ali","Cheng","Nash","Lin","Rossi","Berg","Cho","Diaz","Fong","Cruz",
  "Bakar","Roy","Hafiz","Sun","Holm","Mori","Idris","Koh","Stone","Ito",
  "Cole","Nova","Reza","Devi",
];
const TITLES = [
  "Full-Stack Dev","Smart Contract Eng","UI/UX Designer","Community Lead","DeFi Researcher",
  "Frontend Dev","Blockchain Dev","Product Designer","DevRel Engineer","Data Analyst",
  "Rust Developer","Mobile Dev","Protocol Engineer","Graphic Designer","Backend Dev",
  "Web3 Educator","Security Researcher","NFT Artist","Growth Lead","Solana Dev",
  "Token Engineer","ZK Researcher","Infra Lead","Content Creator","DAO Contributor",
  "Game Dev","Bridge Engineer","Analytics Lead","Tech Writer","Validator Ops",
  "SDK Developer","MEV Researcher","Wallet Dev","DePIN Builder","AI × Crypto",
  "Grants Lead","Ecosystem Dev","Payments Dev","Identity Eng","NFT Dev",
  "Staking Ops","Oracle Dev","Liquidity Eng","Compliance Eng","Marketing Lead",
  "Onchain Analyst","RWA Engineer","Social Layer Dev","Governance Lead","Cross-chain Dev",
  "Perp Dev","Lending Protocol","AMM Designer","Indexer Dev","Explorer Dev",
  "Privacy Eng","Consensus Dev","Runtime Dev","Tooling Dev","Security Auditor",
  "Farcaster Dev","Blinks Dev","cNFT Dev","Token-2022 Dev","SPL Dev",
  "Anchor Dev","Seahorse Dev","Clockwork Dev","Helius Dev","Metaplex Dev",
  "Jupiter Dev","Marinade Dev","Raydium Dev","Tensor Dev",
];
const SKILL_SETS = [
  ["React","TypeScript","Solana"],["Rust","Anchor","Solana"],["Figma","CSS","Design"],
  ["Community","Events"],["DeFi","Tokenomics"],["Next.js","Tailwind"],
  ["Solidity","Rust"],["UI/UX","Branding"],["Docs","APIs"],
  ["Python","SQL"],["Rust","Systems"],["React Native","Mobile"],
];

function generateMockMembers(count: number): Member[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `mock-${i}`,
    name: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[i % LAST_NAMES.length]}`,
    title: TITLES[i % TITLES.length],
    bio: "Passionate builder contributing to the Solana ecosystem in Malaysia.",
    avatar_url: mockAvatar(i),
    skills: SKILL_SETS[i % SKILL_SETS.length],
    twitter_handle: `${FIRST_NAMES[i % FIRST_NAMES.length].toLowerCase()}${LAST_NAMES[i % LAST_NAMES.length].toLowerCase()}`,
    github_url: `https://github.com/${FIRST_NAMES[i % FIRST_NAMES.length].toLowerCase()}${LAST_NAMES[i % LAST_NAMES.length].toLowerCase()}`,
    linkedin_url: "",
    wallet_address: "",
    is_spotlight: true,
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
const ECOSYSTEM_PROJECTS = [
  { name: "Solana", color: "#9945FF", logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png" },
  { name: "Jupiter", color: "#00D18C", logo: "https://static.jup.ag/jup/icon.png" },
  { name: "Raydium", color: "#6C5CE7", logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png" },
  { name: "Bonk", color: "#F0A030", logo: "https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I" },
  { name: "Jito", color: "#45B26B", logo: "https://metadata.jito.network/token/jto/icon.png" },
  { name: "Pyth", color: "#7142CF", logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3/logo.png" },
  { name: "Orca", color: "#FFDA44", logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE/logo.png" },
  { name: "Marinade", color: "#C1839F", logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey/logo.png" },
  { name: "Dogwifhat", color: "#E8A838", logo: "https://bafkreibk3covs5ltyqxa272uodhber5r6bq3tph3iyamkss33miq2wy7ae.ipfs.nftstorage.link" },
  { name: "Helium", color: "#474DFF", logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux/logo.png" },
  { name: "Tensor", color: "#FF6B6B", logo: "https://coin-images.coingecko.com/coins/images/35972/large/tensor.jpeg" },
  { name: "Phantom", color: "#AB9FF2", logo: "https://play-lh.googleusercontent.com/obRvW02OTYLzJuvic1ZbVDVXLXzI0Vt_JGOjlxZ92XMdBF_i3kqU92u9SgHvJ5pySdM" },
  { name: "mSOL", color: "#5BACBA", logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png" },
  { name: "Serum", color: "#4FC5E8", logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt/logo.png" },
  { name: "Saber", color: "#6966FB", logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1/logo.png" },
  { name: "Mango", color: "#E54033", logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac/token.png" },
  { name: "SAMO", color: "#EECAB0", logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU/logo.png" },
  { name: "Star Atlas", color: "#40E0D0", logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx/logo.png" },
  { name: "STEPN", color: "#83CF6A", logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7i5KKsX2weiTkry7jA4ZwSuXGhs5eJBEjY8vVxR4pfRx/logo.png" },
  { name: "Audius", color: "#CC0FE0", logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/9LzCMqDgTKYz9Drzqnpgee3SGa89up3a247ypMj2xrqM/logo.png" },
];

interface EcoSpawn {
  project: (typeof ECOSYSTEM_PROJECTS)[number];
  delay: number;
  duration: number;
  id: number;
  isCenter: boolean;
}

function DetailCardContent({ member }: { member: Member }) {
  const isCoreTeam = member.skills.includes("Core Team");
  return (
    <div className="w-full h-full p-3 flex flex-col items-center justify-center pointer-events-auto">
      {member.avatar_url ? (
        <img
          src={member.avatar_url}
          alt={member.name}
          className={`w-24 h-24 rounded-xl object-cover ring-2 ${
            isCoreTeam ? "ring-amber-500/50" : "ring-[#FFB800]/40"
          }`}
        />
      ) : (
        <div className={`w-24 h-24 rounded-xl flex items-center justify-center font-bold text-3xl ${
          isCoreTeam ? "bg-amber-500/10 text-amber-400" : "bg-brand-purple/15 text-brand-purple-light"
        }`}>
          {getInitials(member.name)}
        </div>
      )}
      <h3 className={`text-xl font-bold mt-3 text-center leading-tight ${
        isCoreTeam ? "text-amber-400" : "text-white"
      }`}>
        {member.name}
      </h3>
      <p className="text-base text-[#a1a1aa] mt-1 text-center">
        {member.title}
      </p>
      {member.twitter_handle && (
        <a
          href={`https://x.com/${member.twitter_handle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-2 text-sm text-[#666] hover:text-white transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          @{member.twitter_handle}
        </a>
      )}
      {member.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {member.skills.slice(0, 4).map((skill) => (
            <SkillBadge key={skill} skill={skill} size="sm" golden={isCoreTeam} />
          ))}
        </div>
      )}
    </div>
  );
}

export function MemberSpotlight({ members }: MemberSpotlightProps) {
  const realMembers = members.filter((m) => m.is_spotlight);
  const spotlightMembers =
    realMembers.length >= ALL_OUTLINE.length
      ? realMembers.slice(0, ALL_OUTLINE.length)
      : generateMockMembers(ALL_OUTLINE.length);

  const [active, setActive] = useState<Member | null>(null);
  const [activeCol, setActiveCol] = useState<number>(0);
  const [activeRow, setActiveRow] = useState<number>(0);
  const [activeCardSide, setActiveCardSide] = useState<"left" | "right">("left");
  const [pathCells, setPathCells] = useState<Map<string, number>>(new Map());
  const [showCard, setShowCard] = useState(false);
  const [locked, setLocked] = useState(false);
  const cardTimerRef = useRef<ReturnType<typeof setTimeout>>();

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

  const activeSide = active ? (activeCol < logoMidCol ? "left" : "right") : null;

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

      {/* Mobile: scrollable avatar grid */}
      <div className="lg:hidden relative z-10 w-full px-6 mt-[45%]">
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
                          className="rounded-sm cursor-default overflow-hidden"
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
                  Meet the community
                </h2>
                <p className="mt-5 text-[#a1a1aa] text-sm leading-relaxed">
                  Talented builders, designers, and creators shaping Malaysia&rsquo;s Web3 landscape.
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
