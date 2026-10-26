const OPENROUTER_URL = `${process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1"}/chat/completions`;
const DEFAULT_MODEL = "openai/gpt-4o-mini";
const REQUEST_TIMEOUT_MS = 45_000;
const MAX_PROMPT_CHARS = 20_000;

export class AiConfigError extends Error {}

export function isAiConfigured() {
  return Boolean(process.env.OPENROUTER_API_KEY);
}

type GenerateJsonOptions = {
  prompt: string;
  /** JSON schema describing the expected response; sent to the model as guidance. */
  schema?: unknown;
  temperature?: number;
};

function parseJson<T>(text: string): T {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1)) as T;
    }

    throw new Error("AI returned invalid JSON.");
  }
}

/**
 * Calls OpenRouter and returns the parsed JSON object.
 * Provider/model are configured via OPENROUTER_API_KEY and AI_MODEL,
 * so the model can be switched without code changes.
 */
export async function generateJson<T>({
  prompt,
  schema,
  temperature = 0.7,
}: GenerateJsonOptions): Promise<T> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new AiConfigError("OPENROUTER_API_KEY is not configured.");
  }

  if (!prompt.trim()) {
    throw new Error("AI prompt cannot be empty.");
  }

  if (prompt.length > MAX_PROMPT_CHARS) {
    throw new Error("AI prompt is too long.");
  }

  const system = [
    "Respond with a single valid JSON object and nothing else.",
    "Do not use markdown or code fences.",
    schema
      ? `The JSON must conform to this JSON schema:\n${JSON.stringify(schema)}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? "http://localhost:3000",
      "X-Title": "ItineraXZ",
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL || DEFAULT_MODEL,
      temperature,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    // Log provider detail server-side only; never return it to the client.
    console.error(
      "OpenRouter error:",
      response.status,
      (await response.text()).slice(0, 500)
    );
    throw new Error(`AI request failed (${response.status}).`);
  }

  const data = await response.json();
  const content: unknown = data?.choices?.[0]?.message?.content;

  if (typeof content !== "string" || !content.trim()) {
    throw new Error("AI returned an empty response.");
  }

  return parseJson<T>(content);
}
