import { SectionContainer } from "@/components/site/SectionContainer";
import { PageIntro } from "@/components/site/PageIntro";
import { getActiveServices } from "@/lib/config-loader";
import { getSiteCommonData } from "@/lib/site-data";

export default async function ServicesPage() {
  const [services, siteData] = await Promise.all([getActiveServices(), getSiteCommonData()]);
  const commonCopy = siteData.translations.common || {};
  const servicesCopy = siteData.translations.services || {};

  return (
    <main>
      <PageIntro
        description={commonCopy.comingSoon || servicesCopy.subtitle || ""}
        title={servicesCopy.title || "Our Services"}
      />
      <section className="bg-white py-16">
        <SectionContainer>
          <div className="grid gap-4 md:grid-cols-2">
            {services.map((service) => (
              <article
                className="rounded-2xl border border-[var(--site-color-border)] bg-white p-6 shadow-sm transition-transform duration-300 hover:translate-y-[-2px]"
                key={service.id}
              >
                <h2 className="site-heading text-2xl font-semibold text-[var(--site-color-foreground)]">{service.title}</h2>
                <p className="mt-2 text-sm text-[var(--site-color-muted-foreground)]">{service.shortDescription}</p>
              </article>
            ))}
          </div>
        </SectionContainer>
      </section>
    </main>
  );
}

