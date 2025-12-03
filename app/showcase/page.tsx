import { Footer } from "@/components/footer"
import HeroSlider from "@/components/hero-slider"
import { LuxuryShowcase } from "@/components/luxury-showcase"

export default function ShowcasePage() {
  return (
    <div className="min-h-screen page-transition">
      <main>
        {/* Hero Slider Section - Same as Homepage */}
        <HeroSlider />
        
        {/* Luxury Showcase Content */}
        <LuxuryShowcase />
      </main>
      <Footer />
    </div>
  )
}
