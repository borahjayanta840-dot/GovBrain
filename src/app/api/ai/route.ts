import { NextRequest, NextResponse } from "next/server";
import { generateAnswer } from "@/lib/ai/ai-service";
import { UserMessageSchema } from "@/lib/ai/schemas/ai-request";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsedMessage = UserMessageSchema.safeParse(body?.message);
    if (!parsedMessage.success) {
      return NextResponse.json(
        { error: "Please provide a valid question and conversation.", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    // Server-derived identifier for rate limiting (IP for anonymous users)
    const clientIdentifier =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "anonymous";

    // Generate one grounded answer per turn; the provider can clarify while
    // still answering platform questions and using conversation context.
    const answerResult = await generateAnswer({
      message: {
        ...parsedMessage.data,
      },
      identifier: clientIdentifier,
      is_authenticated: false,
    });

    return NextResponse.json({
      response: answerResult.response,
      usage: answerResult.usage,
      needs_clarification: answerResult.response.needs_clarification,
    });
  } catch (error) {
    console.error("AI API error:", error);

    const errorCode = (error as { code?: string })?.code ?? "AI_ERROR";

    // Don't expose internal errors to client
    return NextResponse.json(
      {
        error:
          errorCode === "RATE_LIMIT"
            ? "Too many requests. Please wait a moment and try again."
            : "AI service is temporarily unavailable. You can still browse our service directory for verified information.",
        code: errorCode === "RATE_LIMIT" ? "RATE_LIMIT" : "SERVICE_UNAVAILABLE",
      },
      { status: errorCode === "VALIDATION_ERROR" ? 400 : errorCode === "RATE_LIMIT" ? 429 : 503 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed", code: "VALIDATION_ERROR" },
    { status: 405 }
  );
}
