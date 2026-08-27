/**
 * Migrates the Sanity backup into a NEW Sanity project.
 *
 * The old project is blocked for non-payment (402), so this reads the local
 * backup rather than the old API.
 *
 * Why this can't just be `sanity dataset import`: a Sanity asset's _id is the
 * SHA1 of the uploaded file, and the backup holds CDN-served bytes that are
 * NOT byte-identical to the originals (only 7 of 182 match). Re-uploading
 * therefore mints DIFFERENT asset ids, and every `_ref` pointing at an old id
 * would dangle. So we upload first, learn each new id, rewrite the references,
 * and only then write the documents.
 *
 * Credentials are read from .env.local — never passed on the command line:
 *   SANITY_TARGET_PROJECT_ID   the new project
 *   SANITY_TARGET_DATASET      defaults to "production"
 *   SANITY_TARGET_TOKEN        an Editor or Admin token on the new project
 *
 * Usage:
 *   node scripts/migrate-to-new-sanity.mjs --dry-run   validate, write nothing
 *   node scripts/migrate-to-new-sanity.mjs             upload + import
 *   node scripts/migrate-to-new-sanity.mjs --verify    check the result
 */
import fs from 'node:fs';
import path from 'node:path';

const API_VERSION = '2024-01-01';
const BACKUP = path.join(process.cwd(), 'sanity-backup');
const NDJSON = path.join(BACKUP, 'raw', 'dataset.ndjson');
const MANIFEST = path.join(BACKUP, 'assets', 'asset-manifest.json');
const ASSET_MAP_FILE = path.join(BACKUP, 'migration-asset-map.json');

const DRY_RUN = process.argv.includes('--dry-run');
const VERIFY = process.argv.includes('--verify');

// ---- env -------------------------------------------------------------------
const env = Object.fromEntries(
  fs
    .readFileSync(path.join(process.cwd(), '.env.local'), 'utf8')
    .split('\n')
    .filter((l) => l.trim() && !l.trim().startsWith('#') && l.includes('='))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);

const PROJECT = env.SANITY_TARGET_PROJECT_ID;
const DATASET = env.SANITY_TARGET_DATASET || 'production';
const TOKEN = env.SANITY_TARGET_TOKEN;

if (!PROJECT || !TOKEN) {
  console.error(
    'Missing target credentials. Add these to .env.local:\n' +
      '  SANITY_TARGET_PROJECT_ID=<new project id>\n' +
      '  SANITY_TARGET_TOKEN=<Editor or Admin token>\n' +
      '  SANITY_TARGET_DATASET=production   (optional)'
  );
  process.exit(1);
}

const base = `https://${PROJECT}.api.sanity.io/v${API_VERSION}`;
const auth = { Authorization: `Bearer ${TOKEN}` };

// ---- load backup -----------------------------------------------------------
const allDocs = fs.readFileSync(NDJSON, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));

// system.* are Sanity's own internal bookkeeping documents — not content, and
// the mutation API rejects them. Asset docs are excluded because uploading
// regenerates them, with fresh metadata, palette and lqip.
const contentDocs = allDocs.filter(
  (d) =>
    !d._type.startsWith('system.') &&
    d._type !== 'sanity.imageAsset' &&
    d._type !== 'sanity.fileAsset'
);

console.log(
  `Backup: ${allDocs.length} documents -> ${contentDocs.length} content documents, ${manifest.length} assets`
);

