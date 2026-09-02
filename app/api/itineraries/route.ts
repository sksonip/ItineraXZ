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