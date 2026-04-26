export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
// Defensively fall back to the current origin if VITE_OAUTH_PORTAL_URL is
// missing or malformed — otherwise the entire app crashes with
// "TypeError: Invalid URL" the moment any API call returns unauthenticated.
export const getLoginUrl = () => {
  const rawPortal = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID ?? "";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const redirectUri = `${origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  // Pick the first usable base: explicit env var if it parses, else current origin.
  let base = origin;
  if (rawPortal) {
    try {
      base = new URL(rawPortal).origin;
    } catch {
      base = origin;
    }
  }

  let url: URL;
  try {
    url = new URL(`${base}/app-auth`);
  } catch {
    // Last-resort fallback: redirect to a safe in-app login route so we never crash.
    return `${origin}/admin/cms/login`;
  }
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
