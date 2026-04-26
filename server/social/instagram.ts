/**
 * Instagram Auto-Poster (Graph API)
 * ──────────────────────────────────
 * Creates posts on an Instagram Business account linked to a Facebook Page.
 *
 * Activation: set IG_ACCESS_TOKEN + IG_BUSINESS_ACCOUNT_ID in Railway env.
 *
 * Requires: Instagram Business account, linked Facebook Page, Meta dev app
 * with `instagram_content_publish` permission.
 *
 * Instagram Graph API docs: https://developers.facebook.com/docs/instagram-api
 */

const IG_API_BASE = "https://graph.facebook.com/v21.0";

export interface InstagramConfig {
  accessToken: string;
  businessAccountId: string;
}

export function getInstagramConfig(): InstagramConfig | null {
  const accessToken = process.env.IG_ACCESS_TOKEN;
  const businessAccountId = process.env.IG_BUSINESS_ACCOUNT_ID;
  if (!accessToken || !businessAccountId) return null;
  return { accessToken, businessAccountId };
}

export interface CreateIgPostInput {
  imageUrl: string;
  caption: string;
}

export interface CreateIgPostResult {
  ok: boolean;
  postId?: string;
  error?: string;
}

/**
 * Two-step IG post: (1) create media container, (2) publish it.
 */
export async function createInstagramPost(
  input: CreateIgPostInput,
  config: InstagramConfig | null = getInstagramConfig(),
): Promise<CreateIgPostResult> {
  if (!config) {
    return { ok: false, error: "Instagram not configured (set IG_ACCESS_TOKEN and IG_BUSINESS_ACCOUNT_ID)" };
  }

  try {
    // Step 1: create media container
    const containerRes = await fetch(
      `${IG_API_BASE}/${config.businessAccountId}/media?` +
      new URLSearchParams({
        image_url: input.imageUrl,
        caption: input.caption.slice(0, 2200),
        access_token: config.accessToken,
      }),
      { method: "POST" },
    );

    if (!containerRes.ok) {
      const errText = await containerRes.text();
      return { ok: false, error: `IG container ${containerRes.status}: ${errText.slice(0, 200)}` };
    }

    const container = await containerRes.json() as { id: string };

    // Step 2: publish container
    const publishRes = await fetch(
      `${IG_API_BASE}/${config.businessAccountId}/media_publish?` +
      new URLSearchParams({
        creation_id: container.id,
        access_token: config.accessToken,
      }),
      { method: "POST" },
    );

    if (!publishRes.ok) {
      const errText = await publishRes.text();
      return { ok: false, error: `IG publish ${publishRes.status}: ${errText.slice(0, 200)}` };
    }

    const post = await publishRes.json() as { id: string };
    return { ok: true, postId: post.id };
  } catch (err: any) {
    return { ok: false, error: err.message ?? String(err) };
  }
}

/**
 * Compose IG caption for a WWB product. Optimized for hashtag reach
 * + clear value prop + link-in-bio CTA.
 */
export function composeIgCaption(product: {
  productName: string;
  description: string | null;
  country: string | null;
  price: number;
}): string {
  const country = product.country ?? "World";
  const priceUsd = (product.price / 100).toFixed(2);
  const baseDesc = product.description?.trim() ||
    `Take your kids on an adventure to ${country} \u2014 instant printable activity for the classroom, road trip, or rainy afternoon.`;

  const hashtags = [
    "#homeschool", "#printablesforkids", "#worldcultures",
    "#geographyforkids", "#travelwithkids", "#kidsactivities",
    `#${country.replace(/\s+/g, "")}`, "#wishingwithoutborders",
    "#educationalprintables", "#unitstudies", "#momlife", "#teachersofinstagram",
  ].join(" ");

  return `${product.productName}\n\n${baseDesc}\n\n\ud83d\udcda Instant download \u00b7 $${priceUsd}\n\ud83d\udd17 Link in bio\n\n${hashtags}`;
}
