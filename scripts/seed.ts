import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClient } from 'next-sanity'
import { parse } from 'csv-parse/sync'
import { readFileSync } from 'fs'
import { randomUUID } from 'crypto'
import path from 'path'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// Delete referencing documents before referenced ones to avoid constraint errors:
// homePage → project → projectCategory
const DOC_TYPES = [
  'homePage',
  'aboutPage',
  'projectsPage',
  'contactPage',
  'navigation',
  'footer',
  'siteSettings',
  'project',
  'projectCategory',
]

// ─── helpers ────────────────────────────────────────────────────────────────

function val(v: string | undefined): string | undefined {
  const s = v?.trim()
  return s && s.length > 0 ? s : undefined
}

// ─── Step 1: delete existing documents ──────────────────────────────────────

async function deleteAll() {
  console.log('\nStep 1 — Deleting existing documents...')
  for (const type of DOC_TYPES) {
    const ids: string[] = await client.fetch(`*[_type == $type][]._id`, { type })
    for (const id of ids) {
      await client.delete(id)
    }
    console.log(`  Deleted ${ids.length} × ${type}`)
  }
}

// ─── Step 2: siteSettings ───────────────────────────────────────────────────

async function createSiteSettings() {
  console.log('\nStep 2 — Creating siteSettings...')
  await client.createOrReplace({
    _type: 'siteSettings',
    _id: 'siteSettings',
    siteTitle: 'Element BC',
    seoDescription:
      'Element BC — Building Consultancy specialising in Cat A, Cat B, Commercial, Residential and Structural projects.',
  })
  console.log('  ✓ siteSettings')
}

// ─── Step 3: navigation ─────────────────────────────────────────────────────

async function createNavigation() {
  console.log('\nStep 3 — Creating navigation...')
  await client.createOrReplace({
    _type: 'navigation',
    _id: 'navigation',
    navLinks: [
      { _key: randomUUID(), label: 'Home', url: '/' },
      { _key: randomUUID(), label: 'Projects', url: '/projects' },
      { _key: randomUUID(), label: 'About & Team', url: '/about' },
      { _key: randomUUID(), label: 'Services', url: '#' },
      { _key: randomUUID(), label: 'Contact', url: '/contact' },
    ],
    ctaLabel: 'Get In Touch',
    ctaUrl: '/contact',
  })
  console.log('  ✓ navigation')
}

// ─── Step 4: footer ─────────────────────────────────────────────────────────

async function createFooter() {
  console.log('\nStep 4 — Creating footer...')
  await client.createOrReplace({
    _type: 'footer',
    _id: 'footer',
    footerNavLinks: [
      { _key: randomUUID(), label: 'Home', url: '/' },
      { _key: randomUUID(), label: 'Projects', url: '/projects' },
      { _key: randomUUID(), label: 'About & Team', url: '/about' },
      { _key: randomUUID(), label: 'Services', url: '#' },
      { _key: randomUUID(), label: 'Contact', url: '/contact' },
    ],
    legalLinks: [
      { _key: randomUUID(), label: 'Privacy Policy', url: '#' },
      { _key: randomUUID(), label: 'Terms & Conditions', url: '#' },
    ],
    builtByText: 'Built by Autara Studio',
    builtByUrl: 'https://autarastudio.com',
  })
  console.log('  ✓ footer')
}

// ─── Step 5: homePage ───────────────────────────────────────────────────────

async function createHomePage() {
  console.log('\nStep 5 — Creating homePage...')
  await client.createOrReplace({
    _type: 'homePage',
    _id: 'homePage',
    heroHeading: 'element',
    heroViewProjectText: 'View Project',
    aboutHeading: 'We started Element to raise the standard.',
    statsHeading: 'Built on detail.',
    statsSubheading: 'From programme to budget, we manage every detail — and the results speak for themselves.',
    statsItems: [
      { _key: randomUUID(), statLabel: 'Projects Delivered', statValue: '200+' },
      { _key: randomUUID(), statLabel: 'Years Experience', statValue: '15+' },
      { _key: randomUUID(), statLabel: 'Client Satisfaction', statValue: '98%' },
      { _key: randomUUID(), statLabel: 'Sectors', statValue: '6' },
    ],
  })
  console.log('  ✓ homePage')
}

// ─── Step 6: aboutPage ──────────────────────────────────────────────────────

