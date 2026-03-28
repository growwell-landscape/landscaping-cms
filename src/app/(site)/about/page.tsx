import type { Metadata } from "next";

import { AboutCompanyIntroduction } from "@/components/site/AboutCompanyIntroduction";
import { AboutCtaSection } from "@/components/site/AboutCtaSection";
import { AboutMissionVision } from "@/components/site/AboutMissionVision";
import { AboutServicesOverview } from "@/components/site/AboutServicesOverview";
import { AboutTeamSection } from "@/components/site/AboutTeamSection";
import { AboutWhyChooseUs } from "@/components/site/AboutWhyChooseUs";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { PageHero } from "@/components/site/PageHero";
import { TestimonialsCarousel } from "@/components/site/TestimonialsCarousel";
import { getActiveServices } from "@/lib/config-loader";
import { ROUTES } from "@/lib/constants";
import {
  buildPageAlternates,
  buildPageTitle,
  parseKeywords,
  resolveMetadataBase,
  resolveSearchTitle,
  toAbsoluteUrl,
} from "@/lib/seo";
import { createLocalizedPath } from "@/lib/site-i18n";
import { getSiteCommonData, localizeSiteContent } from "@/lib/site-data";
import type { TeamMember, Testimonial } from "@/types/config";
import type { Service } from "@/types/content";

