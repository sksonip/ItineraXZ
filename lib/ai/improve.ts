import { generateJson } from "@/lib/ai/gemini";

/* ========================================== */
/* TYPES                                      */
/* ========================================== */

export type ImproveInput = {
  destination?: string;
  title?: string;
  overview?: string;

  duration?: number;
  travelers?: number;

  travelStyle?: string;

  itinerary?: unknown;

  content?: string;

  section?:
    | "overview"
    | "day"
    | "activity"
    | "highlights"
    | "inclusions"
    | "exclusions"
    | "general";

  additionalInstructions?: string;
};

export type ImprovedContent = {
  title?: string;
  overview?: string;
  content?: string;

  improvements: string[];

  suggestions: string[];
};

/* ========================================== */
/* PROMPT                                     */
/* ========================================== */

function buildPrompt(
  input: ImproveInput
): string {
  return `
You are an expert travel itinerary editor.

Improve the provided itinerary content while
preserving the original intent and useful
information.

DESTINATION:
${input.destination || "Not specified"}

TITLE:
${input.title || "Not specified"}

DURATION:
${
  input.duration
    ? `${input.duration} days`
    : "Not specified"
}

TRAVELERS:
${input.travelers || "Not specified"}

TRAVEL STYLE:
${input.travelStyle || "Balanced"}

SECTION TO IMPROVE:
${input.section || "general"}

CURRENT CONTENT:
${input.content || "Not specified"}

CURRENT OVERVIEW:
${input.overview || "Not specified"}

FULL ITINERARY:
${JSON.stringify(
  input.itinerary || {},
  null,
  2
)}

ADDITIONAL INSTRUCTIONS:
${
  input.additionalInstructions ||
  "None"
}

REQUIREMENTS:

1. Improve clarity, structure, readability,
   and usefulness.

2. Preserve factual information from the
   original content.

3. Do not invent hotels, attractions,
   activities, prices, timings, distances,
   or other specific facts.

4. Do not change the destination or overall
   travel concept.

5. Remove unnecessary repetition.

6. Replace vague wording with clearer wording
   when the available information allows it.

7. Keep professional travel-proposal language.

8. Keep the writing natural and concise.

9. Do not use emojis.

10. Do not use markdown.

11. Do not make the content unnecessarily
    promotional or exaggerated.

12. If the existing content is already good,
    make only meaningful improvements.

13. Identify what was actually improved.

14. Provide practical suggestions only when
    something genuinely needs attention.

Return ONLY valid JSON.

Use exactly this structure:

{
  "title": "string",
  "overview": "string",
  "content": "string",
  "improvements": [
    "string"
  ],
  "suggestions": [
    "string"
  ]
}
`;
}

/* ========================================== */
/* NORMALIZE                                  */
/* ========================================== */

function normalizeResult(
  data: unknown
): ImprovedContent {
  if (
    !data ||
    typeof data !== "object"
  ) {
    throw new Error(
      "AI returned an invalid improvement response."
    );
  }

  const result = data as {
    title?: unknown;
    overview?: unknown;
    content?: unknown;
    improvements?: unknown;
    suggestions?: unknown;
  };

  const improvements =
    Array.isArray(result.improvements)
      ? result.improvements
          .filter(
            (
              item
            ): item is string =>
              typeof item ===
              "string"
          )
          .map((item) =>
            item.trim()
          )
          .filter(Boolean)
      : [];

  const suggestions =
    Array.isArray(result.suggestions)
      ? result.suggestions
          .filter(
            (
              item
            ): item is string =>
              typeof item ===
              "string"
          )
          .map((item) =>
            item.trim()
          )
          .filter(Boolean)
      : [];

  return {
    title:
      typeof result.title ===
      "string"
        ? result.title.trim()
        : undefined,

    overview:
      typeof result.overview ===
      "string"
        ? result.overview.trim()
        : undefined,

    content:
      typeof result.content ===
      "string"
        ? result.content.trim()
        : undefined,

    improvements,

    suggestions,
  };
}

/* ========================================== */
/* IMPROVE ITINERARY                          */
/* ========================================== */

export async function improveItinerary(
  input: ImproveInput
): Promise<ImprovedContent> {
  if (
    !input.content &&
    !input.overview &&
    !input.itinerary
  ) {
    throw new Error(
      "Content is required for improvement."
    );
  }

  const prompt =
    buildPrompt(input);

  try {
    const result =
      await generateJson<ImprovedContent>(
        prompt
      );

    return normalizeResult(
      result
    );
  } catch (error) {
    console.error(
      "Failed to improve itinerary:",
      error
    );

    if (error instanceof Error) {
      throw new Error(
        `Failed to improve itinerary: ${error.message}`
      );
    }

    throw new Error(
      "Failed to improve itinerary."
    );
  }
}

export default improveItinerary;