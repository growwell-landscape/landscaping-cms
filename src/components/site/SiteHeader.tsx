"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import type { LogoConfig } from "@/types/config";
import type { SiteNavItem } from "@/types/site";

import { SiteLogo } from "./SiteLogo";

interface SiteHeaderProps {
  companyName: string;
  logo: LogoConfig;
  logoText: string;
  navItems: SiteNavItem[];
  siteName: string;
}

function isNavItemActive(href: string, pathname: string): boolean {
  if (href === ROUTES.HOME) {
    return pathname === ROUTES.HOME;
  }
  return pathname.startsWith(href);
}

/**
 * Fixed header with desktop and mobile navigation.
 */
export function SiteHeader({ companyName, logo, logoText, navItems, siteName }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isLandingStylePage =
    pathname === ROUTES.HOME ||
    pathname === ROUTES.CONTACT ||
    pathname === ROUTES.SERVICES ||
    pathname.startsWith(`${ROUTES.SERVICES}/`);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isTransparent = isLandingStylePage && !isScrolled;
  const startNavigation = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 w-full border-b transition-colors duration-300",
          isTransparent
            ? "border-transparent"
            : "border-[var(--site-color-border)] bg-white/95 text-[var(--site-color-foreground)] shadow-sm backdrop-blur"
        )}
      >
        <div className="mx-auto flex h-[76px] w-full max-w-[1280px] items-center justify-between px-4 md:px-8">
          <div className="md:hidden">
            <SiteLogo companyName={companyName} logo={logo} logoText={logoText} siteName={siteName} />
          </div>
          <div className="hidden md:block">
            <SiteLogo companyName={companyName} logo={logo} logoText={logoText} siteName={siteName} />
          </div>
          <button
            aria-controls="mobile-nav"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-[5px] border border-[var(--site-color-border)] md:hidden"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            type="button"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <nav className="hidden md:block">
            <ul className="flex items-center gap-4">
              {navItems.map((item) => {
                const active = isNavItemActive(item.href, pathname);
                return (
                  <li key={item.href}>
                    <Link
                      className={cn(
                        "relative rounded-[5px] px-4 py-2 text-sm font-medium transition-all duration-200",
                        isTransparent ? "text-white hover:bg-white/20" : "text-[var(--site-color-foreground)] hover:bg-[var(--site-color-muted)]",
                        active
                          && "bg-[var(--site-color-accent)] text-[var(--site-color-primary)]"
                      )}
                      href={item.href}
                      onClick={startNavigation}
                    >
                      {item.label}
                      <span
                        className={cn(
                          "absolute inset-x-4 bottom-1 h-0.5 rounded-full bg-[var(--site-color-primary)] transition-opacity duration-200",
                          active ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {isMenuOpen ? (
          <nav
            className="border-t border-[var(--site-color-border)] bg-white px-4 pb-4 pt-3 text-[var(--site-color-foreground)] md:hidden"
            id="mobile-nav"
          >
            <ul className="space-y-1">
              {navItems.map((item) => {
                const active = isNavItemActive(item.href, pathname);
                return (
                  <li key={item.href}>
                    <Link
                      className={cn(
                        "block rounded-[5px] px-3 py-2 text-sm font-medium transition-colors duration-200",
                        active
                          ? "bg-[var(--site-color-accent)] text-[var(--site-color-primary)]"
                          : "text-[var(--site-color-foreground)] hover:bg-[var(--site-color-muted)]"
                      )}
                      href={item.href}
                      onClick={startNavigation}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : null}
      </header>
    </>
  );
}
