import { defineType, defineField } from "sanity";

export const orbitStatItem = defineType({
  name: "orbitStatItem",
  title: "Orbit Stat Item",
  type: "object",
  fields: [
    defineField({
      name: "statValue",
      title: "Value",
      type: "string",
      description: "e.g. £350m or 25+",
    }),
    defineField({
      name: "statLabel",
      title: "Label",
      type: "string",
      description: "e.g. Combined Value of Projects Delivered",
    }),
  ],
  preview: {
    select: { title: "statValue" },
  },
});
