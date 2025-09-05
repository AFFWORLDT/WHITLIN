"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Loader2,
  MoreHorizontal
} from "lucide-react"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  isActive: boolean
  sortOrder: number
  attributes: {
    name: string
    type: 'color' | 'size' | 'text' | 'number' | 'select'
    options?: string[]
    required?: boolean
  }[]
  createdAt: string
  updatedAt: string
}

export default function CategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/categories')
      const data = await response.json()
      
      if (data.success) {
        setCategories(data.data)
        setFilteredCategories(data.data)
      } else {
        toast.error("Failed to fetch categories")
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error("Error fetching categories")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCategories(filtered)
  }, [searchTerm, categories])

  const handleDelete = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Category deleted successfully")
        fetchCategories()
      } else {
        toast.error(data.error || "Failed to delete category")
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error("Error deleting category")
    }
  }

  const toggleStatus = async (categoryId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`Category ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
        fetchCategories()
      } else {
        toast.error(data.error || "Failed to update category")
      }
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error("Error updating category")
    }
  }

  const stats = {
    total: categories.length,
    active: categories.filter(cat => cat.isActive).length,
    inactive: categories.filter(cat => !cat.isActive).length,
    withAttributes: categories.filter(cat => cat.attributes.length > 0).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Manage your product categories</p>
        </div>
        <Button onClick={() => router.push('/admin/categories/add')} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Attributes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.withAttributes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>Category List</CardTitle>
          <CardDescription>
            Showing {filteredCategories.length} of {categories.length} categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading categories...
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No categories found</p>
              <Button onClick={() => router.push('/admin/categories/add')}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Category
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCategories.map((category) => (
                <div key={category._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      {category.image ? (
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-muted-foreground text-lg font-bold">
                          {category.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {category.description || "No description"}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={category.isActive ? "default" : "secondary"}>
                          {category.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">
                          {category.attributes.length} attributes
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Sort: {category.sortOrder}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/admin/categories/${category._id}`)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/admin/categories/${category._id}/edit`)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleStatus(category._id, category.isActive)}>
                          {category.isActive ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(category._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
