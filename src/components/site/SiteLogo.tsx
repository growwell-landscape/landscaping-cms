import { cn } from "@/lib/utils";

interface SiteLogoProps {
  className?: string;
  companyName: string;
  logoText: string;
  siteName: string;
}

function getCompanySuffix(companyName: string, siteName: string): string {
  const suffix = companyName.replace(siteName, "").trim();
  return suffix || companyName;
}

/**
 * Shared brand logo block for header and footer.
 */
export function SiteLogo({ className, companyName, logoText, siteName }: SiteLogoProps) {
  const companySuffix = getCompanySuffix(companyName, siteName);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="grid h-8 w-8 place-items-center rounded-md bg-[var(--site-color-primary)] text-xs font-bold uppercase text-white">
        {logoText}
      </span>
      <span className="leading-tight">
        <span className="site-heading block text-base font-semibold">{siteName}</span>
        <span className="block text-[10px] uppercase tracking-wide opacity-70">{companySuffix}</span>
      </span>
    </div>
  );
}
