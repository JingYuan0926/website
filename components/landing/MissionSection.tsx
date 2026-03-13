import { AnimatedSection, AnimatedItem } from "@/components/shared/AnimatedSection";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { MISSION_PILLARS } from "@/lib/constants";
import {
  Code,
  Calendar,
  Coins,
  Briefcase,
  GraduationCap,
  Globe,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  code: Code,
  calendar: Calendar,
  coins: Coins,
  briefcase: Briefcase,
  "graduation-cap": GraduationCap,
  globe: Globe,
};

interface MissionSectionProps {
  content?: Record<string, string>;
}

export function MissionSection({ content }: MissionSectionProps) {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-[1200px] mx-auto px-6">
        <AnimatedSection>
          <SectionHeading
            label="What We Do"
            title={content?.title || "Empowering Malaysia's Solana Builders"}
            description={content?.description || "From mentorship to funding, we provide everything builders need to succeed in the Solana ecosystem."}
            align="center"
          />
        </AnimatedSection>

        <AnimatedSection stagger className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MISSION_PILLARS.map((pillar) => {
            const Icon = ICON_MAP[pillar.icon];
            return (
              <AnimatedItem key={pillar.title}>
                <div className="glass-card rounded-2xl p-6 lg:p-8 h-full transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-[#ffffff0a] border border-border-subtle flex items-center justify-center mb-5">
                    {Icon && <Icon size={18} className="text-text-secondary" />}
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </AnimatedItem>
            );
          })}
        </AnimatedSection>
      </div>
    </section>
  );
}
