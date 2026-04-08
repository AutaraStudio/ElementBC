import { defineType, defineField } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({ name: "projectName", title: "Project Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "projectName" }, validation: (r) => r.required() }),
    defineField({ name: "projectCategory", title: "Project Category", type: "reference", to: [{ type: "projectCategory" }] }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "client", title: "Client", type: "string" }),
    defineField({ name: "completedDate", title: "Completed Date", type: "string" }),
    defineField({ name: "size", title: "Size", type: "string" }),
    defineField({ name: "duration", title: "Duration", type: "string" }),
    defineField({ name: "featuredTitle", title: "Featured Title", type: "string" }),
    defineField({ name: "featuredImage1", title: "Featured Image 1", type: "image", fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })] }),
    defineField({ name: "featuredImage2", title: "Featured Image 2", type: "image", fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })] }),
    defineField({
      name: "galleryImages",
      title: "Gallery Images",
      type: "array",
      of: [
        {
          type: "image",
          fields: [
            defineField({ name: "alt", title: "Alt Text", type: "string" }),
          ],
        },
      ],
      options: { layout: "grid" },
    }),
    defineField({ name: "sectionEyebrow1", title: "Section Eyebrow 1", type: "string" }),
    defineField({ name: "sectionHeading1", title: "Section Heading 1", type: "string" }),
    defineField({
      name: "tableStats",
      title: "Table Stats",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "header", title: "Header", type: "string" }),
            defineField({ name: "statA", title: "Stat A", type: "string" }),
            defineField({ name: "statB", title: "Stat B", type: "string" }),
            defineField({ name: "statC", title: "Stat C", type: "string" }),
          ],
          preview: { select: { title: "header" } },
        },
      ],
    }),
    defineField({ name: "sectionEyebrow2", title: "Section Eyebrow 2", type: "string" }),
    defineField({ name: "sectionHeading2", title: "Section Heading 2", type: "string" }),
    defineField({ name: "sectionParagraph2", title: "Section Paragraph 2", type: "text" }),
    defineField({ name: "sectionEyebrow3", title: "Section Eyebrow 3", type: "string" }),
    defineField({ name: "sectionHeading3", title: "Section Heading 3", type: "string" }),
    defineField({ name: "sectionParagraph3", title: "Section Paragraph 3", type: "text" }),
    defineField({ name: "sectionEyebrow4", title: "Section Eyebrow 4", type: "string" }),
    defineField({ name: "sectionHeading4", title: "Section Heading 4", type: "string" }),
    defineField({ name: "sectionParagraph4", title: "Section Paragraph 4", type: "text" }),
    defineField({ name: "seoTitle", title: "SEO Title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "text" }),
    defineField({ name: "seoImage", title: "SEO Image", type: "image", fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })] }),
  ],
  preview: {
    select: { title: 'projectName', subtitle: 'client' },
    prepare: (selection) => ({ title: selection.title, subtitle: selection.subtitle }),
  },
});
