export type DiscountType =
  | "percentage"
  | "fixed";

export type Discount = {
  id: string;
  name: string;
  type: DiscountType;
  value: number;
};

function toNumber(
  value: unknown
): number {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function roundMoney(
  value: number
): number {
  return Math.round(
    (value + Number.EPSILON) * 100
  ) / 100;
}

export function calculateDiscount(
  amount: number,
  discount: Discount
): number {
  const baseAmount = Math.max(
    0,
    toNumber(amount)
  );

  const value = Math.max(
    0,
    toNumber(discount.value)
  );

  if (
    discount.type ===
    "percentage"
  ) {
    return roundMoney(
      baseAmount *
        Math.min(value, 100) /
        100
    );
  }

  return roundMoney(
    Math.min(
      value,
      baseAmount
    )
  );
}

export function applyDiscount(
  amount: number,
  discount: Discount
): number {
  const baseAmount = Math.max(
    0,
    toNumber(amount)
  );

  const discountAmount =
    calculateDiscount(
      baseAmount,
      discount
    );

  return roundMoney(
    Math.max(
      0,
      baseAmount -
        discountAmount
    )
  );
}

export function applyDiscounts(
  amount: number,
  discounts: Discount[]
) {
  let total = Math.max(
    0,
    toNumber(amount)
  );

  const breakdown = discounts.map(
    (discount) => {
      const before = total;

      const discountAmount =
        calculateDiscount(
          before,
          discount
        );

      total = roundMoney(
        Math.max(
          0,
          before -
            discountAmount
        )
      );

      return {
        id: discount.id,
        name: discount.name,
        type: discount.type,
        value: discount.value,
        amount: discountAmount,
        total,
      };
    }
  );

  return {
    originalAmount:
      roundMoney(amount),

    discountTotal: roundMoney(
      Math.max(
        0,
        amount - total
      )
    ),

    total,

    breakdown,
  };
}

export function createDiscount(
  input: Partial<Discount> = {}
): Discount {
  return {
    id:
      input.id ||
      `discount-${Math.random()
        .toString(36)
        .slice(2, 10)}`,

    name:
      input.name ||
      "Discount",

    type:
      input.type ||
      "percentage",

    value: Math.max(
      0,
      toNumber(input.value)
    ),
  };
}

export function normalizeDiscount(
  value: unknown
): Discount | null {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return null;
  }

  const item =
    value as Record<
      string,
      unknown
    >;

  const type =
    item.type === "fixed"
      ? "fixed"
      : item.type ===
          "percentage"
        ? "percentage"
        : null;

  if (!type) {
    return null;
  }

  return {
    id:
      typeof item.id === "string"
        ? item.id
        : `discount-${Math.random()
            .toString(36)
            .slice(2, 10)}`,

    name:
      typeof item.name ===
      "string"
        ? item.name
        : "Discount",

    type,

    value: Math.max(
      0,
      toNumber(item.value)
    ),
  };
}