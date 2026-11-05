import { HttpClient, Result, Token } from '@fintech/shared';

import {
  getAuthenticatedUser,
  getAuthenticatedUserBootstrap,
} from '../server';

describe('authenticated user server helpers', () => {
  const get = jest.spyOn(HttpClient, 'get');

  afterEach(() => jest.resetAllMocks());

  it('does not request the current user without a token', async () => {
    await expect(getAuthenticatedUser()).resolves.toBeUndefined();
    expect(get).not.toHaveBeenCalled();
  });

  it('requests the current user with an access token', async () => {
    const user = { id: 'user-1', name: 'Example' };
    get.mockResolvedValueOnce(Result.ok(user));

    await expect(getAuthenticatedUser('access-token')).resolves.toEqual(user);
    expect(get).toHaveBeenCalledWith({
      path: '/auth/me',
      baseUrl: expect.any(String),
      config: { token: 'access-token' },
    });
  });

  it('returns undefined when the current-user request fails or has no data', async () => {
    get
      .mockResolvedValueOnce(Result.fail('Unauthorized'))
      .mockResolvedValueOnce(Result.ok(undefined));

    await expect(getAuthenticatedUser('access-token')).resolves.toBeUndefined();
    await expect(getAuthenticatedUser('access-token')).resolves.toBeUndefined();
  });

  it('skips bootstrap when unauthenticated or when the token is invalid', async () => {
    await expect(getAuthenticatedUserBootstrap(false, 'invalid')).resolves.toEqual({
      initialUser: undefined,
      tokenExpiresAt: undefined,
    });
    await expect(getAuthenticatedUserBootstrap(true, 'invalid')).resolves.toEqual({
      initialUser: undefined,
      tokenExpiresAt: undefined,
    });
    expect(get).not.toHaveBeenCalled();
  });

  it('returns expiration metadata without requesting an expired session', async () => {
    const token = Token.generate({ seconds: -1, signature: 'signature' });

    const bootstrap = await getAuthenticatedUserBootstrap(true, token);

    expect(bootstrap.initialUser).toBeUndefined();
    expect(bootstrap.tokenExpiresAt).toBeLessThanOrEqual(Date.now());
    expect(get).not.toHaveBeenCalled();
  });

  it('includes the current user and expiration time for valid sessions', async () => {
    const token = Token.generate({ seconds: 60, signature: 'signature' });
    const user = { id: 'user-1', name: 'Example' };
    get.mockResolvedValueOnce(Result.ok(user));

    await expect(getAuthenticatedUserBootstrap(true, token)).resolves.toEqual({
      initialUser: user,
      tokenExpiresAt: expect.any(Number),
    });
  });
});
