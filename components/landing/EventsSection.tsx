import { AnimatedSection, AnimatedItem } from "@/components/shared/AnimatedSection";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { formatDate, getRelativeTime } from "@/lib/utils";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import type { Event } from "@/lib/types";

interface EventsSectionProps {
  events: Event[];
}

export function EventsSection({ events }: EventsSectionProps) {
  const upcomingEvents = events.filter((e) => e.status === "upcoming");

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-[1200px] mx-auto px-6">
        <AnimatedSection>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
            <SectionHeading
              label="Events"
              title="Connect, learn, build"
              description="Join our meetups, workshops, and hackathons across Malaysia."
            />
            <a
              href="https://lu.ma/SuperteamMY"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-text-secondary hover:text-white transition-colors inline-flex items-center gap-1.5 shrink-0"
            >
              View all on Luma
              <ExternalLink size={14} />
            </a>
          </div>
        </AnimatedSection>

        {upcomingEvents.length > 0 ? (
          <AnimatedSection stagger className="space-y-4">
            {upcomingEvents.map((event) => (
              <AnimatedItem key={event.id}>
                <a
                  href={event.luma_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="glass-card rounded-2xl flex flex-col sm:flex-row gap-6 p-6 lg:p-8 transition-all duration-300">
                    {/* Date block */}
                    <div className="shrink-0 w-16 h-16 rounded-xl bg-[#ffffff0a] border border-border-subtle flex flex-col items-center justify-center">
                      <span className="text-xs font-semibold text-text-muted uppercase">
                        {new Date(event.date).toLocaleDateString("en", { month: "short" })}
                      </span>
                      <span className="text-xl font-bold text-white leading-none">
                        {new Date(event.date).getDate()}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-base font-semibold text-white group-hover:text-brand-purple-light transition-colors">
                            {event.title}
                          </h3>
                          <p className="mt-1.5 text-sm text-text-secondary line-clamp-2">
                            {event.description}
                          </p>
                        </div>
                        <ExternalLink
                          size={16}
                          className="shrink-0 text-text-muted group-hover:text-white transition-colors mt-0.5"
                        />
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-text-muted">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar size={12} />
                          {formatDate(event.date)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={12} />
                          {event.location}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-brand-green/10 text-brand-green font-medium">
                          {getRelativeTime(event.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              </AnimatedItem>
            ))}
          </AnimatedSection>
        ) : (
          <AnimatedSection>
            <div className="glass-card rounded-2xl text-center py-16">
              <Calendar size={32} className="mx-auto text-text-muted mb-3" />
              <p className="text-text-secondary text-sm">
                No upcoming events at the moment. Follow us on{" "}
                <a
                  href="https://x.com/SuperteamMY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:underline"
                >
                  Twitter
                </a>{" "}
                for updates.
              </p>
            </div>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}
