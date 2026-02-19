"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import {
  ArrowRight,
  Building2,
  Droplets,
  Fish,
  Flower2,
  Leaf,
  LucideProps,
  Scissors,
  Search,
  Shovel,
  Sprout,
  TreeDeciduous,
  WavesLadder,
} from "lucide-react";

import type { Service } from "@/types/content";

import { SectionContainer } from "./SectionContainer";

type ServiceIcon = ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

interface ServicesCatalogPageProps {
  noResultsLabel: string;
  searchPlaceholder: string;
  services: Service[];
  subtitle: string;
  title: string;
  viewDetailsLabel: string;
}

interface ServiceCardProps {
  service: Service;
  viewDetailsLabel: string;
}

const serviceIconMap: Record<string, ServiceIcon> = {
  building: Building2,
  droplets: Droplets,
  fish: Fish,
  flower: Flower2,
  leaf: Leaf,
  scissors: Scissors,
  shovel: Shovel,
  sprout: Sprout,
  "tree-deciduous": TreeDeciduous,
  "waves-ladder": WavesLadder,
};

function normalizeIconName(iconName: string): string {
  return iconName.trim().toLowerCase().replace(/[_\s]+/g, "-");
}

function getServiceIcon(iconName: string): ServiceIcon {
  const normalized = normalizeIconName(iconName);
  return serviceIconMap[normalized] || Leaf;
}

function ServiceCard({ service, viewDetailsLabel }: ServiceCardProps) {
  const Icon = getServiceIcon(service.icon);
  const imageStyle = service.image
    ? ({ backgroundImage: `url("${service.image}")` } as const)
    : undefined;

  return (
    <Link
      className="group block cursor-pointer overflow-hidden rounded-[5px] border border-[var(--site-color-border)] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
      href={`/services/${service.id}`}
    >
      <div className="relative h-44 bg-[var(--site-color-muted)] md:h-48">
        <div
          className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={imageStyle}
        />
        <span className="absolute left-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-[5px] bg-white text-[var(--site-color-primary)] shadow-sm">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="space-y-2.5 px-4 pb-4 pt-3.5">
        <h2 className="site-heading text-xl font-semibold leading-tight text-[var(--site-color-foreground)]">
          {service.title}
        </h2>
        <p className="min-h-[54px] text-[13px] leading-relaxed text-[var(--site-color-muted-foreground)] md:text-sm">
          {service.shortDescription}
        </p>
      </div>
      <div className="border-t border-[var(--site-color-border)] px-4 py-3.5">
        <span className="inline-flex items-center gap-2 rounded-[5px] bg-[var(--site-color-accent)] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--site-color-primary)]">
          <span>{viewDetailsLabel}</span>
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

export function ServicesCatalogPage({
  noResultsLabel,
  searchPlaceholder,
  services,
  subtitle,
  title,
  viewDetailsLabel,
}: ServicesCatalogPageProps) {
  const [query, setQuery] = useState("");
  const shouldShowSearch = services.length > 8;

  const filteredServices = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return services;
    }

    return services.filter((service) => {
      return [service.title, service.shortDescription, service.description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(needle));
    });
  }, [query, services]);

  return (
    <>
      <section className="relative overflow-hidden pb-12 pt-32 md:pb-14 md:pt-36">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(130deg, #173425 0%, #1e4a34 42%, #2a6848 100%), radial-gradient(circle at 15% 20%, rgba(255,255,255,0.16) 0 12%, transparent 13%), radial-gradient(circle at 82% 72%, rgba(255,255,255,0.12) 0 9%, transparent 10%)",
          }}
        />
        <SectionContainer className="relative text-center">
          <h1 className="site-heading text-4xl font-semibold text-white md:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-white/85 md:text-base">
            {subtitle}
          </p>
          {shouldShowSearch ? (
            <div className="mx-auto mt-8 max-w-[560px]">
              <label className="sr-only" htmlFor="services-search">
                {searchPlaceholder}
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--site-color-muted-foreground)]" />
                <input
                  className="h-12 w-full rounded-[5px] border border-[var(--site-color-border)] bg-white pl-12 pr-4 text-sm text-[var(--site-color-foreground)] outline-none transition-colors focus:border-[var(--site-color-primary)]"
                  id="services-search"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={searchPlaceholder}
                  type="search"
                  value={query}
                />
              </div>
            </div>
          ) : null}
        </SectionContainer>
      </section>

      <section className="bg-white py-12 md:py-16">
        <SectionContainer>
          {filteredServices.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredServices.map((service) => (
                <ServiceCard key={service.id} service={service} viewDetailsLabel={viewDetailsLabel} />
              ))}
            </div>
          ) : (
            <div className="rounded-[5px] border border-[var(--site-color-border)] bg-[var(--site-color-muted)] p-8 text-center text-sm text-[var(--site-color-muted-foreground)]">
              {noResultsLabel}
            </div>
          )}
        </SectionContainer>
      </section>
    </>
  );
}
