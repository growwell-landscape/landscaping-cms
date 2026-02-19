import { configLoader, getActiveProjects, getActiveServices } from "@/lib/config-loader";
import { ROUTES } from "@/lib/constants";
import type { AdminConfig } from "@/types/config";
import type { LanguageTranslations, Project, Service } from "@/types/content";
import type { SiteFooterLabels, SiteNavItem } from "@/types/site";

/**
 * Shared site data used by layout and pages.
 */
export interface SiteCommonData {
  adminConfig: AdminConfig;
  footerLabels: SiteFooterLabels;
  navItems: SiteNavItem[];
  translations: LanguageTranslations;
}

/**
 * Homepage data including services and projects.
 */
export interface SiteHomeData extends SiteCommonData {
  projects: Project[];
  services: Service[];
}

function getLabel(copy: Record<string, string>, fallback: string, key: string): string {
  return copy[key] || fallback;
}

function mapFooterLabels(copy: Record<string, string>): SiteFooterLabels {
  return {
    contactTitle: getLabel(copy, "Contact", "contactTitle"),
    copyright: getLabel(copy, "(c) 2026 GrowWell Landscapes Pvt Ltd. All rights reserved.", "copyright"),
    followUsTitle: getLabel(copy, "Follow Us", "followUsTitle"),
    privacyPolicy: getLabel(copy, "Privacy Policy", "privacyPolicy"),
    termsOfService: getLabel(copy, "Terms of Service", "termsOfService"),
  };
}

function mapNavigationItems(copy: Record<string, string>): SiteNavItem[] {
  return [
    {
      href: ROUTES.HOME,
      label: getLabel(copy, "Home", "home"),
    },
    {
      href: ROUTES.SERVICES,
      label: getLabel(copy, "Services", "services"),
    },
    {
      href: ROUTES.CONTACT,
      label: getLabel(copy, "Contact Us", "contact"),
    },
  ];
}

/**
 * Loads data shared by all website pages.
 */
export async function getSiteCommonData(): Promise<SiteCommonData> {
  const adminConfig = await configLoader.loadAdminConfig();
  const languageCode = adminConfig.site.defaultLanguage || "en";
  const translations = await configLoader.loadLanguageTranslations(languageCode);
  const footerCopy = translations.footer || {};
  const navCopy = translations.nav || {};

  return {
    adminConfig,
    footerLabels: mapFooterLabels(footerCopy),
    navItems: mapNavigationItems(navCopy),
    translations,
  };
}

/**
 * Loads data for the homepage.
 */
export async function getSiteHomeData(): Promise<SiteHomeData> {
  const [commonData, projects, services] = await Promise.all([
    getSiteCommonData(),
    getActiveProjects(),
    getActiveServices(),
  ]);

  return {
    ...commonData,
    projects,
    services,
  };
}

