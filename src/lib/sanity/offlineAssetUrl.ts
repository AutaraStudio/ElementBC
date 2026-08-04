const CDN_PREFIX = 'https://cdn.sanity.io/';

export const OFFLINE_ASSET_DIR = '/sanity-offline';

/**
 * Maps a Sanity CDN asset URL onto its locally staged copy.
 *
 * Rasters are re-encoded to WebP by scripts/restore-offline.mjs, so the
 * extension is normalised here too. SVGs are copied verbatim.
 *
 * Pure string work — safe in both server and client bundles.
 */
export function toLocalAssetUrl(url: string): string {
  if (!url.startsWith(CDN_PREFIX)) return url;

  const filename = url.split('/').pop()?.split('?')[0];
  if (!filename) return url;

  if (filename.toLowerCase().endsWith('.svg')) return `${OFFLINE_ASSET_DIR}/${filename}`;
  return `${OFFLINE_ASSET_DIR}/${filename.replace(/\.[^.]+$/, '')}.webp`;
}
