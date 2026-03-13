import { AnimatedSection, AnimatedItem } from "@/components/shared/AnimatedSection";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Markdown } from "@/components/shared/Markdown";
import { ExternalLink } from "lucide-react";
import type { Announcement } from "@/lib/types";

interface AnnouncementsSectionProps {
  announcements: Announcement[];
}

export function AnnouncementsSection({ announcements }: AnnouncementsSectionProps) {
  if (announcements.length === 0) return null;

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-[1200px] mx-auto px-6">
        <AnimatedSection>
          <SectionHeading
            label="News"
            title="Announcements"
            description="Latest updates from Superteam Malaysia."
            align="center"
          />
        </AnimatedSection>

        <AnimatedSection stagger className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {announcements.map((a) => (
            <AnimatedItem key={a.id}>
              <div className="glass-card rounded-2xl overflow-hidden h-full flex flex-col">
                {a.image_url && (
                  <img
                    src={a.image_url}
                    alt={a.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-base font-semibold text-text-primary mb-2">
                    {a.title}
                  </h3>
                  <div className="text-sm text-text-secondary leading-relaxed line-clamp-3 flex-1">
                    <Markdown content={a.content} />
                  </div>
                  {a.link_url && (
                    <a
                      href={a.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-brand-purple-light hover:underline"
                    >
                      Read more
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </AnimatedItem>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}
