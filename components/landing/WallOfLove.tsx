import { AnimatedSection, AnimatedItem } from "@/components/shared/AnimatedSection";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { getInitials } from "@/lib/utils";
import type { Testimonial } from "@/lib/types";

interface WallOfLoveProps {
  testimonials: Testimonial[];
}

export function WallOfLove({ testimonials }: WallOfLoveProps) {
  return (
    <section className="py-24 lg:py-32 bg-surface-1">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
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
          className="mt-16 columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          {testimonials.map((testimonial) => (
            <AnimatedItem key={testimonial.id}>
              <div className="break-inside-avoid p-6 rounded-xl border border-border-subtle bg-surface-0">
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
                    <p className="text-xs font-semibold text-text-primary">
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
