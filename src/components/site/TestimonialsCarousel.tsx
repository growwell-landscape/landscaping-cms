"use client";

import { Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Testimonial } from "@/types/config";

import { ScrollReveal } from "./ScrollReveal";
import { SectionContainer } from "./SectionContainer";
import { SectionHeading } from "./SectionHeading";
import { SiteImage } from "./SiteImage";

interface TestimonialsCarouselProps {
  items: Testimonial[];
  subtitle?: string;
  title: string;
}

function clampRating(value: number | undefined): number {
  if (!Number.isFinite(value)) {
    return 5;
  }

  return Math.max(0, Math.min(5, value as number));
}

function RatingStars({ rating }: Readonly<{ rating?: number }>) {
  const safeRating = clampRating(rating);
  const fillWidth = `${(safeRating / 5) * 100}%`;

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="flex items-center gap-1 text-[var(--site-color-border)]">
          {Array.from({ length: 5 }).map((_, starIndex) => (
            <Star className="h-4 w-4" key={`testimonial-star-outline-${starIndex}`} />
          ))}
        </div>
        <div className="absolute inset-0 overflow-hidden" style={{ width: fillWidth }}>
          <div className="flex items-center gap-1 text-[var(--site-color-primary)]">
            {Array.from({ length: 5 }).map((_, starIndex) => (
              <Star
                className="h-4 w-4 fill-current"
                key={`testimonial-star-fill-${starIndex}`}
              />
            ))}
          </div>
        </div>
      </div>
      <span className="text-sm font-semibold text-[var(--site-color-primary)]">
        {safeRating.toFixed(1)}
      </span>
    </div>
  );
}

function TestimonialCard({ item }: Readonly<{ item: Testimonial }>) {
  return (
    <article className="flex h-full flex-col rounded-[5px] border border-[var(--site-color-border)] bg-[var(--site-color-surface-elevated)] p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <Quote className="h-8 w-8 text-[var(--site-color-primary)]" />
        <RatingStars rating={item.rating} />
      </div>
      <p className="mt-5 flex-1 text-base leading-relaxed text-[var(--site-color-muted-foreground)]">
        {item.quote}
      </p>
      <div className="mt-6 flex items-center gap-4">
        {item.image ? (
          <div className="h-14 w-14 overflow-hidden rounded-full bg-[var(--site-color-muted)]">
            <SiteImage
              alt={`${item.name} photo`}
              className="h-full w-full"
              imgClassName="object-cover"
              src={item.image}
            />
          </div>
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--site-color-accent)] text-lg font-semibold text-[var(--site-color-primary)]">
            {item.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h3 className="site-heading text-xl font-semibold text-[var(--site-color-foreground)]">
            {item.name}
          </h3>
          <p className="text-sm text-[var(--site-color-muted-foreground)]">
            {item.role}
          </p>
        </div>
      </div>
    </article>
  );
}

export function TestimonialsCarousel({
  items,
  subtitle,
  title,
}: Readonly<TestimonialsCarouselProps>) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    if (!api) return;

    const update = () => {
      setCanScroll(api.scrollSnapList().length > 1);
    };

    update();
    api.on("reInit", update);
    api.on("select", update);

    return () => {
      api.off("reInit", update);
      api.off("select", update);
    };
  }, [api]);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="site-surface py-20 md:py-24">
      <SectionContainer>
        <SectionHeading subtitle={subtitle} title={title} />
        <ScrollReveal delayMs={70}>
          <div className="mt-10">
            {items.length === 1 ? (
              <div className="mx-auto max-w-2xl">
                <TestimonialCard item={items[0]} />
              </div>
            ) : (
              <Carousel opts={{ align: "start", loop: items.length > 1 }} setApi={setApi}>
                <CarouselContent>
                  {items.map((item, index) => (
                    <CarouselItem className="basis-full md:basis-1/2" key={`${item.name}-${index}`}>
                      <TestimonialCard item={item} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {canScroll ? (
                  <>
                    <CarouselPrevious className="left-1 hidden h-10 w-10 rounded-[5px] border-[var(--site-color-border)] bg-[var(--site-color-surface)] text-[var(--site-color-primary)] md:inline-flex" />
                    <CarouselNext className="right-1 hidden h-10 w-10 rounded-[5px] border-[var(--site-color-border)] bg-[var(--site-color-surface)] text-[var(--site-color-primary)] md:inline-flex" />
                  </>
                ) : null}
              </Carousel>
            )}
          </div>
        </ScrollReveal>
      </SectionContainer>
    </section>
  );
}
