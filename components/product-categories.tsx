import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

const categories = [
  {
    name: "Post-Treatment Range",
    description: "Keratin & Hyaluronic Acid - Sulfate Free",
    href: "/products/post-treatment",
    image: "/images/post-treatment.jpeg",
    color: "from-red-600 to-red-800",
    code: "DD",
  },
  {
    name: "Inforcer Range",
    description: "Hyaluronic Acid & Biotin - Sulfate Free",
    href: "/products/inforcer",
    image: "/images/inforcer-range.jpeg",
    color: "from-pink-500 to-rose-600",
    code: "FB",
  },
  {
    name: "No Yellow Range",
    description: "Keratin Silver Protect - Sulfate Free",
    href: "/products/no-yellow",
    image: "/images/no-yellow-range.jpeg",
    color: "from-purple-600 to-violet-700",
    code: "SV",
  },
  {
    name: "Expert Liss Range",
    description: "Keratin & Silk Protein - Sulfate Free",
    href: "/products/expert-liss",
    image: "/images/expert-liss-range.jpeg",
    color: "from-purple-600 to-pink-600",
    code: "XL",
  },
  {
    name: "Regenerating Range",
    description: "Keratin & Garlic Extract - Sulfate Free",
    href: "/products/regenerating",
    image: "/images/regenerating-range.jpeg",
    color: "from-yellow-600 to-amber-700",
    code: "AB",
  },
  {
    name: "Nourishing Range",
    description: "Keratin & Coconut Oil - Sulfate Free",
    href: "/products/nourishing",
    image: "/images/nourishing-range.jpeg",
    color: "from-amber-600 to-yellow-700",
    code: "BC",
  },
  {
    name: "Restructuring Range",
    description: "Keratin & Castor Oil - Sulfate Free",
    href: "/products/restructuring",
    image: "/images/restructuring-range.jpeg",
    color: "from-gray-800 to-black",
    code: "CC",
  },
  {
    name: "Repair Range",
    description: "Hyaluronic Acid & Amla Oil",
    href: "/products/repair",
    image: "/images/repair-range.jpeg",
    color: "from-teal-500 to-cyan-600",
    code: "AC",
  },
]

export function ProductCategories() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-balance">Professional Hair Care Range</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Discover our complete collection of sulfate-free professional treatments, each designed for specific hair
            needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {categories.map((category) => (
            <Link key={category.name} href={category.href}>
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-border/50 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-20 group-hover:opacity-30 transition-opacity`}
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="font-bold text-sm text-gray-800">{category.code}</span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-semibold mb-2 group-hover:text-primary transition-colors text-balance">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground text-sm text-pretty leading-relaxed">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
