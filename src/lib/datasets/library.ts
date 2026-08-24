import type { Dataset } from "./types";

/**
 * A small neighborhood library — authors, books, members, and loans.
 * Original dataset (not modeled on any specific external sample), designed
 * to make subqueries and CTEs feel natural ("books nobody has borrowed",
 * "members with more than one active loan", etc.).
 */
export const libraryDataset: Dataset = {
  id: "library",
  name: "Corner Library",
  description:
    "A small neighborhood library — authors, books, members, and loans. Good for subqueries and CTEs.",
  tables: [
    { name: "authors", columns: [{ name: "id", type: "INTEGER" }, { name: "name", type: "TEXT" }] },
    {
      name: "books",
      columns: [
        { name: "id", type: "INTEGER" },
        { name: "title", type: "TEXT" },
        { name: "author_id", type: "INTEGER" },
        { name: "year", type: "INTEGER" },
      ],
    },
    {
      name: "members",
      columns: [
        { name: "id", type: "INTEGER" },
        { name: "name", type: "TEXT" },
        { name: "joined_year", type: "INTEGER" },
      ],
    },
    {
      name: "loans",
      columns: [
        { name: "id", type: "INTEGER" },
        { name: "book_id", type: "INTEGER" },
        { name: "member_id", type: "INTEGER" },
        { name: "loan_date", type: "TEXT" },
        { name: "returned", type: "INTEGER" },
      ],
    },
  ],
  seedSql: `
CREATE TABLE authors (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE books (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  author_id INTEGER NOT NULL REFERENCES authors(id),
  year INTEGER NOT NULL
);

CREATE TABLE members (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  joined_year INTEGER NOT NULL
);

CREATE TABLE loans (
  id INTEGER PRIMARY KEY,
  book_id INTEGER NOT NULL REFERENCES books(id),
  member_id INTEGER NOT NULL REFERENCES members(id),
  loan_date TEXT NOT NULL,
  returned INTEGER NOT NULL
);

INSERT INTO authors (id, name) VALUES
  (1, 'Wren Ashby'),
  (2, 'Toma Petrov'),
  (3, 'Ines Calder'),
  (4, 'Dev Okafor');

INSERT INTO books (id, title, author_id, year) VALUES
  (1, 'The Slow Orchard', 1, 2018),
  (2, 'Salt & Signal', 2, 2020),
  (3, 'Nine Winters', 1, 2021),
  (4, 'The Quiet Ledger', 3, 2016),
  (5, 'Harbor Lines', 2, 2022),
  (6, 'Undertow', 4, 2019),
  (7, 'The Cartographer''s Rest', 3, 2023),
  (8, 'Small Hours', 1, 2015);

INSERT INTO members (id, name, joined_year) VALUES
  (1, 'Jonah Reyes', 2019),
  (2, 'Aisha Bello', 2021),
  (3, 'Marta Lindqvist', 2020),
  (4, 'Theo Nakamura', 2022),
  (5, 'Priya Chandra', 2018);

INSERT INTO loans (id, book_id, member_id, loan_date, returned) VALUES
  (1, 1, 1, '2026-01-04', 1),
  (2, 2, 2, '2026-01-10', 1),
  (3, 1, 3, '2026-01-20', 0),
  (4, 4, 1, '2026-02-01', 1),
  (5, 5, 2, '2026-02-05', 0),
  (6, 6, 4, '2026-02-15', 1),
  (7, 2, 5, '2026-03-01', 1),
  (8, 3, 1, '2026-03-10', 0),
  (9, 6, 3, '2026-03-15', 1),
  (10, 5, 4, '2026-03-20', 0);
`,
};
