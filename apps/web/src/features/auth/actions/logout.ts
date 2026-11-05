'use server';
import { clearAuthCookie } from '../../../server/auth';

export async function logoutAction(): Promise<void> {
  await clearAuthCookie();
}