import * as path from 'path';
import * as fs from 'fs';

/**
 * Load the Google service account credentials.
 * Supports two modes:
 *   1. GOOGLE_SERVICE_ACCOUNT_KEY – full JSON string (production / env-var based)
 *   2. GOOGLE_SERVICE_ACCOUNT_KEY_PATH – path to a JSON file (local dev)
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

export const config = {
  googleSheetId: process.env.GOOGLE_SHEET_ID ?? '',
  databaseUrl: process.env.DATABASE_URL ?? '',
  serviceAccountKey: loadServiceAccountKey(),

  /** Sheet tab names */
  productsTab: 'Sheet1',
  syncLogTab: 'Sheet2',

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

export type ColumnHeader = (typeof config.columnHeaders)[number];

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
