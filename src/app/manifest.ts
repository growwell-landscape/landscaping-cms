import type { MetadataRoute } from "next";

import { getSiteCommonData } from "@/lib/site-data";
import { resolveSearchTitle } from "@/lib/seo";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { adminConfig, homeHref } = await getSiteCommonData();
  const icon = adminConfig.seo.favicon || adminConfig.site.logo.imageUrl || "/favicon.ico";
  const searchTitle = resolveSearchTitle(adminConfig.seo, adminConfig.site);

  return {
    background_color: adminConfig.theme.colors.background,
    description: adminConfig.seo.description,
    display: "standalone",
    icons: [
      {
        sizes: "192x192",
        src: icon,
        type: "image/png",
      },
      {
        sizes: "512x512",
        src: icon,
        type: "image/png",
      },
    ],
    name: searchTitle,
    short_name: adminConfig.site.name || searchTitle,
    start_url: homeHref,
    theme_color: adminConfig.theme.colors.primary,
  };
}
