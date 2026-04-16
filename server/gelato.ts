/**
 * Gelato Print-on-Demand API integration
 *
 * Creates orders via the Gelato v4 Orders API.
 * The Gelato store "Wishes Without Borders Co" already has 60 wall art products
 * (30 countries × 2 sizes: 8×10" and 11×14") uploaded to Gelato.
 *
 * Gelato product UIDs for enhanced-matte poster wall art:
 *   8×10"  (203×254 mm)  → poster_product_pf_8x10-in_pt_170-gsm-65lb-uncoated_cl_4-0
 *   11×14" (279×356 mm)  → poster_product_pf_11x14-in_pt_170-gsm-65lb-uncoated_cl_4-0
 *
 * ── DRAFT MODE ──────────────────────────────────────────────────────────────
 * Set GELATO_LIVE_MODE=true in your .env to send real orders to Gelato.
 * When GELATO_LIVE_MODE is absent or "false", orders are created as DRAFTS:
 *   POST /v4/orders  →  creates the order but does NOT trigger printing.
 * Draft orders appear in the Gelato dashboard where you can review, approve,
 * or cancel them manually. This is the recommended mode for initial testing.
 *
 * To go live:  GELATO_LIVE_MODE=true  (in .env or hosting env vars)
 * ────────────────────────────────────────────────────────────────────────────
 */

const GELATO_API_BASE = "https://order.gelatoapis.com/v4";

/**
 * Returns true when Gelato should create real (non-draft) orders.
 * Defaults to false (draft mode) for safety.
 */
export function isGelatoLiveMode(): boolean {
  return process.env.GELATO_LIVE_MODE === "true";
}

function getGelatoApiKey(): string {
  const key = process.env.GELATO_API_KEY;
  if (!key) throw new Error("GELATO_API_KEY not configured");
  return key;
}

/** Gelato product UIDs mapped by print size */
export const GELATO_PRODUCT_UIDS: Record<string, string> = {
  "8x10": "poster_product_pf_8x10-in_pt_170-gsm-65lb-uncoated_cl_4-0",
  "11x14": "poster_product_pf_11x14-in_pt_170-gsm-65lb-uncoated_cl_4-0",
};

/** Print prices in cents */
export const PRINT_PRICES: Record<string, number> = {
  "8x10": 999,
  "11x14": 1499,
};

/**
 * Wall art catalog — maps internal product IDs to their print-file image URLs.
 * These CloudFront URLs are publicly accessible and can be sent directly to Gelato.
 */
