import { evaluate, parse } from 'groq-js';
import { toLocalAssetUrl } from './offlineAssetUrl';
import dataset from './offline-dataset.json';
import svgSources from './offline-svgs.json';

/**
 * GROQ evaluation against the local Sanity backup, used while the Sanity
 * project is blocked (HTTP 402).
 *
 * The dataset is imported statically rather than read from disk so the bundler
 * traces it into the deployed serverless function — a runtime fs.readFileSync
 * would resolve fine locally and then 500 in production.
 */

let cache: Record<string, unknown>[] | null = null;

function loadDataset(): Record<string, unknown>[] {
  if (cache) return cache;

  cache = (dataset as Record<string, unknown>[]).map((doc) => {
    // Asset docs carry an absolute cdn.sanity.io url that queries project
    // directly (asset->{ url }); repoint it at the staged local file.
    if (typeof doc.url === 'string') return { ...doc, url: toLocalAssetUrl(doc.url) };
    return doc;
  });

  return cache;
}

/** Returns the inline source of a staged SVG, or '' if it isn't one. */
export function readStagedAsset(url: string): string {
  const filename = url.split('/').pop()?.split('?')[0] ?? '';
  return (svgSources as Record<string, string>)[filename] ?? '';
}

export async function offlineFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  const tree = parse(query, { params });
  const result = await evaluate(tree, { dataset: loadDataset(), params });
  return (await result.get()) as T;
}
