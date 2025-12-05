import { Footer } from "@/components/footer"
import HeroSlider from "@/components/hero-slider"
import { LuxuryShowcase } from "@/components/luxury-showcase"
import { ScrollAnimate } from "@/components/scroll-animate"

export default function ShowcasePage() {
  return (
    <div className="min-h-screen page-fade">
      <main>
        {/* Hero Slider Section - Same as Homepage */}
        <HeroSlider />
        
        {/* Luxury Showcase Content */}
        <ScrollAnimate animation="fade-in-up-scale" delay={200}>
          <LuxuryShowcase />
        </ScrollAnimate>
      </main>
      <ScrollAnimate animation="fade-in" delay={400}>
        <Footer />
      </ScrollAnimate>
    </div>
  )
}
