import { z } from "zod";

export const pricingItemSchema = z.object({
  id: z.string().optional(),

  name: z
    .string()
    .trim()
    .min(1, "Pricing item name is required")
    .max(200),

  category: z
    .string()
    .trim()
    .max(100)
    .optional()
    .or(z.literal("")),

  quantity: z
    .number()
    .finite()
    .min(0, "Quantity cannot be negative"),

  unitPrice: z
    .number()
    .finite()
    .min(0, "Unit price cannot be negative"),
});

export const pricingAdjustmentSchema =
  z.object({
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
      .min(0, "Adjustment cannot be negative")
      .max(
        100,
        "Percentage adjustment cannot exceed 100"
      )
      .optional()
      .or(z.number().finite().min(0)),

    operation: z.enum([
      "add",
      "subtract",
    ]),
  });

export const pricingSchema = z.object({
  currency: z
    .string()
    .trim()
    .length(
      3,
      "Currency must be a 3-letter code"
    )
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

export type PricingItemInput =
  z.input<typeof pricingItemSchema>;

export type PricingAdjustmentInput =
  z.input<
    typeof pricingAdjustmentSchema
  >;

export type PricingInput =
  z.input<typeof pricingSchema>;

export type PricingValidated =
  z.output<typeof pricingSchema>;

export function validatePricing(
  data: unknown
): PricingValidated {
  return pricingSchema.parse(data);
}

export function safeValidatePricing(
  data: unknown
) {
  return pricingSchema.safeParse(data);
}