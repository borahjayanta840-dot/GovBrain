import { type AssistantResponse } from "../schemas/assistant-response";

interface LocalProviderOptions {
  serviceContext?: string;
}

export class LocalProvider {
  private serviceContext: string;

  constructor(options: LocalProviderOptions = {}) {
    this.serviceContext = options.serviceContext ?? "";
  }

  async detectIntent(userMessage: string): Promise<{
    intent: "unknown";
    language: "en";
    confidence: number;
    service_keyword: string | null;
    state_keyword: string | null;
    clarification_needed: boolean;
    clarification_question: string | null;
  }> {
    // Local provider has no NLP, so it only reports whether there was input
    // at all. A real provider (Gemini) performs full intent detection.
    const hasInput = userMessage.trim().length > 0;
    return {
      intent: "unknown",
      language: "en",
      confidence: hasInput ? 0.3 : 0,
      service_keyword: null,
      state_keyword: null,
      clarification_needed: false,
      clarification_question: null,
    };
  }

  async generateAnswer(
    userMessage: string,
    context: string = this.serviceContext,
    language: string = "en",
    _conversationHistory: { role: string; content: string }[] = []
  ): Promise<AssistantResponse> {
    void _conversationHistory;
    if (context.trim()) {
      const lines = context.split("\n").map((line) => line.trim()).filter(Boolean);
      const queryWords = userMessage.toLowerCase().match(/[\p{L}\p{N}]{3,}/gu) ?? [];
      const relevantLines = lines.filter((line) => {
        const normalizedLine = line.toLowerCase();
        return queryWords.some((word) => normalizedLine.includes(word)) ||
          /^(service|description|full description|details|eligibility|how to apply|documents):/i.test(line);
      });
      const answer = this.formatAnswer(relevantLines.length ? relevantLines : lines, language);
      const sourceLine = lines.find((line) => /^(official sources|verified official sources):/i.test(line));
      const officialSources = sourceLine
        ? [...sourceLine.slice(sourceLine.indexOf(":") + 1).matchAll(/([^;—]+?)\s*[—-]\s*(https?:\/\/\S+)/g)].map((match) => ({
            title: match[1].trim(),
            url: match[2].replace(/[),.;]+$/, ""),
          }))
        : [];

      return {
        intent: "service_information",
        language,
        service_id: null,
        answer,
        eligibility: this.extractSection(lines, /^eligibility:/i),
        required_documents: this.extractSection(lines, /^documents:/i),
        next_steps: this.extractSection(lines, /^(how to apply|apply):/i),
        official_sources: officialSources,
        needs_clarification: false,
        clarification_question: null,
      };
    }

    // No context available
    return {
      intent: "unknown",
      language,
      service_id: null,
      answer: "I couldn't verify this information from the available official sources. Please try browsing our service directory for verified information.",
      eligibility: [],
      required_documents: [],
      next_steps: [],
      official_sources: [],
      needs_clarification: false,
      clarification_question: null,
    };
  }

  async generateStructuredResponse(
    userMessage: string,
    dbContext: string,
    options: { language?: string; serviceId?: string } = {}
  ): Promise<AssistantResponse> {
    return this.generateAnswer(userMessage, dbContext, options.language ?? "en");
  }

  private extractSection(lines: string[], section: RegExp): string[] {
    return lines
      .filter((line) => section.test(line))
      .map((line) => line.slice(line.indexOf(":") + 1).trim())
      .filter(Boolean)
      .slice(0, 5);
  }

  private formatAnswer(lines: string[], language: string): string {
    const supportedFacts = lines.filter((line) =>
      /^(identity|purpose|region and languages|how to use|ai limits|privacy and safety|support|service|description|full description|details|eligibility|how to apply|apply|documents):/i.test(line)
    );
    const answer = supportedFacts.map((line) => line.slice(line.indexOf(":") + 1).trim()).join("\n");
    if (answer && language === "hi") return `उपलब्ध जानकारी:\n${answer}`;
    if (answer && language === "as") return `উপলব্ধ তথ্য:\n${answer}`;
    if (answer) return answer;
    if (language === "hi") {
      return "उपलब्ध आधिकारिक स्रोतों से मैं इस जानकारी की पुष्टि नहीं कर सका।";
    }
    if (language === "as") {
      return "উপলব্ধ চৰকাৰী উৎসৰ পৰা এই তথ্য নিশ্চিত কৰিব নোৱাৰিলোঁ।";
    }
    return "I couldn't verify this information from the available official sources.";
  }
}
