'use server';
import { Token, HttpClient } from '@fintech/shared';
import { TUser } from '../../contracts/finance-api/auth.contracts';
import { FINANCE_API_BASE_URL } from '../integrations/finance-api/config';

export const getAuthenticatedUser = async (token?: string): Promise<TUser | undefined> => {
  if (!token) {
    return undefined;
  }

  const client = await HttpClient.get<TUser>({
    path: '/auth/me',
    baseUrl: FINANCE_API_BASE_URL,
    config: { token } ,
  });

  if(client.isFailure || !client.instance) {
    return;
  }

  return client.instance as TUser;
}

export const getAuthenticatedUserBootstrap = async (
  isAuthenticated: boolean ,
  token?: string ,
): Promise<{ initialUser?: TUser; tokenExpiresAt?: number }> => {

  if (!isAuthenticated || !token) {
    return {
      initialUser: undefined ,
      tokenExpiresAt: undefined ,
    };
  }

  const tokenValueObject = Token.tryCreate(token);

  if(!tokenValueObject.isOk) {
    return {
      initialUser: undefined,
      tokenExpiresAt: undefined,
    }
  }

  const tokenExpiresAt = tokenValueObject.instance.expiration;
  if (tokenValueObject.instance.isExpired) {
    return {
      initialUser: undefined,
      tokenExpiresAt,
    };
  }

  const initialUser = await getAuthenticatedUser(token);

  return {
    initialUser ,
    tokenExpiresAt,
  };
};