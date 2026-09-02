import db from "@/lib/db/client";
import type { Prisma } from "@prisma/client";

type DuplicateDay = {
  id: string;
  itineraryId: string;
  day: number;
  title: string;
  location: string;
  description: string;
  meals: Prisma.JsonValue;
  accommodation: Prisma.JsonValue;
  notes: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
};

type DuplicatePhase = {
  id: string;
  itineraryId: string;
  title: string;
  description: string;
  days: Prisma.JsonValue;
};

export async function duplicateItinerary(
  id: string,
  slug: string
) {
  const existing = await db.itinerary.findUnique({
    where: { id },
    include: {
      days: true,
      phases: true,
    },
  });

  if (!existing) {
    throw new Error("Itinerary not found");
  }

  const {
    id: _id,
    slug: _slug,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    days,
    phases,
    ...itineraryData
  } = existing;

  return db.itinerary.create({
    data: {
      ...itineraryData,
      slug,
      days: {
        create: (days as DuplicateDay[]).map(
          ({ id, itineraryId, createdAt, updatedAt, ...day }) =>
            ({
              ...day,
              meals: day.meals ?? {},
              accommodation: day.accommodation ?? {},
              notes: day.notes ?? [],
            } as Prisma.ItineraryDayCreateWithoutItineraryInput)
        ),
      },
      phases: {
        create: (phases as DuplicatePhase[]).map(
          ({ id, itineraryId, ...phase }) =>
            ({
              ...phase,
              days: phase.days ?? [],
            } as Prisma.ItineraryPhaseCreateWithoutItineraryInput)
        ),
      },
    } as Prisma.ItineraryCreateInput,
    include: {
      days: true,
      phases: true,
    },
  });
}

export async function createDuplicateSlug(
  slug: string
): Promise<string> {
  const existing = await db.itinerary.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!existing) {
    return slug;
  }

  let index = 2;

  while (true) {
    const nextSlug = `${slug}-${index}`;

    const duplicate =
      await db.itinerary.findUnique({
        where: { slug: nextSlug },
        select: { id: true },
      });

    if (!duplicate) {
      return nextSlug;
    }

    index++;
  }
}