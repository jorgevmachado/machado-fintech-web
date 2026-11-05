import { Http, type HttpConfig } from '../../../src';

// ─── Concrete subclass for testing ───────────────────────────────────────────

class TestHttp extends Http {
  constructor(
    url = 'http://api.test',
    config: HttpConfig = {},
  ) {
    super(url, config);
  }
}

// ─── Fetch mock ───────────────────────────────────────────────────────────────

const mockFetch = jest.fn<
  Promise<Response>,
  [RequestInfo | URL, RequestInit?]
>();

beforeAll(() => {
  global.fetch = mockFetch;
});

afterEach(() => {
  mockFetch.mockReset();
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mockOkResponse(body: unknown, status = 200): void {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    status,
    text: () => Promise.resolve(JSON.stringify(body)),
  } as Response);
}

function mockEmptyResponse(status = 204): void {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    status,
    text: () => Promise.resolve(''),
  } as Response);
}

function mockErrorResponse(
  body: unknown,
  status = 400,
  url = 'http://api.test/users',
): void {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status,
    url,
    text: () => Promise.resolve(JSON.stringify(body)),
  } as Response);
}

// ─────────────────────────────────────────────────────────────────────────────

describe('Http', () => {
  // ─── Constructor ───────────────────────────────────────────────────────────

  describe('constructor', () => {
    test('exposes the base url', () => {
      const http = new TestHttp('http://example.com');

      expect(http.url).toBe('http://example.com');
    });

    test('exposes the converted configuration', () => {
      const http = new TestHttp('http://example.com', {
        credentials: 'include',
        headers: {
          'X-App': 'test',
        },
      });

      expect(http.config.credentials).toBe('include');

      expect(
        new Headers(http.config.headers).get('X-App'),
      ).toBe('test');
    });

    test('converts token to Authorization header', () => {
      const http = new TestHttp('http://example.com', {
        token: 'my-token',
      });

      expect(
        new Headers(http.config.headers).get('Authorization'),
      ).toBe('Bearer my-token');
    });
  });

  // ─── convertToRequestInit ─────────────────────────────────────────────────

  describe('convertToRequestInit', () => {
    test('returns an empty configuration when no config is provided', () => {
      const result = Http.convertToRequestInit();

      expect(result).toEqual({
        headers: {},
      });
    });

    test('preserves RequestInit properties', () => {
      const result = Http.convertToRequestInit({
        credentials: 'include',
        mode: 'cors',
      });

      expect(result.credentials).toBe('include');
      expect(result.mode).toBe('cors');
    });

    test('preserves existing headers', () => {
      const result = Http.convertToRequestInit({
        headers: {
          'X-App': 'test',
        },
      });

      const headers = new Headers(result.headers);

      expect(headers.get('X-App')).toBe('test');
    });

    test('adds Authorization header when token is provided', () => {
      const result = Http.convertToRequestInit({
        token: 'abc123',
      });

      const headers = new Headers(result.headers);

      expect(
        headers.get('Authorization'),
      ).toBe('Bearer abc123');
    });

    test('preserves existing headers and adds Authorization', () => {
      const result = Http.convertToRequestInit({
        token: 'abc123',
        headers: {
          'X-App': 'test',
        },
      });

      const headers = new Headers(result.headers);

      expect(headers.get('X-App')).toBe('test');
      expect(
        headers.get('Authorization'),
      ).toBe('Bearer abc123');
    });
  });

  // ─── request ───────────────────────────────────────────────────────────────

  describe('request', () => {
    test('sends a GET request', async () => {
      const response = {
        success: true,
      };

      mockOkResponse(response);

      const result = await Http.request<typeof response>({
        baseUrl: 'http://api.test',
        path: 'users',
        method: 'GET',
      });

      const [url, config] = mockFetch.mock.calls[0];

      expect(url).toBe('http://api.test/users');
      expect(config?.method).toBe('GET');
      expect(result).toEqual(response);
    });

    test('uses httpConfig', async () => {
      mockOkResponse({
        success: true,
      });

      await Http.request({
        baseUrl: 'http://api.test',
        path: 'users',
        method: 'GET',
        httpConfig: {
          token: 'token-123',
        },
      });

      const [, config] = mockFetch.mock.calls[0];

      const headers = new Headers(config?.headers);

      expect(
        headers.get('Authorization'),
      ).toBe('Bearer token-123');
    });

    test('uses token from requestConfig', async () => {
      mockOkResponse({
        success: true,
      });

      await Http.request({
        baseUrl: 'http://api.test',
        path: 'users',
        method: 'GET',
        requestConfig: {
          token: 'token-321',
        },
      });

      const [, config] = mockFetch.mock.calls[0];

      const headers = new Headers(config?.headers);

      expect(
        headers.get('Authorization'),
      ).toBe('Bearer token-321');
    });

    test('request token overrides httpConfig token', async () => {
      mockOkResponse({
        success: true,
      });

      await Http.request({
        baseUrl: 'http://api.test',
        path: 'users',
        method: 'GET',
        httpConfig: {
          token: 'token-http',
        },
        requestConfig: {
          token: 'token-request',
        },
      });

      const [, config] = mockFetch.mock.calls[0];

      const headers = new Headers(config?.headers);

      expect(
        headers.get('Authorization'),
      ).toBe('Bearer token-request');
    });

    test('sends query parameters', async () => {
      mockOkResponse([]);

      await Http.request({
        baseUrl: 'http://api.test',
        path: 'users',
        method: 'GET',
        requestConfig: {
          params: {
            page: 1,
            limit: 10,
          },
        },
      });

      const [url] = mockFetch.mock.calls[0];

      expect(url).toContain('page=1');
      expect(url).toContain('limit=10');
    });

    test('merges http headers with request headers', async () => {
      mockOkResponse({
        success: true,
      });

      await Http.request({
        baseUrl: 'http://api.test',
        path: 'users',
        method: 'GET',
        httpConfig: {
          headers: {
            'X-App': 'app',
          },
        },
        requestConfig: {
          override: {
            headers: {
              'X-Request': 'request',
            },
          },
        },
      });

      const [, config] = mockFetch.mock.calls[0];

      const headers = new Headers(config?.headers);

      expect(headers.get('X-App')).toBe('app');
      expect(headers.get('X-Request')).toBe('request');
    });

    test('does not send a body when body is undefined', async () => {
      mockOkResponse({
        success: true,
      });

      await Http.request({
        baseUrl: 'http://api.test',
        path: 'users',
        method: 'GET',
      });

      const [, config] = mockFetch.mock.calls[0];

      expect(config?.body).toBeUndefined();
    });

    test('does not send a body when body is null', async () => {
      mockOkResponse({
        success: true,
      });

      await Http.request({
        baseUrl: 'http://api.test',
        path: 'users',
        method: 'POST',
        requestConfig: {
          body: null,
        },
      });

      const [, config] = mockFetch.mock.calls[0];

      expect(config?.body).toBeUndefined();
    });

    test('serializes an object body as JSON', async () => {
      const body = {
        username: 'john.doe',
        password: 'password',
      };

      mockOkResponse({
        created: true,
      });

      await Http.request({
        baseUrl: 'http://api.test',
        path: 'users',
        method: 'POST',
        requestConfig: {
          body,
        },
      });

      const [, config] = mockFetch.mock.calls[0];

      expect(config?.body).toBe(
        JSON.stringify(body),
      );
    });

    test('configures JSON content-type for JSON body', async () => {
      mockOkResponse({
        created: true,
      });

      await Http.request({
        baseUrl: 'http://api.test',
        path: 'users',
        method: 'POST',
        requestConfig: {
          body: {
            name: 'John',
          },
        },
      });

      const [, config] = mockFetch.mock.calls[0];

      const headers = new Headers(config?.headers);

      expect(
        headers.get('content-type'),
      ).toContain('application/json');
    });

    test('preserves an explicitly configured content-type', async () => {
      mockOkResponse({
        created: true,
      });

      await Http.request({
        baseUrl: 'http://api.test',
        path: 'users',
        method: 'POST',
        requestConfig: {
          body: {
            name: 'John',
          },
          override: {
            headers: {
              'Content-Type': 'application/custom',
            },
          },
        },
      });

      const [, config] = mockFetch.mock.calls[0];

      const headers = new Headers(config?.headers);

      expect(
        headers.get('content-type'),
      ).toBe('application/custom');
    });

    test('sends FormData without serializing it', async () => {
      const formData = new FormData();

      formData.append('name', 'John');

      mockOkResponse({
        created: true,
      });

      await Http.request({
        baseUrl: 'http://api.test',
        path: 'users',
        method: 'POST',
        requestConfig: {
          body: formData,
        },
      });

      const [, config] = mockFetch.mock.calls[0];

      expect(config?.body).toBe(formData);
    });

    test('removes content-type for FormData', async () => {
      const formData = new FormData();

      formData.append('name', 'John');

      mockOkResponse({
        created: true,
      });

      await Http.request({
        baseUrl: 'http://api.test',
        path: 'users',
        method: 'POST',
        requestConfig: {
          body: formData,
          override: {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        },
      });

      const [, config] = mockFetch.mock.calls[0];

      const headers = new Headers(config?.headers);

      expect(
        headers.has('content-type'),
      ).toBeFalsy();
    });

    test('sends Blob without serializing it', async () => {
      const blob = new Blob(['hello']);

      mockOkResponse({
        created: true,
      });

      await Http.request({
        baseUrl: 'http://api.test',
        path: 'files',
        method: 'POST',
        requestConfig: {
          body: blob,
        },
      });

      const [, config] = mockFetch.mock.calls[0];

      expect(config?.body).toBe(blob);
    });

    test('uses Blob type as content-type', async () => {
      const blob = new Blob(
        ['hello'],
        {
          type: 'text/plain',
        },
      );

      mockOkResponse({
        created: true,
      });

      await Http.request({
        baseUrl: 'http://api.test',
        path: 'files',
        method: 'POST',
        requestConfig: {
          body: blob,
        },
      });

      const [, config] = mockFetch.mock.calls[0];

      const headers = new Headers(config?.headers);

      expect(
        headers.get('content-type'),
      ).toBe('text/plain');
    });

    test('uses JSON content-type when Blob has no type', async () => {
      const blob = new Blob(['hello']);

      mockOkResponse({
        created: true,
      });

      await Http.request({
        baseUrl: 'http://api.test',
        path: 'files',
        method: 'POST',
        requestConfig: {
          body: blob,
        },
      });

      const [, config] = mockFetch.mock.calls[0];

      const headers = new Headers(config?.headers);

      expect(
        headers.get('content-type'),
      ).toContain('application/json');
    });

    test('sends ArrayBuffer without serializing it', async () => {
      const buffer = new ArrayBuffer(8);

      mockOkResponse({
        success: true,
      });

      await Http.request({
        baseUrl: 'http://api.test',
        path: 'files',
        method: 'POST',
        requestConfig: {
          body: buffer,
        },
      });

      const [, config] = mockFetch.mock.calls[0];

      expect(config?.body).toBe(buffer);
    });

    test('preserves RequestInit configuration', async () => {
      mockOkResponse({
        success: true,
      });

      await Http.request({
        baseUrl: 'http://api.test',
        path: 'users',
        method: 'GET',
        httpConfig: {
          credentials: 'include',
          mode: 'cors',
        },
      });

      const [, config] = mockFetch.mock.calls[0];

      expect(config?.credentials).toBe('include');
      expect(config?.mode).toBe('cors');
    });
  });

  // ─── Successful response ──────────────────────────────────────────────────

  describe('successful response', () => {
    test('returns parsed JSON response', async () => {
      const response = {
        id: '1',
        name: 'John',
      };

      mockOkResponse(response);

      const result = await Http.request<typeof response>({
        baseUrl: 'http://api.test',
        path: 'users/1',
        method: 'GET',
      });

      expect(result).toEqual(response);
    });

    test('returns undefined for an empty response', async () => {
      mockEmptyResponse();

      const result = await Http.request({
        baseUrl: 'http://api.test',
        path: 'users/1',
        method: 'DELETE',
      });

      expect(result).toBeUndefined();
    });

    test('handles a whitespace-only response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve('   '),
      } as Response);

      const result = await Http.request({
        baseUrl: 'http://api.test',
        path: 'users/1',
        method: 'GET',
      });

      expect(result).toBeUndefined();
    });
  });

  // ─── Error handling ────────────────────────────────────────────────────────

  describe('error handling', () => {
    describe('ResponseError', () => {
      test('handles a valid ResponseError', async () => {
        mockErrorResponse(
          {
            error: 'ValidationError',
            message: 'Invalid user data',
            statusCode: 422,
          },
          422,
        );

        await expect(
          Http.request({
            baseUrl: 'http://api.test',
            path: 'users/1',
            method: 'GET',
          }),
        ).rejects.toEqual({
          error: 'ValidationError',
          message: 'Invalid user data',
          statusCode: 422,
        });
      });

      test('rejects ResponseError when error is not a string', async () => {
        mockErrorResponse(
          {
            error: 123,
            message: 'Invalid user data',
            statusCode: 422,
          },
          422,
        );

        await expect(
          Http.request({
            baseUrl: 'http://api.test',
            path: 'users/1',
            method: 'GET',
          }),
        ).rejects.toEqual({
          error: 'HttpError',
          message: 'An unexpected error occurred.',
          statusCode: 422,
        });
      });

      test('rejects ResponseError when message is not a string', async () => {
        mockErrorResponse(
          {
            error: 'ValidationError',
            message: 123,
            statusCode: 422,
          },
          422,
        );

        await expect(
          Http.request({
            baseUrl: 'http://api.test',
            path: 'users/1',
            method: 'GET',
          }),
        ).rejects.toEqual({
          error: 'HttpError',
          message: 'An unexpected error occurred.',
          statusCode: 422,
        });
      });

      test('rejects ResponseError when statusCode is not a number', async () => {
        mockErrorResponse(
          {
            error: 'ValidationError',
            message: 'Invalid user data',
            statusCode: '422',
          },
          422,
        );

        await expect(
          Http.request({
            baseUrl: 'http://api.test',
            path: 'users/1',
            method: 'GET',
          }),
        ).rejects.toEqual({
          error: 'HttpError',
          message: 'An unexpected error occurred.',
          statusCode: 422,
        });
      });

      test('rejects ResponseError when response is not an object', async () => {
        mockErrorResponse(
          'invalid response',
          422,
        );

        await expect(
          Http.request({
            baseUrl: 'http://api.test',
            path: 'users/1',
            method: 'GET',
          }),
        ).rejects.toEqual({
          error: 'HttpError',
          message: 'An unexpected error occurred.',
          statusCode: 422,
        });
      });

      test('rejects incomplete ResponseError', async () => {
        mockErrorResponse(
          {
            error: 'ValidationError',
            message: 'Invalid user data',
          },
          422,
        );

        await expect(
          Http.request({
            baseUrl: 'http://api.test',
            path: 'users/1',
            method: 'GET',
          }),
        ).rejects.toEqual({
          error: 'HttpError',
          message: 'An unexpected error occurred.',
          statusCode: 422,
        });
      });
    });

    describe('FastApiErrorResponse', () => {
      test('handles a FastAPI error response', async () => {
        mockErrorResponse(
          {
            detail: 'User not found',
          },
          404,
        );

        await expect(
          Http.request({
            baseUrl: 'http://api.test',
            path: 'users/1',
            method: 'GET',
          }),
        ).rejects.toEqual({
          error: 'FastApiError',
          message: 'User not found',
          statusCode: 404,
        });
      });

      test('rejects FastAPI error when detail is not a string', async () => {
        mockErrorResponse(
          {
            detail: 404,
          },
          404,
        );

        await expect(
          Http.request({
            baseUrl: 'http://api.test',
            path: 'users/1',
            method: 'GET',
          }),
        ).rejects.toEqual({
          error: 'HttpError',
          message: 'An unexpected error occurred.',
          statusCode: 404,
        });
      });

      test('rejects response without detail', async () => {
        mockErrorResponse(
          {
            message: 'User not found',
          },
          404,
        );

        await expect(
          Http.request({
            baseUrl: 'http://api.test',
            path: 'users/1',
            method: 'GET',
          }),
        ).rejects.toEqual({
          error: 'HttpError',
          message: 'An unexpected error occurred.',
          statusCode: 404,
        });
      });

      test('accepts an empty detail', async () => {
        mockErrorResponse(
          {
            detail: '',
          },
          400,
        );

        await expect(
          Http.request({
            baseUrl: 'http://api.test',
            path: 'users/1',
            method: 'GET',
          }),
        ).rejects.toEqual({
          error: 'FastApiError',
          message: '',
          statusCode: 400,
        });
      });
    });

    test('handles an unexpected HTTP error', async () => {
      mockErrorResponse(
        {
          unexpected: true,
        },
        500,
      );

      await expect(
        Http.request({
          baseUrl: 'http://api.test',
          path: 'users',
          method: 'GET',
        }),
      ).rejects.toEqual({
        error: 'HttpError',
        message: 'An unexpected error occurred.',
        statusCode: 500,
      });
    });

    test('handles a generic Error', async () => {
      mockFetch.mockRejectedValueOnce(
        new Error('Network error'),
      );

      await expect(
        Http.request({
          baseUrl: 'http://api.test',
          path: 'users',
          method: 'GET',
        }),
      ).rejects.toEqual({
        error: 'Error',
        message: 'Network error',
        statusCode: 500,
      });
    });

    test('handles an unknown error', async () => {
      mockFetch.mockRejectedValueOnce(
        'Something went wrong',
      );

      await expect(
        Http.request({
          baseUrl: 'http://api.test',
          path: 'users',
          method: 'GET',
        }),
      ).rejects.toEqual({
        error: 'Internal Server Error',
        message: 'Internal Server Error',
        statusCode: 500,
      });
    });

    test('handles an invalid JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve('{ invalid json }'),
      } as Response);

      await expect(
        Http.request({
          baseUrl: 'http://api.test',
          path: 'users',
          method: 'GET',
        }),
      ).rejects.toEqual({
        error: 'SyntaxError',
        message: expect.any(String),
        statusCode: 500,
      });
    });
  });
});