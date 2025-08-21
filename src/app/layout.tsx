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
  title: "Hypeya - Tech News & Articles",
  description: "Stay updated with the latest in technology, AI, and innovation",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fredoka.variable} ${inter.variable} antialiased`}
      >
        {/* Skip Navigation Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-hypeya-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
        >
          Skip to main content
        </a>
        
        <ErrorBoundary>
          {children}
          <ServiceWorkerInitializer />
        </ErrorBoundary>
      </body>
    </html>
  );
}
