import type {
  ThemeColors,
  ThemeConfig,
  ThemeEffects,
  ThemeFonts,
} from "@/types/config";

const DEFAULT_THEME_CONFIG: ThemeConfig = {
  colors: {
    primary: "#48a649",
    primaryHover: "#3d8c3e",
    primaryForeground: "#ffffff",
    secondary: "#6fbf73",
    secondaryHover: "#5ca960",
    secondaryForeground: "#0f1f14",
    background: "#ffffff",
    backgroundAlt: "#f6f8f4",
    foreground: "#1a1a1a",
    muted: "#f5f5f5",
    mutedForeground: "#6b7280",
    accent: "#e8f5e9",
    accentForeground: "#1f5133",
    border: "#e5e7eb",
    surface: "#ffffff",
    surfaceMuted: "#edf2ee",
    surfaceElevated: "#ffffff",
    footerBackground: "#f4f6f4",
    heroText: "#ffffff",
    heroMutedText: "rgba(255, 255, 255, 0.85)",
    overlay: "rgba(0, 0, 0, 0.28)",
    overlayStrong: "rgba(0, 0, 0, 0.45)",
    success: "#16a34a",
    successForeground: "#ffffff",
    warning: "#f59e0b",
    warningForeground: "#ffffff",
    danger: "#dc2626",
    dangerForeground: "#ffffff",
    info: "#2563eb",
    infoForeground: "#ffffff",
    whatsapp: "#25d366",
    whatsappForeground: "#ffffff",
    mapAccent: "#1a73e8",
    mapAccentForeground: "#ffffff",
  },
  fonts: {
    heading: "'Montserrat', sans-serif",
    body: "'Inter', sans-serif",
    ui: "'Inter', sans-serif",
  },
  effects: {
    pageHeroGradient:
      "linear-gradient(130deg, #173425 0%, #1e4a34 42%, #2a6848 100%), radial-gradient(circle at 15% 20%, rgba(255,255,255,0.16) 0 12%, transparent 13%), radial-gradient(circle at 82% 72%, rgba(255,255,255,0.12) 0 9%, transparent 10%)",
    heroImageOverlay: "rgba(0, 0, 0, 0.45)",
    serviceHeroImageOverlay: "linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.6), rgba(0,0,0,0.4))",
    adminLoginGradient: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
  },
  customCss: "",
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeObjects<T extends object>(
  base: T,
  override: unknown
): T {
  if (!isObject(override)) {
    return { ...base } as T;
  }

  const merged = { ...base } as T;
  const typedOverride = override as Partial<Record<keyof T, unknown>>;
  Object.entries(typedOverride).forEach(([key, value]) => {
    if (typeof value === "string" && value.trim().length > 0) {
      merged[key as keyof T] = value as T[keyof T];
    }
  });
  return merged as T;
}

export function normalizeThemeConfig(theme: unknown): ThemeConfig {
  if (!isObject(theme)) {
    return { ...DEFAULT_THEME_CONFIG };
  }

  return {
    colors: mergeObjects<ThemeColors>(DEFAULT_THEME_CONFIG.colors, theme.colors),
    fonts: mergeObjects<ThemeFonts>(DEFAULT_THEME_CONFIG.fonts, theme.fonts),
    effects: mergeObjects<ThemeEffects>(DEFAULT_THEME_CONFIG.effects, theme.effects),
    customCss:
      typeof theme.customCss === "string"
        ? theme.customCss
        : DEFAULT_THEME_CONFIG.customCss,
  };
}

export function createSiteThemeStyle(theme: unknown): Record<string, string> {
  const resolvedTheme = normalizeThemeConfig(theme);

  return {
    "--site-color-primary": resolvedTheme.colors.primary,
    "--site-color-primary-hover": resolvedTheme.colors.primaryHover,
    "--site-color-primary-foreground": resolvedTheme.colors.primaryForeground,
    "--site-color-secondary": resolvedTheme.colors.secondary,
    "--site-color-secondary-hover": resolvedTheme.colors.secondaryHover,
    "--site-color-secondary-foreground": resolvedTheme.colors.secondaryForeground,
    "--site-color-background": resolvedTheme.colors.background,
    "--site-color-background-alt": resolvedTheme.colors.backgroundAlt,
    "--site-color-foreground": resolvedTheme.colors.foreground,
    "--site-color-muted": resolvedTheme.colors.muted,
    "--site-color-muted-foreground": resolvedTheme.colors.mutedForeground,
    "--site-color-accent": resolvedTheme.colors.accent,
    "--site-color-accent-foreground": resolvedTheme.colors.accentForeground,
    "--site-color-border": resolvedTheme.colors.border,
    "--site-color-surface": resolvedTheme.colors.surface,
    "--site-color-surface-muted": resolvedTheme.colors.surfaceMuted,
    "--site-color-surface-elevated": resolvedTheme.colors.surfaceElevated,
    "--site-color-footer-background": resolvedTheme.colors.footerBackground,
    "--site-color-hero-text": resolvedTheme.colors.heroText,
    "--site-color-hero-muted-text": resolvedTheme.colors.heroMutedText,
    "--site-color-overlay": resolvedTheme.colors.overlay,
    "--site-color-overlay-strong": resolvedTheme.colors.overlayStrong,
    "--site-color-success": resolvedTheme.colors.success,
    "--site-color-success-foreground": resolvedTheme.colors.successForeground,
    "--site-color-warning": resolvedTheme.colors.warning,
    "--site-color-warning-foreground": resolvedTheme.colors.warningForeground,
    "--site-color-danger": resolvedTheme.colors.danger,
    "--site-color-danger-foreground": resolvedTheme.colors.dangerForeground,
    "--site-color-info": resolvedTheme.colors.info,
    "--site-color-info-foreground": resolvedTheme.colors.infoForeground,
    "--site-color-whatsapp": resolvedTheme.colors.whatsapp,
    "--site-color-whatsapp-foreground": resolvedTheme.colors.whatsappForeground,
    "--site-color-map-accent": resolvedTheme.colors.mapAccent,
    "--site-color-map-accent-foreground": resolvedTheme.colors.mapAccentForeground,
    "--site-font-body": resolvedTheme.fonts.body,
    "--site-font-heading": resolvedTheme.fonts.heading,
    "--site-font-ui": resolvedTheme.fonts.ui,
    "--site-effect-page-hero-gradient": resolvedTheme.effects.pageHeroGradient,
    "--site-effect-hero-image-overlay": resolvedTheme.effects.heroImageOverlay,
    "--site-effect-service-hero-image-overlay":
      resolvedTheme.effects.serviceHeroImageOverlay,
  };
}

export function createAdminThemeStyle(theme: unknown): Record<string, string> {
  const resolvedTheme = normalizeThemeConfig(theme);

  return {
    "--admin-color-page-background": resolvedTheme.colors.backgroundAlt,
    "--admin-color-surface": resolvedTheme.colors.surface,
    "--admin-color-surface-muted": resolvedTheme.colors.surfaceMuted,
    "--admin-color-surface-elevated": resolvedTheme.colors.surfaceElevated,
    "--admin-color-foreground": resolvedTheme.colors.foreground,
    "--admin-color-muted-foreground": resolvedTheme.colors.mutedForeground,
    "--admin-color-border": resolvedTheme.colors.border,
    "--admin-color-primary": resolvedTheme.colors.primary,
    "--admin-color-primary-hover": resolvedTheme.colors.primaryHover,
    "--admin-color-primary-foreground": resolvedTheme.colors.primaryForeground,
    "--admin-color-secondary": resolvedTheme.colors.secondary,
    "--admin-color-secondary-hover": resolvedTheme.colors.secondaryHover,
    "--admin-color-secondary-foreground": resolvedTheme.colors.secondaryForeground,
    "--admin-color-accent": resolvedTheme.colors.accent,
    "--admin-color-accent-foreground": resolvedTheme.colors.accentForeground,
    "--admin-color-success": resolvedTheme.colors.success,
    "--admin-color-success-foreground": resolvedTheme.colors.successForeground,
    "--admin-color-warning": resolvedTheme.colors.warning,
    "--admin-color-warning-foreground": resolvedTheme.colors.warningForeground,
    "--admin-color-danger": resolvedTheme.colors.danger,
    "--admin-color-danger-foreground": resolvedTheme.colors.dangerForeground,
    "--admin-color-info": resolvedTheme.colors.info,
    "--admin-color-info-foreground": resolvedTheme.colors.infoForeground,
    "--admin-color-whatsapp": resolvedTheme.colors.whatsapp,
    "--admin-color-whatsapp-foreground": resolvedTheme.colors.whatsappForeground,
    "--admin-font-body": resolvedTheme.fonts.ui || resolvedTheme.fonts.body,
    "--admin-font-heading": resolvedTheme.fonts.heading,
    "--admin-effect-login-gradient": resolvedTheme.effects.adminLoginGradient,
  };
}

export { DEFAULT_THEME_CONFIG };
