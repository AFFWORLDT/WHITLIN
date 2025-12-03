import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { CartProvider } from "@/lib/cart-context"
import { AuthProvider } from "@/lib/auth-context"
import { LayoutProvider } from "@/components/layout-provider"
import { LanguageProvider } from "@/components/language-provider"
import { Toaster } from "sonner"
import { PerformanceMonitor } from "@/components/performance-monitor"
import { ErrorBoundary } from "@/components/error-boundary"
import { MobileOptimizer } from "@/components/mobile-optimizer"
import { PerformanceDashboard } from "@/components/performance-dashboard"
import { ChunkErrorHandler } from "@/components/chunk-error-handler"
import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair-display",
})

export const metadata: Metadata = {
  title: {
    default: "Whitlin - Professional Hair Care",
    template: "%s | Whitlin"
  },
  description:
    "Luxury professional hair care products with keratin and hyaluronic acid. Transform your hair with our premium treatment systems.",
  keywords: ["hair care", "keratin", "professional", "luxury", "beauty", "hair treatment"],
  authors: [{ name: "Whitlin" }],
  creator: "Whitlin",
  publisher: "Whitlin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://whitlin.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://whitlin.com',
    title: 'Whitlin - Professional Hair Care',
    description: 'Luxury professional hair care products with keratin and hyaluronic acid.',
    siteName: 'Whitlin',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Whitlin - Professional Hair Care',
    description: 'Luxury professional hair care products with keratin and hyaluronic acid.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${playfairDisplay.variable}`}>
        <ChunkErrorHandler />
        <MobileOptimizer />
        <ErrorBoundary>
          <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <LayoutProvider>
                <Suspense fallback={null}>{children}</Suspense>
              </LayoutProvider>
            </CartProvider>
          </AuthProvider>
          </LanguageProvider>
        </ErrorBoundary>
        <Toaster position="top-right" />
        <Analytics />
        <PerformanceMonitor />
        <PerformanceDashboard />
      </body>
    </html>
  )
}
