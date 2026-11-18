import {
  RequestValidationError
} from '@/src/server/validation/request-validation';

export function parseStatementResourceFilterQuery(
  searchParams: URLSearchParams,
  resourceFields: ReadonlyArray<'search' | 'status' | 'end_date' | 'start_date' | 'account_id' | 'direction' | 'credit_card_id' | 'subcategory_id' | 'only_credit_card'> = [],
): Record<string, string> {
  const allowedFields = new Set([
    'page',
    'limit',
    'order_by',
    'clean_cache',
    'with_deleted',
    ...resourceFields,
  ]);
  const params: Record<string, string> = {};

  searchParams.forEach((value, field) => {
    if (!allowedFields.has(field)) {
      throw new RequestValidationError(`Unsupported query parameter: ${field}.`);
    }
    if (Object.hasOwn(params, field)) {
      throw new RequestValidationError(`${field} must not be repeated.`);
    }
    params[field] = value;
  });

  ['page', 'limit'].forEach((field) => {
    const value = params[field];
    if (value !== undefined && (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value)))) {
      throw new RequestValidationError(`${field} must be a positive integer.`);
    }
  });
  ['clean_cache', 'with_deleted'].forEach((field) => {
    const value = params[field];
    if (value !== undefined && value !== 'true' && value !== 'false') {
      throw new RequestValidationError(`${field} must be true or false.`);
    }
  });

  if(!params.start_date && !params.end_date) {
    throw new RequestValidationError(`At least one of start_date or end_date must be provided.`);
  }

  return params;
}