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
    defineField({
      name: 'introLargeHeading',
      title: 'Intro Large Heading',
      type: 'text',
      description: 'The large heading that appears below the manifesto paragraph. e.g. "Each stage of our process carries the same intent..."',
    }),
    defineField({
      name: 'introSecondaryParagraph',
      title: 'Intro Secondary Paragraph',
      type: 'text',
      description: 'The second paragraph in the intro section below the large heading.',
    }),
    defineField({ name: 'ctaLabel', title: 'CTA Button Label', type: 'string' }),
    defineField({ name: 'ctaUrl', title: 'CTA Button URL', type: 'string' }),
    defineField({
      name: 'teamMembers',
      title: 'Team Members',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'name', title: 'Name', type: 'string' }),
          defineField({ name: 'role', title: 'Role / Job Title', type: 'string' }),
          defineField({ name: 'bio', title: 'Bio', type: 'text' }),
          defineField({
            name: 'photo',
            title: 'Photo',
            type: 'image',
            fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
          }),
        ],
        preview: { select: { title: 'name', subtitle: 'role' } },
      }],
    }),
    defineField({ name: "seoTitle", title: "SEO Title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "text" }),
  ],
  preview: { prepare: () => ({ title: 'About Page' }) },
});
