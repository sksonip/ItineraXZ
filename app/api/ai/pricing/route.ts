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
          category: {
            type: "string",
          },
          reason: {
            type: "string",
          },
          suggestedAmount: {
            type: "number",
          },
        },
        required: ["category", "reason", "suggestedAmount"],
      },
    },
    notes: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  required: ["suggestions", "notes"],
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
      tripTitle,
      destination,
      duration,
      travellers,
      travelStyle,
      currentPricing,
      itineraryContext,
      accommodation,
      transportation,
      meals,
      activities,
    } = body;

    if (!tripTitle && !destination && !duration) {
      return NextResponse.json(
        {
          error:
            "At least tripTitle, destination, or duration is required.",
        },
        { status: 400 }
      );
    }

    const prompt = `
You are a pricing suggestion assistant for Bettada Jeeva,
a premium slow-travel and expedition itinerary company.

Your job is to suggest a reasonable pricing STRUCTURE
for an itinerary.

IMPORTANT:

- Pricing suggestions are advisory only.
- Do NOT present the result as an exact market price.
- Do NOT invent supplier quotes.
- Do NOT claim that a price is guaranteed.
- Do NOT invent taxes, permits, hotel rates, transportation rates,
  activity fees, or other costs.
- Use the pricing information supplied by the user whenever available.
- If a required cost is unknown, suggest the category but use 0
  rather than inventing a fake amount.
- The application will perform the actual arithmetic.
- Do not calculate the final customer price.
- Do not apply discounts.
- Do not modify existing prices automatically.

The goal is to help the itinerary builder identify useful pricing
categories and optionally suggest amounts where the user has
provided enough information.

TRIP

Title:
${tripTitle || "Not provided"}

Destination:
${destination || "Not provided"}

Duration:
${duration || "Not provided"}

Travellers:
${travellers || "Not provided"}

Travel style:
${travelStyle || "Not provided"}

ACCOMMODATION

${accommodation || "Not provided"}

TRANSPORTATION

${transportation || "Not provided"}

MEALS

${meals || "Not provided"}

ACTIVITIES

${activities || "Not provided"}

CURRENT PRICING

${currentPricing || "No pricing entered yet."}

ITINERARY CONTEXT

${itineraryContext || "Not provided"}

Suggest useful pricing categories such as:

- Transportation
- Accommodation
- Meals
- Guide
- Permits
- Activities
- Airport transfers
- Vehicle
- Miscellaneous

Only include categories that make sense for this itinerary.

For every suggestion provide:

category:
Short pricing category name.

reason:
Brief explanation of why the category may be relevant.

suggestedAmount:
A numeric advisory amount.

If there is not enough information to responsibly suggest
an amount, use 0.

Also provide a small list of notes explaining any important
pricing assumptions or missing information.

Return exactly 5 useful pricing suggestions.
`;

    const result = await generateJson<any>({
      prompt,
      schema: responseSchema,
      temperature: 0.3,
    });

    if (
      !result.suggestions ||
      !Array.isArray(result.suggestions)
    ) {
      throw new Error("Invalid AI pricing response.");
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI pricing error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate pricing suggestions.",
      },
      { status: 500 }
    );
  }
}