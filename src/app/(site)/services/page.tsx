import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { ServicesCatalogPage } from "@/components/site/ServicesCatalogPage";
import { getActiveServices } from "@/lib/config-loader";
import { getSiteCommonData } from "@/lib/site-data";

export default async function ServicesPage() {
  const [services, siteData] = await Promise.all([getActiveServices(), getSiteCommonData()]);
  const servicesCopy = siteData.translations.services || {};
  const floatingContact = siteData.adminConfig.contact.floatingContact;
  const subtitle =
    servicesCopy.subtitle ||
    "Explore our wide range of professional landscaping and gardening services designed to transform your space.";

  return (
    <main>
      <ServicesCatalogPage
        noResultsLabel={servicesCopy.noResults || "No services found for your search."}
        searchPlaceholder={servicesCopy.searchPlaceholder || "Search for a service..."}
        services={services}
        subtitle={subtitle}
        title={servicesCopy.title || "Our Services"}
        viewDetailsLabel={servicesCopy.viewDetails || "View Details"}
      />
      {floatingContact.enabled && floatingContact.showWhatsApp ? (
        <FloatingWhatsApp
          defaultMessage={siteData.adminConfig.contact.whatsapp.defaultMessage}
          number={siteData.adminConfig.contact.whatsapp.number}
        />
      ) : null}
    </main>
  );
}
