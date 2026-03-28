"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
} from "react";

import { ROUTES } from "@/lib/constants";
import { createLocalizedPath } from "@/lib/site-i18n";
import { cn } from "@/lib/utils";
import type { Service } from "@/types/content";

interface HeaderSearchProps {
  activeLanguageCode: string;
  isTransparent: boolean;
  languageCodes: string[];
  onNavigate: () => void;
  onOpenChange?: (isOpen: boolean) => void;
  placeholder: string;
  size?: "desktop" | "mobile";
  services: Service[];
}

export function HeaderSearch({
  activeLanguageCode,
  isTransparent,
  languageCodes,
  onNavigate,
  onOpenChange,
  placeholder,
  size = "desktop",
  services,
}: Readonly<HeaderSearchProps>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = size === "mobile";
  const searchResultsId = useId();

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
    onOpenChange?.(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (containerRef.current?.contains(target)) return;
      setExpandedState(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpandedState(false);
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

  const setExpandedState = (nextIsOpen: boolean, shouldResetQuery = true) => {
    setIsOpen(nextIsOpen);
    onOpenChange?.(nextIsOpen);
    if (!nextIsOpen && shouldResetQuery) {
      setQuery("");
    }
  };

  const closeSearch = (shouldResetQuery = true) => {
    setExpandedState(false, shouldResetQuery);
  };

  const navigateToService = (serviceId: string) => {
    const href = createLocalizedPath(
      `${ROUTES.SERVICE_DETAIL}/${serviceId}`,
      activeLanguageCode,
      languageCodes
    );
    window.dispatchEvent(new CustomEvent("site:navigation-start"));
    setExpandedState(false);
    onNavigate();
    router.push(href);
  };

  const focusResultByIndex = (index: number) => {
    const resultButtons = Array.from(
      containerRef.current?.querySelectorAll<HTMLButtonElement>("[data-service-id]") || []
    );
    if (resultButtons.length === 0) return;
    const boundedIndex = Math.max(0, Math.min(index, resultButtons.length - 1));
    resultButtons[boundedIndex]?.focus();
  };

  const handleSearchButtonClick = () => {
    if (isOpen) {
      closeSearch();
      return;
    }
    setExpandedState(true, false);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && filteredServices[0]) {
      event.preventDefault();
      navigateToService(filteredServices[0].id);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusResultByIndex(0);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeSearch(false);
      triggerButtonRef.current?.focus();
    }
  };

  const handleResultClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    const { serviceId } = event.currentTarget.dataset;
    if (!serviceId) return;
    navigateToService(serviceId);
  };

  const handleResultKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    const resultButtons = Array.from(
      containerRef.current?.querySelectorAll<HTMLButtonElement>("[data-service-id]") || []
    );
    const currentIndex = resultButtons.findIndex((button) => button === event.currentTarget);

    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusResultByIndex(currentIndex + 1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (currentIndex <= 0) {
        inputRef.current?.focus();
        return;
      }
      focusResultByIndex(currentIndex - 1);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeSearch(false);
      triggerButtonRef.current?.focus();
    }
  };

  const handleContainerBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget as Node | null;
    if (!nextTarget || containerRef.current?.contains(nextTarget)) return;
    closeSearch();
  };

  return (
    <div
      className={cn("relative", isMobile && isOpen ? "flex-1" : "")}
      onBlurCapture={handleContainerBlur}
      ref={containerRef}
    >
      <div
        className={cn(
          "overflow-hidden rounded-[5px] transition-all duration-300 ease-out",
          isOpen ? (isMobile ? "w-full" : "w-[320px]") : "w-10",
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
            aria-controls={searchResultsId}
            aria-expanded={isOpen}
            aria-label="Search services"
            className={cn(
              "inline-flex h-10 w-10 shrink-0 items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--site-color-surface)]",
              isTransparent && !isOpen
                ? "hover:bg-white/15"
                : "hover:bg-[var(--site-color-muted)]"
            )}
            onClick={handleSearchButtonClick}
            ref={triggerButtonRef}
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
                  ? "w-[calc(100%-40px)] opacity-100"
                  : "w-[280px] opacity-100"
                : "w-0 opacity-0"
            )}
          >
            <input
              aria-hidden={!isOpen}
              className={cn(
                "h-10 w-full bg-transparent pr-4 text-sm outline-none placeholder:text-current/60 focus-visible:outline-none",
                isTransparent && !isOpen
                  ? "text-[var(--site-color-hero-text)]"
                  : "text-[var(--site-color-foreground)]"
              )}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              placeholder={placeholder}
              ref={inputRef}
              tabIndex={isOpen ? 0 : -1}
              type="search"
              value={query}
            />
          </div>
        </div>
      </div>

      {isOpen ? (
        <div
          id={searchResultsId}
          className={cn(
            "absolute top-full z-[70] mt-2 overflow-hidden rounded-[8px] border border-[var(--site-color-border)] bg-[var(--site-color-surface)] shadow-lg",
            isMobile ? "left-0 right-0 w-full" : "right-0 w-[320px]"
          )}
        >
          <ul className="max-h-[320px] overflow-y-auto py-2">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <li key={service.id}>
                  <button
                    aria-hidden={!isOpen}
                    className="flex w-full flex-col items-start gap-1 px-4 py-3 text-left transition-colors hover:bg-[var(--site-color-muted)] focus-visible:bg-[var(--site-color-muted)] focus-visible:outline-none"
                    data-service-id={service.id}
                    onClick={handleResultClick}
                    onKeyDown={handleResultKeyDown}
                    tabIndex={isOpen ? 0 : -1}
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