async function createAboutPage() {
  console.log('\nStep 6 — Creating aboutPage...')
  await client.createOrReplace({
    _type: 'aboutPage',
    _id: 'aboutPage',
    heroEyebrow: 'About Element BC',
    heroHeading: 'Meticulously managing every detail, every time.',
    introEyebrow: 'Manifesto',
    introHeading: 'Built on precision.',
    introParagraph:
      'Element transforms complex projects into confident outcomes. We specialise in building consultancy that uncovers risk, sharpens performance, and protects your investment. Every project is guided by precision, meticulous management, and an unwavering attention to detail.',
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
    seoTitle: 'About | Element BC',
    seoDescription: 'Learn about Element BC and our approach to building consultancy.',
  })
  console.log('  ✓ aboutPage')
}

// ─── Step 6b: contactPage ──────────────────────────────────────────────────

async function createContactPage() {
  console.log('\nStep 6b — Creating contactPage...')
  await client.createOrReplace({
    _type: 'contactPage',
    _id: 'contactPage',
    heroEyebrow: 'Contact',
    heroHeading: 'Bringing building consultancy ideas to life.',
    getInTouchEyebrow: 'Get In Touch',
    phoneLabel: 'Talk to us',
    phoneNumber: '020 7946 0958',
    emailLabel: 'Write us',
    emailAddress: 'info@elementbc.co.uk',
    addressEyebrow: 'Address',
    addressLine1: '71-75 Shelton Street',
    addressLine2: 'Covent Garden, London',
    addressLine3: 'WC2H 9JQ, UK',
    googleMapsUrl: 'https://maps.google.com',
    visitLabel: 'Visit us',
    bookVisitUrl: '#',
    seoTitle: 'Contact | Element BC',
    seoDescription: 'Get in touch with Element BC. Building consultancy services across London and the South East.',
  })
  console.log('  ✓ contactPage')
}

// ─── Step 7: projectsPage ───────────────────────────────────────────────────

async function createProjectsPage() {
  console.log('\nStep 7 — Creating projectsPage...')
  await client.createOrReplace({
    _type: 'projectsPage',
    _id: 'projectsPage',
    pageHeading: 'Detail in every project.',
    heroEyebrow: 'Our Work',
    seoTitle: 'Projects | Element BC',
    seoDescription:
      'Browse all Element BC projects across Cat A, Cat B, Commercial, Residential and Structural categories.',
  })
  console.log('  ✓ projectsPage')
}

// ─── Step 8: projectCategories ──────────────────────────────────────────────

async function createCategories(): Promise<Record<string, string>> {
  console.log('\nStep 8 — Creating project categories...')

  const csvPath = path.resolve('reference/dynamic/Element BC - Project Categories.csv')
  const raw = readFileSync(csvPath, 'utf-8')
  const rows = parse(raw, { columns: true, skip_empty_lines: true }) as Record<string, string>[]

  const categoryMap: Record<string, string> = {}

  for (const row of rows) {
    const name = val(row['Category Name'])
    const slug = val(row['Slug'])
    if (!name || !slug) {
      console.warn(`  ⚠ Skipping category row — missing name or slug:`, row)
      continue
    }
    const id = `category-${slug}`
    try {
      await client.createOrReplace({
        _type: 'projectCategory',
        _id: id,
        name,
        slug: { _type: 'slug', current: slug },
      })
      categoryMap[slug] = id
      console.log(`  ✓ category: ${name} (${slug})`)
    } catch (err) {
      console.error(`  ✗ category: ${name}`, err)
    }
  }

  return categoryMap
}

// ─── Step 9: projects ───────────────────────────────────────────────────────

