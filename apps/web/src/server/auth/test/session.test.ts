import { cookies } from 'next/headers';
import { Token } from '@fintech/shared';

import {
  clearAuthCookie,
  getServerSession,
  setAuthCookie,
} from '../session';
import { AUTH_COOKIE_NAME, AUTH_TOKEN_MAX_AGE_IN_SECONDS } from '../constants';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

const cookieStore = {
  delete: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
};

describe('server auth session', () => {
  beforeEach(() => {
    jest.mocked(cookies).mockResolvedValue(cookieStore as never);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('sets and clears the configured auth cookie', async () => {
    await setAuthCookie('token');
    await setAuthCookie('custom-token', 'custom-auth');
    await clearAuthCookie();

    expect(cookieStore.set).toHaveBeenNthCalledWith(1, AUTH_COOKIE_NAME, 'token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: AUTH_TOKEN_MAX_AGE_IN_SECONDS,
    });
    expect(cookieStore.set).toHaveBeenNthCalledWith(2, 'custom-auth', 'custom-token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: AUTH_TOKEN_MAX_AGE_IN_SECONDS,
    });
    expect(cookieStore.delete).toHaveBeenCalledWith(AUTH_COOKIE_NAME);
  });

  it('returns an unauthenticated session when the cookie is missing or invalid', async () => {
    cookieStore.get.mockReturnValueOnce(undefined).mockReturnValueOnce({ value: 'invalid' });

    await expect(getServerSession()).resolves.toEqual({ isAuthenticated: false });
    await expect(getServerSession()).resolves.toEqual({ isAuthenticated: false });
  });

  it('returns an unauthenticated session for an expired token', async () => {
    const token = Token.generate({
      seconds: -1,
      signature: 'signature',
    });
    cookieStore.get.mockReturnValue({ value: token });

    await expect(getServerSession()).resolves.toEqual({ isAuthenticated: false });
  });

  it('returns the validated token for an authenticated session', async () => {
    const token = Token.generate({
      seconds: 60,
      signature: 'signature',
    });
    cookieStore.get.mockReturnValue({ value: token });

    await expect(getServerSession()).resolves.toEqual({
      token,
      isAuthenticated: true,
    });
  });

  it('returns unauthenticated if cookie access throws', async () => {
    jest.mocked(cookies).mockRejectedValueOnce(new Error('No request context'));

    await expect(getServerSession()).resolves.toEqual({ isAuthenticated: false });
  });
});
