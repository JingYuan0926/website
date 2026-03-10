import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

interface StatItemProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

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
      // Ease-out-quart curve
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

function StatItem({ label, value, suffix, prefix }: StatItemProps) {
  return (
    <div className="text-left">
      <div className="text-fluid-2xl font-bold text-text-primary leading-none mb-2">
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
    <section className="py-20 lg:py-24 border-y border-border-subtle">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <AnimatedSection>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
            <StatItem label="Community Members" value={stats.members_count} suffix="+" />
            <StatItem label="Events Hosted" value={stats.events_hosted} />
            <StatItem label="Projects Funded" value={stats.projects_funded} />
            <StatItem label="Bounties Completed" value={stats.bounties_completed} />
            <StatItem label="Community Reach" value={stats.community_reach} suffix="+" />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
