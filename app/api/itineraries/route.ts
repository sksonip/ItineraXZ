import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type Itinerary = {
  id: string;
  title: string;
  destination: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  travellers?: number;
  travelStyle?: string;
  description?: string;
  highlights?: string[];
  philosophy?: string;
  phases?: unknown[];
  pricing?: unknown;
  tripName?: string;
  tagline?: string;
  maxAltitude?: string;
  tempRange?: string;
  startPoint?: string;
  endPoint?: string;
  totalDistanceKm?: number;
  highlightCards?: unknown[];
  stayPreference?: unknown;
  foodPreference?: unknown;
  travelCadence?: string[];
  quote?: unknown;
  philosophyIntro?: string;
  pillars?: unknown[];
  advantageCards?: unknown[];
  accommodationComfort?: unknown;
  safetyTeam?: unknown;
  createdAt: string;
  updatedAt: string;
};

const itineraries = new Map<string, Itinerary>();

const createItinerarySchema = z.object({
  title: z.string().min(1, "Title is required."),
  destination: z.string().min(1, "Destination is required."),
  duration: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  travellers: z.number().int().positive().optional(),
  travelStyle: z.string().optional(),
  description: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  philosophy: z.string().optional(),
  phases: z.array(z.unknown()).optional(),
  pricing: z.unknown().optional(),
  tripName: z.string().optional(),
  tagline: z.string().optional(),
  maxAltitude: z.string().optional(),
  tempRange: z.string().optional(),
  startPoint: z.string().optional(),
  endPoint: z.string().optional(),
  totalDistanceKm: z.number().finite().min(0).optional(),
  highlightCards: z.array(z.unknown()).optional(),
  stayPreference: z.unknown().optional(),
  foodPreference: z.unknown().optional(),
  travelCadence: z.array(z.string()).optional(),
  quote: z.unknown().optional(),
  philosophyIntro: z.string().optional(),
  pillars: z.array(z.unknown()).optional(),
  advantageCards: z.array(z.unknown()).optional(),
  accommodationComfort: z.unknown().optional(),
  safetyTeam: z.unknown().optional(),
});

/**
 * GET /api/itineraries
 *
 * Return all itineraries.
 */
export async function GET() {
  try {
    const data = Array.from(itineraries.values());

    return NextResponse.json({
      itineraries: data,
      count: data.length,
    });
  } catch (error) {
    console.error("List itineraries error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch itineraries.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/itineraries
 *
 * Create a new itinerary.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = createItinerarySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid itinerary data.",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const id = crypto.randomUUID();

    const itinerary: Itinerary = {
      id,
      ...validation.data,
      createdAt: now,
      updatedAt: now,
    };

    itineraries.set(id, itinerary);

    return NextResponse.json(
      {
        message: "Itinerary created successfully.",
        itinerary,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create itinerary error:", error);

    return NextResponse.json(
      {
        error: "Failed to create itinerary.",
      },
      { status: 500 }
    );
  }
}