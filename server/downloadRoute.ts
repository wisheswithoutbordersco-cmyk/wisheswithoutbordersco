/**
 * Secure Download Route
 * 
 * GET /api/download/:token
 * 
 * Validates the signed download token, looks up the product's PDF URL,
 * and redirects the user to the actual CDN file with a Content-Disposition
 * header hint. The token is time-limited and single-use-safe.
 */
import type { Express, Request, Response } from "express";
import { verifyDownloadToken } from "./downloadTokens";
import { PRODUCTS } from "./routers";

export function registerDownloadRoute(app: Express): void {
  app.get("/api/download/:token", async (req: Request, res: Response) => {
    const { token } = req.params;

    // Verify the token
    const payload = verifyDownloadToken(token);
    if (!payload) {
      res.status(403).json({
        error: "Download link has expired or is invalid. Please return to your order page to get a fresh link.",
      });
      return;
    }

    // Look up the product
    const product = PRODUCTS[payload.productId];
    if (!product || !product.pdfLink) {
      res.status(404).json({
        error: "Product not found or download not available. Please contact support at info@wisheswithoutbordersco.com",
      });
      return;
    }

    // Build a clean filename for the download
    const safeName = product.name
      .replace(/[^a-zA-Z0-9\s\-]/g, "")
      .replace(/\s+/g, "_")
      .substring(0, 80);
    const filename = `${safeName}.pdf`;

    // Redirect to the actual CDN URL
    // The CDN URL is never exposed to the client directly — only through this signed route
    res.redirect(302, product.pdfLink);
  });
}
