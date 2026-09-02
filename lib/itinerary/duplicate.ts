import db from "@/lib/db/client";

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
        create: days.map(
          ({
            id: _dayId,
            itineraryId: _itineraryId,
            ...day
          }) => day
        ),
      },
      phases: {
        create: phases.map(
          ({
            id: _phaseId,
            itineraryId: _itineraryId,
            ...phase
          }) => phase
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