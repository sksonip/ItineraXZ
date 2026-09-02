import type {
  Itinerary,
  ItineraryAdvantage,
  ItineraryPhase,
  ItineraryPricing,
  ItineraryComfortSection,
  ItineraryQuote,
  ItineraryTextBlock,
} from "@/types/itinerary";
import type { ItineraryDay } from "@/types/day";

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function numberValue(
  value: unknown,
  fallback: number
): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function stringArray(
  value: unknown
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is string =>
      typeof item === "string"
  );
}

function normalizeTextBlock(
  value: any
): ItineraryTextBlock {
  return {
    title: stringValue(value?.title),
    text: stringValue(value?.text),
  };
}

function normalizeQuote(
  value: any
): ItineraryQuote {
  return {
    text: stringValue(value?.text),
    attribution: stringValue(value?.attribution),
  };
}

function normalizeAdvantage(
  value: any
): ItineraryAdvantage {
  return {
    title: stringValue(value?.title),
    bullets: stringArray(value?.bullets),
  };
}

function normalizeComfortSection(
  value: any
): ItineraryComfortSection {
  return {
    bullets: stringArray(value?.bullets),
    closingStatement: stringValue(
      value?.closingStatement
    ),
  };
}

function normalizeDay(
  value: any,
  index: number
): ItineraryDay {
  return {
    id:
      stringValue(value?.id) ||
      `day-${index + 1}`,

    day: numberValue(
      value?.day,
      index + 1
    ),

    title:
      stringValue(value?.title) ||
      `Day ${index + 1}`,

    dayLabel: stringValue(value?.dayLabel) || undefined,

    location:
      stringValue(value?.location),

    description:
      stringValue(value?.description),

    distance: stringValue(value?.distance) || undefined,
    altitude: stringValue(value?.altitude) || undefined,
    overnight: stringValue(value?.overnight) || undefined,

    activities: Array.isArray(
      value?.activities
    )
      ? value.activities.map(
          (activity: any, activityIndex: number) => ({
            id:
              stringValue(activity?.id) ||
              `activity-${index + 1}-${activityIndex + 1}`,

            time:
              stringValue(activity?.time),

            title:
              stringValue(activity?.title),

            description:
              stringValue(
                activity?.description
              ),
          })
        )
      : [],

    meals: {
      breakfast: stringValue(
        value?.meals?.breakfast
      ),

      lunch: stringValue(
        value?.meals?.lunch
      ),

      dinner: stringValue(
        value?.meals?.dinner
      ),
    },

    accommodation: {
      name: stringValue(
        value?.accommodation?.name
      ),

      description: stringValue(
        value?.accommodation?.description
      ),
    },

    notes: stringArray(
      value?.notes
    ),
  };
}

function normalizePhase(
  value: any,
  index: number
): ItineraryPhase {
  return {
    id:
      stringValue(value?.id) ||
      `phase-${index + 1}`,

    title:
      stringValue(value?.title) ||
      `Phase ${index + 1}`,

    dayRangeLabel:
      stringValue(value?.dayRangeLabel) ||
      undefined,

    description:
      stringValue(
        value?.description
      ),

    days: Array.isArray(value?.days)
      ? value.days
          .map((day: unknown) =>
            numberValue(day, 0)
          )
          .filter(
            (day: number) => day > 0
          )
      : [],
  };
}

function normalizePricing(
  value: any
): ItineraryPricing {
  return {
    currency:
      stringValue(value?.currency) ||
      "INR",

    items: Array.isArray(
      value?.items
    )
      ? value.items.map(
          (
            item: any,
            index: number
          ) => ({
            id:
              stringValue(item?.id) ||
              `pricing-item-${index + 1}`,

            name:
              stringValue(item?.name),

            category:
              stringValue(
                item?.category
              ),

            quantity: numberValue(
              item?.quantity,
              0
            ),

            unitPrice: numberValue(
              item?.unitPrice,
              0
            ),
          })
        )
      : [],

    adjustments: Array.isArray(
      value?.adjustments
    )
      ? value.adjustments.map(
          (
            adjustment: any,
            index: number
          ) => ({
            id:
              stringValue(
                adjustment?.id
              ) ||
              `adjustment-${index + 1}`,

            name:
              stringValue(
                adjustment?.name
              ),

            type:
              adjustment?.type ===
              "percentage"
                ? "percentage"
                : "fixed",

            value: numberValue(
              adjustment?.value,
              0
            ),

            operation:
              adjustment?.operation ===
              "subtract"
                ? "subtract"
                : "add",
          })
        )
      : [],

    paymentSchedule: Array.isArray(
      value?.paymentSchedule
    )
      ? value.paymentSchedule.map(
          (item: any) => ({
            label: stringValue(item?.label),
            note: stringValue(item?.note),
            amount: numberValue(item?.amount, 0),
          })
        )
      : [],

    disclaimer:
      stringValue(value?.disclaimer) ||
      undefined,
  };
}

