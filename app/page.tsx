import { Suspense } from "react"
import dynamic from "next/dynamic"
import HeroSlider from "@/components/hero-slider"
import { Footer } from "@/components/footer"
import { BenefitsSection } from "@/components/benefits-section"
import { PartnersSection } from "@/components/partners-section"
import { WhyUsSection } from "@/components/why-us-section"
import { FeaturedCategories } from "@/components/featured-categories"
import { GlobalPresenceSection } from "@/components/global-presence-section"
import { ScrollAnimate } from "@/components/scroll-animate"

// Lazy load components for better performance
const BestSellers = dynamic(() => import("@/components/best-sellers").then(mod => ({ default: mod.BestSellers })), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
})

const ProductCategories = dynamic(() => import("@/components/product-categories").then(mod => ({ default: mod.ProductCategories })), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
})

export default function HomePage() {
  return (
    <div className="min-h-screen page-fade">
      <main>
        {/* Hero Slider Section */}
        <HeroSlider />

        {/* Benefits Section */}
        <ScrollAnimate animation="fade-in-up-scale" delay={100}>
          <BenefitsSection />
        </ScrollAnimate>

        {/* Best Sellers Section */}
        <ScrollAnimate animation="card-entrance" delay={200}>
          <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg" />}>
            <BestSellers />
          </Suspense>
        </ScrollAnimate>

        {/* Featured Categories Section */}
        <ScrollAnimate animation="slide-in-top" delay={150}>
          <FeaturedCategories />
        </ScrollAnimate>

        {/* Product Categories Section */}
        <ScrollAnimate animation="fade-in-up-scale" delay={250}>
          <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg" />}>
            <ProductCategories />
          </Suspense>
        </ScrollAnimate>

        {/* Partners Section */}
        <ScrollAnimate animation="zoom-in-blur" delay={200}>
          <PartnersSection />
        </ScrollAnimate>

        {/* Global Presence Section */}
        <ScrollAnimate animation="rotate-fade-in" delay={300}>
          <GlobalPresenceSection />
        </ScrollAnimate>

        {/* Why Us Section */}
        <ScrollAnimate animation="bounce-in-subtle" delay={250}>
          <WhyUsSection />
        </ScrollAnimate>
      </main>
      <ScrollAnimate animation="fade-in" delay={400}>
        <Footer />
      </ScrollAnimate>
    </div>
  )
}
