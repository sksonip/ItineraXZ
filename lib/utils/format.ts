export function formatCurrency(
  amount: number,
  currency = "INR",
  locale = "en-IN"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(
  value: number,
  locale = "en-IN"
): string {
  return new Intl.NumberFormat(
    locale
  ).format(value);
}

export function formatDate(
  date: Date | string | number,
  locale = "en-IN"
): string {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(
    locale,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(value);
}

export function formatDateTime(
  date: Date | string | number,
  locale = "en-IN"
): string {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(
    locale,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(value);
}

export function formatDuration(
  days: number
): string {
  const value = Math.max(
    0,
    Math.floor(days)
  );

  if (value === 1) {
    return "1 day";
  }

  return `${value} days`;
}

export function formatTravelers(
  count: number
): string {
  const value = Math.max(
    0,
    Math.floor(count)
  );

  if (value === 1) {
    return "1 traveler";
  }

  return `${value} travelers`;
}

export function formatPercentage(
  value: number,
  maximumFractionDigits = 0
): string {
  return `${new Intl.NumberFormat(
    "en-IN",
    {
      maximumFractionDigits,
    }
  ).format(value)}%`;
}

export function formatSlug(
  value: string
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatFileSize(
  bytes: number
): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const units = [
    "B",
    "KB",
    "MB",
    "GB",
    "TB",
  ];

  const index = Math.min(
    Math.floor(
      Math.log(bytes) /
        Math.log(1024)
    ),
    units.length - 1
  );

  const size =
    bytes /
    Math.pow(1024, index);

  return `${size.toFixed(
    index === 0 ? 0 : 1
  )} ${units[index]}`;
}

export function truncate(
  value: string,
  length: number
): string {
  if (value.length <= length) {
    return value;
  }

  return `${value.slice(
    0,
    Math.max(0, length - 3)
  )}...`;
}