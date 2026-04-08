import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SITE_PASSWORD = process.env.SITE_PASSWORD ?? 'elementbc2025';

export async function POST(request: NextRequest) {
  const body = await request.formData();
  const password = body.get('password');

  if (password === SITE_PASSWORD) {
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('site-auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
    return response;
  }

  // Wrong password — redirect back with error
  const url = new URL('/password', request.url);
  url.searchParams.set('error', '1');
  return NextResponse.redirect(url);
}
