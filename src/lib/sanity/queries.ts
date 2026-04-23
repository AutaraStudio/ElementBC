import { sanityClient } from './client';

// ---------------------------------------------------------------------------
// Shared field projection for project list items
// ---------------------------------------------------------------------------
const projectListFields = `
  _id,
  projectName,
  "slug": slug.current,
  "category": projectCategory-> { name, "slug": slug.current },
  featuredImage1 { ..., alt }
`;

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export async function getAllProjects() {
  return sanityClient.fetch<SanityProject[]>(`
    *[_type == "project"] | order(_createdAt desc) {
      ${projectListFields}
    }
  `);
}

export async function getProjectBySlug(slug: string) {
  return sanityClient.fetch<SanityProjectFull | null>(`
    *[_type == "project" && slug.current == $slug][0] {
      _id,
      projectName,
      "slug": slug.current,
      "category": projectCategory-> { name, "slug": slug.current },
      ourRole,
      projectStats[] { label, value },
      featuredImage1 { ..., alt },
      galleryImages[] {
        _key,
        asset->{ _id, url, metadata { dimensions } },
        alt
      },
      seoTitle,
      seoDescription
    }
  `, { slug });
}

// ---------------------------------------------------------------------------
// Project categories
// ---------------------------------------------------------------------------

export async function getAllProjectCategories() {
  return sanityClient.fetch<SanityProjectCategory[]>(`
    *[_type == "projectCategory"] | order(name asc) {
      _id,
      name,
      "slug": slug.current
    }
  `);
}

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

export async function getHomePage() {
  return sanityClient.fetch<SanityHomePage | null>(`
    *[_type == "homePage"][0] {
      heroHeading,
      heroViewProjectText,
      heroProject-> {
        _id,
        projectName,
        "slug": slug.current,
        featuredImage1 { ..., alt },
        featuredImage2 { ..., alt },
        "category": projectCategory->{ name }
      },
      aboutHeading,
      aboutParagraph,
      aboutImage { ..., alt },
      servicesHeading,
      servicesTagline,
      serviceGroups[] { _key, groupTitle, items },
      statsHeading,
      statsSubheading,
      statsItems[] { statLabel, statValue, barWidth },
      featuredProjects[]-> {
        _id,
        projectName,
        "slug": slug.current,
        "category": projectCategory-> { name, "slug": slug.current },
        featuredImage1 { ..., alt },
        featuredImage2 { ..., alt }
      }
    }
  `);
}

export async function getAboutPage() {
  return sanityClient.fetch<SanityAboutPage | null>(`
    *[_type == "aboutPage"][0] {
      heroEyebrow,
      heroHeading,
      teamEyebrow,
      teamDescription,
      teamMembers[] {
        _key,
        name,
        role,
        bio,
        photo { asset->{ _id, url }, alt }
      },
      approachHeading,
      approachDescription,
      approachItems[] {
        _key,
        title,
        description
      },
      seoTitle,
      seoDescription
    }
  `);
}


export async function getContactPage() {
  return sanityClient.fetch<SanityContactPage | null>(`
    *[_type == "contactPage"][0] {
      heroEyebrow,
      heroHeading,
      getInTouchEyebrow,
      teamContacts[] { _key, name, role, phone, email },
      phoneLabel,
      phoneNumber,
      emailLabel,
      emailAddress,
      addressEyebrow,
      addressLine1,
      addressLine2,
      addressLine3,
      googleMapsUrl,
      visitLabel,
      bookVisitUrl,
      seoTitle,
      seoDescription
    }
  `);
}

export async function getPartnerCarousel() {
  const data = await sanityClient.fetch<{
    heading?: string;
    partners?: Array<{ name: string; logoUrl: string }>;
  } | null>(`
    *[_type == "partnerCarousel"][0] {
      heading,
      partners[] {
        name,
        "logoUrl": logo.asset->url
      }
    }
  `);

  if (!data?.partners) return data as SanityPartnerCarousel | null;

  // Fetch SVG content for each partner so we can render inline <svg>
  const partners = await Promise.all(
    data.partners.map(async (p) => {
      let logoSvg = '';
      try {
        const res = await fetch(p.logoUrl);
        if (res.ok) logoSvg = await res.text();
      } catch { /* fallback to empty */ }
      return { name: p.name, logoUrl: p.logoUrl, logoSvg };
    })
  );

  return { ...data, partners } as SanityPartnerCarousel;
}

export async function getProjectsPage() {
  return sanityClient.fetch<SanityProjectsPage | null>(`
    *[_type == "projectsPage"][0] {
      pageHeading,
      heroEyebrow,
      seoTitle,
      seoDescription
    }
  `);
}

