import { NextRequest, NextResponse } from 'next/server';

import { Token } from '@fintech/shared';
import { AUTH_COOKIE_NAME } from './src/server/auth/constants';

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isApiRequest = request.nextUrl.pathname === '/api' ||
    request.nextUrl.pathname.startsWith('/api/');

  if (!token) {
    if (isApiRequest) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/join', request.url));
  }

  const result = Token.tryCreate(token);

  if(result.isFailure || result.instance.isExpired) {
    if (isApiRequest) {
      const response = NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      response.cookies.delete(AUTH_COOKIE_NAME);
      return response;
    }
    const response = NextResponse.redirect(new URL('/join', request.url));
    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!join|auth/logout|_next/static|_next/image|favicon.ico).*)',
  ],
};