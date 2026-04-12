import { defineType, defineField } from "sanity";
import { StarIcon } from "@sanity/icons";

export const partnerCarousel = defineType({
  name: "partnerCarousel",
  title: "Partner Carousel",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: 'e.g. "Trusted by those who rely on detail & value clarity"',
    }),
    defineField({
      name: "partners",
      title: "Partners",
      description: "Add partner logos here. Upload SVG files for best quality. They will display in the scrolling carousel.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Partner Name",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "logo",
              title: "Logo (SVG)",
              type: "image",
              description: "Upload an SVG logo file. The logo will inherit the site's text colour automatically.",
              validation: (r) => r.required(),
              options: { accept: "image/svg+xml" },
            }),
          ],
          preview: {
            select: { title: "name", media: "logo" },
          },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Partner Carousel" }) },
});
