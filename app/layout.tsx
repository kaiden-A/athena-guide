import type { Metadata, Viewport } from "next";
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

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://athena-guide.motion-u.com";

// 1. Enhanced Metadata for Athena — full SEO coverage
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Athena — Motion-U AI Guide",
    template: "%s | Motion-U Athena",
  },
  description:
    "Athena is your intelligent AI guide to the Motion-U ecosystem. Ask questions, explore building blocks, and navigate Motion-U with confidence.",
  keywords: [
    "Motion-U",
    "Athena AI",
    "AI guide",
    "intelligent assistant",
    "Motion-U ecosystem",
    "learning guide",
    "AI chatbot",
    "developer tools",
  ],
  authors: [{ name: "Motion-U" }],
  creator: "Motion-U",
  publisher: "Motion-U",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Motion-U Athena",
    title: "Athena — Motion-U AI Guide",
    description:
      "Your intelligent AI guide to the Motion-U ecosystem. Ask questions and navigate with confidence.",
    url: BASE_URL,
    images: [
      {
        url: "/og-image.png", // Create or replace with your actual OG image
        width: 1200,
        height: 630,
        alt: "Athena — Motion-U AI Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@motion_u",
    creator: "@motion_u",
    title: "Athena — Motion-U AI Guide",
    description:
      "Your intelligent AI guide to the Motion-U ecosystem. Ask anything.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "any", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: { url: "/icon.png", sizes: "180x180", type: "image/png" },
  },
  manifest: "/manifest.json",
  category: "technology",
  classification: "AI Guide & Assistant",
};

// 2. Separate Viewport Configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    { media: "(prefers-color-scheme: light)", color: "#0f172a" },
  ],
};

// 3. JSON-LD Structured Data (injected into <head>)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Athena — Motion-U AI Guide",
  url: BASE_URL,
  description:
    "Athena is your intelligent AI guide to the Motion-U ecosystem.",
  publisher: {
    "@type": "Organization",
    name: "Motion-U",
    url: "https://motion-u.com",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Microsoft Clarity / Google Analytics placeholder — add your tags here */}
      </head>
      <body className="min-h-full flex flex-col selection:bg-sky-500/30">
        {children}
      </body>
    </html>
  );
}
