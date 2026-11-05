import { jest } from '@jest/globals';
import { Crud, Result, HttpClient, type TPaginatedListResponse  } from '../../../src';

// ─── Types ───────────────────────────────────────────────────────────────────

type User = {
  id: string;
  name: string;
  email: string;
};

type CreateUser = {
  name: string;
  email: string;
};

type UpdateUser = {
  name?: string;
  email?: string;
};

// ─── Concrete subclass ───────────────────────────────────────────────────────

class TestCrud extends Crud<
  User,
  CreateUser,
  UpdateUser
> {
  constructor(
    baseUrl = 'http://api.test',
    pathUrl = '/users',
    token?: string,
  ) {
    super(baseUrl, pathUrl, token);
  }
}

// ─── Fetch mock ──────────────────────────────────────────────────────────────

const mockFetch = jest.fn<typeof fetch>();

beforeAll(() => {
  global.fetch = mockFetch;
});

afterEach(() => {
  mockFetch.mockReset();
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mockOkResponse(
  body: unknown,
  status = 200,
): void {
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
): void {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status,
    text: () => Promise.resolve(JSON.stringify(body)),
  } as Response);
}

// ─────────────────────────────────────────────────────────────────────────────
describe('Crud', () => {
  // ─── Constructor ───────────────────────────────────────────────────────────

  describe('constructor', () => {
    test('uses the provided base url', async () => {
      mockOkResponse([]);

      const crud = new TestCrud(
        'http://example.com/api',
        '/users',
      );

      await crud.list();

      const [url] = mockFetch.mock.calls[0];

      expect(url).toBe(
        'http://example.com/api/users',
      );
    });

    test('uses the provided path url', async () => {
      mockOkResponse([]);

      const crud = new TestCrud(
        'http://api.test',
        '/customers',
      );

      await crud.list();

      const [url] = mockFetch.mock.calls[0];

      expect(url).toBe(
        'http://api.test/customers',
      );
    });

    test('converts token to Authorization header', async () => {
      mockOkResponse([]);

      const crud = new TestCrud(
        'http://api.test',
        '/users',
        'my-token',
      );

      await crud.list();

      const [, config] = mockFetch.mock.calls[0];

      const headers = new Headers(config?.headers);

      expect(
        headers.get('Authorization'),
      ).toBe('Bearer my-token');
    });
  });

  // ─── list ──────────────────────────────────────────────────────────────────

  describe('list', () => {
    test('returns Result with a list of entities', async () => {
      const users: User[] = [
        {
          id: '1',
          name: 'John',
          email: 'john@example.com',
        },
        {
          id: '2',
          name: 'Jane',
          email: 'jane@example.com',
        },
      ];

      mockOkResponse(users);

      const crud = new TestCrud();

      const result = await crud.list();

      expect(result).toBeInstanceOf(Result);
      expect(result.isOk).toBeTruthy();
      expect(result.instance).toEqual(users);
    });

    test('uses the resource path', async () => {
      mockOkResponse([]);

      const crud = new TestCrud();

      await crud.list();

      const [url, config] = mockFetch.mock.calls[0];

      expect(url).toBe(
        'http://api.test/users',
      );

      expect(config?.method).toBe('GET');
    });

    test('sends filters as query parameters', async () => {
      mockOkResponse([]);

      const crud = new TestCrud();

      await crud.list({
        name: 'John',
        active: true,
        page: 2,
      });

      const [url] = mockFetch.mock.calls[0];

      expect(url).toContain('name=John');
      expect(url).toContain('active=true');
      expect(url).toContain('page=2');
    });

    test('returns Result failure when request fails', async () => {
      mockErrorResponse(
        {
          error: 'ValidationError',
          message: 'Invalid request',
          statusCode: 400,
        },
        400,
      );

      const crud = new TestCrud();

      const result = await crud.list();

      expect(result).toBeInstanceOf(Result);
      expect(result.isFailure).toBeTruthy();
    });
  });

  // ─── listPaginate ──────────────────────────────────────────────────────────

  describe('listPaginate', () => {
    test('returns paginated Result', async () => {
      const response: TPaginatedListResponse<User> = {
        items: [
          {
            id: '1',
            name: 'John',
            email: 'john@example.com',
          },
        ],
        meta: {
          total: 1,
          limit: 1,
          offset: 0,
          next_page: undefined,
          previous_page: undefined,
          total_pages: 1,
          current_page: 1
        }
      };

      mockOkResponse(response);

      const crud = new TestCrud();

      const result = await crud.listPaginate(1);

      expect(result).toBeInstanceOf(Result);
      expect(result.isOk).toBeTruthy();
      expect(result.instance).toEqual(response);
    });

    test('uses page and default per page', async () => {
      mockOkResponse({
        items: [],
        total: 0,
        page: 2,
        per_page: 12,
      });

      const crud = new TestCrud();

      await crud.listPaginate(2);

      const [url] = mockFetch.mock.calls[0];

      expect(url).toContain('page=2');
      expect(url).toContain('per_page=12');
    });

    test('uses the provided per page', async () => {
      mockOkResponse({
        items: [],
        total: 0,
        page: 2,
        per_page: 25,
      });

      const crud = new TestCrud();

      await crud.listPaginate(
        2,
        undefined,
        25,
      );

      const [url] = mockFetch.mock.calls[0];

      expect(url).toContain('page=2');
      expect(url).toContain('per_page=25');
    });

    test('merges filters with pagination parameters', async () => {
      mockOkResponse({
        items: [],
        total: 0,
        page: 3,
        per_page: 20,
      });

      const crud = new TestCrud();

      await crud.listPaginate(
        3,
        {
          name: 'John',
          active: true,
        },
        20,
      );

      const [url] = mockFetch.mock.calls[0];

      expect(url).toContain('name=John');
      expect(url).toContain('active=true');
      expect(url).toContain('page=3');
      expect(url).toContain('per_page=20');
    });

    test('returns Result failure when request fails', async () => {
      mockErrorResponse(
        {
          error: 'HttpError',
          message: 'Server error',
          statusCode: 500,
        },
        500,
      );

      const crud = new TestCrud();

      const result = await crud.listPaginate(1);

      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toEqual([{
          error: 'HttpError',
          message: 'Server error',
          statusCode: 500,
      }]);
    });
  });

  // ─── detail ────────────────────────────────────────────────────────────────

  describe('detail', () => {
    test('returns the requested entity', async () => {
      const user: User = {
        id: '123',
        name: 'John',
        email: 'john@example.com',
      };

      mockOkResponse(user);

      const crud = new TestCrud();

      const result = await crud.detail('123');

      expect(result.isOk).toBeTruthy();
      expect(result.instance).toEqual(user);
    });

    test('uses the entity identifier in the path', async () => {
      mockOkResponse({
        id: '123',
      });

      const crud = new TestCrud();

      await crud.detail('123');

      const [url, config] = mockFetch.mock.calls[0];

      expect(url).toBe(
        'http://api.test/users/123',
      );

      expect(config?.method).toBe('GET');
    });

    test('sends query parameters', async () => {
      mockOkResponse({
        id: '123',
      });

      const crud = new TestCrud();

      await crud.detail(
        '123',
        {
          include: 'profile',
        },
      );

      const [url] = mockFetch.mock.calls[0];

      expect(url).toContain(
        'include=profile',
      );
    });
  });

  // ─── create ────────────────────────────────────────────────────────────────

  describe('create', () => {
    test('creates an entity', async () => {
      const payload: CreateUser = {
        name: 'John',
        email: 'john@example.com',
      };

      const user: User = {
        id: '123',
        ...payload,
      };

      mockOkResponse(user, 201);

      const crud = new TestCrud();

      const result = await crud.create(payload);

      expect(result.isOk).toBeTruthy();
      expect(result.instance).toEqual(user);
    });

    test('uses POST', async () => {
      mockOkResponse({
        id: '123',
      });

      const crud = new TestCrud();

      await crud.create({
        name: 'John',
        email: 'john@example.com',
      });

      const [, config] = mockFetch.mock.calls[0];

      expect(config?.method).toBe('POST');
    });

    test('sends the payload as JSON', async () => {
      const payload: CreateUser = {
        name: 'John',
        email: 'john@example.com',
      };

      mockOkResponse({
        id: '123',
        ...payload,
      });

      const crud = new TestCrud();

      await crud.create(payload);

      const [, config] = mockFetch.mock.calls[0];

      expect(config?.body).toBe(
        JSON.stringify(payload),
      );
    });

    test('returns Result failure when request fails', async () => {
      mockErrorResponse(
        {
          error: 'ValidationError',
          message: 'Invalid user',
          statusCode: 422,
        },
        422,
      );

      const crud = new TestCrud();

      const result = await crud.create({
        name: '',
        email: '',
      });

      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toEqual([{
        error: 'ValidationError',
        message: 'Invalid user',
        statusCode: 422,
      }]);
    });
  });

  // ─── update ────────────────────────────────────────────────────────────────

  describe('update', () => {
    test('updates an entity', async () => {
      const payload: UpdateUser = {
        name: 'John Updated',
      };

      const user: User = {
        id: '123',
        name: 'John Updated',
        email: 'john@example.com',
      };

      mockOkResponse(user);

      const crud = new TestCrud();

      const result = await crud.update(
        '123',
        payload,
      );

      expect(result.isOk).toBeTruthy();
      expect(result.instance).toEqual(user);
    });

    test('uses PUT', async () => {
      mockOkResponse({
        id: '123',
      });

      const crud = new TestCrud();

      await crud.update(
        '123',
        {
          name: 'John',
        },
      );

      const [, config] = mockFetch.mock.calls[0];

      expect(config?.method).toBe('PUT');
    });

    test('uses the entity identifier in the path', async () => {
      mockOkResponse({
        id: '123',
      });

      const crud = new TestCrud();

      await crud.update(
        '123',
        {
          name: 'John',
        },
      );

      const [url] = mockFetch.mock.calls[0];

      expect(url).toBe(
        'http://api.test/users/123',
      );
    });

    test('sends the payload as JSON', async () => {
      const payload: UpdateUser = {
        name: 'John Updated',
      };

      mockOkResponse({
        id: '123',
        name: 'John Updated',
      });

      const crud = new TestCrud();

      await crud.update(
        '123',
        payload,
      );

      const [, config] = mockFetch.mock.calls[0];

      expect(config?.body).toBe(
        JSON.stringify(payload),
      );
    });

    test('returns Result failure when request fails', async () => {
      mockErrorResponse(
        {
          error: 'NotFoundError',
          message: 'User not found',
          statusCode: 404,
        },
        404,
      );

      const crud = new TestCrud();

      const result = await crud.update(
        '999',
        {
          name: 'John',
        },
      );

      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toEqual([{
        error: 'NotFoundError',
        message: 'User not found',
        statusCode: 404,
      }]);
    });
  });

  // ─── delete ────────────────────────────────────────────────────────────────

  describe('delete', () => {
    test('deletes an entity', async () => {
      mockOkResponse({
        deleted: true,
      });

      const crud = new TestCrud();

      const result = await crud.delete<{
        deleted: boolean;
      }>('123');

      expect(result.isOk).toBeTruthy();
      expect(result.instance).toEqual({
        deleted: true,
      });
    });

    test('uses DELETE', async () => {
      mockEmptyResponse();

      const crud = new TestCrud();

      await crud.delete<void>('123');

      const [, config] = mockFetch.mock.calls[0];

      expect(config?.method).toBe('DELETE');
    });

    test('uses the entity identifier in the path', async () => {
      mockEmptyResponse();

      const crud = new TestCrud();

      await crud.delete<void>('123');

      const [url] = mockFetch.mock.calls[0];

      expect(url).toBe(
        'http://api.test/users/123',
      );
    });

    test('returns Result with null instance for empty response', async () => {
      mockEmptyResponse();

      const crud = new TestCrud();

      const result = await crud.delete<void>('123');

      expect(result.isOk).toBeTruthy();
      expect(result.instance).toBeNull();
    });

    test('returns Result failure when request fails', async () => {
      mockErrorResponse(
        {
          error: 'NotFoundError',
          message: 'User not found',
          statusCode: 404,
        },
        404,
      );

      const crud = new TestCrud();

      const result = await crud.delete<void>('999');

      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toEqual([{
        error: 'NotFoundError',
        message: 'User not found',
        statusCode: 404,
      }]);
    });
  });
});