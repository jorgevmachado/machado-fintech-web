import { NextResponse } from 'next/server';

import { clearAuthCookie } from '../../../src/server/auth';

export async function GET(request: Request): Promise<NextResponse> {
  await clearAuthCookie();
  return NextResponse.redirect(new URL('/join', request.url));
}
