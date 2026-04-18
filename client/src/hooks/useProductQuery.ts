/**
 * useProductQuery — shared hook for DB-backed product queries.
 *
 * Wraps a tRPC query and provides standardised loading / error / empty state
 * plus the transformed card-gallery items.
 */
import { trpc } from "@/lib/trpc";

/** Shape expected by CardGallery */
export interface CardItem {
  id: string;
  country: string;
  image: string;
  variant?: string;
}

/** Shape expected by WallArt pages (superset of CardItem) */
export interface WallArtItem {
  id: string;
  country: string;
  image: string;
  name: string;
  design: string;
}

/** Shape expected by SimpleProduct pages (coloring books, workbooks, stickers) */
export interface SimpleProductItem {
  id: string;
  country: string;
  image: string;
  name: string;
  price: number;
  description?: string;
}

// ── DB row → frontend shape mappers ────────────────────────────────────────

type DbProduct = {
  id: string;
  productName: string;
  category: string;
  subcategory: string | null;
  country: string | null;
  price: number;
  coverImageUrl: string | null;
  description: string | null;
  design: string | null;
  sourceConstant: string | null;
  status: string;
};

export function toCardItem(row: DbProduct): CardItem {
  return {
    id: row.id,
    country: row.country ?? "",
    image: row.coverImageUrl ?? "",
    variant: row.subcategory ?? undefined,
  };
}

export function toWallArtItem(row: DbProduct): WallArtItem {
  return {
    id: row.id,
    country: row.country ?? "",
    image: row.coverImageUrl ?? "",
    name: row.productName,
    design: row.design ?? "",
  };
}

export function toSimpleProductItem(row: DbProduct): SimpleProductItem {
  return {
    id: row.id,
    country: row.country ?? "",
    image: row.coverImageUrl ?? "",
    name: row.productName,
    price: row.price,
    description: row.description ?? undefined,
  };
}

// ── Query hooks ────────────────────────────────────────────────────────────

/**
 * Fetch products by source_constant and map to CardItem[].
 */
export function useCardsBySource(sourceConstant: string) {
  const query = trpc.shop.getProductsBySource.useQuery(
    { sourceConstant },
    { staleTime: 5 * 60 * 1000 },
  );
  return {
    cards: (query.data ?? []).map(toCardItem),
    isLoading: query.isLoading,
    error: query.error,
    isEmpty: !query.isLoading && !query.error && (query.data ?? []).length === 0,
  };
}

/**
 * Fetch products by multiple source_constants and map to CardItem[].
 */
export function useCardsBySources(sourceConstants: string[]) {
  const query = trpc.shop.getProductsBySources.useQuery(
    { sourceConstants },
    { staleTime: 5 * 60 * 1000 },
  );
  return {
    cards: (query.data ?? []).map(toCardItem),
    isLoading: query.isLoading,
    error: query.error,
    isEmpty: !query.isLoading && !query.error && (query.data ?? []).length === 0,
  };
}

/**
 * Fetch wall art products and map to WallArtItem[].
 */
export function useWallArt() {
  const query = trpc.shop.getProductsBySource.useQuery(
    { sourceConstant: "WALL_ART_PRINTS" },
    { staleTime: 5 * 60 * 1000 },
  );
  return {
    items: (query.data ?? []).map(toWallArtItem),
    isLoading: query.isLoading,
    error: query.error,
    isEmpty: !query.isLoading && !query.error && (query.data ?? []).length === 0,
  };
}

/**
 * Fetch simple products (coloring books, workbooks, stickers) and map to SimpleProductItem[].
 */
export function useSimpleProducts(sourceConstant: string) {
  const query = trpc.shop.getProductsBySource.useQuery(
    { sourceConstant },
    { staleTime: 5 * 60 * 1000 },
  );
  return {
    items: (query.data ?? []).map(toSimpleProductItem),
    isLoading: query.isLoading,
    error: query.error,
    isEmpty: !query.isLoading && !query.error && (query.data ?? []).length === 0,
  };
}

/**
 * Fetch a single product by ID.
 */
export function useProductById(productId: string) {
  return trpc.shop.getProductById.useQuery(
    { productId },
    { staleTime: 5 * 60 * 1000, enabled: !!productId },
  );
}
