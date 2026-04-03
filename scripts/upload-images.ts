import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

const IMAGE_DIR = path.resolve('public/element-bc-project-images');

// Fetch all projects from Sanity and build a name → _id map
async function buildNameToIdMap(): Promise<Map<string, string>> {
  const projects: Array<{ _id: string; projectName: string }> = await client.fetch(
    '*[_type == "project"]{ _id, projectName }'
  );
  const map = new Map<string, string>();
  for (const p of projects) {
    map.set(p.projectName.trim(), p._id);
  }
  return map;
}

async function uploadImageAsset(
  filePath: string,
  filename: string
): Promise<string> {
  console.log(`    Uploading: ${filename}`);
  const fileStream = fs.createReadStream(filePath);
  const asset = await client.assets.upload('image', fileStream, {
    filename,
    contentType: 'image/webp',
  });
  return asset._id;
}

function buildImageRef(assetId: string) {
  return {
    _type: 'image' as const,
    asset: {
      _type: 'reference' as const,
      _ref: assetId,
    },
  };
}

async function processProject(folderName: string, nameToId: Map<string, string>) {
  const projectId = nameToId.get(folderName.trim());
  const folderPath = path.join(IMAGE_DIR, folderName);

  console.log(`\nProcessing: ${folderName} → ${projectId ?? '(no match)'}`);

  if (!projectId) {
    console.warn(`  ⚠ No Sanity document found for name "${folderName}" — skipping`);
    return;
  }

  // Derive a safe slug from the project ID for use in uploaded filenames
  const slug = projectId.replace(/^project-/, '');

  const files = fs.readdirSync(folderPath).filter(f =>
    /\.(webp|jpg|jpeg|png|avif)$/i.test(f)
  );

  const patch: Record<string, unknown> = {};

  // --- Featured Image 1 ---
  const feat1 = files.find(f => /featured-image-1/i.test(f));
  if (feat1) {
    const assetId = await uploadImageAsset(
      path.join(folderPath, feat1),
      `${slug}-featured-1.webp`
    );
    patch['featuredImage1'] = buildImageRef(assetId);
  }

  // --- Featured Image 2 ---
  const feat2 = files.find(f => /featured-image-2/i.test(f));
  if (feat2) {
    const assetId = await uploadImageAsset(
      path.join(folderPath, feat2),
      `${slug}-featured-2.webp`
    );
    patch['featuredImage2'] = buildImageRef(assetId);
  }

  // --- Gallery Images (array) ---
  const galleryFiles = files
    .filter(f => /gallery-image-\d+/i.test(f))
    .sort((a, b) => {
      const numA = parseInt(a.match(/(\d+)/)?.[1] ?? '0', 10);
      const numB = parseInt(b.match(/(\d+)/)?.[1] ?? '0', 10);
      return numA - numB;
    });

  if (galleryFiles.length > 0) {
    const galleryImages = await Promise.all(
      galleryFiles.map(async (file, index) => {
        const assetId = await uploadImageAsset(
          path.join(folderPath, file),
          `${slug}-gallery-${index + 1}.webp`
        );
        return {
          _type: 'image' as const,
          _key: `gallery-${index + 1}`,
          asset: {
            _type: 'reference' as const,
            _ref: assetId,
          },
        };
      })
    );
    patch['galleryImages'] = galleryImages;
  }

  // Apply all patches in one commit
  if (Object.keys(patch).length > 0) {
    await client.patch(projectId).set(patch).commit();
    console.log(`  ✓ Patched ${projectId} with ${Object.keys(patch).join(', ')}`);
  } else {
    console.warn(`  ⚠ No matching image files found in ${folderPath}`);
  }
}

async function main() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID is not set in .env.local');
  }
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error('SANITY_API_TOKEN is not set in .env.local');
  }

  if (!fs.existsSync(IMAGE_DIR)) {
    throw new Error(`Image directory not found: ${IMAGE_DIR}`);
  }

  const folders = fs.readdirSync(IMAGE_DIR).filter(name =>
    fs.statSync(path.join(IMAGE_DIR, name)).isDirectory()
  );

  console.log(`Found ${folders.length} project folder(s): ${folders.join(', ')}\n`);

  const nameToId = await buildNameToIdMap();
  console.log(`Loaded ${nameToId.size} project(s) from Sanity.\n`);

  for (const folder of folders) {
    await processProject(folder, nameToId);
  }

  console.log('\nImage upload complete.');
  console.log('\nYou can now safely delete public/element-bc-project-images/');
  console.log('All images are stored in Sanity and served from cdn.sanity.io');
}

main().catch(err => {
  console.error('\nUpload failed:', err);
  process.exit(1);
});
