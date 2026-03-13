import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { SectionHeading } from "@/components/shared/SectionHeading";
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

const VPAD = 1;
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

function buildPath(r: number, c: number, cardSide: "left" | "right"): Map<string, number> {
  const path = new Map<string, number>();
  let idx = 0;

  // Stop 4 cells past the logo edge into the padding
  const stopCol = cardSide === "left" ? PAD - 4 : PAD + LOGO_COLS + 3;

  let straightClear = true;
  if (cardSide === "left") {
    for (let col = c - 1; col >= stopCol; col--) {
      if (OUTLINE_SET.has(`${r},${col}`)) { straightClear = false; break; }
    }
  } else {
    for (let col = c + 1; col <= stopCol; col++) {
      if (OUTLINE_SET.has(`${r},${col}`)) { straightClear = false; break; }
    }
  }

  if (straightClear) {
    if (cardSide === "left") {
      for (let col = c - 1; col >= stopCol; col--) path.set(`${r},${col}`, idx++);
    } else {
      for (let col = c + 1; col <= stopCol; col++) path.set(`${r},${col}`, idx++);
    }
    return path;
  }

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

  if (bestRow < r) {
    for (let row = r - 1; row >= bestRow; row--) path.set(`${row},${c}`, idx++);
  } else if (bestRow > r) {
    for (let row = r + 1; row <= bestRow; row++) path.set(`${row},${c}`, idx++);
  }

  if (cardSide === "left") {
    for (let col = c - 1; col >= stopCol; col--) path.set(`${bestRow},${col}`, idx++);
  } else {
    for (let col = c + 1; col <= stopCol; col++) path.set(`${bestRow},${col}`, idx++);
  }

  return path;
}

// --- Solana ecosystem projects ---
const ECOSYSTEM_PROJECTS = [
  { name: "Jupiter", abbr: "JUP", color: "#00D18C" },
  { name: "Raydium", abbr: "RAY", color: "#6C5CE7" },
  { name: "Tensor", abbr: "TNS", color: "#FF6B6B" },
  { name: "Jito", abbr: "JTO", color: "#45B26B" },
  { name: "Phantom", abbr: "PHM", color: "#AB9FF2" },
  { name: "Magic Eden", abbr: "ME", color: "#E42575" },
  { name: "Helius", abbr: "HEL", color: "#E97A28" },
  { name: "Orca", abbr: "ORC", color: "#FFDA44" },
  { name: "Drift", abbr: "DFT", color: "#FF6142" },
  { name: "Pyth", abbr: "PTH", color: "#7142CF" },
  { name: "Bonk", abbr: "BNK", color: "#F0A030" },
  { name: "Helium", abbr: "HNT", color: "#474DFF" },
  { name: "Wormhole", abbr: "WH", color: "#00D4FF" },
  { name: "Meteora", abbr: "MTR", color: "#3EECAC" },
  { name: "Marinade", abbr: "MND", color: "#C1839F" },
];

interface EcoSpawn {
  project: (typeof ECOSYSTEM_PROJECTS)[number];
  delay: number;
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
  const [pathCells, setPathCells] = useState<Map<string, number>>(new Map());
  const [showCard, setShowCard] = useState(false);
  const cardTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const logoMidCol = PAD + LOGO_COLS / 2;

  // Ecosystem spawns
  const [leftSpawns, setLeftSpawns] = useState<Map<string, EcoSpawn>>(new Map());
  const [rightSpawns, setRightSpawns] = useState<Map<string, EcoSpawn>>(new Map());
  const [spawnKey, setSpawnKey] = useState(0);

  useEffect(() => {
    const generate = () => {
      const shuffled = [...ECOSYSTEM_PROJECTS].sort(() => Math.random() - 0.5);
      let pi = 0;

      const leftCells: [number, number][] = [];
      for (let r = 0; r < TOTAL_ROWS; r++) {
        for (let c = 1; c < PAD - 2; c++) leftCells.push([r, c]);
      }
      const newLeft = new Map<string, EcoSpawn>();
      const lCount = 3 + Math.floor(Math.random() * 3);
      const lPick = [...leftCells].sort(() => Math.random() - 0.5);
      for (let i = 0; i < lCount && i < lPick.length && pi < shuffled.length; i++) {
        newLeft.set(`${lPick[i][0]},${lPick[i][1]}`, { project: shuffled[pi++], delay: Math.random() * 400 });
      }

      const rightCells: [number, number][] = [];
      for (let r = 0; r < TOTAL_ROWS; r++) {
        for (let c = PAD + LOGO_COLS + 2; c < COLS - 1; c++) rightCells.push([r, c]);
      }
      const newRight = new Map<string, EcoSpawn>();
      const rCount = 3 + Math.floor(Math.random() * 3);
      const rPick = [...rightCells].sort(() => Math.random() - 0.5);
      for (let i = 0; i < rCount && i < rPick.length && pi < shuffled.length; i++) {
        newRight.set(`${rPick[i][0]},${rPick[i][1]}`, { project: shuffled[pi++], delay: Math.random() * 400 });
      }

      setLeftSpawns(newLeft);
      setRightSpawns(newRight);
      setSpawnKey((k) => k + 1);
    };

    generate();
    const interval = setInterval(generate, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      if (cardTimerRef.current) clearTimeout(cardTimerRef.current);
    };
  }, []);

