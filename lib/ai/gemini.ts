import { GoogleGenerativeAI } from "@google/generative-ai";

/* ========================================== */
/* CONFIG                                     */
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

/* ========================================== */
/* MODEL                                      */
/* ========================================== */

export const gemini =
  genAI.getGenerativeModel({
    model: modelName,
  });

/* ========================================== */
/* GENERATE TEXT                              */
/* ========================================== */

export async function generateText(
  prompt: string
): Promise<string> {
  if (!prompt.trim()) {
    throw new Error(
      "Gemini prompt cannot be empty."
    );
  }

  try {
    const result =
      await gemini.generateContent(
        prompt
      );

    const text =
      result.response.text();

    if (!text?.trim()) {
      throw new Error(
        "Gemini returned an empty response."
      );
    }

    return text.trim();
  } catch (error) {
    console.error(
      "Gemini generation failed:",
      error
    );

    if (error instanceof Error) {
      throw new Error(
        `Gemini generation failed: ${error.message}`
      );
    }

    throw new Error(
      "Gemini generation failed."
    );
  }
}

/* ========================================== */
/* PARSE JSON                                 */
/* ========================================== */

export function parseJson<T>(
  text: string
): T {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  /*
   * First attempt:
   * Gemini returned pure JSON.
   */

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // Continue with extraction.
  }

  /*
   * Second attempt:
   * Gemini wrapped JSON with additional text.
   */

  const objectStart =
    cleaned.indexOf("{");

  const objectEnd =
    cleaned.lastIndexOf("}");

  if (
    objectStart !== -1 &&
    objectEnd > objectStart
  ) {
    try {
      return JSON.parse(
        cleaned.slice(
          objectStart,
          objectEnd + 1
        )
      ) as T;
    } catch {
      // Continue.
    }
  }

  /*
   * Try JSON array as well.
   */

  const arrayStart =
    cleaned.indexOf("[");

  const arrayEnd =
    cleaned.lastIndexOf("]");

  if (
    arrayStart !== -1 &&
    arrayEnd > arrayStart
  ) {
    try {
      return JSON.parse(
        cleaned.slice(
          arrayStart,
          arrayEnd + 1
        )
      ) as T;
    } catch {
      // Continue.
    }
  }

  throw new Error(
    "Gemini returned invalid JSON."
  );
}

/* ========================================== */
/* GENERATE JSON                              */
/* ========================================== */

export async function generateJson<T>(
  prompt: string
): Promise<T> {
  const text =
    await generateText(prompt);

  return parseJson<T>(text);
}