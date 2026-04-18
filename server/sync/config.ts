import * as path from 'path';
import * as fs from 'fs';

/**
 * Load the Google service account credentials.
 * Supports two modes:
 *   1. GOOGLE_SERVICE_ACCOUNT_KEY – full JSON string (production / env-var based)
 *   2. GOOGLE_SERVICE_ACCOUNT_KEY_PATH – path to a JSON file (local dev)
 *
 * This is called lazily (at runtime) to avoid build-time env var resolution.
 */
function loadServiceAccountKey(): Record<string, string> {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  }
  const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH;
  if (keyPath) {
    const resolved = path.resolve(keyPath);
    return JSON.parse(fs.readFileSync(resolved, 'utf-8'));
  }
  throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_KEY or GOOGLE_SERVICE_ACCOUNT_KEY_PATH');
}

/** Cached config instance — created on first access */
let _config: ReturnType<typeof buildConfig> | null = null;

function buildConfig() {
  return {
    googleSheetId: process.env.GOOGLE_SHEET_ID ?? '',
    databaseUrl: process.env.DATABASE_URL ?? '',
    serviceAccountKey: loadServiceAccountKey(),

    /** Sheet tab names */
    productsTab: 'Sheet1' as const,
    syncLogTab: 'Sheet2' as const,

    /** Column header names in exact order (19 columns) */
    columnHeaders: [
      'id',
      'product_name',
      'category',
      'subcategory',
      'country',
      'price',
      'gumroad_link',
      'cover_image_url',
      'pdf_url',
      'description',
      'seo_title',
      'seo_description',
      'tags',
      'design',
      'source_constant',
      'status',
      'sort_order',
      'created_at',
      'updated_at',
    ] as const,

    /** Hard timeout for the entire sync operation (ms) */
    syncTimeoutMs: 60_000,
  };
}

/**
 * Lazy-loaded config — only resolves env vars when first accessed at runtime,
 * not at module import time. This prevents Railway's builder from failing
 * when env vars aren't available during the build step.
 */
export function getConfig() {
  if (!_config) {
    _config = buildConfig();
  }
  return _config;
}

/** @deprecated Use getConfig() instead — kept for backward compatibility */
export const config = new Proxy({} as ReturnType<typeof buildConfig>, {
  get(_target, prop) {
    return getConfig()[prop as keyof ReturnType<typeof buildConfig>];
  },
});

export type ColumnHeader = ReturnType<typeof buildConfig>['columnHeaders'][number];

export interface ProductRow {
  id: string;
  product_name: string;
  category: string;
  subcategory: string | null;
  country: string | null;
  price: number;
  gumroad_link: string | null;
  cover_image_url: string | null;
  pdf_url: string | null;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  tags: string | null;
  design: string | null;
  source_constant: string | null;
  status: string;
  sort_order: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface SyncResult {
  success: boolean;
  rowsProcessed: number;
  rowsUpdated: number;
  rowsInserted: number;
  errors: string[];
  syncLogId: string | null;
}
