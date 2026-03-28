export interface AdminGuideSection {
  title: string;
  description: string;
  items: string[];
  subSections?: {
    title: string;
    items: string[];
  }[];
}

export interface AdminGuideNotice {
  title: string;
  description: string;
  githubSteps: string[];
  vercelSteps: string[];
  webhookInfoSteps: string[];
  finalStep: string;
  reason: string;
}

export const ADMIN_GUIDE_SECTIONS: AdminGuideSection[] = [
  {
    title: "Site configuration",
    description: "This is the main dashboard area for overall website content and settings.",
    items: [],
    subSections: [
      {
        title: "Site Settings",
        items: ["Business name", "Logo", "General business details"],
      },
      {
        title: "SEO Settings",
        items: ["Page titles", "Meta descriptions", "Keywords", "Favicon", "Social preview image"],
      },
      {
        title: "Homepage About",
        items: ["About content used on the home page"],
      },
      {
        title: "About Page",
        items: ["About page hero", "Introduction", "Mission and vision", "CTA and page content"],
      },
      {
        title: "Team",
        items: ["Team members", "Roles", "Profile images", "Descriptions"],
      },
      {
        title: "Testimonials",
        items: ["Customer quotes", "Names", "Locations", "Ratings if configured"],
      },
      {
        title: "Contact Details",
        items: ["Phone", "Email", "Address", "WhatsApp", "Locations", "Map links", "Floating contact widget"],
      },
      {
        title: "Hero Section",
        items: ["Main banner text", "Buttons", "Highlights", "Hero images if configured"],
      },
      {
        title: "Theme Settings",
        items: ["Colors", "Fonts", "Visual styling", "Custom CSS where supported"],
      },
      {
        title: "Other Settings",
        items: ["Social media links", "Additional dashboard-managed settings"],
      },
    ],
  },
  {
    title: "Services",
    description: "Use the Services area to manage what the business offers on the website.",
    items: [
      "Add new services or remove old services",
      "Edit service titles, descriptions, highlights, ordering, and images",
      "Update details shown on the services listing page and each service detail page",
    ],
  },
  {
    title: "Projects",
    description: "Use the Projects area to keep the portfolio current on the website.",
    items: [
      "Add new projects and archive or delete old ones",
      "Update project names, descriptions, categories, results, and gallery images",
      "Control which portfolio items appear on the public website",
    ],
  },
  {
    title: "Translations",
    description: "The dashboard can also manage text for multiple languages when enabled.",
    items: [
      "Update labels and shared website text for each active language",
      "Add supported languages from the admin dashboard settings",
      "Keep translated content aligned with the default language content",
    ],
  },
];

export const ADMIN_GUIDE_WORKFLOW: string[] = [
  "Open the CMS admin dashboard and sign in with the provided password.",
  "Choose the section you want to update from the left sidebar.",
  "Edit the content fields directly in the dashboard form.",
  "Save the current file or queue multiple files for a global save.",
  "Review the published result on the live website after saving.",
];

export const ADMIN_GUIDE_NOTES: string[] = [
  "The admin dashboard is meant for content, media, contact details, SEO, and visual settings that were built into the CMS.",
  "Structural code changes, brand-new page templates, or feature development still need a developer.",
  "Use the dashboard carefully and confirm major content edits before publishing.",
];

export const ADMIN_TOKEN_RENEWAL_NOTICE: AdminGuideNotice = {
  title: "Annual GitHub token renewal",
  description:
    "After 365 days, GitHub may send an email saying the access token used by the CMS has expired or is about to expire.",
  githubSteps: [
    "GitHub > Profile picture > Settings > Developer settings > Personal access tokens > Tokens (classic) or Fine-grained tokens.",
    "Create a new token with the same repository access used for CMS publishing.",
    "Copy the new token value immediately after generation.",
    "GitHub repository > Settings > Secrets and variables > Actions is only relevant if a separate GitHub Actions or webhook-based deployment setup also stores this token there. For normal CMS token renewal, this is just additional information and usually does not need any change.",
  ],
  vercelSteps: [
    "Vercel > Project > Settings > Environment Variables.",
    "Find the `GITHUB_TOKEN` environment variable and replace the old value with the new token.",
    "Save the change for the required environments, then redeploy if Vercel asks for it.",
  ],
  webhookInfoSteps: [
    "Vercel > Project > Settings > Git.",
    "Open the Deploy Hooks section and create a new hook only if a fresh webhook URL is ever needed for auto-build setup.",
    "Copy the new webhook URL and update it only in the system that triggers builds automatically.",
    "This is only for information. In normal token renewal, this usually does not need any change.",
  ],
  finalStep:
    "Open the admin dashboard and test one small publish to confirm the renewed token is working correctly.",
  reason:
    "We do this because the live admin dashboard publishes content through the GitHub API. Once the token expires, the dashboard can no longer read or publish repository-backed content until the secret is replaced.",
};
