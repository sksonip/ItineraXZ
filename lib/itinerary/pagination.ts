export type PaginationInput = {
  page?: number;
  pageSize?: number;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PaginatedResult<T> = {
  data: T[];
  pagination: PaginationMeta;
};

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

export function normalizePagination(
  input: PaginationInput = {}
): Required<PaginationInput> {
  const page = Number(input.page);
  const pageSize = Number(input.pageSize);

  return {
    page:
      Number.isFinite(page) && page >= 1
        ? Math.floor(page)
        : DEFAULT_PAGE,

    pageSize:
      Number.isFinite(pageSize) && pageSize >= 1
        ? Math.min(
            Math.floor(pageSize),
            MAX_PAGE_SIZE
          )
        : DEFAULT_PAGE_SIZE,
  };
}

export function getPaginationOffset(
  input: PaginationInput = {}
): {
  skip: number;
  take: number;
} {
  const { page, pageSize } =
    normalizePagination(input);

  return {
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}

export function createPaginationMeta(
  input: PaginationInput,
  total: number
): PaginationMeta {
  const { page, pageSize } =
    normalizePagination(input);

  const safeTotal = Math.max(
    0,
    Number(total) || 0
  );

  const totalPages = Math.max(
    1,
    Math.ceil(
      safeTotal / pageSize
    )
  );

  return {
    page,
    pageSize,
    total: safeTotal,
    totalPages,
    hasNextPage:
      page < totalPages,
    hasPreviousPage:
      page > 1,
  };
}

export function paginate<T>(
  data: T[],
  input: PaginationInput,
  total: number
): PaginatedResult<T> {
  return {
    data,
    pagination:
      createPaginationMeta(
        input,
        total
      ),
  };
}

export function getPageNumbers(
  input: PaginationInput,
  total: number
): number[] {
  const { page, pageSize } =
    normalizePagination(input);

  const totalPages = Math.max(
    1,
    Math.ceil(
      Math.max(0, total) /
        pageSize
    )
  );

  if (totalPages <= 7) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );
  }

  if (page <= 4) {
    return [
      1,
      2,
      3,
      4,
      5,
      6,
      totalPages,
    ];
  }

  if (page >= totalPages - 3) {
    return [
      1,
      totalPages - 5,
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    page - 2,
    page - 1,
    page,
    page + 1,
    page + 2,
    totalPages,
  ];
}

export default {
  normalizePagination,
  getPaginationOffset,
  createPaginationMeta,
  paginate,
  getPageNumbers,
};