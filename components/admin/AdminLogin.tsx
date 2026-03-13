import { useState } from "react";
import { useAdminAuth } from "@/lib/adminAuth";
import { LogIn } from "lucide-react";

export function AdminLogin() {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!login(email, password)) {
      setError("Invalid email or password");
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-purple/10 mb-4">
            <LogIn size={24} className="text-brand-purple-light" />
          </div>
          <h1 className="text-xl font-bold text-text-primary">Admin Login</h1>
          <p className="text-sm text-text-muted mt-1">Sign in to manage the website</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="w-full px-3 py-2.5 text-sm bg-bg-card border border-border-subtle rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-purple/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
              className="w-full px-3 py-2.5 text-sm bg-bg-card border border-border-subtle rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-purple/50"
            />
          </div>

          {error && (
            <p className="text-xs text-error text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2.5 text-sm font-semibold bg-brand-purple text-white rounded-lg hover:bg-brand-purple-light transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
