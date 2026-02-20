import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import adminConfig from "@/data/content/admin.config.json";
import { normalizeLanguageCode, resolveSiteLanguage } from "@/lib/site-i18n";
import type { SiteConfig } from "@/types/config";

const SITE_LANGUAGE_HEADER = "x-site-lang";
const LANGUAGE_COOKIE_NAME = "language";

const siteLanguageState = resolveSiteLanguage(adminConfig.site as unknown as SiteConfig);
const knownLanguageCodes = Array.from(
  new Set(
    [
      "en",
      adminConfig.site.defaultLanguage,
      ...(Array.isArray(adminConfig.site.availableLanguages)
        ? adminConfig.site.availableLanguages
        : []),
      ...(Array.isArray(adminConfig.site.languages)
        ? adminConfig.site.languages.map((language) => language?.code)
        : []),
    ]
      .filter((code): code is string => typeof code === "string")
      .map((code) => normalizeLanguageCode(code))
      .filter(Boolean)
  )
);

function isPathWithLanguagePrefix(
  pathname: string,
  languageCodes: string[]
): string | null {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  if (!firstSegment) {
    return null;
  }

  const normalizedSegment = normalizeLanguageCode(firstSegment);
  const languageCodeSet = new Set(
    languageCodes.map((languageCode) => normalizeLanguageCode(languageCode))
  );

  return languageCodeSet.has(normalizedSegment) ? normalizedSegment : null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const preferredLanguageCookie = normalizeLanguageCode(
    request.cookies.get(LANGUAGE_COOKIE_NAME)?.value || ""
  );
  const preferredLanguage = siteLanguageState.languageCodes.includes(
    preferredLanguageCookie
  )
    ? preferredLanguageCookie
    : siteLanguageState.defaultLanguageCode;
  const languageFromPath = isPathWithLanguagePrefix(
    pathname,
    siteLanguageState.languageCodes
  );

  if (languageFromPath) {
    const pathnameWithoutLanguage =
      pathname === `/${languageFromPath}`
        ? "/"
        : pathname.slice(languageFromPath.length + 1);
    const rewriteUrl = request.nextUrl.clone();
    const requestHeaders = new Headers(request.headers);

    rewriteUrl.pathname = pathnameWithoutLanguage || "/";
    requestHeaders.set(SITE_LANGUAGE_HEADER, languageFromPath);

    const response = NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    });
    response.cookies.set(LANGUAGE_COOKIE_NAME, languageFromPath, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
    });
    return response;
  }

  const legacyLanguageFromPath = isPathWithLanguagePrefix(
    pathname,
    knownLanguageCodes
  );
  if (legacyLanguageFromPath) {
    const pathnameWithoutLanguage =
      pathname === `/${legacyLanguageFromPath}`
        ? "/"
        : pathname.slice(legacyLanguageFromPath.length + 1);
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname =
      pathnameWithoutLanguage === "/"
        ? `/${preferredLanguage}`
        : `/${preferredLanguage}${pathnameWithoutLanguage}`;

    return NextResponse.redirect(redirectUrl);
  }

  const redirectUrl = request.nextUrl.clone();

  redirectUrl.pathname =
    pathname === "/" ? `/${preferredLanguage}` : `/${preferredLanguage}${pathname}`;

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/((?!admin|api|_next|.*\\..*).*)"],
};
