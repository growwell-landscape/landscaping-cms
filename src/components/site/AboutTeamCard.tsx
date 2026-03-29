import type { TeamMember } from "@/types/config";
import { Instagram, Linkedin } from "lucide-react";

import { ScrollReveal } from "./ScrollReveal";
import { SiteImage } from "./SiteImage";

interface AboutTeamCardProps {
  delayMs?: number;
  member: TeamMember;
}

function getMemberInitials(name?: string): string {
  const parts = (name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

export function AboutTeamCard({
  delayMs = 0,
  member,
}: Readonly<AboutTeamCardProps>) {
  const initials = getMemberInitials(member.name);

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
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--site-color-accent)] text-2xl font-semibold text-[var(--site-color-accent-foreground)]">
                {initials}
              </div>
            )}
            <div>
              {member.name ? (
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="site-heading text-2xl font-semibold text-[var(--site-color-foreground)]">
                    {member.name}
                  </h3>
                  {member.linkedinProfile ? (
                    <a
                      aria-label="LinkedIn"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--site-color-border)] text-[var(--site-color-primary)] transition-colors hover:bg-[var(--site-color-accent)]"
                      href={member.linkedinProfile}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  ) : null}
                  {member.instagramProfile ? (
                    <a
                      aria-label="Instagram"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--site-color-border)] text-[var(--site-color-primary)] transition-colors hover:bg-[var(--site-color-accent)]"
                      href={member.instagramProfile}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Instagram className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
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
          <div className="flex flex-wrap items-center justify-center gap-2">
            <h3 className="site-heading text-center text-l font-semibold text-[var(--site-color-foreground)]">
              {member.name}
            </h3>
            {member.linkedinProfile ? (
              <a
                aria-label="LinkedIn"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--site-color-border)] text-[var(--site-color-primary)] transition-colors hover:bg-[var(--site-color-accent)]"
                href={member.linkedinProfile}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            ) : null}
            {member.instagramProfile ? (
              <a
                aria-label="Instagram"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--site-color-border)] text-[var(--site-color-primary)] transition-colors hover:bg-[var(--site-color-accent)]"
                href={member.instagramProfile}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Instagram className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </ScrollReveal>
  );
}
