import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';
import { sanityClient } from './client';
import { toLocalAssetUrl } from './offlineAssetUrl';

const builder = createImageUrlBuilder(sanityClient);

const OFFLINE = process.env.NEXT_PUBLIC_SANITY_OFFLINE === 'true';

export function urlFor(source: SanityImageSource | null | undefined): string {
  if (!source) return '';
  try {
    const url = builder.image(source).url();
    return OFFLINE ? toLocalAssetUrl(url) : url;
  } catch {
    return '';
  }
}

export function getImageUrl(sanityImage: unknown, externalUrl?: string): string | null {
  if (sanityImage) {
    const url = urlFor(sanityImage as SanityImageSource);
    if (url) return url;
  }
  if (externalUrl) return externalUrl;
  return null;
}
