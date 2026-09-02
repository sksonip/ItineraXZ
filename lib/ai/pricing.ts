import { generateJson } from "@/lib/ai/gemini";

/* ========================================== */
/* TYPES                                      */
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

  type: "percentage" | "fixed";

  value: number;

  operation?: "add" | "subtract";
};

export type PricingInput = {
  currency?: string;

  items: PricingItem[];

  adjustments?: PricingAdjustment[];

  travelers?: number;

  destination?: string;

  duration?: number;

  travelStyle?: string;

  additionalInstructions?: string;
};

export type PricingBreakdownItem =
  PricingItem & {
    total: number;
  };

export type PricingResult = {
  subtotal: number;

  adjustmentsTotal: number;

  total: number;

  perPerson: number;

  currency: string;

  breakdown: PricingBreakdownItem[];

  adjustmentBreakdown: {
    name: string;
    amount: number;
    operation: "add" | "subtract";
  }[];

  aiSummary?: string;

  recommendations?: string[];
};

/* ========================================== */
/* HELPERS                                    */
/* ========================================== */

function roundMoney(
  value: number
): number {
  return Math.round(
    (value + Number.EPSILON) * 100
  ) / 100;
}

function sanitizeNumber(
  value: unknown
): number {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return number;
}

/* ========================================== */
/* CALCULATE ITEM TOTALS                      */
/* ========================================== */

function calculateItems(
  items: PricingItem[]
): PricingBreakdownItem[] {
  return items.map((item) => {
    const quantity =
      Math.max(
        0,
        sanitizeNumber(item.quantity)
      );

    const unitPrice =
      Math.max(
        0,
        sanitizeNumber(item.unitPrice)
      );

    return {
      ...item,
      quantity,
      unitPrice,
      total: roundMoney(
        quantity * unitPrice
      ),
    };
  });
}

/* ========================================== */
/* CALCULATE ADJUSTMENTS                      */
/* ========================================== */

function calculateAdjustments(
  subtotal: number,
  adjustments: PricingAdjustment[]
) {
  let runningTotal = subtotal;

  const adjustmentBreakdown =
    adjustments.map((adjustment) => {
      const value =
        sanitizeNumber(
          adjustment.value
        );

      let amount = 0;

      if (
        adjustment.type ===
        "percentage"
      ) {
        amount =
          runningTotal *
          (Math.abs(value) / 100);
      } else {
        amount = Math.abs(value);
      }

      amount = roundMoney(amount);

      const operation =
        adjustment.operation ||
        "add";

      if (operation === "subtract") {
        runningTotal -= amount;
      } else {
        runningTotal += amount;
      }

      runningTotal =
        Math.max(
          0,
          roundMoney(runningTotal)
        );

      return {
        name: adjustment.name,
        amount,
        operation,
      };
    });

  return {
    adjustmentBreakdown,
    total: roundMoney(
      runningTotal - subtotal
    ),
    finalTotal: runningTotal,
  };
}

/* ========================================== */
/* AI SUMMARY PROMPT                          */
/* ========================================== */

function buildPricingPrompt(
  input: PricingInput,
  result: {
    subtotal: number;
    adjustmentsTotal: number;
    total: number;
    perPerson: number;
    currency: string;
  }
): string {
  return `
You are a professional travel pricing
consultant.

Review the calculated itinerary pricing
below and provide a concise professional
summary.

DESTINATION:
${input.destination || "Not specified"}

DURATION:
${
  input.duration
    ? `${input.duration} days`
    : "Not specified"
}

TRAVELERS:
${input.travelers || "Not specified"}

TRAVEL STYLE:
${input.travelStyle || "Not specified"}

CURRENCY:
${result.currency}

SUBTOTAL:
${result.subtotal}

ADJUSTMENTS:
${result.adjustmentsTotal}

TOTAL:
${result.total}

PER PERSON:
${result.perPerson}

ITEMS:
${JSON.stringify(
  input.items,
  null,
  2
)}

ADDITIONAL INSTRUCTIONS:
${
  input.additionalInstructions ||
  "None"
}

REQUIREMENTS:

1. Do not recalculate or modify any
   numerical values.

2. The supplied totals are authoritative.

3. Explain the pricing briefly and clearly.

4. Mention notable cost drivers when obvious.

5. Give practical pricing recommendations
   only when justified by the supplied data.

6. Do not invent market prices.

7. Do not invent taxes, fees, discounts,
   or currency conversions.

8. Do not use markdown.

9. Do not use emojis.

Return ONLY valid JSON.

Use exactly this structure:

{
  "aiSummary": "string",
  "recommendations": [
    "string"
  ]
}
`;
}

/* ========================================== */
/* GENERATE AI SUMMARY                       */
/* ========================================== */

async function generatePricingSummary(
  input: PricingInput,
  result: {
    subtotal: number;
    adjustmentsTotal: number;
    total: number;
    perPerson: number;
    currency: string;
  }
): Promise<{
  aiSummary?: string;
  recommendations?: string[];
}> {
  try {
    const prompt =
      buildPricingPrompt(
        input,
        result
      );

    const ai =
      await generateJson<{
        aiSummary?: unknown;
        recommendations?: unknown;
      }>(prompt);

    return {
      aiSummary:
        typeof ai.aiSummary ===
        "string"
          ? ai.aiSummary.trim()
          : undefined,

      recommendations:
        Array.isArray(
          ai.recommendations
        )
          ? ai.recommendations
              .filter(
                (
                  item
                ): item is string =>
                  typeof item ===
                  "string"
              )
              .map((item) =>
                item.trim()
              )
              .filter(Boolean)
          : [],
    };
  } catch (error) {
    /*
     * Pricing must still work even if the
     * AI summary fails.
     */

    console.error(
      "Pricing AI summary failed:",
      error
    );

    return {};
  }
}

/* ========================================== */
/* CALCULATE PRICING                          */
/* ========================================== */

export async function calculatePricing(
  input: PricingInput
): Promise<PricingResult> {
  const currency =
    input.currency || "INR";

  const items =
    Array.isArray(input.items)
      ? input.items
      : [];

  const adjustments =
    Array.isArray(
      input.adjustments
    )
      ? input.adjustments
      : [];

  const breakdown =
    calculateItems(items);

  const subtotal =
    roundMoney(
      breakdown.reduce(
        (sum, item) =>
          sum + item.total,
        0
      )
    );

  const adjustmentResult =
    calculateAdjustments(
      subtotal,
      adjustments
    );

  const total =
    roundMoney(
      adjustmentResult.finalTotal
    );

  const travelers =
    Math.max(
      1,
      Math.floor(
        sanitizeNumber(
          input.travelers
        ) || 1
      )
    );

  const perPerson =
    roundMoney(
      total / travelers
    );

  const baseResult = {
    subtotal,
    adjustmentsTotal:
      adjustmentResult.total,
    total,
    perPerson,
    currency,
  };

  const ai =
    await generatePricingSummary(
      input,
      baseResult
    );

  return {
    ...baseResult,

    breakdown,

    adjustmentBreakdown:
      adjustmentResult.adjustmentBreakdown,

    aiSummary:
      ai.aiSummary,

    recommendations:
      ai.recommendations,
  };
}

export default calculatePricing;