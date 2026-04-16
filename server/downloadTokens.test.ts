import { describe, expect, it } from "vitest";
import { generateDownloadToken, verifyDownloadToken } from "./downloadTokens";

describe("downloadTokens", () => {
  it("generates a valid token that can be verified", () => {
    const token = generateDownloadToken("product-123", "session-abc");
    expect(token).toBeTruthy();
    expect(token).toContain(".");

    const payload = verifyDownloadToken(token);
    expect(payload).not.toBeNull();
    expect(payload!.productId).toBe("product-123");
    expect(payload!.sessionId).toBe("session-abc");
    expect(payload!.exp).toBeGreaterThan(Date.now());
  });

  it("rejects a tampered token", () => {
    const token = generateDownloadToken("product-123", "session-abc");
    const tampered = token.slice(0, -3) + "xxx";
    const payload = verifyDownloadToken(tampered);
    expect(payload).toBeNull();
  });

  it("rejects an expired token", () => {
    // Generate token with negative TTL (already expired)
    const token = generateDownloadToken("product-123", "session-abc", -1000);
    const payload = verifyDownloadToken(token);
    expect(payload).toBeNull();
  });
});
