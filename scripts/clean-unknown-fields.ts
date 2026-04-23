import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClient } from 'next-sanity'
import { schemas } from '../src/lib/sanity/schemas'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// System fields that always exist on every document
const SYSTEM_FIELDS = new Set([
  '_id',
  '_type',
  '_rev',
  '_createdAt',
  '_updatedAt',
  '_originalId',
])

function fieldNamesFor(typeName: string): Set<string> | null {
  const def = (schemas as any[]).find((s) => s.name === typeName)
  if (!def || !Array.isArray(def.fields)) return null
  return new Set(def.fields.map((f: any) => f.name))
}

async function main() {
  console.log('=== Cleaning unknown fields from Sanity documents ===\n')

  const knownTypes = new Set((schemas as any[]).map((s) => s.name))
  const allDocs: Array<Record<string, any>> = await client.fetch('*[!(_id in path("system.**"))]')
  console.log(`Fetched ${allDocs.length} documents (drafts + published).\n`)

  let totalUnknownDocs = 0
  let totalFieldsRemoved = 0
  const orphanTypes = new Map<string, number>()

  for (const doc of allDocs) {
    const type = doc._type
    if (!knownTypes.has(type)) {
      orphanTypes.set(type, (orphanTypes.get(type) ?? 0) + 1)
      continue
    }
    const allowed = fieldNamesFor(type)
    if (!allowed) continue

    const unknown = Object.keys(doc).filter(
      (k) => !SYSTEM_FIELDS.has(k) && !allowed.has(k)
    )
    if (unknown.length === 0) continue

    totalUnknownDocs++
    totalFieldsRemoved += unknown.length
    console.log(`• ${doc._id} [${type}] → unsetting: ${unknown.join(', ')}`)
    await client.patch(doc._id).unset(unknown).commit({ visibility: 'async' })
  }

  console.log(`\n✓ Cleaned ${totalFieldsRemoved} unknown field(s) across ${totalUnknownDocs} document(s).`)

  if (orphanTypes.size > 0) {
    console.log('\n⚠ Documents with unknown _type (not in current schema):')
    for (const [t, n] of orphanTypes) console.log(`   ${t}: ${n} doc(s)`)
    console.log('   (left untouched — review manually)')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
