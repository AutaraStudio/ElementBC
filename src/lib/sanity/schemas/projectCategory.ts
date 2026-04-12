import { defineType, defineField } from "sanity";
import { TagIcon } from "@sanity/icons";

export const projectCategory = defineType({
  name: "projectCategory",
  title: "Project Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'name' } },
});
