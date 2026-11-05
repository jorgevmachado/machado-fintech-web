'use server';
import { redirect } from 'next/navigation';
import { HttpClient } from '@fintech/shared';

import { setAuthCookie } from '../../../server/auth';
import { FINANCE_API_BASE_URL } from '../../../server/integrations/finance-api/config';

export async function loginAction(data: Record<string, string>): Promise<{ status: string; message: string; }> {
  try {
    const client = await HttpClient.post<{ access_token: string }>({
      path: '/auth/login',
      baseUrl: FINANCE_API_BASE_URL,
      config: { body: data }
    });
    if(client.isFailure) {
      return {
        status: 'error',
        message: 'auth.login.messages.error',
      };
    }
    const instance = client.instance
    const token = instance.access_token;
    await setAuthCookie(token);
  } catch (error) {
    console.error('loginAction error:', error);
    return {
      status: 'error',
      message: 'auth.login.messages.error',
    };
  }
  redirect('/home');
  return {
    status: 'success',
    message: 'auth.login.messages.success',
  };
}