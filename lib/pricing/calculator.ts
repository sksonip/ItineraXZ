import type {
  PricingAdjustment,
  PricingItem,
} from "@/lib/ai/types";

import {
  applyAdjustments,
} from "@/lib/pricing/adjustments";

export type PricingCalculation = {
  subtotal: number;
  adjustmentsTotal: number;
  total: number;
  perPerson: number;
  breakdown: PricingBreakdownItem[];
  adjustmentBreakdown: ReturnType<
    typeof applyAdjustments
  >["breakdown"];
};

export type PricingBreakdownItem =
  PricingItem & {
    total: number;
  };

function roundMoney(
  value: number
): number {
  return Math.round(
    (value + Number.EPSILON) * 100
  ) / 100;
}

function toNumber(
  value: unknown
): number {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

export function calculateItemTotal(
  item: PricingItem
): number {
  const quantity =
    Math.max(
      0,
      toNumber(item.quantity)
    );

  const unitPrice =
    Math.max(
      0,
      toNumber(item.unitPrice)
    );

  return roundMoney(
    quantity * unitPrice
  );
}

export function calculateSubtotal(
  items: PricingItem[]
): number {
  return roundMoney(
    items.reduce(
      (total, item) =>
        total +
        calculateItemTotal(item),
      0
    )
  );
}

export function calculatePricing(
  items: PricingItem[],
  adjustments: PricingAdjustment[] = [],
  travelers = 1
): PricingCalculation {
  const breakdown =
    items.map((item) => ({
      ...item,
      quantity: toNumber(
        item.quantity
      ),
      unitPrice: toNumber(
        item.unitPrice
      ),
      total:
        calculateItemTotal(item),
    }));

  const subtotal =
    calculateSubtotal(items);

  const adjusted =
    applyAdjustments(
      subtotal,
      adjustments
    );

  const travelerCount =
    Math.max(
      1,
      Math.floor(
        toNumber(travelers)
      )
    );

  return {
    subtotal,

    adjustmentsTotal:
      adjusted.adjustmentsTotal,

    total: roundMoney(
      adjusted.total
    ),

    perPerson: roundMoney(
      adjusted.total /
        travelerCount
    ),

    breakdown,

    adjustmentBreakdown:
      adjusted.breakdown,
  };
}

export function calculatePerPerson(
  total: number,
  travelers: number
): number {
  const amount =
    Math.max(
      0,
      toNumber(total)
    );

  const count =
    Math.max(
      1,
      Math.floor(
        toNumber(travelers)
      )
    );

  return roundMoney(
    amount / count
  );
}

export function calculatePercentage(
  amount: number,
  percentage: number
): number {
  return roundMoney(
    Math.max(
      0,
      toNumber(amount)
    ) *
      (Math.max(
        0,
        toNumber(percentage)
      ) /
        100)
  );
}

export function calculatePricingItem(
  name: string,
  quantity: number,
  unitPrice: number,
  category = ""
): PricingBreakdownItem {
  const item: PricingItem = {
    id: `pricing-item-${Math.random()
      .toString(36)
      .slice(2, 10)}`,

    name,

    category,

    quantity: Math.max(
      0,
      toNumber(quantity)
    ),

    unitPrice: Math.max(
      0,
      toNumber(unitPrice)
    ),
  };

  return {
    ...item,
    total:
      calculateItemTotal(item),
  };
}