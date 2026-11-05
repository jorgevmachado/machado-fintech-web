import { NextResponse } from 'next/server';

import type { PaymentUpdateApiBody } from '@/src/contracts/finance-api/payment.contracts';
import type { ReceiptConfirmJson } from '@/src/features/receipt/types';

export class RequestValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RequestValidationError';
  }
}

type ResourceWriteBody = {
  name: string;
  description?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function readJsonObject(request: Pick<Request, 'json'>): Promise<Record<string, unknown>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new RequestValidationError('Request body must contain valid JSON.');
  }

  if (!isRecord(body)) {
    throw new RequestValidationError('Request body must be a JSON object.');
  }

  return body;
}

function requiredString(body: Record<string, unknown>, field: string): string {
  const value = body[field];
  if (typeof value !== 'string' || !value.trim()) {
    throw new RequestValidationError(`${field} must be a non-empty string.`);
  }
  return value;
}

function optionalString(
  body: Record<string, unknown>,
  field: string,
): string | undefined {
  const value = body[field];
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== 'string') {
    throw new RequestValidationError(`${field} must be a string.`);
  }
  return value;
}

function optionalNumber(
  body: Record<string, unknown>,
  field: string,
): number | undefined {
  const value = body[field];
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new RequestValidationError(`${field} must be a finite number.`);
  }
  return value;
}

function requiredNumber(body: Record<string, unknown>, field: string): number {
  const value = body[field];
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new RequestValidationError(`${field} must be a finite number.`);
  }
  return value;
}

function validateDateString(value: string | undefined, field: string): void {
  if (value === undefined) {
    return;
  }

  const isValidCalendarDate = (dateValue: string): boolean => {
    const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateValue);
    if (!dateOnlyMatch) {
      return false;
    }
    const [, year, month, day] = dateOnlyMatch;
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    return (
      date.getUTCFullYear() === Number(year) &&
      date.getUTCMonth() === Number(month) - 1 &&
      date.getUTCDate() === Number(day)
    );
  };

  if (isValidCalendarDate(value)) {
    return;
  }
  if (
    /^\d{4}-\d{2}-\d{2}T/.test(value) &&
    isValidCalendarDate(value.slice(0, 10)) &&
    Number.isFinite(Date.parse(value))
  ) {
    return;
  }

  throw new RequestValidationError(`${field} must be a valid date or ISO date-time.`);
}

export async function parseResourceWriteBody(
  request: Pick<Request, 'json'>,
  options: { description?: boolean } = {},
): Promise<ResourceWriteBody> {
  const body = await readJsonObject(request);
  const name = requiredString(body, 'name');
  const description = options.description
    ? optionalString(body, 'description')
    : undefined;

  return {
    name,
    ...(description === undefined ? {} : { description }),
  };
}

export async function parsePaymentUpdateBody(
  request: Pick<Request, 'json'>,
): Promise<PaymentUpdateApiBody> {
  const body = await readJsonObject(request);
  const result: PaymentUpdateApiBody = {};
  const stringFields = [
    'payer',
    'beneficiary',
    'source_institution',
    'destination_institution',
  ] as const;
  stringFields.forEach((field) => {
    const value = optionalString(body, field);
    if (value !== undefined) {
      result[field] = value;
    }
  });
  const amount = optionalNumber(body, 'amount');
  if (amount !== undefined) {
    result.amount = amount;
  }
  const paymentDate = optionalString(body, 'payment_date');
  validateDateString(paymentDate, 'payment_date');
  if (paymentDate !== undefined) {
    result.payment_date = paymentDate;
  }

  if (Object.keys(result).length === 0) {
    throw new RequestValidationError('At least one payment field must be provided.');
  }

  return result;
}

