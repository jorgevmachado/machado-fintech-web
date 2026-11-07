/** @jest-environment node */
import { NextRequest } from 'next/server';

import { GET, POST } from '@/app/api/payers/route';
import { DELETE, PUT } from '@/app/api/payers/[identifier]/route';
import { getServerSession } from '@/src/server/auth';
import { payerService } from '@/src/features/payer/services';

jest.mock('@/src/server/auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('../../config', () => ({
  FINANCE_API_BASE_URL: 'http://127.0.0.1:8000',
}));

const context = { params: Promise.resolve({ identifier: 'payer-1' }) };
const payer = {
  id: 'payer-1',
  name: 'Customer',
  created_at: '2026-01-01T00:00:00.000Z',
};

function request(method: string, payload?: unknown, query = '') {
  const path = method === 'PUT' || method === 'DELETE' ? '/payers/payer-1' : '/payers';
  return new NextRequest(`http://localhost/api${path}${query}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(payload === undefined ? {} : { body: JSON.stringify(payload) }),
  });
}

describe('payer routes and API integration', () => {
  let fetchMock: jest.SpiedFunction<typeof fetch>;

  beforeEach(() => {
    jest.mocked(getServerSession).mockResolvedValue({
      isAuthenticated: true,
      token: 'test-token',
    });
    fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json(payer));
  });

  afterEach(() => jest.restoreAllMocks());

  it.each(['GET', 'POST', 'PUT', 'DELETE'])('rejects unauthenticated %s requests without contacting the API', async (method) => {
    jest.mocked(getServerSession).mockResolvedValue({ isAuthenticated: false });

    const req = request(method, method === 'POST' || method === 'PUT' ? { name: 'Customer' } : undefined);
    const response = method === 'GET' ? await GET(req)
      : method === 'POST' ? await POST(req)
        : method === 'PUT' ? await PUT(req, context)
          : await DELETE(req, context);

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ message: 'Unauthorized' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('lists payers with pagination and forwards permitted filters and authorization', async () => {
    const data = {
      items: [payer],
      meta: { current_page: 1, total_pages: 1, total_items: 1, per_page: 10 },
    };
    fetchMock.mockResolvedValueOnce(Response.json(data));

    const response = await GET(request('GET', undefined, '?page=1&limit=10&name=Customer'));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(data);
    const [url, init] = fetchMock.mock.calls[0]!;
    const apiUrl = new URL(url.toString());
    expect(apiUrl.origin + apiUrl.pathname).toBe('http://127.0.0.1:8000/payers');
    expect(Object.fromEntries(apiUrl.searchParams)).toEqual({ page: '1', limit: '10', name: 'Customer' });
    expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer test-token');
  });

  it('creates a payer and strips read-only and unrelated fields from the API payload', async () => {
    const response = await POST(request('POST', { ...payer, ignored: true }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(payer);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('http://127.0.0.1:8000/payers');
    expect(init?.method).toBe('POST');
    await expect(new Request(url, init).json()).resolves.toEqual({ name: 'Customer' });
  });

  it('updates the payer identified by the route and forwards only its name', async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ message: 'Updated' }));

    const response = await PUT(request('PUT', { ...payer, name: 'Updated customer' }), context);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ message: 'Updated' });
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('http://127.0.0.1:8000/payers/payer-1');
    expect(init?.method).toBe('PUT');
    await expect(new Request(url, init).json()).resolves.toEqual({ name: 'Updated customer' });
  });

  it('deletes the payer identified by the route', async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ message: 'Deleted' }));

    const response = await DELETE(request('DELETE'), context);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ message: 'Deleted' });
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('http://127.0.0.1:8000/payers/payer-1');
    expect(init?.method).toBe('DELETE');
    expect(init?.body).toBeUndefined();
  });

  it.each([{}, { name: '   ' }, { name: 123 }])('rejects invalid names for creation and update: %j', async (payload) => {
    const created = await POST(request('POST', payload));
    const updated = await PUT(request('PUT', payload), context);

    expect(created.status).toBe(400);
    expect(updated.status).toBe(400);
    await expect(created.json()).resolves.toEqual({ message: 'name must be a non-empty string.' });
    await expect(updated.json()).resolves.toEqual({ message: 'name must be a non-empty string.' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects malformed JSON without contacting the API', async () => {
    const response = await POST(new NextRequest('http://localhost/api/payers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{',
    }));

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects unsupported list filters without contacting the API', async () => {
    const response = await GET(request('GET', undefined, '?unsupported=value'));

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('preserves backend error status and message', async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ detail: 'Payer not found' }, { status: 404 }));

    const response = await DELETE(request('DELETE'), context);

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      message: { error: 'FastApiError', message: 'Payer not found', statusCode: 404 },
    });
  });

  it('round-trips a frontend create request through the BFF to the external API', async () => {
    const apiFetch = fetchMock.getMockImplementation()!;
    fetchMock.mockImplementation(async (input, init) => {
      if (input.toString() === '/api/payers') {
        return POST(new NextRequest(new Request(new URL(input.toString(), 'http://localhost'), init)));
      }
      return apiFetch(input, init);
    });

    const response = await payerService.create({ name: 'Customer' });

    expect(response.isOk).toBe(true);
    expect(response.instance?.name).toBe('Customer');
    expect(response.instance?.created_at).toEqual(new Date(payer.created_at));
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      '/api/payers',
      'http://127.0.0.1:8000/payers',
    ]);
  });
});
