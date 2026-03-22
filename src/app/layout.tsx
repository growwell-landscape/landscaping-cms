import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Landscaping CMS",
  description: "Landscaping content management system",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const languageFromHeader = (await headers()).get("x-site-lang");
  const htmlLanguage = (languageFromHeader || "en").trim().toLowerCase() || "en";

  return (
    <html lang={htmlLanguage}>
      <body suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
