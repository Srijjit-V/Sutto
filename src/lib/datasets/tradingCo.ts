import type { Dataset } from "./types";

/**
 * A compact dataset modeled on the well-known "Northwind" sample database
 * (a small trading company — customers, products, orders). Northwind is a
 * free, publicly available teaching database originally from Microsoft
 * Access, widely ported to SQLite (see jpwhite3/northwind-SQLite3 on
 * GitHub). This is a hand-authored, much smaller dataset that follows the
 * same table shape and relationships, not a copy of Northwind's actual
 * sample rows.
 */
export const tradingCoDataset: Dataset = {
  id: "trading-co",
  name: "Trading Co (Northwind-style)",
  description:
    "A small trading company — categories, products, customers, employees, and orders. Modeled on the classic Northwind sample database; great for practicing multi-table joins.",
  tables: [
    { name: "categories", columns: [{ name: "id", type: "INTEGER" }, { name: "name", type: "TEXT" }] },
    {
      name: "products",
      columns: [
        { name: "id", type: "INTEGER" },
        { name: "name", type: "TEXT" },
        { name: "category_id", type: "INTEGER" },
        { name: "unit_price", type: "REAL" },
        { name: "units_in_stock", type: "INTEGER" },
      ],
    },
    {
      name: "customers",
      columns: [
        { name: "id", type: "INTEGER" },
        { name: "company_name", type: "TEXT" },
        { name: "country", type: "TEXT" },
      ],
    },
    {
      name: "employees",
      columns: [
        { name: "id", type: "INTEGER" },
        { name: "first_name", type: "TEXT" },
        { name: "last_name", type: "TEXT" },
        { name: "title", type: "TEXT" },
      ],
    },
    {
      name: "orders",
      columns: [
        { name: "id", type: "INTEGER" },
        { name: "customer_id", type: "INTEGER" },
        { name: "employee_id", type: "INTEGER" },
        { name: "order_date", type: "TEXT" },
      ],
    },
    {
      name: "order_items",
      columns: [
        { name: "id", type: "INTEGER" },
        { name: "order_id", type: "INTEGER" },
        { name: "product_id", type: "INTEGER" },
        { name: "unit_price", type: "REAL" },
        { name: "quantity", type: "INTEGER" },
      ],
    },
  ],
  seedSql: `
CREATE TABLE categories (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  unit_price REAL NOT NULL,
  units_in_stock INTEGER NOT NULL
);

CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  company_name TEXT NOT NULL,
  country TEXT NOT NULL
);

CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  title TEXT NOT NULL
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  employee_id INTEGER NOT NULL REFERENCES employees(id),
  order_date TEXT NOT NULL
);

CREATE TABLE order_items (
  id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  unit_price REAL NOT NULL,
  quantity INTEGER NOT NULL
);

INSERT INTO categories (id, name) VALUES
  (1, 'Beverages'),
  (2, 'Produce'),
  (3, 'Grains'),
  (4, 'Confections');

INSERT INTO products (id, name, category_id, unit_price, units_in_stock) VALUES
  (1, 'Northwind Cola', 1, 2.50, 120),
  (2, 'Highland Tea', 1, 4.00, 60),
  (3, 'Orchard Apples', 2, 1.20, 200),
  (4, 'Valley Carrots', 2, 0.80, 150),
  (5, 'Golden Rice', 3, 3.10, 90),
  (6, 'Harvest Oats', 3, 2.20, 110),
  (7, 'Maple Toffee', 4, 5.50, 40),
  (8, 'Dark Cocoa Bar', 4, 4.75, 55),
  (9, 'Sparkling Water', 1, 1.80, 300),
  (10, 'Winter Squash', 2, 1.00, 80);

INSERT INTO customers (id, company_name, country) VALUES
  (1, 'Aurora Traders', 'Canada'),
  (2, 'Blue Harbor Foods', 'United States'),
  (3, 'Cedar Point Market', 'United States'),
  (4, 'Delta Grocers', 'Mexico'),
  (5, 'Everwood Supply', 'Canada');

INSERT INTO employees (id, first_name, last_name, title) VALUES
  (1, 'Grace', 'Kim', 'Sales Representative'),
  (2, 'Marcus', 'Lee', 'Sales Representative'),
  (3, 'Elena', 'Petrova', 'Sales Manager');

INSERT INTO orders (id, customer_id, employee_id, order_date) VALUES
  (1, 1, 1, '2026-01-08'),
  (2, 2, 2, '2026-01-20'),
  (3, 3, 1, '2026-02-03'),
  (4, 4, 3, '2026-02-17'),
  (5, 1, 2, '2026-03-01'),
  (6, 5, 1, '2026-03-15'),
  (7, 2, 3, '2026-04-02'),
  (8, 3, 2, '2026-04-20');

INSERT INTO order_items (id, order_id, product_id, unit_price, quantity) VALUES
  (1, 1, 1, 2.50, 10),
  (2, 1, 3, 1.20, 20),
  (3, 2, 2, 4.00, 5),
  (4, 2, 7, 5.50, 3),
  (5, 3, 4, 0.80, 15),
  (6, 3, 5, 3.10, 8),
  (7, 4, 6, 2.20, 12),
  (8, 5, 1, 2.50, 6),
  (9, 5, 9, 1.80, 24),
  (10, 6, 8, 4.75, 4),
  (11, 6, 10, 1.00, 10),
  (12, 7, 2, 4.00, 7),
  (13, 7, 3, 1.20, 18),
  (14, 8, 7, 5.50, 2),
  (15, 8, 5, 3.10, 9);
`,
};
