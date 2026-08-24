import type { Chapter } from "./types";
import { snackShopDataset } from "@/lib/datasets/snackShop";
import { musicStoreDataset } from "@/lib/datasets/musicStore";

const chapter1: Chapter = {
  id: "ch1-select-basics",
  order: 1,
  title: "Chapter 1: Nibble's Snack Shop",
  description:
    "Nibble just opened a snack shop and needs help looking things up. Learn SELECT, WHERE, and ORDER BY.",
  seedSql: snackShopDataset.seedSql,
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

const upcomingChapters: Chapter[] = [
  { id: "ch4-aggregation", order: 4, title: "Chapter 4: Aggregation & GROUP BY", description: "Coming soon.", seedSql: "", challenges: [], comingSoon: true },
  { id: "ch5-subqueries", order: 5, title: "Chapter 5: Subqueries & CTEs", description: "Coming soon.", seedSql: "", challenges: [], comingSoon: true },
  { id: "ch6-window-functions", order: 6, title: "Chapter 6: Window Functions", description: "Coming soon.", seedSql: "", challenges: [], comingSoon: true },
  { id: "ch7-boss", order: 7, title: "Chapter 7: The Case of the Missing Orders (Boss)", description: "Coming soon.", seedSql: "", challenges: [], comingSoon: true },
];

export const chapters: Chapter[] = [chapter1, chapter2, chapter3, ...upcomingChapters];

export function getChapter(id: string): Chapter | undefined {
  return chapters.find((c) => c.id === id);
}

export function getChallenge(chapterId: string, challengeId: string) {
  return getChapter(chapterId)?.challenges.find((c) => c.id === challengeId);
}
