import type { Metadata } from "next";
import "./globals.css";
import SiteFooter from "@/components/SiteFooter";
import SiteBehaviors from "@/components/SiteBehaviors";

export const metadata: Metadata = {
  title: "SO Clinic",
  description:
    "SO Clinic — nutritional therapy for skin health, gut health, immunity, sleep, migraine and weight management.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="stylesheet" href="/wp.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
        />
      </head>
      <body suppressHydrationWarning>
        {children}
        <SiteFooter />
        <SiteBehaviors />
      </body>
    </html>
  );
}
