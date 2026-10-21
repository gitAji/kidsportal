import { Suspense } from "react";
import localFont from "next/font/local";
import "./globals.css";
import SessionProviderWrapper from "./providers/SessionProviderWrapper";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const DEFAULT_TITLE = "KidsPortal — Fun, Safe Learning for Grades 1-10";
const DEFAULT_DESCRIPTION = "KidsPortal is an interactive learning platform for grades 1-10, with an AI tutor, gamified lessons, real progress analytics, and a distraction-free, ad-free experience built for kids.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    images: [{ url: "/logo.png", width: 500, height: 500, alt: SITE_NAME }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/logo.png"],
  },
};

import { UIProvider } from "./providers/UIProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <SessionProviderWrapper>
          <UIProvider>{children}</UIProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
