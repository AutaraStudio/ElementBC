import { sanityClient } from './client';

// ---------------------------------------------------------------------------
// Shared field projection for project list items
// ---------------------------------------------------------------------------
const projectListFields = `
  _id,
  projectName,
  "slug": slug.current,
  "category": projectCategory-> { name, "slug": slug.current },
  featuredImage1,
  featuredImage1Url
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
      client,
      completedDate,
      size,
      duration,
      featuredTitle,
      featuredImage1 { ..., alt }, featuredImage1Url,
      featuredImage2 { ..., alt }, featuredImage2Url,
      galleryImage1 { ..., alt }, galleryImage1Url,
      galleryImage2 { ..., alt }, galleryImage2Url,
      galleryImage3 { ..., alt }, galleryImage3Url,
      galleryImage4 { ..., alt }, galleryImage4Url,
      galleryImage5 { ..., alt }, galleryImage5Url,
      galleryImage6 { ..., alt }, galleryImage6Url,
      galleryImage7 { ..., alt }, galleryImage7Url,
      galleryImage8 { ..., alt }, galleryImage8Url,
      galleryImage9 { ..., alt }, galleryImage9Url,
      galleryImage10 { ..., alt }, galleryImage10Url,
      sectionEyebrow1, sectionHeading1,
      tableHeader1, tableColumnStat1A, tableColumnStat1B, tableColumnStat1C,
      tableHeader2, tableColumnStat2A, tableColumnStat2B, tableColumnStat2C,
      tableHeader3, tableColumnStat3A, tableColumnStat3B, tableColumnStat3C,
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
      aboutHeading,
      aboutImage,
      statsHeading,
      statsItems[] { statLabel, statValue },
      featuredProjects[]-> {
        _id,
        projectName,
        "slug": slug.current,
        "category": projectCategory-> { name, "slug": slug.current },
        featuredImage1, featuredImage1Url,
        featuredImage2, featuredImage2Url
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
      seoTitle,
      seoDescription
    }
  `);
}

export async function getProjectsPage() {
  return sanityClient.fetch<SanityProjectsPage | null>(`
    *[_type == "projectsPage"][0] {
      pageHeading,
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
  featuredImage1Url?: string;
}

export interface SanityProjectFull extends SanityProject {
  client?: string;
  completedDate?: string;
  size?: string;
  duration?: string;
  featuredTitle?: string;
  featuredImage2?: SanityImage | null;
  featuredImage2Url?: string;
  galleryImage1?: SanityImage | null;
  galleryImage1Url?: string;
  galleryImage2?: SanityImage | null;
  galleryImage2Url?: string;
  galleryImage3?: SanityImage | null;
  galleryImage3Url?: string;
  galleryImage4?: SanityImage | null;
  galleryImage4Url?: string;
  galleryImage5?: SanityImage | null;
  galleryImage5Url?: string;
  galleryImage6?: SanityImage | null;
  galleryImage6Url?: string;
  galleryImage7?: SanityImage | null;
  galleryImage7Url?: string;
  galleryImage8?: SanityImage | null;
  galleryImage8Url?: string;
  galleryImage9?: SanityImage | null;
  galleryImage9Url?: string;
  galleryImage10?: SanityImage | null;
  galleryImage10Url?: string;
  sectionEyebrow1?: string;
  sectionHeading1?: string;
  tableHeader1?: string;
  tableColumnStat1A?: string;
  tableColumnStat1B?: string;
  tableColumnStat1C?: string;
  tableHeader2?: string;
  tableColumnStat2A?: string;
  tableColumnStat2B?: string;
  tableColumnStat2C?: string;
  tableHeader3?: string;
  tableColumnStat3A?: string;
  tableColumnStat3B?: string;
  tableColumnStat3C?: string;
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
  aboutHeading?: string;
  aboutImage?: SanityImage | null;
  statsHeading?: string;
  statsItems?: SanityStatItem[];
  featuredProjects?: (SanityProject & { featuredImage2?: SanityImage | null; featuredImage2Url?: string })[];
}

export interface SanityAboutPage {
  heroEyebrow?: string;
  heroHeading?: string;
  heroImage?: SanityImage | null;
  introEyebrow?: string;
  introHeading?: string;
  introParagraph?: string;
  introImage?: SanityImage | null;
  seoTitle?: string;
  seoDescription?: string;
}

export interface SanityProjectsPage {
  pageHeading?: string;
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
