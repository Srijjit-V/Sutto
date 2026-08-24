import type { Dataset } from "./types";

/**
 * A compact dataset modeled on the well-known "Chinook" sample database
 * (a digital music store — artists, albums, tracks, customers, invoices).
 * Chinook is a free, public-domain teaching database widely used to learn
 * SQL joins/aggregation (see lerocha/chinook-database on GitHub). This is a
 * hand-authored, much smaller dataset that follows the same table shape and
 * relationships, not a copy of Chinook's actual sample rows.
 */
export const musicStoreDataset: Dataset = {
  id: "music-store",
  name: "Music Store (Chinook-style)",
  description:
    "A small digital music store — artists, albums, tracks, customers, and invoices. Modeled on the classic Chinook sample database; great for practicing joins and aggregation.",
  tables: [
    { name: "artists", columns: [{ name: "id", type: "INTEGER" }, { name: "name", type: "TEXT" }] },
    {
      name: "albums",
      columns: [
        { name: "id", type: "INTEGER" },
        { name: "title", type: "TEXT" },
        { name: "artist_id", type: "INTEGER" },
      ],
    },
    {
      name: "tracks",
      columns: [
        { name: "id", type: "INTEGER" },
        { name: "name", type: "TEXT" },
        { name: "album_id", type: "INTEGER" },
        { name: "genre", type: "TEXT" },
        { name: "unit_price", type: "REAL" },
      ],
    },
    {
      name: "customers",
      columns: [
        { name: "id", type: "INTEGER" },
        { name: "first_name", type: "TEXT" },
        { name: "last_name", type: "TEXT" },
        { name: "country", type: "TEXT" },
      ],
    },
    {
      name: "invoices",
      columns: [
        { name: "id", type: "INTEGER" },
        { name: "customer_id", type: "INTEGER" },
        { name: "invoice_date", type: "TEXT" },
        { name: "total", type: "REAL" },
      ],
    },
    {
      name: "invoice_items",
      columns: [
        { name: "id", type: "INTEGER" },
        { name: "invoice_id", type: "INTEGER" },
        { name: "track_id", type: "INTEGER" },
        { name: "unit_price", type: "REAL" },
        { name: "quantity", type: "INTEGER" },
      ],
    },
  ],
  seedSql: `
CREATE TABLE artists (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE albums (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  artist_id INTEGER NOT NULL REFERENCES artists(id)
);

CREATE TABLE tracks (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  album_id INTEGER NOT NULL REFERENCES albums(id),
  genre TEXT NOT NULL,
  unit_price REAL NOT NULL
);

CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  country TEXT NOT NULL
);

CREATE TABLE invoices (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  invoice_date TEXT NOT NULL,
  total REAL NOT NULL
);

CREATE TABLE invoice_items (
  id INTEGER PRIMARY KEY,
  invoice_id INTEGER NOT NULL REFERENCES invoices(id),
  track_id INTEGER NOT NULL REFERENCES tracks(id),
  unit_price REAL NOT NULL,
  quantity INTEGER NOT NULL
);

INSERT INTO artists (id, name) VALUES
  (1, 'The Cascades'),
  (2, 'Nova Ember'),
  (3, 'Iron Horizon'),
  (4, 'Quiet Static'),
  (5, 'The Long Division');

INSERT INTO albums (id, title, artist_id) VALUES
  (1, 'Riverbend', 1),
  (2, 'Afterglow', 2),
  (3, 'Steel & Sky', 3),
  (4, 'Low Frequencies', 4),
  (5, 'Remainder', 5),
  (6, 'Second Riverbend', 1),
  (7, 'Ember City', 2),
  (8, 'Iron Horizon Live', 3);

INSERT INTO tracks (id, name, album_id, genre, unit_price) VALUES
  (1, 'Morning Current', 1, 'Folk', 0.99),
  (2, 'Downstream', 1, 'Folk', 0.99),
  (3, 'Afterglow (Intro)', 2, 'Electronic', 1.29),
  (4, 'Neon Tide', 2, 'Electronic', 1.29),
  (5, 'Static Bloom', 2, 'Electronic', 1.29),
  (6, 'Iron Gate', 3, 'Rock', 0.99),
  (7, 'Skyline Fracture', 3, 'Rock', 0.99),
  (8, 'Low End', 4, 'Ambient', 0.79),
  (9, 'Quiet Room', 4, 'Ambient', 0.79),
  (10, 'Remainder Theory', 5, 'Jazz', 1.49),
  (11, 'Division Bell', 5, 'Jazz', 1.49),
  (12, 'Riverbend Reprise', 6, 'Folk', 0.99),
  (13, 'New Current', 6, 'Folk', 0.99),
  (14, 'Ember City Nights', 7, 'Electronic', 1.29),
  (15, 'Iron Horizon Live Intro', 8, 'Rock', 1.99),
  (16, 'Skyline Fracture (Live)', 8, 'Rock', 1.99);

INSERT INTO customers (id, first_name, last_name, country) VALUES
  (1, 'Amara', 'Osei', 'Ghana'),
  (2, 'Diego', 'Fernandez', 'Mexico'),
  (3, 'Priya', 'Nair', 'India'),
  (4, 'Liam', 'O''Connor', 'Ireland'),
  (5, 'Mei', 'Tanaka', 'Japan'),
  (6, 'Sofia', 'Rossi', 'Italy');

INSERT INTO invoices (id, customer_id, invoice_date, total) VALUES
  (1, 1, '2026-01-05', 2.97),
  (2, 2, '2026-01-12', 3.96),
  (3, 3, '2026-02-01', 1.29),
  (4, 4, '2026-02-14', 5.94),
  (5, 1, '2026-03-02', 1.98),
  (6, 5, '2026-03-20', 2.98),
  (7, 6, '2026-04-01', 3.98),
  (8, 2, '2026-04-18', 1.49);

INSERT INTO invoice_items (id, invoice_id, track_id, unit_price, quantity) VALUES
  (1, 1, 1, 0.99, 1),
  (2, 1, 2, 0.99, 2),
  (3, 2, 6, 0.99, 2),
  (4, 2, 7, 0.99, 2),
  (5, 3, 4, 1.29, 1),
  (6, 4, 8, 0.79, 2),
  (7, 4, 9, 0.79, 2),
  (8, 4, 15, 1.99, 2),
  (9, 5, 12, 0.99, 2),
  (10, 6, 3, 1.29, 1),
  (11, 6, 5, 1.29, 1),
  (12, 7, 14, 1.29, 2),
  (13, 7, 4, 1.29, 1),
  (14, 8, 10, 1.49, 1);
`,
};
