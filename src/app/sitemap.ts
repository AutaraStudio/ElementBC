import type { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/sanity/queries";
import { SITE_URL } from "@/lib/siteUrl";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/about",
    "/case-studies",
    "/contact",
    "/privacy-policy",
    "/terms-conditions",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const projects = await getAllProjects();
  const projectRoutes = projects.map((project) => ({
    url: `${SITE_URL}/case-studies/${project.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...projectRoutes];
}
