/**
 * Pagination middleware — parses page/limit query params.
 */
export function paginate(req, _res, next) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const skip = (page - 1) * limit;
  req.pagination = { page, limit, skip };
  next();
}

/**
 * Build a paginated response object.
 */
export function buildPaginatedResponse(items, total, { page, limit }) {
  return {
    items,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1
  };
}

/**
 * Validate and sanitize sort options.
 */
export function parseSort(sortParam, allowedFields = []) {
  if (!sortParam) return {};
  const [field, dir] = sortParam.split(':');
  if (!allowedFields.includes(field)) return {};
  return { [field]: dir === 'asc' ? 1 : -1 };
}
