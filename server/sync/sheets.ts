import { google, sheets_v4 } from 'googleapis';
import { config, ProductRow } from './config';

let _sheetsClient: sheets_v4.Sheets | null = null;

/**
 * Returns an authenticated Google Sheets client (singleton).
 */
export async function getSheetsClient(): Promise<sheets_v4.Sheets> {
  if (_sheetsClient) return _sheetsClient;

  const auth = new google.auth.GoogleAuth({
    credentials: config.serviceAccountKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const client = await auth.getClient();
  _sheetsClient = google.sheets({ version: 'v4', auth: client as any });
  return _sheetsClient;
}

/**
 * Fetch all product rows from the Google Sheet (Sheet1 tab).
 * Returns raw string[][] including the header row at index 0.
 */
export async function fetchAllProductRows(): Promise<string[][]> {
  const sheets = await getSheetsClient();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: config.googleSheetId,
    range: `${config.productsTab}!A1:S`,
    valueRenderOption: 'UNFORMATTED_VALUE',
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    throw new Error('No data found in the Products sheet');
  }

  return rows as string[][];
}

/**
 * Parse raw sheet rows (excluding header) into ProductRow objects.
 * Handles rows that may have fewer than 19 columns (trailing empty cells
 * are omitted by the Sheets API).
 */
export function parseSheetRows(rawRows: string[][]): Array<Partial<ProductRow> & { _rowIndex: number }> {
  // First row is the header
  const headers = rawRows[0].map((h: string) => String(h).trim().toLowerCase());
  const dataRows = rawRows.slice(1);

  return dataRows.map((row, idx) => {
    const obj: Record<string, any> = { _rowIndex: idx + 2 }; // 1-indexed, +1 for header

    config.columnHeaders.forEach((col, colIdx) => {
      const headerIdx = headers.indexOf(col);
      if (headerIdx === -1) {
        obj[col] = null;
        return;
      }
      const raw = headerIdx < row.length ? row[headerIdx] : undefined;

      // Treat undefined, empty string, and whitespace-only as null
      if (raw === undefined || raw === null || String(raw).trim() === '') {
        obj[col] = null;
      } else {
        obj[col] = raw;
      }
    });

    return obj as Partial<ProductRow> & { _rowIndex: number };
  });
}

/**
 * Fetch the last N rows from the Sync Log tab (Sheet2).
 * Returns rows in reverse chronological order (newest first).
 */
export async function fetchSyncLogRows(
  count: number = 10
): Promise<string[][]> {
  const sheets = await getSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: config.googleSheetId,
    range: `${config.syncLogTab}!A:E`,
    valueRenderOption: 'FORMATTED_VALUE',
  });
  const rows = response.data.values;
  if (!rows || rows.length <= 1) {
    return []; // No data rows (only header or empty)
  }
  // Skip header row, get last N data rows, reverse for newest-first
  const dataRows = rows.slice(1);
  const lastN = dataRows.slice(-count);
  return lastN.reverse();
}
