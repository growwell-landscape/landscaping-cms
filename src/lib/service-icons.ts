import {
  BadgeCheck,
  Bug,
  Building2,
  CalendarCheck,
  CloudRain,
  Droplets,
  Fence,
  Fish,
  Flower2,
  Hammer,
  Home,
  MapPinned,
  PencilRuler,
  Pickaxe,
  Ruler,
  Leaf,
  PanelsTopLeft,
  Scissors,
  ShieldCheck,
  Shovel,
  Sprout,
  SunMedium,
  TentTree,
  Tractor,
  TreePine,
  Waves,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type { Service } from "@/types/content";

type ServiceIconOption = {
  label: string;
  value: string;
};

const serviceIconMap: Record<string, LucideIcon> = {
  "badge-check": BadgeCheck,
  bug: Bug,
  "building-2": Building2,
  calendar: CalendarCheck,
  "calendar-check": CalendarCheck,
  calander: CalendarCheck,
  "cloud-rain": CloudRain,
  droplets: Droplets,
  fence: Fence,
  fish: Fish,
  flower: Flower2,
  "flower-2": Flower2,
  hammer: Hammer,
  home: Home,
  leaf: Leaf,
  "map-pinned": MapPinned,
  "panels-top-left": PanelsTopLeft,
  "pencil-ruler": PencilRuler,
  pickaxe: Pickaxe,
  ruler: Ruler,
  scissors: Scissors,
  "shield-check": ShieldCheck,
  shovel: Shovel,
  sprout: Sprout,
  "sun-medium": SunMedium,
  "tent-tree": TentTree,
  tractor: Tractor,
  tree: TreePine,
  "tree-pine": TreePine,
  waves: Waves,
  wrench: Wrench,
};

const serviceIconOptions: ServiceIconOption[] = Object.keys(serviceIconMap)
  .sort((left, right) => left.localeCompare(right))
  .map((iconName) => ({
    value: iconName,
    label: iconName
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" "),
  }));

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

export function getServiceIconOptions(): ServiceIconOption[] {
  return serviceIconOptions;
}
