import { Suspense } from "react"
import dynamic from "next/dynamic"
import HeroSlider from "@/components/hero-slider"
import { Footer } from "@/components/footer"
import { BenefitsSection } from "@/components/benefits-section"
import { PartnersSection } from "@/components/partners-section"
import { WhyUsSection } from "@/components/why-us-section"
import { FeaturedCategories } from "@/components/featured-categories"
import { GlobalPresenceSection } from "@/components/global-presence-section"

// Lazy load components for better performance
const BestSellers = dynamic(() => import("@/components/best-sellers").then(mod => ({ default: mod.BestSellers })), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
})

const ProductCategories = dynamic(() => import("@/components/product-categories").then(mod => ({ default: mod.ProductCategories })), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
})

export default function HomePage() {
  return (
    <div className="min-h-screen page-transition">
      <main>
        {/* Hero Slider Section */}
        <HeroSlider />

        {/* Benefits Section */}
        <BenefitsSection />

        {/* Best Sellers Section */}
        <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg" />}>
          <BestSellers />
        </Suspense>

        {/* Featured Categories Section */}
        <FeaturedCategories />

        {/* Product Categories Section */}
        <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg" />}>
          <ProductCategories />
        </Suspense>

        {/* Partners Section */}
        <PartnersSection />

        {/* Global Presence Section */}
        <GlobalPresenceSection />

        {/* Why Us Section */}
        <WhyUsSection />
      </main>
      <Footer />
    </div>
  )
}
