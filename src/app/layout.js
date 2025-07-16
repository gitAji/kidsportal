// app/layout.js
import localFont from "next/font/local";
import "./globals.css";
import SessionProviderWrapper from "./providers/SessionProviderWrapper";
import ClientLayoutWrapper from "../app/components/ClientLayoutWrapper"; // 👈 create this

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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProviderWrapper>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
