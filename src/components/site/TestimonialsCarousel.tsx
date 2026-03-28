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
            <Carousel opts={{ align: "start", loop: items.length > 1 }} setApi={setApi}>
              <CarouselContent>
                {items.map((item, index) => (
                  <CarouselItem className="basis-full md:basis-1/2" key={`${item.name}-${index}`}>
                    <article className="flex h-full flex-col rounded-[5px] border border-[var(--site-color-border)] bg-[var(--site-color-surface-elevated)] p-6 shadow-sm">
                      <div className="flex items-center justify-between">
                        <Quote className="h-8 w-8 text-[var(--site-color-primary)]" />
                        <div className="flex items-center gap-1 text-[var(--site-color-primary)]">
                          {Array.from({ length: 5 }).map((_, starIndex) => (
                            <Star className="h-4 w-4 fill-current" key={`${item.name}-star-${starIndex}`} />
                          ))}
                        </div>
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
          </div>
        </ScrollReveal>
      </SectionContainer>
    </section>
  );
}
