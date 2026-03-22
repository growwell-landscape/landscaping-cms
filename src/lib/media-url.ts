function isManagedUploadPath(value: string): boolean {
  return value.startsWith("/uploads/");
}

export function resolveMediaUrl(src?: string | null): string {
  const normalized = (src || "").trim();
  if (!normalized) return "";

  if (!isManagedUploadPath(normalized)) {
    return normalized;
  }

  const searchParams = new URLSearchParams({ path: normalized });
  return `/api/media?${searchParams.toString()}`;
}
