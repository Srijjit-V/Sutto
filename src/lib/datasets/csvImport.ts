import Papa from "papaparse";
import type { Dataset, DatasetColumn } from "./types";

const MAX_ROWS = 5000; // keep client-side parsing/inserts snappy
const MAX_COLUMNS = 40;

export class CsvImportError extends Error {}

/** SQL identifiers: letters, digits, underscore, must not start with a digit. */
function toSafeIdentifier(raw: string, fallbackIndex: number): string {
  const cleaned = raw
    .trim()
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .replace(/^_+/, "");
  const safe = /^[a-zA-Z]/.test(cleaned) ? cleaned : `col_${cleaned}`;
  return safe.length > 0 ? safe.toLowerCase() : `column_${fallbackIndex}`;
}

function inferType(values: string[]): string {
  const nonEmpty = values.filter((v) => v !== "" && v !== null && v !== undefined);
  if (nonEmpty.length === 0) return "TEXT";
  const allInts = nonEmpty.every((v) => /^-?\d+$/.test(v));
  if (allInts) return "INTEGER";
  const allNumeric = nonEmpty.every((v) => /^-?\d+(\.\d+)?$/.test(v));
  if (allNumeric) return "REAL";
  return "TEXT";
}

function sqlQuote(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

/**
 * Parses CSV text into a Dataset: a single table named after the file,
 * with column types inferred from the data (INTEGER/REAL/TEXT), safe SQL
 * identifiers derived from the header row, and INSERT statements built
 * from every row (capped at MAX_ROWS to keep things responsive).
 */
export function parseCsvToDataset(csvText: string, fileName: string): Dataset {
  const parsed = Papa.parse<string[]>(csvText.trim(), { skipEmptyLines: true });
  if (parsed.errors.length > 0 && parsed.data.length === 0) {
    throw new CsvImportError(`Couldn't parse this CSV: ${parsed.errors[0].message}`);
  }
  const rows = parsed.data;
  if (rows.length < 2) {
    throw new CsvImportError("The CSV needs a header row plus at least one data row.");
  }

  const header = rows[0];
  if (header.length > MAX_COLUMNS) {
    throw new CsvImportError(`Too many columns (max ${MAX_COLUMNS}).`);
  }
  const dataRows = rows.slice(1, 1 + MAX_ROWS);

  const columnNames = header.map((h, i) => toSafeIdentifier(h || `column_${i}`, i));
  // De-duplicate any identifier collisions from sanitization.
  const seen = new Map<string, number>();
  const uniqueColumnNames = columnNames.map((name) => {
    const count = seen.get(name) ?? 0;
    seen.set(name, count + 1);
    return count === 0 ? name : `${name}_${count}`;
  });

  const columnTypes = uniqueColumnNames.map((_, colIndex) =>
    inferType(dataRows.map((row) => row[colIndex] ?? ""))
  );

  const tableName = toSafeIdentifier(fileName.replace(/\.csv$/i, "") || "my_data", 0) || "my_data";

  const columns: DatasetColumn[] = uniqueColumnNames.map((name, i) => ({ name, type: columnTypes[i] }));

  const createTable = `CREATE TABLE ${tableName} (\n  ${uniqueColumnNames
    .map((name, i) => `${name} ${columnTypes[i]}`)
    .join(",\n  ")}\n);`;

  const insertStatements = dataRows
    .filter((row) => row.some((cell) => cell !== ""))
    .map((row) => {
      const values = uniqueColumnNames.map((_, i) => {
        const raw = row[i] ?? "";
        if (raw === "") return "NULL";
        return columnTypes[i] === "TEXT" ? sqlQuote(raw) : raw;
      });
      return `INSERT INTO ${tableName} (${uniqueColumnNames.join(", ")}) VALUES (${values.join(", ")});`;
    });

  return {
    id: `custom-${tableName}-${Date.now()}`,
    name: fileName,
    description: `Imported from ${fileName} (${dataRows.length} row${dataRows.length === 1 ? "" : "s"}).`,
    isCustom: true,
    tables: [{ name: tableName, columns }],
    seedSql: [createTable, ...insertStatements].join("\n"),
  };
}
