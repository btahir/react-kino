import { storyRecipes } from "react-kino/recipes";
import { source } from "@/lib/source";
import type { MetadataRoute } from "next";

const BASE_URL = "https://www.react-kino.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages();

  const docEntries: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${BASE_URL}${page.url}`,
    changeFrequency: "weekly",
    priority: page.url === "/docs" ? 0.9 : 0.7,
  }));

  return [
    {
      url: BASE_URL,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...docEntries,
    ...[
      "/studio",
      "/playground",
      "/templates",
      "/templates/product-launch",
      "/templates/case-study",
      "/templates/portfolio",
      ...storyRecipes.map((r) => `/recipes/${r.id}`),
    ].map((path) => ({ url: `${BASE_URL}${path}` })),
  ];
}
