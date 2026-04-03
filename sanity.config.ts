import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemas } from "./src/lib/sanity/schemas";
import { structure } from "./src/lib/sanity/structure";

export default defineConfig({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  basePath: "/studio",
  plugins: [structureTool({ structure })],
  schema: {
    types: schemas,
  },
});
