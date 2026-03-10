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
      <div className="max-w-[1200px] mx-auto px-6">
        <AnimatedSection>
          <SectionHeading
            label="Ecosystem"
            title="Partners & projects"
            description="Working with leading projects in the Solana ecosystem."
            align="center"
          />
        </AnimatedSection>

        <AnimatedSection stagger className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {partners.map((partner) => (
            <AnimatedItem key={partner.id}>
              <a
                href={partner.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group glass-card rounded-2xl flex flex-col items-center justify-center p-6 transition-all duration-300 aspect-square"
              >
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="w-12 h-12 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-[#ffffff0a] flex items-center justify-center text-text-muted font-bold text-sm">
                    {getInitials(partner.name)}
                  </div>
                )}
                <span className="mt-3 text-xs font-medium text-text-secondary group-hover:text-white transition-colors text-center">
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
