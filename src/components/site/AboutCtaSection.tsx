import Link from "next/link";

import { ScrollReveal } from "./ScrollReveal";
import { SectionContainer } from "./SectionContainer";

interface AboutCtaSectionProps {
  description: string;
  primaryCtaHref: string;
  primaryCtaLabel: string;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
  title: string;
}

export function AboutCtaSection({
  description,
  primaryCtaHref,
  primaryCtaLabel,
  secondaryCtaHref,
  secondaryCtaLabel,
  title,
}: Readonly<AboutCtaSectionProps>) {
  return (
    <section className="site-surface-muted py-20 md:py-24">
      <SectionContainer>
        <ScrollReveal>
          <div className="rounded-[5px] bg-[var(--site-color-accent)] px-6 py-10 text-center md:px-10 md:py-12">
            <h2 className="site-heading text-3xl font-semibold text-[var(--site-color-foreground)] md:text-4xl">
              {title}
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-[var(--site-color-muted-foreground)] md:text-lg">
              {description}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                className="site-button-primary inline-flex h-12 items-center justify-center rounded-[5px] px-7 text-sm font-semibold"
                href={primaryCtaHref}
              >
                {primaryCtaLabel}
              </Link>
              {secondaryCtaLabel && secondaryCtaHref ? (
                <Link
                  className="inline-flex h-12 items-center justify-center rounded-[5px] border border-[var(--site-color-border)] bg-[var(--site-color-surface)] px-7 text-sm font-semibold text-[var(--site-color-foreground)] transition-colors hover:border-[var(--site-color-primary)] hover:text-[var(--site-color-primary)]"
                  href={secondaryCtaHref}
                >
                  {secondaryCtaLabel}
                </Link>
              ) : null}
            </div>
          </div>
        </ScrollReveal>
      </SectionContainer>
    </section>
  );
}
