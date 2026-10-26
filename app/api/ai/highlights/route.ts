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
          title: {
            type: "string",
          },
          text: {
            type: "string",
          },
        },
        required: ["title", "text"],
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
      tripTitle,
      destination,
      duration,
      travelStyle,
      currentHighlights,
      description,
      philosophy,
      itineraryContext,
    } = body;

    if (!tripTitle && !destination && !description) {
      return NextResponse.json(
        {
          error:
            "At least tripTitle, destination, or description is required.",
        },
        { status: 400 }
      );
    }

    const prompt = `
You are an AI writing assistant for Bettada Jeeva,
a premium slow-travel and expedition itinerary company.

Generate useful itinerary HIGHLIGHTS for the trip below.

Highlights should be:

- short
- specific
- memorable
- premium
- adventurous
- suitable for a professional itinerary
- easy to scan

IMPORTANT RULES:

1. Do NOT invent facts.
2. Do NOT invent locations, activities, hotels, distances,
   altitudes, cultural facts, historical facts, or experiences.
3. Use ONLY information provided in the trip context.
4. Avoid generic travel clichés.
5. Do not use phrases such as:
   "once-in-a-lifetime",
   "unforgettable journey",
   "hidden gem",
   "breathtaking experience",
   unless the user explicitly provided those facts.
6. Each highlight should communicate one distinct aspect of the trip.
7. Do not duplicate the same idea.
8. Return exactly 6 suggestions.
9. Keep each highlight concise, preferably under 15 words.

TRIP INFORMATION

Trip title:
${tripTitle || "Not provided"}

Destination:
${destination || "Not provided"}

Duration:
${duration || "Not provided"}

Travel style:
${travelStyle || "Not provided"}

Current highlights:
${currentHighlights || "None"}

Description:
${description || "Not provided"}

Travel philosophy:
${philosophy || "Not provided"}

Itinerary context:
${itineraryContext || "Not provided"}

Generate six different highlight suggestions.

Each suggestion should contain:

title:
A short label of 2–5 words.

text:
The actual highlight, preferably under 15 words.
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
    console.error("Highlights AI error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate highlight suggestions.",
      },
      { status: 500 }
    );
  }
}