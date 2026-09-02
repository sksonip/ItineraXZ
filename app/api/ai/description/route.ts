import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

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
            enum: ["polished", "concise", "adventure", "premium"],
          },
          title: {
            type: "string",
          },
          description: {
            type: "string",
          },
        },
        required: ["type", "title", "description"],
      },
    },
  },
  required: ["suggestions"],
};

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error: "GEMINI_API_KEY is not configured.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const {
      title,
      destination,
      duration,
      startDate,
      endDate,
      travelStyle,
      travellers,
      currentDescription,
      highlights,
      philosophy,
      itineraryContext,
    } = body;

    if (!title && !destination && !currentDescription) {
      return NextResponse.json(
        {
          error:
            "At least one of title, destination, or currentDescription is required.",
        },
        { status: 400 }
      );
    }

    const prompt = `
You are an AI writing assistant for Bettada Jeeva,
a premium slow-travel and expedition itinerary company.

Your task is to suggest improved descriptions for an itinerary.

The description should feel:

- premium
- adventurous
- authentic
- experiential
- concise
- culturally respectful
- human-written
- suitable for a professional travel itinerary

IMPORTANT RULES:

1. Do not invent factual information.
2. Do not invent destinations, hotels, activities, distances,
   altitudes, prices, cultural facts, historical facts, or experiences.
3. Only use information explicitly provided in the input.
4. Do not make unsupported claims.
5. Do not use generic AI phrases such as:
   "embark on an unforgettable journey",
   "breathtaking adventure",
   "hidden gem",
   or similar cliché language.
6. Preserve the actual meaning of the user's description.
7. The suggestions should be usable directly in a professional itinerary.
8. Return exactly four suggestions.
9. Each suggestion should have a clearly different purpose.

ITINERARY INFORMATION

Title:
${title || "Not provided"}

Destination:
${destination || "Not provided"}

Duration:
${duration || "Not provided"}

Start date:
${startDate || "Not provided"}

End date:
${endDate || "Not provided"}

Travel style:
${travelStyle || "Not provided"}

Travellers:
${travellers || "Not provided"}

Current description:
${currentDescription || "No description has been written yet."}

Highlights:
${highlights || "Not provided"}

Travel philosophy:
${philosophy || "Not provided"}

Additional itinerary context:
${itineraryContext || "Not provided"}

GENERATE FOUR SUGGESTIONS:

1. "polished"
Improve the existing description while preserving its meaning.

2. "concise"
Create a shorter, sharper version suitable for a compact itinerary section.

3. "adventure"
Make the writing feel more adventurous while remaining factual.

4. "premium"
Give it a refined, premium expedition tone without exaggerating.

If the current description is empty, create the suggestions
using only the factual information supplied above.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.7,
      },
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty response.");
    }

    const result = JSON.parse(response.text);

    if (
      !result.suggestions ||
      !Array.isArray(result.suggestions)
    ) {
      throw new Error("Invalid response from Gemini.");
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Description AI error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate description suggestions.",
      },
      { status: 500 }
    );
  }
}