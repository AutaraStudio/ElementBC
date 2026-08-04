/**
 * Stages the Sanity backup for offline use, so the site can build and deploy
 * while the Sanity project is blocked (HTTP 402 — both the content API and
 * cdn.sanity.io are unavailable).
 *
 * Produces three committed artefacts:
 *   public/sanity-offline/            image binaries (rasters re-encoded to WebP)
 *   src/lib/sanity/offline-dataset.json   every document, for local GROQ
 *   src/lib/sanity/offline-svgs.json      inline SVG sources for the partner carousel
 *
 * Rasters are capped on their longest edge because Sanity's CDN never served the
 * originals to browsers — it served resized derivatives. Committing 6720px
 * originals would bloat git and force next/image to resize multi-megapixel
 * files inside a serverless function on first request.
 *
 *   node scripts/restore-offline.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const MAX_EDGE = 2560;
const WEBP_QUALITY = 82;

const ROOT = process.cwd();
const BACKUP = path.join(ROOT, 'sanity-backup');
const MANIFEST = path.join(BACKUP, 'assets', 'asset-manifest.json');
const NDJSON = path.join(BACKUP, 'raw', 'dataset.ndjson');
const OUT_ASSETS = path.join(ROOT, 'public', 'sanity-offline');
const OUT_LIB = path.join(ROOT, 'src', 'lib', 'sanity');

for (const [label, p] of [['asset manifest', MANIFEST], ['dataset.ndjson', NDJSON]]) {
  if (!fs.existsSync(p)) {
    console.error(`Missing ${label}: ${p}\nRestore it from the backup before running this.`);
    process.exit(1);
  }
}

/** image-<hash>-<dims>-<ext> -> <hash>-<dims>.<ext> (the CDN filename) */
function cdnFilename(assetId) {
  const parts = assetId.split('-');
  parts.shift();
  const ext = parts.pop();
  return `${parts.join('-')}.${ext}`;
}

fs.rmSync(OUT_ASSETS, { recursive: true, force: true });
fs.mkdirSync(OUT_ASSETS, { recursive: true });

const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
const svgSources = {};
let sourceBytes = 0;
let outBytes = 0;
let rasters = 0;
let svgs = 0;
const failed = [];

for (const asset of manifest) {
  const src = path.join(BACKUP, asset.file);
  if (!fs.existsSync(src)) {
    failed.push(`${asset.file} (missing)`);
    continue;
  }

  const name = cdnFilename(asset.assetId);
  sourceBytes += fs.statSync(src).size;

  if (name.toLowerCase().endsWith('.svg')) {
    const dest = path.join(OUT_ASSETS, name);
    fs.copyFileSync(src, dest);
    svgSources[name] = fs.readFileSync(src, 'utf8');
    outBytes += fs.statSync(dest).size;
    svgs++;
    continue;
  }

  const webpName = `${name.replace(/\.[^.]+$/, '')}.webp`;
  const dest = path.join(OUT_ASSETS, webpName);
  try {
    await sharp(src)
      .rotate()
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(dest);
    outBytes += fs.statSync(dest).size;
    rasters++;
  } catch (err) {
    failed.push(`${asset.file} (${err.message})`);
  }
}

const docs = fs
  .readFileSync(NDJSON, 'utf8')
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

fs.writeFileSync(path.join(OUT_LIB, 'offline-dataset.json'), JSON.stringify(docs));
fs.writeFileSync(path.join(OUT_LIB, 'offline-svgs.json'), JSON.stringify(svgSources));

const mb = (b) => `${(b / 1024 / 1024).toFixed(1)} MB`;
console.log(`Assets:  ${rasters} rasters + ${svgs} SVGs`);
console.log(`Size:    ${mb(sourceBytes)} -> ${mb(outBytes)} (${(100 - (outBytes / sourceBytes) * 100).toFixed(0)}% smaller)`);
console.log(`Dataset: ${docs.length} documents -> src/lib/sanity/offline-dataset.json`);
if (failed.length) {
  console.warn(`\nFailed on ${failed.length} asset(s):`);
  failed.slice(0, 10).forEach((f) => console.warn(`  - ${f}`));
  process.exitCode = 1;
}
