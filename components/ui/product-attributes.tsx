"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, X } from "lucide-react"
import { toast } from "sonner"

interface ProductAttribute {
  name: string
  value: string
  type: 'color' | 'size' | 'text' | 'number'
}

interface CategoryAttribute {
  name: string
  type: 'color' | 'size' | 'text' | 'number' | 'select'
  options?: string[]
  required: boolean
}

interface ProductAttributesProps {
  categoryId?: string
  attributes: ProductAttribute[]
  onChange: (attributes: ProductAttribute[]) => void
  disabled?: boolean
}

export function ProductAttributes({
  categoryId,
  attributes,
  onChange,
  disabled = false
}: ProductAttributesProps) {
  const [categoryAttributes, setCategoryAttributes] = useState<CategoryAttribute[]>([])
  const [loading, setLoading] = useState(false)

  const fetchCategoryAttributes = async (categoryId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/categories/${categoryId}`)
      const data = await response.json()
      
      if (data.success) {
        setCategoryAttributes(data.data.attributes || [])
      }
    } catch (error) {
      console.error('Error fetching category attributes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (categoryId) {
      fetchCategoryAttributes(categoryId)
    } else {
      setCategoryAttributes([])
    }
  }, [categoryId])

  const addAttribute = () => {
    const newAttribute: ProductAttribute = {
      name: '',
      value: '',
      type: 'text'
    }
    onChange([...attributes, newAttribute])
  }

  const removeAttribute = (index: number) => {
    const newAttributes = attributes.filter((_, i) => i !== index)
    onChange(newAttributes)
  }

  const updateAttribute = (index: number, field: keyof ProductAttribute, value: string) => {
    const newAttributes = [...attributes]
    newAttributes[index] = {
      ...newAttributes[index],
      [field]: value
    }
    onChange(newAttributes)
  }

  const getAttributeOptions = (attributeName: string) => {
    const categoryAttr = categoryAttributes.find(attr => attr.name === attributeName)
    return categoryAttr?.options || []
  }

  const getAttributeType = (attributeName: string) => {
    const categoryAttr = categoryAttributes.find(attr => attr.name === attributeName)
    return categoryAttr?.type || 'text'
  }

  const isAttributeRequired = (attributeName: string) => {
    const categoryAttr = categoryAttributes.find(attr => attr.name === attributeName)
    return categoryAttr?.required || false
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Attributes</CardTitle>
        <CardDescription>
          Add specific attributes like colors, sizes, or other properties
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {categoryAttributes.length > 0 && (
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Category Attributes:</h4>
            <div className="flex flex-wrap gap-2">
              {categoryAttributes.map((attr, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                >
                  {attr.name} ({attr.type})
                  {attr.required && <span className="text-red-500 ml-1">*</span>}
                </span>
              ))}
            </div>
          </div>
        )}

        {attributes.map((attribute, index) => (
          <div key={index} className="flex items-end space-x-2 p-3 border rounded-lg">
            <div className="flex-1 space-y-2">
              <div>
                <Label>Attribute Name</Label>
                <Input
                  value={attribute.name}
                  onChange={(e) => updateAttribute(index, 'name', e.target.value)}
                  placeholder="e.g., Color, Size, Material"
                  disabled={disabled}
                />
              </div>
              
              <div>
                <Label>
                  Value
                  {isAttributeRequired(attribute.name) && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>
                {getAttributeType(attribute.name) === 'select' ? (
                  <Select
                    value={attribute.value}
                    onValueChange={(value) => updateAttribute(index, 'value', value)}
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select value" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAttributeOptions(attribute.name).map((option, optionIndex) => (
                        <SelectItem key={optionIndex} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : getAttributeType(attribute.name) === 'color' ? (
                  <div className="flex space-x-2">
                    <Input
                      value={attribute.value}
                      onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                      placeholder="#000000 or color name"
                      disabled={disabled}
                      className="flex-1"
                    />
                    <div
                      className="w-10 h-10 border rounded"
                      style={{ backgroundColor: attribute.value || '#f0f0f0' }}
                    />
                  </div>
                ) : (
                  <Input
                    value={attribute.value}
                    onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                    placeholder="Enter value"
                    disabled={disabled}
                    type={getAttributeType(attribute.name) === 'number' ? 'number' : 'text'}
                  />
                )}
              </div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeAttribute(index)}
              disabled={disabled}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addAttribute}
          disabled={disabled}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Attribute
        </Button>

        {attributes.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No attributes added yet.</p>
            <p className="text-sm">Click "Add Attribute" to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
