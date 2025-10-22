import { Suspense } from "react"
import dynamic from "next/dynamic"
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

        {/* Premium Collections Section - Light Theme - Mobile Optimized */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50">
          <div className="container mx-auto px-3 sm:px-4 md:px-6 text-center">
            <div className="flex items-center justify-center mb-6 sm:mb-8">
              <Crown className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-amber-500 mr-3 sm:mr-4 drop-shadow-sm" />
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
                Premium Collections
              </h2>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover our exclusive range of luxury hair care products. 
              Professional-grade formulations for the ultimate hair transformation experience.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
              <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-800">AB Collection</h3>
                <p className="text-gray-600 text-sm">Advanced Bonding Technology</p>
              </div>
              <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Crown className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-800">KG GREEN</h3>
                <p className="text-gray-600 text-sm">Natural & Organic Care</p>
              </div>
              <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-amber-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 sm:col-span-2 lg:col-span-1">
                <div className="bg-gradient-to-br from-amber-100 to-amber-200 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Crown className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-amber-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-800">XL Collection</h3>
                <p className="text-gray-600 text-sm">Extra Long Keratin & Silk</p>
              </div>
            </div>
            <Link href="/showcase">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
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
