import { defineConfig } from "sanity";
import { schemas } from "./src/lib/sanity/schemas";

export default defineConfig({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  basePath: "/studio",
  plugins: [],
  schema: {
    types: schemas,
  },
});
