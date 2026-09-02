/* ========================================== */
/* SHARED AI PROMPTS                          */
/* ========================================== */

export type ItineraryPromptContext = {
  destination?: string;
  title?: string;
  duration?: number;
  travelers?: number;
  travelStyle?: string;
  overview?: string;
  itinerary?: unknown;
};

/* ========================================== */
/* JSON INSTRUCTION                           */
/* ========================================== */

export const JSON_ONLY_INSTRUCTION = `
Return ONLY valid JSON.

Do not include:
- Markdown
- Code fences
- Explanations outside the JSON
- Comments

The response must be directly parseable
with JSON.parse().
`.trim();

/* ========================================== */
/* COMMON CONTEXT                             */
/* ========================================== */

export function buildItineraryContext(
  context: ItineraryPromptContext
): string {
  return `
DESTINATION:
${context.destination || "Not specified"}

TITLE:
${context.title || "Not specified"}

DURATION:
${
  context.duration
    ? `${context.duration} days`
    : "Not specified"
}

TRAVELERS:
${context.travelers || "Not specified"}

TRAVEL STYLE:
${context.travelStyle || "Balanced"}

OVERVIEW:
${context.overview || "Not specified"}

ITINERARY:
${JSON.stringify(
  context.itinerary || {},
  null,
  2
)}
`.trim();
}

/* ========================================== */
/* DAY PROMPT                                 */
/* ========================================== */

export function buildDayPrompt(
  context: ItineraryPromptContext & {
    dayNumber?: number;
    currentDay?: unknown;
    additionalInstructions?: string;
  }
): string {
  return `
You are an expert travel itinerary planner.

Create or improve one day of a professional
travel itinerary.

${buildItineraryContext(context)}

DAY NUMBER:
${context.dayNumber || "Not specified"}

CURRENT DAY:
${JSON.stringify(
  context.currentDay || {},
  null,
  2
)}

ADDITIONAL INSTRUCTIONS:
${
  context.additionalInstructions ||
  "None"
}

REQUIREMENTS:

1. Keep the itinerary realistic.
2. Avoid unnecessary travel and backtracking.
3. Consider reasonable activity pacing.
4. Include appropriate meals and rest.
5. Preserve useful existing information.
6. Do not invent specific facts unnecessarily.
7. Keep descriptions concise.
8. Avoid duplicate activities.
9. Do not use emojis.
10. Do not use markdown.

${JSON_ONLY_INSTRUCTION}

Return:

{
  "title": "string",
  "overview": "string",
  "activities": [
    {
      "time": "string",
      "title": "string",
      "description": "string",
      "duration": "string"
    }
  ],
  "meals": [
    {
      "type": "Breakfast | Lunch | Dinner",
      "description": "string"
    }
  ],
  "accommodation": {
    "name": "string",
    "description": "string"
  },
  "tips": [
    "string"
  ]
}
`.trim();
}

/* ========================================== */
/* DESCRIPTION PROMPT                         */
/* ========================================== */

export function buildDescriptionPrompt(
  context: ItineraryPromptContext & {
    highlights?: string[];
    activities?: unknown[];
    existingDescription?: string;
    additionalInstructions?: string;
  }
): string {
  return `
You are an expert travel copywriter.

Write a polished description for this
travel itinerary.

${buildItineraryContext(context)}

HIGHLIGHTS:
${JSON.stringify(
  context.highlights || [],
  null,
  2
)}

ACTIVITIES:
${JSON.stringify(
  context.activities || [],
  null,
  2
)}

EXISTING DESCRIPTION:
${
  context.existingDescription ||
  "None"
}

ADDITIONAL INSTRUCTIONS:
${
  context.additionalInstructions ||
  "None"
}

REQUIREMENTS:

1. Focus on the actual itinerary.
2. Make the destination the focus.
3. Highlight distinctive experiences.
4. Do not invent facts.
5. Avoid generic filler.
6. Avoid excessive repetition.
7. Use professional travel language.
8. Keep it between 80 and 150 words.
9. Do not use emojis.
10. Do not use markdown.

${JSON_ONLY_INSTRUCTION}

Return:

{
  "description": "string"
}
`.trim();
}

