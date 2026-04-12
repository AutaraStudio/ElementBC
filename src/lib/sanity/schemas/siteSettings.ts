import { defineType, defineField } from "sanity";
import { CogIcon } from "@sanity/icons";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({ name: "siteTitle", title: "Site Title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "text" }),
    defineField({ name: "seoImage", title: "SEO Image", type: "image", fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })] }),
    defineField({ name: "favicon", title: "Favicon", type: "image", fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })] }),
  ],
  preview: { select: { title: 'siteTitle' } },
});
