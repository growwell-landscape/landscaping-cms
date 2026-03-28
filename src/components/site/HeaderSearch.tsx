"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { ROUTES } from "@/lib/constants";
import { createLocalizedPath } from "@/lib/site-i18n";
import { cn } from "@/lib/utils";
import type { Service } from "@/types/content";

interface HeaderSearchProps {
  activeLanguageCode: string;
  isTransparent: boolean;
  languageCodes: string[];
  onNavigate: () => void;
  placeholder: string;
  size?: "desktop" | "mobile";
  services: Service[];
}

export function HeaderSearch({
  activeLanguageCode,
  isTransparent,
  languageCodes,
  onNavigate,
  placeholder,
  size = "desktop",
  services,
}: Readonly<HeaderSearchProps>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = size === "mobile";

  const filteredServices = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return services.slice(0, 6);
    }

    return services
      .filter((service) => {
        return [service.title, service.shortDescription, service.description]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(needle));
      })
      .slice(0, 6);
  }, [query, services]);

  useEffect(() => {
    setIsOpen(false);
    setQuery("");
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (containerRef.current?.contains(target)) return;
      setIsOpen(false);
      setQuery("");
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
  }, [isOpen]);

  const navigateToService = (serviceId: string) => {
    const href = createLocalizedPath(
      `${ROUTES.SERVICE_DETAIL}/${serviceId}`,
      activeLanguageCode,
      languageCodes
    );
    window.dispatchEvent(new CustomEvent("site:navigation-start"));
    setIsOpen(false);
    setQuery("");
    onNavigate();
    router.push(href);
  };

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={cn(
          "overflow-hidden rounded-[5px] transition-all duration-300 ease-out",
          isOpen ? (isMobile ? "w-[240px]" : "w-[320px]") : "w-10",
          isTransparent && !isOpen
            ? "text-[var(--site-color-hero-text)]"
            : "text-[var(--site-color-foreground)]",
          isOpen
            ? "border border-[var(--site-color-border)] bg-[var(--site-color-surface)] shadow-sm"
            : ""
        )}
        style={
          isTransparent
            ? {
                backgroundColor: isOpen ? "var(--site-color-surface)" : "transparent",
                borderColor: isOpen ? "var(--site-color-border)" : "transparent",
              }
            : undefined
        }
      >
        <div className="flex h-10 items-center">
          <button
            aria-expanded={isOpen}
            aria-label="Search services"
            className={cn(
              "inline-flex h-10 w-10 shrink-0 items-center justify-center transition-colors",
              isTransparent && !isOpen
                ? "hover:bg-white/15"
                : "hover:bg-[var(--site-color-muted)]"
            )}
            onClick={() => {
              if (isOpen) {
                setQuery("");
              }
              setIsOpen((previousValue) => !previousValue);
            }}
            type="button"
          >
            {isOpen ? (
              <X className="h-[18px] w-[18px] stroke-[2.4]" />
            ) : (
              <Search className="h-[18px] w-[18px] stroke-[2.4]" />
            )}
          </button>
          <div
            className={cn(
              "min-w-0 transition-all duration-300 ease-out",
              isOpen
                ? isMobile
                  ? "w-[200px] opacity-100"
                  : "w-[280px] opacity-100"
                : "w-0 opacity-0"
            )}
          >
            <input
              className={cn(
                "h-10 w-full bg-transparent pr-4 text-sm outline-none placeholder:text-current/60",
                isTransparent ? "text-[var(--site-color-hero-text)]" : "text-[var(--site-color-foreground)]"
              )}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && filteredServices[0]) {
                  event.preventDefault();
                  navigateToService(filteredServices[0].id);
                }
              }}
              placeholder={placeholder}
              ref={inputRef}
              type="search"
              value={query}
            />
          </div>
        </div>
      </div>

      {isOpen ? (
        <div
          className={cn(
            "absolute top-full z-[70] mt-2 overflow-hidden rounded-[8px] border border-[var(--site-color-border)] bg-[var(--site-color-surface)] shadow-lg",
            isMobile ? "right-0 w-[240px]" : "right-0 w-[320px]"
          )}
        >
          <ul className="max-h-[320px] overflow-y-auto py-2">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <li key={service.id}>
                  <button
                    className="flex w-full flex-col items-start gap-1 px-4 py-3 text-left transition-colors hover:bg-[var(--site-color-muted)]"
                    onClick={() => navigateToService(service.id)}
                    type="button"
                  >
                    <span className="text-sm font-medium text-[var(--site-color-foreground)]">
                      {service.title}
                    </span>
                    <span className="line-clamp-2 text-xs text-[var(--site-color-muted-foreground)]">
                      {service.shortDescription}
                    </span>
                  </button>
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-sm text-[var(--site-color-muted-foreground)]">
                No services found.
              </li>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
