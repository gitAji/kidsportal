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
  title: "Kids Learning Portal",
  description: "A platform for kids to learn and explore",
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
