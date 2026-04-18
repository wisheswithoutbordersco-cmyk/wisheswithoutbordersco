import mysql, { Pool, PoolConnection, RowDataPacket } from 'mysql2/promise';
import { config, ProductRow } from './config';

let _pool: Pool | null = null;

/**
 * Returns a MySQL connection pool (singleton).
 */
export function getPool(): Pool {
  if (_pool) return _pool;

  const url = new URL(config.databaseUrl);
  _pool = mysql.createPool({
    host: url.hostname,
    port: Number(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.replace('/', ''),
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    connectTimeout: 10_000,
  });

  return _pool;
}

/**
 * Close the pool (call on shutdown).
 */
export async function closePool(): Promise<void> {
  if (_pool) {
    await _pool.end();
    _pool = null;
  }
}

/**
 * Get a connection from the pool (for transaction use).
 */
export async function getConnection(): Promise<PoolConnection> {
  return getPool().getConnection();
}

export interface UpsertResult {
  rowsInserted: number;
  rowsUpdated: number;
  rowsProcessed: number;
}

/**
 * Batch upsert products into the database using INSERT ... ON DUPLICATE KEY UPDATE.
 * Processes rows in batches to avoid exceeding MySQL packet limits.
 *
 * @param conn   A PoolConnection with an active transaction
 * @param rows   Validated ProductRow array
 * @returns      Counts of inserted, updated, and processed rows
 */
export async function batchUpsert(
  conn: PoolConnection,
  rows: ProductRow[]
): Promise<UpsertResult> {
  if (rows.length === 0) {
    return { rowsInserted: 0, rowsUpdated: 0, rowsProcessed: 0 };
  }

  // First, get existing IDs so we can distinguish inserts from updates
  const existingIds = await getExistingIds(conn, rows.map((r) => r.id));

  const BATCH_SIZE = 200;
  let totalInserted = 0;
  let totalUpdated = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { inserted, updated } = await upsertBatch(conn, batch, existingIds);
    totalInserted += inserted;
    totalUpdated += updated;
  }

  return {
    rowsInserted: totalInserted,
    rowsUpdated: totalUpdated,
    rowsProcessed: rows.length,
  };
}

/**
 * Fetch existing product IDs from the database for a given list.
 */
async function getExistingIds(
  conn: PoolConnection,
  ids: string[]
): Promise<Set<string>> {
  if (ids.length === 0) return new Set();

  // Query in batches to avoid overly long IN clauses
  const CHUNK = 500;
  const result = new Set<string>();

  for (let i = 0; i < ids.length; i += CHUNK) {
    const chunk = ids.slice(i, i + CHUNK);
    const placeholders = chunk.map(() => '?').join(',');
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT id FROM products WHERE id IN (${placeholders})`,
      chunk
    );
    for (const row of rows) {
      result.add(row.id);
    }
  }

  return result;
}

/**
 * Upsert a single batch of products.
 */
async function upsertBatch(
  conn: PoolConnection,
  batch: ProductRow[],
  existingIds: Set<string>
): Promise<{ inserted: number; updated: number }> {
  const columns = [
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
  ];

  const updateColumns = columns.filter((c) => c !== 'id' && c !== 'created_at');

  const placeholderRow = `(${columns.map(() => '?').join(', ')})`;
  const placeholders = batch.map(() => placeholderRow).join(',\n');

  const updateClause = updateColumns
    .map((col) => `\`${col}\` = VALUES(\`${col}\`)`)
    .join(', ');

  const sql = `
    INSERT INTO products (${columns.map((c) => `\`${c}\``).join(', ')})
    VALUES ${placeholders}
    ON DUPLICATE KEY UPDATE ${updateClause}
  `;

  const values: any[] = [];
  for (const row of batch) {
    values.push(
      row.id,
      row.product_name,
      row.category,
      row.subcategory,
      row.country,
      row.price,
      row.gumroad_link,
      row.cover_image_url,
      row.pdf_url,
      row.description,
      row.seo_title,
      row.seo_description,
      row.tags,
      row.design,
      row.source_constant,
      row.status,
      row.sort_order,
      row.created_at || new Date().toISOString().slice(0, 19).replace('T', ' '),
      new Date().toISOString().slice(0, 19).replace('T', ' ')
    );
  }

  await conn.execute(sql, values);

  // Count inserts vs updates based on pre-fetched existing IDs
  let inserted = 0;
  let updated = 0;
  for (const row of batch) {
    if (existingIds.has(row.id)) {
      updated++;
    } else {
      inserted++;
      existingIds.add(row.id); // Mark as existing for subsequent batches
    }
  }

  return { inserted, updated };
}
