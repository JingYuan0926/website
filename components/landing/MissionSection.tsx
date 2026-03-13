import { useState } from "react";
import Link from "next/link";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { MISSION_PILLARS } from "@/lib/constants";
import {
  Code,
  Calendar,
  Coins,
  Briefcase,
  GraduationCap,
  Globe,
  Rocket,
  Shield,
  Heart,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { MissionPillar } from "@/lib/types";

const ICON_MAP: Record<string, LucideIcon> = {
  code: Code,
  calendar: Calendar,
  coins: Coins,
  briefcase: Briefcase,
  "graduation-cap": GraduationCap,
  globe: Globe,
  rocket: Rocket,
  shield: Shield,
  heart: Heart,
  zap: Zap,
};

interface MissionSectionProps {
  content?: Record<string, string>;
  pillars?: MissionPillar[];
}

type PillarItem = MissionPillar | (typeof MISSION_PILLARS)[number];

export function MissionSection({ content, pillars }: MissionSectionProps) {
  const items: PillarItem[] = pillars && pillars.length > 0 ? pillars : MISSION_PILLARS;
  const [activeIdx, setActiveIdx] = useState(0);
  const active = items[activeIdx];
  const Icon = ICON_MAP[active.icon];

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-[1200px] mx-auto px-6">
        <AnimatedSection>
          <h2
            className="text-4xl lg:text-5xl font-bold text-white tracking-tight"
          >
            {content?.title || "Our Mission"}
          </h2>
          <p className="mt-4 text-text-secondary text-base max-w-xl">
            {content?.description || "Everything we do to empower Solana builders in Malaysia."}
          </p>
        </AnimatedSection>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-[220px_1fr_320px] gap-8 lg:gap-12">
          {/* Left: Vertical stepper */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {items.map((pillar, idx) => (
              <button
                key={pillar.title}
                onClick={() => setActiveIdx(idx)}
                className="flex items-center gap-3 text-left shrink-0 group"
              >
                {/* Number + connector */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-lg border flex items-center justify-center text-xs font-mono font-bold transition-colors ${
                      idx === activeIdx
                        ? "border-white/40 text-white bg-white/5"
                        : "border-white/10 text-white/30"
                    }`}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  {idx < items.length - 1 && (
                    <div className="hidden lg:block w-px h-6 bg-white/10 my-1" />
                  )}
                </div>
                {/* Label */}
                <span
                  className={`text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors ${
                    idx === activeIdx
                      ? "text-white"
                      : "text-white/30 group-hover:text-white/50"
                  }`}
                >
                  {pillar.title}
                </span>
              </button>
            ))}
          </div>

          {/* Center: Content */}
          <div className="min-w-0">
            <h3 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
              {active.heading || active.title}
            </h3>
            <p className="mt-4 text-sm text-text-secondary leading-relaxed">
              {active.description}
            </p>
            {active.bullets && active.bullets.length > 0 && (
              <ul className="mt-4 space-y-2">
                {active.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
            {active.cta_text && active.cta_url && (
              <Link
                href={active.cta_url}
                className="inline-flex items-center mt-6 px-5 py-2.5 text-sm font-semibold text-white rounded-full border border-white/20 hover:border-white/40 hover:bg-white/5 transition-colors"
              >
                {active.cta_text}
              </Link>
            )}
          </div>

          {/* Right: Card preview */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="w-full aspect-square max-w-[280px] rounded-2xl border border-white/[0.06] bg-[#0a0a0a] flex flex-col items-center justify-center gap-4 overflow-hidden">
              {"image_url" in active && active.image_url ? (
                <img
                  src={active.image_url}
                  alt={active.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <div className="w-14 h-14 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center">
                    <span className="text-lg font-mono font-bold text-white/30">
                      {String(activeIdx + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="text-center px-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-white">
                      {active.title}
                    </p>
                    <p className="text-[11px] text-white/40 mt-1">
                      {active.heading || active.title}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
