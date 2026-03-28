import type { TeamMember } from "@/types/config";

import { ScrollReveal } from "./ScrollReveal";
import { SiteImage } from "./SiteImage";

interface AboutTeamCardProps {
  delayMs?: number;
  member: TeamMember;
  socialLabel?: string;
}

export function AboutTeamCard({
  delayMs = 0,
  member,
  socialLabel,
}: Readonly<AboutTeamCardProps>) {
  return (
    <ScrollReveal
      className="w-full max-w-[360px] overflow-hidden rounded-[5px] border border-[var(--site-color-border)] bg-[var(--site-color-surface-elevated)] shadow-sm"
      delayMs={delayMs}
    >
      <div className="p-2">
        {(member.image || member.designation) ? (
          <div className="grid grid-cols-[96px_1fr] items-center gap-4">
            {member.image ? (
              <div className="h-20 w-20 overflow-hidden rounded-full bg-[var(--site-color-muted)]">
                <SiteImage
                  alt={`${member.name} profile`}
                  className="h-full w-full"
                  imgClassName="object-cover"
                  src={member.image}
                />
              </div>
            ) : (
              <div className="h-20 w-20 rounded-full bg-[var(--site-color-accent)]" />
            )}
            <div>
              {member.name ? (
                <h3 className="site-heading text-2xl font-semibold text-[var(--site-color-foreground)]">
                  {member.name}
                </h3>
              ) : null}
              {member.designation ? (
                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--site-color-primary)]">
                  {member.designation}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
        {!member.image && !member.designation && member.name ? (
          <h3 className="site-heading text-center text-l font-semibold text-[var(--site-color-foreground)]">
            {member.name}
          </h3>
        ) : null}
        {member.instagramProfile ? (
          <a
            className="mt-5 inline-flex w-full items-center justify-center text-sm font-semibold text-[var(--site-color-primary)] hover:underline"
            href={member.instagramProfile}
            rel="noopener noreferrer"
            target="_blank"
          >
            {socialLabel || "Instagram"}
          </a>
        ) : null}
      </div>
    </ScrollReveal>
  );
}
