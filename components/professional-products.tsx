import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ProfessionalProducts() {
  const professionalProducts = [
    {
      id: 1,
      name: "Oxidizing Cream Premium",
      description: "Essential for hair colorings with keratin and hyaluronic acid. Available in 20V, 30V, and 40V.",
      image: "/images/oxidizing-cream.jpeg",
      category: "Coloring",
      badge: "Premium",
      price: "€24.99",
      sizes: ["300ml", "1000ml"],
    },
    {
      id: 2,
      name: "Bleaching Powder Premium",
      description: "Blue dust-free bleaching powder that lightens up to 7 shades on natural hair.",
      image: "/images/bleaching-powder.jpeg",
      category: "Bleaching",
      badge: "Premium",
      price: "€32.99",
      sizes: ["500gr", "24x35gr"],
    },
    {
      id: 3,
      name: "Keratin Straightening Kit",
      description: "Complete 3-step keratin straightening system for professional salon results.",
      image: "/images/keratin-straightening.jpeg",
      category: "Straightening",
      badge: "Professional",
      price: "€89.99",
      sizes: ["360ml Kit"],
    },
    {
      id: 4,
      name: "KG Green Revitalizing",
      description: "Vegan keratin with aloe vera and banana. Deeply nourishes and restores vitality to dull hair.",
      image: "/images/kg-green-revitalizing.jpeg",
      category: "Vegan Care",
      badge: "New",
      price: "€19.99",
      sizes: ["500ml", "100ml", "200ml"],
    },
    {
      id: 5,
      name: "KG Green Nutrition",
      description: "Vegan formula with avocado and shea butter for very dry and frizzy hair.",
      image: "/images/kg-green-nutrition.jpeg",
      category: "Vegan Care",
      badge: "New",
      price: "€19.99",
      sizes: ["500ml", "100ml", "200ml"],
    },
    {
      id: 6,
      name: "Professional Accessories",
      description: "Whitlin bags and detangling brushes for professional hairstyling.",
      image: "/images/merchandising.jpeg",
      category: "Accessories",
      badge: "Essential",
      price: "€12.99",
      sizes: ["Various"],
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Professional Products</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete your salon with our professional coloring, bleaching, and styling essentials
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {professionalProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge
                  className={`absolute top-4 left-4 ${
                    product.badge === "Premium"
                      ? "bg-red-600"
                      : product.badge === "New"
                        ? "bg-green-600"
                        : product.badge === "Professional"
                          ? "bg-purple-600"
                          : "bg-amber-600"
                  }`}
                >
                  {product.badge}
                </Badge>
              </div>

              <CardContent className="p-6">
                <div className="mb-2">
                  <span className="text-sm font-medium text-amber-600 uppercase tracking-wide">{product.category}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{product.name}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{product.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-gray-900">{product.price}</span>
                  <div className="text-sm text-gray-500">{product.sizes.join(" • ")}</div>
                </div>

                <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition-all duration-300">
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
