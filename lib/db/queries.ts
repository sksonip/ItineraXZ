import db from "@/lib/db/client";
import type { Prisma } from "@prisma/client";

/* ========================================== */
/* ITINERARIES                                */
/* ========================================== */

export async function getItineraries() {
  return db.itinerary.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function getItineraryById(
  id: string
) {
  return db.itinerary.findUnique({
    where: {
      id,
    },
  });
}

export async function getItineraryBySlug(
  slug: string
) {
  return db.itinerary.findUnique({
    where: {
      slug,
    },
  });
}

/* ========================================== */
/* CREATE                                     */
/* ========================================== */

export async function createItinerary(
  data: Parameters<
    typeof db.itinerary.create
  >[0]["data"]
) {
  return db.itinerary.create({
    data,
  });
}

/* ========================================== */
/* UPDATE                                     */
/* ========================================== */

export async function updateItinerary(
  id: string,
  data: Parameters<
    typeof db.itinerary.update
  >[0]["data"]
) {
  return db.itinerary.update({
    where: {
      id,
    },
    data,
  });
}

/* ========================================== */
/* DELETE                                     */
/* ========================================== */

export async function deleteItinerary(
  id: string
) {
  return db.itinerary.delete({
    where: {
      id,
    },
  });
}

/* ========================================== */
/* DUPLICATE                                  */
/* ========================================== */

export async function duplicateItinerary(
  id: string,
  slug: string
) {
  const existing =
    await getItineraryById(id);

  if (!existing) {
    throw new Error(
      "Itinerary not found."
    );
  }

  return db.itinerary.create({
    data: {
      ...existing,
      id: undefined,
      slug,
      createdAt: undefined,
      updatedAt: undefined,
    } as Prisma.ItineraryUncheckedCreateInput,
  });
}

/* ========================================== */
/* SEARCH                                     */
/* ========================================== */

export async function searchItineraries(
  query: string
) {
  const search =
    query.trim();

  if (!search) {
    return getItineraries();
  }

  return db.itinerary.findMany({
    where: {
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          destination: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

/* ========================================== */
/* RECENT                                     */
/* ========================================== */

export async function getRecentItineraries(
  limit = 10
) {
  return db.itinerary.findMany({
    take: Math.max(1, limit),

    orderBy: {
      updatedAt: "desc",
    },
  });
}