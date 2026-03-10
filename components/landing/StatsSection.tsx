import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

function AnimatedCounter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const duration = 1500;
    const steps = 40;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const t = currentStep / steps;
      const eased = 1 - Math.pow(1 - t, 4);
      setCount(Math.round(eased * value));

      if (currentStep >= steps) {
        clearInterval(timer);
        setCount(value);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

interface StatItemProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

function StatItem({ label, value, suffix, prefix }: StatItemProps) {
  return (
    <div className="text-center">
      <div className="text-fluid-2xl font-bold text-white leading-none mb-2">
        <AnimatedCounter value={value} suffix={suffix} prefix={prefix} />
      </div>
      <div className="text-sm text-text-secondary font-medium">{label}</div>
    </div>
  );
}

interface StatsSectionProps {
  stats: {
    members_count: number;
    events_hosted: number;
    projects_funded: number;
    bounties_completed: number;
    community_reach: number;
  };
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <AnimatedSection>
          <div className="glass-card rounded-2xl p-8 lg:p-12">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
              <StatItem label="Community Members" value={stats.members_count} suffix="+" />
              <StatItem label="Events Hosted" value={stats.events_hosted} />
              <StatItem label="Projects Funded" value={stats.projects_funded} />
              <StatItem label="Bounties Completed" value={stats.bounties_completed} />
              <StatItem label="Community Reach" value={stats.community_reach} suffix="+" />
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
