"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { ScrollAnimate } from "@/components/scroll-animate"

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

  // Fetch categories from API with retry logic
  useEffect(() => {
    const fetchCategories = async (retries = 5) => {
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          setLoading(true)
          setError(null)
          
          // Add timestamp to bypass cache
          const response = await fetch(`/api/categories?active=true&t=${Date.now()}`)
          
          if (!response.ok) {
            // Try to get error message from response
            let errorMessage = `HTTP error! status: ${response.status}`
            try {
              const errorData = await response.json()
              errorMessage = errorData.error || errorMessage
            } catch {
              // If response is not JSON, use default message
            }
            
            // If it's a database connection error and we have retries left, retry
            if ((errorMessage.includes('database') || errorMessage.includes('connection') || response.status === 500) && attempt < retries - 1) {
              const delay = 1000 * Math.pow(2, attempt)
              console.warn(`Categories fetch failed (attempt ${attempt + 1}/${retries}), retrying in ${delay}ms...`)
              await new Promise(resolve => setTimeout(resolve, delay))
              continue
            }
            
            throw new Error(errorMessage)
          }
          
          const data = await response.json()
          
          if (data.success) {
            setCategories(data.data || [])
            setError(null)
            setLoading(false)
            return
          } else {
            setError(data.error || 'Failed to fetch categories')
            setLoading(false)
            return
          }
        } catch (err) {
          console.error('Error fetching categories:', err)
          const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred while fetching categories'
          
          // If it's a database connection error and we have retries left, retry
          if ((errorMessage.includes('database') || errorMessage.includes('connection') || errorMessage.includes('SSL') || errorMessage.includes('TLS')) && attempt < retries - 1) {
            const delay = 1000 * Math.pow(2, attempt)
            console.warn(`Categories fetch failed (attempt ${attempt + 1}/${retries}), retrying in ${delay}ms...`)
            await new Promise(resolve => setTimeout(resolve, delay))
            continue
          }
          
          // Provide user-friendly error message
          if (errorMessage.includes('database') || errorMessage.includes('connection') || errorMessage.includes('SSL') || errorMessage.includes('TLS')) {
            setError('Unable to connect to the database. Please try again in a moment.')
          } else if (errorMessage.includes('HTTP error') || errorMessage.includes('status: 500')) {
            setError('Server error occurred. Please try again later.')
          } else {
            setError(errorMessage)
          }
          
          // Set loading to false even on error so the component can render
          setLoading(false)
          
          // If this was the last attempt, stop retrying
          if (attempt === retries - 1) {
            return
          }
        }
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
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.02),transparent_70%)]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <ScrollAnimate animation="fade-in-up">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block mb-4">
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">Complete Range</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Our Product Collections
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our complete range of premium hospitality linen, from bed linen to bath linen, each designed for luxury and comfort
            </p>
          </div>
        </ScrollAnimate>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground text-sm">Loading categories...</p>
          </div>
        ) : error ? (
          <div className="text-center text-destructive py-10">
            <p className="mb-4">{error}</p>
            <button 
              onClick={() => {
                setLoading(true)
                setError(null)
                const fetchCategories = async () => {
                  try {
                    const response = await fetch(`/api/categories?active=true&t=${Date.now()}`)
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
                    const data = await response.json()
                    if (data.success) {
                      setCategories(data.data || [])
                      setError(null)
                    } else {
                      setError(data.error || 'Failed to fetch categories')
                    }
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Failed to fetch categories')
                  } finally {
                    setLoading(false)
                  }
                }
                fetchCategories()
              }} 
              className="mt-4 px-4 py-2 border border-destructive rounded-md hover:bg-destructive/10 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            <p>No categories available at the moment.</p>
            <p className="text-sm mb-4">Check back soon for our latest product ranges!</p>
            <button 
              onClick={() => {
                setLoading(true)
                const fetchCategories = async () => {
                  try {
                    const response = await fetch(`/api/categories?active=true&t=${Date.now()}`)
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
                    const data = await response.json()
                    if (data.success) {
                      setCategories(data.data || [])
                    }
                  } catch (err) {
                    console.error('Error fetching categories:', err)
                  } finally {
                    setLoading(false)
                  }
                }
                fetchCategories()
              }}
              className="px-4 py-2 border border-muted-foreground rounded-md hover:bg-muted transition-colors"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            {categories.map((category, index) => (
              <ScrollAnimate 
                key={category._id}
                animation="scale-in"
                delay={index * 100}
              >
                <Link href={`/products?category=${category.slug}`}>
                  <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-border/50 overflow-hidden hover-lift rounded-2xl bg-white h-full">
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={getCategoryImage(category, index)}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-125 transition-transform duration-1000 ease-out"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-t ${getCategoryColor(index)} opacity-30 group-hover:opacity-50 transition-opacity duration-700`}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-700" />
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/50 group-hover:scale-110 transition-transform duration-300">
                        <span className="font-bold text-sm text-gray-800">{getCategoryCode(category)}</span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <CardContent className="p-6 bg-white">
                      <h3 className="font-serif text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors text-balance">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-sm md:text-base text-pretty leading-relaxed line-clamp-3">{category.description}</p>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <span className="text-xs text-primary font-semibold uppercase tracking-wider group-hover:tracking-widest transition-all duration-300">
                          Explore Collection →
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </ScrollAnimate>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
