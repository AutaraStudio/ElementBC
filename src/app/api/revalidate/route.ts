import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');

  if (!process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Revalidation secret not configured' }, { status: 500 });
  }

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  let body: { _type?: string; slug?: { current?: string } } = {};
  try {
    body = await req.json();
  } catch {
    // No body or unparseable — revalidate everything
  }

  const type = body?._type;

  // Always revalidate the full layout tree to ensure route groups like (main) are covered
  revalidatePath('/', 'layout');

  return NextResponse.json({ revalidated: true, type: type ?? 'unknown', now: Date.now() });
}
