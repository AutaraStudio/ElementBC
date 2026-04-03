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

  switch (type) {
    case 'project':
      revalidatePath('/', 'page');
      revalidatePath('/projects', 'page');
      revalidatePath('/projects/[slug]', 'page');
      break;
    case 'projectCategory':
      revalidatePath('/projects', 'page');
      break;
    case 'homePage':
      revalidatePath('/', 'page');
      break;
    case 'aboutPage':
      revalidatePath('/about', 'page');
      break;
    case 'projectsPage':
      revalidatePath('/projects', 'page');
      break;
    case 'navigation':
    case 'footer':
    case 'siteSettings':
      // These affect the shared layout — revalidate all pages
      revalidatePath('/', 'layout');
      break;
    default:
      // Unknown type or no body — revalidate everything to be safe
      revalidatePath('/', 'layout');
  }

  return NextResponse.json({ revalidated: true, type: type ?? 'unknown', now: Date.now() });
}
