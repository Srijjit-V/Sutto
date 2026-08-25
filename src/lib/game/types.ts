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

export interface ChapterLesson {
  /** The SQL concept this chapter teaches, e.g. "GROUP BY & aggregates". */
  concept: string;
  /** Short bullet points explaining the concept — kept brief, not a textbook. */
  points: string[];
  /** Formal placeholder-notation syntax, W3Schools-style, e.g.
   * "SELECT column1, column2 FROM table_name WHERE condition;" */
  syntax: string;
  /** One worked example shown before the challenges start. */
  example: {
    sql: string;
    note: string;
  };
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
  /** Shown as a presentation-slide-style intro before the challenge list. */
  lesson?: ChapterLesson;
}
