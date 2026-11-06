/** @jest-environment node */
import { NextRequest } from 'next/server';
import { Result } from '@fintech/shared';

import { POST } from '@/app/api/credit-cards/route';
import { PUT } from '@/app/api/credit-cards/[identifier]/route';
import { creditCardApiService } from '../credit-card.service';

jest.mock('@/src/server/auth', () => ({
  getServerSession: async () => ({ isAuthenticated: true, token: 'test-token' }),
}));

jest.mock('../credit-card.service', () => ({
  creditCardApiService: { create: jest.fn(), update: jest.fn() },
}));

jest.mock('@/src/features/credit-card/mappers/credit-card.mapper', () => ({
  creditCardApiDataToJson: (value: unknown) => value,
}));

const body = {
  name: 'Card',
  brand: 'VISA',
  due_day: 15,
  closing_day: 5,
  icon: '',
  last_four_digits: '0123',
};

function request(payload: unknown, method = 'POST') {
  return new NextRequest('http://localhost/api/credit-cards', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

describe('PUT /api/credit-cards/[identifier]', () => {
  const context = { params: Promise.resolve({ identifier: 'card-1' }) };

  beforeEach(() => jest.clearAllMocks());

  it('only forwards writable fields, preserving inactive status and leading zeroes', async () => {
    jest.mocked(creditCardApiService.update).mockResolvedValue(Result.ok({ message: 'Updated' }));

    const response = await PUT(request({
      ...body,
      id: 'card-1',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-02-01T00:00:00Z',
      is_active: false,
      limit: 10000,
      description: '',
    }, 'PUT'), context);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ message: 'Updated' });
    expect(creditCardApiService.update).toHaveBeenCalledWith('test-token', 'card-1', {
      ...body,
      is_active: false,
      limit: 10000,
      description: '',
    });
  });

  it('rejects invalid field types before calling the external service', async () => {
    const response = await PUT(request({ ...body, due_day: '15' }, 'PUT'), context);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ message: 'due_day must be a finite number.' });
    expect(creditCardApiService.update).not.toHaveBeenCalled();
  });

  it('returns a validation error for malformed JSON', async () => {
    const response = await PUT(new NextRequest('http://localhost/api/credit-cards/card-1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: '{',
    }), context);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ message: 'Request body must contain valid JSON.' });
    expect(creditCardApiService.update).not.toHaveBeenCalled();
  });

  it('preserves external validation failures instead of reporting success', async () => {
    jest.mocked(creditCardApiService.update).mockResolvedValue(Result.fail('Invalid credit card.'));

    const response = await PUT(request({ ...body, is_active: true }, 'PUT'), context);

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({ message: 'Invalid credit card.' });
  });
});

describe('POST /api/credit-cards', () => {
  beforeEach(() => jest.clearAllMocks());

  it('forwards a valid form payload to the external service', async () => {
    jest.mocked(creditCardApiService.create).mockResolvedValue(Result.ok({
      id: 'card-1',
      name: 'Card',
      brand: 'VISA',
      due_day: 15,
      closing_day: 5,
      is_active: true,
      created_at: '2026-01-01T00:00:00Z',
    }));
    const response = await POST(request(body));
    expect(response.status).toBe(200);
    expect(creditCardApiService.create).toHaveBeenCalledWith('test-token', { ...body, is_active: true });
  });

  it('returns a validation 400 without calling the external service for numeric card digits', async () => {
    const response = await POST(request({ ...body, last_four_digits: 123 }));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ message: 'last_four_digits must be a string.' });
    expect(creditCardApiService.create).not.toHaveBeenCalled();
  });
});
