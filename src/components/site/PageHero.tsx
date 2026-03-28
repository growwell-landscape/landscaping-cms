import Link from "next/link";

import { ScrollReveal } from "./ScrollReveal";
import { SectionContainer } from "./SectionContainer";

interface PageHeroProps {
  description: string;
  primaryCtaHref?: string;
  primaryCtaLabel?: string;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
  subtitle?: string;
  title: string;
}

export function PageHero({
  description,
  primaryCtaHref,
  primaryCtaLabel,
  secondaryCtaHref,
  secondaryCtaLabel,
  subtitle,
  title,
}: Readonly<PageHeroProps>) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--site-color-border)] pb-16 pt-32 md:pb-20 md:pt-36">
      <div aria-hidden="true" className="site-page-hero absolute inset-0" />
      <SectionContainer className="relative">
        <div className="mx-auto max-w-4xl text-center">
          {subtitle ? (
            <ScrollReveal>
              <p
                className="text-sm font-semibold uppercase tracking-[0.28em]"
                style={{ color: "color-mix(in srgb, var(--site-color-hero-text) 82%, transparent)" }}
              >
                {subtitle}
              </p>
            </ScrollReveal>
          ) : null}
          <ScrollReveal delayMs={40}>
            <h1
              className="site-heading mt-4 text-4xl font-semibold leading-tight md:text-5xl"
              style={{ color: "var(--site-color-hero-text)" }}
            >
              {title}
            </h1>
          </ScrollReveal>
          <ScrollReveal delayMs={80}>
            <p
              className="mx-auto mt-5 max-w-3xl text-base leading-relaxed md:text-lg"
              style={{ color: "var(--site-color-hero-muted-text)" }}
            >
              {description}
            </p>
          </ScrollReveal>
          {primaryCtaLabel && primaryCtaHref ? (
            <ScrollReveal delayMs={120}>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  className="site-button-primary inline-flex h-12 items-center justify-center rounded-[5px] px-7 text-sm font-semibold"
                  href={primaryCtaHref}
                >
                  {primaryCtaLabel}
                </Link>
                {secondaryCtaLabel && secondaryCtaHref ? (
                  <Link
                    className="inline-flex h-12 items-center justify-center rounded-[5px] border px-7 text-sm font-semibold transition-colors"
                    href={secondaryCtaHref}
                    style={{
                      borderColor:
                        "color-mix(in srgb, var(--site-color-hero-text) 45%, transparent)",
                      color: "var(--site-color-hero-text)",
                    }}
                  >
                    {secondaryCtaLabel}
                  </Link>
                ) : null}
              </div>
            </ScrollReveal>
          ) : null}
        </div>
      </SectionContainer>
    </section>
  );
}
