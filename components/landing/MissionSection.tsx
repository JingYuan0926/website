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

export function MissionSection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <AnimatedSection>
          <SectionHeading
            label="What We Do"
            title="Empowering Malaysia's Web3 builders"
            description="From mentorship to funding, we provide everything builders need to succeed in the Solana ecosystem."
          />
        </AnimatedSection>

        <AnimatedSection stagger className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border-subtle rounded-2xl overflow-hidden">
          {MISSION_PILLARS.map((pillar) => {
            const Icon = ICON_MAP[pillar.icon];
            return (
              <AnimatedItem key={pillar.title}>
                <div className="bg-surface-0 p-8 lg:p-10 group hover:bg-surface-1 transition-colors duration-[var(--duration-normal)]">
                  <div className="w-10 h-10 rounded-lg bg-brand-purple/10 flex items-center justify-center mb-5 group-hover:bg-brand-purple/15 transition-colors duration-[var(--duration-normal)]">
                    {Icon && <Icon size={20} className="text-brand-purple-light" />}
                  </div>
                  <h3 className="text-base font-semibold text-text-primary mb-2">
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
