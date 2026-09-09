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
  title: "Tuneliva - Tunnels de Vente E-Commerce & Automatisation Marketing",
  description: "Plateforme tout-en-un pour entrepreneurs et créateurs e-commerce africains. Intégration Mobile Money FedaPay, blog automatisé IA et publication TikTok virale.",
  other: {
    "tiktok-developers-site-verification": "GfHlgQCvuu2QJ2Wyj2jsXenTkm1AE5yC",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="tiktok-developers-site-verification" content="GfHlgQCvuu2QJ2Wyj2jsXenTkm1AE5yC" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
