export const clampPage = (page: number, totalPages: number): number => {
  return Math.min(Math.max(page, 1), Math.max(totalPages, 1));
};

export const buildVisiblePages = (currentPage: number, totalPages: number, max_visible_pages: number = 5): number[] => {
  if (totalPages <= max_visible_pages) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const siblingCount = 1;
  const startPage = Math.max(1, currentPage - siblingCount);
  const endPage = Math.min(totalPages, currentPage + siblingCount);

  if (startPage <= 2) {
    return [1, 2, 3, 4, totalPages];
  }

  if (endPage >= totalPages - 1) {
    return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, currentPage - 1, currentPage, currentPage + 1, totalPages];
};