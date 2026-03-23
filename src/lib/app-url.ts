const DEFAULT_LOCALHOST_URL = "http://localhost:3000";

function normalizeBaseUrl(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) return "";

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function resolveBaseUrlFromEnv(envKeys: readonly string[]): string {
  for (const envKey of envKeys) {
    const rawValue = process.env[envKey];

    if (!rawValue) continue;

    const candidate = normalizeBaseUrl(rawValue);
    if (!candidate) continue;

    try {
      const url = new URL(candidate);
      return `${url.protocol}//${url.host}`;
    } catch {
      continue;
    }
  }

  return DEFAULT_LOCALHOST_URL;
}

export function resolveDefaultAppBaseUrl(): string {
  return resolveBaseUrlFromEnv([
    "NEXT_PUBLIC_API_URL",
    "NEXT_PUBLIC_SITE_URL",
    "SITE_URL",
    "VERCEL_PROJECT_PRODUCTION_URL",
    "VERCEL_URL",
  ]);
}
