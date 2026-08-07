import type { MetadataRoute } from "next";
import { site } from "@/lib/data";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} · ${site.nameRu}`,
    short_name: site.name,
    description: site.descriptionShort,
    start_url: "/",
    display: "standalone",
    background_color: "#060505",
    theme_color: "#060505",
    lang: "ru",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
