import type { Dataset } from "./types";

/**
 * An arcade leaderboard — players and their scores across a few games.
 * Original dataset, designed specifically to make window functions
 * (RANK, ROW_NUMBER, running totals) feel natural.
 */
export const leaderboardDataset: Dataset = {
  id: "leaderboard",
  name: "Arcade Leaderboard",
  description: "Players and scores across a few arcade games — built for window functions.",
  tables: [
    { name: "players", columns: [{ name: "id", type: "INTEGER" }, { name: "name", type: "TEXT" }] },
    {
      name: "scores",
      columns: [
        { name: "id", type: "INTEGER" },
        { name: "player_id", type: "INTEGER" },
        { name: "game", type: "TEXT" },
        { name: "score", type: "INTEGER" },
        { name: "played_on", type: "TEXT" },
      ],
    },
  ],
  seedSql: `
CREATE TABLE players (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE scores (
  id INTEGER PRIMARY KEY,
  player_id INTEGER NOT NULL REFERENCES players(id),
  game TEXT NOT NULL,
  score INTEGER NOT NULL,
  played_on TEXT NOT NULL
);

INSERT INTO players (id, name) VALUES
  (1, 'Kai'),
  (2, 'Ruby'),
  (3, 'Sam'),
  (4, 'Nova');

INSERT INTO scores (id, player_id, game, score, played_on) VALUES
  (1, 1, 'Comet Dash', 1200, '2026-01-02'),
  (2, 2, 'Comet Dash', 1500, '2026-01-02'),
  (3, 3, 'Comet Dash', 900, '2026-01-03'),
  (4, 4, 'Comet Dash', 1750, '2026-01-03'),
  (5, 1, 'Comet Dash', 1600, '2026-01-05'),
  (6, 2, 'Block Stacker', 800, '2026-01-06'),
  (7, 3, 'Block Stacker', 950, '2026-01-06'),
  (8, 4, 'Block Stacker', 700, '2026-01-07'),
  (9, 1, 'Block Stacker', 1100, '2026-01-08'),
  (10, 2, 'Comet Dash', 1900, '2026-01-09');
`,
};
