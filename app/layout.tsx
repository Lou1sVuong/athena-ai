import type { Metadata } from "next";
import localFont from "next/font/local";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";

import Providers from "@/providers";
import { Toaster } from "@/components/ui/toaster";
import TopLoader from "@/components/top-loader";

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

export const metadata: Metadata = {
  title: "Athena",
  description: "Athena AI 2024",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <TopLoader />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