export async function parseReceiptConfirmBody(
  request: Pick<Request, 'json'>,
): Promise<ReceiptConfirmJson> {
  const body = await readJsonObject(request);
  const result: ReceiptConfirmJson = {
    id: requiredString(body, 'id'),
    category: requiredString(body, 'category'),
    beneficiary: requiredString(body, 'beneficiary'),
    paid_amount: requiredNumber(body, 'paid_amount'),
    source_institution: requiredString(body, 'source_institution'),
  };

  const stringFields = [
    'payer',
    'barcode',
    'description',
    'authentication',
    'transaction_id',
    'effective_payer',
    'destination_institution',
  ] as const;
  stringFields.forEach((field) => {
    const value = optionalString(body, field);
    if (value !== undefined) {
      result[field] = value;
    }
  });

  const numberFields = [
    'fine',
    'discount',
    'interest',
    'total_charges',
    'document_amount',
  ] as const;
  numberFields.forEach((field) => {
    const value = optionalNumber(body, field);
    if (value !== undefined) {
      result[field] = value;
    }
  });

  const dateFields = ['due_date', 'payment_date'] as const;
  dateFields.forEach((field) => {
    const value = optionalString(body, field);
    validateDateString(value, field);
    if (value !== undefined) {
      result[field] = value;
    }
  });

  return result;
}

export async function parseReceiptBatchBody(
  request: Pick<Request, 'formData'>,
): Promise<FormData> {
  let body: FormData;
  try {
    body = await request.formData();
  } catch {
    throw new RequestValidationError('Request body must contain valid form data.');
  }

  const fields = Array.from(body.keys());
  if (fields.some((field) => field !== 'files')) {
    throw new RequestValidationError('Only files are accepted for receipt uploads.');
  }

  const files = body.getAll('files');
  if (files.length === 0 || files.some((file) => typeof File === 'undefined' || !(file instanceof File))) {
    throw new RequestValidationError('At least one file must be included in the upload.');
  }

  return body;
}

export function parseResourceFilterQuery(
  searchParams: URLSearchParams,
  resourceFields: ReadonlyArray<'name' | 'institution_type'> = [],
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
  if (
    params.institution_type !== undefined &&
    params.institution_type !== 'source' &&
    params.institution_type !== 'destination'
  ) {
    throw new RequestValidationError('institution_type must be source or destination.');
  }

  return params;
}

export function parsePaymentFilterQuery(
  searchParams: URLSearchParams,
): Record<string, string> {
  const allowedFields = new Set([
    'page',
    'limit',
    'order_by',
    'clean_cache',
    'with_deleted',
    'order',
    'payer',
    'beneficiary',
    'source_institution',
    'destination_institution',
    'start_date',
    'end_date',
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

  const order = params.order;
  if (order !== undefined && order !== 'asc' && order !== 'desc') {
    throw new RequestValidationError('order must be asc or desc.');
  }

  validateDateString(params.start_date, 'start_date');
  validateDateString(params.end_date, 'end_date');
  return params;
}

export function parsePaymentDateQuery(
  searchParams: URLSearchParams,
): Record<string, string> {
  const params: Record<string, string> = {};
  searchParams.forEach((value, field) => {
    if (!['start_date', 'end_date', 'startDate', 'endDate'].includes(field)) {
      throw new RequestValidationError(`Unsupported query parameter: ${field}.`);
    }
    if (Object.hasOwn(params, field)) {
      throw new RequestValidationError(`${field} must not be repeated.`);
    }
    params[field] = value;
  });

  validateDateString(params.start_date ?? params.startDate, 'start_date');
  validateDateString(params.end_date ?? params.endDate, 'end_date');
  return params;
}

export function parsePaymentDashboardQuery(
  searchParams: URLSearchParams,
): { start_date?: string; end_date?: string; institution?: string } {
  const params: { start_date?: string; end_date?: string; institution?: string } = {};
  searchParams.forEach((value, field) => {
    if (!['start_date', 'end_date', 'institution'].includes(field)) {
      throw new RequestValidationError(`Unsupported query parameter: ${field}.`);
    }
    if (Object.hasOwn(params, field)) {
      throw new RequestValidationError(`${field} must not be repeated.`);
    }
    if (field === 'institution') {
      if (!value.trim()) {
        throw new RequestValidationError('institution must be a non-empty string.');
      }
      params.institution = value;
    } else if (field === 'start_date') {
      params.start_date = value;
    } else {
      params.end_date = value;
    }
  });

  validateDateString(params.start_date, 'start_date');
  validateDateString(params.end_date, 'end_date');
  return params;
}

export function requestValidationResponse(error: unknown): NextResponse | undefined {
  if (!(error instanceof RequestValidationError)) {
    return undefined;
  }
  return NextResponse.json({ message: error.message }, { status: 400 });
}
