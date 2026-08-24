import type { Chapter } from "./types";

const SNACK_SHOP_SEED = `
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
`;

const chapter1: Chapter = {
  id: "ch1-select-basics",
  order: 1,
  title: "Chapter 1: Nibble's Snack Shop",
  description:
    "Nibble just opened a snack shop and needs help looking things up. Learn SELECT, WHERE, and ORDER BY.",
  seedSql: SNACK_SHOP_SEED,
  challenges: [
    {
      id: "ch1-q1",
      title: "See everything",
      story: "Nibble wants a full inventory list before opening the shop.",
      prompt: "Select every column for every snack in the shop.",
      starterSql: "SELECT * FROM snacks;",
      expectedColumns: ["id", "name", "category", "price", "in_stock"],
      expectedRows: [
        [1, "Byte-Sized Chips", "salty", 2.5, 1],
        [2, "Query Berry Juice", "drink", 3, 1],
        [3, "Recursive Ramen", "hot", 5.5, 0],
        [4, "Join Jerky", "salty", 4, 1],
        [5, "NULL Nougat", "sweet", 2, 1],
        [6, "Schema Soda", "drink", 2.75, 1],
      ],
      xpReward: 10,
      coinReward: 5,
      hintFallback: "SELECT * grabs every column. Don't forget the table name after FROM.",
    },
    {
      id: "ch1-q2",
      title: "Tight budget",
      story: "Nibble only has $3 to spend today.",
      prompt: "Show the name and price of snacks that cost less than 3.",
      starterSql: "SELECT name, price\nFROM snacks\nWHERE ",
      expectedColumns: ["name", "price"],
      expectedRows: [
        ["Byte-Sized Chips", 2.5],
        ["NULL Nougat", 2],
        ["Schema Soda", 2.75],
      ],
      xpReward: 15,
      coinReward: 8,
      hintFallback: "WHERE filters rows before they're returned — try `WHERE price < 3`.",
    },
    {
      id: "ch1-q3",
      title: "Priciest first",
      story: "Nibble wants a price list sorted from most to least expensive.",
      prompt: "Show the name and price of every snack, most expensive first.",
      starterSql: "SELECT name, price\nFROM snacks\nORDER BY ",
      expectedColumns: ["name", "price"],
      expectedRows: [
        ["Recursive Ramen", 5.5],
        ["Join Jerky", 4],
        ["Query Berry Juice", 3],
        ["Schema Soda", 2.75],
        ["Byte-Sized Chips", 2.5],
        ["NULL Nougat", 2],
      ],
      xpReward: 15,
      coinReward: 8,
      hintFallback: "ORDER BY price DESC sorts highest to lowest.",
    },
    {
      id: "ch1-q4",
      title: "What do we sell?",
      story: "A customer asks what kinds of snacks the shop carries.",
      prompt: "List each snack category once, with no duplicates.",
      starterSql: "SELECT DISTINCT category\nFROM snacks;",
      expectedColumns: ["category"],
      expectedRows: [["salty"], ["drink"], ["hot"], ["sweet"]],
      orderMatters: false,
      xpReward: 20,
      coinReward: 10,
      hintFallback: "DISTINCT removes duplicate rows from the result.",
    },
  ],
};

const upcomingChapters: Chapter[] = [
  { id: "ch2-filtering-sorting", order: 2, title: "Chapter 2: Filtering & Sorting", description: "Coming soon.", seedSql: "", challenges: [], comingSoon: true },
  { id: "ch3-joins", order: 3, title: "Chapter 3: Joins", description: "Coming soon.", seedSql: "", challenges: [], comingSoon: true },
  { id: "ch4-aggregation", order: 4, title: "Chapter 4: Aggregation & GROUP BY", description: "Coming soon.", seedSql: "", challenges: [], comingSoon: true },
  { id: "ch5-subqueries", order: 5, title: "Chapter 5: Subqueries & CTEs", description: "Coming soon.", seedSql: "", challenges: [], comingSoon: true },
  { id: "ch6-window-functions", order: 6, title: "Chapter 6: Window Functions", description: "Coming soon.", seedSql: "", challenges: [], comingSoon: true },
  { id: "ch7-boss", order: 7, title: "Chapter 7: The Case of the Missing Orders (Boss)", description: "Coming soon.", seedSql: "", challenges: [], comingSoon: true },
];

export const chapters: Chapter[] = [chapter1, ...upcomingChapters];

export function getChapter(id: string): Chapter | undefined {
  return chapters.find((c) => c.id === id);
}

export function getChallenge(chapterId: string, challengeId: string) {
  return getChapter(chapterId)?.challenges.find((c) => c.id === challengeId);
}
