import { defineType, defineField } from "sanity";
import { HomeIcon } from "@sanity/icons";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "about", title: "About" },
    { name: "services", title: "Services" },
    { name: "stats", title: "Stats" },
    { name: "projects", title: "Featured Projects" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    /* ── Hero ── */
    defineField({
      name: "heroHeading",
      title: "Heading",
      type: "string",
      group: "hero",
      description: "Main hero headline",
    }),
    defineField({
      name: "heroViewProjectText",
      title: "View Project Text",
      type: "string",
      group: "hero",
      description: 'CTA label, e.g. "View Project"',
    }),
    defineField({
      name: "heroProject",
      title: "Featured Project",
      description: "The project displayed in the homepage hero. Its Featured Image 1 becomes the primary image and Featured Image 2 becomes the hover image.",
      type: "reference",
      to: [{ type: "project" }],
      group: "hero",
    }),

    /* ── About ── */
    defineField({
      name: "aboutHeading",
      title: "Heading",
      type: "string",
      group: "about",
    }),
    defineField({
      name: "aboutParagraph",
      title: "Paragraph",
      type: "text",
      group: "about",
      description: "The paragraph that appears below the about heading.",
    }),
    defineField({
      name: "aboutImage",
      title: "Image",
      type: "image",
      group: "about",
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),

    /* ── Services ── */
    defineField({
      name: "servicesHeading",
      title: "Heading",
      type: "string",
      group: "services",
      description: 'e.g. "What We Do"',
    }),
defineField({
      name: "servicesTagline",
      title: "Tagline",
      type: "text",
      group: "services",
      description: "The quote/tagline shown alongside the services list.",
    }),
    defineField({
      name: "serviceGroups",
      title: "Service Groups",
      type: "array",
      group: "services",
      of: [{ type: "serviceGroup" }],
    }),

    /* ── Stats ── */
    defineField({
      name: "statsHeading",
      title: "Heading",
      type: "string",
      group: "stats",
    }),
    defineField({
      name: "statsSubheading",
      title: "Subheading",
      type: "text",
      group: "stats",
      description: 'The paragraph next to the stats heading.',
    }),
    defineField({
      name: "statsItems",
      title: "Stats Items",
      type: "array",
      group: "stats",
      of: [{ type: "orbitStatItem" }],
    }),

    /* ── Featured Projects ── */
    defineField({
      name: "featuredProjects",
      title: "Featured Projects",
      type: "array",
      group: "projects",
      of: [{ type: "reference", to: [{ type: "project" }] }],
    }),

    /* ── SEO ── */
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
      description: "Overrides the default homepage title in search results. Keep under 60 characters.",
      validation: (r) => r.max(60).warning("Keep under 60 characters"),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      group: "seo",
      description: "Overrides the site-wide description for the homepage. Keep under 160 characters.",
      validation: (r) => r.max(160).warning("Keep under 160 characters"),
    }),
  ],
  preview: { prepare: () => ({ title: "Home Page" }) },
});
