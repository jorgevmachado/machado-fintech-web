/** @jest-environment jsdom */

import { Http } from '../../../src';

const mockFetch = jest.fn<Promise<Response>, [RequestInfo | URL, RequestInit?]>();

beforeAll(() => {
  global.fetch = mockFetch;
});

afterEach(() => {
  mockFetch.mockReset();
});

describe('Http unauthorized event', () => {
  it('dispatches for same-origin API 401 responses', async () => {
    const handler = jest.fn();
    const url = `${window.location.origin}/api/payment`;
    window.addEventListener('machado:http-unauthorized', handler);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      url,
      text: () => Promise.resolve(JSON.stringify({ message: 'Unauthorized' })),
    } as Response);

    await expect(Http.request({
      baseUrl: `${window.location.origin}/api`,
      path: 'payment',
      method: 'GET',
    })).rejects.toMatchObject({ statusCode: 401 });

    expect(handler).toHaveBeenCalledTimes(1);
    window.removeEventListener('machado:http-unauthorized', handler);
  });

  it('does not dispatch for non-401 or cross-origin responses', async () => {
    const handler = jest.fn();
    window.addEventListener('machado:http-unauthorized', handler);

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 422,
      url: `${window.location.origin}/api/payment`,
      text: () => Promise.resolve(JSON.stringify({ message: 'Invalid data' })),
    } as Response);
    await expect(Http.request({
      baseUrl: `${window.location.origin}/api`,
      path: 'payment',
      method: 'GET',
    })).rejects.toMatchObject({ statusCode: 422 });

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      url: 'https://external.example/api/payment',
      text: () => Promise.resolve(JSON.stringify({ message: 'Unauthorized' })),
    } as Response);
    await expect(Http.request({
      baseUrl: 'https://external.example/api',
      path: 'payment',
      method: 'GET',
    })).rejects.toMatchObject({ statusCode: 401 });

    expect(handler).not.toHaveBeenCalled();
    window.removeEventListener('machado:http-unauthorized', handler);
  });

  it('does not dispatch when the unauthorized response URL is invalid', async () => {
    const handler = jest.fn();
    window.addEventListener('machado:http-unauthorized', handler);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      url: 'not-a-valid-url',
      text: () => Promise.resolve(JSON.stringify({ message: 'Unauthorized' })),
    } as Response);

    await expect(Http.request({
      baseUrl: `${window.location.origin}/api`,
      path: 'payment',
      method: 'GET',
    })).rejects.toMatchObject({ statusCode: 401 });

    expect(handler).not.toHaveBeenCalled();
    window.removeEventListener('machado:http-unauthorized', handler);
  });
});
