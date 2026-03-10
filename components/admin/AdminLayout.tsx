import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import {
  Users,
  Calendar,
  Handshake,
  MessageCircle,
  HelpCircle,
  Settings,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

const SIDEBAR_LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/partners", label: "Partners", icon: Handshake },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageCircle },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/admin/login");
      } else {
        setUser(data.user);
      }
      setLoading(false);
    });
  }, [router]);

  async function handleLogout() {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/admin/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-0">
        <div className="w-6 h-6 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-0 px-6">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-bold text-text-primary mb-3">Admin Dashboard</h1>
          <p className="text-sm text-text-secondary mb-6">
            Supabase is not configured. The admin dashboard requires a Supabase
            connection to manage content.
          </p>
          <p className="text-xs text-text-muted">
            Set <code className="text-brand-purple-light">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code className="text-brand-purple-light">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in your{" "}
            <code className="text-brand-purple-light">.env.local</code> file.
          </p>
          <Link
            href="/"
            className="inline-block mt-6 text-sm text-brand-purple-light hover:underline"
          >
            &larr; Back to website
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-0 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-60 bg-surface-1 border-r border-border-subtle flex flex-col transition-transform duration-[var(--duration-normal)] ease-[var(--ease-out-quart)]",
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
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-border-subtle">
          <div className="text-xs text-text-muted truncate mb-2">
            {user?.email}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-text-secondary hover:text-error transition-colors"
          >
            <LogOut size={14} />
            Sign out
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
