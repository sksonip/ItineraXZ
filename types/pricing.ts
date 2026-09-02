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

export type Pricing = {
  currency: string;
  items: PricingItem[];
  adjustments: PricingAdjustment[];
};

export type PricingItemInput = Omit<
  PricingItem,
  "id"
>;

export type PricingItemUpdate =
  Partial<PricingItemInput>;

export type PricingAdjustmentInput =
  Omit<PricingAdjustment, "id">;

export type PricingAdjustmentUpdate =
  Partial<PricingAdjustmentInput>;

export type PricingSummary = {
  subtotal: number;
  adjustmentsTotal: number;
  total: number;
  perPerson: number;
};

export type PricingBreakdownItem =
  PricingItem & {
    total: number;
  };

export type PricingCalculation =
  PricingSummary & {
    breakdown: PricingBreakdownItem[];
    adjustmentBreakdown: Array<{
      name: string;
      amount: number;
      operation: "add" | "subtract";
    }>;
  };

export type PricingEditorState = {
  pricing: Pricing;
  isDirty: boolean;
  isSaving: boolean;
  lastSavedAt: Date | null;
};

export const defaultPricing: Pricing = {
  currency: "INR",
  items: [],
  adjustments: [],
};