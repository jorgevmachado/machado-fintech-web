import { jest } from '@jest/globals';
import { HttpClient, Result } from '../../../src';

type MockResponse = {
  ok: boolean;
  status: number;
  text: () => Promise<string>;
};

const mockFetch = jest.fn<
  (input: RequestInfo | URL, init?: RequestInit) => Promise<MockResponse>
>();

beforeAll(() => {
  global.fetch = mockFetch as unknown as typeof fetch;
});

afterEach(() => {
  mockFetch.mockReset();
});

describe('HttpClient', () => {

  describe('Constructor', () => {
    test('exposes the default base url', () => {
      const client = new HttpClient();

      expect(client.url).toBe('http://127.0.0.1:8000');
    });

    test('exposes the base url', () => {
      const baseUrl = 'https://api.example.com';
      const client = new HttpClient(baseUrl);

      expect(client.url).toBe(baseUrl);
    });
  });

  describe('get', () => {
    test('returns Result.ok when request succeeds', async () => {
      const response = {
        id: '1',
        name: 'John',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify(response)),
      });

      const result = await HttpClient.get<{
        id: string;
        name: string;
      }>({
        path: '/users/1',
      });

      expect(result).toBeInstanceOf(Result);
      expect(result.isOk).toBeTruthy();
      expect(result.instance).toEqual(response);
    });

    test('returns Result.fail when request fails', async () => {
      mockFetch.mockRejectedValueOnce(
        new Error('Network error'),
      );

      const result = await HttpClient.get({
        path: '/users/1',
      });

      expect(result).toBeInstanceOf(Result);
      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toEqual([
        {
          error: 'Error',
          message: 'Network error',
          statusCode: 500,
        },
      ]);
    });

    test('uses the default base url', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve('{}'),
      });

      await HttpClient.get({
        path: '/users',
      });

      const [url, init] = mockFetch.mock.calls[0];

      expect(url).toBe(
        `${HttpClient.DEFAULT_API_BASE_URL}/users`,
      );

      expect(init?.method).toBe('GET');
    });

    test('uses the provided base url', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve('{}'),
      });

      await HttpClient.get({
        path: '/users',
        baseUrl: 'https://api.example.com',
      });

      const [url, init] = mockFetch.mock.calls[0];

      expect(url).toBe(
        'https://api.example.com/users',
      );

      expect(init?.method).toBe('GET');
    });

    test('sends query params', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve('[]'),
      });

      const result = await HttpClient.get<Array<unknown>>({
        path: '/users',
        config: {
          params: {
            page: 1,
            limit: 10,
          },
        },
      });

      expect(result.isOk).toBeTruthy();

      const [url] = mockFetch.mock.calls[0];

      expect(url).toContain('page=1');
      expect(url).toContain('limit=10');
    });

    test('does not send a request body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve('{}'),
      });

      await HttpClient.get({
        path: '/users',
      });

      const [, init] = mockFetch.mock.calls[0];

      expect(init?.method).toBe('GET');
      expect(init?.body).toBeUndefined();
    });

    test('returns Result.ok when request succeeds in instance method', async () => {
      const response = {
        id: '1',
        name: 'John',
      };

      const client = new HttpClient();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify(response)),
      });

      const result = await client.get<{ id: string; name: string;}>('/users/1');

      expect(client.url).toBe('http://127.0.0.1:8000');
      expect(result).toBeInstanceOf(Result);
      expect(result.isOk).toBeTruthy();
      expect(result.instance).toEqual(response);
    });
  });

  describe('remove', () => {
    test('returns Result.ok when request succeeds', async () => {
      const response = {
        id: '1',
        deleted: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify(response)),
      });

      const result = await HttpClient.remove<{
        id: string;
        deleted: boolean;
      }>({
        path: '/users/1',
      });

      expect(result).toBeInstanceOf(Result);
      expect(result.isOk).toBeTruthy();
      expect(result.instance).toEqual(response);
    });

    test('returns Result.fail when request fails', async () => {
      mockFetch.mockRejectedValueOnce(
        new Error('Network error'),
      );

      const result = await HttpClient.remove({
        path: '/users/1',
      });

      expect(result).toBeInstanceOf(Result);
      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toEqual([
        {
          error: 'Error',
          message: 'Network error',
          statusCode: 500,
        },
      ]);
    });

    test('uses the default base url', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        text: () => Promise.resolve(''),
      });

      await HttpClient.remove({
        path: '/users/1',
      });

      const [url, init] = mockFetch.mock.calls[0];

      expect(url).toBe(
        `${HttpClient.DEFAULT_API_BASE_URL}/users/1`,
      );

      expect(init?.method).toBe('DELETE');
    });

    test('uses the provided base url', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        text: () => Promise.resolve(''),
      });

      await HttpClient.remove({
        path: '/users/1',
        baseUrl: 'https://api.example.com',
      });

      const [url, init] = mockFetch.mock.calls[0];

      expect(url).toBe(
        'https://api.example.com/users/1',
      );

      expect(init?.method).toBe('DELETE');
    });

    test('sends query params', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        text: () => Promise.resolve(''),
      });

      const result = await HttpClient.remove({
        path: '/users/1',
        config: {
          params: {
            force: true,
            reason: 'test',
          },
        },
      });

      expect(result.isOk).toBeTruthy();

      const [url] = mockFetch.mock.calls[0];

      expect(url).toContain('force=true');
      expect(url).toContain('reason=test');
    });

    test('does not send a request body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        text: () => Promise.resolve(''),
      });

      await HttpClient.remove({
        path: '/users/1',
      });

      const [, init] = mockFetch.mock.calls[0];

      expect(init?.method).toBe('DELETE');
      expect(init?.body).toBeUndefined();
    });

    test('returns Result.ok when request succeeds in instance method', async () => {
      const response = {
        id: '1',
        deleted: true,
      };

      const client = new HttpClient();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify(response)),
      });

      const result = await client.remove<{ id: string; deleted: boolean;}>('/users/1');

      expect(result).toBeInstanceOf(Result);
      expect(result.isOk).toBeTruthy();
      expect(result.instance).toEqual(response);
    });
  });

  describe('post', () => {
    test('returns Result.ok when request succeeds', async () => {
      const response = {
        id: '1',
        name: 'John',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        text: () => Promise.resolve(JSON.stringify(response)),
      });

      const result = await HttpClient.post<
        { id: string; name: string },
        { name: string }
      >({
        path: '/users',
        config: {
          body: {
            name: 'John',
          },
        },
      });

      expect(result).toBeInstanceOf(Result);
      expect(result.isOk).toBeTruthy();
      expect(result.instance).toEqual(response);
    });

    test('returns Result.fail when request fails', async () => {
      mockFetch.mockRejectedValueOnce(
        new Error('Network error'),
      );

      const result = await HttpClient.post({
        path: '/users',
        config: {
          body: {
            name: 'John',
          },
        },
      });

      expect(result).toBeInstanceOf(Result);
      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toEqual([
        {
          error: 'Error',
          message: 'Network error',
          statusCode: 500,
        },
      ]);
    });

    test('uses the default base url', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        text: () => Promise.resolve('{}'),
      });

      await HttpClient.post({
        path: '/users',
        config: {
          body: {
            name: 'John',
          },
        },
      });

      const [url, init] = mockFetch.mock.calls[0];

      expect(url).toBe(
        `${HttpClient.DEFAULT_API_BASE_URL}/users`,
      );

      expect(init?.method).toBe('POST');
    });

    test('uses the provided base url', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        text: () => Promise.resolve('{}'),
      });

      await HttpClient.post({
        path: '/users',
        config: {
          body: {
            name: 'John',
          },
        },
        baseUrl: 'https://api.example.com',
      });

      const [url, init] = mockFetch.mock.calls[0];

      expect(url).toBe(
        'https://api.example.com/users',
      );

      expect(init?.method).toBe('POST');
    });

    test('sends the request body as JSON', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        text: () => Promise.resolve('{}'),
      });

      const body = {
        name: 'John',
        email: 'john@example.com',
      };

      await HttpClient.post({
        path: '/users',
        config: {
          body,
        },
      });

      const [, init] = mockFetch.mock.calls[0];

      expect(init?.body).toBe(JSON.stringify(body));
    });

    test('sends the application/json content type', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        text: () => Promise.resolve('{}'),
      });

      await HttpClient.post({
        path: '/users',
        config: {
          body: {
            name: 'John',
          },
        },
      });

      const [, init] = mockFetch.mock.calls[0];
      const headers = new Headers(init?.headers);

      expect(headers.get('content-type')).toBe(
        'application/json; charset=UTF-8',
      );
    });

    test('sends query params', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        text: () => Promise.resolve('{}'),
      });

      await HttpClient.post({
        path: '/users',
        config: {
          params: {
            notify: true,
          },
          body: {
            name: 'John',
          },
        },
      });

      const [url] = mockFetch.mock.calls[0];

      expect(url).toContain('notify=true');
    });

    test('allows overriding the request headers', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        text: () => Promise.resolve('{}'),
      });

      await HttpClient.post({
        path: '/users',
        config: {
          body: {
            name: 'John',
          },
          override: {
            headers: {
              'X-Custom-Header': 'test',
            },
          },
        },
      });

      const [, init] = mockFetch.mock.calls[0];
      const headers = new Headers(init?.headers);

      expect(headers.get('x-custom-header')).toBe('test');
    });

    test('returns Result.ok when request succeeds in instance method', async () => {
      const response = {
        id: '1',
        name: 'John',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        text: () => Promise.resolve(JSON.stringify(response)),
      });
      const client = new HttpClient();
      const result = await client.post<
        { id: string; name: string },
        { name: string }
      >('/users',{
          body: {
            name: 'John',
          },
        }
      );

      expect(result).toBeInstanceOf(Result);
      expect(result.isOk).toBeTruthy();
      expect(result.instance).toEqual(response);
    });
  });

  describe('put', () => {
    test('returns Result.ok when request succeeds', async () => {
      const response = {
        id: '1',
        name: 'John Updated',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify(response)),
      });

      const result = await HttpClient.put<
        { id: string; name: string },
        { name: string }
      >({
        path: '/users/1',
        config: {
          body: {
            name: 'John Updated',
          },
        },
      });

      expect(result).toBeInstanceOf(Result);
      expect(result.isOk).toBeTruthy();
      expect(result.instance).toEqual(response);
    });

    test('returns Result.fail when request fails', async () => {
      mockFetch.mockRejectedValueOnce(
        new Error('Network error'),
      );

      const result = await HttpClient.put({
        path: '/users/1',
        config: {
          body: {
            name: 'John Updated',
          },
        },
      });

      expect(result).toBeInstanceOf(Result);
      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toEqual([
        {
          error: 'Error',
          message: 'Network error',
          statusCode: 500,
        },
      ]);
    });

    test('sends a PUT request with a JSON body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve('{}'),
      });

      const body = {
        name: 'John Updated',
      };

      await HttpClient.put({
        path: '/users/1',
        config: {
          body,
        },
      });

      const [url, init] = mockFetch.mock.calls[0];

      expect(url).toContain('/users/1');
      expect(init?.method).toBe('PUT');
      expect(init?.body).toBe(JSON.stringify(body));
    });

    test('sends the application/json content type', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve('{}'),
      });

      await HttpClient.put({
        path: '/users/1',
        config: {
          body: {
            name: 'John Updated',
          },
        },
      });

      const [, init] = mockFetch.mock.calls[0];
      const headers = new Headers(init?.headers);

      expect(headers.get('content-type')).toBe(
        'application/json; charset=UTF-8',
      );
    });

    test('returns Result.ok when request succeeds in instance method', async () => {
      const response = {
        id: '1',
        name: 'John Updated',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify(response)),
      });
      const client = new HttpClient();
      const result = await client.put<
        { id: string; name: string },
        { name: string }
      >('/users/1', {
        body: {
          name: 'John Updated',
        },
      });

      expect(result).toBeInstanceOf(Result);
      expect(result.isOk).toBeTruthy();
      expect(result.instance).toEqual(response);
    });
  });

  describe('patch', () => {
    test('returns Result.ok when request succeeds', async () => {
      const response = {
        id: '1',
        name: 'John Updated',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify(response)),
      });

      const result = await HttpClient.patch<
        { id: string; name: string },
        { name?: string }
      >({
        path: '/users/1',
        config: {
          body: {
            name: 'John Updated',
          },
        },
      });

      expect(result).toBeInstanceOf(Result);
      expect(result.isOk).toBeTruthy();
      expect(result.instance).toEqual(response);
    });

    test('returns Result.fail when request fails', async () => {
      mockFetch.mockRejectedValueOnce(
        new Error('Network error'),
      );

      const result = await HttpClient.patch({
        path: '/users/1',
        config: {
          body: {
            name: 'John Updated',
          },
        },
      });

      expect(result).toBeInstanceOf(Result);
      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toEqual([
        {
          error: 'Error',
          message: 'Network error',
          statusCode: 500,
        },
      ]);
    });

    test('sends a PATCH request with a JSON body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve('{}'),
      });

      const body = {
        name: 'John Updated',
      };

      await HttpClient.patch({
        path: '/users/1',
        config: {
          body,
        },
      });

      const [url, init] = mockFetch.mock.calls[0];

      expect(url).toContain('/users/1');
      expect(init?.method).toBe('PATCH');
      expect(init?.body).toBe(JSON.stringify(body));
    });

    test('sends the application/json content type', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve('{}'),
      });

      await HttpClient.patch({
        path: '/users/1',
        config: {
          body: {
            name: 'John Updated',
          },
        },
      });

      const [, init] = mockFetch.mock.calls[0];
      const headers = new Headers(init?.headers);

      expect(headers.get('content-type')).toBe(
        'application/json; charset=UTF-8',
      );
    });

    test('returns Result.ok when request succeeds in instance method', async () => {
      const response = {
        id: '1',
        name: 'John Updated',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify(response)),
      });
      const client = new HttpClient();
      const result = await client.patch<
        { id: string; name: string },
        { name?: string }
      >('/users/1', {
        body: {
          name: 'John Updated',
        },
      });

      expect(result).toBeInstanceOf(Result);
      expect(result.isOk).toBeTruthy();
      expect(result.instance).toEqual(response);
    });
  });
});