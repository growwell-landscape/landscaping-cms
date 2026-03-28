import { ScrollReveal } from "./ScrollReveal";
import { SectionContainer } from "./SectionContainer";
import { SectionHeading } from "./SectionHeading";

interface AboutMissionVisionProps {
  missionDescription: string;
  missionTitle: string;
  subtitle?: string;
  title: string;
  visionDescription: string;
  visionTitle: string;
}

export function AboutMissionVision({
  missionDescription,
  missionTitle,
  subtitle,
  title,
  visionDescription,
  visionTitle,
}: Readonly<AboutMissionVisionProps>) {
  return (
    <section className="site-surface py-20 md:py-24">
      <SectionContainer>
        <SectionHeading subtitle={subtitle} title={title} />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {[
            { description: missionDescription, title: missionTitle },
            { description: visionDescription, title: visionTitle },
          ].map((item, index) => (
            <ScrollReveal
              className="rounded-[5px] border border-[var(--site-color-border)] bg-[var(--site-color-surface-elevated)] p-7 shadow-sm"
              delayMs={60 + index * 60}
              key={item.title}
            >
              <h3 className="site-heading text-2xl font-semibold text-[var(--site-color-foreground)]">
                {item.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-[var(--site-color-muted-foreground)]">
                {item.description}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}