/* ========================================== */
/* HIGHLIGHTS PROMPT                          */
/* ========================================== */

export function buildHighlightsPrompt(
  context: ItineraryPromptContext & {
    activities?: unknown[];
    accommodations?: unknown[];
    meals?: unknown[];
    existingHighlights?: string[];
    additionalInstructions?: string;
  }
): string {
  return `
You are an expert travel itinerary editor.

Generate the most valuable highlights from
the itinerary below.

${buildItineraryContext(context)}

ACTIVITIES:
${JSON.stringify(
  context.activities || [],
  null,
  2
)}

ACCOMMODATIONS:
${JSON.stringify(
  context.accommodations || [],
  null,
  2
)}

MEALS:
${JSON.stringify(
  context.meals || [],
  null,
  2
)}

EXISTING HIGHLIGHTS:
${JSON.stringify(
  context.existingHighlights || [],
  null,
  2
)}

ADDITIONAL INSTRUCTIONS:
${
  context.additionalInstructions ||
  "None"
}

REQUIREMENTS:

1. Generate 4 to 8 highlights.
2. Base them on the supplied itinerary.
3. Prioritize distinctive experiences.
4. Avoid vague statements.
5. Do not invent activities or attractions.
6. Avoid duplicates.
7. Keep each highlight concise.
8. Do not number them.
9. Do not use emojis.
10. Do not use markdown.

${JSON_ONLY_INSTRUCTION}

Return:

{
  "highlights": [
    "string",
    "string",
    "string",
    "string"
  ]
}
`.trim();
}

/* ========================================== */
/* IMPROVE PROMPT                             */
/* ========================================== */

export function buildImprovePrompt(
  context: ItineraryPromptContext & {
    content?: string;
    section?: string;
    additionalInstructions?: string;
  }
): string {
  return `
You are an expert travel itinerary editor.

Improve the supplied itinerary content.

${buildItineraryContext(context)}

SECTION:
${context.section || "general"}

CONTENT TO IMPROVE:
${context.content || "Not specified"}

ADDITIONAL INSTRUCTIONS:
${
  context.additionalInstructions ||
  "None"
}

REQUIREMENTS:

1. Preserve the original intent.
2. Preserve useful factual information.
3. Improve clarity and readability.
4. Remove unnecessary repetition.
5. Make vague wording more precise when
   possible from the supplied information.
6. Do not invent hotels, attractions,
   prices, timings, or distances.
7. Do not change the destination.
8. Do not exaggerate.
9. Keep the writing professional.
10. Do not use emojis.
11. Do not use markdown.
12. Make only meaningful improvements.

${JSON_ONLY_INSTRUCTION}

Return:

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
`.trim();
}

/* ========================================== */
/* PRICING PROMPT                             */
/* ========================================== */

export function buildPricingPrompt(
  context: ItineraryPromptContext & {
    currency?: string;
    subtotal?: number;
    adjustmentsTotal?: number;
    total?: number;
    perPerson?: number;
    items?: unknown[];
    additionalInstructions?: string;
  }
): string {
  return `
You are a professional travel pricing
consultant.

Review the calculated itinerary pricing.

${buildItineraryContext(context)}

CURRENCY:
${context.currency || "INR"}

SUBTOTAL:
${context.subtotal ?? 0}

ADJUSTMENTS:
${context.adjustmentsTotal ?? 0}

TOTAL:
${context.total ?? 0}

PER PERSON:
${context.perPerson ?? 0}

PRICING ITEMS:
${JSON.stringify(
  context.items || [],
  null,
  2
)}

ADDITIONAL INSTRUCTIONS:
${
  context.additionalInstructions ||
  "None"
}

IMPORTANT:

The supplied numerical values are
authoritative.

Do NOT recalculate, change, estimate,
or invent pricing values.

REQUIREMENTS:

1. Explain the pricing clearly.
2. Identify obvious cost drivers.
3. Provide recommendations only when
   supported by the supplied data.
4. Do not invent market prices.
5. Do not invent taxes or fees.
6. Do not use emojis.
7. Do not use markdown.

${JSON_ONLY_INSTRUCTION}

Return:

{
  "aiSummary": "string",
  "recommendations": [
    "string"
  ]
}
`.trim();
}