import type { Metadata } from "next";
import { Changa, IBM_Plex_Sans_Arabic } from "next/font/google";

import { AppChrome } from "@/components/app-chrome";
import { siteConfig } from "@/data/site";
import "./globals.css";

const changa = Changa({
  subsets: ["arabic", "latin"],
  variable: "--font-changa",
  weight: ["500", "600", "700"],
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  variable: "--font-ibm-plex-sans-arabic",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "Cyvero",
    "الأمن السيبراني",
    "التوعية السيبرانية",
    "التهديدات الرقمية",
    "الاستجابة الأولية",
    "تحليل الحالة",
    "الحماية الرقمية",
  ],
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    type: "website",
    locale: "ar_SA",
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${changa.variable} ${ibmPlexSansArabic.variable} font-body`}>
        <a href="#main-content" className="skip-link">
          الانتقال إلى المحتوى الرئيسي
        </a>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
