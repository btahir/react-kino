import { source } from "@/lib/source";
import type { MetadataRoute } from "next";

const BASE_URL = "https://react-kino.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages();

  const docEntries: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${BASE_URL}${page.url}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: page.url === "/docs" ? 0.9 : 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...docEntries,
  ];
}
