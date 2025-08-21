import type { Metadata } from "next";
import { Fredoka, Inter } from "next/font/google";
import "./globals.css";
import { ServiceWorkerInitializer } from "@/components/ServiceWorkerInitializer";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

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

export const metadata: Metadata = {
  title: {
    default: "HYPEYA - Tech News & Innovation",
    template: "%s | HYPEYA"
  },
  description: "Stay updated with the latest in technology, AI, and innovation. Discover cutting-edge articles, insights, and trends shaping the future.",
  keywords: ["technology", "AI", "innovation", "tech news", "artificial intelligence", "startup", "digital transformation"],
  authors: [{ name: "HYPEYA Team" }],
  creator: "HYPEYA",
  publisher: "HYPEYA",
  metadataBase: new URL("https://hypeya.xyz"),
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://hypeya.xyz",
    title: "HYPEYA - Tech News & Innovation",
    description: "Stay updated with the latest in technology, AI, and innovation",
    siteName: "HYPEYA",
    images: [
      {
        url: "/images/hypeya-logo.png",
        width: 1200,
        height: 630,
        alt: "HYPEYA - Tech News & Innovation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HYPEYA - Noticias y Innovación Tech", 
    description: "Mantente al día con lo último en tecnología, IA e innovación",
    images: ["/images/hypeya-logo.png"],
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
    icon: "/icon-192x192.png",
    apple: "/icon-192x192.png",
    shortcut: "/icon-192x192.png",
  },
  category: "technology",
};

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
          {children}
          <ServiceWorkerInitializer />
        </ErrorBoundary>
      </body>
    </html>
  );
}
