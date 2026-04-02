import { defineType, defineField } from "sanity";

export const navigation = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  fields: [
    defineField({
      name: "navLinks",
      title: "Nav Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "url", title: "URL", type: "string" }),
          ],
        },
      ],
    }),
    defineField({ name: "ctaLabel", title: "CTA Label", type: "string" }),
    defineField({ name: "ctaUrl", title: "CTA URL", type: "string" }),
  ],
});