export async function generateMetadata(): Promise<Metadata> {
  const siteData = await getSiteCommonData();
  const { adminConfig, language } = siteData;
  const metadataBase = resolveMetadataBase();
  const searchTitle = resolveSearchTitle(adminConfig.seo, adminConfig.site);
  const alternates = buildPageAlternates(
    ROUTES.ABOUT,
    language.currentLanguageCode,
    language.languageCodes,
    metadataBase,
    language.defaultLanguageCode
  );
  const heroCopy = adminConfig.aboutPage.hero;
  const title = buildPageTitle(heroCopy.subtitle || "About", adminConfig.seo, adminConfig.site);
  const description = heroCopy.description || adminConfig.site.description || adminConfig.seo.description;
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

export default async function AboutPage() {
  const [siteData, servicesRaw] = await Promise.all([
    getSiteCommonData(),
    getActiveServices(),
  ]);
  const { adminConfig, language, translations, whatsAppDefaultMessageEnglish } = siteData;
  const aboutPage = adminConfig.aboutPage;
  const services = localizeSiteContent(servicesRaw, language) as Service[];
  const team = [...(adminConfig.team || [])]
    .filter((member): member is TeamMember => Boolean(member?.enabled))
    .sort((left, right) => (left.sortOrder || 0) - (right.sortOrder || 0));
  const testimonials = [...(adminConfig.testimonials || [])]
    .filter((item): item is Testimonial => Boolean(item?.enabled))
    .sort((left, right) => (left.sortOrder || 0) - (right.sortOrder || 0));
  const contactCopy = translations.contact || {};
  const commonCopy = translations.common || {};
  const navCopy = translations.nav || {};
  const floatingContact = adminConfig.contact.floatingContact;
  const metadataBase = resolveMetadataBase();
  const aboutUrl = toAbsoluteUrl(
    createLocalizedPath(ROUTES.ABOUT, language.currentLanguageCode, language.languageCodes),
    metadataBase
  );
  const homeUrl = toAbsoluteUrl(
    createLocalizedPath(ROUTES.HOME, language.currentLanguageCode, language.languageCodes),
    metadataBase
  );
  const localizedPrimaryHeroHref = createLocalizedPath(
    aboutPage.hero.primaryCtaLink || ROUTES.CONTACT,
    language.currentLanguageCode,
    language.languageCodes
  );
  const localizedSecondaryHeroHref = aboutPage.hero.secondaryCtaLink
    ? createLocalizedPath(
        aboutPage.hero.secondaryCtaLink,
        language.currentLanguageCode,
        language.languageCodes
      )
    : undefined;
  const localizedPrimaryCtaHref = createLocalizedPath(
    aboutPage.cta.primaryCtaLink || ROUTES.CONTACT,
    language.currentLanguageCode,
    language.languageCodes
  );
  const localizedSecondaryCtaHref = aboutPage.cta.secondaryCtaLink
    ? createLocalizedPath(
        aboutPage.cta.secondaryCtaLink,
        language.currentLanguageCode,
        language.languageCodes
      )
    : undefined;

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          item: homeUrl,
          name: navCopy.home || "Home",
          position: 1,
        },
        {
          "@type": "ListItem",
          item: aboutUrl,
          name: navCopy.about || "About",
          position: 2,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      description: aboutPage.hero.description || adminConfig.site.description,
      inLanguage: language.currentLanguageCode,
      name: aboutPage.hero.title,
      url: aboutUrl,
    },
  ];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PageHero
        description={aboutPage.hero.description}
        primaryCtaHref={localizedPrimaryHeroHref}
        primaryCtaLabel={aboutPage.hero.primaryCtaText || contactCopy.title || "Contact Us"}
        secondaryCtaHref={localizedSecondaryHeroHref}
        secondaryCtaLabel={aboutPage.hero.secondaryCtaText || commonCopy.learnMore || "Learn More"}
        subtitle={aboutPage.hero.subtitle}
        title={aboutPage.hero.title}
      />
      <AboutCompanyIntroduction
        description={aboutPage.companyIntroduction.description}
        eyebrow={aboutPage.companyIntroduction.eyebrow}
        imagePath={aboutPage.companyIntroduction.image}
        imageFallbackText={aboutPage.companyIntroduction.imageFallbackText}
        title={aboutPage.companyIntroduction.title}
      />
      <AboutMissionVision
        missionDescription={aboutPage.missionVision.missionDescription}
        missionTitle={aboutPage.missionVision.missionTitle}
        subtitle={aboutPage.missionVision.subtitle}
        title={aboutPage.missionVision.title}
        visionDescription={aboutPage.missionVision.visionDescription}
        visionTitle={aboutPage.missionVision.visionTitle}
      />
      <AboutWhyChooseUs
        items={aboutPage.whyChooseUs.items || []}
        subtitle={aboutPage.whyChooseUs.subtitle}
        title={aboutPage.whyChooseUs.title}
      />
      <AboutServicesOverview
        currentLanguageCode={language.currentLanguageCode}
        description={aboutPage.servicesOverview.description}
        emptyStateText={aboutPage.servicesOverview.emptyStateText}
        introText={aboutPage.servicesOverview.introText}
        languageCodes={language.languageCodes}
        services={services}
        title={aboutPage.servicesOverview.title}
      />
      <AboutTeamSection
        description={aboutPage.founderSection.description}
        members={team}
        socialLabel={aboutPage.founderSection.socialLabel}
        subtitle={aboutPage.founderSection.subtitle}
        title={aboutPage.founderSection.title}
      />
      <TestimonialsCarousel
        items={testimonials}
        subtitle={aboutPage.testimonialsSection.subtitle}
        title={aboutPage.testimonialsSection.title}
      />
      <AboutCtaSection
        description={aboutPage.cta.description}
        primaryCtaHref={localizedPrimaryCtaHref}
        primaryCtaLabel={aboutPage.cta.primaryCtaText || contactCopy.title || "Contact Us"}
        secondaryCtaHref={localizedSecondaryCtaHref}
        secondaryCtaLabel={aboutPage.cta.secondaryCtaText}
        title={aboutPage.cta.title}
      />
      {floatingContact.enabled && floatingContact.showWhatsApp ? (
        <FloatingWhatsApp
          ariaLabel={contactCopy.chatOnWhatsApp || "Chat on WhatsApp"}
          defaultMessage={whatsAppDefaultMessageEnglish}
          number={adminConfig.contact.whatsapp.number}
        />
      ) : null}
    </main>
  );
}
