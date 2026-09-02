export type Brand = {
  id?: string;
  name: string;
  tagline?: string;
  description?: string;
  logo?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  currency: string;
  locale: string;
  createdAt?: string;
  updatedAt?: string;
};

export type BrandInput = Omit<
  Brand,
  "id" | "createdAt" | "updatedAt"
>;

export type BrandConfig = {
  name: string;
  tagline?: string;
  logo?: string;
  website?: string;
  email?: string;
  phone?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  currency: string;
  locale: string;
};

export const defaultBrand: BrandConfig = {
  name: "",
  tagline: "",
  logo: "",
  website: "",
  email: "",
  phone: "",
  primaryColor: "#111827",
  secondaryColor: "#6B7280",
  accentColor: "#2563EB",
  currency: "INR",
  locale: "en-IN",
};