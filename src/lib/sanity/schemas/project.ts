import { defineType, defineField } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({ name: "projectName", title: "Project Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "projectName" }, validation: (r) => r.required() }),
    defineField({ name: "projectCategory", title: "Type / Category", type: "reference", to: [{ type: "projectCategory" }] }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "size", title: "Size", type: "string" }),
    defineField({ name: "client", title: "Client", type: "string" }),
    defineField({ name: "contractor", title: "Contractor", type: "string" }),
    defineField({ name: "mep", title: "MEP", type: "string" }),
    defineField({ name: "ourRole", title: "Our Role", type: "text", rows: 3 }),
    defineField({ name: "duration", title: "Duration", type: "string" }),
    defineField({ name: "completedDate", title: "Completed Date", type: "string" }),
    defineField({ name: "featuredImage1", title: "Featured Image", type: "image", fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })] }),
    defineField({ name: "featuredImage2", title: "Featured Image 2 (Hover)", type: "image", description: "Secondary image revealed on hover in the home hero", fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })] }),
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
    defineField({ name: "seoTitle", title: "SEO Title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "text" }),
  ],
  preview: {
    select: { title: 'projectName', subtitle: 'client' },
    prepare: (selection) => ({ title: selection.title, subtitle: selection.subtitle }),
  },
});
