import { Mail, MapPin, Phone } from "lucide-react";

import { PageIntro } from "@/components/site/PageIntro";
import { SectionContainer } from "@/components/site/SectionContainer";
import { getSiteCommonData } from "@/lib/site-data";

export default async function ContactPage() {
  const siteData = await getSiteCommonData();
  const contactCopy = siteData.translations.contact || {};

  return (
    <main>
      <PageIntro
        description={contactCopy.subtitle || ""}
        title={contactCopy.title || "Get in Touch"}
      />
      <section className="bg-white py-16">
        <SectionContainer>
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-[var(--site-color-border)] bg-white p-6 shadow-sm">
              <Phone className="h-5 w-5 text-[var(--site-color-primary)]" />
              <h2 className="site-heading mt-3 text-xl font-semibold text-[var(--site-color-foreground)]">
                {contactCopy.callUs || "Call Us"}
              </h2>
              <a className="mt-2 block text-sm text-[var(--site-color-muted-foreground)]" href={`tel:${siteData.adminConfig.contact.phone.replace(/\s+/g, "")}`}>
                {siteData.adminConfig.contact.phone}
              </a>
            </article>
            <article className="rounded-2xl border border-[var(--site-color-border)] bg-white p-6 shadow-sm">
              <Mail className="h-5 w-5 text-[var(--site-color-primary)]" />
              <h2 className="site-heading mt-3 text-xl font-semibold text-[var(--site-color-foreground)]">
                {contactCopy.emailUs || "Email Us"}
              </h2>
              <a className="mt-2 block text-sm text-[var(--site-color-muted-foreground)]" href={`mailto:${siteData.adminConfig.contact.email}`}>
                {siteData.adminConfig.contact.email}
              </a>
            </article>
            <article className="rounded-2xl border border-[var(--site-color-border)] bg-white p-6 shadow-sm">
              <MapPin className="h-5 w-5 text-[var(--site-color-primary)]" />
              <h2 className="site-heading mt-3 text-xl font-semibold text-[var(--site-color-foreground)]">
                {contactCopy.visitUs || "Visit Us"}
              </h2>
              <p className="mt-2 text-sm text-[var(--site-color-muted-foreground)]">{siteData.adminConfig.contact.address}</p>
            </article>
          </div>
        </SectionContainer>
      </section>
    </main>
  );
}

