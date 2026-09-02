import { generateJson } from "@/lib/ai/gemini";

/* ========================================== */
/* TYPES                                      */
/* ========================================== */

export type HighlightsInput = {
  destination?: string;
  title?: string;
  overview?: string;

  duration?: number;
  travelers?: number;

  travelStyle?: string;

  activities?: string[];
  accommodations?: string[];
  meals?: string[];

  existingHighlights?: string[];

  additionalInstructions?: string;
};

export type HighlightsResult = {
  highlights: string[];
};

/* ========================================== */
/* PROMPT                                     */
/* ========================================== */

function buildPrompt(
  input: HighlightsInput
): string {
  return `
You are an expert travel itinerary editor.

Generate the key highlights for the itinerary
below.

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

OVERVIEW:
${input.overview || "Not specified"}

ACTIVITIES:
${JSON.stringify(
  input.activities || [],
  null,
  2
)}

ACCOMMODATIONS:
${JSON.stringify(
  input.accommodations || [],
  null,
  2
)}

MEALS:
${JSON.stringify(
  input.meals || [],
  null,
  2
)}

EXISTING HIGHLIGHTS:
${JSON.stringify(
  input.existingHighlights || [],
  null,
  2
)}

ADDITIONAL INSTRUCTIONS:
${
  input.additionalInstructions ||
  "None"
}

REQUIREMENTS:

1. Generate 4 to 8 strong itinerary highlights.
2. Base highlights on the actual itinerary.
3. Prioritize distinctive experiences.
4. Avoid generic statements such as
   "beautiful scenery" or "unforgettable trip."
5. Do not invent attractions, hotels,
   activities, or experiences.
6. Keep each highlight concise.
7. Each highlight should be suitable for
   a professional travel proposal.
8. Avoid duplicate highlights.
9. Do not use emojis.
10. Do not use markdown.
11. Do not number the highlights.
12. Prefer specific experiences over vague
    descriptions.
13. If existing highlights are already good,
    improve them rather than blindly replacing them.

Return ONLY valid JSON.

Use exactly this structure:

{
  "highlights": [
    "string",
    "string",
    "string",
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
): HighlightsResult {
  if (
    !data ||
    typeof data !== "object"
  ) {
    throw new Error(
      "AI returned an invalid highlights response."
    );
  }

  const highlights =
    (data as {
      highlights?: unknown;
    }).highlights;

  if (!Array.isArray(highlights)) {
    throw new Error(
      "AI did not return a highlights array."
    );
  }

  const cleaned = highlights
    .filter(
      (highlight): highlight is string =>
        typeof highlight === "string"
    )
    .map((highlight) =>
      highlight.trim()
    )
    .filter(Boolean);

  if (cleaned.length === 0) {
    throw new Error(
      "AI returned no valid highlights."
    );
  }

  /*
   * Remove duplicate highlights while
   * preserving their original order.
   */

  const unique = Array.from(
    new Set(
      cleaned.map((highlight) =>
        highlight.toLowerCase()
      )
    )
  ).map((normalized) =>
    cleaned.find(
      (highlight) =>
        highlight.toLowerCase() ===
        normalized
    )!
  );

  return {
    highlights: unique.slice(0, 8),
  };
}

/* ========================================== */
/* GENERATE HIGHLIGHTS                        */
/* ========================================== */

export async function generateHighlights(
  input: HighlightsInput
): Promise<HighlightsResult> {
  const prompt =
    buildPrompt(input);

  try {
    const result =
      await generateJson<HighlightsResult>(
        prompt
      );

    return normalizeResult(result);
  } catch (error) {
    console.error(
      "Failed to generate itinerary highlights:",
      error
    );

    if (error instanceof Error) {
      throw new Error(
        `Failed to generate highlights: ${error.message}`
      );
    }

    throw new Error(
      "Failed to generate itinerary highlights."
    );
  }
}

export default generateHighlights;