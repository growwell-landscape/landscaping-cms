"use client";

import { useState } from "react";

interface ContactLocationMapProps {
  mapEmbedUrl: string;
  title: string;
}

export function ContactLocationMap({ mapEmbedUrl, title }: ContactLocationMapProps) {
  const [iframeKey, setIframeKey] = useState(0);

  return (
    <div className="relative mt-6 overflow-hidden rounded-[5px] border border-[var(--site-color-border)] bg-[var(--site-color-muted)]">
      <button
        aria-label="Go to configured location"
        className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-[5px] border border-[var(--site-color-border)] bg-white/95 text-base text-[var(--site-color-foreground)] shadow-sm transition-colors hover:border-[var(--site-color-primary)] hover:text-[var(--site-color-primary)]"
        onClick={() => setIframeKey((value) => value + 1)}
        title="Go to configured location"
        type="button"
      >
        {"\u{1F4CD}"}
      </button>
      <iframe
        key={iframeKey}
        aria-label={`${title} map preview`}
        className="h-[420px] w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={mapEmbedUrl}
        title={`${title} map`}
      />
    </div>
  );
}
