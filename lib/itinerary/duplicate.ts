import db from "@/lib/db/client";

type DuplicateDay = {
  id: string;
  itineraryId: string;
  day: number;
  title: string;
  location: string;
  description: string;
  meals: unknown;
  accommodation: unknown;
  notes: unknown;
  createdAt: Date;
  updatedAt: Date;
};

type DuplicatePhase = {
  id: string;
  itineraryId: string;
  title: string;
  description: string;
  days: unknown;
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
            day
        ),
      },
      phases: {
        create: (phases as DuplicatePhase[]).map(
          ({ id, itineraryId, ...phase }) => phase
        ),
      },
    },
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