import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import {
  Users,
  Handshake,
  MessageCircle,
  HelpCircle,
  Settings,
  LayoutDashboard,
  Menu,
  X,
  FileText,
  Megaphone,
  Sun,
  Moon,
} from "lucide-react";

const SIDEBAR_LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/partners", label: "Partners", icon: Handshake },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageCircle },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("admin-theme") as "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle("light", saved === "light");
    }
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("admin-theme", next);
    document.documentElement.classList.toggle("light", next === "light");
  }

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-60 bg-bg-card border-r border-border-subtle flex flex-col transition-transform duration-[var(--duration-normal)] ease-[var(--ease-out-quart)]",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-border-subtle">
          <div className="w-7 h-7 rounded-md bg-brand-purple flex items-center justify-center font-bold text-xs text-white">
            ST
          </div>
          <span className="text-sm font-semibold text-text-primary">
            Admin
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden ml-auto text-text-muted"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {SIDEBAR_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive =
              router.pathname === href ||
              (href !== "/admin" && router.pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-[var(--duration-fast)]",
                  isActive
                    ? "bg-brand-purple/10 text-brand-purple-light"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-card-hover"
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border-subtle flex items-center justify-between">
          <Link href="/" className="text-xs text-text-muted hover:text-brand-purple-light transition-colors">
            &larr; Back to site
          </Link>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-card-hover transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-border-subtle flex items-center gap-4 px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-text-secondary"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-base font-semibold text-text-primary">{title}</h1>
        </header>

        {/* Page content */}
        <div className="p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
