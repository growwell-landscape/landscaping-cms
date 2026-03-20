"use client";

import Image from "next/image";
import { useMemo, useState, type CSSProperties } from "react";
import { Leaf } from "lucide-react";

import { cn } from "@/lib/utils";

interface SiteImageProps {
  alt: string;
  src?: string | null;
  className?: string;
  imgClassName?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
  sizes?: string;
  style?: CSSProperties;
}

function normalizeImageSource(src?: string | null): string {
  if (!src) return "";
  return src.trim();
}

function isRemoteImageSource(src: string): boolean {
  return /^https?:\/\//i.test(src);
}

function isSvgSource(src: string): boolean {
  return /\.svg(\?.*)?$/i.test(src);
}

export function SiteImage({
  alt,
  src,
  className,
  imgClassName,
  loading = "lazy",
  priority = false,
  sizes = "100vw",
  style,
}: Readonly<SiteImageProps>) {
  const [hasError, setHasError] = useState(false);
  const normalizedSrc = useMemo(() => normalizeImageSource(src), [src]);
  const canRenderImage = normalizedSrc.length > 0 && !hasError;
  const shouldUseOptimizedImage =
    canRenderImage &&
    !isRemoteImageSource(normalizedSrc) &&
    !isSvgSource(normalizedSrc);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {shouldUseOptimizedImage ? (
        <Image
          alt={alt}
          className={cn("object-cover object-center", imgClassName)}
          fill
          onError={() => setHasError(true)}
          priority={priority}
          sizes={sizes}
          src={normalizedSrc}
          style={style}
        />
      ) : canRenderImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={alt}
          className={cn("h-full w-full object-cover object-center", imgClassName)}
          decoding="async"
          loading={loading}
          onError={() => setHasError(true)}
          src={normalizedSrc}
          style={style}
        />
      ) : (
        <div
          aria-label={alt}
          className="flex h-full w-full items-center justify-center border border-[var(--site-color-border)] bg-[var(--site-color-surface-muted)] text-[var(--site-color-muted-foreground)]"
          role="img"
        >
          <Leaf aria-hidden="true" className="h-8 w-8" />
        </div>
      )}
    </div>
  );
}
