import { AnimatedSection, AnimatedItem } from "@/components/shared/AnimatedSection";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { getInitials } from "@/lib/utils";
import type { Partner } from "@/lib/types";

interface PartnersSectionProps {
  partners: Partner[];
}

export function PartnersSection({ partners }: PartnersSectionProps) {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <AnimatedSection>
          <SectionHeading
            label="Ecosystem"
            title="Partners & projects"
            description="Working with leading projects in the Solana ecosystem."
            align="center"
          />
        </AnimatedSection>

        <AnimatedSection stagger className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {partners.map((partner) => (
            <AnimatedItem key={partner.id}>
              <a
                href={partner.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-6 rounded-xl border border-border-subtle hover:border-brand-purple/30 bg-surface-0 hover:bg-surface-1 transition-all duration-[var(--duration-normal)] aspect-square"
              >
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="w-12 h-12 object-contain grayscale group-hover:grayscale-0 transition-all duration-[var(--duration-normal)]"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-surface-2 group-hover:bg-surface-3 flex items-center justify-center text-text-muted font-bold text-sm transition-colors duration-[var(--duration-normal)]">
                    {getInitials(partner.name)}
                  </div>
                )}
                <span className="mt-3 text-xs font-medium text-text-secondary group-hover:text-text-primary transition-colors text-center">
                  {partner.name}
                </span>
              </a>
            </AnimatedItem>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}
