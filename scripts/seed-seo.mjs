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

// ── Singletons ───────────────────────────────────────────────────────────────
const singletons = [
  {
    id: 'siteSettings',
    seoTitle: 'Element BC | London Building Consultancy',
  },
  {
    id: 'homePage',
    seoTitle: 'Element BC | London Building Consultancy',
    seoDescription: 'Specialist building consultancy delivering Cat A, Cat B, commercial, residential and structural projects across London with disciplined cost control.',
  },
  {
    id: 'privacyPolicy',
    seoDescription: 'How Element BC collects, uses, stores and protects your personal information when you visit our site or get in touch.',
  },
  {
    id: 'termsConditions',
    seoDescription: 'The terms governing your access to and use of the Element BC website, including intellectual property and limitation of liability.',
  },
]

// ── Per-project SEO ──────────────────────────────────────────────────────────
const projectDescriptions = {
  'project-atlas-old-street': 'Cat A+ refurbishment of The Atlas Building, Old Street — a workplace fit-out delivered by Element BC with full project management oversight.',
  'project-belfry-city-heritage': 'A heritage residential restoration of The Belfry, balancing period detail with modern performance under Element BC project management.',
  'project-belgravia-private-residence': 'High-specification refurbishment of a Belgravia townhouse, managed end-to-end by Element BC for a discerning private client.',
  'project-blackfriars-structural': 'Structural refurbishment of Blackfriars Studio — Element BC providing technical due diligence and contract administration throughout.',
  'project-borough-market-cat-a': 'A Cat A+ office repositioning at Borough Market — Element BC delivering full project management and contract administration.',
  'project-canary-wharf-cat-a': 'A Cat A+ headquarters fit-out at Canary Wharf, delivered to programme and budget under Element BC project management.',
  'project-chelsea-family-home': 'A complete refurbishment of a Chelsea family residence, project-managed by Element BC from feasibility through to handover.',
  'project-clerkenwell-cat-b': 'A Cat B occupier fit-out at Clerkenwell Works — Element BC managing design coordination, programme and cost throughout delivery.',
  'project-foundry-bermondsey': 'A Cat B workspace transformation at The Foundry, Bermondsey — delivered by Element BC with rigorous cost and programme control.',
  'project-gardens-southwark': 'A commercial repositioning of The Gardens, Southwark — Element BC providing project management, monitoring and contract administration.',
  'project-hg-commercial-london': 'Commercial refurbishment of the Huett & Grange building in central London, project-managed end-to-end by Element BC.',
  'project-ivory-notting-hill': 'The Ivory, Notting Hill — a flagship residential project delivered with precision and discretion under Element BC project management.',
  'project-kensington-mews-house': 'Refurbishment of a Kensington mews house, delivered by Element BC with hands-on project management and design coordination.',
  'project-mayfair-penthouse-duplex': 'A Mayfair penthouse duplex refurbishment, delivered by Element BC with the discretion and detail expected of a prime address.',
  'project-meridian-farringdon': 'A Cat A+ workplace refurbishment at Meridian House, Farringdon — Element BC delivering full project management throughout.',
  'project-onyx-kensington': 'The Onyx Residence in Kensington — a featured residential project delivered with precision and care by Element BC.',
  'project-shoreditch-creative': 'A Cat B fit-out for a Shoreditch creative business — Element BC coordinating design, programme and cost from start to finish.',
  'project-soho-loft-warehouse': 'A Soho warehouse-loft conversion, project-managed by Element BC with attention to original character and modern living standards.',
  'project-wework-canary-wharf': 'A commercial repositioning at WeWork Canary Wharf — Element BC providing project management and contract administration support.',
}

const titleFor = (name) => {
  const t = `${name} | Element BC Case Study`
  return t.length <= 60 ? t : `${name} | Element BC`
}

async function main() {
  console.log('=== Seeding SEO fields ===\n')

  for (const s of singletons) {
    const patch = {}
    if (s.seoTitle) patch.seoTitle = s.seoTitle
    if (s.seoDescription) patch.seoDescription = s.seoDescription
    await client.patch(s.id).set(patch).commit({ visibility: 'async' })
    console.log(`✓ ${s.id} → ${Object.keys(patch).join(', ')}`)
  }

  const projects = await client.fetch(`*[_type == 'project']{_id, projectName}`)
  for (const p of projects) {
    const desc = projectDescriptions[p._id]
    if (!desc) {
      console.log(`⚠ no description mapped for ${p._id} — skipped`)
      continue
    }
    await client
      .patch(p._id)
      .set({ seoTitle: titleFor(p.projectName), seoDescription: desc })
      .commit({ visibility: 'async' })
    console.log(`✓ ${p._id} (${p.projectName})`)
  }

  console.log('\nDone.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
