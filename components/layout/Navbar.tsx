import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { NAV_LINKS, SOCIAL_LINKS } from "@/lib/constants";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [router.pathname]);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all",
        "duration-[var(--duration-normal)] ease-[var(--ease-out-quart)]",
        isScrolled
          ? "bg-surface-0/90 backdrop-blur-md border-b border-border-subtle"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-brand-purple flex items-center justify-center font-bold text-sm text-white">
              ST
            </div>
            <span className="font-semibold text-text-primary text-sm tracking-tight">
              Superteam{" "}
              <span className="text-brand-purple-light">Malaysia</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-[var(--duration-fast)]",
                  router.pathname === link.href
                    ? "text-text-primary"
                    : "text-text-muted hover:text-text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={SOCIAL_LINKS.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-surface-0 bg-brand-purple hover:bg-brand-purple-light px-4 py-2 rounded-lg transition-colors duration-[var(--duration-fast)]"
            >
              Join Community
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-text-primary"
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {isMobileOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div className="md:hidden bg-surface-1 border-t border-border-subtle">
          <div className="px-6 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block py-3 text-sm font-medium transition-colors",
                  router.pathname === link.href
                    ? "text-text-primary"
                    : "text-text-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={SOCIAL_LINKS.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-3 text-center text-sm font-medium text-surface-0 bg-brand-purple px-4 py-2.5 rounded-lg"
            >
              Join Community
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
