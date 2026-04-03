import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClient } from 'next-sanity'
import { randomUUID } from 'crypto'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

async function patchHomePage() {
  console.log('\nPatching homePage...')
  await client
    .patch('homePage')
    .setIfMissing({
      statsSubheading:
        'From programme to budget, we manage every detail — and the results speak for themselves.',
    })
    .commit()
  console.log('  ✓ homePage patched')
}

async function patchAboutPage() {
  console.log('\nPatching aboutPage...')
  await client
    .patch('aboutPage')
    .setIfMissing({
      introLargeHeading:
        'Each stage of our process carries the same intent; to analyse before we advise, to challenge before we commit, and to deliver with a precision that protects every outcome.',
      introSecondaryParagraph:
        'Element transforms complex projects into confident outcomes. We specialise in building consultancy that uncovers risk, sharpens performance, and protects your investment.',
      ctaLabel: 'View Our Work',
      ctaUrl: '/projects',
      teamMembers: [
        {
          _key: randomUUID(),
          name: 'Team Member Name',
          role: 'Director',
          bio: 'Bio placeholder — update in Sanity Studio.',
        },
      ],
    })
    .commit()
  console.log('  ✓ aboutPage patched')
}

async function patchProjectsPage() {
  console.log('\nPatching projectsPage...')
  await client
    .patch('projectsPage')
    .setIfMissing({
      heroEyebrow: 'Our Work',
    })
    .commit()
  console.log('  ✓ projectsPage patched')
}

async function main() {
  console.log('=== Patching new Sanity fields (setIfMissing — safe, no data lost) ===')
  await patchHomePage()
  await patchAboutPage()
  await patchProjectsPage()
  console.log('\n✓ All patches applied and published.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
