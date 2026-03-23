/**
 * Type definitions for site configuration
 * Ensures type-safe access to configuration data throughout the application
 */

/**
 * Logo configuration object
 */
export interface LogoConfig {
  /** Display mode for brand block */
  displayMode?: "generated-with-name" | "image-with-name" | "image-only";
  /** Type of logo: 'image' or 'text' */
  type: "image" | "text";
  /** URL to the logo image */
  imageUrl?: string;
  /** Text to display as logo */
  text?: string;
  /** Whether to show the text logo */
  showText?: boolean;
  /** How image should fit inside logo badge */
  imageObjectFit?: "cover" | "contain";
  /** Blend mode applied to image for theme tinting */
  imageBlendMode?:
    | "normal"
    | "multiply"
    | "screen"
    | "overlay"
    | "darken"
    | "lighten"
    | "color"
    | "luminosity";
  /** Logo image width in pixels */
  imageWidth?: number;
  /** Logo image height in pixels */
  imageHeight?: number;
  /** Logo image width on small screens in pixels */
  imageMobileWidth?: number;
  /** Logo image height on small screens in pixels */
  imageMobileHeight?: number;
}

/**
 * Site information object
 */
export interface LanguageConfig {
  /** Display language name */
  name: string;
  /** Language code, e.g. en, ta, hi */
  code: string;
}

/**
 * Site information object
 */
export interface SiteConfig {
  /** Site name */
  name: string;
  /** Company name */
  companyName: string;
  /** Site tagline */
  tagline: string;
  /** Site description */
  description: string;
  /** Logo configuration */
  logo: LogoConfig;
  /** Default language code */
  defaultLanguage: string;
  /** Language configuration entries */
  languages: LanguageConfig[];
  /** Array of available language codes */
  availableLanguages: string[];
}

/**
 * SEO metadata configuration
 */
export interface SEOConfig {
  /** Page title for SEO */
  title: string;
  /** Page meta description */
  description: string;
  /** SEO keywords */
  keywords: string;
  /** Favicon path */
  favicon: string;
  /** Open Graph image path */
  ogImage: string;
}

/**
 * Theme color palette
 */
export interface ThemeColors {
  /** Primary brand color (hex) */
  primary: string;
  /** Primary color on hover state */
  primaryHover: string;
  /** Text/icon color displayed on primary surfaces */
  primaryForeground: string;
  /** Secondary brand color */
  secondary: string;
  /** Secondary color on hover state */
  secondaryHover: string;
  /** Text/icon color displayed on secondary surfaces */
  secondaryForeground: string;
  /** Background color */
  background: string;
  /** Alternate page background color */
  backgroundAlt: string;
  /** Primary text/foreground color */
  foreground: string;
  /** Muted/disabled background color */
  muted: string;
  /** Muted/disabled text color */
  mutedForeground: string;
  /** Accent/highlight color */
  accent: string;
  /** Text/icon color displayed on accent surfaces */
  accentForeground: string;
  /** Border color */
  border: string;
  /** Default surface/card color */
  surface: string;
  /** Soft surface/card color */
  surfaceMuted: string;
  /** Elevated surface/card color */
  surfaceElevated: string;
  /** Footer-specific background color */
  footerBackground: string;
  /** Text color used on dark hero sections */
  heroText: string;
  /** Muted text color used on dark hero sections */
  heroMutedText: string;
  /** Light overlay tint */
  overlay: string;
  /** Strong overlay tint */
  overlayStrong: string;
  /** Success state color */
  success: string;
  /** Success text color */
  successForeground: string;
  /** Warning state color */
  warning: string;
  /** Warning text color */
  warningForeground: string;
  /** Danger state color */
  danger: string;
  /** Danger text color */
  dangerForeground: string;
  /** Informational state color */
  info: string;
  /** Informational text color */
  infoForeground: string;
  /** WhatsApp action color */
  whatsapp: string;
  /** Text/icon color on WhatsApp surfaces */
  whatsappForeground: string;
  /** Accent color for map actions */
  mapAccent: string;
  /** Text/icon color on map accent surfaces */
  mapAccentForeground: string;
}

/**
 * Theme fonts configuration
 */