  function handleHover(member: Member, r: number, c: number) {
    setActive(member);
    setActiveCol(c);
    setActiveRow(r);
    setShowCard(false);

    const cardSide: "left" | "right" = c < logoMidCol ? "left" : "right";
    const newPath = buildPath(r, c, cardSide);
    setPathCells(newPath);

    // Show card once 4 golden cells enter the padding area past the logo edge
    if (cardTimerRef.current) clearTimeout(cardTimerRef.current);
    const triggerCol = cardSide === "left" ? PAD - 4 : PAD + LOGO_COLS + 3;
    let triggerDelay = newPath.size * 25; // fallback: full path
    for (const [key, idx] of newPath) {
      const col = parseInt(key.split(",")[1]);
      if (cardSide === "left" ? col <= triggerCol : col >= triggerCol) {
        triggerDelay = (idx + 1) * 25;
        break;
      }
    }
    cardTimerRef.current = setTimeout(() => setShowCard(true), triggerDelay + 100);
  }

  function clearActive() {
    setActive(null);
    setPathCells(new Map());
    setShowCard(false);
    if (cardTimerRef.current) clearTimeout(cardTimerRef.current);
  }

  const activeSide = active ? (activeCol < logoMidCol ? "left" : "right") : null;

  return (
    <section className="py-24 lg:py-32">
      <style>{`
        @keyframes ecoFade {
          0% { opacity: 0; transform: scale(0.7); }
          15% { opacity: 1; transform: scale(1); }
          75% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.7); }
        }
      `}</style>
      <div className="max-w-[1200px] mx-auto px-6">
        <AnimatedSection>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
            <SectionHeading
              label="Our Builders"
              title="Meet the community"
              description="Talented builders, designers, and creators shaping Malaysia's Web3 landscape."
            />
            <Link
              href="/members"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors inline-flex items-center gap-1.5 shrink-0"
            >
              View all members
              <ArrowRight size={14} />
            </Link>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="flex justify-center">
            <div className="relative" onMouseLeave={clearActive}>
              <div
                className="grid gap-[2px]"
                style={{
                  gridTemplateColumns: `repeat(${COLS}, 34px)`,
                  gridTemplateRows: `repeat(${TOTAL_ROWS}, 34px)`,
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
                        onClick={() => handleHover(member, r, c)}
                        className={`relative rounded-[2px] overflow-hidden transition-all duration-150 group ${
                          active?.id === member.id ? "z-10 scale-110" : "hover:scale-105"
                        }`}
                      >
                        <img
                          src={member.avatar_url}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                        <div
                          className={`absolute inset-0 pointer-events-none border-2 border-[#FFB800] shadow-[inset_0_0_10px_rgba(255,184,0,0.5)] rounded-[2px] transition-opacity duration-150 ${
                            active?.id === member.id ? "opacity-100" : "opacity-0"
                          }`}
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
                      onMouseEnter={() => { if (!isOnPath) clearActive(); }}
                      className="rounded-[2px] relative"
                      style={{
                        backgroundColor: isOnPath ? "rgba(255, 184, 0, 0.25)" : "rgb(0,0,0)",
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderColor: isOnPath ? "rgba(255, 184, 0, 0.35)" : "rgba(255,255,255,0.06)",
                        boxShadow: isOnPath ? "inset 0 0 8px rgba(255,184,0,0.2)" : "none",
                        transition: "background-color 120ms ease, border-color 120ms ease, box-shadow 120ms ease",
                        transitionDelay: isOnPath ? `${pathDelay * 25}ms` : "0ms",
                      }}
                    >
                      {showSpawn && (
                        <div
                          key={spawnKey}
                          className="absolute inset-0 flex items-center justify-center rounded-[1px]"
                          style={{
                            animation: "ecoFade 4s ease forwards",
                            animationDelay: `${spawn.delay}ms`,
                            backgroundColor: `${spawn.project.color}18`,
                            border: `1px solid ${spawn.project.color}35`,
                            boxShadow: `inset 0 0 10px ${spawn.project.color}20`,
                          }}
                        >
                          <span
                            className="text-[7px] font-bold leading-none select-none"
                            style={{ color: `${spawn.project.color}CC` }}
                          >
                            {spawn.project.abbr}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Detail card — appears after path animation completes */}
              <div
                className={`absolute top-0 bottom-0 z-20 pointer-events-none transition-all duration-300 ${
                  showCard && active ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  width: PAD * (34 + 2) - 4 * (34 + 2),
                  ...(activeCol >= logoMidCol
                    ? { right: 0 }
                    : { left: 0 }),
                }}
              >
                {active && (
                  <div className="pointer-events-auto w-full h-full bg-black p-6 flex flex-col items-center justify-center">
                    {active.avatar_url ? (
                      <img
                        src={active.avatar_url}
                        alt={active.name}
                        className="w-16 h-16 rounded-xl object-cover ring-2 ring-[#FFB800]/40"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-brand-purple/15 flex items-center justify-center text-brand-purple-light font-bold text-lg">
                        {getInitials(active.name)}
                      </div>
                    )}
                    <h3 className="text-base font-semibold text-text-primary mt-3">
                      {active.name}
                    </h3>
                    <p className="text-sm text-text-secondary mt-0.5">
                      {active.title}
                    </p>
                    {active.twitter_handle && (
                      <a
                        href={`https://x.com/${active.twitter_handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-1.5 text-xs text-text-muted hover:text-brand-purple-light transition-colors"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        @{active.twitter_handle}
                      </a>
                    )}
                    {active.skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap justify-center gap-1">
                        {active.skills.map((skill) => (
                          <SkillBadge key={skill} skill={skill} size="sm" />
                        ))}
                      </div>
                    )}
                    {active.github_url && (
                      <a
                        href={active.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-text-secondary hover:text-text-primary transition-colors"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        GitHub
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