export function normalizeItinerary(
  value: unknown
): Itinerary {
  const data =
    value &&
    typeof value === "object"
      ? (value as any)
      : {};

  const days = Array.isArray(
    data.days
  )
    ? data.days.map(
        (day: any, index: number) =>
          normalizeDay(day, index)
      )
    : [];

  const phases = Array.isArray(
    data.phases
  )
    ? data.phases.map(
        (phase: any, index: number) =>
          normalizePhase(
            phase,
            index
          )
      )
    : [];

  return {
    id:
      stringValue(data.id) ||
      undefined,

    slug:
      stringValue(data.slug) ||
      undefined,

    title:
      stringValue(data.title),

    tripName:
      stringValue(data.tripName) ||
      undefined,

    tagline:
      stringValue(data.tagline) ||
      undefined,

    destination:
      stringValue(
        data.destination
      ),

    overview:
      stringValue(data.overview),

    duration: numberValue(
      data.duration,
      days.length || 1
    ),

    travelers: numberValue(
      data.travelers,
      1
    ),

    travelStyle:
      stringValue(
        data.travelStyle
      ) || "Balanced",

    heroImage:
      stringValue(
        data.heroImage
      ) || undefined,

    maxAltitude:
      stringValue(data.maxAltitude) ||
      undefined,

    tempRange:
      stringValue(data.tempRange) ||
      undefined,

    startPoint:
      stringValue(data.startPoint) ||
      undefined,

    endPoint:
      stringValue(data.endPoint) ||
      undefined,

    totalDistanceKm:
      Number.isFinite(
        Number(data.totalDistanceKm)
      )
        ? Number(data.totalDistanceKm)
        : undefined,

    highlights:
      stringArray(
        data.highlights
      ),

    highlightCards: Array.isArray(
      data.highlightCards
    )
      ? data.highlightCards.map(
          (item: any) =>
            normalizeTextBlock(item)
        )
      : [],

    stayPreference:
      data.stayPreference
        ? normalizeTextBlock(
            data.stayPreference
          )
        : undefined,

    foodPreference:
      data.foodPreference
        ? normalizeTextBlock(
            data.foodPreference
          )
        : undefined,

    travelCadence: stringArray(
      data.travelCadence
    ),

    quote: data.quote
      ? normalizeQuote(data.quote)
      : undefined,

    inclusions:
      stringArray(
        data.inclusions
      ),

    exclusions:
      stringArray(
        data.exclusions
      ),

    advantages:
      stringArray(
        data.advantages
      ),

    philosophy:
      stringValue(
        data.philosophy
      ),

    philosophyIntro:
      stringValue(data.philosophyIntro) ||
      undefined,

    pillars: Array.isArray(data.pillars)
      ? data.pillars.map(
          (item: any) =>
            normalizeTextBlock(item)
        )
      : [],

    safety:
      stringValue(
        data.safety
      ),

    accommodations:
      stringArray(
        data.accommodations
      ),

    advantageCards: Array.isArray(
      data.advantageCards
    )
      ? data.advantageCards.map(
          (item: any) =>
            normalizeAdvantage(item)
        )
      : [],

    accommodationComfort:
      data.accommodationComfort
        ? normalizeComfortSection(
            data.accommodationComfort
          )
        : undefined,

    safetyTeam: data.safetyTeam
      ? normalizeComfortSection(
          data.safetyTeam
        )
      : undefined,

    phases,

    days,

    pricing:
      normalizePricing(
        data.pricing
      ),

    createdAt:
      stringValue(
        data.createdAt
      ) || undefined,

    updatedAt:
      stringValue(
        data.updatedAt
      ) || undefined,
  };
}

export function normalizeDays(
  value: unknown
): ItineraryDay[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(
    (day, index) =>
      normalizeDay(day, index)
  );
}

export function normalizePhases(
  value: unknown
): ItineraryPhase[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(
    (phase, index) =>
      normalizePhase(
        phase,
        index
      )
  );
}

export function normalizePricingData(
  value: unknown
): ItineraryPricing {
  return normalizePricing(value);
}

export default normalizeItinerary;