import { jest } from '@jest/globals';

import { Mapper, Result, type TPaginatedListResponse } from '../../../src';

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

class UserMapper extends Mapper<UserApiData, User> {
  public toDomain(data: UserApiData): User {
    const createdAt = new Date(data.created_at);

    if (Number.isNaN(createdAt.getTime())) {
      throw new Error(`Invalid user created_at: ${data.created_at}`);
    }

    return { id: data.id, name: data.name.toUpperCase(), createdAt };
  }

  public toJson(data: User): UserApiData {
    return {
      id: data.id,
      name: data.name.toLowerCase(),
      created_at: data.createdAt.toISOString(),
    };
  }
}

class IdentityMapper extends Mapper<UserApiData, UserApiData> {
  public toDomain(data: UserApiData): UserApiData {
    return data;
  }

  public toJson(data: UserApiData): UserApiData {
    return data;
  }
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

describe('Mapper', () => {
  describe('toDomain', () => {
    test('is implemented by the subclass', () => {
      expect(new UserMapper().toDomain(apiUser)).toEqual(user);
    });

    test('lets the subclass reject an invalid payload by throwing', () => {
      expect(() => new UserMapper().toDomain({ ...apiUser, created_at: 'invalid' }))
        .toThrow('Invalid user created_at: invalid');
    });
  });

  describe('toJson', () => {
    test('is implemented by the subclass', () => {
      expect(new UserMapper().toJson(user)).toEqual(apiUser);
    });
  });

  describe('apiDataToJson', () => {
    test('round-trips a payload through the domain model', () => {
      expect(new UserMapper().apiDataToJson({ ...apiUser, name: 'John' })).toEqual({
        ...apiUser,
        name: 'john',
      });
    });
  });

  describe('mapJsonResult', () => {
    test('converts a successful item result', () => {
      const result = new UserMapper().mapJsonResult(Result.ok(apiUser));

      expect(result.isOk).toBeTruthy();
      expect(result.instance).toEqual(user);
    });

    test('propagates the failure without converting', () => {
      const failed = Result.fail<UserApiData>('request failed');
      const result = new UserMapper().mapJsonResult(failed);

      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toEqual(failed.errors);
    });

    test('turns a throwing conversion into a failed result', () => {
      const result = new UserMapper().mapJsonResult(Result.ok({ ...apiUser, created_at: 'invalid' }));

      expect(result.isFailure).toBeTruthy();
      expect(result.error).toBe('Invalid user created_at: invalid');
    });
  });

  describe('mapJsonListResult', () => {
    test('converts a plain array', () => {
      const result = new UserMapper().mapJsonListResult(Result.ok([apiUser]));

      expect(result.isOk).toBeTruthy();
      expect(result.instance).toEqual([user]);
    });

    test('converts a paginated response and keeps the meta', () => {
      const result = new UserMapper().mapJsonListResult(Result.ok(paginated));

      expect(result.instance).toEqual({ items: [user], meta: paginated.meta });
    });

    test('returns an empty list as an empty list', () => {
      const result = new UserMapper().mapJsonListResult(Result.ok([]));

      expect(result.instance).toEqual([]);
    });

    test('propagates the failure without converting', () => {
      const failed = Result.fail<Array<UserApiData>>('request failed');
      const result = new UserMapper().mapJsonListResult(failed);

      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toEqual(failed.errors);
    });
  });

  describe('mapApiResult', () => {
    test('normalizes a payload that is already in the api shape', () => {
      const result = new UserMapper().mapApiResult(Result.ok({ ...apiUser, name: 'John' }));

      expect(result.instance).toEqual({ ...apiUser, name: 'john' });
    });

    test('propagates the failure without converting', () => {
      const result = new UserMapper().mapApiResult(Result.fail<UserApiData>('request failed'));

      expect(result.isFailure).toBeTruthy();
      expect(result.errors).toEqual(['request failed']);
    });
  });

  describe('mapApiListResult', () => {
    test('normalizes a plain array', () => {
      const result = new UserMapper().mapApiListResult(Result.ok([{ ...apiUser, name: 'John' }]));

      expect(result.instance).toEqual([apiUser]);
    });

    test('normalizes a paginated response and keeps the meta', () => {
      const result = new UserMapper().mapApiListResult(
        Result.ok({ ...paginated, items: [{ ...apiUser, name: 'John' }] }),
      );

      expect(result.instance).toEqual(paginated);
    });
  });

  describe('when the subclass does not need conversion', () => {
    test('returns the same payload from every entry point', () => {
      const mapper = new IdentityMapper();

      expect(mapper.mapJsonResult(Result.ok(apiUser)).instance).toEqual(apiUser);
      expect(mapper.mapJsonListResult(Result.ok([apiUser])).instance).toEqual([apiUser]);
      expect(mapper.mapApiResult(Result.ok(apiUser)).instance).toEqual(apiUser);
    });
  });

  describe('shared helpers', () => {
    test('do not call toDomain more than once per item', () => {
      const spy = jest.spyOn(UserMapper.prototype, 'toDomain');

      new UserMapper().mapJsonListResult(Result.ok([apiUser, { ...apiUser, id: '2' }]));

      expect(spy).toHaveBeenCalledTimes(2);
      spy.mockRestore();
    });
  });
});