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

const siteUrl = "https://ryandea.me";
const siteName = "Ryan Deame | Full-Stack Developer";
const siteDescription = "Full-stack developer transforming ideas into powerful, production-ready solutions. Specializing in web apps, automation, and data dashboards. Clean code. Fast delivery. Real business results.";

export const metadata: Metadata = {
  // Basic metadata
  title: siteName,
  description: siteDescription,

  // Favicon
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
    shortcut: "/icon.png",
  },

  // Open Graph - Facebook, WhatsApp, LinkedIn, Messenger, Discord, etc.
  openGraph: {
    type: "website",
    url: siteUrl,
    title: siteName,
    description: siteDescription,
    siteName: "Ryan Deame",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Ryan Deame - Full-Stack Developer",
      },
    ],
    locale: "en_US",
  },

  // Twitter Card - Twitter/X
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: [`${siteUrl}/og-image.png`],
    creator: "@ryandea_me", // Update this with your Twitter handle if you have one
  },

  // Additional metadata
  keywords: ["full-stack developer", "web development", "automation", "data dashboards", "React", "Next.js", "freelance developer"],
  authors: [{ name: "Ryan Deame" }],
  creator: "Ryan Deame",
  publisher: "Ryan Deame",

  // Robots
  robots: {
    index: true,
    follow: true,
  },

  // Canonical URL
  metadataBase: new URL(siteUrl),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
