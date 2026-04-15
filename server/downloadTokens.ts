/**
 * Secure Download Token System
 *
 * Generates time-limited, HMAC-signed tokens for PDF downloads.
 * Tokens encode the product ID, order session ID, and expiry time.
 * This prevents direct exposure of CDN URLs to the public.
 *
 * FIX 4: DOWNLOAD_SECRET is now required. The random fallback has been removed
 * because it caused download links to break on every server restart and fail
 * across load-balanced instances. A hardcoded development default is used only
 * when NODE_ENV !== "production", with a clear warning.
 */
import crypto from "crypto";

// ── FIX 4: Stable DOWNLOAD_SECRET ──────────────────────────────────────────
// REMOVED: crypto.randomBytes(32) fallback that broke links on restart.
//
// Priority:
//   1. Environment variable DOWNLOAD_SECRET (REQUIRED in production)
//   2. Hardcoded development default (only in non-production, with warning)
//
const DEV_FALLBACK_SECRET = "wwb-dev-download-secret-do-not-use-in-production-2026";

function getDownloadSecret(): string {
  const envSecret = process.env.DOWNLOAD_SECRET;
  if (envSecret) {
    return envSecret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "DOWNLOAD_SECRET environment variable is not set. " +
      "Refusing to start in production with an insecure fallback. " +
      'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    );
  }

  console.warn(
    "[downloadTokens] WARNING: DOWNLOAD_SECRET is not set. Using hardcoded development default. " +
    "This is acceptable for local development but MUST be set in production. " +
    "Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
  );
  return DEV_FALLBACK_SECRET;
}

const DOWNLOAD_SECRET = getDownloadSecret();

// Default token validity: 24 hours
const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000;

interface TokenPayload {
  productId: string;
  sessionId: string;
  exp: number; // expiry timestamp in ms
}

/**
 * Generate a signed download token for a given product + session.
 */
export function generateDownloadToken(
  productId: string,
  sessionId: string,
  ttlMs: number = DEFAULT_TTL_MS
): string {
  const payload: TokenPayload = {
    productId,
    sessionId,
    exp: Date.now() + ttlMs,
  };
  const data = JSON.stringify(payload);
  const encoded = Buffer.from(data).toString("base64url");
  const signature = crypto
    .createHmac("sha256", DOWNLOAD_SECRET)
    .update(encoded)
    .digest("base64url");
  return `${encoded}.${signature}`;
}

/**
 * Verify and decode a download token. Returns the payload if valid, null otherwise.
 */
export function verifyDownloadToken(token: string): TokenPayload | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encoded, signature] = parts;
  const expectedSig = crypto
    .createHmac("sha256", DOWNLOAD_SECRET)
    .update(encoded)
    .digest("base64url");

  // Constant-time comparison to prevent timing attacks
  if (signature.length !== expectedSig.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(encoded, "base64url").toString("utf-8")) as TokenPayload;

    // Check expiry
    if (Date.now() > data.exp) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}
