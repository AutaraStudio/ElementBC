import type { Metadata } from 'next';
import { SITE_URL } from './siteUrl';

interface SeoInput {
  title: string;
  description?: string;
  /** Path beginning with a slash, e.g. "/about". */
  path: string;
  /** Absolute image URL for social share cards. */
  image?: string;
}

/**
 * Builds a page's Metadata with a canonical URL plus Open Graph and Twitter
 * card tags, so every page produces consistent SEO and social-share output.
 */
export function buildMetadata({ title, description, path, image }: SeoInput): Metadata {
  const url = `${SITE_URL}${path}`;
  const images = image ? [{ url: image }] : undefined;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Element BC',
      locale: 'en_GB',
      type: 'website',
      images,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
