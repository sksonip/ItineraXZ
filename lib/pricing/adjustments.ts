export type AdjustmentType =
  | "percentage"
  | "fixed";

export type AdjustmentOperation =
  | "add"
  | "subtract";

export type PricingAdjustment = {
  id: string;
  name: string;
  type: AdjustmentType;
  value: number;
  operation: AdjustmentOperation;
};

export type AdjustmentResult = {
  name: string;
  amount: number;
  operation: AdjustmentOperation;
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

export function calculateAdjustment(
  baseAmount: number,
  adjustment: PricingAdjustment
): number {
  const base =
    Math.max(
      0,
      toNumber(baseAmount)
    );

  const value =
    Math.abs(
      toNumber(adjustment.value)
    );

  if (
    adjustment.type ===
    "percentage"
  ) {
    return roundMoney(
      base * (value / 100)
    );
  }

  return roundMoney(value);
}

export function applyAdjustment(
  baseAmount: number,
  adjustment: PricingAdjustment
): number {
  const amount =
    calculateAdjustment(
      baseAmount,
      adjustment
    );

  const result =
    adjustment.operation ===
    "subtract"
      ? baseAmount - amount
      : baseAmount + amount;

  return roundMoney(
    Math.max(0, result)
  );
}

export function applyAdjustments(
  baseAmount: number,
  adjustments: PricingAdjustment[]
): {
  total: number;
  adjustmentsTotal: number;
  breakdown: AdjustmentResult[];
} {
  let current =
    Math.max(
      0,
      toNumber(baseAmount)
    );

  const breakdown: AdjustmentResult[] =
    [];

  for (const adjustment of adjustments) {
    const amount =
      calculateAdjustment(
        current,
        adjustment
      );

    if (
      adjustment.operation ===
      "subtract"
    ) {
      current =
        Math.max(
          0,
          roundMoney(
            current - amount
          )
        );
    } else {
      current =
        roundMoney(
          current + amount
        );
    }

    breakdown.push({
      name: adjustment.name,
      amount,
      operation:
        adjustment.operation,
    });
  }

  return {
    total: current,

    adjustmentsTotal:
      roundMoney(
        current - baseAmount
      ),

    breakdown,
  };
}

export function createAdjustment(
  input: Partial<PricingAdjustment> = {}
): PricingAdjustment {
  return {
    id:
      input.id ||
      `adjustment-${Math.random()
        .toString(36)
        .slice(2, 10)}`,

    name:
      input.name ||
      "Adjustment",

    type:
      input.type ||
      "percentage",

    value:
      toNumber(
        input.value
      ),

    operation:
      input.operation ||
      "add",
  };
}

export function normalizeAdjustments(
  value: unknown
): PricingAdjustment[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(
    (item: any, index) =>
      ({
        id:
          typeof item?.id ===
          "string"
            ? item.id
            : `adjustment-${index + 1}`,

        name:
          typeof item?.name ===
          "string"
            ? item.name
            : "Adjustment",

        type:
          item?.type ===
          "percentage"
            ? "percentage"
            : "fixed",

        value: toNumber(
          item?.value
        ),

        operation:
          item?.operation ===
          "subtract"
            ? "subtract"
            : "add",
      })
  );
}