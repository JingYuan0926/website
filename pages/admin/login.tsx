import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) {
      toast.error("Supabase is not configured. Add environment variables to enable auth.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    router.push("/admin");
  }

  return (
    <>
      <Head>
        <title>Admin Login — Superteam Malaysia</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-bg px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-10 h-10 rounded-lg bg-brand-purple flex items-center justify-center font-bold text-sm text-white mx-auto mb-4">
              ST
            </div>
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-sm text-text-secondary mt-1">
              Sign in to manage content
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-text-secondary mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-bg-card border border-border-subtle rounded-lg text-white placeholder:text-text-muted focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20"
                placeholder="admin@superteam.my"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-text-secondary mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-bg-card border border-border-subtle rounded-lg text-white placeholder:text-text-muted focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-brand-purple text-white font-semibold text-sm hover:bg-brand-purple-light disabled:opacity-50 transition-colors duration-[var(--duration-fast)]"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {!supabase && (
            <p className="mt-6 text-xs text-text-muted text-center leading-relaxed">
              Supabase not configured. Set <code className="text-brand-purple-light">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code className="text-brand-purple-light">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in{" "}
              <code className="text-brand-purple-light">.env.local</code>
            </p>
          )}
        </div>
      </div>
    </>
  );
}
