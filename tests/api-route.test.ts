import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";
import { generateAnswer } from "@/lib/ai/ai-service";
import { GET, POST } from "@/app/api/ai/route";

vi.mock("@/lib/ai/ai-service", () => ({
  generateAnswer: vi.fn().mockResolvedValue({
    response: { answer: "Grounded answer", needs_clarification: false },
    usage: { tokens_used: 1, provider: "gemini", latency_ms: 1 },
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

function makePostRequest(body: unknown, headers: Record<string, string> = {}): NextRequest {
  return new Request("http://localhost/api/ai", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  }) as unknown as NextRequest;
}

describe("GET /api/ai", () => {
  it("rejects GET with 405", async () => {
    const res = await GET();
    expect(res.status).toBe(405);
    const data = await res.json();
    expect(data.code).toBe("VALIDATION_ERROR");
  });
});

describe("POST /api/ai request validation", () => {
  it("returns 400 when message.question is missing", async () => {
    const res = await POST(makePostRequest({ message: {} }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.code).toBe("VALIDATION_ERROR");
  });

  it("returns 400 when message is missing entirely", async () => {
    const res = await POST(makePostRequest({ user_id: "u1" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.code).toBe("VALIDATION_ERROR");
  });

  it("returns 400 when question is only whitespace", async () => {
    const res = await POST(makePostRequest({ message: { question: "   " } }));
    expect(res.status).toBe(400);
  });

  it("rejects oversized conversations before contacting the AI provider", async () => {
    const res = await POST(makePostRequest({
      message: {
        question: "What can this platform do?",
        conversation_history: Array.from({ length: 7 }, () => ({ role: "user", content: "Question" })),
      },
    }));

    expect(res.status).toBe(400);
    expect(generateAnswer).not.toHaveBeenCalled();
  });

  it("does not trust client-supplied authentication for AI rate limits", async () => {
    const res = await POST(makePostRequest(
      {
        message: { question: "What can this platform do?" },
        user_id: "client-controlled-user",
        is_authenticated: true,
      },
      { "x-forwarded-for": "203.0.113.4" }
    ));

    expect(res.status).toBe(200);
    expect(generateAnswer).toHaveBeenCalledWith({
      message: { question: "What can this platform do?" },
      identifier: "203.0.113.4",
      is_authenticated: false,
    });
  });

  it("returns a sanitized 503 for malformed JSON without leaking internals", async () => {
    const res = await POST(makePostRequest("{not json"));
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.code).toBe("SERVICE_UNAVAILABLE");
    // The raw parsing error must not be exposed to the client
    expect(data.error).not.toContain("JSON");
    expect(data.error).not.toContain("SyntaxError");
    expect(data.error).toContain("AI service is temporarily unavailable");
  });

  // NOTE: the rate-limit identity is derived from x-forwarded-for / x-real-ip
  // headers (never from the request body). This is covered deterministically by
  // tests/rate-limit.test.ts instead of a slow, costly live AI call here.
});
