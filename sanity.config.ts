import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { schemas } from "./src/lib/sanity/schemas";
import { structure } from "./src/lib/sanity/structure";

export default defineConfig({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  basePath: "/studio",
  plugins: [deskTool({ structure })],
  schema: {
    types: schemas,
  },
});
