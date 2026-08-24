# ai

Prompt construction for the AI hint helper (`buildPrompt.ts`). All
user-provided text (SQL, error messages) is quoted inside `<data>` tags and
explicitly labeled as data, never as instructions — see the security notes
in `.project-memory/DECISIONS.md`. The actual Gemini call + rate limiting
lives in `src/app/api/ai-hint/route.ts`.
