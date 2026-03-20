import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { RouteLoadingOverlay } from "@/components/site/RouteLoadingOverlay";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getActiveProjects, getActiveServices } from "@/lib/config-loader";
import { ROUTES } from "@/lib/constants";
import { getContactCollections } from "@/lib/contact-utils";
import {
  isSiteIndexable,
  parseKeywords,
  resolveMetadataBase,
  toAbsoluteUrl,
} from "@/lib/seo";
import { stripLanguagePrefixFromPath } from "@/lib/site-i18n";
import { getSiteCommonData } from "@/lib/site-data";
import { createSiteThemeStyle } from "@/lib/theme";

export const dynamic = "force-dynamic";

interface SiteLayoutProps {
  children: ReactNode;
}

function getLogoText(text?: string): string {
  if (text && text.trim().length > 0) {
    return text.trim();
  }
  return "GW";
}

export async function generateMetadata(): Promise<Metadata> {
  const { adminConfig, language } = await getSiteCommonData();
  const seo = adminConfig.seo;
  const metadataBase = resolveMetadataBase();
  const keywords = parseKeywords(seo.keywords);
  const ogImage = seo.ogImage
    ? toAbsoluteUrl(seo.ogImage, metadataBase)
    : undefined;
  const localizedHomeUrl = toAbsoluteUrl(
    `/${language.currentLanguageCode}`,
    metadataBase
  );
  const shouldIndexSite = isSiteIndexable(metadataBase);
  const iconUrl = seo.favicon ? toAbsoluteUrl(seo.favicon, metadataBase) : undefined;

  return {
    metadataBase,
    description: seo.description,
    icons: iconUrl
      ? {
          icon: iconUrl,
          shortcut: iconUrl,
          apple: iconUrl,
        }
      : undefined,
    keywords,
    openGraph: {
      description: seo.description,
      images: ogImage ? [{ url: ogImage }] : undefined,
      locale: language.currentLanguageCode,
      siteName: adminConfig.site.name,
      title: seo.title,
      type: "website",
      url: localizedHomeUrl,
    },
    robots: {
      follow: shouldIndexSite,
      index: shouldIndexSite,
    },
    twitter: {
      card: "summary_large_image",
      description: seo.description,
      images: ogImage ? [ogImage] : undefined,
      title: seo.title,
    },
    title: seo.title,
  };
}

export default async function SiteLayout({ children }: SiteLayoutProps) {
  const [commonData, projects, services] = await Promise.all([
    getSiteCommonData(),
    getActiveProjects(),
    getActiveServices(),
  ]);
  const { adminConfig, footerLabels, homeHref, language, navItems } = commonData;
  const commonCopy = commonData.translations.common || {};
  const hasProjects = projects.length > 0;
  const hasServices = services.length > 0;
  const logoText = getLogoText(adminConfig.site.logo.text);
  const resolvedNavItems = navItems.filter((item) => {
    const hrefWithoutLanguage = stripLanguagePrefixFromPath(
      item.href,
      language.languageCodes
    );
    const plainPath = hrefWithoutLanguage
      .split("?")[0]
      .split("#")[0];

    if (plainPath === ROUTES.SERVICES && !hasServices) {
      return false;
    }
    if (hrefWithoutLanguage.startsWith(`${ROUTES.HOME}#projects`) && !hasProjects) {
      return false;
    }
    return true;
  });
  const socialMedia = adminConfig.socialMedia.filter((social) => social.enabled);
  const contactCollections = getContactCollections(adminConfig.contact);
  const themeStyle = createSiteThemeStyle(adminConfig.theme) as CSSProperties;
  const metadataBase = resolveMetadataBase();
  const localizedHomeUrl = toAbsoluteUrl(
    `/${language.currentLanguageCode}`,
    metadataBase
  );
  const logoImageUrl = adminConfig.site.logo.imageUrl
    ? toAbsoluteUrl(adminConfig.site.logo.imageUrl, metadataBase)
    : undefined;
  const socialLinks = socialMedia
    .map((social) => social.url)
    .filter((url) => Boolean(url && /^https?:\/\//i.test(url)));
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      inLanguage: language.currentLanguageCode,
      name: adminConfig.site.name,
      url: localizedHomeUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      address: contactCollections.addresses[0]
        ? {
            "@type": "PostalAddress",
            streetAddress: contactCollections.addresses[0],
          }
        : undefined,
      description: adminConfig.site.description,
      email: contactCollections.emails[0],
      image: logoImageUrl,
      name: adminConfig.site.companyName || adminConfig.site.name,
      sameAs: socialLinks.length > 0 ? socialLinks : undefined,
      telephone: contactCollections.phoneNumbers[0],
      url: localizedHomeUrl,
    },
  ];

  return (
    <div className="site-theme min-h-screen" style={themeStyle}>
      <a className="site-skip-link" href="#main-content">
        Skip to main content
      </a>
      {adminConfig.theme.customCss ? <style>{adminConfig.theme.customCss}</style> : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <RouteLoadingOverlay />
      <SiteHeader
        companyName={adminConfig.site.companyName}
        currentLanguageCode={language.currentLanguageCode}
        languageCodes={language.languageCodes}
        languageSwitcherAriaLabel={commonCopy.chooseLanguage || "Choose language"}
        languages={language.languages}
        logo={adminConfig.site.logo}
        logoText={logoText}
        navItems={resolvedNavItems}
        siteName={adminConfig.site.name}
      />
      <div className="flex min-h-screen flex-col">
        <div className="flex-1" id="main-content" tabIndex={-1}>
          {children}
        </div>
        <SiteFooter
          addresses={contactCollections.addresses}
          companyName={adminConfig.site.companyName}
          contactTitle={footerLabels.contactTitle}
          copyright={footerLabels.copyright}
          emails={contactCollections.emails}
          followUsTitle={footerLabels.followUsTitle}
          homeHref={homeHref}
          logo={adminConfig.site.logo}
          logoText={logoText}
          phoneNumbers={contactCollections.phoneNumbers}
          siteDescription={adminConfig.site.description}
          siteName={adminConfig.site.name}
          socialMedia={socialMedia}
        />
      </div>
    </div>
  );
}
