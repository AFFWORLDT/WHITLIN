import connectDB from './mongodb'
import Category from './models/Category'

const seedCategories = async () => {
  try {
    await connectDB()
    console.log('Connected to MongoDB')

    // Clear existing categories
    await Category.deleteMany({})
    console.log('Cleared existing categories')

    // Seed Categories
    const categories = [
      {
        name: "Treatment Systems",
        description: "Professional hair treatment systems for salon-quality results",
        isActive: true,
        sortOrder: 1,
        attributes: [
          {
            name: "Treatment Type",
            type: "select",
            options: ["Keratin", "Straightening", "Smoothing", "Rebonding"],
            required: true
          },
          {
            name: "Duration",
            type: "text",
            required: true
          },
          {
            name: "Hair Type",
            type: "select",
            options: ["All Hair Types", "Fine Hair", "Thick Hair", "Curly Hair", "Damaged Hair"],
            required: true
          }
        ]
      },
      {
        name: "Hair Care",
        description: "Daily hair care products for maintenance and styling",
        isActive: true,
        sortOrder: 2,
        attributes: [
          {
            name: "Product Type",
            type: "select",
            options: ["Shampoo", "Conditioner", "Serum", "Mask", "Oil"],
            required: true
          },
          {
            name: "Hair Concern",
            type: "select",
            options: ["Damage Repair", "Moisture", "Volume", "Smoothness", "Color Protection"],
            required: true
          },
          {
            name: "Size",
            type: "select",
            options: ["50ml", "100ml", "250ml", "500ml", "1L"],
            required: true
          }
        ]
      },
      {
        name: "Professional Products",
        description: "Professional-grade products for salon use",
        isActive: true,
        sortOrder: 3,
        attributes: [
          {
            name: "Professional Grade",
            type: "select",
            options: ["Salon Only", "Professional", "Semi-Professional"],
            required: true
          },
          {
            name: "Application Method",
            type: "select",
            options: ["Brush", "Spray", "Cream", "Gel", "Lotion"],
            required: true
          }
        ]
      },
      {
        name: "Accessories",
        description: "Hair care accessories and tools",
        isActive: true,
        sortOrder: 4,
        attributes: [
          {
            name: "Accessory Type",
            type: "select",
            options: ["Brush", "Comb", "Cap", "Gloves", "Bowl", "Applicator"],
            required: true
          },
          {
            name: "Material",
            type: "select",
            options: ["Plastic", "Metal", "Wood", "Silicone", "Ceramic"],
            required: true
          }
        ]
      },
      {
        name: "Maintenance",
        description: "Post-treatment maintenance products",
        isActive: true,
        sortOrder: 5,
        attributes: [
          {
            name: "Maintenance Type",
            type: "select",
            options: ["Daily Care", "Weekly Treatment", "Monthly Deep Care"],
            required: true
          },
          {
            name: "Frequency",
            type: "text",
            required: true
          }
        ]
      }
    ]

    // Save categories individually to trigger pre-save hooks
    for (const categoryData of categories) {
      const category = new Category(categoryData)
      await category.save()
    }
    console.log('Seeded categories')

    console.log('Categories seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding categories:', error)
    process.exit(1)
  }
}

seedCategories()
