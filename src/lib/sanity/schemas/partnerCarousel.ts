import { defineType, defineField } from "sanity";

export const partnerCarousel = defineType({
  name: "partnerCarousel",
  title: "Partner Carousel",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: 'e.g. "Trusted by those who rely on detail & value clarity"',
    }),
  ],
  preview: { prepare: () => ({ title: "Partner Carousel" }) },
});
