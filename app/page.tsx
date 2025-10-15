import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Header } from "@/components/header"
import HeroSlider from "@/components/hero-slider"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Crown, Sparkles } from "lucide-react"

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
        <HeroSlider />
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

        {/* Luxury Showcase Section */}
        <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
          <div className="container mx-auto px-6 text-center">
            <div className="flex items-center justify-center mb-8">
              <Crown className="w-12 h-12 text-yellow-400 mr-4" />
              <h2 className="font-serif text-4xl md:text-5xl font-bold">
                Premium Collections
              </h2>
            </div>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Discover our exclusive range of luxury hair care products. 
              Professional-grade formulations for the ultimate hair transformation experience.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gradient-to-br from-purple-600/20 to-indigo-800/20 p-8 rounded-lg border border-purple-500/30">
                <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">AB Collection</h3>
                <p className="text-gray-300 text-sm">Advanced Bonding Technology</p>
              </div>
              <div className="bg-gradient-to-br from-blue-600/20 to-cyan-800/20 p-8 rounded-lg border border-blue-500/30">
                <Crown className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">KG GREEN</h3>
                <p className="text-gray-300 text-sm">Natural & Organic Care</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-600/20 to-amber-800/20 p-8 rounded-lg border border-yellow-500/30">
                <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">XL Collection</h3>
                <p className="text-gray-300 text-sm">Extra Long Keratin & Silk</p>
              </div>
            </div>
            <Link href="/showcase">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold px-8 py-4 text-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Explore All Collections
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