async function createProjects(categoryMap: Record<string, string>): Promise<{ featuredIds: string[]; allIds: string[] }> {
  console.log('\nStep 9 — Creating projects...')

  const csvPath = path.resolve('reference/dynamic/Element BC - Projects.csv')
  const raw = readFileSync(csvPath, 'utf-8')
  const rows = parse(raw, { columns: true, skip_empty_lines: true }) as Record<string, string>[]

  const featuredIds: string[] = []
  const allIds: string[] = []

  for (const row of rows) {
    const projectName = val(row['Project Name'])
    const slug = val(row['Slug'])
    if (!projectName || !slug) {
      console.warn(`  ⚠ Skipping project row — missing name or slug:`, row)
      continue
    }

    const id = `project-${slug}`
    const categorySlug = val(row['Project Category'])
    const categoryRef =
      categorySlug && categoryMap[categorySlug]
        ? { _type: 'reference' as const, _ref: categoryMap[categorySlug] }
        : undefined

    // Collect featured projects
    if (categorySlug === 'featured-project') {
      featuredIds.push(id)
    }

    // Build document — omit undefined fields
    const doc: Record<string, unknown> = {
      _type: 'project',
      _id: id,
      projectName,
      slug: { _type: 'slug', current: slug },
    }

    if (categoryRef) doc.projectCategory = categoryRef

    const str = (key: string) => val(row[key])

    // Scalar fields (no *Url fields — images are uploaded separately via upload-images script)
    const fields: [string, string][] = [
      ['client', 'Client'],
      ['completedDate', 'Completed Date'],
      ['size', 'Size'],
      ['duration', 'Duration'],
      ['featuredTitle', 'Featured title'],
      ['sectionEyebrow1', 'Section Eyebrow 1'],
      ['sectionHeading1', 'Section Heading 1'],
      ['sectionEyebrow2', 'Section Eyebrow 2'],
      ['sectionHeading2', 'Section Heading 2'],
      ['sectionParagraph2', 'Section Paragraph 2'],
      ['sectionEyebrow3', 'Section Eyebrow 3'],
      ['sectionHeading3', 'Section Heading 3'],
      ['sectionParagraph3', 'Section Paragraph 3'],
      ['sectionEyebrow4', 'Section Eyebrow 4'],
      ['sectionHeading4', 'Section Heading 4'],
      ['sectionParagraph4', 'Section Paragraph 4'],
    ]

    for (const [docKey, csvKey] of fields) {
      const v = str(csvKey)
      if (v) doc[docKey] = v
    }

    // Build tableStats array from CSV columns
    const tableStats: Array<{ _key: string; header?: string; statA?: string; statB?: string; statC?: string }> = []
    for (let i = 1; i <= 3; i++) {
      const header = str(`Table Header ${i}`)
      const statA = str(`Table Column Stat ${i}A`)
      const statB = str(`Table Column Stat ${i}B`)
      const statC = str(`Table Column Stat ${i}C`)
      if (header || statA || statB || statC) {
        tableStats.push({ _key: randomUUID(), header, statA, statB, statC })
      }
    }
    if (tableStats.length > 0) doc.tableStats = tableStats

    try {
      await client.createOrReplace(doc as Parameters<typeof client.createOrReplace>[0])
      allIds.push(id)
      console.log(`  ✓ project: ${projectName}`)
    } catch (err) {
      console.error(`  ✗ project: ${projectName}`, err)
    }
  }

  return { featuredIds, allIds }
}

// ─── Step 10: patch homePage featuredProjects ────────────────────────────────

async function patchFeaturedProjects(featuredIds: string[], allProjectIds: string[]) {
  console.log('\nStep 10 — Patching homePage featuredProjects + heroProject...')

  const top3 = featuredIds.slice(0, 3)
  if (top3.length === 0) {
    console.warn('  ⚠ No featured projects found — skipping patch')
    return
  }

  const refs = top3.map((ref) => ({
    _type: 'reference' as const,
    _key: randomUUID(),
    _ref: ref,
  }))

  // Use the first non-featured project as the hero, or the first project overall
  const heroRef = allProjectIds.find((id) => !featuredIds.includes(id)) ?? allProjectIds[0]

  await client.patch('homePage').set({
    featuredProjects: refs,
    ...(heroRef ? { heroProject: { _type: 'reference', _ref: heroRef } } : {}),
  }).commit()

  console.log(`  ✓ featuredProjects set to: ${top3.join(', ')}`)
  if (heroRef) console.log(`  ✓ heroProject set to: ${heroRef}`)
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID is not set in .env.local')
  }
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error('SANITY_API_TOKEN is not set in .env.local')
  }

  await deleteAll()
  await createSiteSettings()
  await createNavigation()
  await createFooter()
  await createHomePage()
  await createAboutPage()
  await createContactPage()
  await createProjectsPage()
  const categoryMap = await createCategories()
  const { featuredIds, allIds } = await createProjects(categoryMap)
  await patchFeaturedProjects(featuredIds, allIds)

  console.log('\nSeed complete.\n')
}

main().catch((err) => {
  console.error('\nSeed failed:', err)
  process.exit(1)
})
