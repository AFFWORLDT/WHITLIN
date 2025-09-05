import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ProductCategories } from "@/components/product-categories"
import { BestSellers } from "@/components/best-sellers"
import { BrandStory } from "@/components/brand-story"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ProductCategories />
        <BestSellers />
        <BrandStory />
      </main>
      <Footer />
    </div>
  )
}
