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
