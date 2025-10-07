import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"

// Lazy load components for better performance
const ProductCategories = dynamic(() => import("@/components/product-categories").then(mod => ({ default: mod.ProductCategories })), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
})

const BestSellers = dynamic(() => import("@/components/best-sellers").then(mod => ({ default: mod.BestSellers })), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
})

const BrandStory = dynamic(() => import("@/components/brand-story").then(mod => ({ default: mod.BrandStory })), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
})

const InTheSpotlight = dynamic(() => import("@/components/in-the-spotlight").then(mod => ({ default: mod.InTheSpotlight })), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
})

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
          <InTheSpotlight />
        </Suspense>
        <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg" />}>
          <ProductCategories />
        </Suspense>
        <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg" />}>
          <BestSellers />
        </Suspense>
        <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg" />}>
          <BrandStory />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
