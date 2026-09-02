import { z } from "zod";

export const brandSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Brand name is required")
    .max(100, "Brand name is too long"),

  tagline: z
    .string()
    .trim()
    .max(200, "Tagline is too long")
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .trim()
    .max(1000, "Description is too long")
    .optional()
    .or(z.literal("")),

  logo: z
    .string()
    .trim()
    .url("Logo must be a valid URL")
    .optional()
    .or(z.literal("")),

  website: z
    .string()
    .trim()
    .url("Website must be a valid URL")
    .optional()
    .or(z.literal("")),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .trim()
    .max(30, "Phone number is too long")
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .trim()
    .max(300, "Address is too long")
    .optional()
    .or(z.literal("")),

  primaryColor: z
    .string()
    .regex(
      /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/,
      "Invalid primary color"
    )
    .optional()
    .or(z.literal("")),

  secondaryColor: z
    .string()
    .regex(
      /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/,
      "Invalid secondary color"
    )
    .optional()
    .or(z.literal("")),

  accentColor: z
    .string()
    .regex(
      /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/,
      "Invalid accent color"
    )
    .optional()
    .or(z.literal("")),

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

  locale: z
    .string()
    .trim()
    .min(2)
    .max(20)
    .default("en-IN"),
});

export type BrandInput = z.input<
  typeof brandSchema
>;

export type Brand = z.output<
  typeof brandSchema
>;

export function validateBrand(
  data: unknown
): Brand {
  return brandSchema.parse(data);
}

export function safeValidateBrand(
  data: unknown
) {
  return brandSchema.safeParse(data);
}