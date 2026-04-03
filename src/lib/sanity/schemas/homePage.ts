import { defineType, defineField } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({ name: "heroHeading", title: "Hero Heading", type: "string" }),
    defineField({ name: "heroViewProjectText", title: "Hero View Project Text", type: "string" }),
    defineField({
      name: "heroProject",
      title: "Hero Featured Project",
      description: "The project displayed in the homepage hero. Its Featured Image 1 becomes the primary image and Featured Image 2 becomes the hover image.",
      type: "reference",
      to: [{ type: "project" }],
    }),
    defineField({ name: "aboutHeading", title: "About Heading", type: "string" }),
    defineField({
      name: "aboutImage",
      title: "About Image",
      type: "image",
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),
    defineField({ name: "statsHeading", title: "Stats Heading", type: "string" }),
    defineField({
      name: "statsItems",
      title: "Stats Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "statLabel", title: "Stat Label", type: "string" }),
            defineField({ name: "statValue", title: "Stat Value", type: "string" }),
          ],
        },
      ],
    }),
    defineField({
      name: "featuredProjects",
      title: "Featured Projects",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }] }],
    }),
  ],
  preview: { prepare: () => ({ title: 'Home Page' }) },
});
