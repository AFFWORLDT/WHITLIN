import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LuxuryShowcase } from "@/components/luxury-showcase"

export default function ShowcasePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <LuxuryShowcase />
      <Footer />
    </div>
  )
}
