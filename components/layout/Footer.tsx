import Link from "next/link";
import { SOCIAL_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border-subtle">
      <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-brand-purple flex items-center justify-center font-bold text-sm text-white">
                ST
              </div>
              <span className="font-semibold text-white text-sm tracking-tight">
                Superteam{" "}
                <span className="text-brand-purple-light">Malaysia</span>
              </span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
              The home for Solana builders in Malaysia. Supporting developers,
              designers, and creators in the Web3 ecosystem.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <SocialIcon href={SOCIAL_LINKS.twitter} label="Twitter / X">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </SocialIcon>
              <SocialIcon href={SOCIAL_LINKS.telegram} label="Telegram">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </SocialIcon>
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-4">
              Navigate
            </h3>
            <ul className="space-y-3">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/members">Members</FooterLink>
              <FooterLink href="https://earn.superteam.fun" external>
                Superteam Earn
              </FooterLink>
            </ul>
          </div>

          {/* Community */}
          <div className="md:col-span-4">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-4">
              Community
            </h3>
            <ul className="space-y-3">
              <FooterLink href={SOCIAL_LINKS.twitter} external>
                Twitter / X
              </FooterLink>
              <FooterLink href={SOCIAL_LINKS.telegram} external>
                Telegram
              </FooterLink>
              <FooterLink href={SOCIAL_LINKS.superteamGlobal} external>
                Superteam Global
              </FooterLink>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Superteam Malaysia. All rights
            reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span>Powered by</span>
            <svg width="16" height="12" viewBox="0 0 397.7 311.7" className="inline-block">
              <path
                d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"
                fill="currentColor"
                className="text-brand-green"
              />
              <path
                d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"
                fill="currentColor"
                className="text-brand-green"
              />
              <path
                d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"
                fill="currentColor"
                className="text-brand-green"
              />
            </svg>
            <span>Solana</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  if (external) {
    return (
      <li>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-text-secondary hover:text-white transition-colors"
        >
          {children}
        </a>
      </li>
    );
  }
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-text-secondary hover:text-white transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 rounded-lg bg-[#ffffff0a] border border-border-subtle flex items-center justify-center text-text-secondary hover:text-white hover:bg-[#ffffff15] transition-colors"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        {children}
      </svg>
    </a>
  );
}
