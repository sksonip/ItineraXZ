export function slugify(
  value: string
): string {
  return value
    .normalize("NFKD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9\s-]/g,
      ""
    )
    .replace(
      /[\s_-]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      "");
}

export function isValidSlug(
  value: string
): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
    value
  );
}

export function ensureSlug(
  value: string,
  fallback = "itinerary"
): string {
  const slug =
    slugify(value);

  return slug || fallback;
}

export function uniqueSlug(
  value: string,
  existingSlugs: string[]
): string {
  const base =
    ensureSlug(value);

  const existing = new Set(
    existingSlugs.map((slug) =>
      slug.toLowerCase()
    )
  );

  if (!existing.has(base)) {
    return base;
  }

  let index = 2;

  while (
    existing.has(
      `${base}-${index}`
    )
  ) {
    index++;
  }

  return `${base}-${index}`;
}

export default slugify;