export interface ThemeFonts {
  /** Font family for headings */
  heading: string;
  /** Font family for body text */
  body: string;
  /** Font family for admin/forms/buttons */
  ui: string;
}

/**
 * Theme effect tokens
 */
export interface ThemeEffects {
  /** Gradient used for top hero sections on content pages */
  pageHeroGradient: string;
  /** Overlay used on the homepage hero image */
  heroImageOverlay: string;
  /** Overlay used on service detail hero images */
  serviceHeroImageOverlay: string;
  /** Gradient used on admin login */
  adminLoginGradient: string;
}

/**
 * Theme configuration
 */
export interface ThemeConfig {
  /** Color palette */
  colors: ThemeColors;
  /** Font families */
  fonts: ThemeFonts;
  /** Decorative gradients and overlays */
  effects: ThemeEffects;
  /** Custom CSS override */
  customCss?: string;
}

/**
 * WhatsApp contact configuration
 */
export interface WhatsAppConfig {
  /** WhatsApp number (digits only) */
  number: string;
  /** Default message to send */
  defaultMessage: string;
}

/**
 * Floating contact widget configuration
 */
export interface FloatingContactConfig {
  /** Whether floating contact is enabled */
  enabled: boolean;
  /** Show WhatsApp button */
  showWhatsApp: boolean;
  /** Show email button */
  showEmail: boolean;
}

/**
 * Google Maps location information
 */
export interface LocationInfo {
  /** Location name */
  name: string;
  /** Google Maps share URL */
  url: string;
}

/**
 * Contact information
 */
export interface ContactConfig {
  /** Phone number */
  phone: string;
  /** Optional list of phone numbers */
  phoneNumbers?: string[];
  /** Email address */
  email: string;
  /** Optional list of email addresses */
  emails?: string[];
  /** Physical address */
  address: string;
  /** Optional list of physical addresses */
  addresses?: string[];
  /** Optional business timings/hours */
  timings?: string[];
  /** Location information with Google Maps link */
  location: LocationInfo;
  /** Optional list of locations with Google Maps links */
  locations?: LocationInfo[];
  /** WhatsApp configuration */
  whatsapp: WhatsAppConfig;
  /** Floating contact widget configuration */
  floatingContact: FloatingContactConfig;
}

/**
 * Social media link configuration
 */
export interface SocialMediaLink {
  /** Unique identifier for the platform */
  id: string;
  /** Platform display name */
  name: string;
  /** Icon name (for lucide-react) */
  icon: string;
  /** URL to the social media profile */
  url: string;
  /** Whether this link is enabled */
  enabled: boolean;
}

/**
 * Hero section configuration
 */
export interface HeroConfig {
  /** Main heading text */
  title: string;
  /** Subtitle text */
  subtitle: string;
  /** Additional description */
  description: string;
  /** Call-to-action button text */
  ctaText: string;
  /** Call-to-action button link/anchor */
  ctaLink: string;
  /** Hero background images */
  images: {
    /** Desktop background image path */
    desktop: string;
    /** Mobile background image path */
    mobile: string;
  };
}

/**
 * About section feature
 */
export interface AboutFeature {
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
}

/**
 * About section configuration
 */
export interface AboutConfig {
  /** Primary call-to-action URL */
  ctaLink: string;
  /** Primary call-to-action label */
  ctaText: string;
  /** Section description */
  description: string;
  /** Array of features */
  features: AboutFeature[];
  /** About section image path */
  image: string;
  /** Section title */
  title: string;
}

/**
 * Main admin/site configuration
 */
export interface AdminConfig {
  /** Site configuration */
  site: SiteConfig;
  /** SEO configuration */
  seo: SEOConfig;
  /** Theme configuration */
  theme: ThemeConfig;
  /** Contact information */
  contact: ContactConfig;
  /** Social media links */
  socialMedia: SocialMediaLink[];
  /** Hero section configuration */
  hero: HeroConfig;
  /** About section configuration */
  about: AboutConfig;
}

/**
 * Administrative settings (security, session management)
 */
export interface AdminSettings {
  /** Access PIN for admin panel */
  pin: string;
  /** Session timeout in milliseconds */
  sessionTimeout: number;
}
