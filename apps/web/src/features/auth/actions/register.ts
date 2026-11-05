'use server';
import { HttpClient } from '@fintech/shared';

import { FINANCE_API_BASE_URL } from '../../../server/integrations/finance-api/config';
import type { TUser } from '../types';

export async function registerAction(data: Record<string, string>): Promise<{ status: string; message: string; }> {
  try {
    const client = await HttpClient.post<TUser>({
      path: '/auth/register',
      baseUrl: FINANCE_API_BASE_URL,
      config: { body: data }
    });

    if(client.isFailure) {
      return {
        status: 'error',
        message: 'auth.register.messages.error',
      };
    }
  } catch (error) {
    console.error('registerAction error:', error);
    return {
      status: 'error',
      message: 'auth.register.messages.error',
    };
  }
  return {
    status: 'success',
    message: 'auth.register.messages.success',
  }
}