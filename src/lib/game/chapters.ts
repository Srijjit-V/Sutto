import type { Chapter } from "./types";
import { snackShopDataset } from "@/lib/datasets/snackShop";
import { musicStoreDataset } from "@/lib/datasets/musicStore";
import { tradingCoDataset } from "@/lib/datasets/tradingCo";
import { libraryDataset } from "@/lib/datasets/library";
import { leaderboardDataset } from "@/lib/datasets/leaderboard";

const chapter1: Chapter = {
  id: "ch1-select-basics",
  order: 1,
  title: "Chapter 1: Nibble's Snack Shop",
  description:
    "Nibble just opened a snack shop and needs help looking things up. Learn SELECT, WHERE, and ORDER BY.",
  seedSql: snackShopDataset.seedSql,
  lesson: {
    concept: "SELECT, WHERE, ORDER BY, DISTINCT",
    points: [
      "SELECT column_names FROM table picks which columns to return — SELECT * means every column.",
      "WHERE filters rows before they're returned — try WHERE price < 3.",
      "ORDER BY column sorts results; add DESC for highest-to-lowest.",
      "DISTINCT removes duplicate rows from the result.",
    ],
    syntax: `SELECT column1, column2, ...
FROM table_name
WHERE condition
ORDER BY column1 [ASC|DESC];`,
    example: {
      sql: "SELECT name, price FROM snacks WHERE price < 3 ORDER BY price DESC;",
      note: "Shows the name and price of every snack under $3, priciest of those first.",
    },
  },
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

const chapter2: Chapter = {
  id: "ch2-filtering-sorting",
  order: 2,
  title: "Chapter 2: Filtering & Sorting",
  description:
    "Back at the snack shop — combine conditions, match patterns, and sort with multiple keys.",
  seedSql: snackShopDataset.seedSql,
  lesson: {
    concept: "AND / OR, BETWEEN, LIKE",
    points: [
      "AND requires every condition to be true; OR requires at least one.",
      "BETWEEN low AND high includes both endpoints.",
      "LIKE '%text%' matches text anywhere in a column; % is a wildcard.",
    ],
    syntax: `SELECT column1, column2, ...
FROM table_name
WHERE condition1 AND|OR condition2
  AND columnN BETWEEN value1 AND value2
  AND columnN LIKE pattern;`,
    example: {
      sql: "SELECT name FROM snacks WHERE category = 'salty' AND in_stock = 1;",
      note: "Combines two conditions with AND — both must be true for a row to show up.",
    },
  },
  challenges: [
    {
      id: "ch2-q1",
      title: "Salty and in stock",
      story: "A customer only wants salty snacks that are actually available right now.",
      prompt: "Show the name of every salty snack that's currently in stock.",
      starterSql: "SELECT name\nFROM snacks\nWHERE category = 'salty' ",
      expectedColumns: ["name"],
      expectedRows: [["Byte-Sized Chips"], ["Join Jerky"]],
      xpReward: 15,
      coinReward: 8,
      hintFallback: "Combine two conditions with AND — both have to be true for a row to show up.",
    },
    {
      id: "ch2-q2",
      title: "Drink or dessert",
      story: "Nibble wants a combined list of drinks and sweets for the dessert menu.",
      prompt: "Show the name and category of every snack that's a drink or a sweet.",
      starterSql: "SELECT name, category\nFROM snacks\nWHERE ",
      expectedColumns: ["name", "category"],
      expectedRows: [
        ["Query Berry Juice", "drink"],
        ["NULL Nougat", "sweet"],
        ["Schema Soda", "drink"],
      ],
      xpReward: 15,
      coinReward: 8,
      hintFallback: "OR lets either condition satisfy the filter — try `category = 'drink' OR category = 'sweet'`.",
    },
    {
      id: "ch2-q3",
      title: "Mid-range prices",
      story: "Nibble wants to see what's priced for the average customer.",
      prompt: "Show the name and price of snacks priced between 2 and 4 dollars, inclusive.",
      starterSql: "SELECT name, price\nFROM snacks\nWHERE ",
      expectedColumns: ["name", "price"],
      expectedRows: [
        ["Byte-Sized Chips", 2.5],
        ["Query Berry Juice", 3],
        ["Join Jerky", 4],
        ["NULL Nougat", 2],
        ["Schema Soda", 2.75],
      ],
      xpReward: 20,
      coinReward: 10,
      hintFallback: "BETWEEN 2 AND 4 includes both endpoints.",
    },
    {
      id: "ch2-q4",
      title: "Snacks with 'e'",
      story: "Nibble is curating a display shelf and wants snacks with a letter 'e' in the name.",
      prompt:
        "Show the name of every snack whose name contains the letter 'e' (any case), sorted alphabetically.",
      starterSql: "SELECT name\nFROM snacks\nWHERE name LIKE '%e%'\nORDER BY ",
      expectedColumns: ["name"],
      expectedRows: [
        ["Byte-Sized Chips"],
        ["Join Jerky"],
        ["NULL Nougat"],
        ["Query Berry Juice"],
        ["Recursive Ramen"],
        ["Schema Soda"],
      ],
      xpReward: 20,
      coinReward: 10,
      hintFallback: "LIKE '%e%' matches an 'e' anywhere in the text. ORDER BY name sorts A→Z.",
    },
  ],
};

const chapter3: Chapter = {
  id: "ch3-joins",
  order: 3,
  title: "Chapter 3: Joins",
  description:
    "Head over to the Music Store — connect artists, albums, and tracks with JOIN.",
  seedSql: musicStoreDataset.seedSql,
  lesson: {
    concept: "JOIN",
    points: [
      "A JOIN combines rows from two tables that share a related column.",
      "JOIN other_table ON this.foreign_key = other_table.id links them together.",
      "You can chain multiple JOINs to connect three or more tables.",
    ],
    syntax: `SELECT columns
FROM table1
JOIN table2 ON table1.column = table2.column;`,
    example: {
      sql: "SELECT albums.title, artists.name\nFROM albums\nJOIN artists ON albums.artist_id = artists.id;",
      note: "Every album, paired with the artist who made it.",
    },
  },
  challenges: [
    {
      id: "ch3-q1",
      title: "Whose album is it?",
      story: "The store needs a catalog listing each album next to its artist.",
      prompt: "Show the album title and the artist's name for every album.",
      starterSql: "SELECT albums.title, artists.name\nFROM albums\nJOIN artists ON ",
      expectedColumns: ["title", "name"],
      expectedRows: [
        ["Riverbend", "The Cascades"],
        ["Afterglow", "Nova Ember"],
        ["Steel & Sky", "Iron Horizon"],
        ["Low Frequencies", "Quiet Static"],
        ["Remainder", "The Long Division"],
        ["Second Riverbend", "The Cascades"],
        ["Ember City", "Nova Ember"],
        ["Iron Horizon Live", "Iron Horizon"],
      ],
      xpReward: 20,
      coinReward: 10,
      hintFallback: "JOIN artists ON albums.artist_id = artists.id connects the two tables.",
    },
    {
      id: "ch3-q2",
      title: "Every track's artist",
      story: "The store wants a full listing: every track alongside its artist's name.",
      prompt: "Show the track name and the artist name for every track, joining through albums.",
      starterSql:
        "SELECT tracks.name, artists.name\nFROM tracks\nJOIN albums ON tracks.album_id = albums.id\nJOIN artists ON ",
      expectedColumns: ["name", "name"],
      expectedRows: [
        ["Morning Current", "The Cascades"],
        ["Downstream", "The Cascades"],
        ["Afterglow (Intro)", "Nova Ember"],
        ["Neon Tide", "Nova Ember"],
        ["Static Bloom", "Nova Ember"],
        ["Iron Gate", "Iron Horizon"],
        ["Skyline Fracture", "Iron Horizon"],
        ["Low End", "Quiet Static"],
        ["Quiet Room", "Quiet Static"],
        ["Remainder Theory", "The Long Division"],
        ["Division Bell", "The Long Division"],
        ["Riverbend Reprise", "The Cascades"],
        ["New Current", "The Cascades"],
        ["Ember City Nights", "Nova Ember"],
        ["Iron Horizon Live Intro", "Iron Horizon"],
        ["Skyline Fracture (Live)", "Iron Horizon"],
      ],
      xpReward: 25,
      coinReward: 12,
      hintFallback: "You can chain two JOINs: tracks → albums → artists.",
    },
    {
      id: "ch3-q3",
      title: "Who bought what",
      story: "A customer is disputing a charge — find which tracks were on a specific invoice.",
      prompt: "Show the track name and quantity for every item on invoice 4.",
      starterSql:
        "SELECT tracks.name, invoice_items.quantity\nFROM invoice_items\nJOIN tracks ON invoice_items.track_id = tracks.id\nWHERE ",
      expectedColumns: ["name", "quantity"],
      expectedRows: [
        ["Low End", 2],
        ["Quiet Room", 2],
        ["Iron Horizon Live Intro", 2],
      ],
      xpReward: 25,
      coinReward: 12,
      hintFallback: "Filter with WHERE invoice_items.invoice_id = 4.",
    },
    {
      id: "ch3-q4",
      title: "Customers without a country match",
      story: "Nibble wants a directory: every customer with the country they're shipping from.",
      prompt: "Show the first name, last name, and country for every customer, sorted by country.",
      starterSql: "SELECT first_name, last_name, country\nFROM customers\nORDER BY ",
      expectedColumns: ["first_name", "last_name", "country"],
      expectedRows: [
        ["Priya", "Nair", "India"],
        ["Liam", "O'Connor", "Ireland"],
        ["Sofia", "Rossi", "Italy"],
        ["Mei", "Tanaka", "Japan"],
        ["Diego", "Fernandez", "Mexico"],
        ["Amara", "Osei", "Ghana"],
      ],
      orderMatters: false,
      xpReward: 15,
      coinReward: 8,
      hintFallback: "This one doesn't need a JOIN — just ORDER BY country.",
    },
  ],
};

const chapter4: Chapter = {
  id: "ch4-aggregation",
  order: 4,
  title: "Chapter 4: Aggregation & GROUP BY",
  description:
    "Time to help Trading Co make sense of their sales — COUNT, SUM, and GROUP BY turn rows into totals.",
  seedSql: tradingCoDataset.seedSql,
  lesson: {
    concept: "COUNT, SUM, GROUP BY, HAVING",
    points: [
      "GROUP BY collapses rows that share a value into one row per group.",
      "COUNT(*), SUM(col), and AVG(col) compute one number per group.",
      "HAVING filters groups after aggregation — WHERE can't do that, it filters rows before grouping.",
    ],
    syntax: `SELECT column1, COUNT(*)|SUM(column2)|AVG(column2)
FROM table_name
GROUP BY column1
HAVING condition;`,
    example: {
      sql: "SELECT category_id, COUNT(*) AS product_count\nFROM products\nGROUP BY category_id;",
      note: "One row per category, with how many products are in it.",
    },
  },
  challenges: [
    {
      id: "ch4-q1",
      title: "Products per category",
      story: "Trading Co wants to know how their catalog is distributed across categories.",
      prompt: "Show each category name and how many products are in it.",
      starterSql:
        "SELECT categories.name, COUNT(*) AS product_count\nFROM products\nJOIN categories ON products.category_id = categories.id\nGROUP BY ",
      expectedColumns: ["name", "product_count"],
      expectedRows: [
        ["Beverages", 3],
        ["Confections", 2],
        ["Grains", 2],
        ["Produce", 3],
      ],
      orderMatters: false,
      xpReward: 20,
      coinReward: 10,
      hintFallback: "GROUP BY categories.name, then COUNT(*) counts rows in each group.",
    },
    {
      id: "ch4-q2",
      title: "Best sellers",
      story: "Which products have moved the most units? Anything over 15 total is worth restocking fast.",
      prompt:
        "Show the product name and total quantity sold (across all orders) for products that have sold more than 15 units total, highest first.",
      starterSql:
        "SELECT products.name, SUM(order_items.quantity) AS total_qty\nFROM order_items\nJOIN products ON order_items.product_id = products.id\nGROUP BY products.name\nHAVING ",
      expectedColumns: ["name", "total_qty"],
      expectedRows: [
        ["Orchard Apples", 38],
        ["Sparkling Water", 24],
        ["Golden Rice", 17],
        ["Northwind Cola", 16],
      ],
      xpReward: 25,
      coinReward: 12,
      hintFallback: "HAVING SUM(order_items.quantity) > 15 filters groups after the totals are computed.",
    },
    {
      id: "ch4-q3",
      title: "Revenue per order",
      story: "Finance wants a per-order revenue report, biggest orders first.",
      prompt:
        "Show each order's id and its total revenue (unit_price × quantity, summed), highest revenue first.",
      starterSql:
        "SELECT order_id, SUM(unit_price * quantity) AS total\nFROM order_items\nGROUP BY order_id\nORDER BY ",
      expectedColumns: ["order_id", "total"],
      expectedRows: [
        [5, 58.2],
        [7, 49.6],
        [1, 49],
        [8, 38.9],
        [3, 36.8],
        [2, 36.5],
        [6, 29],
        [4, 26.4],
      ],
      xpReward: 25,
      coinReward: 12,
      hintFallback: "Multiply inside SUM: SUM(unit_price * quantity).",
    },
    {
      id: "ch4-q4",
      title: "Busy employees",
      story: "Management wants to know which sales reps are handling the most orders.",
      prompt:
        "Show the full name (first and last, joined with a space) of every employee who has processed more than 2 orders, along with their order count.",
      starterSql:
        "SELECT first_name || ' ' || last_name AS employee, COUNT(*) AS order_count\nFROM orders\nJOIN employees ON orders.employee_id = employees.id\nGROUP BY employee\nHAVING ",
      expectedColumns: ["employee", "order_count"],
      expectedRows: [
        ["Grace Kim", 3],
        ["Marcus Lee", 3],
      ],
      orderMatters: false,
      xpReward: 25,
      coinReward: 12,
      hintFallback: "|| joins text together. HAVING COUNT(*) > 2 keeps only busy employees.",
    },
  ],
};

const chapter5: Chapter = {
  id: "ch5-subqueries",
  order: 5,
  title: "Chapter 5: Subqueries & CTEs",
  description:
    "The Corner Library needs help — answer questions that need a query inside a query.",
  seedSql: libraryDataset.seedSql,
  lesson: {
    concept: "Subqueries & WITH (CTEs)",
    points: [
      "A subquery is a SELECT nested inside another query, often after IN, NOT IN, or =.",
      "A CTE (WITH name AS (...)) gives a subquery a name you can reuse, making complex queries readable.",
      "Subqueries can also appear in the SELECT list, computed once per outer row.",
    ],
    syntax: `-- subquery
SELECT column1 FROM table1
WHERE column2 IN (SELECT column2 FROM table2);

-- CTE
WITH cte_name AS (SELECT ...)
SELECT * FROM cte_name;`,
    example: {
      sql: "SELECT title\nFROM books\nWHERE id NOT IN (SELECT book_id FROM loans);",
      note: "Books that have never been loaned out — the subquery finds every book_id that HAS been loaned, then NOT IN excludes them.",
    },
  },
  challenges: [
    {
      id: "ch5-q1",
      title: "Untouched books",
      story: "The librarian is curating a 'hidden gems' shelf of books nobody has borrowed yet.",
      prompt: "Show the title of every book that has never been loaned out.",
      starterSql: "SELECT title\nFROM books\nWHERE id NOT IN (\n  SELECT book_id FROM loans\n);",
      expectedColumns: ["title"],
      expectedRows: [["The Cartographer's Rest"], ["Small Hours"]],
      orderMatters: false,
      xpReward: 25,
      coinReward: 12,
      hintFallback: "NOT IN (subquery) excludes any id that shows up in the subquery's results.",
    },
    {
      id: "ch5-q2",
      title: "Prolific authors",
      story: "The library wants to spotlight authors with a big catalog.",
      prompt: "Show the name of every author who has written more than 2 books.",
      starterSql:
        "SELECT name\nFROM authors\nWHERE id IN (\n  SELECT author_id FROM books GROUP BY author_id HAVING ",
      expectedColumns: ["name"],
      expectedRows: [["Wren Ashby"]],
      xpReward: 25,
      coinReward: 12,
      hintFallback: "Inside the subquery: GROUP BY author_id HAVING COUNT(*) > 2.",
    },
    {
      id: "ch5-q3",
      title: "Who has a book out",
      story: "The librarian needs a quick list of everyone currently holding an unreturned book.",
      prompt:
        "Using a WITH clause named unreturned, show the name of every member who currently has at least one unreturned book.",
      starterSql:
        "WITH unreturned AS (\n  SELECT member_id FROM loans WHERE returned = 0\n)\nSELECT name\nFROM members\nWHERE id IN (\n  SELECT member_id FROM unreturned\n);",
      expectedColumns: ["name"],
      expectedRows: [["Jonah Reyes"], ["Aisha Bello"], ["Marta Lindqvist"], ["Theo Nakamura"]],
      orderMatters: false,
      xpReward: 25,
      coinReward: 12,
      hintFallback: "The WITH clause is already set up — just SELECT names of members whose id is in it.",
    },
    {
      id: "ch5-q4",
      title: "Loan counts per book",
      story: "The library wants a popularity report: every book, and how many times it's been loaned.",
      prompt:
        "Show every book's title and how many times it has been loaned (0 if never), sorted alphabetically by title.",
      starterSql:
        "SELECT title,\n  (SELECT COUNT(*) FROM loans WHERE loans.book_id = books.id) AS times_loaned\nFROM books\nORDER BY ",
      expectedColumns: ["title", "times_loaned"],
      expectedRows: [
        ["Harbor Lines", 2],
        ["Nine Winters", 1],
        ["Salt & Signal", 2],
        ["Small Hours", 0],
        ["The Cartographer's Rest", 0],
        ["The Quiet Ledger", 1],
        ["The Slow Orchard", 2],
        ["Undertow", 2],
      ],
      xpReward: 30,
      coinReward: 15,
      hintFallback: "This subquery runs once per book — it's called a correlated subquery. ORDER BY title.",
    },
  ],
};

const chapter6: Chapter = {
  id: "ch6-window-functions",
  order: 6,
  title: "Chapter 6: Window Functions",
  description:
    "The Arcade Leaderboard needs ranking, per-player bests, and running totals.",
  seedSql: leaderboardDataset.seedSql,
  lesson: {
    concept: "RANK, ROW_NUMBER, PARTITION BY, running totals",
    points: [
      "Window functions compute a value across a set of rows without collapsing them like GROUP BY does.",
      "RANK() OVER (ORDER BY col DESC) numbers rows by rank, with ties sharing a rank.",
      "PARTITION BY col restarts the window per group — like a GROUP BY that keeps every row.",
      "SUM(col) OVER (ORDER BY col) gives a running total.",
    ],
    syntax: `SELECT column1,
  RANK() OVER (PARTITION BY column2 ORDER BY column3 DESC) AS rnk
FROM table_name;`,
    example: {
      sql: "SELECT name, score,\n  RANK() OVER (ORDER BY score DESC) AS rank\nFROM scores JOIN players ON players.id = scores.player_id\nWHERE game = 'Comet Dash';",
      note: "Every Comet Dash score, ranked from highest to lowest.",
    },
  },
  challenges: [
    {
      id: "ch6-q1",
      title: "Comet Dash rankings",
      story: "Players want to see the full Comet Dash leaderboard, ranked.",
      prompt:
        "Show the player name, score, and rank (highest score = rank 1) for every Comet Dash score, ordered by score descending.",
      starterSql:
        "SELECT players.name, scores.score,\n  RANK() OVER (ORDER BY scores.score DESC) AS rank\nFROM scores\nJOIN players ON players.id = scores.player_id\nWHERE scores.game = 'Comet Dash'\nORDER BY scores.score DESC;",
      expectedColumns: ["name", "score", "rank"],
      expectedRows: [
        ["Ruby", 1900, 1],
        ["Nova", 1750, 2],
        ["Kai", 1600, 3],
        ["Ruby", 1500, 4],
        ["Kai", 1200, 5],
        ["Sam", 900, 6],
      ],
      xpReward: 25,
      coinReward: 12,
      hintFallback: "RANK() OVER (ORDER BY score DESC) numbers the rows from highest score down.",
    },
    {
      id: "ch6-q2",
      title: "Each player's best run",
      story: "The arcade wants a personal-best board — one row per player, their single highest score.",
      prompt: "Show each player's name and their single highest score across any game.",
      starterSql:
        "WITH ranked AS (\n  SELECT players.name, scores.score,\n    ROW_NUMBER() OVER (PARTITION BY scores.player_id ORDER BY scores.score DESC) AS rn\n  FROM scores\n  JOIN players ON players.id = scores.player_id\n)\nSELECT name, score FROM ranked WHERE rn = ",
      expectedColumns: ["name", "score"],
      expectedRows: [
        ["Kai", 1600],
        ["Nova", 1750],
        ["Ruby", 1900],
        ["Sam", 950],
      ],
      orderMatters: false,
      xpReward: 30,
      coinReward: 15,
      hintFallback: "PARTITION BY player_id restarts the numbering for each player. Keep only rn = 1.",
    },
    {
      id: "ch6-q3",
      title: "Kai's running total",
      story: "Kai wants to track their cumulative score over time, across every game they've played.",
      prompt: "Show the date, score, and running total of Kai's scores (player_id 1), ordered by date.",
      starterSql:
        "SELECT played_on, score,\n  SUM(score) OVER (ORDER BY played_on) AS running_total\nFROM scores\nWHERE player_id = 1\nORDER BY ",
      expectedColumns: ["played_on", "score", "running_total"],
      expectedRows: [
        ["2026-01-02", 1200, 1200],
        ["2026-01-05", 1600, 2800],
        ["2026-01-08", 1100, 3900],
      ],
      xpReward: 30,
      coinReward: 15,
      hintFallback: "SUM(score) OVER (ORDER BY played_on) adds each row's score to a running total.",
    },
    {
      id: "ch6-q4",
      title: "Score vs. game average",
      story: "Players want to see how each of their scores compares to the average for that game.",
      prompt:
        "Show the game, score, and the average score for that game (game_avg) for every score, ordered by game then score.",
      starterSql:
        "SELECT game, score,\n  AVG(score) OVER (PARTITION BY game) AS game_avg\nFROM scores\nORDER BY ",
      expectedColumns: ["game", "score", "game_avg"],
      expectedRows: [
        ["Block Stacker", 700, 887.5],
        ["Block Stacker", 800, 887.5],
        ["Block Stacker", 950, 887.5],
        ["Block Stacker", 1100, 887.5],
        ["Comet Dash", 900, 1475],
        ["Comet Dash", 1200, 1475],
        ["Comet Dash", 1500, 1475],
        ["Comet Dash", 1600, 1475],
        ["Comet Dash", 1750, 1475],
        ["Comet Dash", 1900, 1475],
      ],
      xpReward: 30,
      coinReward: 15,
      hintFallback: "AVG(score) OVER (PARTITION BY game) computes each game's average without collapsing rows.",
    },
  ],
};

const chapter7: Chapter = {
  id: "ch7-boss",
  order: 7,
  title: "Chapter 7: The Case of the Big Spenders (Boss)",
  description:
    "The finale — back at Trading Co, combine joins, aggregation, subqueries, and window functions.",
  seedSql: tradingCoDataset.seedSql,
  lesson: {
    concept: "Everything together",
    points: [
      "Boss chapter — no new syntax, just combining JOIN, GROUP BY, subqueries, and window functions.",
      "A good approach: build the query in a CTE first, then query the CTE like a regular table.",
    ],
    syntax: `WITH cte_name AS (
  SELECT ... FROM ... JOIN ... GROUP BY ...
)
SELECT ... FROM cte_name WHERE ...;`,
    example: {
      sql: "WITH totals AS (\n  SELECT customer_id, SUM(unit_price * quantity) AS total\n  FROM order_items\n  JOIN orders ON order_items.order_id = orders.id\n  GROUP BY customer_id\n)\nSELECT * FROM totals;",
      note: "Building a reusable per-customer total as a CTE — the next challenges build on this idea.",
    },
  },
  challenges: [
    {
      id: "ch7-q1",
      title: "Top spenders",
      story: "Trading Co wants to know which customers bring in the most revenue.",
      prompt:
        "Show each customer's company name and total amount spent (unit_price × quantity, summed across all their orders), highest spender first.",
      starterSql:
        "SELECT customers.company_name, SUM(order_items.unit_price * order_items.quantity) AS total_spent\nFROM order_items\nJOIN orders ON order_items.order_id = orders.id\nJOIN customers ON orders.customer_id = customers.id\nGROUP BY customers.company_name\nORDER BY ",
      expectedColumns: ["company_name", "total_spent"],
      expectedRows: [
        ["Aurora Traders", 107.2],
        ["Blue Harbor Foods", 86.1],
        ["Cedar Point Market", 75.7],
        ["Everwood Supply", 29],
        ["Delta Grocers", 26.4],
      ],
      xpReward: 30,
      coinReward: 15,
      hintFallback: "Chain two JOINs: order_items → orders → customers, then GROUP BY company_name.",
    },
    {
      id: "ch7-q2",
      title: "Above-average customers",
      story: "Finance wants to know which customers spend more than the average customer.",
      prompt:
        "Using a CTE of each customer's total spend, show the company names of customers who spent more than the average across all customers.",
      starterSql:
        "WITH customer_totals AS (\n  SELECT customers.company_name AS name, SUM(order_items.unit_price * order_items.quantity) AS total\n  FROM order_items\n  JOIN orders ON order_items.order_id = orders.id\n  JOIN customers ON orders.customer_id = customers.id\n  GROUP BY customers.company_name\n)\nSELECT name\nFROM customer_totals\nWHERE total > (\n  SELECT AVG(total) FROM customer_totals\n);",
      expectedColumns: ["name"],
      expectedRows: [["Aurora Traders"], ["Blue Harbor Foods"], ["Cedar Point Market"]],
      orderMatters: false,
      xpReward: 35,
      coinReward: 18,
      hintFallback: "The CTE is already built for you — just compare each total to the subquery's average.",
    },
    {
      id: "ch7-q3",
      title: "Top 2, ranked",
      story: "Leadership wants a short list: just the top 2 spenders, with their rank.",
      prompt:
        "Using the same customer_totals CTE, show the top 2 customers by spend, with their name, total, and rank.",
      starterSql:
        "WITH customer_totals AS (\n  SELECT customers.company_name AS name, SUM(order_items.unit_price * order_items.quantity) AS total\n  FROM order_items\n  JOIN orders ON order_items.order_id = orders.id\n  JOIN customers ON orders.customer_id = customers.id\n  GROUP BY customers.company_name\n),\nranked AS (\n  SELECT name, total, RANK() OVER (ORDER BY total DESC) AS rnk\n  FROM customer_totals\n)\nSELECT name, total, rnk FROM ranked WHERE rnk <= ",
      expectedColumns: ["name", "total", "rnk"],
      expectedRows: [
        ["Aurora Traders", 107.2, 1],
        ["Blue Harbor Foods", 86.1, 2],
      ],
      xpReward: 40,
      coinReward: 20,
      hintFallback: "WHERE rnk <= 2 keeps only the top two ranks.",
    },
  ],
};

export const chapters: Chapter[] = [chapter1, chapter2, chapter3, chapter4, chapter5, chapter6, chapter7];

export function getChapter(id: string): Chapter | undefined {
  return chapters.find((c) => c.id === id);
}

export function getChallenge(chapterId: string, challengeId: string) {
  return getChapter(chapterId)?.challenges.find((c) => c.id === challengeId);
}
