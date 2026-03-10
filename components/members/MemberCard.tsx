import { motion } from "framer-motion";
import { SkillBadge } from "@/components/shared/SkillBadge";
import { getInitials } from "@/lib/utils";
import type { Member } from "@/lib/types";

interface MemberCardProps {
  member: Member;
  index: number;
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
      className="group p-6 rounded-xl border border-border-subtle bg-bg hover:border-brand-purple/30 hover:bg-bg-card transition-all duration-[var(--duration-normal)]"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        {member.avatar_url ? (
          <img
            src={member.avatar_url}
            alt={member.name}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-border-subtle group-hover:ring-brand-purple/20 transition-all"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-brand-purple/15 flex items-center justify-center text-brand-purple-light font-semibold text-base ring-2 ring-border-subtle group-hover:ring-brand-purple/20 transition-all">
            {getInitials(member.name)}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm">
            {member.name}
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            {member.title}
          </p>
        </div>

        {/* Social */}
        {member.twitter_handle && (
          <a
            href={`https://x.com/${member.twitter_handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 w-8 h-8 rounded-lg bg-bg-card-hover flex items-center justify-center text-text-muted hover:text-white hover:bg-bg-elevated transition-colors"
            aria-label={`${member.name} on Twitter`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        )}
      </div>

      {/* Bio */}
      {member.bio && (
        <p className="mt-4 text-xs text-text-secondary leading-relaxed line-clamp-2">
          {member.bio}
        </p>
      )}

      {/* Skills */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {member.skills.map((skill) => (
          <SkillBadge key={skill} skill={skill} size="sm" />
        ))}
      </div>

      {/* Wallet badge (Web3 identity) */}
      {member.wallet_address && (
        <div className="mt-3 text-[10px] text-text-muted font-mono truncate">
          {member.wallet_address.slice(0, 4)}...{member.wallet_address.slice(-4)}
        </div>
      )}
    </motion.div>
  );
}
