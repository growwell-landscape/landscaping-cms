import type { Metadata } from "next";

import { createLocalizedPath } from "@/lib/site-i18n";

const BASE_URL_ENV_KEYS = [
  "NEXT_PUBLIC_SITE_URL",
  "SITE_URL",
  "VERCEL_PROJECT_PRODUCTION_URL",
  "VERCEL_URL",
] as const;

const TRUE_ENV_VALUES = new Set(["1", "true", "yes", "on"]);
const FALSE_ENV_VALUES = new Set(["0", "false", "no", "off"]);
const HREFLANG_LANGUAGE_MAP: Record<string, string> = {
  // "tel" is commonly used in app config for Telugu; search engines expect "te".
  tel: "te",
};

function normalizeBaseUrl(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) return "";

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function normalizeLanguageCode(value: string): string {
  return value.trim().toLowerCase();
}

function toHrefLangCode(value: string): string {
  const normalized = normalizeLanguageCode(value);
  return HREFLANG_LANGUAGE_MAP[normalized] || normalized;
}

function readBooleanEnv(value: string | undefined): boolean | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (TRUE_ENV_VALUES.has(normalized)) return true;
  if (FALSE_ENV_VALUES.has(normalized)) return false;
  return null;
}

/**
 * Resolves the metadata base URL from environment variables with safe fallback.
 */
export function resolveMetadataBase(): URL {
  for (const envKey of BASE_URL_ENV_KEYS) {
    const rawValue = process.env[envKey];

    if (!rawValue) continue;

    const candidate = normalizeBaseUrl(rawValue);

    if (!candidate) continue;

    try {
      const url = new URL(candidate);
      return new URL(`${url.protocol}//${url.host}`);
    } catch {
      continue;
    }
  }

  return new URL("http://localhost:3000");
}

/**
 * Determines whether search engines should index the current deployment.
 * Override with SITE_INDEXABLE=true/false when needed.
 */
export function isSiteIndexable(metadataBase?: URL): boolean {
  const explicitOverride = readBooleanEnv(process.env.SITE_INDEXABLE);
  if (explicitOverride !== null) {
    return explicitOverride;
  }

  const vercelEnv = (process.env.VERCEL_ENV || "").trim().toLowerCase();
  if (vercelEnv && vercelEnv !== "production") {
    return false;
  }

  const resolvedMetadataBase = metadataBase || resolveMetadataBase();
  const hostname = resolvedMetadataBase.hostname.trim().toLowerCase();
  const isLocalHost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname.endsWith(".local");

  if (isLocalHost) {
    return false;
  }

  return process.env.NODE_ENV === "production";
}

/**
 * Converts a relative path (or passthrough absolute URL) into an absolute URL string.
 */
export function toAbsoluteUrl(pathOrUrl: string, metadataBase: URL): string {
  if (!pathOrUrl) {
    return metadataBase.toString();
  }

  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  const normalizedPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return new URL(normalizedPath, metadataBase).toString();
}

/**
 * Splits and normalizes comma-separated keywords.
 */
export function parseKeywords(value: string | undefined): string[] | undefined {
  if (!value) return undefined;

  const keywords = value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  return keywords.length > 0 ? keywords : undefined;
}

/**
 * Builds canonical and alternate URLs for a localized route.
 */
export function buildPageAlternates(
  routePath: string,
  currentLanguageCode: string,
  languageCodes: string[],
  metadataBase: URL,
  defaultLanguageCode?: string
): NonNullable<Metadata["alternates"]> {
  const safeLanguageCodes = languageCodes.length > 0 ? languageCodes : [currentLanguageCode];
  const normalizedDefaultLanguageCode = normalizeLanguageCode(defaultLanguageCode || "");
  const xDefaultLanguageCode = safeLanguageCodes.includes(normalizedDefaultLanguageCode)
    ? normalizedDefaultLanguageCode
    : safeLanguageCodes[0];
  const languages: Record<string, string> = {};

  safeLanguageCodes.forEach((languageCode) => {
    const hrefLangCode = toHrefLangCode(languageCode);
    if (languages[hrefLangCode]) return;

    languages[hrefLangCode] = toAbsoluteUrl(
      createLocalizedPath(routePath, languageCode, safeLanguageCodes),
      metadataBase
    );
  });

  const canonicalPath = createLocalizedPath(
    routePath,
    currentLanguageCode,
    safeLanguageCodes
  );
  languages["x-default"] = toAbsoluteUrl(
    createLocalizedPath(routePath, xDefaultLanguageCode, safeLanguageCodes),
    metadataBase
  );

  return {
    canonical: toAbsoluteUrl(canonicalPath, metadataBase),
    languages,
  };
}
