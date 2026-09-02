import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/*
 * Temporary in-memory storage.
 *
 * Replace these functions with your database layer
 * when Supabase/Prisma is connected.
 */

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
});

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

    const updatedItinerary: Itinerary = {
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