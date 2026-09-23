import { Suspense } from "react";
import localFont from "next/font/local";
import "./globals.css";
import SessionProviderWrapper from "./providers/SessionProviderWrapper";

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

export const metadata = {
  title: "KidsPortal — Fun, Safe Learning for Grades 1-10",
  description: "KidsPortal is an interactive learning platform for grades 1-10, with an AI tutor, gamified lessons, real progress analytics, and a distraction-free, ad-free experience built for kids.",
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
