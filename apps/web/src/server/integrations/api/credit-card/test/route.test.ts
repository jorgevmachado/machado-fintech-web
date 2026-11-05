/** @jest-environment node */
import { NextRequest } from 'next/server';
import { Result } from '@fintech/shared';

import { POST } from '@/app/api/credit-cards/route';
import { creditCardApiService } from '../credit-card.service';

jest.mock('@/src/server/auth', () => ({
  getServerSession: async () => ({ isAuthenticated: true, token: 'test-token' }),
}));

jest.mock('../credit-card.service', () => ({
  creditCardApiService: { create: jest.fn() },
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

function request(payload: unknown) {
  return new NextRequest('http://localhost/api/credit-cards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

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
