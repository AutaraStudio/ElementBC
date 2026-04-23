import { defineType, defineField } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const legalPage = defineType({
  name: "legalPage",
  title: "Legal Page",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "content", title: "Content" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    /* ── Hero ── */
    defineField({ name: "heroEyebrow", title: "Eyebrow", type: "string", group: "hero" }),
    defineField({ name: "heroHeading", title: "Heading", type: "string", group: "hero" }),

    /* ── Content ── */
    defineField({
      name: "lastUpdated",
      title: "Last Updated",
      type: "date",
      group: "content",
      description: "Shown at the top of the page so visitors can see when the policy was last revised.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      group: "content",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  defineField({ name: "href", title: "URL", type: "url", validation: (r) => r.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }) }),
                ],
              },
            ],
          },
        },
      ],
    }),

    /* ── SEO ── */
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
      validation: (r) => r.max(60).warning("Keep under 60 characters"),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      group: "seo",
      validation: (r) => r.max(160).warning("Keep under 160 characters"),
    }),
  ],
  preview: {
    select: { title: "heroHeading" },
    prepare: ({ title }) => ({ title: title || "Legal Page" }),
  },
});
