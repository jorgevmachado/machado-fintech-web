import { HttpClient, Result } from '@fintech/shared';
import { redirect } from 'next/navigation';

import { loginAction } from '../actions/login';
import { logoutAction } from '../actions/logout';
import { registerAction } from '../actions/register';
import { clearAuthCookie, setAuthCookie } from '@/src/server/auth';

jest.mock('next/navigation', () => ({
  redirect: jest.fn(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

jest.mock('@/src/server/auth', () => ({
  clearAuthCookie: jest.fn(),
  setAuthCookie: jest.fn(),
}));

describe('auth actions', () => {
  const post = jest.spyOn(HttpClient, 'post');
  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('sets the session cookie and redirects after a successful login', async () => {
    post.mockResolvedValueOnce(Result.ok({ access_token: 'access-token' }));

    await expect(loginAction({ email: 'user@example.com', password: 'secret' }))
      .rejects.toThrow('NEXT_REDIRECT');

    expect(post).toHaveBeenCalledWith({
      path: '/auth/login',
      baseUrl: expect.any(String),
      config: {
        body: { email: 'user@example.com', password: 'secret' },
      },
    });
    expect(setAuthCookie).toHaveBeenCalledWith('access-token');
    expect(redirect).toHaveBeenCalledWith('/home');
  });

  it('returns the success result when the redirect adapter resolves', async () => {
    post.mockResolvedValueOnce(Result.ok({ access_token: 'access-token' }));
    jest.mocked(redirect).mockImplementationOnce(() => undefined as never);

    await expect(loginAction({ email: 'user@example.com', password: 'secret' }))
      .resolves.toEqual({
        status: 'success',
        message: 'auth.login.messages.success',
      });
  });

  it('returns an error when login fails', async () => {
    post.mockResolvedValueOnce(Result.fail('Unauthorized'));

    await expect(loginAction({ email: 'user@example.com', password: 'wrong' }))
      .resolves.toEqual({
        status: 'error',
        message: 'auth.login.messages.error',
      });

    expect(setAuthCookie).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it('returns an error when the login request throws', async () => {
    post.mockRejectedValueOnce(new Error('Network failure'));

    await expect(loginAction({})).resolves.toEqual({
      status: 'error',
      message: 'auth.login.messages.error',
    });
    expect(consoleError).toHaveBeenCalledWith(
      'loginAction error:',
      expect.any(Error),
    );
  });

  it('registers a user and returns the result message', async () => {
    post.mockResolvedValueOnce(Result.ok({ id: 'user-1' }));

    await expect(registerAction({ email: 'user@example.com' })).resolves.toEqual({
      status: 'success',
      message: 'auth.register.messages.success',
    });
    expect(post).toHaveBeenCalledWith({
      path: '/auth/register',
      baseUrl: expect.any(String),
      config: { body: { email: 'user@example.com' } },
    });
  });

  it('returns an error when registration fails or throws', async () => {
    post
      .mockResolvedValueOnce(Result.fail('Invalid registration'))
      .mockRejectedValueOnce(new Error('Network failure'));

    await expect(registerAction({})).resolves.toEqual({
      status: 'error',
      message: 'auth.register.messages.error',
    });
    await expect(registerAction({})).resolves.toEqual({
      status: 'error',
      message: 'auth.register.messages.error',
    });
    expect(consoleError).toHaveBeenCalledWith(
      'registerAction error:',
      expect.any(Error),
    );
  });

  it('clears the auth cookie when logging out', async () => {
    await logoutAction();

    expect(clearAuthCookie).toHaveBeenCalledTimes(1);
  });
});
