import { jest } from '@jest/globals';

import {
  CrudService,
  Result,
  type TPaginatedListResponse,
  type TCrudList,
} from '../../../src';

// ─── Types ───────────────────────────────────────────────────────────────────

type UserApiData = {
  id: string;
  name: string;
  created_at: string;
};

type User = {
  id: string;
  name: string;
  createdAt: Date;
};

type UserFilter = {
  name?: string;
  page?: number;
};

type UserPersist = {
  name: string;
};

// ─── Mappers equivalentes aos da feature ─────────────────────────────────────

function toUser(data: UserApiData): User {
  return {
    id: data.id,
    name: data.name.toUpperCase(),
    createdAt: new Date(data.created_at),
  };
}

function mapUserResult(result: Result<UserApiData>): Result<User> {
  if (result.isFailure) {
    return Result.fail(result.errors);
  }

  return Result.try(() => toUser(result.instance));
}

function mapUserListResult(
  result: Result<TCrudList<UserApiData>>,
): Result<TCrudList<User>> {
  if (result.isFailure) {
    return Result.fail(result.errors);
  }

  return Result.try(() => {
    const list = result.instance;

    if (Array.isArray(list)) {
      return list.map(toUser);
    }

    return { ...list, items: list.items.map(toUser) };
  });
}

// ─── Concrete subclasses ─────────────────────────────────────────────────────

class MappedCrud extends CrudService<UserApiData, User, UserFilter, UserPersist> {
  protected readonly baseUrl = '/api';
  protected readonly pathUrl = '/users';

  protected toMapperEntity(result: Result<UserApiData>): Result<User> {
    return mapUserResult(result);
  }

  protected toMapperEntityList(result: Result<TCrudList<UserApiData>>): Result<TCrudList<User>> {
    return mapUserListResult(result);
  }
}

class UnmappedCrud extends CrudService<UserApiData, UserApiData, UserFilter, UserPersist> {
  protected readonly baseUrl = 'http://api.test';
  protected readonly pathUrl = '/users';
}

class ThrowingCrud extends CrudService<UserApiData, User, UserFilter, UserPersist> {
  protected readonly baseUrl = '/api';
  protected readonly pathUrl = '/users';

  protected toMapperEntity(): Result<User> {
    throw new Error('invalid payload');
  }
}

class NormalizingCrud extends CrudService<UserApiData, UserApiData, UserFilter, UserPersist> {
  protected readonly baseUrl = 'http://api.test';
  protected readonly pathUrl = '/users';

  protected toParams(filters?: UserFilter): Record<string, unknown> | undefined {
    if (filters === undefined) {
      return undefined;
    }

    return { ...filters, limit: 10 };
  }

  protected toBody(data: UserPersist): unknown {
    return { ...data, name: data.name.trim() };
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

function mockOkResponse(body: unknown, status = 200): void {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    status,
    text: () => Promise.resolve(JSON.stringify(body)),
  } as Response);
}

function mockErrorResponse(body: unknown, status = 400): void {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status,
    text: () => Promise.resolve(JSON.stringify(body)),
  } as Response);
}

const apiUser: UserApiData = {
  id: '1',
  name: 'john',
  created_at: '2024-01-01T00:00:00.000Z',
};

const user: User = {
  id: '1',
  name: 'JOHN',
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
};

