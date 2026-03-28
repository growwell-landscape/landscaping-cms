import Link from "next/link";

import { ROUTES } from "@/lib/constants";
import { createLocalizedPath } from "@/lib/site-i18n";
import type { Service } from "@/types/content";

import { ScrollReveal } from "./ScrollReveal";
import { SectionContainer } from "./SectionContainer";
import { SectionHeading } from "./SectionHeading";

interface AboutServicesOverviewProps {
  currentLanguageCode: string;
  description?: string;
  emptyStateText?: string;
  introText?: string;
  languageCodes: string[];
  services: Service[];
  title: string;
}

export function AboutServicesOverview({
  currentLanguageCode,
  description,
  emptyStateText,
  introText,
  languageCodes,
  services,
  title,
}: Readonly<AboutServicesOverviewProps>) {
  return (
    <section className="site-surface py-20 md:py-24">
      <SectionContainer>
        <SectionHeading title={title} />
        <ScrollReveal delayMs={70}>
          <div className="mx-auto mt-8 max-w-4xl rounded-[5px] border border-[var(--site-color-border)] bg-[var(--site-color-accent)] px-6 py-7 text-left md:px-8">
            {description ? (
              <p className="text-base leading-relaxed text-[var(--site-color-foreground)]">
                {description}
              </p>
            ) : null}
            {services.length > 0 ? (
              <p className="mt-3 text-base leading-relaxed text-[var(--site-color-muted-foreground)]">
                <span>{introText || ""} </span>
                {services.map((service, index) => {
                  const href = createLocalizedPath(
                    `${ROUTES.SERVICE_DETAIL}/${service.id}`,
                    currentLanguageCode,
                    languageCodes
                  );
                  const isLast = index === services.length - 1;
                  const isSecondLast = index === services.length - 2;
                  const separator =
                    services.length === 1
                      ? "."
                      : isLast
                        ? "."
                        : isSecondLast
                          ? ", and "
                          : ", ";

                  return (
                    <span key={service.id}>
                      <Link
                        className="font-medium text-[var(--site-color-primary)] underline-offset-4 transition-colors hover:underline"
                        href={href}
                      >
                        {service.title}
                      </Link>
                      {separator}
                    </span>
                  );
                })}
              </p>
            ) : (
              <p className="mt-3 text-base leading-relaxed text-[var(--site-color-muted-foreground)]">
                {emptyStateText || ""}
              </p>
            )}
          </div>
        </ScrollReveal>
      </SectionContainer>
    </section>
  );
}
