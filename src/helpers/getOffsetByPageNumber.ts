export function getOffsetByPageNumber(page: number, limit = 100) {
  if (page < 0 || Number.isNaN(page)) {
    throw new Error("Invalid page number!");
  }

  return page === 1 ? 0 : (page - 1) * limit;
}
