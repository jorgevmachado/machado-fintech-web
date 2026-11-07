/** @jest-environment node */
import { NextRequest } from 'next/server';

import { PUT } from '@/app/api/accounts/[identifier]/route';

jest.mock('@/src/server/auth', () => ({
  getServerSession: async () => ({ isAuthenticated: true, token: 'test-token' }),
}));

jest.mock('../../config', () => ({
  FINANCE_API_BASE_URL: 'http://127.0.0.1:8000',
}));

const requiredFields = { name: 'Wallet', type: 'CASH', is_active: true };
const context = { params: Promise.resolve({ identifier: 'account-1' }) };

function request(payload: unknown) {
  return new NextRequest('http://localhost/api/accounts/account-1', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

describe('PUT /api/accounts/[identifier]', () => {
  let fetchMock: jest.SpiedFunction<typeof fetch>;

  beforeEach(() => {
    fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json({ message: 'Updated' }),
    );
  });

  afterEach(() => jest.restoreAllMocks());

  it('sends explicit nulls to the external API for empty optional form fields', async () => {
    const response = await PUT(request({
      ...requiredFields,
      id: 'account-1',
      icon: 'wallet',
      color: '#6B7280',
      agency: '',
      description: '',
      account_number: '',
      financial_institution: 'Cash',
    }), context);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ message: 'Updated' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('http://127.0.0.1:8000/accounts/account-1');
    expect(init?.method).toBe('PUT');
    expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer test-token');
    await expect(new Request(url, init).json()).resolves.toEqual({
      ...requiredFields,
      icon: 'wallet',
      color: '#6B7280',
      agency: null,
      description: null,
      account_number: null,
      financial_institution: 'Cash',
    });
  });

  it('preserves supplied values and does not add omitted optional fields', async () => {
    const payload = {
      ...requiredFields,
      is_active: false,
      agency: '0012',
      account_number: '000123',
    };
    const response = await PUT(request(payload), context);

    expect(response.status).toBe(200);
    const [url, init] = fetchMock.mock.calls[0]!;
    await expect(new Request(url, init).json()).resolves.toEqual(payload);
  });

  it('rejects invalid optional field types without contacting the external API', async () => {
    const response = await PUT(request({ ...requiredFields, agency: 123 }), context);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ message: 'agency must be a string.' });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
