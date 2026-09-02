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

const daySchema = z.object({
  id: z.string().optional(),

  day: z
    .number()
    .int()
    .min(1),

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

  highlights: z
    .array(
      z.string().trim().max(500)
    )
    .default([]),

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

  safety: z
    .string()
    .trim()
    .max(3000),

  accommodations: z
    .array(
      z.string().trim().max(500)
    )
    .default([]),

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