"use client"

import Head from 'next/head'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  structuredData?: any
}

export function SEOOptimizer({
  title = "KeraGold Pro - Professional Hair Care",
  description = "Luxury professional hair care products with keratin and hyaluronic acid. Transform your hair with our premium treatment systems.",
  keywords = ["hair care", "keratin", "professional", "luxury", "beauty"],
  image = "/images/keragold-hero.png",
  url = "https://keragold-uae.com",
  type = "website",
  structuredData
}: SEOProps) {
  const fullTitle = title.includes("KeraGold") ? title : `${title} | KeraGold Pro`
  
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="KeraGold Pro" />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="KeraGold Pro" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    </Head>
  )
}

// Structured data generators
export const generateProductStructuredData = (product: any) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "image": product.images,
  "brand": {
    "@type": "Brand",
    "name": "KeraGold Pro"
  },
  "offers": {
    "@type": "Offer",
    "price": product.price,
    "priceCurrency": "AED",
    "availability": product.isActive ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
  }
})

export const generateOrganizationStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "KeraGold Pro",
  "url": "https://keragold-uae.com",
  "logo": "https://keragold-uae.com/images/logonew.png",
  "description": "Professional hair care products with keratin and hyaluronic acid",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+971-45-754-785",
    "contactType": "customer service"
  }
})
