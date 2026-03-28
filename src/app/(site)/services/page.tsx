import type { Metadata } from "next";

import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { ServicesCatalogPage } from "@/components/site/ServicesCatalogPage";
import { getActiveServices } from "@/lib/config-loader";
import { ROUTES } from "@/lib/constants";
import {
  buildPageTitle,
  buildPageAlternates,
  parseKeywords,
  resolveMetadataBase,
  resolveSearchTitle,
  toAbsoluteUrl,
} from "@/lib/seo";
import { createLocalizedPath } from "@/lib/site-i18n";
import { getSiteCommonData, localizeSiteContent } from "@/lib/site-data";
import type { Service } from "@/types/content";

export async function generateMetadata(): Promise<Metadata> {
  const siteData = await getSiteCommonData();
  const { adminConfig, language, translations } = siteData;
  const servicesCopy = translations.services || {};
  const metadataBase = resolveMetadataBase();
  const searchTitle = resolveSearchTitle(adminConfig.seo, adminConfig.site);
  const alternates = buildPageAlternates(
    ROUTES.SERVICES,
    language.currentLanguageCode,
    language.languageCodes,
    metadataBase,
    language.defaultLanguageCode
  );
  const pageTitle = servicesCopy.title || "Our Services";
  const title = buildPageTitle(pageTitle, adminConfig.seo, adminConfig.site);
  const description =
    servicesCopy.subtitle ||
    adminConfig.seo.description;
  const keywords = parseKeywords(adminConfig.seo.keywords);
  const ogImage = adminConfig.seo.ogImage
    ? toAbsoluteUrl(adminConfig.seo.ogImage, metadataBase)
    : undefined;
  const canonicalUrl = String(alternates.canonical || "");

  return {
    alternates,
    description,
    keywords,
    openGraph: {
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
      siteName: searchTitle,
      title,
      type: "website",
      url: canonicalUrl,
    },
    title,
    twitter: {
      card: "summary_large_image",
      description,
      images: ogImage ? [ogImage] : undefined,
      title,
    },
  };
}

export default async function ServicesPage() {
  const [servicesRaw, siteData] = await Promise.all([
    getActiveServices(),
    getSiteCommonData(),
  ]);
  const services = localizeSiteContent(servicesRaw, siteData.language) as Service[];
  const servicesCopy = siteData.translations.services || {};
  const contactCopy = siteData.translations.contact || {};
  const floatingContact = siteData.adminConfig.contact.floatingContact;
  const subtitle =
    servicesCopy.subtitle ||
    "Explore our wide range of professional landscaping and gardening services designed to transform your space.";
  const metadataBase = resolveMetadataBase();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    hasPart: services.map((service) => ({
      "@type": "Service",
      description: service.shortDescription || service.description,
      name: service.title,
      url: toAbsoluteUrl(
        createLocalizedPath(
          `${ROUTES.SERVICE_DETAIL}/${service.id}`,
          siteData.language.currentLanguageCode,
          siteData.language.languageCodes
        ),
        metadataBase
      ),
    })),
    inLanguage: siteData.language.currentLanguageCode,
    name: servicesCopy.title || "Our Services",
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ServicesCatalogPage
        currentLanguageCode={siteData.language.currentLanguageCode}
        languageCodes={siteData.language.languageCodes}
        noResultsLabel={servicesCopy.noResults || "No services found for your search."}
        searchPlaceholder={servicesCopy.searchPlaceholder || "Search for a service..."}
        services={services}
        subtitle={subtitle}
        title={servicesCopy.title || "Our Services"}
        viewDetailsLabel={servicesCopy.viewDetails || "View Details"}
      />
      {floatingContact.enabled && floatingContact.showWhatsApp ? (
        <FloatingWhatsApp
          ariaLabel={contactCopy.chatOnWhatsApp || "Chat on WhatsApp"}
          defaultMessage={siteData.whatsAppDefaultMessageEnglish}
          number={siteData.adminConfig.contact.whatsapp.number}
        />
      ) : null}
    </main>
  );
}
