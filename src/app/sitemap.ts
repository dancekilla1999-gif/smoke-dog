import type { MetadataRoute } from "next";
import { site } from "@/lib/data";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || site.url;

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/menu", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/events", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/gallery", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/banquets", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/loyalty", priority: 0.75, changeFrequency: "monthly" as const },
    { path: "/contacts", priority: 0.95, changeFrequency: "monthly" as const },
    { path: "/review", priority: 0.6, changeFrequency: "monthly" as const },
  ];

  return pages.map((p) => ({
    url: `${baseUrl}${p.path}`,
    lastModified: new Date(),
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
