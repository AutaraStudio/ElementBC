import { defineType, defineField } from "sanity";
import { CaseIcon } from "@sanity/icons";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  icon: CaseIcon,
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "images", title: "Images" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    /* ── Details ── */
    defineField({
      name: "projectName",
      title: "Project Name",
      type: "string",
      group: "details",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "details",
      options: { source: "projectName" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "projectCategory",
      title: "Type / Category",
      type: "reference",
      to: [{ type: "projectCategory" }],
      group: "details",
    }),
    defineField({ name: "ourRole", title: "Our Role", type: "text", rows: 3, group: "details" }),
    defineField({
      name: "projectStats",
      title: "Project Stats",
      description: "Key/value pairs displayed on the case study page (e.g. Client, Location, Size, Duration).",
      type: "array",
      group: "details",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
          defineField({ name: "value", title: "Value", type: "string", validation: (r) => r.required() }),
        ],
        preview: { select: { title: "label", subtitle: "value" } },
      }],
    }),

    /* ── Images ── */
    defineField({
      name: "featuredImage1",
      title: "Featured Image",
      type: "image",
      group: "images",
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),
    defineField({
      name: "featuredImage2",
      title: "Featured Image 2 (Hover)",
      type: "image",
      group: "images",
      description: "Secondary image revealed on hover in the home hero",
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),
    defineField({
      name: "galleryImages",
      title: "Gallery Images",
      type: "array",
      group: "images",
      of: [
        {
          type: "image",
          fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
        },
      ],
      options: { layout: "grid" },
    }),

    /* ── SEO ── */
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
      description: "Overrides the project name in search results. Keep under 60 characters.",
      validation: (r) => r.max(60).warning("SEO titles over 60 characters may be truncated"),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      group: "seo",
      description: "Keep under 160 characters for best results.",
      validation: (r) => r.max(160).warning("Meta descriptions over 160 characters may be truncated"),
    }),
  ],
  preview: {
    select: { title: "projectName", subtitle: "client", media: "featuredImage1" },
  },
});
