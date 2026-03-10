import Link from "next/link";
import { AnimatedSection, AnimatedItem } from "@/components/shared/AnimatedSection";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SkillBadge } from "@/components/shared/SkillBadge";
import { getInitials } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import type { Member } from "@/lib/types";

interface MemberSpotlightProps {
  members: Member[];
}

export function MemberSpotlight({ members }: MemberSpotlightProps) {
  const spotlightMembers = members.filter((m) => m.is_spotlight).slice(0, 6);

  return (
    <section className="py-24 lg:py-32 bg-surface-1">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <AnimatedSection>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-16">
            <SectionHeading
              label="Our Builders"
              title="Meet the community"
              description="Talented builders, designers, and creators shaping Malaysia's Web3 landscape."
            />
            <Link
              href="/members"
              className="text-sm font-medium text-brand-purple-light hover:text-brand-purple transition-colors duration-[var(--duration-fast)] inline-flex items-center gap-1.5 shrink-0"
            >
              View all members
              <ArrowRight size={14} />
            </Link>
          </div>
        </AnimatedSection>

        <AnimatedSection stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {spotlightMembers.map((member) => (
            <AnimatedItem key={member.id}>
              <div className="group p-6 rounded-xl border border-border-subtle bg-surface-0 hover:border-brand-purple/30 transition-all duration-[var(--duration-normal)]">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  {member.avatar_url ? (
                    <img
                      src={member.avatar_url}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-brand-purple/15 flex items-center justify-center text-brand-purple-light font-semibold text-sm">
                      {getInitials(member.name)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary text-sm truncate">
                      {member.name}
                    </h3>
                    <p className="text-xs text-text-secondary mt-0.5 truncate">
                      {member.title}
                    </p>
                  </div>

                  {/* Twitter */}
                  {member.twitter_handle && (
                    <a
                      href={`https://x.com/${member.twitter_handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-text-muted hover:text-text-primary transition-colors"
                      aria-label={`${member.name} on Twitter`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
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
                  {member.skills.slice(0, 3).map((skill) => (
                    <SkillBadge key={skill} skill={skill} size="sm" />
                  ))}
                </div>
              </div>
            </AnimatedItem>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}
