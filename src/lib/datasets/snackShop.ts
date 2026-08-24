import type { Dataset } from "./types";

/** The same dataset used in Chapter 1, exposed for free-form exploration too. */
export const snackShopDataset: Dataset = {
  id: "snack-shop",
  name: "Nibble's Snack Shop",
  description: "The small single-table dataset from Chapter 1 — good for warming up.",
  tables: [
    {
      name: "snacks",
      columns: [
        { name: "id", type: "INTEGER" },
        { name: "name", type: "TEXT" },
        { name: "category", type: "TEXT" },
        { name: "price", type: "REAL" },
        { name: "in_stock", type: "INTEGER" },
      ],
    },
  ],
  seedSql: `
CREATE TABLE snacks (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  in_stock INTEGER NOT NULL
);

INSERT INTO snacks (id, name, category, price, in_stock) VALUES
  (1, 'Byte-Sized Chips', 'salty', 2.50, 1),
  (2, 'Query Berry Juice', 'drink', 3.00, 1),
  (3, 'Recursive Ramen', 'hot', 5.50, 0),
  (4, 'Join Jerky', 'salty', 4.00, 1),
  (5, 'NULL Nougat', 'sweet', 2.00, 1),
  (6, 'Schema Soda', 'drink', 2.75, 1);
`,
};
