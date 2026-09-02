import type {
  Itinerary,
  ItineraryPhase,
  ItineraryPricing,
} from "@/types/itinerary";

import type {
  DayActivity,
  ItineraryDay,
} from "@/types/day";

export const defaultActivity: DayActivity = {
  id: "",
  time: "",
  title: "",
  description: "",
  duration: "",
};

export const defaultDay: ItineraryDay = {
  id: "",
  day: 1,
  title: "Day 1",
  location: "",
  description: "",
  activities: [],
  meals: {
    breakfast: "",
    lunch: "",
    dinner: "",
  },
  accommodation: {
    name: "",
    description: "",
  },
  notes: [],
};

export const defaultPhase: ItineraryPhase = {
  id: "",
  title: "",
  description: "",
  days: [],
};

export const defaultPricing: ItineraryPricing = {
  currency: "INR",
  items: [],
  adjustments: [],
};

export const defaultItinerary: Itinerary = {
  id: "",
  slug: "",
  title: "",
  destination: "",
  overview: "",
  duration: 1,
  travelers: 1,
  travelStyle: "Balanced",
  heroImage: "",
  highlights: [],
  inclusions: [],
  exclusions: [],
  advantages: [],
  philosophy: "",
  safety: "",
  accommodations: [],
  phases: [],
  days: [defaultDay],
  pricing: defaultPricing,
};

export function createDefaultActivity(): DayActivity {
  return {
    ...defaultActivity,
    id: `activity-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
  };
}

export function createDefaultDay(
  day = 1
): ItineraryDay {
  return {
    ...defaultDay,
    id: `day-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    day,
    title: `Day ${day}`,
    activities: [],
    meals: {
      ...defaultDay.meals,
    },
    accommodation: {
      ...defaultDay.accommodation,
    },
    notes: [],
  };
}

export function createDefaultPhase(
  index = 1
): ItineraryPhase {
  return {
    ...defaultPhase,
    id: `phase-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    title: `Phase ${index}`,
    days: [],
  };
}

export function createDefaultPricing(): ItineraryPricing {
  return {
    currency: "INR",
    items: [],
    adjustments: [],
  };
}

export function createDefaultItinerary(): Itinerary {
  return {
    ...defaultItinerary,
    id: "",
    slug: "",
    days: [
      createDefaultDay(1),
    ],
    phases: [],
    pricing:
      createDefaultPricing(),
  };
}