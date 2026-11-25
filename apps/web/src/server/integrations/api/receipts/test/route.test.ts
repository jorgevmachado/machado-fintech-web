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

/** O confirm também exige o lançamento a criar; o PUT não. */
const confirmFields = {
  ...requiredFields,
  name: 'Claro Net',
  account_id: '3b3f1c1e-1111-4222-8333-444455556666',
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
    const response = await POST(request('POST', confirmFields));

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe(`http://127.0.0.1:8000/receipts/${confirmFields.id}/confirm`);
    expect(init?.method).toBe('POST');
    expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer test-token');
    await expect(new Request(url, init).json()).resolves.toEqual(withoutId(confirmFields));
  });

  it('omits the id from the body because it already travels in the path', async () => {
    await POST(request('POST', confirmFields));

    const [url, init] = fetchMock.mock.calls[0]!;
    const body = await new Request(url, init).json();

    expect(body).not.toHaveProperty('id');
  });

  it('returns 400 without calling the API when payment_date is missing', async () => {
    const withoutPaymentDate = { ...confirmFields, payment_date: undefined };

    const response = await POST(request('POST', withoutPaymentDate));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'payment_date must be a non-empty string.',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns 400 without calling the API when the account is missing', async () => {
    const response = await POST(request('POST', { ...confirmFields, account_id: '' }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'account_id must be a non-empty string.',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns 400 without calling the API when the kind is inconsistent', async () => {
    const response = await POST(request('POST', {
      ...confirmFields,
      transaction_kind: 'INSTALLMENT',
      installments_total: 10,
    }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'installment_index and installments_total are required for INSTALLMENT.',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('preserves the backend status and message when the API rejects the confirm', async () => {
    fetchMock.mockResolvedValueOnce(
      Response.json({ detail: 'Receipt is not ready for confirmation' }, { status: 409 }),
    );

    const response = await POST(request('POST', confirmFields));

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      message: { error: 'FastApiError', message: 'Receipt is not ready for confirmation', statusCode: 409 },
    });
  });

  it('forwards the conflict body of a 409 so the client can offer the overwrite', async () => {
    fetchMock.mockResolvedValueOnce(
      Response.json(
        {
          detail: {
            type: 'OCCURRENCE_EXISTS',
            existing: { id: 'abc', settled_on: '2026-10-26', value: '55.90' },
            occurrence: { occurrence_index: 3 },
          },
        },
        { status: 409 },
      ),
    );

    const response = await POST(request('POST', confirmFields));

    expect(response.status).toBe(409);
    const body = await response.json();
    expect(body.message.details).toEqual({
      type: 'OCCURRENCE_EXISTS',
      existing: { id: 'abc', settled_on: '2026-10-26', value: '55.90' },
      occurrence: { occurrence_index: 3 },
    });
  });

  it('returns the FastAPI validation reason instead of a generic message', async () => {
    fetchMock.mockResolvedValueOnce(
      Response.json(
        { detail: [{ loc: ['body', 'subcategory_id'], msg: 'Input should be a valid UUID' }] },
        { status: 422 },
      ),
    );

    const response = await POST(request('POST', confirmFields));

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