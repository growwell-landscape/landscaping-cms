import { AboutSection } from "@/components/site/AboutSection";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { HeroSection } from "@/components/site/HeroSection";
import { ProjectsSection } from "@/components/site/ProjectsSection";
import { ServicesSection } from "@/components/site/ServicesSection";
import { getSiteHomeData } from "@/lib/site-data";

export default async function HomePage() {
  const { adminConfig, projects, services, translations } = await getSiteHomeData();
  const aboutCopy = adminConfig.about;
  const contactCopy = translations.contact || {};
  const floatingContact = adminConfig.contact.floatingContact;
  const heroCopy = adminConfig.hero;
  const commonCopy = translations.common || {};
  const hasProjects = projects.length > 0;
  const hasServices = services.length > 0;
  const projectsCopy = translations.projects || {};
  const servicesCopy = translations.services || {};
  const heroCtaHref = hasServices ? heroCopy.ctaLink : "/contact";
  const heroCtaLabel = hasServices
    ? heroCopy.ctaText || servicesCopy.viewAll || "View Services"
    : commonCopy.contactUs || "Contact Us";

  return (
    <main>
      <HeroSection
        ctaHref={heroCtaHref}
        ctaLabel={heroCtaLabel}
        description={heroCopy.description}
        imageDesktop={heroCopy.images.desktop}
        imageMobile={heroCopy.images.mobile}
        subtitle={heroCopy.subtitle}
        title={heroCopy.title}
      />
      {hasServices ? (
        <ServicesSection
          services={services}
          subtitle={servicesCopy.subtitle || ""}
          title={servicesCopy.title || "Our Services"}
          viewAllLabel={servicesCopy.viewAll || "View All Services"}
          viewDetailsLabel={servicesCopy.viewDetails || "View Details"}
        />
      ) : null}
      {hasProjects ? <ProjectsSection projects={projects} title={projectsCopy.title || "Our Projects"} /> : null}
      <AboutSection
        ctaHref={aboutCopy.ctaLink}
        ctaLabel={aboutCopy.ctaText || contactCopy.title || "Get in Touch"}
        description={aboutCopy.description}
        features={aboutCopy.features}
        imagePath={aboutCopy.image || heroCopy.images.desktop}
        title={aboutCopy.title}
      />
      {floatingContact.enabled && floatingContact.showWhatsApp ? (
        <FloatingWhatsApp
          defaultMessage={adminConfig.contact.whatsapp.defaultMessage}
          number={adminConfig.contact.whatsapp.number}
        />
      ) : null}
    </main>
  );
}
