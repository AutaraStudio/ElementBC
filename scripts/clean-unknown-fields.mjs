import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

const SYSTEM_FIELDS = new Set([
  '_id', '_type', '_rev', '_createdAt', '_updatedAt', '_originalId',
])

// Top-level field whitelists per document type (extracted from src/lib/sanity/schemas/*.ts)
const ALLOWED = {
  project: ['projectName', 'slug', 'projectCategory', 'ourRole', 'projectStats', 'featuredImage1', 'featuredImage2', 'galleryImages', 'seoTitle', 'seoDescription'],
  projectCategory: ['name', 'slug'],
  homePage: ['heroHeading', 'heroViewProjectText', 'heroProject', 'aboutHeading', 'aboutParagraph', 'aboutImage', 'servicesHeading', 'servicesTagline', 'serviceGroups', 'statsHeading', 'statsSubheading', 'statsItems', 'featuredProjects', 'seoTitle', 'seoDescription'],
  aboutPage: ['heroEyebrow', 'heroHeading', 'teamEyebrow', 'teamDescription', 'teamMembers', 'approachHeading', 'approachDescription', 'approachItems', 'seoTitle', 'seoDescription'],
  projectsPage: ['pageHeading', 'heroEyebrow', 'seoTitle', 'seoDescription'],
  contactPage: ['heroEyebrow', 'heroHeading', 'getInTouchEyebrow', 'teamContacts', 'phoneLabel', 'phoneNumber', 'emailLabel', 'emailAddress', 'addressEyebrow', 'addressLine1', 'addressLine2', 'addressLine3', 'googleMapsUrl', 'visitLabel', 'bookVisitUrl', 'seoTitle', 'seoDescription'],
  navigation: ['navLinks', 'ctaLabel', 'ctaUrl'],
  footer: ['footerNavLinks', 'legalLinks', 'builtByText', 'builtByUrl'],
  siteSettings: ['siteTitle', 'seoTitle', 'seoDescription', 'seoImage', 'favicon'],
  partnerCarousel: ['heading', 'partners'],
  legalPage: ['heroEyebrow', 'heroHeading', 'lastUpdated', 'body', 'seoTitle', 'seoDescription'],
}

async function main() {
  console.log('=== Cleaning unknown fields from Sanity documents ===\n')

  const knownTypes = new Set(Object.keys(ALLOWED))
  const allDocs = await client.fetch('*[!(_id in path("system.**"))]')
  console.log(`Fetched ${allDocs.length} documents (drafts + published).\n`)

  let totalFieldsRemoved = 0
  let totalDocsCleaned = 0
  const orphanTypes = new Map()

  for (const doc of allDocs) {
    const type = doc._type
    if (!knownTypes.has(type)) {
      orphanTypes.set(type, (orphanTypes.get(type) ?? 0) + 1)
      continue
    }
    const allowed = new Set(ALLOWED[type])
    const unknown = Object.keys(doc).filter(
      (k) => !SYSTEM_FIELDS.has(k) && !allowed.has(k)
    )
    if (unknown.length === 0) continue

    totalDocsCleaned++
    totalFieldsRemoved += unknown.length
    console.log(`• ${doc._id} [${type}] → unsetting: ${unknown.join(', ')}`)
    await client.patch(doc._id).unset(unknown).commit({ visibility: 'async' })
  }

  console.log(`\n✓ Removed ${totalFieldsRemoved} unknown field(s) across ${totalDocsCleaned} document(s).`)

  if (orphanTypes.size > 0) {
    console.log('\n⚠ Documents with unknown _type (not in current schema):')
    for (const [t, n] of orphanTypes) console.log(`   ${t}: ${n} doc(s)`)
    console.log('   (Left untouched — review manually if you want them deleted.)')
  } else {
    console.log('\nNo orphan document types found.')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
