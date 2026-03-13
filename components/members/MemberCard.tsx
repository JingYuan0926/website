import { motion } from "framer-motion";
import { SkillBadge } from "@/components/shared/SkillBadge";
import { getInitials } from "@/lib/utils";
import type { Member } from "@/lib/types";

interface MemberCardProps {
  member: Member;
  index: number;
}

function CornerBrackets() {
  return (
    <>
      {/* Top-left */}
      <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/40" />
      {/* Top-right */}
      <span className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/40" />
      {/* Bottom-left */}
      <span className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/40" />
      {/* Bottom-right */}
      <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/40" />
    </>
  );
}

export function MemberCard({ member, index }: MemberCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.25, 1, 0.5, 1],
        delay: Math.min(index * 0.05, 0.4),
      }}
      className="group relative p-5 bg-[#0a0a0a] border border-white/[0.06] hover:border-white/20 transition-all duration-[var(--duration-normal)]"
    >
      <CornerBrackets />

      {/* Avatar */}
      <div className="w-full aspect-square mb-4 bg-brand-purple/10 overflow-hidden">
        {member.avatar_url ? (
          <img
            src={member.avatar_url}
            alt={member.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-purple-light font-bold text-3xl font-mono">
            {getInitials(member.name)}
          </div>
        )}
      </div>

      {/* Name */}
      <h3 className="font-mono font-bold text-sm uppercase tracking-wider text-white text-center mb-2">
        {member.name}
      </h3>

      {/* Title */}
      <p className="text-xs text-text-secondary text-center mb-3 font-mono">
        {member.title}
      </p>

      {/* Skills as tags */}
      <div className="flex flex-wrap gap-1.5">
        {member.skills.map((skill) => (
          <SkillBadge key={skill} skill={skill} size="sm" />
        ))}
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
