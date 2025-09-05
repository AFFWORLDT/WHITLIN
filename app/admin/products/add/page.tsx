"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { ImageUpload } from "@/components/ui/image-upload"
import { ProductAttributes } from "@/components/ui/product-attributes"

interface Category {
  _id: string
  name: string
  slug: string
  attributes: any[]
}

interface ProductAttribute {
  name: string
  value: string
  type: 'color' | 'size' | 'text' | 'number'
}

export default function AddProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState("")
  const [attributes, setAttributes] = useState<ProductAttribute[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    sku: "",
    image: "",
    isBestSeller: false,
    isNewProduct: false,
    rating: "4.5"
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?active=true')
      const data = await response.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const generateSKU = () => {
    const selectedCategory = categories.find(cat => cat._id === selectedCategoryId)
    const categoryPrefix = selectedCategory 
      ? selectedCategory.name.replace(/\s+/g, '').substring(0, 3).toUpperCase()
      : 'GEN'
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    const sku = `KG-${categoryPrefix}-${randomNum}`
    setFormData(prev => ({ ...prev, sku }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.price || !formData.category || !formData.stock) {
      toast.error("Please fill in all required fields")
      return
    }

    if (!formData.sku) {
      generateSKU()
    }

    setLoading(true)

    try {
      const selectedCategory = categories.find(cat => cat._id === selectedCategoryId)
      const productData = {
        ...formData,
        category: selectedCategory?.name || formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        rating: parseFloat(formData.rating),
        status: "active",
        attributes: attributes.filter(attr => attr.name && attr.value)
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Product added successfully!")
        router.push('/admin/products')
      } else {
        toast.error(data.error || "Failed to add product")
      }
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error("Error adding product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground">Create a new product for your store</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Product Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>
                  Basic information about the product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => handleInputChange('sku', e.target.value)}
                        placeholder="Auto-generated"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={generateSKU}
                        disabled={!formData.category}
                      >
                        Generate
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter product description"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => handleInputChange('stock', e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating</Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => handleInputChange('rating', e.target.value)}
                      placeholder="4.5"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={selectedCategoryId}
                    onChange={(e) => {
                      setSelectedCategoryId(e.target.value)
                      const selectedCategory = categories.find(cat => cat._id === e.target.value)
                      handleInputChange('category', selectedCategory?.name || '')
                    }}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Product Image</Label>
                  <ImageUpload
                    value={formData.image}
                    onChange={(url) => handleInputChange('image', url)}
                    onRemove={() => handleInputChange('image', '')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Product Attributes */}
            <ProductAttributes
              categoryId={selectedCategoryId}
              attributes={attributes}
              onChange={setAttributes}
            />
          </div>

          {/* Product Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Settings</CardTitle>
                <CardDescription>
                  Configure product visibility and features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Best Seller</Label>
                    <p className="text-sm text-muted-foreground">
                      Mark as best selling product
                    </p>
                  </div>
                  <Switch
                    checked={formData.isBestSeller}
                    onCheckedChange={(checked) => handleInputChange('isBestSeller', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Product</Label>
                    <p className="text-sm text-muted-foreground">
                      Mark as new arrival
                    </p>
                  </div>
                  <Switch
                    checked={formData.isNewProduct}
                    onCheckedChange={(checked) => handleInputChange('isNewProduct', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  How your product will appear
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="w-full h-32 bg-muted rounded-md flex items-center justify-center">
                    {formData.image ? (
                      <img 
                        src={formData.image} 
                        alt="Product preview"
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-muted-foreground">No image</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {formData.name || "Product Name"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {formData.category || "Category"}
                    </p>
                    <p className="font-bold">
                      ${formData.price || "0.00"}
                    </p>
                    <div className="flex space-x-2 mt-2">
                      {formData.isBestSeller && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                          Best Seller
                        </span>
                      )}
                      {formData.isNewProduct && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Add Product
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
