import { Check } from "lucide-react";
import { notFound } from "next/navigation";

import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { PageIntro } from "@/components/site/PageIntro";
import { SectionContainer } from "@/components/site/SectionContainer";
import { getActiveServices } from "@/lib/config-loader";
import { getSiteCommonData } from "@/lib/site-data";

interface ServiceDetailPageProps {
  params: {
    id: string;
  };
}

function resolveFeatureText(feature: string | { description?: string; title: string }): string {
  if (typeof feature === "string") {
    return feature;
  }
  return feature.description ? `${feature.title} - ${feature.description}` : feature.title;
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const [services, siteData] = await Promise.all([getActiveServices(), getSiteCommonData()]);
  const service = services.find((item) => item.id === params.id);

  if (!service) {
    notFound();
  }

  const floatingContact = siteData.adminConfig.contact.floatingContact;

  return (
    <main>
      <PageIntro description={service.shortDescription} title={service.title} />
      <section className="bg-white py-14 md:py-16">
        <SectionContainer>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div className="overflow-hidden rounded-2xl border border-[var(--site-color-border)] bg-[var(--site-color-muted)]">
              <div className="h-72 bg-cover bg-center md:h-[420px]" style={{ backgroundImage: `url("${service.image}")` }} />
            </div>
            <div>
              <h2 className="site-heading text-3xl font-semibold text-[var(--site-color-foreground)]">Service Overview</h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--site-color-muted-foreground)] md:text-base">
                {service.description}
              </p>
              {service.features.length > 0 ? (
                <div className="mt-8">
                  <h3 className="site-heading text-xl font-semibold text-[var(--site-color-foreground)]">What Includes</h3>
                  <ul className="mt-4 space-y-3">
                    {service.features.map((feature, index) => (
                      <li className="flex items-start gap-2 text-sm text-[var(--site-color-muted-foreground)] md:text-base" key={`${service.id}-feature-${index}`}>
                        <Check className="mt-[2px] h-4 w-4 shrink-0 text-[var(--site-color-primary)]" />
                        <span>{resolveFeatureText(feature)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </SectionContainer>
      </section>
      {floatingContact.enabled && floatingContact.showWhatsApp ? (
        <FloatingWhatsApp
          defaultMessage={siteData.adminConfig.contact.whatsapp.defaultMessage}
          number={siteData.adminConfig.contact.whatsapp.number}
        />
      ) : null}
    </main>
  );
}
