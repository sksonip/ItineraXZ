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
            enum: ["rewrite", "shorten", "adventure", "premium"],
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
      tripTitle,
      destination,
      duration,
      phaseTitle,
      dayNumber,
      dayTitle,
      distance,
      altitude,
      overnight,
      description,
      previousDay,
      nextDay,
      tripStyle,
    } = body;

    if (!dayNumber || !dayTitle) {
      return NextResponse.json(
        {
          error: "dayNumber and dayTitle are required.",
        },
        { status: 400 }
      );
    }

    const prompt = `
You are an AI writing assistant for Bettada Jeeva,
a premium slow-travel and expedition itinerary company.

Your job is to suggest better itinerary content for ONE specific day.

IMPORTANT RULES:
- Suggest writing only.
- Do not invent hotels, locations, distances, altitudes,
  activities, cultural facts, prices, or experiences.
- Only use facts explicitly provided in the input.
- Do not change factual information.
- Do not make unsupported claims.
- Keep the writing premium, adventurous, authentic,
  experiential, and concise.
- Avoid generic travel-blog language.
- The user must be able to accept or reject each suggestion.
- Return exactly 4 useful suggestions.
- Each suggestion must be meaningfully different.

TRIP CONTEXT

Trip:
${tripTitle || "Not provided"}

Destination:
${destination || "Not provided"}

Duration:
${duration || "Not provided"}

Trip style:
${tripStyle || "Adventure and slow travel"}

CURRENT PHASE

Phase:
${phaseTitle || "Not provided"}

CURRENT DAY

Day:
${dayNumber}

Day title:
${dayTitle}

Distance:
${distance || "Not provided"}

Altitude:
${altitude || "Not provided"}

Overnight:
${overnight || "Not provided"}

Current description:
${description || "No description has been written yet."}

PREVIOUS DAY:
${previousDay || "Not provided"}

NEXT DAY:
${nextDay || "Not provided"}

Generate four suggestions:

1. A polished rewrite.
2. A shorter and more concise version.
3. A more adventurous version.
4. A more premium and experiential version.

If there is not enough factual information to improve a particular
version without inventing details, stay close to the information
provided.
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

    return NextResponse.json(result);
  } catch (error) {
    console.error("Gemini day suggestion error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate day suggestions.",
      },
      { status: 500 }
    );
  }
}