export interface Challenge {
  id: string;
  title: string;
  story: string;
  prompt: string;
  starterSql: string;
  expectedColumns: string[];
  expectedRows: unknown[][];
  /** Set false when the query's row order isn't guaranteed (e.g. DISTINCT,
   * GROUP BY without ORDER BY) — compares as an unordered multiset instead. */
  orderMatters?: boolean;
  xpReward: number;
  coinReward: number;
  hintFallback: string;
}

export interface Chapter {
  id: string;
  order: number;
  title: string;
  description: string;
  /** SQL run once to set up the chapter's sample database. */
  seedSql: string;
  challenges: Challenge[];
  comingSoon?: boolean;
}
