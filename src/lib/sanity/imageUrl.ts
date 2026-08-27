import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';
import { sanityClient } from './client';

const builder = createImageUrlBuilder(sanityClient);

/**
 * Builds a Sanity CDN URL for an image.
 *
 * Pass `width` for anything rendered at a known size. Without it the CDN
 * serves the untouched original, which for photography straight off a camera
 * can be 50 megapixels — the browser then downloads and decodes all of it to
 * paint a few hundred pixels. Asking the CDN to resize is dramatically
 * cheaper, and `auto=format` gets WebP to browsers that accept it.
 */
export function urlFor(source: SanityImageSource | null | undefined, width?: number): string {
  if (!source) return '';
  try {
    const image = builder.image(source);
    return width ? image.width(width).auto('format').quality(75).url() : image.url();
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
