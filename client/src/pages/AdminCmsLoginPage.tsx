import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Legacy CMS login page — no longer needed.
 *
 * Authentication is now handled by the standard OAuth cookie-session flow.
 * If a user bookmarked /admin/cms/login, redirect them to /admin/cms where
 * the useAuth() hook will handle sign-in if needed.
 */
export default function AdminCmsLoginPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    // Clean up any stale localStorage token from the old flow
    localStorage.removeItem("admin-cms-token");
    navigate("/admin/cms", { replace: true });
  }, [navigate]);

  return null;
}
