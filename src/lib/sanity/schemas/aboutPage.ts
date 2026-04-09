import { defineType, defineField } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero Eyebrow", type: "string" }),
    defineField({ name: "heroHeading", title: "Hero Heading", type: "string" }),
    defineField({ name: "teamEyebrow", title: "Team Eyebrow", type: "string", description: 'e.g. "Founders Journey"' }),
    defineField({ name: "teamDescription", title: "Team Description", type: "text", description: 'The paragraph shown alongside the team eyebrow.' }),
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
    defineField({ name: "approachHeading", title: "Approach Heading", type: "string" }),
    defineField({ name: "approachDescription", title: "Approach Description", type: "text", rows: 3 }),
    defineField({
      name: "approachItems",
      title: "Approach Items",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "title", title: "Title", type: "string" }),
          defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
        ],
        preview: { select: { title: "title" } },
      }],
    }),
    defineField({ name: "seoTitle", title: "SEO Title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "text" }),
  ],
  preview: { prepare: () => ({ title: 'About Page' }) },
});
