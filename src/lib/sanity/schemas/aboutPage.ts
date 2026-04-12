import { defineType, defineField } from "sanity";
import { UsersIcon } from "@sanity/icons";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  icon: UsersIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "team", title: "Team" },
    { name: "approach", title: "Approach" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    /* ── Hero ── */
    defineField({ name: "heroEyebrow", title: "Eyebrow", type: "string", group: "hero" }),
    defineField({ name: "heroHeading", title: "Heading", type: "string", group: "hero" }),

    /* ── Team ── */
    defineField({ name: "teamEyebrow", title: "Eyebrow", type: "string", group: "team", description: 'e.g. "Founders Journey"' }),
    defineField({ name: "teamDescription", title: "Description", type: "text", group: "team" }),
    defineField({
      name: "teamMembers",
      title: "Team Members",
      type: "array",
      group: "team",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "name", title: "Name", type: "string" }),
          defineField({ name: "role", title: "Role / Job Title", type: "string" }),
          defineField({ name: "bio", title: "Bio", type: "text" }),
          defineField({
            name: "photo",
            title: "Photo",
            type: "image",
            fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
          }),
        ],
        preview: { select: { title: "name", subtitle: "role", media: "photo" } },
      }],
    }),

    /* ── Approach ── */
    defineField({ name: "approachHeading", title: "Heading", type: "string", group: "approach" }),
    defineField({ name: "approachDescription", title: "Description", type: "text", rows: 3, group: "approach" }),
    defineField({
      name: "approachItems",
      title: "Approach Items",
      type: "array",
      group: "approach",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "title", title: "Title", type: "string" }),
          defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
        ],
        preview: { select: { title: "title" } },
      }],
    }),

    /* ── SEO ── */
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
      validation: (r) => r.max(60).warning("Keep under 60 characters"),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      group: "seo",
      validation: (r) => r.max(160).warning("Keep under 160 characters"),
    }),
  ],
  preview: { prepare: () => ({ title: "About Page" }) },
});
