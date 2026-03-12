import { motion } from "framer-motion";
import { SOCIAL_LINKS } from "@/lib/constants";

interface HeroSectionProps {
  content?: Record<string, string>;
}

export function HeroSection({ content }: HeroSectionProps) {
  const headline = content?.headline || "The Home for Solana Builders in Malaysia";
  const description = content?.description || "Connect, collaborate, and grow together with a community of founders, developers, and creators shaping the future on Solana.";
  const ctaPrimary = content?.cta_primary || "Join Community";
  const ctaSecondary = content?.cta_secondary || "Explore Opportunities";
  return (
    <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-28 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-brand-purple/[0.07] blur-[120px]" />
      </div>

      <div className="relative max-w-[1200px] mx-auto px-6">
        {/* Centered text */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1], delay: 0.08 }}
            className="text-fluid-3xl font-semibold tracking-tight leading-[1.08] text-white"
          >
            {headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1], delay: 0.16 }}
            className="mt-5 text-fluid-lg text-text-secondary max-w-xl mx-auto leading-relaxed"
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1], delay: 0.24 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <a
              href={SOCIAL_LINKS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors duration-150"
            >
              {ctaPrimary}
              <svg className="ml-2 w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
            <a
              href="https://earn.superteam.fun"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-border-default text-white text-sm font-medium hover:bg-[#ffffff08] transition-colors duration-150"
            >
              {ctaSecondary}
            </a>
          </motion.div>
        </div>

        {/* Community image grid — placeholder cards mimicking event photos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.35 }}
          className="mt-16 lg:mt-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Builder Night KL", color: "from-brand-purple/20 to-brand-purple/5" },
              { label: "Hackathon 2025", color: "from-brand-green/15 to-brand-green/5" },
              { label: "Solana Workshop", color: "from-[#09f]/15 to-[#09f]/5" },
              { label: "Community Meetup", color: "from-[#eab308]/15 to-[#eab308]/5" },
            ].map((item, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-xl border border-border-subtle bg-bg-card overflow-hidden relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`} />
                <div className="absolute inset-0 flex items-end p-4">
                  <span className="text-xs font-medium text-text-secondary">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
