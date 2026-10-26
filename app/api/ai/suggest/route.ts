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
              "description",
              "day",
              "highlight",
              "phase",
              "philosophy",
              "inclusion",
              "exclusion",
              "advantage",
              "accommodation",
              "safety",
              "general",
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
        {
          error: "AI is not configured.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const {
      type,
      text,
      instruction,
      tripTitle,
      destination,
      duration,
      travelStyle,
      context,
    } = body;

    if (!type) {
      return NextResponse.json(
        {
          error: "Suggestion type is required.",
        },
        { status: 400 }
      );
    }

    const prompt = `
You are the AI assistant for Bettada Jeeva,
a premium slow-travel and expedition itinerary builder.

The user is currently editing an itinerary and wants suggestions.

YOUR ROLE:
Provide useful writing suggestions that the user can
review and optionally apply.

SUPPORTED CONTENT TYPES:

- description
- day
- highlight
- phase
- philosophy
- inclusion
- exclusion
- advantage
- accommodation
- safety
- general

CURRENT CONTENT TYPE:
${type}

CURRENT TEXT:
${text || "No existing text."}

USER INSTRUCTION:
${instruction || "Suggest improvements appropriate for this content."}

TRIP TITLE:
${tripTitle || "Not provided"}

DESTINATION:
${destination || "Not provided"}

DURATION:
${duration || "Not provided"}

TRAVEL STYLE:
${travelStyle || "Not provided"}

ADDITIONAL CONTEXT:
${context || "Not provided"}

IMPORTANT RULES:

1. Do not invent factual information.
2. Do not invent hotels, activities, destinations,
   distances, altitudes, prices, historical facts,
   cultural facts, or experiences.
3. Preserve facts supplied by the user.
4. Do not change numerical information.
5. Do not make unsupported claims.
6. Keep the writing natural and human.
7. Use a premium expedition tone where appropriate.
8. Avoid generic AI travel clichés.
9. Do not use phrases like:
   "once-in-a-lifetime",
   "unforgettable journey",
   "hidden gem",
   "breathtaking experience",
   unless explicitly present in the user's content.
10. Keep suggestions concise and practical.
11. Return exactly 4 suggestions.
12. Every suggestion must be meaningfully different.

Generate suggestions suitable for the selected content type.

Each suggestion must contain:

type:
The content type.

title:
A short name explaining the suggestion.

text:
The suggested content.
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
    console.error("AI suggestion error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate AI suggestions.",
      },
      { status: 500 }
    );
  }
}