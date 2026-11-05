import {
  parseReceiptBatchBody,
  parsePaymentDateQuery,
  parsePaymentFilterQuery,
  parsePaymentUpdateBody,
  parseResourceFilterQuery,
  parseReceiptConfirmBody,
  parseResourceWriteBody,
  RequestValidationError,
  requestValidationResponse,
} from '../request-validation';
import { NextResponse } from 'next/server';

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

function jsonRequest(body: unknown): Pick<Request, 'json'> {
  return { json: async () => body };
}

describe('request validation', () => {
  it('returns only allowed resource write fields', async () => {
    const body = await parseResourceWriteBody(
      jsonRequest({ name: '  Rent  ', description: 'Monthly', admin: true }),
      { description: true },
    );

    expect(body).toEqual({ name: '  Rent  ', description: 'Monthly' });
  });

  it.each([
    ['invalid JSON', { json: async () => { throw new SyntaxError('Invalid JSON'); } }],
    ['non-object JSON', jsonRequest(['invalid'])],
    ['empty name', jsonRequest({ name: '  ' })],
    ['wrong description type', jsonRequest({ name: 'Rent', description: 12 })],
  ])('rejects %s in resource requests', async (_label, request) => {
    await expect(parseResourceWriteBody(request, { description: true }))
      .rejects.toBeInstanceOf(RequestValidationError);
  });

  it('validates and strips payment update fields', async () => {
    await expect(parsePaymentUpdateBody(jsonRequest({
      amount: 15.25,
      payment_date: '2026-10-08',
      unexpected: 'ignored',
    }))).resolves.toEqual({
      amount: 15.25,
      payment_date: '2026-10-08',
    });
  });

  it.each([
    { amount: '15.25' },
    { amount: Number.NaN },
    { payment_date: '2026-02-30' },
    {},
  ])('rejects invalid payment update payloads', async (body) => {
    await expect(parsePaymentUpdateBody(jsonRequest(body)))
      .rejects.toBeInstanceOf(RequestValidationError);
  });

  it('validates required fields and date values for receipt confirmation', async () => {
    const confirmation = {
      id: 'receipt-1',
      category: 'category-1',
      beneficiary: 'beneficiary-1',
      paid_amount: 10,
      source_institution: 'institution-1',
      payment_date: '2026-10-08',
      ignored: 'value',
    };

    await expect(parseReceiptConfirmBody(jsonRequest(confirmation)))
      .resolves.toEqual({
        id: 'receipt-1',
        category: 'category-1',
        beneficiary: 'beneficiary-1',
        paid_amount: 10,
        source_institution: 'institution-1',
        payment_date: '2026-10-08',
      });

    await expect(parseReceiptConfirmBody(jsonRequest({
      ...confirmation,
      payment_date: 'not-a-date',
    }))).rejects.toBeInstanceOf(RequestValidationError);
    await expect(parseReceiptConfirmBody(jsonRequest({
      ...confirmation,
      paid_amount: '10',
    }))).rejects.toBeInstanceOf(RequestValidationError);
  });

  it('accepts file-only receipt batch forms and rejects empty uploads', async () => {
    const formData = new FormData();
    formData.append('files', new File(['receipt'], 'receipt.pdf', { type: 'application/pdf' }));
    await expect(parseReceiptBatchBody({ formData: async () => formData }))
    .resolves.toBe(formData);

    await expect(parseReceiptBatchBody({ formData: async () => new FormData() }))
    .rejects.toBeInstanceOf(RequestValidationError);
  });

  it('validates payment filters and date query parameters', () => {
    expect(parsePaymentFilterQuery(new URLSearchParams({
      page: '2',
      order: 'desc',
      start_date: '2026-10-01',
    }))).toEqual({
      page: '2',
      order: 'desc',
      start_date: '2026-10-01',
    });

    expect(parsePaymentDateQuery(new URLSearchParams({
      start_date: '2026-10-01',
      end_date: '2026-10-31',
    }))).toEqual({
      start_date: '2026-10-01',
      end_date: '2026-10-31',
    });

    expect(() => parsePaymentFilterQuery(new URLSearchParams({ page: '0' })))
      .toThrow(RequestValidationError);
    expect(() => parsePaymentFilterQuery(new URLSearchParams({ order: 'random' })))
      .toThrow(RequestValidationError);
    expect(() => parsePaymentDateQuery(new URLSearchParams({ start_date: '2026-02-30' })))
      .toThrow(RequestValidationError);
    expect(() => parsePaymentDateQuery(new URLSearchParams({
      start_date: '2026-02-30T10:00:00.000Z',
    }))).toThrow(RequestValidationError);
  });

  it('validates resource filters against each resource contract', () => {
    expect(parseResourceFilterQuery(
      new URLSearchParams({ page: '1', name: 'Bank', institution_type: 'source' }),
      ['name', 'institution_type'],
    )).toEqual({ page: '1', name: 'Bank', institution_type: 'source' });

    expect(() => parseResourceFilterQuery(
      new URLSearchParams({ institution_type: 'other' }),
      ['name', 'institution_type'],
    )).toThrow(RequestValidationError);
    expect(() => parseResourceFilterQuery(
      new URLSearchParams({ name: 'Bank' }),
    )).toThrow(RequestValidationError);
  });

  it('translates validation errors into HTTP 400 responses', () => {
    const error = new RequestValidationError('name must be a non-empty string.');

    requestValidationResponse(error);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: error.message },
      { status: 400 },
    );
    expect(requestValidationResponse(new Error('Unexpected failure'))).toBeUndefined();
  });
});
