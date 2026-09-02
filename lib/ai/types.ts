/* ========================================== */
/* SHARED AI TYPES                            */
/* ========================================== */

export type AIResponse<T> = {
  data: T;
};

export type AIErrorResponse = {
  error: string;
};

/* ========================================== */
/* ITINERARY CONTEXT                          */
/* ========================================== */

export type ItineraryPromptContext = {
  destination?: string;
  title?: string;
  duration?: number;
  travelers?: number;
  travelStyle?: string;
  overview?: string;
  itinerary?: unknown;
};

/* ========================================== */
/* DAY                                        */
/* ========================================== */

export type DayActivity = {
  time?: string;
  title: string;
  description: string;
  duration?: string;
};

export type DayMeal = {
  type: string;
  description: string;
};

export type DayAccommodation = {
  name: string;
  description: string;
};

export type DaySuggestion = {
  title: string;
  overview: string;

  activities: DayActivity[];

  meals: DayMeal[];

  accommodation?: DayAccommodation;

  tips: string[];
};

export type DaySuggestionInput =
  ItineraryPromptContext & {
    dayNumber?: number;
    date?: string;
    location?: string;

    activities?: string[];
    meals?: string[];
    accommodations?: string[];

    previousDays?: unknown[];

    additionalInstructions?: string;
  };

/* ========================================== */
/* DESCRIPTION                                */
/* ========================================== */

export type DescriptionInput =
  ItineraryPromptContext & {
    highlights?: string[];
    activities?: string[];

    existingDescription?: string;

    additionalInstructions?: string;
  };

export type DescriptionResult = {
  description: string;
};

/* ========================================== */
/* HIGHLIGHTS                                 */
/* ========================================== */

export type HighlightsInput =
  ItineraryPromptContext & {
    activities?: string[];
    accommodations?: string[];
    meals?: string[];

    existingHighlights?: string[];

    additionalInstructions?: string;
  };

export type HighlightsResult = {
  highlights: string[];
};

/* ========================================== */
/* IMPROVEMENT                                */
/* ========================================== */

export type ImproveSection =
  | "overview"
  | "day"
  | "activity"
  | "highlights"
  | "inclusions"
  | "exclusions"
  | "general";

export type ImproveInput =
  ItineraryPromptContext & {
    content?: string;

    section?: ImproveSection;

    additionalInstructions?: string;
  };

export type ImprovedContent = {
  title?: string;
  overview?: string;
  content?: string;

  improvements: string[];

  suggestions: string[];
};

/* ========================================== */
/* GENERAL SUGGESTIONS                        */
/* ========================================== */

export type SuggestionType =
  | "activity"
  | "restaurant"
  | "accommodation"
  | "day"
  | "route"
  | "general";

export type SuggestInput =
  ItineraryPromptContext & {
    currentDay?: unknown;

    type?: SuggestionType;

    query?: string;

    existingSuggestions?: string[];

    additionalInstructions?: string;
  };

export type Suggestion = {
  title: string;
  description: string;
  reason?: string;
  category?: string;
};

export type SuggestResult = {
  suggestions: Suggestion[];
};

/* ========================================== */
/* PRICING                                    */
/* ========================================== */

export type PricingItem = {
  name: string;

  category?: string;

  quantity: number;

  unitPrice: number;

  taxable?: boolean;
};

export type PricingAdjustment = {
  name: string;

  type:
    | "percentage"
    | "fixed";

  value: number;

  operation?:
    | "add"
    | "subtract";
};

export type PricingInput =
  ItineraryPromptContext & {
    currency?: string;

    items: PricingItem[];

    adjustments?: PricingAdjustment[];

    additionalInstructions?: string;
  };

export type PricingBreakdownItem =
  PricingItem & {
    total: number;
  };

export type AdjustmentBreakdown = {
  name: string;

  amount: number;

  operation:
    | "add"
    | "subtract";
};

export type PricingResult = {
  subtotal: number;

  adjustmentsTotal: number;

  total: number;

  perPerson: number;

  currency: string;

  breakdown: PricingBreakdownItem[];

  adjustmentBreakdown:
    AdjustmentBreakdown[];

  aiSummary?: string;

  recommendations?: string[];
};

/* ========================================== */
/* AI SUGGESTION TYPES                        */
/* ========================================== */

export type AISuggestionType =
  | "day"
  | "description"
  | "highlights"
  | "improve"
  | "suggest";

export type AISuggestionRequest = {
  type: AISuggestionType;

  payload?: Record<
    string,
    unknown
  >;
};

/* ========================================== */
/* AI STATUS                                  */
/* ========================================== */

export type AIStatus =
  | "idle"
  | "loading"
  | "success"
  | "error";