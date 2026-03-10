import { AnimatedSection, AnimatedItem } from "@/components/shared/AnimatedSection";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { getInitials } from "@/lib/utils";
import type { Testimonial } from "@/lib/types";

interface WallOfLoveProps {
  testimonials: Testimonial[];
}

export function WallOfLove({ testimonials }: WallOfLoveProps) {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-[1200px] mx-auto px-6">
        <AnimatedSection>
          <SectionHeading
            label="Community"
            title="Wall of love"
            description="Hear from builders and ecosystem leaders in our community."
            align="center"
          />
        </AnimatedSection>

        <AnimatedSection
          stagger
          className="mt-14 columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
        >
          {testimonials.map((testimonial) => (
            <AnimatedItem key={testimonial.id}>
              <div className="break-inside-avoid glass-card rounded-2xl p-6">
                {/* Quote */}
                <p className="text-sm text-text-secondary leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* Author */}
                <div className="mt-5 flex items-center gap-3">
                  {testimonial.author_avatar_url ? (
                    <img
                      src={testimonial.author_avatar_url}
                      alt={testimonial.author_name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-purple/15 flex items-center justify-center text-brand-purple-light font-semibold text-[10px]">
                      {getInitials(testimonial.author_name)}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-white">
                      {testimonial.author_name}
                    </p>
                    {testimonial.author_title && (
                      <p className="text-[11px] text-text-muted">
                        {testimonial.author_title}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedItem>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}
