import type { Project } from "@/types/content";

import { SectionContainer } from "./SectionContainer";
import { SectionHeading } from "./SectionHeading";
import { ProjectsCarousel } from "./ProjectsCarousel";

interface ProjectsSectionProps {
  projects: Project[];
  title: string;
}

/**
 * Homepage projects section.
 */
export function ProjectsSection({ projects, title }: ProjectsSectionProps) {
  return (
    <section className="bg-white py-20 md:py-24">
      <SectionContainer>
        <SectionHeading alignment="left" className="max-w-none" title={title} />
        <ProjectsCarousel projects={projects} />
      </SectionContainer>
    </section>
  );
}
