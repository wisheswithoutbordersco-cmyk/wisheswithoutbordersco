/**
 * Pinterest Auto-Poster
 * ─────────────────────
 * Creates Pins on a Pinterest Business board for each product in our DB.
 *
 * Activation: set PINTEREST_ACCESS_TOKEN + PINTEREST_BOARD_ID in Railway env.
 * Until then, all helpers gracefully no-op so the rest of the app is unaffected.
 *
 * Pinterest API docs: https://developers.pinterest.com/docs/api/v5/
 */

const PINTEREST_API_BASE = "https://api.pinterest.com/v5";

export interface PinterestConfig {
  accessToken: string;
  boardId: string;
}

export function getPinterestConfig(): PinterestConfig | null {
  const accessToken = process.env.PINTEREST_ACCESS_TOKEN;
  const boardId = process.env.PINTEREST_BOARD_ID;
  if (!accessToken || !boardId) return null;
  return { accessToken, boardId };
}

export interface CreatePinInput {
  title: string;
  description: string;
  link: string;        // where the Pin clicks through to (your product page)
  imageUrl: string;    // public image URL (cover image)
  altText?: string;
}

export interface CreatePinResult {
  ok: boolean;
  pinId?: string;
  pinUrl?: string;
  error?: string;
}

/**
 * Post a single Pin. Safe to call when the API isn't configured — returns
 * { ok: false, error: "not_configured" } instead of throwing.
 */
export async function createPin(
  input: CreatePinInput,
  config: PinterestConfig | null = getPinterestConfig(),
): Promise<CreatePinResult> {
  if (!config) {
    return { ok: false, error: "Pinterest not configured (set PINTEREST_ACCESS_TOKEN and PINTEREST_BOARD_ID)" };
  }

  try {
    const res = await fetch(`${PINTEREST_API_BASE}/pins`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        board_id: config.boardId,
        title: input.title.slice(0, 100),
        description: input.description.slice(0, 500),
        link: input.link,
        alt_text: (input.altText ?? input.title).slice(0, 500),
        media_source: {
          source_type: "image_url",
          url: input.imageUrl,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { ok: false, error: `Pinterest API ${res.status}: ${errText.slice(0, 200)}` };
    }

    const data = await res.json() as { id: string };
    return {
      ok: true,
      pinId: data.id,
      pinUrl: `https://www.pinterest.com/pin/${data.id}/`,
    };
  } catch (err: any) {
    return { ok: false, error: err.message ?? String(err) };
  }
}

/**
 * Compose Pin copy for a Wishes Without Borders product.
 * Optimized for SEO + repins (long-tail keywords, clear CTA, country-specific tags).
 */
export function composePinCopy(product: {
  productName: string;
  description: string | null;
  country: string | null;
  category: string | null;
  price: number;
}): { title: string; description: string } {
  const country = product.country ?? "World";
  const priceUsd = (product.price / 100).toFixed(2);

  const title = `${product.productName} — Printable Activity for Kids`;

  const baseDesc = product.description?.trim() ||
    `Discover ${country} through this fun, educational printable activity. Perfect for homeschool, classroom, or weekend learning.`;

  const tags = [country, "printable", "kids activity", "homeschool", "geography for kids", "world cultures"]
    .filter(Boolean)
    .map((t) => `#${t.toString().replace(/\s+/g, "")}`)
    .join(" ");

  const description = `${baseDesc}\n\n📚 Instant download · $${priceUsd}\n🌍 Explore the world one country at a time\n\n${tags}`;

  return { title, description };
}
