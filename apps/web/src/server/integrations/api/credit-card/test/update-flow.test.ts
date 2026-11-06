/** @jest-environment node */
import { NextRequest } from 'next/server';

import { PUT } from '@/app/api/credit-cards/[identifier]/route';
import { CreditCardService } from '@/src/features/credit-card/services/credit-card.service';

jest.mock('@/src/server/auth', () => ({
  getServerSession: async () => ({ isAuthenticated: true, token: 'test-token' }),
}));

jest.mock('../../config', () => ({
  FINANCE_API_BASE_URL: 'http://127.0.0.1:8000',
}));

describe('credit card update HTTP flow', () => {
  afterEach(() => jest.restoreAllMocks());

  it.each([50, 20.1, 0])('preserves decimal limit %s from the client through the BFF to the API', async (limit) => {
    const fetchMock = jest.spyOn(globalThis, 'fetch');
    fetchMock.mockImplementationOnce(async (input, init) => PUT(
      new NextRequest(new Request(new URL(String(input), 'http://localhost'), init)),
      { params: Promise.resolve({ identifier: 'card-1' }) },
    ));
    fetchMock.mockResolvedValueOnce(Response.json({ message: 'Updated' }));

    const result = await new CreditCardService().update('card-1', {
      name: 'Card',
      brand: 'VISA',
      due_day: 15,
      closing_day: 5,
      is_active: true,
      limit,
    });

    expect(result.isOk).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/credit-cards/card-1');
    expect(fetchMock.mock.calls[1]?.[0]).toBe('http://127.0.0.1:8000/credit-cards/card-1');
    for (const [, init] of fetchMock.mock.calls) {
      await expect(new Request('http://localhost', init).json()).resolves.toMatchObject({ limit });
    }
  });
});
