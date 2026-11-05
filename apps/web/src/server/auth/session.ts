import 'server-only';

import { cookies } from 'next/headers';

import { Token } from '@fintech/shared';

import { AUTH_COOKIE_NAME, AUTH_TOKEN_MAX_AGE_IN_SECONDS } from './constants';

export type  SessionResult = {
  token?: string;
  isAuthenticated: boolean;
}

export const clearAuthCookie = async (): Promise<void> => {
  const cookieStore = await cookies();

  cookieStore.delete(AUTH_COOKIE_NAME);
};

export const setAuthCookie = async (token: string, auth_cookie: string = AUTH_COOKIE_NAME): Promise<void> => {
  const cookieStore = await cookies();

  cookieStore.set(auth_cookie, token,{
    httpOnly: true ,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' ,
    maxAge: AUTH_TOKEN_MAX_AGE_IN_SECONDS ,
  });
}

export const getServerSession = async (auth_cookie: string = AUTH_COOKIE_NAME): Promise<SessionResult> => {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get(auth_cookie)?.value;

    if(!token) {
      return {
        isAuthenticated: false,
      }
    }

    const result = Token.tryCreate(token);
    if (result.isFailure || result.instance.isExpired) {
      return {
        isAuthenticated: false,
      };
    }

    return {
      token: result.instance.value,
      isAuthenticated: true,
    }
  } catch {
    return {
      isAuthenticated: false,
    }
  }
}