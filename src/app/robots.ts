import type { MetadataRoute } from "next";
import { site } from "@/lib/data";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || site.url;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/admin/", "/api/"] },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
