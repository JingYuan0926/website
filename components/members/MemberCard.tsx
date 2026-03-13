import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SkillBadge } from "@/components/shared/SkillBadge";
import { getInitials } from "@/lib/utils";
import type { Member } from "@/lib/types";

interface MemberCardProps {
  member: Member;
  index: number;
}

function CornerBrackets({ golden }: { golden?: boolean }) {
  const color = golden ? "border-amber-500/80" : "border-white/40";
  return (
    <>
      <span className={`absolute top-0 left-0 w-4 h-4 border-t border-l ${color}`} />
      <span className={`absolute top-0 right-0 w-4 h-4 border-t border-r ${color}`} />
      <span className={`absolute bottom-0 left-0 w-4 h-4 border-b border-l ${color}`} />
      <span className={`absolute bottom-0 right-0 w-4 h-4 border-b border-r ${color}`} />
    </>
  );
}

export function MemberCard({ member, index }: MemberCardProps) {
  const [maxVisible, setMaxVisible] = useState(member.skills.length);
  const [hovered, setHovered] = useState(false);
  const measureRef = useRef<HTMLDivElement>(null);
  const plusBtnRef = useRef<HTMLDivElement>(null);
  const plusTagRef = useRef<HTMLSpanElement>(null);
  const skillsRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = measureRef.current;
    const plusBtn = plusBtnRef.current;
    if (!container || !plusBtn) return;

    function measure() {
      if (!container || !plusBtn) return;
      const children = Array.from(container.children) as HTMLElement[];
      if (children.length <= 1) {
        setMaxVisible(children.length);
        return;
      }

      const containerWidth = container.offsetWidth;
      const gap = 6; // gap-1.5 = 6px
      const plusWidth = plusBtn.offsetWidth + gap;

      // Calculate cumulative widths of badges
      let usedWidth = 0;
      let bestFit = children.length; // assume all fit

      for (let i = 0; i < children.length; i++) {
        const badgeWidth = children[i].offsetWidth;
        const widthWithThisBadge = usedWidth + (i > 0 ? gap : 0) + badgeWidth;

        if (widthWithThisBadge > containerWidth) {
          // This badge doesn't fit — how many fit WITH the +N button?
          bestFit = i;
          break;
        }
        usedWidth = widthWithThisBadge;
      }

      if (bestFit >= children.length) {
        // All badges fit, no +N needed
        setMaxVisible(children.length);
        return;
      }

      // Now figure out how many fit alongside the +N button
      // Try from bestFit down: does badge[0..k-1] + plusBtn fit in one row?
      for (let k = bestFit; k >= 1; k--) {
        let w = 0;
        for (let i = 0; i < k; i++) {
          w += (i > 0 ? gap : 0) + children[i].offsetWidth;
        }
        if (w + plusWidth <= containerWidth) {
          setMaxVisible(k);
          return;
        }
      }

      // Worst case: show 1 badge + plus button on next line
      setMaxVisible(1);
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [member.skills]);

  const isCoreTeam = member.skills.includes("Core Team");
  const hasOverflow = member.skills.length > maxVisible;
  const visibleSkills = member.skills.slice(0, maxVisible);
  const hiddenSkills = member.skills.slice(maxVisible);
  const overflowCount = hiddenSkills.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.25, 1, 0.5, 1],
        delay: Math.min(index * 0.05, 0.4),
      }}
      className={`group relative p-5 bg-[#0a0a0a] border transition-all duration-[var(--duration-normal)] ${
        isCoreTeam
          ? "border-amber-500/30 hover:border-amber-500/60"
          : "border-white/[0.06] hover:border-white/20"
      }`}
    >
      <CornerBrackets golden={isCoreTeam} />

      {/* Hidden measurement container — renders all badges for width calc */}
      <div
        ref={measureRef}
        className="flex flex-wrap gap-1.5 absolute left-5 right-5 pointer-events-none"
        style={{ visibility: "hidden", flexWrap: "nowrap" }}
        aria-hidden="true"
      >
        {member.skills.map((skill) => (
          <SkillBadge key={skill} skill={skill} size="sm" />
        ))}
      </div>

      {/* Hidden +N button for measuring its width */}
      <div
        ref={plusBtnRef}
        className="absolute pointer-events-none"
        style={{ visibility: "hidden" }}
        aria-hidden="true"
      >
        <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-mono font-medium">
          +{overflowCount || 1}
        </span>
      </div>

      {/* Avatar */}
      <div className={`w-full aspect-square mb-4 overflow-hidden ${
        isCoreTeam ? "ring-2 ring-amber-500/50" : "bg-brand-purple/10"
      }`}>
        {member.avatar_url ? (
          <img
            src={member.avatar_url}
            alt={member.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center font-bold text-3xl font-mono ${
            isCoreTeam ? "bg-amber-500/10 text-amber-400" : "bg-brand-purple/10 text-brand-purple-light"
          }`}>
            {getInitials(member.name)}
          </div>
        )}
      </div>

      {/* Name */}
      <h3 className={`font-mono font-bold text-sm uppercase tracking-wider text-center mb-2 ${
        isCoreTeam ? "text-amber-400" : "text-white"
      }`}>
        {member.name}
      </h3>

      {/* Title */}
      <p className="text-xs text-text-secondary text-center mb-3 font-mono">
        {member.title}
      </p>

      {/* Skills — single row + hover popover for overflow */}
      <div className="relative" ref={skillsRowRef}>
        <div className="flex gap-1.5" style={{ flexWrap: "nowrap", overflow: "hidden" }}>
          {visibleSkills.map((skill) => (
            <SkillBadge key={skill} skill={skill} size="sm" golden={isCoreTeam} />
          ))}
          {hasOverflow && (
            <span
              ref={plusTagRef}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className={`inline-flex items-center shrink-0 px-2.5 py-1 text-[10px] font-mono font-medium rounded-sm cursor-default select-none ${
                isCoreTeam
                  ? "bg-amber-500/10 text-amber-400/80"
                  : "bg-[#ffffff0a] text-text-secondary"
              }`}
            >
              +{overflowCount}
            </span>
          )}
        </div>

        {/* Hover popover — arrow centered on +N button */}
        {hovered && hasOverflow && (
          <div
            className={`absolute bottom-full left-0 right-0 mb-2 p-2 rounded-lg flex flex-wrap gap-1.5 z-50 shadow-xl ${
              isCoreTeam
                ? "bg-amber-950/90 border border-amber-500/40"
                : "bg-[#1a1a1a] border border-white/15"
            }`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div
              className={`absolute top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] ${
                isCoreTeam ? "border-t-amber-500/40" : "border-t-white/15"
              }`}
              style={{
                left: (() => {
                  const tag = plusTagRef.current;
                  const row = skillsRowRef.current;
                  if (!tag || !row) return 16;
                  return tag.offsetLeft + tag.offsetWidth / 2 - 6;
                })(),
              }}
            />
            {hiddenSkills.map((skill) => (
              <SkillBadge key={skill} skill={skill} size="sm" golden={isCoreTeam} />
            ))}
          </div>
        )}
      </div>

      {/* Social link */}
      {member.twitter_handle && (
        <a
          href={`https://x.com/${member.twitter_handle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-5 w-7 h-7 flex items-center justify-center text-text-muted hover:text-brand-green transition-colors"
          aria-label={`${member.name} on Twitter`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
      )}
    </motion.div>
  );
}
