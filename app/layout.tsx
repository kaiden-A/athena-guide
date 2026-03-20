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

// 1. Enhanced Metadata for Athena
export const metadata: Metadata = {
  title: {
    default: "Athena - Motion-U Public AI Guide",
    template: "%s | Motion-U",
  },
  description: "Your intelligent guide to navigating the Motion-U ecosystem.",
  keywords: ["AI", "Motion-U", "Athena", "Learning Guide", "Intelligence"]
};

// 2. Separate Viewport Configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a", // Matches your 'athena-charcoal'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // Added 'scroll-smooth' and font variables
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col selection:bg-sky-500/30">
        {children}
      </body>
    </html>
  );
}