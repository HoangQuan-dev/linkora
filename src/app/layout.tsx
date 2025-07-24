import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Linkora - Link-in-Bio Page Builder",
  description: "Create beautiful, customizable link-in-bio pages to showcase all your links in one place. Perfect for creators, businesses, and anyone who wants to share multiple links from a single URL.",
  keywords: ["link in bio", "link tree", "bio links", "social media links", "creator tools"],
  authors: [{ name: "Linkora" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  openGraph: {
    title: "Linkora - Link-in-Bio Page Builder",
    description: "Create beautiful, customizable link-in-bio pages to showcase all your links in one place.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Linkora - Link-in-Bio Page Builder",
    description: "Create beautiful, customizable link-in-bio pages to showcase all your links in one place.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
        {children}
      </body>
    </html>
  );
}
