/** @jest-environment node */
import { NextRequest } from 'next/server';

import { GET, POST } from '@/app/api/receipts/rules/route';
import { PUT } from '@/app/api/receipts/rules/[identifier]/route';

jest.mock('@/src/server/auth', () => ({
  getServerSession: async () => ({ isAuthenticated: true, token: 'test-token' }),
}));

jest.mock('../../config', () => ({
  FINANCE_API_BASE_URL: 'http://127.0.0.1:8000',
}));

const profile = {
  id: 'profile-1',
  name: 'Itaú',
  institution_id: 'e2f1c4e0-0000-4000-8000-000000000001',
  institution_code: 'ITAU_UNIBANCO',
  scope: 'private',
  is_active: true,
  identification_rules: [
    {
      id: 'rule-1',
      pattern: 'Ita[úu]',
      weight: 100,
      is_active: true,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: null,
    },
  ],
  field_rules: [],
  created_at: '2026-01-01T00:00:00Z',
  updated_at: null,
};

const context = { params: Promise.resolve({ identifier: 'profile-1' }) };

function listRequest(query = '') {
  return new NextRequest(`http://localhost/api/receipts/rules${query}`);
}

function putRequest(payload: unknown) {
  return new NextRequest('http://localhost/api/receipts/rules/profile-1', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

describe('receipt rules BFF routes', () => {
  let fetchMock: jest.SpiedFunction<typeof fetch>;

  afterEach(() => jest.restoreAllMocks());

  it('proxies GET /api/receipts/rules to the finance API with the auth token', async () => {
    fetchMock = jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({ items: [profile], meta: {} }));

    const response = await GET(listRequest('?page=1&limit=12'));

    expect(response.status).toBe(200);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(String(url)).toContain('http://127.0.0.1:8000/receipts/rules');
    expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer test-token');
  });

  it('rejects unsupported query parameters on the list route', async () => {
    const response = await GET(listRequest('?bogus=1'));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'Unsupported query parameter: bogus.',
    });
  });

  it('forwards a 409 from the API when the institution profile already exists', async () => {
    fetchMock = jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        Response.json(
          { detail: 'Institution profile already exists' },
          { status: 409 },
        ),
      );

    const response = await POST(
      new NextRequest('http://localhost/api/receipts/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Itaú',
          institution_id: profile.institution_id,
          is_active: true,
          identification_rules: [],
        }),
      }),
    );

    expect(response.status).toBe(409);
  });

  it('does not send field_rules on PUT so existing field rules are preserved', async () => {
    fetchMock = jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({ message: 'Updated' }));

    const response = await PUT(
      putRequest({
        name: 'Itaú editado',
        is_active: true,
        identification_rules: [
          { id: 'rule-1', pattern: 'Ita[úu]', weight: 100, is_active: true },
        ],
      }),
      context,
    );

    expect(response.status).toBe(200);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(String(url)).toBe('http://127.0.0.1:8000/receipts/rules/profile-1');
    await expect(new Request(url, init).json()).resolves.toEqual({
      name: 'Itaú editado',
      is_active: true,
      identification_rules: [
        { id: 'rule-1', pattern: 'Ita[úu]', weight: 100, is_active: true },
      ],
    });
  });

  it('forwards field_rules on PUT when the field-rule form sends them', async () => {
    fetchMock = jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({ message: 'Updated' }));

    const fieldRule = {
      id: 'field-1',
      field_name: 'payer',
      configuration: { strategy: 'not_found' },
      is_active: true,
    };

    const response = await PUT(
      putRequest({
        name: 'Itaú',
        is_active: true,
        identification_rules: [],
        field_rules: [fieldRule],
      }),
      context,
    );

    expect(response.status).toBe(200);
    const [url, init] = fetchMock.mock.calls[0]!;
    await expect(new Request(url, init).json()).resolves.toEqual({
      name: 'Itaú',
      is_active: true,
      identification_rules: [],
      field_rules: [fieldRule],
    });
  });

  it('does not send institution_id on PUT', async () => {
    fetchMock = jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({ message: 'Updated' }));

    const response = await PUT(
      putRequest({
        name: 'Itaú',
        is_active: true,
        identification_rules: [],
        institution_id: profile.institution_id,
      }),
      context,
    );

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('forwards a 403 from the API for a system profile update', async () => {
    fetchMock = jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        Response.json(
          { detail: 'System profile is read-only' },
          { status: 403 },
        ),
      );

    const response = await PUT(
      putRequest({ name: 'Default', is_active: true, identification_rules: [] }),
      context,
    );

    expect(response.status).toBe(403);
  });
});