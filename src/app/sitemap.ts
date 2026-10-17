import type { MetadataRoute } from "next";
import { toolCategories, getAvailableTools, toolHref } from "@/lib/tools/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://modaltools.com";

  // Páginas institucionais
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/recursos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ferramentas`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // Categorias de ferramentas
  const categoryRoutes: MetadataRoute.Sitemap = toolCategories.map((cat) => ({
    url: `${baseUrl}/ferramentas/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Apenas ferramentas com status 'available' entram no sitemap
  const availableToolRoutes: MetadataRoute.Sitemap = getAvailableTools().map(
    ({ category, tool }) => ({
      url: `${baseUrl}${toolHref(category.slug, tool.slug)}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    })
  );

  return [...staticRoutes, ...categoryRoutes, ...availableToolRoutes];
}