const paginated: TPaginatedListResponse<UserApiData> = {
  items: [apiUser],
  meta: {
    total: 1,
    limit: 10,
    offset: 0,
    total_pages: 1,
    current_page: 1,
  },
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('CrudService', () => {
  describe('fetchList', () => {
    test('delegates a plain array to toMapperEntityList', async () => {
      mockOkResponse([apiUser]);

      const result = await new MappedCrud().fetchList();

      expect(result.isOk).toBeTruthy();
      expect(result.instance).toEqual([user]);
    });

    test('delegates a paginated response to toMapperEntityList and keeps the meta', async () => {
      mockOkResponse(paginated);

      const result = await new MappedCrud().fetchList();

      expect(result.isOk).toBeTruthy();
      expect(result.instance).toEqual({ items: [user], meta: paginated.meta });
    });

    test('returns the raw api payload when the list hook is not overridden', async () => {
      mockOkResponse([apiUser]);

      const result = await new UnmappedCrud().fetchList();

      expect(result.instance).toEqual([apiUser]);
    });

    test('sends the filters as query parameters', async () => {
      mockOkResponse([]);

      await new MappedCrud().fetchList({ name: 'john', page: 2 });

      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain('name=john');
      expect(url).toContain('page=2');
    });

    test('uses the configured base url and path', async () => {
      mockOkResponse([]);

      await new UnmappedCrud().fetchList();

      const [url, config] = mockFetch.mock.calls[0];
      expect(url).toBe('http://api.test/users');
      expect(config?.method).toBe('GET');
    });

    test('sends the token as a bearer header when provided', async () => {
      mockOkResponse([]);

      await new MappedCrud().fetchList(undefined, 'session-token');

      const [, config] = mockFetch.mock.calls[0];
      expect(new Headers(config?.headers).get('Authorization')).toBe('Bearer session-token');
    });

    test('omits the Authorization header when no token is provided', async () => {
      mockOkResponse([]);

      await new MappedCrud().fetchList();

      const [, config] = mockFetch.mock.calls[0];
      expect(new Headers(config?.headers).get('Authorization')).toBeNull();
    });

    test('propagates the api error without converting', async () => {
      mockErrorResponse({ error: 'HttpError', message: 'Server error', statusCode: 500 }, 500);

      const result = await new ThrowingCrud().fetchList();

      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toEqual([{ error: 'HttpError', message: 'Server error', statusCode: 500 }]);
    });

    test('returns a failure when the list conversion throws', async () => {
      class BrokenListCrud extends CrudService<UserApiData, User, UserFilter, UserPersist> {
        protected readonly baseUrl = '/api';
        protected readonly pathUrl = '/users';

        protected toMapperEntityList(): Result<TCrudList<User>> {
          throw new Error('invalid payload');
        }
      }

      mockOkResponse([apiUser]);

      const result = await new BrokenListCrud().fetchList();

      expect(result.isFailure).toBeTruthy();
      expect(result.error).toBe('invalid payload');
    });

    test('lets a subclass normalize the filters', async () => {
      mockOkResponse([]);

      await new NormalizingCrud().fetchList({ name: 'john' });

      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain('name=john');
      expect(url).toContain('limit=10');
    });
  });

  describe('listPaginate', () => {
    test('delegates the paginated response to toMapperEntityList', async () => {
      mockOkResponse(paginated);

      const result = await new MappedCrud().listPaginate(1);

      expect(result.isOk).toBeTruthy();
      expect(result.instance).toEqual({ items: [user], meta: paginated.meta });
    });

    test('sends page and the default per page as limit', async () => {
      mockOkResponse(paginated);

      await new MappedCrud().listPaginate(2);

      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain('page=2');
      expect(url).toContain('limit=12');
    });

    test('uses the provided per page', async () => {
      mockOkResponse(paginated);

      await new MappedCrud().listPaginate(2, undefined, 25);

      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain('limit=25');
    });

    test('merges the filters with the pagination parameters', async () => {
      mockOkResponse(paginated);

      await new MappedCrud().listPaginate(3, { name: 'john' }, 20);

      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain('name=john');
      expect(url).toContain('page=3');
      expect(url).toContain('limit=20');
    });

    test('sends the token when provided', async () => {
      mockOkResponse(paginated);

      await new MappedCrud().listPaginate(1, undefined, 12, 'session-token');

      const [, config] = mockFetch.mock.calls[0];
      expect(new Headers(config?.headers).get('Authorization')).toBe('Bearer session-token');
    });

    test('returns the raw payload when the list hook is not overridden', async () => {
      mockOkResponse(paginated);

      const result = await new UnmappedCrud().listPaginate(1);

      expect(result.instance).toEqual(paginated);
    });

    test('returns a failure when the api rejects the request', async () => {
      mockErrorResponse({ error: 'HttpError', message: 'Server error', statusCode: 500 }, 500);

      const result = await new MappedCrud().listPaginate(1);

      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toEqual([{ error: 'HttpError', message: 'Server error', statusCode: 500 }]);
    });
  });

  describe('fetchById', () => {
    test('delegates the result to toMapperEntity', async () => {
      mockOkResponse(apiUser);

      const result = await new MappedCrud().fetchById('1','session-token');

      expect(result.instance).toEqual(user);
    });

    test('uses the identifier in the path', async () => {
      mockOkResponse(apiUser);

      await new MappedCrud().fetchById('42');

      const [url] = mockFetch.mock.calls[0];
      expect(url).toBe('/api/users/42');
    });
  });

  describe('create', () => {
    test('delegates the result to toMapperEntity', async () => {
      mockOkResponse(apiUser, 201);

      const result = await new MappedCrud().create({ name: 'john' });

      expect(result.instance.name).toBe('JOHN');
    });

    test('uses POST on the resource path', async () => {
      mockOkResponse(apiUser, 201);

      await new MappedCrud().create({ name: 'john' });

      const [url, config] = mockFetch.mock.calls[0];
      expect(url).toBe('/api/users');
      expect(config?.method).toBe('POST');
    });

    test('sends the payload as JSON', async () => {
      mockOkResponse(apiUser, 201);

      await new MappedCrud().create({ name: 'john' });

      const [, config] = mockFetch.mock.calls[0];
      expect(config?.body).toBe(JSON.stringify({ name: 'john' }));
    });

    test('lets a subclass normalize the body', async () => {
      mockOkResponse(apiUser, 201);

      await new NormalizingCrud().create({ name: '  john  ' });

      const [, config] = mockFetch.mock.calls[0];
      expect(config?.body).toBe(JSON.stringify({ name: 'john' }));
    });

    test('sends the token when provided', async () => {
      mockOkResponse(apiUser, 201);

      await new MappedCrud().create({ name: 'john' }, 'session-token');

      const [, config] = mockFetch.mock.calls[0];
      expect(new Headers(config?.headers).get('Authorization')).toBe('Bearer session-token');
    });

    test('returns a failure when the conversion throws', async () => {
      mockOkResponse(apiUser, 201);

      const result = await new ThrowingCrud().create({ name: 'john' });

      expect(result.isFailure).toBeTruthy();
      expect(result.error).toBe('invalid payload');
    });
  });

  describe('update', () => {
    test('returns the message from the api', async () => {
      mockOkResponse({ message: 'updated' });

      const result = await new MappedCrud().update('1', { name: 'john' }, 'session-token');

      expect(result.instance).toEqual({ message: 'updated' });
    });

    test('uses PUT on the identifier path', async () => {
      mockOkResponse({ message: 'updated' });

      await new MappedCrud().update('1', { name: 'john' });

      const [url, config] = mockFetch.mock.calls[0];
      expect(url).toBe('/api/users/1');
      expect(config?.method).toBe('PUT');
    });

    test('returns a failure when the api rejects the update', async () => {
      mockErrorResponse({ error: 'NotFoundError', message: 'Not found', statusCode: 404 }, 404);

      const result = await new MappedCrud().update('999', { name: 'john' });

      expect(result.isFailure).toBeTruthy();
    });
  });

  describe('delete', () => {
    test('returns the message from the api', async () => {
      mockOkResponse({ message: 'deleted' });

      const result = await new MappedCrud().delete('1', 'session-token');

      expect(result.instance).toEqual({ message: 'deleted' });
    });

    test('uses DELETE on the identifier path', async () => {
      mockOkResponse({ message: 'deleted' });

      await new MappedCrud().delete('1');

      const [url, config] = mockFetch.mock.calls[0];
      expect(url).toBe('/api/users/1');
      expect(config?.method).toBe('DELETE');
    });

    test('returns a failure when the api rejects the delete', async () => {
      mockErrorResponse({ error: 'NotFoundError', message: 'Not found', statusCode: 404 }, 404);

      const result = await new MappedCrud().delete('999');

      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toEqual([{ error: 'NotFoundError', message: 'Not found', statusCode: 404 }]);
    });
  });
});