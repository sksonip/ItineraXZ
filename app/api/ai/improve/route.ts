import { NextRequest, NextResponse } from "next/server";
import { generateJson, isAiConfigured } from "@/lib/ai/openrouter";

const responseSchema = {
  type: "object",
  properties: {
    suggestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: [
              "polished",
              "concise",
              "premium",
              "adventure",
              "professional",
            ],
          },
          title: {
            type: "string",
          },
          text: {
            type: "string",
          },
        },
        required: ["type", "title", "text"],
      },
    },
  },
  required: ["suggestions"],
};

export async function POST(request: NextRequest) {
  try {
    if (!isAiConfigured()) {
      return NextResponse.json(
        { error: "AI is not configured." },
        { status: 500 }
      );
    }

    const body = await request.json();

    const {
      text,
      context,
      destination,
      tripTitle,
      travelStyle,
      instruction,
    } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text to improve is required." },
        { status: 400 }
      );
    }

    const prompt = `
You are an AI writing assistant for Bettada Jeeva,
a premium slow-travel and expedition itinerary company.

Improve the user's selected itinerary text.

USER TEXT:
${text}

TRIP TITLE:
${tripTitle || "Not provided"}

DESTINATION:
${destination || "Not provided"}

TRAVEL STYLE:
${travelStyle || "Not provided"}

CONTEXT:
${context || "Not provided"}

USER INSTRUCTION:
${instruction || "Improve the writing while preserving its meaning."}

RULES:

1. Preserve the original factual meaning.
2. Do NOT invent facts.
3. Do NOT add hotels, activities, locations, distances,
   altitudes, cultural facts, historical facts, prices,
   experiences, or claims that were not provided.
4. Do not remove important factual information.
5. Make the writing natural and human.
6. Keep it suitable for a professional travel itinerary.
7. Avoid generic AI/travel clichés.
8. Avoid excessive adjectives.
9. Do not make the text unnecessarily long.
10. Return exactly five different suggestions.

Create:

1. A polished version.
2. A concise version.
3. A premium version.
4. A more adventurous version.
5. A professional and clean version.

Each suggestion must contain:
- type
- title
- text
`;

    const result = await generateJson<any>({
      prompt,
      schema: responseSchema,
      temperature: 0.7,
    });

    if (
      !result.suggestions ||
      !Array.isArray(result.suggestions)
    ) {
      throw new Error("Invalid AI response.");
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI improve error:", error);

    return NextResponse.json(
      {
        error: "Failed to improve the content.",
      },
      { status: 500 }
    );
  }
}