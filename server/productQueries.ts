/**
 * Product Queries — DB-backed product lookups with in-memory caching.
 *
 * All read-heavy queries use a 5-minute TTL cache to reduce DB load.
 * Write-through is not needed because the sync engine handles updates.
 */
import { eq, and, like, ne, or, sql, asc } from "drizzle-orm";
import { getDb } from "./db";
import { products } from "../drizzle/schema";
import type { Product } from "../drizzle/schema";

// ── In-memory cache ────────────────────────────────────────────────────────
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | undefined {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return undefined;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

/** Clear all cached product data (call after sync) */
export function invalidateProductCache(): void {
  cache.clear();
}

// ── Frontend shape types ───────────────────────────────────────────────────

/** Shape expected by CardGallery */
export interface CardItem {
  id: string;
  country: string;
  image: string;
  variant?: string;
}

/** Shape expected by ProductModal / CartItem */
export interface ProductInfo {
  productId: string;
  name: string;
  image: string;
  price: number;
  country?: string;
  category?: string;
  description?: string;
  design?: string;
}

/** Shape for the full product record (server-side) */
export interface FullProduct {
  id: string;
  productName: string;
  category: string;
  subcategory: string | null;
  country: string | null;
  price: number;
  gumroadLink: string | null;
  coverImageUrl: string | null;
  pdfUrl: string | null;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  tags: string | null;
  design: string | null;
  sourceConstant: string | null;
  status: string;
  sortOrder: number | null;
}

// ── Mapping helpers ────────────────────────────────────────────────────────

/** Transform a DB product row to the CardItem shape for CardGallery */
export function toCardItem(row: Product): CardItem {
  return {
    id: row.id,
    country: row.country ?? "",
    image: row.coverImageUrl ?? "",
    variant: row.subcategory ?? undefined,
  };
}

/** Transform a DB product row to the ProductInfo shape for ProductModal */
export function toProductInfo(row: Product): ProductInfo {
  return {
    productId: row.id,
    name: row.productName,
    image: row.coverImageUrl ?? "",
    price: row.price,
    country: row.country ?? undefined,
    category: row.category ?? undefined,
    description: row.description ?? undefined,
    design: row.design ?? undefined,
  };
}

/** Transform a DB product row to the PRODUCTS-compatible shape for checkout/download */
export function toProductsEntry(row: Product): {
  name: string;
  price: number;
  description?: string;
  pdfLink: string;
  image?: string;
  category: string;
  country?: string;
  cardType?: string;
} {
  // Derive cardType from source_constant: e.g., "BIRTHDAY_DAD_CARDS" → "birthday_dad"
  const cardType = row.sourceConstant
    ? row.sourceConstant.replace(/_CARDS$/, "").toLowerCase()
    : undefined;

  return {
    name: row.productName,
    price: row.price,
    description: row.description ?? undefined,
    pdfLink: row.pdfUrl ?? "",
    image: row.coverImageUrl ?? undefined,
    category: row.category,
    country: row.country ?? undefined,
    cardType,
  };
}

// ── Query functions ────────────────────────────────────────────────────────

/**
 * Get products by source_constant (replaces static array imports).
 * Returns active products ordered by sort_order, then product_name.
 */
export async function getProductsBySourceConstant(sourceConstant: string): Promise<Product[]> {
  const cacheKey = `products:sc:${sourceConstant}`;
  const cached = getCached<Product[]>(cacheKey);
  if (cached) return cached;

  const db = await getDb();
  if (!db) return [];

  const rows = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.sourceConstant, sourceConstant),
        eq(products.status, "active"),
      ),
    )
    .orderBy(asc(products.sortOrder), asc(products.productName));

  setCache(cacheKey, rows);
  return rows;
}

/**
 * Get products by multiple source_constants (for merged arrays like GRADUATION_CARDS).
 */
export async function getProductsBySourceConstants(sourceConstants: string[]): Promise<Product[]> {
  const cacheKey = `products:scs:${sourceConstants.sort().join(",")}`;
  const cached = getCached<Product[]>(cacheKey);
  if (cached) return cached;

  const db = await getDb();
  if (!db) return [];

  const conditions = sourceConstants.map((sc) => eq(products.sourceConstant, sc));
  const rows = await db
    .select()
    .from(products)
    .where(
      and(
        or(...conditions),
        eq(products.status, "active"),
      ),
    )
    .orderBy(asc(products.sortOrder), asc(products.productName));

  setCache(cacheKey, rows);
  return rows;
}

/**
 * Get a single product by ID (full 19-field fetch).
 */
export async function getProductById(id: string): Promise<Product | null> {
  const cacheKey = `product:id:${id}`;
  const cached = getCached<Product | null>(cacheKey);
  if (cached !== undefined) return cached;

  const db = await getDb();
  if (!db) return null;

  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.id, id), eq(products.status, "active")))
    .limit(1);

  const result = rows[0] ?? null;
  setCache(cacheKey, result);
  return result;
}

/**
 * Search products by name + description with optional category filter.
 */
