import {
  CalendarCheck,
  Droplets,
  Fish,
  Flower2,
  Leaf,
  PanelsTopLeft,
  Scissors,
  Shovel,
  Sprout,
  TreePine,
  type LucideIcon,
} from "lucide-react";

import type { Service } from "@/types/content";

const serviceIconMap: Record<string, LucideIcon> = {
  "calendar-check": CalendarCheck,
  droplets: Droplets,
  fish: Fish,
  flower: Flower2,
  "flower-2": Flower2,
  leaf: Leaf,
  "panels-top-left": PanelsTopLeft,
  scissors: Scissors,
  shovel: Shovel,
  sprout: Sprout,
  "tree-pine": TreePine,
};

function normalizeIconName(iconName: string): string {
  return iconName.trim().toLowerCase().replace(/[_\s]+/g, "-");
}

function inferServiceIconName(service: Pick<Service, "id" | "title" | "icon">): string {
  const haystack = `${service.id} ${service.title}`.toLowerCase();

  if (haystack.includes("annual maintenance") || haystack.includes("contract") || haystack.includes("amc")) {
    return "calendar-check";
  }
  if (haystack.includes("pond") || haystack.includes("fish")) {
    return "fish";
  }
  if (haystack.includes("tree plantation")) {
    return "tree-pine";
  }
  if (haystack.includes("vertical") || haystack.includes("green wall")) {
    return "panels-top-left";
  }
  if (haystack.includes("potted") || haystack.includes("pot")) {
    return "flower-2";
  }
  if (haystack.includes("drip") || haystack.includes("irrigation")) {
    return "droplets";
  }
  if (haystack.includes("maintenance") || haystack.includes("pruning") || haystack.includes("trimming")) {
    return "scissors";
  }
  if (haystack.includes("planning") || haystack.includes("execution") || haystack.includes("landscape")) {
    return "shovel";
  }
  if (haystack.includes("lawn")) {
    return "leaf";
  }

  return "sprout";
}

export function getServiceIcon(service: Pick<Service, "id" | "title" | "icon">): LucideIcon {
  const normalizedIconName = normalizeIconName(service.icon || "");
  if (normalizedIconName && serviceIconMap[normalizedIconName]) {
    return serviceIconMap[normalizedIconName];
  }

  return serviceIconMap[inferServiceIconName(service)] || Sprout;
}
