/** @jest-environment node */
import { NextRequest } from 'next/server';

import { GET as getDashboard } from '@/app/api/payments/dashboard/route';
import { GET as getList } from '@/app/api/payments/route';

jest.mock('@/src/server/auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('../../config', () => ({
  FINANCE_API_BASE_URL: 'http://127.0.0.1:8000',
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports -- the mock must be read lazily
const { getServerSession } = require('@/src/server/auth') as {
  getServerSession: jest.Mock;
};

const PAYER_UUID = '7e57c000-0000-4000-8000-000000000001';

function listRequest(query = ''): NextRequest {
  return new NextRequest(`http://localhost/api/payments${query}`);
}

function dashboardRequest(query = ''): NextRequest {
  return new NextRequest(`http://localhost/api/payments/dashboard${query}`);
}

describe('GET /api/payments', () => {
  let fetchMock: jest.SpiedFunction<typeof fetch>;

  beforeEach(() => {
    getServerSession.mockResolvedValue({ isAuthenticated: true, token: 'test-token' });
    fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json({ items: [], total: 0, page: 1, limit: 12, total_pages: 0 }),
    );
  });

  afterEach(() => jest.restoreAllMocks());

  it('returns 401 when there is no session', async () => {
    getServerSession.mockResolvedValue({ isAuthenticated: false, token: null });

    const response = await getList(listRequest());

    expect(response.status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('forwards the period and the name filters to the backend', async () => {
    const response = await getList(
      listRequest('?start_date=2026-11-01&end_date=2026-11-30&payer=Maria%20Silva&order_by=payment_date&order=desc'),
    );

    expect(response.status).toBe(200);
    const [url] = fetchMock.mock.calls[0]!;
    const target = new URL(url as string);
    expect(target.pathname).toBe('/receipts/payments');
    expect(target.searchParams.get('start_date')).toBe('2026-11-01');
    expect(target.searchParams.get('end_date')).toBe('2026-11-30');
    expect(target.searchParams.get('payer')).toBe('Maria Silva');
    expect(target.searchParams.get('order_by')).toBe('payment_date');
    expect(target.searchParams.get('order')).toBe('desc');
  });

  it('rejects an unsupported order_by with 400 instead of hitting the backend', async () => {
    const response = await getList(listRequest('?order_by=name'));

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects a malformed date with 400', async () => {
    const response = await getList(listRequest('?start_date=31/10/2026'));

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('GET /api/payments/dashboard', () => {
  let fetchMock: jest.SpiedFunction<typeof fetch>;

  beforeEach(() => {
    getServerSession.mockResolvedValue({ isAuthenticated: true, token: 'test-token' });
    fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json({
        period: { start_date: '2026-11-01', end_date: '2026-11-30' },
        summary: { total: '0.00', count: 0, average: '0.00', highest: '0.00' },
        monthly: [],
        institutions: [],
        subcategories: [],
        payers: [],
        beneficiaries: [],
      }),
    );
  });

  afterEach(() => jest.restoreAllMocks());

  it('returns 401 when there is no session', async () => {
    getServerSession.mockResolvedValue({ isAuthenticated: false, token: null });

    const response = await getDashboard(dashboardRequest('?start_date=2026-11-01&end_date=2026-11-30'));

    expect(response.status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects a missing period with 400', async () => {
    const response = await getDashboard(dashboardRequest());

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects a non-UUID payer_id with 400', async () => {
    const response = await getDashboard(
      dashboardRequest('?start_date=2026-11-01&end_date=2026-11-30&payer_id=maria'),
    );

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('forwards the period and the UUID filters to the backend', async () => {
    const response = await getDashboard(
      dashboardRequest(`?start_date=2026-11-01&end_date=2026-11-30&payer_id=${PAYER_UUID}`),
    );

    expect(response.status).toBe(200);
    const [url] = fetchMock.mock.calls[0]!;
    const target = new URL(url as string);
    expect(target.pathname).toBe('/receipts/payments/dashboard');
    expect(target.searchParams.get('start_date')).toBe('2026-11-01');
    expect(target.searchParams.get('payer_id')).toBe(PAYER_UUID);
  });
});