// ---- helpers ---------------------------------------------------------------
async function api(url, options = {}, label = '') {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${label || url} -> HTTP ${res.status}: ${body.slice(0, 400)}`);
  }
  return res.json();
}

/** Recursively rewrite every reference from an old asset id to its new one. */
function remap(value, map, stats) {
  if (Array.isArray(value)) return value.map((v) => remap(v, map, stats));
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (k === '_ref' && typeof v === 'string' && map[v]) {
        out[k] = map[v];
        stats.remapped++;
      } else if (k === '_ref' && typeof v === 'string' && v.startsWith('image-')) {
        stats.dangling.add(v);
        out[k] = v;
      } else {
        out[k] = remap(v, map, stats);
      }
    }
    return out;
  }
  return value;
}

/** Keep _id so inter-document references survive; Sanity owns the rest. */
function stripSystemFields(doc) {
  const { _rev, _createdAt, _updatedAt, ...rest } = doc;
  return rest;
}

// ---- verify mode -----------------------------------------------------------
if (VERIFY) {
  const query =
    '{"documents": count(*[!(_type match "system.**")]), "assets": count(*[_type=="sanity.imageAsset"]), "projects": count(*[_type=="project"]), "categories": count(*[_type=="projectCategory"])}';
  const r = await api(`${base}/data/query/${DATASET}?query=${encodeURIComponent(query)}`, { headers: auth }, 'verify');
  console.log('Target project holds:', JSON.stringify(r.result, null, 2));

  const refQuery = '*[_type=="project"]{projectName, "img": featuredImage1.asset->url}';
  const refs = await api(`${base}/data/query/${DATASET}?query=${encodeURIComponent(refQuery)}`, { headers: auth }, 'ref check');
  const broken = (refs.result || []).filter((p) => !p.img);
  console.log(`Project hero images resolving: ${(refs.result || []).length - broken.length}/${(refs.result || []).length}`);
  broken.forEach((p) => console.warn(`  unresolved: ${p.projectName}`));
  process.exit(broken.length ? 1 : 0);
}

// ---- preflight -------------------------------------------------------------
const ping = await fetch(`${base}/data/query/${DATASET}?query=${encodeURIComponent('count(*)')}`, { headers: auth });
if (!ping.ok) {
  console.error(`Cannot reach ${PROJECT}/${DATASET}: HTTP ${ping.status} ${(await ping.text()).slice(0, 200)}`);
  process.exit(1);
}
console.log(`Target reachable: ${PROJECT}/${DATASET} currently holds ${(await ping.json()).result} documents`);

// ---- 1. upload assets ------------------------------------------------------
const assetMap = fs.existsSync(ASSET_MAP_FILE) ? JSON.parse(fs.readFileSync(ASSET_MAP_FILE, 'utf8')) : {};
let uploaded = 0;
let skipped = 0;
const failures = [];

if (DRY_RUN) {
  let present = 0;
  for (const a of manifest) {
    if (fs.existsSync(path.join(BACKUP, a.file))) present++;
    else failures.push(`${a.file} (missing)`);
  }
  console.log(`Dry run: ${present}/${manifest.length} asset files present on disk`);
} else {
  console.log(`Uploading ${manifest.length} assets...`);
  for (const a of manifest) {
    if (assetMap[a.assetId]) {
      skipped++;
      continue;
    }

    const file = path.join(BACKUP, a.file);
    if (!fs.existsSync(file)) {
      failures.push(`${a.file} (missing)`);
      continue;
    }

    try {
      const url = `${base}/assets/images/${DATASET}?filename=${encodeURIComponent(a.originalFilename || path.basename(a.file))}`;
      const json = await api(
        url,
        {
          method: 'POST',
          headers: { ...auth, 'Content-Type': a.mimeType || 'application/octet-stream' },
          body: fs.readFileSync(file)
        },
        a.file
      );

      assetMap[a.assetId] = json.document._id;
      uploaded++;
      // Persist after every upload so an interrupted run resumes cleanly.
      fs.writeFileSync(ASSET_MAP_FILE, JSON.stringify(assetMap, null, 2));
      if (uploaded % 20 === 0) console.log(`  ${uploaded + skipped}/${manifest.length}`);
    } catch (err) {
      failures.push(`${a.file}: ${err.message}`);
    }
  }
  console.log(`  uploaded ${uploaded}, already present ${skipped}, failed ${failures.length}`);
}

// ---- 2. remap references ---------------------------------------------------
const stats = { remapped: 0, dangling: new Set() };
const migrated = contentDocs.map((d) => stripSystemFields(remap(d, assetMap, stats)));

console.log(`References: ${stats.remapped} repointed, ${stats.dangling.size} unresolved`);
[...stats.dangling].slice(0, 10).forEach((r) => console.warn(`  unresolved: ${r}`));

// ---- 3. write documents ----------------------------------------------------
if (DRY_RUN) {
  console.log(`Dry run: would write ${migrated.length} documents. Nothing sent.`);
} else {
  console.log(`Writing ${migrated.length} documents...`);
  const BATCH = 25;
  let written = 0;
  for (let i = 0; i < migrated.length; i += BATCH) {
    const chunk = migrated.slice(i, i + BATCH);
    await api(
      `${base}/data/mutate/${DATASET}`,
      {
        method: 'POST',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({ mutations: chunk.map((doc) => ({ createOrReplace: doc })) })
      },
      `mutate batch ${i / BATCH + 1}`
    );
    written += chunk.length;
    console.log(`  ${written}/${migrated.length}`);
  }
}

if (failures.length) {
  console.warn(`\n${failures.length} failure(s):`);
  failures.slice(0, 10).forEach((f) => console.warn(`  - ${f}`));
  process.exitCode = 1;
} else if (!DRY_RUN) {
  console.log('\nDone. Re-run with --verify to check the result.');
}
