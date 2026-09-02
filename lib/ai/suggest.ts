import { generateJson } from "@/lib/ai/gemini";
import { buildItineraryContext } from "../../lib/ai/prompts"

export type SuggestionType =
  | "activity"
  | "restaurant"
  | "accommodation"
  | "day"
  | "route"
  | "general";

export type SuggestInput = {
  destination?: string;
  title?: string;
  duration?: number;
  travelers?: number;
  travelStyle?: string;
  overview?: string;

  itinerary?: unknown;

  currentDay?: unknown;

  type?: SuggestionType;

  query?: string;

  existingSuggestions?: string[];

  additionalInstructions?: string;
};

export type Suggestion = {
  title: string;
  description: string;
  reason?: string;
  category?: string;
};

export type SuggestResult = {
  suggestions: Suggestion[];
};

/* ========================================== */
/* PROMPT                                     */
/* ========================================== */

function buildPrompt(
  input: SuggestInput
): string {
  return `
You are an expert travel itinerary planner.

Generate useful suggestions for improving
or completing the itinerary below.

${buildItineraryContext({
  destination: input.destination,
  title: input.title,
  duration: input.duration,
  travelers: input.travelers,
  travelStyle: input.travelStyle,
  overview: input.overview,
  itinerary: input.itinerary,
})}

SUGGESTION TYPE:
${input.type || "general"}

CURRENT DAY:
${JSON.stringify(
  input.currentDay || {},
  null,
  2
)}

USER QUERY:
${input.query || "None"}

EXISTING SUGGESTIONS:
${JSON.stringify(
  input.existingSuggestions || [],
  null,
  2
)}

ADDITIONAL INSTRUCTIONS:
${
  input.additionalInstructions ||
  "None"
}

REQUIREMENTS:

1. Generate 3 to 6 useful suggestions.

2. Base suggestions on the supplied
   itinerary and destination.

3. Suggestions must be practical and
   relevant to the travel style.

4. Avoid duplicate activities already
   present in the itinerary.

5. Do not invent highly specific facts.

6. Do not fabricate hotel names,
   restaurant names, opening hours,
   prices, travel times, or availability.

7. If recommending an activity, explain
   why it fits the itinerary.

8. Consider geographic efficiency and
   avoid unnecessary backtracking.

9. Consider the duration of the trip.

10. Consider the number of travelers.

11. Avoid generic suggestions such as
    "explore the local culture" unless
    made specific by the supplied data.

12. Keep each suggestion concise.

13. Do not use emojis.

14. Do not use markdown.

15. Do not number the suggestions.

${`
Return ONLY valid JSON.

Do not include markdown, code fences,
comments, or text outside the JSON.

The response must be directly parseable
with JSON.parse().
`}

Use exactly this structure:

{
  "suggestions": [
    {
      "title": "string",
      "description": "string",
      "reason": "string",
      "category": "string"
    }
  ]
}
`;
}

/* ========================================== */
/* NORMALIZE                                  */
/* ========================================== */

function normalizeResult(
  data: unknown
): SuggestResult {
  if (
    !data ||
    typeof data !== "object"
  ) {
    throw new Error(
      "AI returned an invalid suggestions response."
    );
  }

  const suggestions =
    (data as {
      suggestions?: unknown;
    }).suggestions;

  if (!Array.isArray(suggestions)) {
    throw new Error(
      "AI did not return a suggestions array."
    );
  }

  const normalized =
    suggestions
      .filter(
        (
          item
        ): item is Record<
          string,
          unknown
        > =>
          Boolean(
            item &&
              typeof item ===
                "object"
          )
      )
      .map((item) => ({
        title:
          typeof item.title ===
          "string"
            ? item.title.trim()
            : "",

        description:
          typeof item.description ===
          "string"
            ? item.description.trim()
            : "",

        reason:
          typeof item.reason ===
          "string"
            ? item.reason.trim()
            : undefined,

        category:
          typeof item.category ===
          "string"
            ? item.category.trim()
            : undefined,
      }))
      .filter(
        (item) =>
          item.title &&
          item.description
      );

  if (normalized.length === 0) {
    throw new Error(
      "AI returned no valid suggestions."
    );
  }

  /*
   * Remove duplicate suggestions while
   * preserving the original order.
   */

  const seen = new Set<string>();

  const unique =
    normalized.filter((item) => {
      const key =
        item.title.toLowerCase();

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);

      return true;
    });

  return {
    suggestions: unique.slice(0, 6),
  };
}

/* ========================================== */
/* GENERATE SUGGESTIONS                      */
/* ========================================== */

export async function generateSuggestions(
  input: SuggestInput
): Promise<SuggestResult> {
  const prompt =
    buildPrompt(input);

  try {
    const result =
      await generateJson<SuggestResult>(
        prompt
      );

    return normalizeResult(
      result
    );
  } catch (error) {
    console.error(
      "Failed to generate itinerary suggestions:",
      error
    );

    if (error instanceof Error) {
      throw new Error(
        `Failed to generate suggestions: ${error.message}`
      );
    }

    throw new Error(
      "Failed to generate itinerary suggestions."
    );
  }
}

export default generateSuggestions;