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
      location,
      client,
      completedDate,
      size,
      duration,
      featuredTitle,
      featuredImage1 { ..., alt },
      featuredImage2 { ..., alt },
      galleryImages[] {
        _key,
        asset->{ _id, url, metadata { dimensions } },
        alt
      },
      sectionEyebrow1, sectionHeading1,
      tableStats[] {
        _key,
        header,
        statA,
        statB,
        statC
      },
      sectionEyebrow2, sectionHeading2, sectionParagraph2,
      sectionEyebrow3, sectionHeading3, sectionParagraph3,
      sectionEyebrow4, sectionHeading4, sectionParagraph4,
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
      aboutValueProps[] { _key, title, description },
      aboutImage { ..., alt },
      statsHeading,
      statsSubheading,
      statsItems[] { statLabel, statValue },
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
      heroImage { ..., alt },
      introEyebrow,
      introHeading,
      introParagraph,
      introImage { ..., alt },
      introLargeHeading,
      introSecondaryParagraph,
      ctaLabel,
      ctaUrl,
      teamMembers[] {
        _key,
        name,
        role,
        bio,
        photo { asset->{ _id, url }, alt }
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
  location?: string;
  client?: string;
  completedDate?: string;
  size?: string;
  duration?: string;
  featuredTitle?: string;
  featuredImage2?: SanityImage | null;
  galleryImages?: Array<{
    _key: string;
    asset?: { _id: string; url: string; metadata?: { dimensions?: { width: number; height: number } } };
    alt?: string;
  }>;
  sectionEyebrow1?: string;
  sectionHeading1?: string;
  tableStats?: Array<{
    _key: string;
    header?: string;
    statA?: string;
    statB?: string;
    statC?: string;
  }>;
  sectionEyebrow2?: string;
  sectionHeading2?: string;
  sectionParagraph2?: string;
  sectionEyebrow3?: string;
  sectionHeading3?: string;
  sectionParagraph3?: string;
  sectionEyebrow4?: string;
  sectionHeading4?: string;
  sectionParagraph4?: string;
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
  aboutValueProps?: Array<{ _key: string; title?: string; description?: string }>;
  aboutImage?: SanityImage | null;
  statsHeading?: string;
  statsSubheading?: string;
  statsItems?: SanityStatItem[];
  featuredProjects?: (SanityProject & { featuredImage2?: SanityImage | null })[];
}

export interface SanityAboutPage {
  heroEyebrow?: string;
  heroHeading?: string;
  heroImage?: SanityImage | null;
  introEyebrow?: string;
  introHeading?: string;
  introParagraph?: string;
  introImage?: SanityImage | null;
  introLargeHeading?: string;
  introSecondaryParagraph?: string;
  ctaLabel?: string;
  ctaUrl?: string;
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