export async function searchProducts(
  query: string,
  category?: string,
): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];

  const searchPattern = `%${query}%`;
  const conditions = [
    eq(products.status, "active"),
    or(
      like(products.productName, searchPattern),
      like(products.description, searchPattern),
    ),
  ];

  if (category) {
    conditions.push(eq(products.category, category));
  }

  return db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(asc(products.productName))
    .limit(100);
}

/**
 * Get distinct categories.
 */
export async function getCategories(): Promise<string[]> {
  const cacheKey = "categories";
  const cached = getCached<string[]>(cacheKey);
  if (cached) return cached;

  const db = await getDb();
  if (!db) return [];

  const rows = await db
    .selectDistinct({ category: products.category })
    .from(products)
    .where(eq(products.status, "active"))
    .orderBy(asc(products.category));

  const result = rows.map((r) => r.category);
  setCache(cacheKey, result);
  return result;
}

/**
 * Get distinct countries.
 */
export async function getCountries(): Promise<string[]> {
  const cacheKey = "countries";
  const cached = getCached<string[]>(cacheKey);
  if (cached) return cached;

  const db = await getDb();
  if (!db) return [];

  const rows = await db
    .selectDistinct({ country: products.country })
    .from(products)
    .where(and(eq(products.status, "active"), sql`${products.country} IS NOT NULL`))
    .orderBy(asc(products.country));

  const result = rows.map((r) => r.country).filter((c): c is string => c !== null);
  setCache(cacheKey, result);
  return result;
}

/**
 * Get related products (same category, exclude current, limited).
 */
export async function getRelatedProducts(
  category: string,
  excludeId: string,
  limit: number = 3,
): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(products)
    .where(
      and(
        eq(products.category, category),
        ne(products.id, excludeId),
        eq(products.status, "active"),
      ),
    )
    .orderBy(sql`RAND()`)
    .limit(limit);
}

/**
 * Get related products for the order success page.
 * Matches the existing getRelatedProducts behavior from the static PRODUCTS object:
 * - 2 cards from same country, different cardType
 * - 1 card from same cardType, different country
 */
export async function getRelatedProductsForOrder(
  productId: string,
): Promise<{
  related: Array<{
    productId: string;
    name: string;
    image: string;
    price: number;
    country: string;
    cardType: string;
    reason: "same_country" | "same_occasion";
  }>;
}> {
  const db = await getDb();
  if (!db) return { related: [] };

  // Look up the source product
  const sourceRows = await db
    .select()
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  const source = sourceRows[0];
  if (!source || !source.country || !source.sourceConstant) {
    return { related: [] };
  }

  const sourceCardType = source.sourceConstant.replace(/_CARDS$/, "").toLowerCase();

  // 2 cards from same country, different source_constant
  const sameCountryRows = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.country, source.country),
        ne(products.id, productId),
        ne(products.sourceConstant, source.sourceConstant),
        eq(products.status, "active"),
      ),
    )
    .limit(2);

  const sameCountry = sameCountryRows.map((row) => ({
    productId: row.id,
    name: row.productName,
    image: row.coverImageUrl ?? "",
    price: row.price,
    country: row.country ?? "",
    cardType: row.sourceConstant
      ? row.sourceConstant.replace(/_CARDS$/, "").toLowerCase()
      : "",
    reason: "same_country" as const,
  }));

  // 1 card from same source_constant, different country
  const sameOccasionRows = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.sourceConstant, source.sourceConstant),
        ne(products.country, source.country),
        ne(products.id, productId),
        eq(products.status, "active"),
      ),
    )
    .limit(1);

  const sameOccasion = sameOccasionRows.map((row) => ({
    productId: row.id,
    name: row.productName,
    image: row.coverImageUrl ?? "",
    price: row.price,
    country: row.country ?? "",
    cardType: row.sourceConstant
      ? row.sourceConstant.replace(/_CARDS$/, "").toLowerCase()
      : "",
    reason: "same_occasion" as const,
  }));

  return { related: [...sameCountry, ...sameOccasion] };
}

/**
 * Look up a product for checkout/download purposes.
 * Returns the PRODUCTS-compatible shape needed by createCheckout, verifyPayment, etc.
 * Does NOT filter by status — we want to find products even if deactivated for order fulfillment.
 */
export async function getProductForCheckout(
  productId: string,
): Promise<ReturnType<typeof toProductsEntry> | null> {
  const db = await getDb();
  if (!db) return null;

  const rows = await db
    .select()
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  if (rows.length === 0) return null;
  return toProductsEntry(rows[0]);
}

/**
 * Batch lookup products for checkout (multiple IDs).
 */
export async function getProductsForCheckout(
  productIds: string[],
): Promise<Map<string, ReturnType<typeof toProductsEntry>>> {
  const db = await getDb();
  const result = new Map<string, ReturnType<typeof toProductsEntry>>();
  if (!db || productIds.length === 0) return result;

  const conditions = productIds.map((id) => eq(products.id, id));
  const rows = await db
    .select()
    .from(products)
    .where(or(...conditions));

  for (const row of rows) {
    result.set(row.id, toProductsEntry(row));
  }

  return result;
}
