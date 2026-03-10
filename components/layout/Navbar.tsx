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
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-[1200px] mx-auto px-6 pt-4">
        <div
          className={cn(
            "flex items-center justify-between h-14 px-5 rounded-2xl transition-all duration-300",
            "border border-border-subtle backdrop-blur-xl",
            isScrolled ? "bg-[#0f0f0f]/80" : "bg-[#ffffff08]"
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
              <span className="text-[10px] font-bold text-black tracking-tight">ST</span>
            </div>
            <span className="font-semibold text-white text-sm">
              Superteam <span className="text-text-secondary">Malaysia</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors duration-150",
                  router.pathname === link.href
                    ? "text-white bg-[#ffffff10]"
                    : "text-text-muted hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="w-px h-5 bg-border-subtle mx-2" />
            <a
              href={SOCIAL_LINKS.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-text-muted hover:text-white transition-colors duration-150"
            >
              Follow on X
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-white"
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {isMobileOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileOpen && (
          <div className="md:hidden mt-2 rounded-2xl border border-border-subtle bg-[#0f0f0f]/95 backdrop-blur-xl overflow-hidden">
            <div className="p-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                    router.pathname === link.href
                      ? "text-white bg-[#ffffff10]"
                      : "text-text-muted hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2.5 text-sm font-medium text-text-muted hover:text-white"
              >
                Follow on X
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