export async function getNavigation() {
  return sanityClient.fetch<SanityNavigation | null>(`
    *[_type == "navigation"][0] {
      navLinks[] { label, url },
      ctaLabel,
      ctaUrl
    }
  `);
}

export async function getFooter() {
  return sanityClient.fetch<SanityFooter | null>(`
    *[_type == "footer"][0] {
      footerNavLinks[] { label, url },
      legalLinks[] { label, url },
      builtByText,
      builtByUrl
    }
  `);
}

export async function getLegalPage(documentId: 'privacyPolicy' | 'termsConditions') {
  return sanityClient.fetch<SanityLegalPage | null>(`
    *[_id == $id][0] {
      heroEyebrow,
      heroHeading,
      lastUpdated,
      body,
      seoTitle,
      seoDescription
    }
  `, { id: documentId });
}

export async function getSiteSettings() {
  return sanityClient.fetch<SanitySiteSettings | null>(`
    *[_type == "siteSettings"][0] {
      siteTitle,
      seoDescription,
      seoImage
    }
  `);
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SanityImage {
  _type: 'image';
  asset: { _ref: string; _type: 'reference' };
  alt?: string;
}

export interface SanityProject {
  _id: string;
  projectName: string;
  slug: string;
  category?: { name: string; slug: string } | null;
  featuredImage1?: SanityImage | null;
}

export interface SanityProjectFull extends SanityProject {
  ourRole?: string;
  projectStats?: Array<{ label: string; value: string }>;
  galleryImages?: Array<{
    _key: string;
    asset?: { _id: string; url: string; metadata?: { dimensions?: { width: number; height: number } } };
    alt?: string;
  }>;
  seoTitle?: string;
  seoDescription?: string;
}

export interface SanityProjectCategory {
  _id: string;
  name: string;
  slug: string;
}

export interface SanityStatItem {
  statLabel?: string;
  statValue?: string;
  barWidth?: number;
}

export interface OrbitStatItem {
  statValue?: string;
  statLabel?: string;
  barWidth?: number;
}

export interface SanityServiceGroup {
  _key: string;
  groupTitle?: string;
  items?: string[];
}

export interface SanityHomePage {
  heroHeading?: string;
  heroViewProjectText?: string;
  heroProject?: {
    _id: string;
    projectName: string;
    slug: string;
    featuredImage1?: SanityImage | null;
    featuredImage2?: SanityImage | null;
    category?: { name: string } | null;
  } | null;
  aboutHeading?: string;
  aboutParagraph?: string;
  aboutImage?: SanityImage | null;
  servicesHeading?: string;
  servicesTagline?: string;
  serviceGroups?: SanityServiceGroup[];
  statsHeading?: string;
  statsSubheading?: string;
  statsItems?: SanityStatItem[];
  featuredProjects?: (SanityProject & { featuredImage2?: SanityImage | null })[];
}

export interface SanityApproachItem {
  _key: string;
  title?: string;
  description?: string;
}

export interface SanityAboutPage {
  heroEyebrow?: string;
  heroHeading?: string;
  teamEyebrow?: string;
  teamDescription?: string;
  approachHeading?: string;
  approachDescription?: string;
  approachItems?: SanityApproachItem[];
  teamMembers?: Array<{
    _key: string;
    name?: string;
    role?: string;
    bio?: string;
    photo?: { asset?: { _id: string; url: string }; alt?: string };
  }>;
  seoTitle?: string;
  seoDescription?: string;
}

export interface SanityPartnerCarousel {
  heading?: string;
  partners?: Array<{
    name: string;
    logoUrl: string;
    logoSvg: string;
  }>;
}

export interface SanityContactPage {
  heroEyebrow?: string;
  heroHeading?: string;
  getInTouchEyebrow?: string;
  teamContacts?: Array<{
    _key: string;
    name?: string;
    role?: string;
    phone?: string;
    email?: string;
  }>;
  phoneLabel?: string;
  phoneNumber?: string;
  emailLabel?: string;
  emailAddress?: string;
  addressEyebrow?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  googleMapsUrl?: string;
  visitLabel?: string;
  bookVisitUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface SanityProjectsPage {
  pageHeading?: string;
  heroEyebrow?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface SanityLegalPage {
  heroEyebrow?: string;
  heroHeading?: string;
  lastUpdated?: string;
  body?: unknown[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface SanityNavLink {
  label: string;
  url: string;
}

export interface SanityNavigation {
  navLinks?: SanityNavLink[];
  ctaLabel?: string;
  ctaUrl?: string;
}

export interface SanityFooter {
  footerNavLinks?: SanityNavLink[];
  legalLinks?: SanityNavLink[];
  builtByText?: string;
  builtByUrl?: string;
}

export interface SanitySiteSettings {
  siteTitle?: string;
  seoDescription?: string;
  seoImage?: SanityImage | null;
}
