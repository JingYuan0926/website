import { motion } from "framer-motion";
import { SOCIAL_LINKS } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Gradient orbs */}
        <div className="absolute -top-[30%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-brand-purple/8 blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[40vw] h-[40vw] rounded-full bg-brand-green/5 blur-[100px]" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(oklch(93% 0.01 285) 1px, transparent 1px),
                              linear-gradient(90deg, oklch(93% 0.01 285) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-16 lg:pt-32 lg:pb-20">
        {/* Two column layout on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text content */}
          <div>
            {/* Tag */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2 border border-border-subtle mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
              <span className="text-xs font-medium text-text-secondary tracking-wide">
                Solana Ecosystem &middot; Malaysia
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1], delay: 0.1 }}
              className="text-fluid-2xl font-bold tracking-tight leading-[1.1] text-text-primary"
            >
              Build the future of{" "}
              <span className="text-brand-purple-light">Web3</span>
              <br />
              from{" "}
              <span className="relative inline-block">
                Malaysia
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 200 8"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M1 5.5C40 2.5 80 1.5 120 3.5C160 5.5 185 4 199 2.5"
                    stroke="oklch(80% 0.2 155)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
              className="mt-5 text-fluid-base text-text-secondary max-w-lg leading-relaxed"
            >
              Superteam Malaysia connects builders, designers, and creators with
              opportunities in the Solana ecosystem. Earn, learn, and ship.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1], delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row gap-3"
            >
              <a
                href={SOCIAL_LINKS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-brand-purple text-white font-semibold text-sm hover:bg-brand-purple-light transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
              >
                Join Community
                <svg className="ml-2 w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </a>
              <a
                href="https://earn.superteam.fun"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-border-default text-text-primary font-semibold text-sm hover:bg-surface-2 transition-colors duration-[var(--duration-fast)]"
              >
                Explore Opportunities
              </a>
            </motion.div>
          </div>

          {/* Right side — visual element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-md aspect-square">
              {/* Abstract visual — overlapping circles representing community */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-64 h-64">
                  {/* Orbit rings */}
                  <div className="absolute inset-0 rounded-full border border-border-subtle" />
                  <div className="absolute inset-6 rounded-full border border-border-subtle" />
                  <div className="absolute inset-12 rounded-full border border-border-subtle" />

                  {/* Center logo */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center">
                      <span className="text-2xl font-bold text-brand-purple-light">ST</span>
                    </div>
                  </div>

                  {/* Floating nodes */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    className="absolute inset-0"
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-brand-green" />
                  </motion.div>
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                    className="absolute inset-6"
                  >
                    <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-brand-purple-light" />
                  </motion.div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                    className="absolute inset-0"
                  >
                    <div className="absolute bottom-4 left-0 w-3.5 h-3.5 rounded-full bg-accent-gold" />
                  </motion.div>

                  {/* Glow */}
                  <div className="absolute inset-8 rounded-full bg-brand-purple/5 blur-xl" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <div className="w-5 h-8 rounded-full border-2 border-text-muted/30 flex justify-center pt-1.5">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-1 h-1 rounded-full bg-text-muted/50"
          />
        </div>
      </motion.div>
    </section>
  );
}
