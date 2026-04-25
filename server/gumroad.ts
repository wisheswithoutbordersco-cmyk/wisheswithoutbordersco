/**
 * Gumroad API integration
 *
 * Creates products on the Gumroad storefront via the Gumroad v2 API.
 * Authentication uses a personal access token stored in the
 * GUMROAD_ACCESS_TOKEN environment variable (set in Railway).
 *
 * API endpoint: POST https://api.gumroad.com/v2/products
 *
 * Required env var: GUMROAD_ACCESS_TOKEN
 */

const GUMROAD_API_BASE = "https://api.gumroad.com/v2";

function getGumroadAccessToken(): string {
  const token = process.env.GUMROAD_ACCESS_TOKEN;
  if (!token) throw new Error("GUMROAD_ACCESS_TOKEN is not configured");
  return token;
}

export interface GumroadProductPayload {
  /** Product title */
  name: string;
  /** Product description (plain text or basic HTML) */
  description?: string;
  /** Price in cents (e.g. 499 → $4.99). Gumroad accepts price in cents. */
  price: number;
  /** URL of the digital file (PDF link). */
  url?: string;
  /** Cover image URL for the product thumbnail on Gumroad. */
  preview?: string;
}

export interface GumroadProductResponse {
  success: boolean;
  product: {
    id: string;
    name: string;
    short_url: string;
    url: string;
    price: number;
    description: string;
    preview_url: string | null;
    [key: string]: unknown;
  };
}

/**
 * Create a new product on Gumroad.
 *
 * Maps our internal product fields to the Gumroad v2 POST /products payload:
 *   name        → product title
 *   description → product description
 *   price       → price in cents (integer)
 *   url         → digital file / PDF link
 *   preview     → cover image URL (product thumbnail)
 *
 * Returns the full Gumroad product object on success.
 * Throws a descriptive error on failure.
 */
export async function createGumroadProduct(
  payload: GumroadProductPayload,
): Promise<GumroadProductResponse["product"]> {
  const token = getGumroadAccessToken();

  const body = new URLSearchParams();
  body.append("name", payload.name);
  if (payload.description) body.append("description", payload.description);
  body.append("price", String(payload.price));
  if (payload.url) body.append("url", payload.url);
  if (payload.preview) body.append("preview", payload.preview);

  console.log(`[Gumroad] Creating product: "${payload.name}" at $${(payload.price / 100).toFixed(2)}`);

  const response = await fetch(`${GUMROAD_API_BASE}/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const data = (await response.json()) as GumroadProductResponse;

  if (!response.ok || !data.success) {
    const message = (data as unknown as { message?: string }).message ?? `HTTP ${response.status}`;
    throw new Error(`Gumroad API error: ${message}`);
  }

  console.log(`[Gumroad] Product created: ${data.product.id} → ${data.product.short_url}`);
  return data.product;
}
