import type { TeamMember } from "@/types/config";

import { AboutTeamCard } from "./AboutTeamCard";
import { ScrollReveal } from "./ScrollReveal";
import { SectionContainer } from "./SectionContainer";
import { SectionHeading } from "./SectionHeading";

interface AboutTeamSectionProps {
  description?: string;
  members: TeamMember[];
  socialLabel?: string;
  subtitle?: string;
  title: string;
}

export function AboutTeamSection({
  description,
  members,
  socialLabel,
  subtitle,
  title,
}: Readonly<AboutTeamSectionProps>) {
  if (members.length === 0) {
    return null;
  }

  const gridClassName =
    members.length === 1
      ? "grid-cols-1"
      : members.length === 2
        ? "grid-cols-1 md:grid-cols-2"
        : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";

  return (
    <section className="site-surface-muted py-20 md:py-24">
      <SectionContainer>
        <SectionHeading subtitle={subtitle} title={title} />
        {description ? (
          <ScrollReveal delayMs={50}>
            <p className="mx-auto mt-5 max-w-3xl text-center text-base leading-relaxed text-[var(--site-color-muted-foreground)]">
              {description}
            </p>
          </ScrollReveal>
        ) : null}
        <div className={`mt-10 grid w-full justify-items-center gap-5 ${gridClassName}`}>
          {members.map((member, index) => (
            <AboutTeamCard
              delayMs={80 + index * 40}
              key={`${member.name}-${index}`}
              member={member}
              socialLabel={socialLabel}
            />
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}
