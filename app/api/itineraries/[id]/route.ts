import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  itineraries,
  type StoredItinerary,
} from "@/lib/db/memory-store";

/*
 * Temporary in-memory storage.
 *
 * Replace these functions with your database layer
 * when Supabase/Prisma is connected.
 */

const itineraryUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  destination: z.string().min(1).optional(),
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
}).passthrough();

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET /api/itineraries/:id
 *
 * Fetch one itinerary.
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const itinerary = itineraries.get(id);

    if (!itinerary) {
      return NextResponse.json(
        {
          error: "Itinerary not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      itinerary,
    });
  } catch (error) {
    console.error("Get itinerary error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch itinerary.",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/itineraries/:id
 *
 * Update an itinerary.
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const existing = itineraries.get(id);

    if (!existing) {
      return NextResponse.json(
        {
          error: "Itinerary not found.",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    const validation = itineraryUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid itinerary data.",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const updatedItinerary: StoredItinerary = {
      ...existing,
      ...validation.data,
      id,
      updatedAt: new Date().toISOString(),
    };

    itineraries.set(id, updatedItinerary);

    return NextResponse.json({
      message: "Itinerary updated successfully.",
      itinerary: updatedItinerary,
    });
  } catch (error) {
    console.error("Update itinerary error:", error);

    return NextResponse.json(
      {
        error: "Failed to update itinerary.",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/itineraries/:id
 *
 * Delete an itinerary.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const exists = itineraries.has(id);

    if (!exists) {
      return NextResponse.json(
        {
          error: "Itinerary not found.",
        },
        { status: 404 }
      );
    }

    itineraries.delete(id);

    return NextResponse.json({
      message: "Itinerary deleted successfully.",
    });
  } catch (error) {
    console.error("Delete itinerary error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete itinerary.",
      },
      { status: 500 }
    );
  }
}