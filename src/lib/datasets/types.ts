export interface DatasetColumn {
  name: string;
  type: string; // display type, e.g. "INTEGER", "TEXT", "REAL"
}

export interface DatasetTable {
  name: string;
  columns: DatasetColumn[];
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  /** SQL run once (CREATE TABLE + INSERT statements) to seed the database. */
  seedSql: string;
  tables: DatasetTable[];
  /** Set for datasets built from a user's own uploaded file (not a built-in). */
  isCustom?: boolean;
}
