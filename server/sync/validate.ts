import { ProductRow } from './config';

export interface ValidationResult {
  valid: ProductRow[];
  errors: string[];
}

/**
 * Validate an array of parsed product rows.
 *
 * Rules:
 *   - Required fields: id, product_name, category, price
 *   - No duplicate IDs within the batch
 *   - price must be a finite number >= 0
 *   - status defaults to 'active' if missing
 *   - sort_order must be a number or null
 *   - Rows that fail validation are skipped (not fatal)
 */
export function validateRows(
  rows: Array<Partial<ProductRow> & { _rowIndex: number }>
): ValidationResult {
  const valid: ProductRow[] = [];
  const errors: string[] = [];
  const seenIds = new Set<string>();

  for (const row of rows) {
    const rowErrors: string[] = [];
    const rowLabel = `Row ${row._rowIndex}`;

    // --- Required field checks ---
    if (!row.id || String(row.id).trim() === '') {
      rowErrors.push(`${rowLabel}: missing required field 'id'`);
    }
    if (!row.product_name || String(row.product_name).trim() === '') {
      rowErrors.push(`${rowLabel} (id=${row.id ?? 'N/A'}): missing required field 'product_name'`);
    }
    if (!row.category || String(row.category).trim() === '') {
      rowErrors.push(`${rowLabel} (id=${row.id ?? 'N/A'}): missing required field 'category'`);
    }
    if (row.price === null || row.price === undefined) {
      rowErrors.push(`${rowLabel} (id=${row.id ?? 'N/A'}): missing required field 'price'`);
    }

    // If any required field is missing, skip immediately
    if (rowErrors.length > 0) {
      errors.push(...rowErrors);
      continue;
    }

    const id = String(row.id!).trim();

    // --- Duplicate ID check ---
    if (seenIds.has(id)) {
      errors.push(`${rowLabel} (id=${id}): duplicate ID in sheet`);
      continue;
    }
    seenIds.add(id);

    // --- Price validation ---
    const price = Number(row.price);
    if (!Number.isFinite(price) || price < 0) {
      errors.push(`${rowLabel} (id=${id}): invalid price '${row.price}' (must be >= 0)`);
      continue;
    }

    // --- sort_order validation ---
    let sortOrder: number | null = null;
    if (row.sort_order !== null && row.sort_order !== undefined) {
      const parsed = Number(row.sort_order);
      if (!Number.isFinite(parsed)) {
        errors.push(`${rowLabel} (id=${id}): invalid sort_order '${row.sort_order}'`);
        continue;
      }
      sortOrder = parsed;
    }

    // --- Build validated ProductRow ---
    const product: ProductRow = {
      id,
      product_name: String(row.product_name!).trim(),
      category: String(row.category!).trim(),
      subcategory: row.subcategory ? String(row.subcategory).trim() : null,
      country: row.country ? String(row.country).trim() : null,
      price: Math.round(price), // int in DB
      gumroad_link: row.gumroad_link ? String(row.gumroad_link).trim() : null,
      cover_image_url: row.cover_image_url ? String(row.cover_image_url).trim() : null,
      pdf_url: row.pdf_url ? String(row.pdf_url).trim() : null,
      description: row.description ? String(row.description).trim() : null,
      seo_title: row.seo_title ? String(row.seo_title).trim() : null,
      seo_description: row.seo_description ? String(row.seo_description).trim() : null,
      tags: row.tags ? String(row.tags).trim() : null,
      design: row.design ? String(row.design).trim() : null,
      source_constant: row.source_constant ? String(row.source_constant).trim() : null,
      status: row.status ? String(row.status).trim() : 'active',
      sort_order: sortOrder,
      created_at: row.created_at ? String(row.created_at).trim() : null,
      updated_at: row.updated_at ? String(row.updated_at).trim() : null,
    };

    valid.push(product);
  }

  return { valid, errors };
}
