import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { randomUUID } from "crypto";
import { buildHintPrompt } from "@/lib/ai/buildPrompt";

/**
 * The only server-side route in the app. See CLAUDE.md and
 * .project-memory/DECISIONS.md for the full rationale:
 *  - GEMINI_API_KEY is read only here, never sent to the client.
 *  - Rate-limited per session-id (cookie) + per-IP via Upstash Redis.
 *  - User input is quoted as data in the prompt, never as instructions.
 */

const SESSION_COOKIE = "qq_sid";
const MAX_BODY_FIELD_LENGTH = 2000;

let ratelimit: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "60 s"),
    prefix: "queryquest:ai-hint",
  });
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI hint helper isn't configured (missing GEMINI_API_KEY)." },
      { status: 503 }
    );
  }

  // Identify the caller for rate limiting: an IP address plus a
  // browser-scoped session id cookie (created on first use).
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  let sessionId = req.cookies.get(SESSION_COOKIE)?.value;
  const isNewSession = !sessionId;
  if (!sessionId) sessionId = randomUUID();

  if (ratelimit) {
    const { success, reset } = await ratelimit.limit(`${ip}:${sessionId}`);
    if (!success) {
      return NextResponse.json(
        { error: "You're asking for hints a bit fast — try again in a moment.", resetAt: reset },
        { status: 429 }
      );
    }
  }

  let body: { prompt?: unknown; userSql?: unknown; lastError?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.slice(0, MAX_BODY_FIELD_LENGTH) : "";
  const userSql = typeof body.userSql === "string" ? body.userSql.slice(0, MAX_BODY_FIELD_LENGTH) : "";
  const lastError =
    typeof body.lastError === "string" ? body.lastError.slice(0, MAX_BODY_FIELD_LENGTH) : null;

  if (!prompt) {
    return NextResponse.json({ error: "Missing challenge prompt." }, { status: 400 });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(buildHintPrompt({ prompt, userSql, lastError }));
    const hint = result.response.text().trim();

    const res = NextResponse.json({ hint });
    if (isNewSession) {
      res.cookies.set(SESSION_COOKIE, sessionId, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
      });
    }
    return res;
  } catch (err) {
    console.error("ai-hint generation failed:", err);
    return NextResponse.json({ error: "Couldn't reach the AI hint helper right now." }, { status: 502 });
  }
}
