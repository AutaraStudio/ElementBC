import { defineType, defineField } from "sanity";

export const serviceGroup = defineType({
  name: "serviceGroup",
  title: "Service Group",
  type: "object",
  fields: [
    defineField({
      name: "groupTitle",
      title: "Group Title",
      type: "string",
      description: "e.g. Project Management, Building Surveying",
    }),
    defineField({
      name: "items",
      title: "Service Items",
      type: "array",
      of: [{ type: "string" }],
      description: "List of services under this group",
    }),
  ],
  preview: {
    select: { title: "groupTitle" },
  },
});
