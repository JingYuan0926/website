import { useState } from "react";
import type { Partner } from "@/lib/types";

const PARTNER_LOGOS = [
  "Solana", "Phantom", "Jupiter", "Raydium", "Marinade",
  "Tensor", "Helius", "Jito", "Drift", "Pyth", "Backpack", "Squads", "Orca",
];

export function PartnerMarquee({ partners }: { partners: Partner[] }) {
  const [paused, setPaused] = useState(false);
  const logos = partners.length > 0
    ? partners.map((p) => ({ name: p.name, logo: p.logo_url, url: p.website_url, scale: p.logo_scale ?? 1 }))
    : PARTNER_LOGOS.map((name) => ({ name, logo: "", url: "", scale: 1 }));

  const renderItem = (p: typeof logos[0], i: number) => {
    const inner = p.logo ? (
      <img
        src={p.logo}
        alt={p.name}
        className="object-contain brightness-0 invert opacity-90 pointer-events-none"
        style={{ transform: `scale(${p.scale})`, height: "1.75rem", maxWidth: "120px" }}
      />
    ) : (
      <span className="text-white font-bold text-lg tracking-tight opacity-90">{p.name}</span>
    );
    return p.url ? (
      <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className="shrink-0 mx-8 flex items-center justify-center h-16 whitespace-nowrap hover:opacity-100 transition-opacity">
        {inner}
      </a>
    ) : (
      <span key={i} className="shrink-0 mx-8 flex items-center justify-center h-16 whitespace-nowrap">{inner}</span>
    );
  };

  return (
    <div
      className="relative z-10 bg-[#9945ff] h-16 overflow-hidden shrink-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex w-max"
        style={{
          animation: "partnerScroll 30s linear infinite",
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        <div className="flex shrink-0">{logos.map((p, i) => renderItem(p, i))}</div>
        <div className="flex shrink-0" aria-hidden="true">{logos.map((p, i) => renderItem(p, i + logos.length))}</div>
      </div>
    </div>
  );
}
