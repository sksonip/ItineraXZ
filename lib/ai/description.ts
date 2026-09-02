import { GoogleGenerativeAI } from "@google/generative-ai";


export type DescriptionInput = {
  destination?: string;
  title?: string;
  overview?: string;

  duration?: number;
  travelers?: number;

  travelStyle?: string;

  highlights?: string[];
  activities?: string[];

  existingDescription?: string;

  additionalInstructions?: string;
};

export type DescriptionResult = {
  description: string;
};

/* ========================================== */
/* GEMINI                                     */
/* ========================================== */

const apiKey =
  process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY is not configured."
  );
}

const genAI =
  new GoogleGenerativeAI(apiKey);

const modelName =
  process.env.GEMINI_MODEL ||
  "gemini-2.5-flash";

const model = genAI.getGenerativeModel({
  model: modelName,
});

/* ========================================== */
/* PROMPT                                     */
/* ========================================== */

function buildPrompt(
  input: DescriptionInput
): string {
  return `
You are an expert travel copywriter.

Write a compelling, accurate description
for a travel itinerary.

ITINERARY INFORMATION:

Destination:
${input.destination || "Not specified"}

Title:
${input.title || "Not specified"}

Duration:
${
  input.duration
    ? `${input.duration} days`
    : "Not specified"
}

Travelers:
${input.travelers || "Not specified"}

Travel style:
${input.travelStyle || "Balanced"}

Highlights:
${JSON.stringify(
  input.highlights || [],
  null,
  2
)}

Activities:
${JSON.stringify(
  input.activities || [],
  null,
  2
)}

Current overview:
${input.overview || "Not specified"}

Existing description:
${
  input.existingDescription ||
  "None"
}

Additional instructions:
${
  input.additionalInstructions ||
  "None"
}

REQUIREMENTS:

1. Write natural, polished travel copy.
2. Make the destination the focus.
3. Highlight the actual experiences provided.
4. Do not invent hotels, attractions,
   activities, prices, or facts.
5. Avoid generic filler.
6. Do not repeat the itinerary title
   excessively.
7. Keep the tone inspiring but credible.
8. Do not use emojis.
9. Do not use markdown.
10. Keep the description between
    80 and 150 words.
11. Make it suitable for a professional
    itinerary or travel proposal.

Return ONLY valid JSON.

Use exactly this structure:

{
  "description": "string"
}
`;
}

/* ========================================== */
/* PARSE RESPONSE                             */
/* ========================================== */

function extractJson(
  text: string
): unknown {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start =
      cleaned.indexOf("{");

    const end =
      cleaned.lastIndexOf("}");

    if (
      start === -1 ||
      end === -1 ||
      end <= start
    ) {
      throw new Error(
        "AI returned invalid JSON."
      );
    }

    return JSON.parse(
      cleaned.slice(
        start,
        end + 1
      )
    );
  }
}

/* ========================================== */
/* NORMALIZE                                  */
/* ========================================== */

function normalizeResult(
  data: any
): DescriptionResult {
  const description =
    typeof data?.description ===
    "string"
      ? data.description.trim()
      : "";

  if (!description) {
    throw new Error(
      "AI did not return a description."
    );
  }

  return {
    description,
  };
}

/* ========================================== */
/* GENERATE DESCRIPTION                       */
/* ========================================== */

export async function generateDescription(
  input: DescriptionInput
): Promise<DescriptionResult> {
  const prompt =
    buildPrompt(input);

  try {
    const result =
      await model.generateContent(
        prompt
      );

    const text =
      result.response.text();

    if (!text?.trim()) {
      throw new Error(
        "AI returned an empty response."
      );
    }

    const parsed =
      extractJson(text);

    return normalizeResult(
      parsed
    );
  } catch (error) {
    console.error(
      "Failed to generate itinerary description:",
      error
    );

    if (error instanceof Error) {
      throw new Error(
        `Failed to generate description: ${error.message}`
      );
    }

    throw new Error(
      "Failed to generate itinerary description."
    );
  }
}

export default generateDescription;