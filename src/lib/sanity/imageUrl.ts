import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';
import { sanityClient } from './client';

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource | null | undefined): string {
  if (!source) return '';
  try {
    return builder.image(source).url();
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
