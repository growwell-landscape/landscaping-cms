import type { MetadataRoute } from "next";
import { headers } from "next/headers";

import { resolveMetadataBase, toAbsoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const fallbackBase = resolveMetadataBase();
  const requestHeaders = headers();
  const forwardedHost = requestHeaders.get("x-forwarded-host");
  const host = forwardedHost || requestHeaders.get("host");
  const protoHeader = requestHeaders.get("x-forwarded-proto");
  const protocol = protoHeader || (host?.includes("localhost") ? "http" : "https");
  let metadataBase = fallbackBase;
  if (host) {
    try {
      metadataBase = new URL(`${protocol}://${host}`);
    } catch {
      metadataBase = fallbackBase;
    }
  }

  return {
    host: metadataBase.origin,
    rules: [
      {
        allow: "/",
        disallow: ["/admin", "/api"],
        userAgent: "*",
      },
    ],
    sitemap: toAbsoluteUrl("/sitemap.xml", metadataBase),
  };
}
