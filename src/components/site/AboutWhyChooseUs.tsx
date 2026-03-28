import { CheckCircle2 } from "lucide-react";

import type { AboutFeature } from "@/types/config";

import { ScrollReveal } from "./ScrollReveal";
import { SectionContainer } from "./SectionContainer";
import { SectionHeading } from "./SectionHeading";

interface AboutWhyChooseUsProps {
  items: AboutFeature[];
  subtitle?: string;
  title: string;
}

export function AboutWhyChooseUs({
  items,
  subtitle,
  title,
}: Readonly<AboutWhyChooseUsProps>) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="site-surface-muted py-20 md:py-24">
      <SectionContainer>
        <SectionHeading subtitle={subtitle} title={title} />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {items.map((item, index) => (
            <ScrollReveal
              className="rounded-[5px] border border-[var(--site-color-border)] bg-[var(--site-color-surface-elevated)] p-6 shadow-sm"
              delayMs={70 + index * 40}
              key={`${item.title}-${index}`}
            >
              <div className="flex items-start gap-4">
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[5px] bg-[var(--site-color-accent)] text-[var(--site-color-primary)]">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="site-heading text-xl font-semibold text-[var(--site-color-foreground)]">
                    {item.title}
                  </h3>
                  {item.description ? (
                    <p className="mt-3 text-sm leading-relaxed text-[var(--site-color-muted-foreground)]">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}
