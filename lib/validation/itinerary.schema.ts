import { z } from "zod";

const activitySchema = z.object({
  id: z.string().optional(),
  time: z.string().trim().max(50).optional().or(z.literal("")),
  title: z
    .string()
    .trim()
    .min(1, "Activity title is required")
    .max(200, "Activity title is too long"),
  description: z
    .string()
    .trim()
    .max(1000, "Activity description is too long"),
  duration: z
    .string()
    .trim()
    .max(50)
    .optional()
    .or(z.literal("")),
});

const mealSchema = z.object({
  type: z
    .string()
    .trim()
    .min(1, "Meal type is required")
    .max(50),
  description: z
    .string()
    .trim()
    .max(500),
});

const accommodationSchema = z.object({
  name: z
    .string()
    .trim()
    .max(200),
  description: z
    .string()
    .trim()
    .max(1000),
});

const textBlockSchema = z.object({
  title: z.string().trim().max(200),
  text: z.string().trim().max(2000),
});

const quoteSchema = z.object({
  text: z.string().trim().max(2000),
  attribution: z.string().trim().max(200),
});

const advantageSchema = z.object({
  title: z.string().trim().max(200),
  bullets: z.array(z.string().trim().max(500)).default([]),
});

const comfortSectionSchema = z.object({
  bullets: z.array(z.string().trim().max(500)).default([]),
  closingStatement: z.string().trim().max(2000),
});

const daySchema = z.object({
  id: z.string().optional(),

  day: z
    .number()
    .int()
    .min(1),

  dayLabel: z.string().trim().max(100).optional(),

  title: z
    .string()
    .trim()
    .min(1, "Day title is required")
    .max(200),

  location: z
    .string()
    .trim()
    .max(200),

  description: z
    .string()
    .trim()
    .max(2000),

  distance: z.string().trim().max(200).optional(),
  altitude: z.string().trim().max(100).optional(),
  overnight: z.string().trim().max(200).optional(),

  activities: z
    .array(activitySchema)
    .default([]),

  meals: z
    .object({
      breakfast: z.string().trim().max(500),
      lunch: z.string().trim().max(500),
      dinner: z.string().trim().max(500),
    }),

  accommodation: accommodationSchema,

  notes: z
    .array(
      z.string().trim().max(500)
    )
    .default([]),
});

const phaseSchema = z.object({
  id: z.string().optional(),

  dayRangeLabel: z.string().trim().max(100).optional(),

  title: z
    .string()
    .trim()
    .min(1, "Phase title is required")
    .max(200),

  description: z
    .string()
    .trim()
    .max(2000),

  days: z
    .array(
      z.number().int().min(1)
    )
    .default([]),
});

const pricingItemSchema = z.object({
  id: z.string().optional(),

  name: z
    .string()
    .trim()
    .min(1, "Pricing item name is required")
    .max(200),

  category: z
    .string()
    .trim()
    .max(100),

  quantity: z
    .number()
    .finite()
    .min(0),

  unitPrice: z
    .number()
    .finite()
    .min(0),
});

const pricingAdjustmentSchema = z.object({
  id: z.string().optional(),

  name: z
    .string()
    .trim()
    .min(1, "Adjustment name is required")
    .max(200),

  type: z.enum([
    "percentage",
    "fixed",
  ]),

  value: z
    .number()
    .finite()
    .min(0),

  operation: z.enum([
    "add",
    "subtract",
  ]),
});

const pricingSchema = z.object({
  currency: z
    .string()
    .trim()
    .length(3)
    .transform((value) =>
      value.toUpperCase()
    ),

  items: z
    .array(pricingItemSchema)
    .default([]),

  adjustments: z
    .array(pricingAdjustmentSchema)
    .default([]),

  paymentSchedule: z
    .array(
      z.object({
        label: z.string().trim().max(200),
        note: z.string().trim().max(500),
        amount: z.number().finite().min(0),
      })
    )
    .default([]),

  disclaimer: z.string().trim().max(2000).optional(),
});

export const itinerarySchema = z.object({
  id: z.string().optional(),

  slug: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .optional(),

  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title is too long"),

  tripName: z.string().trim().max(200).optional(),
  tagline: z.string().trim().max(500).optional(),

  destination: z
    .string()
    .trim()
    .min(1, "Destination is required")
    .max(200, "Destination is too long"),

  overview: z
    .string()
    .trim()
    .max(5000, "Overview is too long"),

  duration: z
    .number()
    .int()
    .min(1, "Duration must be at least 1 day")
    .max(365, "Duration cannot exceed 365 days"),

  travelers: z
    .number()
    .int()
    .min(1, "At least 1 traveler is required")
    .max(1000, "Too many travelers"),

  travelStyle: z
    .string()
    .trim()
    .min(1)
    .max(100),

  heroImage: z
    .string()
    .trim()
    .url("Hero image must be a valid URL")
    .optional()
    .or(z.literal("")),

  maxAltitude: z.string().trim().max(100).optional(),
  tempRange: z.string().trim().max(100).optional(),
  startPoint: z.string().trim().max(200).optional(),
  endPoint: z.string().trim().max(200).optional(),
  totalDistanceKm: z.number().finite().min(0).optional(),

  highlights: z
    .array(
      z.string().trim().max(500)
    )
    .default([]),

  highlightCards: z.array(textBlockSchema).default([]),
  stayPreference: textBlockSchema.optional(),
  foodPreference: textBlockSchema.optional(),
  travelCadence: z.array(z.string().trim().max(500)).default([]),
  quote: quoteSchema.optional(),

  inclusions: z
    .array(
      z.string().trim().max(500)
    )
    .default([]),

  exclusions: z
    .array(
      z.string().trim().max(500)
    )
    .default([]),

  advantages: z
    .array(
      z.string().trim().max(500)
    )
    .default([]),

  philosophy: z
    .string()
    .trim()
    .max(3000),

  philosophyIntro: z.string().trim().max(5000).optional(),
  pillars: z.array(textBlockSchema).default([]),

  safety: z
    .string()
    .trim()
    .max(3000),

  accommodations: z
    .array(
      z.string().trim().max(500)
    )
    .default([]),

  advantageCards: z.array(advantageSchema).default([]),
  accommodationComfort: comfortSectionSchema.optional(),
  safetyTeam: comfortSectionSchema.optional(),

  phases: z
    .array(phaseSchema)
    .default([]),

  days: z
    .array(daySchema)
    .default([]),

  pricing: pricingSchema,

  createdAt: z
    .string()
    .optional(),

  updatedAt: z
    .string()
    .optional(),
});

export type ItineraryInput = z.input<
  typeof itinerarySchema
>;

export type ItineraryValidated = z.output<
  typeof itinerarySchema
>;

export function validateItinerary(
  data: unknown
): ItineraryValidated {
  return itinerarySchema.parse(data);
}

export function safeValidateItinerary(
  data: unknown
) {
  return itinerarySchema.safeParse(data);
}