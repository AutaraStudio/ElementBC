import { defineType, defineField } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero Eyebrow", type: "string" }),
    defineField({ name: "heroHeading", title: "Hero Heading", type: "string" }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),
    defineField({ name: "introEyebrow", title: "Intro Eyebrow", type: "string" }),
    defineField({ name: "introHeading", title: "Intro Heading", type: "string" }),
    defineField({ name: "introParagraph", title: "Intro Paragraph", type: "text" }),
    defineField({
      name: "introImage",
      title: "Intro Image",
      type: "image",
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),
    defineField({ name: "seoTitle", title: "SEO Title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "text" }),
  ],
  preview: { prepare: () => ({ title: 'About Page' }) },
});
