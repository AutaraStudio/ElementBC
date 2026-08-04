import { sanityClient } from './client';

export const SANITY_OFFLINE = process.env.NEXT_PUBLIC_SANITY_OFFLINE === 'true';

/**
 * Fetches content from Sanity, or from the local backup when offline mode is on.
 *
 * Offline mode is a temporary stand-in while the Sanity project is blocked
 * (HTTP 402). Remove NEXT_PUBLIC_SANITY_OFFLINE from .env.local once billing is
 * resolved and this goes straight back to the live API.
 */
export async function cmsFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  if (SANITY_OFFLINE) {
    const { offlineFetch } = await import('./offlineData');
    return offlineFetch<T>(query, params);
  }
  return sanityClient.fetch<T>(query, params);
}

/**
 * Reads an asset's contents as text (used to inline partner logo SVGs).
 * Offline asset URLs are root-relative paths, not something fetch() can take.
 */
export async function fetchAssetText(url: string): Promise<string> {
  if (url.startsWith('/sanity-offline/')) {
    const { readStagedAsset } = await import('./offlineData');
    return readStagedAsset(url);
  }
  const res = await fetch(url);
  return res.ok ? res.text() : '';
}
