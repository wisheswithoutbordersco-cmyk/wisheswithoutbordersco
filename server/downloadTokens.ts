/**
 * Secure Download Token System
 * 
 * Generates time-limited, HMAC-signed tokens for PDF downloads.
 * Tokens encode the product ID, order session ID, and expiry time.
 * This prevents direct exposure of CDN URLs to the public.
 */
import crypto from "crypto";

// Use a server-side secret for signing tokens.
// Falls back to a random secret per-process if not configured (dev mode).
const DOWNLOAD_SECRET = process.env.DOWNLOAD_SECRET || crypto.randomBytes(32).toString("hex");

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