export const WALL_ART_CATALOG: Record<string, { country: string; name: string; image: string }> = {
  "bh_wall_art": { country: "Bahrain", name: "Bahrain Cultural Wall Art Print", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/BH_birthday_mom_wall_art_8x10_427a59ed.jpg" },
  "bj_wall_art": { country: "Benin", name: "Benin Cultural Wall Art Print", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/BJ_birthday_mom_wall_art_8x10_b4bb53ac.jpg" },
  "bt_wall_art": { country: "Bhutan", name: "Bhutan Cultural Wall Art Print", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/BT_birthday_mom_wall_art_8x10_9118c9ac.jpg" },
  "bf_wall_art": { country: "Burkina Faso", name: "Burkina Faso Cultural Wall Art Print", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/BF_birthday_mom_wall_art_8x10_2c5b945d.jpg" },
  "bi_wall_art": { country: "Burundi", name: "Burundi Cultural Wall Art Print", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/BI_birthday_mom_wall_art_8x10_18366f51.jpg" },
  "cv_wall_art": { country: "Cape Verde", name: "Cape Verde Cultural Wall Art Print", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/CV_birthday_mom_wall_art_8x10_69488a07.jpg" },
  "td_wall_art": { country: "Chad", name: "Chad Cultural Wall Art Print", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/TD_birthday_mom_wall_art_8x10_d7deeb25.jpg" },
  "km_wall_art": { country: "Comoros", name: "Comoros Cultural Wall Art Print", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/KM_birthday_mom_wall_art_8x10_c9f7e6f5.jpg" },
  "cg_wall_art": { country: "Congo", name: "Congo Cultural Wall Art Print", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/CG_birthday_mom_wall_art_8x10_7ca96fb8.jpg" },
  "cd_wall_art": { country: "Congo (DRC)", name: "Congo (DRC) Cultural Wall Art Print", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/CD_birthday_mom_wall_art_8x10_84f68563.jpg" },
  "ci_wall_art": { country: "Cote d'Ivoire", name: "Cote d'Ivoire Cultural Wall Art Print", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/CI_birthday_mom_wall_art_8x10_b8da7aa2.jpg" },
  "dj_wall_art": { country: "Djibouti", name: "Djibouti Cultural Wall Art Print", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/DJ_birthday_mom_wall_art_8x10_b4d9acf0.jpg" },
  "er_wall_art": { country: "Eritrea", name: "Eritrea Cultural Wall Art Print", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/ER_birthday_mom_wall_art_8x10_7dc191fa.jpg" },
  "gm_wall_art": { country: "Gambia", name: "Gambia Cultural Wall Art Print", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/GM_birthday_mom_wall_art_8x10_ae89051c.jpg" },
  "gn_wall_art": { country: "Guinea", name: "Guinea Cultural Wall Art Print", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/GN_birthday_mom_wall_art_8x10_e453fa4b.jpg" },
  "gw_wall_art": { country: "Guinea-Bissau", name: "Guinea-Bissau Cultural Wall Art Print", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/GW_birthday_mom_wall_art_8x10_0bc3b661.jpg" },
  "lr_wall_art": { country: "Liberia", name: "Liberia Cultural Wall Art Print", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/LR_birthday_mom_wall_art_8x10_7763b744.jpg" },
  "mg_wall_art": { country: "Madagascar", name: "Madagascar Cultural Wall Art Print", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/MG_birthday_mom_wall_art_8x10_37ecb072.jpg" },
  "mw_wall_art": { country: "Malawi", name: "Malawi Cultural Wall Art Print", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/MW_birthday_mom_wall_art_8x10_507dfde2.jpg" },
  "mv_wall_art": { country: "Maldives", name: "Maldives Cultural Wall Art Print", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/MV_birthday_mom_wall_art_8x10_f078becd.jpg" },
  "ml_wall_art": { country: "Mali", name: "Mali Cultural Wall Art Print", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/ML_birthday_mom_wall_art_8x10_1bd7129a.jpg" },
  "mr_wall_art": { country: "Mauritania", name: "Mauritania Cultural Wall Art Print", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/MR_birthday_mom_wall_art_8x10_e4ce2752.jpg" },
  "mz_wall_art": { country: "Mozambique", name: "Mozambique Cultural Wall Art Print", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/MZ_birthday_mom_wall_art_8x10_5499f5dd.jpg" },
  "ne_wall_art": { country: "Niger", name: "Niger Cultural Wall Art Print", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/NE_birthday_mom_wall_art_8x10_1c2f4d6d.jpg" },
  "rw_wall_art": { country: "Rwanda", name: "Rwanda Cultural Wall Art Print", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/RW_birthday_mom_wall_art_8x10_99c6bd5d.jpg" },
  "sc_wall_art": { country: "Seychelles", name: "Seychelles Cultural Wall Art Print", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/SC_birthday_mom_wall_art_8x10_dca3d36f.jpg" },
  "sl_wall_art": { country: "Sierra Leone", name: "Sierra Leone Cultural Wall Art Print", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/SL_birthday_mom_wall_art_8x10_ba45d965.jpg" },
  "tl_wall_art": { country: "Timor Leste", name: "Timor Leste Cultural Wall Art Print", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/TL_birthday_mom_wall_art_8x10_1505f48c.jpg" },
  "tg_wall_art": { country: "Togo", name: "Togo Cultural Wall Art Print", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/TG_birthday_mom_wall_art_8x10_3d4be01f.jpg" },
  "zm_wall_art": { country: "Zambia", name: "Zambia Cultural Wall Art Print", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663477175297/U2o3BSoD2csFZaGb6Y3o4M/ZM_birthday_mom_wall_art_8x10_6d8a3357.jpg" },
};

export interface GelatoShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postCode: string;
  country: string; // ISO 3166-1 alpha-2
}

export interface GelatoOrderRequest {
  orderReferenceId: string;
  customerReferenceId: string;
  currency: string;
  items: {
    itemReferenceId: string;
    productUid: string;
    files: { type: string; url: string }[];
    quantity: number;
  }[];
  shipmentMethodUid: string;
  shippingAddress: GelatoShippingAddress;
}

export interface GelatoOrderResponse {
  id: string;
  orderReferenceId: string;
  fulfillmentStatus: string;
  financialStatus: string;
  [key: string]: unknown;
}

/**
 * Create an order in Gelato.
 * Called AFTER Stripe payment succeeds (via the Stripe checkout success webhook flow).
 *
 * In DRAFT mode (default): creates a draft order that does NOT trigger printing.
 * In LIVE mode (GELATO_LIVE_MODE=true): creates a real order that Gelato prints & ships.
 */
export async function createGelatoOrder(
  request: GelatoOrderRequest,
): Promise<GelatoOrderResponse> {
  const apiKey = getGelatoApiKey();
  const liveMode = isGelatoLiveMode();

  // In draft mode, add the "draft" flag so Gelato holds the order without printing
  const payload: Record<string, unknown> = { ...request };
  if (!liveMode) {
    // Gelato v4: setting orderType to "draft" creates a draft order
    payload.orderType = "draft";
  }

  const mode = liveMode ? "LIVE" : "DRAFT";
  console.log(`[Gelato] Creating ${mode} order: ${request.orderReferenceId}`);

  const response = await fetch(`${GELATO_API_BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Gelato API error (${response.status}): ${errorBody}`,
    );
  }

  const result = await response.json() as GelatoOrderResponse;
  console.log(`[Gelato] ${mode} order created: ${result.id} (ref: ${result.orderReferenceId})`);
  return result;
}

/**
 * Build a Gelato order request from our internal data.
 */
export function buildGelatoOrderRequest(params: {
  orderId: string;
  customerEmail: string;
  size: "8x10" | "11x14";
  imageUrl: string;
  itemName: string;
  shippingAddress: GelatoShippingAddress;
}): GelatoOrderRequest {
  const productUid = GELATO_PRODUCT_UIDS[params.size];
  if (!productUid) {
    throw new Error(`Unknown print size: ${params.size}`);
  }

  return {
    orderReferenceId: params.orderId,
    customerReferenceId: params.customerEmail,
    currency: "USD",
    items: [
      {
        itemReferenceId: `${params.orderId}-${params.size}`,
        productUid,
        files: [
          {
            type: "default",
            url: params.imageUrl,
          },
        ],
        quantity: 1,
      },
    ],
    shipmentMethodUid: "standard",
    shippingAddress: params.shippingAddress,
  };
}
