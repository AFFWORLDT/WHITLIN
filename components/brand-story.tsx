import { Shield, Award, Sparkles, Heart } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Sulfate Free",
    description: "Gentle formulas that protect your hair",
  },
  {
    icon: Sparkles,
    title: "Keratin Enriched",
    description: "Professional-grade keratin treatments",
  },
  {
    icon: Award,
    title: "Hyaluronic Acid",
    description: "Deep hydration and moisture retention",
  },
  {
    icon: Heart,
    title: "Salon Quality",
    description: "Professional results at home",
  },
]

export function BrandStory() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-balance">
            Professional Hair Care Excellence
          </h2>
          <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
            Whitlin offers exclusive solutions and products for hair care and beauty. Our products are made to meet
            the needs of all professionals who work daily with creativity and passion to make every woman unique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground text-pretty">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
