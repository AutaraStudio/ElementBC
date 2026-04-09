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
    defineField({
      name: "barWidth",
      title: "Bar Width (%)",
      type: "number",
      description: "Width of this stat's bar in the bar graph component (0–100). Wider = more visually prominent.",
      validation: (Rule) => Rule.min(0).max(100),
    }),
  ],
  preview: {
    select: { title: "statValue" },
  },
});
