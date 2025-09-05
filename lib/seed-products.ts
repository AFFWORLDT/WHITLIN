import connectDB from './mongodb'
import Product from './models/Product'
import Category from './models/Category'

const sampleProducts = [
  {
    name: "Post-Treatment Shampoo DD",
    price: 45,
    originalPrice: 55,
    description: "Keratin & Hyaluronic Acid - Sulfate Free",
    longDescription: "Professional post-treatment shampoo enriched with keratin and hyaluronic acid. Sulfate-free formula that gently cleanses while maintaining the integrity of your hair treatment. Perfect for maintaining salon-quality results at home.",
    images: ["/images/post-treatment.jpeg"],
    category: null, // Will be set to Post-Treatment category
    attributes: [
      { name: "Size", value: "1000ml" },
      { name: "Color", value: "Red" },
      { name: "Weight", value: "1.2kg" },
      { name: "SKU", value: "PT-SH-1000" }
    ],
    isActive: true,
    isBestSeller: true
  },
  {
    name: "Expert-Liss Mask XL",
    price: 65,
    description: "Keratin & Silk Protein - Anti-Frizz",
    longDescription: "Intensive anti-frizz mask with keratin and silk protein. Ideal for dry, unruly hair that's difficult to straighten. Nourishes and restores damaged hair while providing long-lasting smoothness.",
    images: ["/images/expert-liss-system.jpeg"],
    category: null, // Will be set to Expert-Liss category
    attributes: [
      { name: "Size", value: "500ml" },
      { name: "Color", value: "Magenta" },
      { name: "Weight", value: "0.8kg" },
      { name: "SKU", value: "EL-MK-500" }
    ],
    isActive: true,
    isBestSeller: true
  },
  {
    name: "Regenerating Serum AB",
    price: 38,
    description: "Keratin & Garlic Extract - Damage Repair",
    longDescription: "Regenerating serum with keratin and garlic extract. Perfect for treated, straightened, and damaged hair. Protects and brightens dull hair, giving it a healthy and vibrant appearance.",
    images: ["/images/regenerating-system.jpeg"],
    category: null, // Will be set to Regenerating category
    attributes: [
      { name: "Size", value: "100ml" },
      { name: "Color", value: "Gold" },
      { name: "Weight", value: "0.3kg" },
      { name: "SKU", value: "RG-SR-100" }
    ],
    isActive: true,
    isBestSeller: false
  },
  {
    name: "Nourishing Mask BC",
    price: 52,
    description: "Keratin & Coconut Oil - Deep Hydration",
    longDescription: "Nourishing mask with keratin and coconut oil. Perfect for dry, dull, and curly hair. Gently cleanses and nourishes while preserving shine, softness, and natural hydration levels.",
    images: ["/images/nourishing-system.jpeg"],
    category: null, // Will be set to Nourishing category
    attributes: [
      { name: "Size", value: "1000ml" },
      { name: "Color", value: "Light Gold" },
      { name: "Weight", value: "1.1kg" },
      { name: "SKU", value: "NO-MK-1000" }
    ],
    isActive: true,
    isBestSeller: true
  }
]

async function seedProducts() {
  try {
    await connectDB()
    console.log('Connected to MongoDB')

    // Get categories
    const categories = await Category.find({})
    console.log(`Found ${categories.length} categories`)

    if (categories.length === 0) {
      console.log('No categories found. Please run seed-categories first.')
      return
    }

    // Clear existing products
    await Product.deleteMany({})
    console.log('Cleared existing products')

    // Create products with proper category references
    for (const productData of sampleProducts) {
      // Find matching category
      let categoryId = null
      
      if (productData.name.includes('Post-Treatment')) {
        const category = categories.find(c => c.name.includes('Post-Treatment'))
        categoryId = category?._id
      } else if (productData.name.includes('Expert-Liss')) {
        const category = categories.find(c => c.name.includes('Expert-Liss'))
        categoryId = category?._id
      } else if (productData.name.includes('Regenerating')) {
        const category = categories.find(c => c.name.includes('Regenerating'))
        categoryId = category?._id
      } else if (productData.name.includes('Nourishing')) {
        const category = categories.find(c => c.name.includes('Nourishing'))
        categoryId = category?._id
      }

      if (!categoryId) {
        // Use first category as fallback
        categoryId = categories[0]._id
      }

      // Extract SKU from attributes
      const skuAttribute = productData.attributes.find(attr => attr.name === 'SKU')
      const sku = skuAttribute?.value || `PROD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      const product = new Product({
        ...productData,
        category: categoryId,
        sku: sku,
        image: productData.images[0] || '/placeholder.svg',
        rating: 4.8,
        reviews: Math.floor(Math.random() * 200) + 50,
        inStock: true,
        isNewProduct: false,
        stock: Math.floor(Math.random() * 100) + 10,
        status: 'active'
      })

      await product.save()
      console.log(`Created product: ${product.name}`)
    }

    console.log('Products seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding products:', error)
    process.exit(1)
  }
}

seedProducts()
