import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Service } from "@/types/content";

interface ServiceCardProps {
  className?: string;
  service: Service;
  viewDetailsLabel: string;
}

export function ServiceCard({ className, service, viewDetailsLabel }: Readonly<ServiceCardProps>) {
  const imageStyle = service.image
    ? ({ backgroundImage: `url("${service.image}")` } as const)
    : undefined;

  return (
    <Link
      className={cn(
        "group block cursor-pointer overflow-hidden rounded-[5px] border border-[var(--site-color-border)] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--site-color-primary)] hover:shadow-md",
        className
      )}
      href={`/services/${service.id}`}
    >
      <div className="h-full bg-white">
        <div className="h-44 bg-[var(--site-color-muted)] md:h-48">
          <div
            className="h-full w-full bg-cover bg-center transition-[transform,filter] duration-500 group-hover:scale-105 group-hover:brightness-110"
            style={imageStyle}
          />
        </div>
        <div className="space-y-3 p-4">
          <h2 className="site-heading text-xl font-semibold leading-tight text-[var(--site-color-foreground)]">
            {service.title}
          </h2>
          <p className="min-h-[54px] text-sm leading-relaxed text-[var(--site-color-muted-foreground)]">
            {service.shortDescription}
          </p>
        </div>
        <div className="border-t border-[var(--site-color-border)] px-4 pb-4 pt-3">
          <span className="flex items-center justify-between rounded-[5px] px-2 py-1 text-sm font-semibold text-[var(--site-color-primary)] transition-shadow duration-300 group-hover:shadow-sm">
            <span>{viewDetailsLabel}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
