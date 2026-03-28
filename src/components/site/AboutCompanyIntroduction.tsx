import { ScrollReveal } from "./ScrollReveal";
import { SectionContainer } from "./SectionContainer";
import { SiteImage } from "./SiteImage";

interface AboutCompanyIntroductionProps {
  description: string;
  eyebrow?: string;
  imagePath?: string;
  imageFallbackText?: string;
  title: string;
}

export function AboutCompanyIntroduction({
  description,
  eyebrow,
  imagePath,
  imageFallbackText,
  title,
}: Readonly<AboutCompanyIntroductionProps>) {
  return (
    <section className="site-surface py-20 md:py-24">
      <SectionContainer>
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <ScrollReveal>
            <div>
              {eyebrow ? (
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--site-color-primary)]">
                  {eyebrow}
                </p>
              ) : null}
              <h2 className="site-heading mt-4 text-3xl font-semibold leading-tight text-[var(--site-color-foreground)] md:text-4xl">
                {title}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[var(--site-color-muted-foreground)] md:text-lg">
                {description}
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal
            className="overflow-hidden rounded-[5px] border border-[var(--site-color-border)] bg-[var(--site-color-muted)]"
            delayMs={80}
            variant="zoom"
          >
            {imagePath ? (
              <SiteImage
                alt={`${title} image`}
                className="h-[320px] w-full md:h-[420px]"
                imgClassName="object-cover"
                src={imagePath}
              />
            ) : (
              <div className="flex h-[320px] items-center justify-center bg-[var(--site-color-accent)] px-8 text-center text-base text-[var(--site-color-muted-foreground)] md:h-[420px]">
                {imageFallbackText || ""}
              </div>
            )}
          </ScrollReveal>
        </div>
      </SectionContainer>
    </section>
  );
}
