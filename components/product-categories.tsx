"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Loader2 } from "lucide-react"

interface Category {
  _id: string
  name: string
  description: string
  slug: string
  image?: string
  isActive: boolean
  createdAt: string
}

const colorGradients = [
  "from-red-600 to-red-800",
  "from-pink-500 to-rose-600", 
  "from-purple-600 to-violet-700",
  "from-purple-600 to-pink-600",
  "from-yellow-600 to-amber-700",
  "from-amber-600 to-yellow-700",
  "from-gray-800 to-black",
  "from-teal-500 to-cyan-600"
]

const defaultImages = [
  "/images/post-treatment.jpeg",
  "/images/inforcer-range.jpeg", 
  "/images/no-yellow-range.jpeg",
  "/images/expert-liss-range.jpeg",
  "/images/regenerating-range.jpeg",
  "/images/nourishing-range.jpeg",
  "/images/restructuring-range.jpeg",
  "/images/repair-range.jpeg"
]

export function ProductCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories?active=true')
        const data = await response.json()
        
        if (data.success) {
          setCategories(data.data)
        } else {
          setError(data.error || 'Failed to fetch categories')
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError('An unexpected error occurred while fetching categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const getCategoryColor = (index: number) => {
    return colorGradients[index % colorGradients.length]
  }

  const getCategoryImage = (category: Category, index: number) => {
    return category.image || defaultImages[index % defaultImages.length] || "/placeholder.svg"
  }

  const getCategoryCode = (category: Category) => {
    // Generate a code from the category name
    const words = category.name.split(' ')
    if (words.length >= 2) {
      return words.map(word => word.charAt(0)).join('').toUpperCase()
    }
    return category.name.substring(0, 2).toUpperCase()
  }

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

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center text-destructive py-10">
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 border border-destructive rounded-md hover:bg-destructive/10">
              Retry
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            <p>No categories available at the moment.</p>
            <p className="text-sm">Check back soon for our latest product ranges!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {categories.map((category, index) => (
              <Link key={category._id} href={`/products?category=${category.slug}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-border/50 overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={getCategoryImage(category, index)}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${getCategoryColor(index)} opacity-20 group-hover:opacity-30 transition-opacity`}
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="font-bold text-sm text-gray-800">{getCategoryCode(category)}</span>
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
        )}
      </div>
    </section>
  )
}
