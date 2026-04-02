import { defineType, defineField } from "sanity";

export const footer = defineType({
  name: "footer",
  title: "Footer",
  type: "document",
  fields: [
    defineField({
      name: "footerNavLinks",
      title: "Footer Nav Links",
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
    defineField({
      name: "legalLinks",
      title: "Legal Links",
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
    defineField({ name: "builtByText", title: "Built By Text", type: "string" }),
    defineField({ name: "builtByUrl", title: "Built By URL", type: "string" }),
  ],
});
