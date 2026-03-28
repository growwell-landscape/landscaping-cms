import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink, FileText, Globe2, KeyRound, LayoutDashboard, Layers3, ListChecks } from "lucide-react";

import {
  ADMIN_GUIDE_NOTES,
  ADMIN_GUIDE_SECTIONS,
  ADMIN_GUIDE_WORKFLOW,
  ADMIN_TOKEN_RENEWAL_NOTICE,
} from "@/lib/admin-guide";
import { ROUTES } from "@/lib/constants";
import { getSiteCommonData } from "@/lib/site-data";
import { createAdminThemeStyle } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Admin Dashboard Info",
  description: "Guide for what can be updated in the CMS admin dashboard.",
  robots: {
    follow: false,
    index: false,
  },
};

const sectionIcons = [LayoutDashboard, Layers3, FileText, Globe2];

export default async function AdminInfoPage() {
  const { adminConfig } = await getSiteCommonData();
  const adminThemeStyle = createAdminThemeStyle(adminConfig.theme);
  const companyName =
    adminConfig.site.companyName || adminConfig.site.name || "this website";

  return (
    <main className="admin-theme min-h-screen px-4 py-8 md:px-8" style={adminThemeStyle}>
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={ROUTES.ADMIN_DASHBOARD}
            className="admin-button-outline inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          <Link
            href={ROUTES.ADMIN_DASHBOARD}
            className="admin-button-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm"
          >
            Open admin dashboard
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>

        <section className="admin-surface rounded-3xl p-6 shadow-sm md:p-8">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]" style={{ backgroundColor: "color-mix(in srgb, var(--admin-color-primary) 12%, white)", color: "var(--admin-color-primary)" }}>
              Dashboard guide
            </span>
            <div className="space-y-2">
              <h1 className="admin-heading text-3xl font-bold md:text-4xl">What can be updated in the admin dashboard</h1>
              <p className="text-sm leading-6 text-[var(--admin-color-muted-foreground)] md:text-base">
                This page explains the editable areas inside the CMS admin dashboard for {companyName} so it is clear exactly what the dashboard controls before making updates.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {ADMIN_GUIDE_SECTIONS.map((section, index) => {
            const Icon = sectionIcons[index] || LayoutDashboard;

            return (
              <article key={section.title} className="admin-surface rounded-2xl p-6 shadow-sm">
                <div className="mb-4 flex items-start gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: "color-mix(in srgb, var(--admin-color-info) 12%, white)", color: "var(--admin-color-info)" }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="admin-heading text-xl font-semibold">{section.title}</h2>
                    <p className="text-sm leading-6 text-[var(--admin-color-muted-foreground)]">{section.description}</p>
                  </div>
                </div>

                <ul className="space-y-2 text-sm leading-6 text-[var(--admin-color-foreground)]">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--admin-color-primary)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {section.subSections?.length ? (
                  <div className="mt-5 border-t border-[var(--admin-color-border)] pt-4">
                    <h3 className="admin-heading text-base font-semibold">Sub sections inside Site Configuration</h3>
                    <div className="mt-4 space-y-4">
                      {section.subSections.map((subSection) => (
                        <div key={subSection.title}>
                          <h4 className="admin-heading text-sm font-semibold">{subSection.title}</h4>
                          <p className="mt-2 text-sm leading-6 text-[var(--admin-color-muted-foreground)]">
                            {subSection.items.join(", ")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="admin-surface rounded-2xl p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{ backgroundColor: "color-mix(in srgb, var(--admin-color-success) 12%, white)", color: "var(--admin-color-success)" }}
              >
                <ListChecks className="h-5 w-5" />
              </div>
              <div>
                <h2 className="admin-heading text-xl font-semibold">Recommended dashboard workflow</h2>
                <p className="text-sm text-[var(--admin-color-muted-foreground)]">A simple step-by-step way to use the dashboard safely.</p>
              </div>
            </div>

            <ol className="space-y-3">
              {ADMIN_GUIDE_WORKFLOW.map((step, index) => (
                <li key={step} className="admin-surface-muted flex gap-4 rounded-xl p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold" style={{ backgroundColor: "var(--admin-color-primary)", color: "var(--admin-color-primary-foreground)" }}>
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6">{step}</p>
                </li>
              ))}
            </ol>
          </article>

          <article className="admin-surface rounded-2xl p-6 shadow-sm">
            <h2 className="admin-heading text-xl font-semibold">Important notes</h2>
            <div className="mt-4 space-y-3">
              {ADMIN_GUIDE_NOTES.map((note) => (
                <p
                  key={note}
                  className="rounded-xl border p-4 text-sm leading-6"
                  style={{
                    borderColor: "color-mix(in srgb, var(--admin-color-warning) 22%, white)",
                    backgroundColor: "color-mix(in srgb, var(--admin-color-warning) 8%, white)",
                  }}
                >
                  {note}
                </p>
              ))}
            </div>
          </article>
        </section>

        <section className="admin-surface rounded-2xl p-6 shadow-sm">
          <div className="mb-4 flex items-start gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl"
              style={{ backgroundColor: "color-mix(in srgb, var(--admin-color-danger) 10%, white)", color: "var(--admin-color-danger)" }}
            >
              <KeyRound className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h2 className="admin-heading text-xl font-semibold">{ADMIN_TOKEN_RENEWAL_NOTICE.title}</h2>
              <p className="text-sm leading-6 text-[var(--admin-color-muted-foreground)]">
                {ADMIN_TOKEN_RENEWAL_NOTICE.description}
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <div
              className="rounded-2xl border p-5"
              style={{
                borderColor: "color-mix(in srgb, var(--admin-color-danger) 20%, white)",
                backgroundColor: "color-mix(in srgb, var(--admin-color-danger) 5%, white)",
              }}
            >
              <h3 className="admin-heading text-base font-semibold">Why this matters</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--admin-color-foreground)]">
                {ADMIN_TOKEN_RENEWAL_NOTICE.reason}
              </p>
            </div>

            <div>
              <h3 className="admin-heading text-base font-semibold">GitHub steps</h3>
              <ol className="mt-3 space-y-3">
                {ADMIN_TOKEN_RENEWAL_NOTICE.githubSteps.map((step, index) => (
                  <li key={step} className="admin-surface-muted flex gap-4 rounded-xl p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold" style={{ backgroundColor: "var(--admin-color-danger)", color: "var(--admin-color-danger-foreground)" }}>
                      {index + 1}
                    </span>
                    <p className="text-sm leading-6">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
            <div>
              <h3 className="admin-heading text-base font-semibold">Vercel steps</h3>
              <ol className="mt-3 space-y-3">
                {ADMIN_TOKEN_RENEWAL_NOTICE.vercelSteps.map((step, index) => (
                  <li key={step} className="admin-surface-muted flex gap-4 rounded-xl p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold" style={{ backgroundColor: "var(--admin-color-info)", color: "var(--admin-color-info-foreground)" }}>
                      {index + 1}
                    </span>
                    <p className="text-sm leading-6">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div
              className="rounded-2xl border p-5"
              style={{
                borderColor: "color-mix(in srgb, var(--admin-color-info) 18%, white)",
                backgroundColor: "color-mix(in srgb, var(--admin-color-info) 6%, white)",
              }}
            >
              <h3 className="admin-heading text-base font-semibold">Final check</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--admin-color-foreground)]">
                {ADMIN_TOKEN_RENEWAL_NOTICE.finalStep}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border p-5" style={{ borderColor: "color-mix(in srgb, var(--admin-color-warning) 20%, white)", backgroundColor: "color-mix(in srgb, var(--admin-color-warning) 6%, white)" }}>
            <h3 className="admin-heading text-base font-semibold">Vercel deploy hook URL info</h3>
            <ol className="mt-3 space-y-3">
              {ADMIN_TOKEN_RENEWAL_NOTICE.webhookInfoSteps.map((step, index) => (
                <li key={step} className="flex gap-4 rounded-xl bg-[var(--admin-color-surface)] p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold" style={{ backgroundColor: "var(--admin-color-warning)", color: "var(--admin-color-warning-foreground)" }}>
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </main>
  );
}
