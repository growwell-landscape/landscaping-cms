import type { MetadataRoute } from "next";

import { getSiteCommonData } from "@/lib/site-data";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { adminConfig, homeHref } = await getSiteCommonData();
  const icon = adminConfig.seo.favicon || adminConfig.site.logo.imageUrl || "/favicon.ico";

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
    name: adminConfig.site.companyName || adminConfig.site.name,
    short_name: adminConfig.site.name,
    start_url: homeHref,
    theme_color: adminConfig.theme.colors.primary,
  };
}
