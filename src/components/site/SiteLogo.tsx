import type { CSSProperties } from "react";

import type { LogoConfig } from "@/types/config";
import { cn } from "@/lib/utils";

interface SiteLogoProps {
  className?: string;
  companyName: string;
  logo: LogoConfig;
  logoText: string;
  siteName: string;
}

function getCompanySuffix(companyName: string, siteName: string): string {
  const suffix = companyName.replace(siteName, "").trim();
  return suffix || companyName;
}

function resolveDisplayMode(logo: LogoConfig): "generated-with-name" | "image-with-name" | "image-only" {
  if (logo.displayMode) {
    const normalizedMode = logo.displayMode.trim().toLowerCase().replace(/[_\s]+/g, "-");
    if (normalizedMode.includes("generated")) {
      return "generated-with-name";
    }
    if (normalizedMode.includes("only")) {
      return "image-only";
    }
    if (normalizedMode.includes("image")) {
      return "image-with-name";
    }
  }

  if (logo.type === "image") {
    return logo.showText === false ? "image-only" : "image-with-name";
  }

  return "generated-with-name";
}

function renderLogoBadge(logo: LogoConfig, logoText: string, siteName: string) {
  const hasImage = Boolean(logo.imageUrl && logo.imageUrl.trim().length > 0);
  if (!hasImage) {
    return (
      <span className="grid h-9 w-9 place-items-center rounded-[5px] bg-[var(--site-color-primary)] text-xs font-bold uppercase text-white">
        {logoText}
      </span>
    );
  }

  const imageStyle: CSSProperties = {
    mixBlendMode: logo.imageBlendMode || "multiply",
    objectFit: logo.imageObjectFit || "contain",
  };

  return (
    <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-[5px] bg-[var(--site-color-accent)] p-1.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={`${siteName} logo`}
        className="h-full w-full"
        src={logo.imageUrl}
        style={imageStyle}
      />
    </span>
  );
}

/**
 * Shared brand logo block for header and footer.
 */
export function SiteLogo({ className, companyName, logo, logoText, siteName }: SiteLogoProps) {
  const companySuffix = getCompanySuffix(companyName, siteName);
  const mode = resolveDisplayMode(logo);
  const onlyImage = mode === "image-only";
  const showImage = mode !== "generated-with-name";
  const logoWithMode = showImage ? logo : { ...logo, imageUrl: "" };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {renderLogoBadge(logoWithMode, logoText, siteName)}
      {!onlyImage ? (
        <span className="leading-tight">
          <span className="site-heading block text-base font-semibold">{siteName}</span>
          <span className="block text-[10px] uppercase tracking-wide opacity-70">{companySuffix}</span>
        </span>
      ) : null}
    </div>
  );
}
