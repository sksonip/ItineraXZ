import type {
  ItineraryDay,
} from "@/lib/types/day";

export type ItineraryActivity = {
  id: string;
  time: string;
  title: string;
  description: string;
  duration?: string;
};

export type ItineraryPhase = {
  id: string;
  title: string;
  description: string;
  days: number[];
};

export type PricingItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
};

export type PricingAdjustment = {
  id: string;
  name: string;
  type: "percentage" | "fixed";
  value: number;
  operation: "add" | "subtract";
};

export type ItineraryPricing = {
  currency: string;
  items: PricingItem[];
  adjustments: PricingAdjustment[];
};

export type Itinerary = {
  id?: string;
  slug?: string;
  title: string;
  destination: string;
  overview: string;
  duration: number;
  travelers: number;
  travelStyle: string;
  heroImage?: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  advantages: string[];
  philosophy: string;
  safety: string;
  accommodations: string[];
  phases: ItineraryPhase[];
  days: ItineraryDay[];
  pricing: ItineraryPricing;
  createdAt?: string;
  updatedAt?: string;
};

export type ItineraryInput = Omit<
  Itinerary,
  "id" | "createdAt" | "updatedAt"
>;

export type ItineraryUpdate =
  Partial<ItineraryInput>;

export type ItinerarySection =
  | "overview"
  | "highlights"
  | "inclusions"
  | "exclusions"
  | "advantages"
  | "accommodations"
  | "philosophy"
  | "safety"
  | "days"
  | "phases"
  | "pricing";

export type ItineraryStatus =
  | "draft"
  | "published"
  | "archived";

export type ItineraryMeta = {
  id?: string;
  slug?: string;
  title: string;
  destination: string;
  duration: number;
  travelers: number;
  status?: ItineraryStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type ItineraryWithMeta =
  Itinerary & {
    meta?: ItineraryMeta;
  };

export type ItineraryListItem = {
  id: string;
  slug: string;
  title: string;
  destination: string;
  duration: number;
  updatedAt: string;
};

export type ItineraryEditorState = {
  itinerary: Itinerary;
  isDirty: boolean;
  isSaving: boolean;
  lastSavedAt: Date | null;
};

export type ItineraryDayMap = Record<
  string,
  ItineraryDay
>;

export type ItineraryPhaseMap = Record<
  string,
  ItineraryPhase
>;

export type ItineraryPricingSummary = {
  subtotal: number;
  adjustmentsTotal: number;
  total: number;
  perPerson: number;
};