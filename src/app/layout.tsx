import type { Metadata } from "next";
import { Fredoka, Inter } from "next/font/google";
import "./globals.css";
import { ServiceWorkerInitializer } from "@/components/ServiceWorkerInitializer";
import { MiniKitInitializer } from "@/components/MiniKitInitializer";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import DynamicWeb3Providers from "@/components/providers/DynamicWeb3Providers";
import Header from "@/components/layout/Header";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL || "https://hypeya-miniapp.vercel.app";
  const projectName = process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "HYPEYA";

  return {
    title: {
      default: `${projectName} - Web3 Content Platform`,
      template: `%s | ${projectName}`
    },
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Web3 Content Platform",
    keywords: ["web3", "crypto", "content", "creators", "Base", "blockchain", "minikit"],
    authors: [{ name: "HYPEYA Team" }],
    creator: "HYPEYA",
    publisher: "HYPEYA",
    metadataBase: new globalThis.URL(URL),
    openGraph: {
      type: "website",
      locale: "en_US",
      url: URL,
      title: process.env.NEXT_PUBLIC_APP_OG_TITLE || `${projectName} - Web3 Content Platform`,
      description: process.env.NEXT_PUBLIC_APP_OG_DESCRIPTION || "Web3 Content Platform",
      siteName: projectName,
      images: process.env.NEXT_PUBLIC_APP_OG_IMAGE ? [
        {
          url: process.env.NEXT_PUBLIC_APP_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${projectName} - Web3 Content Platform`,
        },
      ] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: process.env.NEXT_PUBLIC_APP_OG_TITLE || `${projectName} - Web3 Content Platform`,
      description: process.env.NEXT_PUBLIC_APP_OG_DESCRIPTION || "Web3 Content Platform",
      images: process.env.NEXT_PUBLIC_APP_OG_IMAGE ? [process.env.NEXT_PUBLIC_APP_OG_IMAGE] : [],
    },
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
    manifest: "/manifest.json",
    icons: {
      icon: process.env.NEXT_PUBLIC_APP_ICON || "/favicon.ico",
      apple: process.env.NEXT_PUBLIC_APP_ICON || "/favicon.ico",
      shortcut: process.env.NEXT_PUBLIC_APP_ICON || "/favicon.ico",
    },
    category: "social",
    // Frame metadata for rich embeds and MiniKit integration
    other: process.env.NEXT_PUBLIC_APP_HERO_IMAGE ? {
      'fc:frame': JSON.stringify({
        version: 'next',
        imageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE,
        button: {
          title: `Launch ${projectName}`,
          action: {
            type: 'launch_frame',
            name: projectName,
            url: URL,
            splashImageUrl: process.env.NEXT_PUBLIC_APP_SPLASH_IMAGE || process.env.NEXT_PUBLIC_APP_HERO_IMAGE,
            splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || "#000000",
          },
        },
      }),
    } : {},
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${fredoka.variable} ${inter.variable} antialiased`}
      >
        {/* Enlace para saltar la navegación */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-hypeya-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
          aria-label="Saltar al contenido principal"
        >
          Saltar al contenido principal
        </a>

        <ErrorBoundary>
          <DynamicWeb3Providers>
            <MiniKitInitializer />
            <Header />
            {children}
            <ServiceWorkerInitializer />
          </DynamicWeb3Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
