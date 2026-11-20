/** @jest-environment node */
import { NextRequest } from 'next/server';

import { POST, PUT } from '@/app/api/receipts/route';

jest.mock('@/src/server/auth', () => ({
  getServerSession: async () => ({ isAuthenticated: true, token: 'test-token' }),
}));

jest.mock('../../config', () => ({
  FINANCE_API_BASE_URL: 'http://127.0.0.1:8000',
}));

const requiredFields = {
  id: '7e57c000-0000-4000-8000-000000000006',
  payer: 'Usuario Teste',
  subcategory_id: '56f17ac3-10b3-4c07-a92c-820ce6e63436',
  beneficiary: 'Claro Net',
  paid_amount: 119.99,
  payment_date: '2026-11-02',
  source_institution: 'Nubank',
};

/** O service server-side remove o id do body: ele já vai no path da URL. */
function withoutId(data: Record<string, unknown>): Record<string, unknown> {
  const copy = { ...data };
  delete copy.id;
  return copy;
}

function request(method: 'POST' | 'PUT', payload: unknown) {
  return new NextRequest('http://localhost/api/receipts', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

describe('POST /api/receipts', () => {
  let fetchMock: jest.SpiedFunction<typeof fetch>;

  beforeEach(() => {
    fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json({ message: 'Receipt confirmed successfully' }),
    );
  });

  afterEach(() => jest.restoreAllMocks());

  it('sends payment_date to the external API, which requires it on confirm', async () => {
    const response = await POST(request('POST', requiredFields));

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe(`http://127.0.0.1:8000/receipts/${requiredFields.id}/confirm`);
    expect(init?.method).toBe('POST');
    expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer test-token');
    await expect(new Request(url, init).json()).resolves.toEqual(withoutId(requiredFields));
  });

  it('omits the id from the body because it already travels in the path', async () => {
    await POST(request('POST', requiredFields));

    const [url, init] = fetchMock.mock.calls[0]!;
    const body = await new Request(url, init).json();

    expect(body).not.toHaveProperty('id');
  });

  it('returns 400 without calling the API when payment_date is missing', async () => {
    const withoutPaymentDate = { ...requiredFields, payment_date: undefined };

    const response = await POST(request('POST', withoutPaymentDate));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'payment_date must be a non-empty string.',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('preserves the backend status and message when the API rejects the confirm', async () => {
    fetchMock.mockResolvedValueOnce(
      Response.json({ detail: 'Receipt is not ready for confirmation' }, { status: 409 }),
    );

    const response = await POST(request('POST', requiredFields));

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      message: { error: 'FastApiError', message: 'Receipt is not ready for confirmation', statusCode: 409 },
    });
  });

  it('returns the FastAPI validation reason instead of a generic message', async () => {
    fetchMock.mockResolvedValueOnce(
      Response.json(
        { detail: [{ loc: ['body', 'subcategory_id'], msg: 'Input should be a valid UUID' }] },
        { status: 422 },
      ),
    );

    const response = await POST(request('POST', requiredFields));

    expect(response.status).toBe(422);
    const body = await response.json();
    expect(body.message.message).toBe('subcategory_id: Input should be a valid UUID');
  });
});

describe('PUT /api/receipts', () => {
  let fetchMock: jest.SpiedFunction<typeof fetch>;

  beforeEach(() => {
    fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json({ message: 'Receipt updated successfully' }),
    );
  });

  afterEach(() => jest.restoreAllMocks());

  it('sends payment_date to the external API, which requires it on update too', async () => {
    const response = await PUT(request('PUT', requiredFields));

    expect(response.status).toBe(200);

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe(`http://127.0.0.1:8000/receipts/${requiredFields.id}`);
    expect(init?.method).toBe('PUT');
    await expect(new Request(url, init).json()).resolves.toEqual(withoutId(requiredFields));
  });
});