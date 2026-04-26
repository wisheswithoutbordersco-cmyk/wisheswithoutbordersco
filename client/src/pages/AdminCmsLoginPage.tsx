import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

/**
 * Admin CMS login page.
 *
 * Email + password form. Server validates against ADMIN_EMAIL/ADMIN_PASSWORD
 * env vars (configured in Railway) and sets a session cookie. Bypasses the
 * external Manus OAuth flow entirely.
 */
export default function AdminCmsLoginPage() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const utils = trpc.useUtils();
  const loginMutation = trpc.auth.loginWithPassword.useMutation({
    onSuccess: async () => {
      // Clean up any stale token from earlier flow
      try {
        localStorage.removeItem("admin-cms-token");
      } catch {}
      // Refresh auth state, then navigate to dashboard
      await utils.auth.me.invalidate();
      navigate("/admin/cms", { replace: true });
    },
    onError: err => {
      setError(err.message || "Login failed");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    loginMutation.mutate({ email: email.trim(), password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6ec] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#c89a3a] flex items-center justify-center mb-3">
            <span className="text-white text-xl">🌍</span>
          </div>
          <h1 className="text-2xl font-serif text-gray-900">Admin Sign In</h1>
          <p className="text-sm text-gray-500 mt-1 text-center">
            Wishes Without Borders CMS
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c89a3a] focus:border-transparent"
              placeholder="you@example.com"
              disabled={loginMutation.isPending}
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c89a3a] focus:border-transparent"
              placeholder="••••••••"
              disabled={loginMutation.isPending}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full rounded-lg bg-[#c89a3a] hover:bg-[#b8892a] text-white font-medium py-2.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-[#c89a3a] hover:underline"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
