import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { RouteLoadingOverlay } from "@/components/site/RouteLoadingOverlay";
import { SiteHeader } from "@/components/site/SiteHeader";
import { configLoader, getActiveProjects, getActiveServices } from "@/lib/config-loader";
import { getSiteCommonData } from "@/lib/site-data";
import type { ThemeConfig } from "@/types/config";

interface SiteLayoutProps {
  children: ReactNode;
}

interface SiteThemeStyle extends CSSProperties {
  "--site-color-accent": string;
  "--site-color-background": string;
  "--site-color-border": string;
  "--site-color-foreground": string;
  "--site-color-muted": string;
  "--site-color-muted-foreground": string;
  "--site-color-primary": string;
  "--site-color-primary-hover": string;
  "--site-color-secondary": string;
  "--site-font-body": string;
  "--site-font-heading": string;
}

function createThemeStyle(theme: ThemeConfig): SiteThemeStyle {
  return {
    "--site-color-accent": theme.colors.accent,
    "--site-color-background": theme.colors.background,
    "--site-color-border": theme.colors.border,
    "--site-color-foreground": theme.colors.foreground,
    "--site-color-muted": theme.colors.muted,
    "--site-color-muted-foreground": theme.colors.mutedForeground,
    "--site-color-primary": theme.colors.primary,
    "--site-color-primary-hover": theme.colors.primaryHover,
    "--site-color-secondary": theme.colors.secondary,
    "--site-font-body": theme.fonts.body,
    "--site-font-heading": theme.fonts.heading,
  };
}

function getLogoText(text?: string): string {
  if (text && text.trim().length > 0) {
    return text.trim();
  }
  return "GW";
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await configLoader.loadSEOConfig();

  return {
    description: seo.description,
    icons: seo.favicon,
    keywords: seo.keywords,
    title: seo.title,
  };
}

export default async function SiteLayout({ children }: SiteLayoutProps) {
  const [commonData, projects, services] = await Promise.all([
    getSiteCommonData(),
    getActiveProjects(),
    getActiveServices(),
  ]);
  const { adminConfig, footerLabels, navItems } = commonData;
  const hasProjects = projects.length > 0;
  const hasServices = services.length > 0;
  const logoText = getLogoText(adminConfig.site.logo.text);
  const resolvedNavItems = navItems.filter((item) => {
    if (item.href === "/services" && !hasServices) {
      return false;
    }
    if (item.href === "/#projects" && !hasProjects) {
      return false;
    }
    return true;
  });
  const socialMedia = adminConfig.socialMedia.filter((social) => social.enabled);
  const themeStyle = createThemeStyle(adminConfig.theme);

  return (
    <div className="site-theme min-h-screen" style={themeStyle}>
      {adminConfig.theme.customCss ? <style>{adminConfig.theme.customCss}</style> : null}
      <RouteLoadingOverlay />
      <SiteHeader
        companyName={adminConfig.site.companyName}
        logo={adminConfig.site.logo}
        logoText={logoText}
        navItems={resolvedNavItems}
        siteName={adminConfig.site.name}
      />
      <div className="flex min-h-screen flex-col">
        <div className="flex-1">{children}</div>
        <SiteFooter
          address={adminConfig.contact.address}
          companyName={adminConfig.site.companyName}
          contactTitle={footerLabels.contactTitle}
          copyright={footerLabels.copyright}
          email={adminConfig.contact.email}
          followUsTitle={footerLabels.followUsTitle}
          logo={adminConfig.site.logo}
          logoText={logoText}
          phone={adminConfig.contact.phone}
          siteDescription={adminConfig.site.description}
          siteName={adminConfig.site.name}
          socialMedia={socialMedia}
        />
      </div>
    </div>
  );
}
