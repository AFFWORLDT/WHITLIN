"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Star, ShoppingCart, Filter, Grid, List, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"
import { Footer } from "@/components/footer"
import { Loading, ProductSkeleton } from "@/components/ui/loading"
import { UniversalProductGridImage } from "@/components/ui/universal-image"
import { emergencyImageFix } from "@/lib/emergency-image-fix"
import { fixCloudinaryImages } from "@/lib/cloudinary-image-fix"
import { ScrollAnimate } from "@/components/scroll-animate"

interface Product {
  _id: string
  name: string
  price: number
  originalPrice?: number
  description: string
  images: string[]
  sku: string
  category: {
    name: string
  }
  attributes: Array<{
    name: string
    value: string
  }>
  isActive: boolean
  createdAt: string
}

interface Category {
  _id: string
  name: string
  slug: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const { addItem } = useCart()

  // Fetch products and categories
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      params.append('sort', sortBy)
      params.append('page', currentPage.toString())
      params.append('limit', itemsPerPage.toString())

      // Add noCache parameter to bypass cache for fresh data
      params.append('noCache', 'true')
      
      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch(`/api/products?${params.toString()}`),
        fetch('/api/categories?active=true')
      ])

      const productsData = await productsResponse.json()
      const categoriesData = await categoriesResponse.json()

      if (productsData.success) {
        setProducts(productsData.data)
        setTotalProducts(productsData.total || 0)
        setTotalPages(productsData.pages || Math.ceil((productsData.total || 0) / itemsPerPage))
      } else {
        setError(productsData.error || 'Failed to fetch products')
      }

      if (categoriesData.success) {
        setCategories(categoriesData.data)
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('An unexpected error occurred while fetching data')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, selectedCategory, sortBy, currentPage, itemsPerPage])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Apply image fixes when products are loaded
  useEffect(() => {
    if (products.length > 0) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        emergencyImageFix()
        fixCloudinaryImages()
      }, 100)
    }
  }, [products])

  const handleAddToCart = useCallback((product: Product) => {
    const size = product.attributes?.find(attr => attr.name.toLowerCase() === 'size')?.value || 'Standard'
    
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "/placeholder.svg",
      size: size,
      range: product.category?.name || 'General',
    })
    
    toast.success(`${product.name} added to cart!`)
  }, [addItem])

  const getProductSize = useCallback((product: Product) => {
    return product.attributes?.find(attr => attr.name.toLowerCase() === 'size')?.value || 'Standard'
  }, [])

  const getProductBadge = useCallback((product: Product) => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return "Sale"
    }
    if (product.isNewProduct) {
      return "New"
    }
    if (product.isBestSeller) {
      return "Best Seller"
    }
    return null
  }, [])

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset to first page when searching
  }, [])

  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value)
    setCurrentPage(1) // Reset to first page when changing category
  }, [])

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value)
    setCurrentPage(1) // Reset to first page when changing sort
  }, [])

  const handleItemsPerPageChange = useCallback((value: string) => {
    setItemsPerPage(parseInt(value))
    setCurrentPage(1) // Reset to first page when changing items per page
  }, [])

  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }, [totalPages])

  const handleJumpToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }, [totalPages])

  const getVisiblePages = useCallback(() => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }, [currentPage, totalPages])

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-destructive mb-3 sm:mb-4">Error Loading Products</h1>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 px-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="text-sm sm:text-base">Retry</Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen page-fade">
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <ScrollAnimate animation="fade-in-up-scale" delay={100}>
          <div className="mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4">All Products</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Discover our complete range of premium hospitality linen products
            </p>
          </div>
        </ScrollAnimate>

        {/* Filters and Search */}
        <ScrollAnimate animation="slide-in-top" delay={200}>
          <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="w-full">
            <div className="relative">
              <Input
                placeholder="Search by name, description, or SKU..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 sm:pl-10 h-10 sm:h-11 text-sm sm:text-base"
              />
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full sm:w-auto sm:flex-1 px-3 py-2 h-10 sm:h-11 border border-input bg-background rounded-md text-sm sm:text-base"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full sm:w-auto sm:flex-1 px-3 py-2 h-10 sm:h-11 border border-input bg-background rounded-md text-sm sm:text-base"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
            
            <div className="flex border border-input rounded-md w-full sm:w-auto">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="flex-1 sm:flex-none h-10 sm:h-11"
              >
                <Grid className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Grid</span>
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="flex-1 sm:flex-none h-10 sm:h-11"
              >
                <List className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">List</span>
              </Button>
            </div>
          </div>
          </div>
        </ScrollAnimate>

        {/* Products Grid/List */}
        {products.length === 0 ? (
          <div className="text-center py-8 sm:py-12 md:py-16">
            <p className="text-muted-foreground text-base sm:text-lg mb-2">No products found</p>
            <p className="text-muted-foreground text-sm sm:text-base">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className={
              viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6"
                : "space-y-3 sm:space-y-4"
            }>
              {products.map((product, index) => (
                <ScrollAnimate 
                  key={product._id} 
                  animation="card-entrance" 
                  delay={index * 50}
                >
                  <Card className="group hover-lift hover-shadow-premium smooth-color-transition overflow-hidden border-border/50">
                  <Link href={`/products/${product._id}`}>
                     <div className="relative aspect-square overflow-hidden cursor-pointer bg-[#fafafa]" data-product-image={product.images?.[0]}>
                       {product.images && product.images.length > 0 ? (
                         <UniversalProductGridImage
                           src={product.images[0]}
                           alt={product.name}
                           className="group-hover:scale-105 transition-transform duration-500"
                           index={index}
                         />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center bg-[#fafafa]">
                           <div className="text-center">
                             <div className="text-2xl sm:text-4xl text-[#737373] mb-1 sm:mb-2">📦</div>
                             <p className="text-[#737373] text-xs sm:text-sm">No image</p>
                           </div>
                         </div>
                       )}
                      <Badge className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#e1d7c6] text-[#171717] text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 font-semibold">
                        {getProductBadge(product)}
                      </Badge>
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-[#929292]/90 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs font-medium">
                        {getProductSize(product)}
                      </div>
                    </div>
                  </Link>

                  <CardContent className="p-3 sm:p-4 md:p-6">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 sm:h-4 sm:w-4 ${
                            i < 4 ? "fill-primary text-primary" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                      <span className="text-xs sm:text-sm text-muted-foreground ml-1">(4.8)</span>
                    </div>

                    <Link href={`/products/${product._id}`}>
                      <h3 className="font-serif text-base sm:text-lg font-semibold mb-1 text-balance hover:text-[#e1d7c6] transition-colors cursor-pointer line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-[#e1d7c6] font-medium mb-1">{product.category.name} Range</p>
                    <p className="text-xs text-muted-foreground mb-1">SKU: {product.sku || 'N/A'}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 text-pretty line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                      <div className="flex items-center gap-2">
                        <span className="text-lg sm:text-xl font-bold">AED {product.price}</span>
                        {product.originalPrice && (
                          <span className="text-xs sm:text-sm text-muted-foreground line-through">AED {product.originalPrice}</span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="bg-[#e1d7c6] hover:bg-[#d4c7b3] text-[#171717] w-full sm:w-auto text-xs sm:text-sm font-semibold button-press smooth-color-transition"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="hidden sm:inline">Add to Cart</span>
                        <span className="sm:hidden">Add</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                </ScrollAnimate>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <ScrollAnimate animation="fade-in" delay={300}>
                <div className="mt-6 sm:mt-8 space-y-4">
                {/* Page Info and Items Per Page - Mobile */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
                  </div>

                  {/* Items Per Page */}
                  <div className="flex items-center space-x-2">
                    <span className="text-xs sm:text-sm text-muted-foreground">Items per page:</span>
                    <select
                      value={itemsPerPage.toString()}
                      onChange={(e) => handleItemsPerPageChange(e.target.value)}
                      className="px-2 py-1 h-8 sm:h-9 border border-input bg-background rounded text-xs sm:text-sm"
                    >
                      <option value="12">12</option>
                      <option value="24">24</option>
                      <option value="48">48</option>
                      <option value="96">96</option>
                    </select>
                  </div>
                </div>

                {/* Pagination Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center space-x-1 sm:space-x-2 w-full sm:w-auto justify-center">
                    {/* First Page */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                    >
                      <ChevronsLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>

                    {/* Previous Page */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                    >
                      <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1 overflow-x-auto max-w-[200px] sm:max-w-none">
                      {getVisiblePages().map((page, index) => (
                        page === '...' ? (
                          <span key={index} className="px-1 sm:px-2 py-1 text-xs sm:text-sm text-muted-foreground">...</span>
                        ) : (
                          <Button
                            key={index}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page as number)}
                            className={`h-8 w-8 sm:h-9 sm:w-9 p-0 text-xs sm:text-sm ${currentPage === page ? "bg-primary text-white" : ""}`}
                          >
                            {page}
                          </Button>
                        )
                      ))}
                    </div>

                    {/* Next Page */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                    >
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>

                    {/* Last Page */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                    >
                      <ChevronsRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>

                  {/* Jump to Page */}
                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-end">
                    <span className="text-xs sm:text-sm text-muted-foreground">Go to:</span>
                    <Input
                      type="number"
                      min="1"
                      max={totalPages}
                      placeholder="Page"
                      className="w-16 sm:w-20 h-8 sm:h-9 text-xs sm:text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const page = parseInt((e.target as HTMLInputElement).value)
                          if (page >= 1 && page <= totalPages) {
                            handleJumpToPage(page)
                            ;(e.target as HTMLInputElement).value = ''
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              </ScrollAnimate>
            )}
          </>
        )}
      </main>

      <ScrollAnimate animation="fade-in" delay={400}>
        <Footer />
      </ScrollAnimate>
    </div>
  )
}